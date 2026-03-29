import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, History, Lock, LogOut, ChevronRight, RefreshCw, CheckCircle, Info, Mail } from 'lucide-react';
import { CONFIG } from '../utils/config';

const AdminDashboard = () => {
    const [rates, setRates] = useState({ sell_rate: 0, buy_rate: 0 });
    const [contacts, setContacts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingTestimonials, setPendingTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    
    const token = localStorage.getItem('admin_token');

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [ratesRes, contactRes, transRes, testimonialsRes] = await Promise.all([
                axios.get(`${CONFIG.API_BASE}/rates/current?currency=USDT`),
                axios.get(`${CONFIG.API_BASE}/admin/contacts`, config),
                axios.get(`${CONFIG.API_BASE}/transactions?limit=10`),
                axios.get(`${CONFIG.API_BASE}/admin/testimonials/pending`, config)
            ]);
            
            setRates(ratesRes.data);
            setContacts(contactRes.data);
            setTransactions(transRes.data);
            setPendingTestimonials(testimonialsRes.data);
        } catch (err) {
            console.error("Dashboard error:", err);
            if (err.response?.status === 401) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) navigate('/admin/login');
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateMarketRates = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${CONFIG.API_BASE}/admin/rates`, {
                sell_rate: rates.sell_rate,
                buy_rate: rates.buy_rate,
                currency: "USDT"
            }, config);
            
            alert("RATES SYNCED TO PRODUCTION CLUSTER");
            fetchDashboardData();
        } catch (err) {
            alert("Protocol Update Failed: Check Admin Permissions");
        } finally {
            setUpdating(false);
        }
    };

    const approveTestimonial = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${CONFIG.API_BASE}/admin/testimonials/${id}/approve`, {}, config);
            fetchDashboardData();
        } catch (err) {
            alert("Approve Failed");
        }
    };

    const deleteTestimonial = async (id) => {
        if (!window.confirm("Delete this review forever?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${CONFIG.API_BASE}/admin/testimonials/${id}`, config);
            fetchDashboardData();
        } catch (err) {
            alert("Delete Failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    if (loading && rates.sell_rate === 0) return (
       <div className="min-h-screen bg-bg-deep flex items-center justify-center p-6">
           <div className="flex flex-col items-center gap-6">
                <RefreshCw className="text-primary animate-spin" size={48} />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Initializing Dashboard Protocol...</div>
           </div>
       </div>
    );

    return (
        <div className="min-h-screen bg-bg-deep text-white p-6 md:p-12 relative overflow-hidden font-header">
            {/* Nav Header */}
            <div className="flex justify-between items-center mb-16 relative z-10 glass p-6 border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass border-primary/20 flex items-center justify-center">
                        <Shield className="text-primary" size={24} />
                    </div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest">ZAPTO_DASHBOARD</div>
                        <div className="text-[9px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Operator: {localStorage.getItem('admin_user')} • Verified Session</div>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors uppercase font-black text-[10px] tracking-widest px-6 py-3 border border-white/5 hover:bg-red-500/10"
                >
                    <LogOut size={14} />
                    Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Rate Management Panel */}
                <div className="lg:col-span-1 space-y-8 h-full">
                    <div className="glass p-10 border-primary/20 h-full">
                        <div className="flex items-center gap-3 mb-10">
                            <TrendingUp className="text-primary" size={20} />
                            <h2 className="text-lg font-black uppercase tracking-widest">Global Rate Sync</h2>
                        </div>

                        <form onSubmit={updateMarketRates} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 opacity-70">Production Sell Rate (XAF)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        value={rates.sell_rate}
                                        onChange={(e) => setRates({...rates, sell_rate: parseFloat(e.target.value)})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-2xl font-black text-primary focus:outline-none focus:border-primary transition-all group-hover:bg-primary/5"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted uppercase">XAF/USDT</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 opacity-70">Production Buy Rate (XAF)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        value={rates.buy_rate}
                                        onChange={(e) => setRates({...rates, buy_rate: parseFloat(e.target.value)})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-2xl font-black text-white focus:outline-none focus:border-primary transition-all group-hover:bg-white/5"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted uppercase">XAF/USDT</div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={updating}
                                className="w-full py-6 bg-primary text-bg-deep font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-3"
                            >
                                {updating ? <RefreshCw className="animate-spin" size={18} /> : (
                                    <>
                                        Broadcast New Rates
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-xl">
                            <div className="flex gap-4">
                                <Info className="text-primary shrink-0" size={18} />
                                <div className="text-[10px] text-white/50 leading-relaxed font-bold uppercase tracking-widest">
                                    Updating these rates will immediately sync with the ZaptoBot and the frontend calculators for all global users.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transactions & Contacts */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Public Ledger Overview */}
                    <div className="glass p-10 border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <History className="text-secondary" size={20} />
                                <h2 className="text-lg font-black uppercase tracking-widest">Transaction Pipeline</h2>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Pipeline</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        <th className="py-4 px-2">TXID_HASH</th>
                                        <th className="py-4 px-2">VOLUME</th>
                                        <th className="py-4 px-2">STATUS</th>
                                        <th className="py-4 px-2">TIMESTAMP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-5 px-2 font-mono text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">
                                                ZAP_{tx.tx_hash ? tx.tx_hash.substring(0, 12) : "GEN_" + tx.id.substring(0, 8)}...
                                            </td>
                                            <td className="py-5 px-2">
                                                <div className="text-xs font-black">${tx.amount_usd.toLocaleString()}</div>
                                                <div className="text-[10px] text-text-muted uppercase font-bold mt-1">→ {tx.amount_xaf.toLocaleString()} XAF</div>
                                            </td>
                                            <td className="py-5 px-2">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary">
                                                    <CheckCircle size={10} />
                                                    {tx.status.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="py-5 px-2 text-[10px] font-bold text-text-muted">
                                                {new Date(tx.created_at).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Testimonial Moderation Pipeline */}
                    <div className="glass p-10 border-primary/10 bg-primary/[0.02]">
                        <div className="flex items-center gap-3 mb-10">
                            <CheckCircle className="text-primary" size={20} />
                            <h2 className="text-lg font-black uppercase tracking-widest">Testimonial Moderation</h2>
                        </div>

                        <div className="space-y-6">
                            {pendingTestimonials.length === 0 ? (
                                <div className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-30">ALL REVIEWS PROCESSED</div>
                            ) : pendingTestimonials.map((t, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all rounded-xl">
                                    <div className="w-12 h-12 glass border-white/10 flex items-center justify-center text-primary font-black shrink-0 rounded-full">
                                        {t.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white">{t.name}</h4>
                                                <p className="text-[10px] text-primary uppercase mt-1">{t.role || 'Verified User'}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => approveTestimonial(t.id)}
                                                    className="px-4 py-2 bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all rounded"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => deleteTestimonial(t.id)}
                                                    className="px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-text-muted leading-relaxed font-medium mt-4 group-hover:text-white transition-colors">"{t.content}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Inquiries (Contacts) */}
                    <div className="glass p-10 border-white/5">
                        <div className="flex items-center gap-3 mb-10">
                            <Mail className="text-primary" size={20} />
                            <h2 className="text-lg font-black uppercase tracking-widest">Operator Inquiries</h2>
                        </div>

                        <div className="space-y-6">
                            {contacts.length === 0 ? (
                                <div className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-30">NO ACTIVE INQUIRIES RECORDED</div>
                            ) : contacts.map((contact, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                                    <div className="w-12 h-12 glass border-white/10 flex items-center justify-center text-primary font-black shrink-0">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white">{contact.name}</h4>
                                                <p className="text-[10px] text-primary lowercase mt-1">{contact.email}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{new Date(contact.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-text-muted leading-relaxed font-medium mt-4 group-hover:text-white transition-colors">{contact.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full"></div>
            </div>
        </div>
    );
};

export default AdminDashboard;
