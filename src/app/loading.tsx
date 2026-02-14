"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden font-outfit">

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b5f347]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-12">

                {/* INFINITY LOADER CONTAINER */}
                <div className="relative w-48 h-24">
                    {/* Static Shadow Path */}
                    <svg
                        viewBox="0 0 100 50"
                        className="absolute inset-0 w-full h-full opacity-10"
                    >
                        <path
                            d="M30,25 C30,12 15,12 15,25 C15,38 30,38 30,25 C30,12 70,38 70,25 C70,12 85,12 85,25 C85,38 70,38 70,25 C70,12 30,38 30,25"
                            fill="none"
                            stroke="#b5f347"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Animated Glowing Trail */}
                    <svg
                        viewBox="0 0 100 50"
                        className="absolute inset-0 w-full h-full"
                    >
                        <motion.path
                            d="M30,25 C30,12 15,12 15,25 C15,38 30,38 30,25 C30,12 70,38 70,25 C70,12 85,12 85,25 C85,38 70,38 70,25 C70,12 30,38 30,25"
                            fill="none"
                            stroke="#b5f347"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0.2, pathOffset: 0 }}
                            animate={{
                                pathOffset: [0, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                filter: "drop-shadow(0 0 8px #b5f347)"
                            }}
                        />
                    </svg>

                    {/* Center Icon Nucleus */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-[#b5f347]/10 p-3 rounded-full border border-[#b5f347]/20 backdrop-blur-sm"
                        >
                            <Sparkles className="h-4 w-4 text-[#b5f347]" />
                        </motion.div>
                    </div>
                </div>

                {/* LOADING TEXT */}
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white font-black text-xl uppercase tracking-[0.2em]"
                    >
                        Hotel<span className="text-[#b5f347]">OS</span>
                    </motion.h2>
                    <div className="flex flex-col items-center gap-2">
                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-[10px] font-black text-[#b5f347] uppercase tracking-[0.4em]"
                        >
                            Node Provisioning...
                        </motion.p>
                        <div className="h-[2px] w-24 bg-white/5 rounded-full relative overflow-hidden">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[#b5f347] w-1/2 rounded-full opacity-50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal Status Style Footer */}
            <div className="absolute bottom-12 flex gap-8">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#b5f347] animate-pulse" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol: Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#b5f347] animate-pulse" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Latency: 0.2ms</span>
                </div>
            </div>
        </div>
    );
}
