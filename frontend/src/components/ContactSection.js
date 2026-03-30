import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! Our team will contact you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="container py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full bg-primary/5 blur-[150px] rounded-full"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Contact Info */}
        <div data-aos="fade-right">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight leading-tight">
            Institutional <span className="text-primary italic">Inquiry</span>
          </h2>
          <p className="text-text-muted text-lg mb-12 max-w-lg leading-relaxed">
            Direct access to CEMAC's most liquid crypto-to-XAF exchange house. Whether you're a high-volume trader or a first-time seller, our institutional desk provides <span className="text-white font-bold">guaranteed execution</span>.
          </p>
          
          <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase font-black tracking-widest">Verified Response &lt; 5 Minutes</span>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-center group">
              <div className="w-14 h-14 glass flex items-center justify-center text-primary border-primary/20 group-hover:border-primary transition-all">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Email Us</h4>
                <p className="text-text-muted">rosvelmelong@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-center group">
              <div className="w-14 h-14 glass flex items-center justify-center text-primary border-primary/20 group-hover:border-primary transition-all">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">WhatsApp Channel</h4>
                <p className="text-text-muted">Join for instant rate alerts</p>
              </div>
            </div>

            <div className="flex gap-6 items-center group">
              <div className="w-14 h-14 glass flex items-center justify-center text-primary border-primary/20 group-hover:border-primary transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Our Location</h4>
                <p className="text-text-muted">Bonapriso, Douala - Cameroon</p>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="https://wa.me/237676339620" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-bg-deep shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:scale-110 active:scale-95 transition-all relative group shadow-2xl animate-pulse-whatsapp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle" aria-hidden="true">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                  </svg>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-bg-deep flex items-center justify-center text-[10px] font-black text-white group-hover:animate-bounce shadow-xl">
                    1
                  </span>
                </button>
              </a>
              <span className="ml-4 text-xs font-black uppercase tracking-widest text-primary animate-pulse">Chat Directly with Me</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="glass p-8 md:p-12 border-white/5 relative group" data-aos="fade-left">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Full Name</label>
                <input 
                   type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 p-4 text-white focus:border-primary focus:bg-white/15 outline-none transition-all placeholder:text-white/60"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 p-4 text-white focus:border-primary focus:bg-white/15 outline-none transition-all placeholder:text-white/60"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Subject</label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-white/10 border border-white/20 p-4 text-white focus:border-primary focus:bg-white/15 outline-none transition-all placeholder:text-white/60"
                placeholder="How can we help?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Your Message</label>
              <textarea 
                rows="4" 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/10 border border-white/20 p-4 text-white focus:border-primary focus:bg-white/15 outline-none transition-all resize-none placeholder:text-white/60"
                placeholder="Describe your inquiry..."
              ></textarea>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className={`w-full py-6 bg-[#00ff88] text-black font-black text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-4 hover:bg-white transition-all duration-700 shadow-[0_0_30px_rgba(0,255,136,0.6)] relative overflow-hidden group ${isSubmitting ? "opacity-70 cursor-not-allowed" : "animate-pulse-whatsapp"}`}
            >
              <div className="absolute inset-0 bg-black/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center gap-4">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Syncing Message...
                  </>
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Send Message Now
                  </>
                )}
              </div>
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
