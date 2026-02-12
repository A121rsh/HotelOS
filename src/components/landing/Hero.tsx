"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-60 overflow-hidden bg-[#fafafa]">
            {/* 1. MINIMALIST BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]"></div>

                {/* Subtle Geometric Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                {/* 2. CHIP NOTIFICATION */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider mb-8"
                >
                    <span className="bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full font-black">NEW</span>
                    <span className="pr-2 tracking-tight">Experience the next generation of hospitality</span>
                </motion.div>

                {/* 3. CENTERED HERO TYPOGRAPHY */}
                <div className="relative max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-[6.5rem] font-black font-instrument text-slate-900 tracking-tighter mb-8 leading-[1]"
                    >
                        A property management <br />
                        works like an <span className="relative inline-block px-8 py-2">
                            <span className="relative z-10 text-emerald-600 italic">Organiser</span>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 bg-emerald-50 rounded-[2rem] -skew-x-6 origin-left"
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium tracking-tight"
                    >
                        Great hotels deserve a system that does it all. From synchronising global inventory
                        to ensuring guest satisfaction, we handle the complexity so you can focus on the stay.
                    </motion.p>
                </div>

                {/* 4. CALL TO ACTIONS */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/onboarding">
                        <Button className="h-14 px-10 text-sm rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold transition-all shadow-xl shadow-slate-900/10">
                            Get an Invite
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#demo">
                        <Button variant="ghost" className="h-14 px-10 text-sm rounded-full text-slate-900 hover:bg-slate-100 font-bold transition-all">
                            Book a Discovery Call
                        </Button>
                    </Link>
                </motion.div>

                {/* 5. FLOATING INTERFACE PREVIEWS */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { title: "Smart Scheduling", color: "bg-blue-500", delay: 0.35 },
                        { title: "Guest Intelligence", color: "bg-emerald-500", delay: 0.4 },
                        { title: "Revenue Sync", color: "bg-amber-500", delay: 0.45 }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] aspect-square flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                            <div className={`h-24 w-24 rounded-[1.5rem] ${item.color} opacity-10 blur-2xl absolute -top-10 -right-10 group-hover:scale-150 transition-transform duration-700`} />
                            <div className={`h-3 w-20 ${item.color} rounded-full mb-6 opacity-20`} />
                            <h3 className="text-xl font-black font-instrument text-slate-900 mb-2">{item.title}</h3>
                            <div className="space-y-2 w-full">
                                <div className="h-1.5 w-full bg-slate-50 rounded-full" />
                                <div className="h-1.5 w-2/3 bg-slate-50 rounded-full mx-auto" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Hotel(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
            <path d="m9 16 .348-.24c.438-.302 1.157-.492 1.652-.492h2c.495 0 1.214.19 1.652.492.203.14.348.24.348.24" />
            <path d="M10 8h.01" />
            <path d="M10 12h.01" />
            <path d="M14 8h.01" />
            <path d="M14 12h.01" />
        </svg>
    )
}
