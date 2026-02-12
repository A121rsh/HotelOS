"use client";

import { Hotel } from "lucide-react";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center font-instrument overflow-hidden">

            {/* Minimalist Ambient Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col items-center gap-12 relative z-10">

                {/* Brand Nucleus */}
                <div className="relative group">
                    <div className="h-24 w-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white/20 transition-transform duration-700">
                        <Hotel className="h-10 w-10 text-white" />
                    </div>

                    {/* Pulsing Aura */}
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-[2.5rem] blur-2xl animate-pulse -z-10" />
                </div>

                {/* Brand Identity */}
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                        Hotel<span className="text-emerald-500">OS</span>
                    </h2>
                    <div className="relative h-1 w-32 bg-slate-100 rounded-full mx-auto overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900 w-1/2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2">Initializing Suite</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
