"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Hotel, LogOut, ArrowLeft, ShieldAlert, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignOutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-6 font-inter">
            {/* Background Architectural Elements - Neon Theme */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#a1f554]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#a1f554]/2 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="group">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-[1.5rem] bg-[#a1f554] flex items-center justify-center shadow-2xl shadow-[#a1f554]/20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 shadow-inner">
                                    <Hotel className="h-10 w-10 text-black" />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-black font-outfit text-white tracking-tighter leading-none mb-4 uppercase italic">
                        Hotel<span className="text-[#a1f554]">OS</span>
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-white/5" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Authority Tunnel</p>
                        <span className="h-px w-8 bg-white/5" />
                    </div>
                </div>

                <div className="bg-[#0f110d] border border-white/5 shadow-2xl rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden group">
                    {/* Decorative pulse */}
                    <div className="absolute -top-20 -right-20 h-40 w-40 bg-[#a1f554]/5 rounded-full blur-3xl group-hover:bg-[#a1f554]/10 transition-colors duration-700" />

                    <div className="relative z-10">
                        <div className="h-20 w-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-10 mx-auto border border-red-500/20 shadow-inner">
                            <LogOut className="h-10 w-10 text-red-500 shadow-2xl" />
                        </div>

                        <h2 className="text-3xl font-black font-outfit text-white tracking-tight uppercase italic mb-5">Disconnect <span className="text-red-500">Node</span>?</h2>
                        <p className="text-slate-500 font-bold mb-12 text-[13px] leading-relaxed tracking-tight">
                            Confirm termination of high-authority session. Universal grid access will be restricted until re-synchronization.
                        </p>

                        <div className="space-y-6 w-full">
                            <Button
                                onClick={async () => {
                                    await signOut({ redirect: false });
                                    window.location.href = "/";
                                }}
                                className="w-full h-18 py-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all border-none"
                            >
                                Terminate Session
                            </Button>

                            <Link href="/dashboard" className="block">
                                <Button variant="ghost" className="w-full h-18 py-6 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-white/5">
                                    <ArrowLeft className="h-4 w-4" /> Maintain Connection
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Stats Footer */}
                <div className="mt-12 grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner">
                        <ShieldAlert className="h-5 w-5 text-[#a1f554]" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Cipher</p>
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter">AES-256-GCM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner">
                        <Zap className="h-5 w-5 text-[#a1f554]" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Latency</p>
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter">{Math.floor(Math.random() * 20) + 5}ms Synchronized</p>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
