"use client";

import { motion } from "framer-motion";
import { Sparkles, Twitter, Instagram, Linkedin, Github, Apple, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 overflow-hidden">

            {/* DOWNLOAD APP / STATS SECTION */}
            <div className="container mx-auto px-6 py-24 md:py-32 border-b border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-[1] uppercase tracking-tighter">
                            Scale Your <br />
                            <span className="text-[#b5f347]">Property Hub</span>
                        </h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <Button className="h-14 px-8 bg-[#b5f347] text-black rounded-full flex items-center gap-3 font-black uppercase text-[11px] tracking-widest hover:bg-[#a2db3f] transition-all">
                                <Apple className="h-5 w-5 fill-current" /> App Store
                            </Button>
                            <Button className="h-14 px-8 bg-transparent text-white border border-white/10 rounded-full flex items-center gap-3 font-black uppercase text-[11px] tracking-widest hover:bg-white/5 transition-all">
                                <Play className="h-5 w-5 fill-current" /> Play Store
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                        <div>
                            <p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">768<span className="text-[#b5f347]">K</span></p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active nodes <br className="hidden md:block" /> syncing monthly</p>
                        </div>
                        <div>
                            <p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">5.0<span className="text-[#b5f347]">*</span></p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System uptime <br className="hidden md:block" /> verification</p>
                        </div>
                        <div>
                            <p className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">$8.8<span className="text-[#b5f347]">B</span></p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregate network <br className="hidden md:block" /> revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN FOOTER links */}
            <div className="container mx-auto px-6 py-20 relative">
                {/* LARGE BACKGROUND LOGO - Fixed overflow for mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none text-[30vw] font-black tracking-tighter text-white leading-none z-0 overflow-hidden w-full text-center">
                    HOTELOS
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 relative z-10">
                    <div className="col-span-2 lg:col-span-4 space-y-8 text-center lg:text-left">
                        {/* LOGO */}
                        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 group">
                            <div className="bg-[#b5f347] h-8 w-8 rounded-full flex items-center justify-center text-black">
                                <Sparkles className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-2xl font-black font-outfit text-white tracking-tighter uppercase">Hotel<span className="text-[#b5f347]">OS</span></span>
                        </Link>
                        <p className="text-slate-500 font-bold leading-relaxed max-w-sm text-sm mx-auto lg:mx-0">
                            The decentralized property operating system for high-velocity hospitality management. Secure, scalable, and fully autonomous.
                        </p>
                    </div>

                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">System</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Features</Link></li>
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Price Nodes</Link></li>
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Kernel</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Deploy</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">iOS Node</Link></li>
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Android Node</Link></li>
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Web Core</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Node Terms</Link></li>
                            <li><Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#b5f347] transition-colors uppercase">Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Connect</h4>
                        <div className="flex gap-4 justify-center lg:justify-start">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link key={i} href="#" className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-[#b5f347] hover:bg-[#b5f347]/10 transition-all">
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center sm:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">© 2026 HotelOS Technologies. Verified Enterprise Instance.</p>
                </div>
            </div>
        </footer>
    );
}
