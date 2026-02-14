"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Sparkles, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

export function Comparison() {
    const features = [
        { name: "Real-time Node Synchronization", hotelos: true, others: false },
        { name: "Global Multi-channel Mapping", hotelos: true, others: false },
        { name: "Hyper-personal Guest CRM", hotelos: true, others: true },
        { name: "Predictive Revenue Forecasts", hotelos: true, others: false },
        { name: "Zero-latency Payment Gateway", hotelos: true, others: true },
        { name: "24/7 Enterprise Support Node", hotelos: true, others: false },
        { name: "Custom API & Webhook Nodes", hotelos: true, others: false },
    ];

    return (
        <section id="compare" className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b5f347]/3 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] inline-block mb-8"
                    >
                        Performance Benchmark
                    </motion.div>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                        The Node <br />
                        <span className="text-[#b5f347]">Superiority Index</span>
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* MOBILE VIEW - High Fidelity Card Style */}
                    <div className="lg:hidden space-y-4">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#151515] p-5 rounded-[2rem] border border-white/5 flex flex-col gap-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-[#b5f347]" />
                                    <span className="text-sm font-black uppercase tracking-tight text-white leading-none">{f.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 flex flex-col gap-2 p-3 bg-[#0a0a0a] rounded-2xl border border-white/5 items-center">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Legacy</span>
                                        {f.others ? <Check className="h-4 w-4 text-[#b5f347]" /> : <X className="h-4 w-4 text-slate-800" />}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2 p-3 bg-[#b5f347] rounded-2xl items-center shadow-lg shadow-[#b5f347]/10">
                                        <span className="text-[8px] font-black text-black uppercase tracking-widest">HotelOS</span>
                                        <Check className="h-4 w-4 text-black" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW - Refined OS Table Style */}
                    <div className="hidden lg:block overflow-hidden rounded-[3.5rem] md:rounded-[4rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#101010] relative">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/50 backdrop-blur-md">
                                    <th className="p-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Feature Node Capability</th>
                                    <th className="p-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Legacy Systems</th>
                                    <th className="p-12 text-[10px] font-black uppercase tracking-[0.3em] text-[#b5f347] text-center bg-[#b5f347]/5">HotelOS Core</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {features.map((f, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-10">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#b5f347]/10 group-hover:border-[#b5f347]/20 transition-all">
                                                    <Orbit className="h-5 w-5 text-slate-500 group-hover:text-[#b5f347]" />
                                                </div>
                                                <span className="text-lg font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">{f.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-10 text-center">
                                            {f.others ?
                                                <Check className="h-6 w-6 mx-auto text-[#b5f347] opacity-60" /> :
                                                <X className="h-6 w-6 mx-auto text-slate-800" />
                                            }
                                        </td>
                                        <td className="p-10 text-center bg-[#b5f347]/[0.02]">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="h-10 w-10 rounded-full bg-[#b5f347] flex items-center justify-center mx-auto text-black shadow-xl shadow-[#b5f347]/20"
                                            >
                                                <Check className="h-6 w-6" />
                                            </motion.div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Verification Row */}
                <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Military Grade Protocols</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Sub-ms Native Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Revenue Node v4.2</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
