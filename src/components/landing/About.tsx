"use client";

import { motion } from "framer-motion";
import { Sparkles, Building2, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";

export function About() {
    return (
        <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* HEADING SECTION */}
                <div className="text-center mb-20 md:mb-24 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] inline-block mb-8"
                    >
                        Sector Coverage
                    </motion.div>
                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 italic-none">
                        Engineered for the <br />
                        <span className="text-[#b5f347]">Hospitality Frontier</span>
                    </h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto text-base md:text-lg">
                        HotelOS provides the underlying digital infrastructure for properties that demand sub-second performance and uncompromised security.
                    </p>
                </div>

                {/* PROPERTY TYPES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 md:mb-32">
                    {[
                        {
                            title: "Luxury Boutiques",
                            desc: "Hyper-personalized guest experiences with automated node sync.",
                            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
                            icon: Sparkles,
                            stat: "0.2ms Sync"
                        },
                        {
                            title: "Enterprise Chains",
                            desc: "Centralized command nodes for massive global property networks.",
                            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                            icon: Building2,
                            stat: "Global Clusters"
                        },
                        {
                            title: "Resort Ecosystems",
                            desc: "Decentralized management for complex hospitality deployments.",
                            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
                            icon: Zap,
                            stat: "Infinite Scale"
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-[450px] md:h-[500px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/5 bg-[#151515]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale opacity-40 group-hover:opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

                            {/* Card Content */}
                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 md:h-12 md:w-12 bg-[#b5f347] rounded-2xl flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                                        <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-[#b5f347] bg-black/50 border border-[#b5f347]/30 px-3 py-1 rounded-full uppercase">
                                        {item.stat}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{item.title}</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[240px] group-hover:text-slate-100 transition-colors">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-[#b5f347] uppercase tracking-widest">Deploy Node</span>
                                        <div className="h-px flex-1 bg-[#b5f347]/30" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* COMPLIANCE TRUST BAR - Integrated Icons */}
                <div className="bg-[#151515] rounded-[2.5rem] md:rounded-[3rem] border border-white/5 p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Cpu className="h-24 w-24 text-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center relative z-10">
                        {[
                            { label: "GDPR Compliant", icon: ShieldCheck, sub: "Data Protection Node" },
                            { label: "PCI DSS Level 1", icon: Globe, sub: "FinOps Security" },
                            { label: "ISO 27001", icon: ShieldCheck, sub: "Infra Governance" },
                            { label: "99.9% Uptime SLA", icon: Zap, sub: "System Integrity" }
                        ].map((signal, i) => (
                            <div key={i} className="flex items-center gap-6 group/item">
                                <div className="h-12 w-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-slate-500 group-hover/item:text-[#b5f347] group-hover/item:bg-[#b5f347]/10 transition-all duration-500">
                                    <signal.icon className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] mb-1">
                                        {signal.label}
                                    </span>
                                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                        {signal.sub}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
