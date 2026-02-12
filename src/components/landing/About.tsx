"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function About() {
    return (
        <section id="process" className="py-40 bg-[#fafafa] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="relative z-10 p-4 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-slate-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                            alt="Modern Hotel Management"
                            className="rounded-[2.5rem] w-full object-cover"
                        />
                        {/* Floating Overlay Card */}
                        <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-8 rounded-[2rem] max-w-[240px] shadow-2xl space-y-4 hidden md:block">
                            <div className="h-1 w-12 bg-emerald-400 rounded-full" />
                            <p className="text-xs font-bold leading-relaxed italic opacity-80">
                                "The transition was seamless. We were live within 24 hours."
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Master Suite Resort</div>
                        </div>
                    </motion.div>
                </div>
                <div className="space-y-12">
                    <div className="space-y-4">
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">The Philosophy</span>
                        <h2 className="text-4xl md:text-6xl font-black font-instrument text-slate-900 leading-[1.1] tracking-tighter">
                            Simplicity is our <br /><span className="italic text-slate-400">Greatest Feature.</span>
                        </h2>
                    </div>

                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                        We've stripped away the legacy clutter of traditional property management. What's left is a high-performance engine designed for the modern hotelier's peace of mind.
                    </p>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-2">
                            <span className="block text-5xl font-black text-slate-900 font-instrument tracking-tighter">98%</span>
                            <span className="block h-1 w-12 bg-emerald-500 rounded-full" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup Satisfaction</span>
                        </div>
                        <div className="space-y-2">
                            <span className="block text-5xl font-black text-slate-900 font-instrument tracking-tighter">24/7</span>
                            <span className="block h-1 w-12 bg-emerald-500 rounded-full" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Concierge Support</span>
                        </div>
                    </div>

                    <Button className="h-14 px-10 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
                        Learn our process
                    </Button>
                </div>
            </div>
        </section>
    );
}
