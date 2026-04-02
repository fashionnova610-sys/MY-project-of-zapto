import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { CONFIG } from '../utils/config';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${CONFIG.API_BASE}/admin/login`, {
                username,
                password
            });
            
            if (response.data.token) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', response.data.username);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Protocol Access Denied. Verify Credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-deep flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md glass p-10 border-white/10 relative z-10" data-aos="zoom-in">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 glass flex items-center justify-center mb-6 border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                        <Shield className="text-primary" size={40} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white">ZAPTO_CORE</h1>
                    <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-2">Admin Security Protocol v2.1</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Operator ID</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/8 border border-white/15 rounded-xl px-12 py-4 text-white font-bold text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
                                placeholder="ENTER OPERATOR ID"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Access Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/8 border border-white/15 rounded-xl px-12 py-4 text-white font-bold text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-white/40"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.12em] text-sm rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-3 disabled:opacity-40"
                    >
                        {loading ? 'AUTHENTICATING...' : (
                            <>
                                Initialize Session
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] text-text-muted font-bold tracking-[0.2em] uppercase">
                        Authorized Personnel Only<br />
                        © 2026 ZAPTOPAY SECURED TERMINAL
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
