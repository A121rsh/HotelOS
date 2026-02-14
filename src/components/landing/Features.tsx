"use client";

import { motion } from "framer-motion";
import {
    Zap,
    CreditCard,
    LayoutDashboard,
    ShieldCheck,
    Smartphone,
    LineChart,
    ChevronRight,
    Sparkles,
    Activity,
    Layers
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-[#b5f347]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6">

                {/* PARTNERS LOGO STRIP */}
                <div className="text-center mb-32 md:mb-40">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-12">
                        Trusted by 4,000+ companies already growing
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-20 opacity-20 grayscale saturate-0 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {["Ephemeral", "Wildcrafted", "Codecraft", "Convergence", "ImgCompress", "Epicurious", "Watchtower", "Renaissance"].map((name) => (
                            <div key={name} className="flex items-center gap-2 group cursor-default">
                                <Sparkles className="h-4 w-4 text-white group-hover:text-[#b5f347] transition-colors" />
                                <span className="text-lg font-black text-white group-hover:text-[#b5f347] transition-colors tracking-tighter">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN FEATURES HEADING */}
                <div className="text-center max-w-4xl mx-auto mb-20 md:mb-24 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] inline-block mb-8"
                    >
                        Hotel OS Architecture
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tighter mb-8 italic-none">
                        Unleash The <span className="text-[#b5f347]">True Potential</span> <br className="hidden md:block" />
                        Of Your Hospitality Nodes
                    </h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-xl mx-auto text-base md:text-lg">
                        HotelOS is a decentralized operating system designed to automate every recursive property task with sub-second synchronization.
                    </p>
                </div>

                {/* FEATURE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 md:mb-40">
                    {[
                        {
                            title: "Node Orchestration",
                            desc: "Properties can set up a command node and map inventories in minutes.",
                            icon: Layers,
                            tag: "Real-time"
                        },
                        {
                            title: "FinOps Console",
                            desc: "Enables instant capital transfers across local and global property nodes.",
                            icon: CreditCard,
                            tag: "Secure"
                        },
                        {
                            title: "Mobile Command",
                            desc: "Full-featured mobile kernel that allows seamless node management on-the-go.",
                            icon: Smartphone,
                            tag: "v4.0"
                        },
                        {
                            title: "Autonomous Sync",
                            desc: "Proprietary sync engine eliminates OTA delay or inventory mismatch.",
                            icon: Activity,
                            tag: "0.2ms Latency"
                        },
                        {
                            title: "Intelligence Hub",
                            desc: "AI tools analyze guest behaviors to provide automated revenue optimization.",
                            icon: LineChart,
                            tag: "AI Powered"
                        },
                        {
                            title: "Global Clusters",
                            desc: "Generate virtual property clusters for segmented regional management.",
                            icon: LayoutDashboard,
                            tag: "Infinite Scalability"
                        }
                    ].map((feature, i) => (
                        <FeatureCard key={i} {...feature} index={i} />
                    ))}
                </div>

                {/* SECTION: TWO-COLUMN VISUAL (Operations section) */}
                <div id="manage" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="relative group p-4 md:p-8 bg-[#151515] rounded-[2.5rem] md:rounded-[3rem] border border-white/5 order-2 lg:order-1 shadow-2xl overflow-hidden">

                        {/* Mockup Container */}
                        <div className="relative z-10 aspect-[4/3] bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-inner border border-white/5">
                            <div className="p-6 md:p-10 h-full flex flex-col justify-between relative">
                                {/* Dashboard Top Simulation */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="space-y-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#b5f347] animate-pulse" />
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global P&L Monitor</p>
                                        </div>
                                        <p className="text-3xl md:text-4xl font-black text-white">$231,454.20 <span className="text-[12px] bg-[#b5f347]/10 text-[#b5f347] px-3 py-1 rounded-full font-bold">+12.4%</span></p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Activity className="h-6 w-6 text-slate-500" />
                                    </div>
                                </div>

                                {/* Graph Simulation */}
                                <div className="flex-1 flex items-end justify-center mb-10 gap-2 md:gap-4 relative px-4">
                                    {[30, 60, 45, 90, 65, 50, 80, 40, 70, 55, 100].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            className={cn(
                                                "flex-1 rounded-t-xl transition-all duration-500",
                                                i === 10 ? "bg-[#b5f347] shadow-[0_0_30px_rgba(181,243,71,0.3)]" : "bg-white/5"
                                            )}
                                        />
                                    ))}
                                    {/* Data Label */}
                                    <div className="absolute right-0 top-0 bg-[#b5f347] text-black text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                                        TARGET REACHED
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        className="h-full bg-[#b5f347]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background Floating Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                            <div className="absolute top-10 right-10 h-32 w-32 bg-[#b5f347]/10 rounded-full blur-[80px]" />
                            <div className="absolute bottom-10 left-10 h-32 w-32 bg-blue-600/10 rounded-full blur-[80px]" />
                        </div>
                    </div>

                    <div className="space-y-10 order-1 lg:order-2 text-left">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 bg-[#b5f347]/10 border border-[#b5f347]/20 px-3 py-1 rounded-full"
                            >
                                <Zap className="h-3 w-3 text-[#b5f347] fill-[#b5f347]" />
                                <span className="text-[10px] font-black text-[#b5f347] uppercase tracking-wider">Operational Freedom</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter">
                                Operations Made <br />
                                <span className="text-[#b5f347]">Fully Autonomous</span>
                            </h2>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-lg text-lg">
                                Replace fragmented legacy tools with a unified property kernel. Eliminate manual sync errors and scale your portfolio with zero friction.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
                            <div>
                                <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">0.2<span className="text-[#b5f347] text-xl">ms</span></p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Average Node Sync Speed</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">100<span className="text-[#b5f347] text-xl">%</span></p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Inventory Accuracy Rate</p>
                            </div>
                        </div>

                        <Link href="/register" className="block pt-4">
                            <Button className="w-full sm:w-auto h-16 md:h-20 px-8 md:px-12 bg-[#b5f347] text-black rounded-full text-base md:text-xl font-black uppercase tracking-tight hover:bg-[#a2db3f] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#b5f347]/10">
                                Start Free Trial <ChevronRight className="h-6 w-6 stroke-[4]" />
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}

function FeatureCard({ title, desc, icon: Icon, tag, index }: { title: string, desc: string, icon: any, tag: string, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group block p-8 md:p-10 bg-[#151515] rounded-[2.5rem] border border-white/5 hover:border-[#b5f347]/50 transition-all duration-500 text-left relative overflow-hidden"
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                    <div className="h-14 w-14 bg-[#b5f347] rounded-2xl flex items-center justify-center shadow-lg shadow-[#b5f347]/20 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-black" />
                    </div>
                    <span className="text-[10px] font-black text-[#b5f347] bg-[#b5f347]/5 border border-[#b5f347]/20 px-3 py-1 rounded-full uppercase tracking-widest">
                        {tag}
                    </span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{title}</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    {desc}
                </p>
            </div>
            {/* Hover Decor */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#b5f347]/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
