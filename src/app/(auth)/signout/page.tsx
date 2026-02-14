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
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#b5f347]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]" />
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
                                <div className="h-20 w-20 rounded-[1.5rem] bg-[#b5f347] flex items-center justify-center shadow-xl shadow-[#b5f347]/20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                    <Hotel className="h-10 w-10 text-black" />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-black font-outfit text-white tracking-tight leading-none mb-3 uppercase">
                        Hotel<span className="text-[#b5f347]">OS</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-white/10" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Session Termination</p>
                        <span className="h-px w-8 bg-white/10" />
                    </div>
                </div>

                <div className="bg-[#151515] border border-white/5 shadow-2xl rounded-[2.5rem] p-10 md:p-12 text-center relative overflow-hidden group">
                    {/* Decorative pulse */}
                    <div className="absolute -top-20 -right-20 h-40 w-40 bg-[#b5f347]/10 rounded-full blur-3xl group-hover:bg-[#b5f347]/20 transition-colors duration-700" />

                    <div className="relative z-10">
                        <div className="h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 mx-auto border border-red-500/20">
                            <LogOut className="h-8 w-8 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-black font-outfit text-white tracking-tight uppercase mb-4">Disconnect Node?</h2>
                        <p className="text-slate-400 font-medium mb-10 text-sm leading-relaxed">
                            Are you sure you want to terminate your encrypted connection to the command center? You will need to re-authorize to regain access.
                        </p>

                        <div className="space-y-4 w-full">
                            <Button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all"
                            >
                                Terminate Session
                            </Button>

                            <Link href="/dashboard" className="block">
                                <Button variant="ghost" className="w-full h-16 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/5">
                                    <ArrowLeft className="h-4 w-4" /> Return to Command
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Stats Footer */}
                <div className="mt-12 grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-white/2 rounded-2xl border border-white/5">
                        <ShieldAlert className="h-4 w-4 text-[#b5f347]" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Protocol</p>
                            <p className="text-[10px] font-bold text-white uppercase tracking-tighter">SECURE-TLS</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/2 rounded-2xl border border-white/5">
                        <Zap className="h-4 w-4 text-[#b5f347]" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Sync</p>
                            <p className="text-[10px] font-bold text-white uppercase tracking-tighter">NODE-ALIVE</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
