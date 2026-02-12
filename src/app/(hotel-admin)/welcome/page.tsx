"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hotel, Sparkles, ShieldCheck, Zap, Loader2 } from "lucide-react";

const STEPS = [
    {
        title: "Identity & Authority Verification",
        detail: "Establishing secure SSL/TLS handshakes and validating proprietor credentials.",
        icon: ShieldCheck,
        color: "text-blue-400",
    },
    {
        title: "Encrypted Volume Allocation",
        detail: "Provisioning dedicated AES-256 encrypted storage for property assets.",
        icon: Zap,
        color: "text-amber-400",
    },
    {
        title: "Intelligence Engine Synthesis",
        detail: "Configuring the AI-core for occupancy predictive modeling and ARI sync.",
        icon: Sparkles,
        color: "text-purple-400",
    },
    {
        title: "Operational Headquarters UI",
        detail: "Finalizing the high-performance administrative command center.",
        icon: Hotel,
        color: "text-cyan-400",
    }
];

const TECHNICAL_LOGS = [
    "INITIALIZING ROOT NODE...",
    "SSL HANDSHAKE SUCCESSFUL [PORT 443]",
    "ALLOCATING DATABASE SHARDS...",
    "CONNECTING TO GLOBAL OTA BRIDGE...",
    "SYNTHESIZING EXECUTIVE DASHBOARD...",
    "ENCRYPTING SENSITIVE DATA VOLUMES...",
    "OPTIMIZING RENDERING ENGINE...",
    "SYSTEM AUTHORITY DELEGATED.",
];

function cn(...inputs: any) {
    return inputs.filter(Boolean).join(" ");
}

export default function WelcomePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
        }, 2200);

        // Add logs one by one
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < TECHNICAL_LOGS.length) {
                setLogs(prev => [...prev, TECHNICAL_LOGS[logIndex]]);
                logIndex++;
            }
        }, 800);

        const timeout = setTimeout(() => {
            router.push("/dashboard");
        }, 9000);

        return () => {
            clearInterval(interval);
            clearInterval(logInterval);
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-[#07090d] flex flex-col items-center justify-center relative overflow-hidden text-white font-inter">
            {/* Quantum Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-20%] left-[10%] w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[140px]" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col gap-16">

                {/* 1. HEADER SECTION */}
                <div className="flex items-center gap-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl"
                    >
                        <Hotel className="h-10 w-10 text-blue-500" />
                    </motion.div>
                    <div className="space-y-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-black font-outfit uppercase tracking-tighter"
                        >
                            Provisioning <span className="text-blue-500">Property Node</span>
                        </motion.h1>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Active: v4.2.0-stable</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 2. PROGRESS STEPS */}
                    <div className="space-y-4">
                        {STEPS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: i <= step ? 1 : 0.2,
                                    x: 0,
                                    scale: i === step ? 1.02 : 1
                                }}
                                className={cn(
                                    "p-5 rounded-3xl border transition-all duration-700",
                                    i === step ? "bg-white/5 border-white/10 shadow-2xl" : "bg-transparent border-transparent"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn("p-2 rounded-xl bg-white/5", i === step ? s.color : "text-slate-700")}>
                                        <s.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={cn("text-xs font-black uppercase tracking-widest", i === step ? "text-white" : "text-slate-700")}>
                                            {s.title}
                                        </p>
                                        {i === step && (
                                            <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                                {s.detail}
                                            </p>
                                        )}
                                    </div>
                                    {i === step && (
                                        <Loader2 className="ml-auto h-4 w-4 animate-spin text-blue-500 shrink-0 mt-1" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 3. TECHNICAL CONSOLE LOG */}
                    <div className="bg-black/50 border border-white/5 rounded-3xl p-6 font-mono overflow-hidden flex flex-col h-[300px]">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                            <span className="ml-auto text-[8px] font-black text-slate-600 uppercase tracking-widest">Deployment Console</span>
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[9px] font-black tracking-wider flex items-center gap-3"
                                >
                                    <span className="text-blue-500/40">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={cn(
                                        log?.includes("SUCCESSFUL") || log?.includes("DELEGATED") ? "text-emerald-500" : "text-slate-500"
                                    )}>{log}</span>
                                </motion.div>
                            ))}
                            {step < STEPS.length && (
                                <div className="h-4 w-2 bg-blue-500 animate-pulse inline-block align-middle" />
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. FOOTER SECURITY BADGES */}
                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-4 border-[#07090d] bg-slate-800" />
                        ))}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Security Protocols</p>
                        <p className="text-[9px] font-bold text-blue-500 uppercase mt-1">E2E AES-256 + RSA 4096 VALIDATED</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
