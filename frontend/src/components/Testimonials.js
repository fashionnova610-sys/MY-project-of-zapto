import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, Plus, MessageSquare, X, Check } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { initialTestimonials } from "../utils/testimonialData";
import { API_BASE_URL } from "../utils/config";

const TestimonialCard = ({ t }) => (
  <div className="glass p-6 border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col w-[350px] shrink-0 mx-3 group relative overflow-hidden">
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, index) => (
        <Star 
          key={index} 
          size={12} 
          className={index < (t?.rating || 5) ? "fill-primary text-primary" : "text-white/10"} 
        />
      ))}
    </div>
    <Quote className="text-primary/10 mb-3 absolute top-6 right-6" size={40} />
    <p className="text-white/70 text-sm mb-6 italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
      "{t?.content || "Excellent service!"}"
    </p>
    <div className="mt-auto">
      <h4 className="font-bold text-base text-text-main">{t?.name || "Anonymous User"}</h4>
      <p className="text-[10px] text-primary/70 uppercase tracking-widest font-black">{t?.role || "Verified User"}</p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
  </div>
);

const MarqueeRow = ({ items, direction = "left", speed = 120 }) => {
  if (!items || items.length === 0) return null;
  const duplicateItems = [...items, ...items, ...items];
  
  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div 
        className="flex shrink-0"
        animate={{ 
          x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"] 
        }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {duplicateItems.map((t, i) => (
          <TestimonialCard key={`${t?.name || "anon"}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const [allTestimonials, setAllTestimonials] = useState(initialTestimonials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", role: "Verified User", content: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge with initial ones but put new ones first
          setAllTestimonials((prev) => [...data, ...prev]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  const row1 = useMemo(() => allTestimonials.slice(0, Math.ceil(allTestimonials.length / 3)), [allTestimonials]);
  const row2 = useMemo(() => allTestimonials.slice(Math.ceil(allTestimonials.length / 3), Math.ceil(2 * allTestimonials.length / 3)), [allTestimonials]);
  const row3 = useMemo(() => allTestimonials.slice(Math.ceil(2 * allTestimonials.length / 3)), [allTestimonials]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.testimonial) {
          setAllTestimonials((prev) => [result.testimonial, ...prev]);
          toast.success("Thank you! Your review has been added to our wall of love.");
          setIsDialogOpen(false);
          setNewReview({ name: "", role: "Verified User", content: "", rating: 5 });
        }
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 relative bg-bg-deep overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.03)_0%,transparent_70%)]"></div>
      
      <div className="container relative z-10 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div data-aos="fade-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <MessageSquare size={12} />
            Community Voice
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            Wall of <span className="text-primary italic">Love</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl">
            Trusted by over <span className="text-white font-bold">100,000+</span> traders in Cameroon. Join the revolution of seamless crypto-to-XAF exchange.
          </p>
        </div>

        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#00ff88] text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,255,136,0.6)] animate-pulse-whatsapp"
              data-aos="fade-left"
            >
              <Plus size={16} />
              Write a Review
            </motion.button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md glass p-8 border-white/10 z-[101] animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-2xl font-black uppercase tracking-tight">Post a Review</Dialog.Title>
                <Dialog.Close className="text-text-muted hover:text-white transition-colors">
                  <X size={24} />
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: s})}
                        className={`transition-all ${newReview.rating >= s ? "text-primary scale-110" : "text-white/10"}`}
                      >
                        <Star size={24} fill={newReview.rating >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Your Name</label>
                  <input 
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-primary transition-all text-sm"
                    placeholder="e.g. Dieudonné Atangana"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Your Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-primary transition-all text-sm resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#00ff88] text-black font-black uppercase tracking-[0.12em] text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,136,0.6)] disabled:opacity-40 animate-pulse-whatsapp"
                >
                  {isSubmitting ? "Posting..." : "Confirm Post"}
                </button>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-2 relative">
        {/* Gradient Fades for edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-bg-deep to-transparent z-20"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-bg-deep to-transparent z-20"></div>
        
        <MarqueeRow items={row1} direction="left" speed={120} />
        <MarqueeRow items={row2} direction="right" speed={150} />
        <MarqueeRow items={row3} direction="left" speed={180} />
      </div>

      <div className="mt-16 text-center" data-aos="fade-up">
        <div className="inline-block p-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full max-w-2xl"></div>
        <p className="mt-8 text-white/50 text-xs uppercase tracking-[0.18em] font-black">
          Showing {allTestimonials.length}+ Verified Cameroonian Reviews
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
