import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import { Hotel, Loader2, ShieldCheck, Crown } from "lucide-react";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden px-6 py-24 font-inter">
            {/* Background Architectural Patterns */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-100/40 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            {/* Corporate Branding */}
            <div className="mb-14">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-slate-900 p-3 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl shadow-slate-900/10">
                        <Hotel className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-3xl font-black font-outfit text-slate-900 tracking-tight italic">
                        Hotel<span className="text-blue-600">OS</span>
                    </span>
                </Link>
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center gap-6 p-20 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 animate-pulse">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shadow-inner">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600/30" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Optimizing Enrollment Gateway</span>
                </div>
            }>
                <CheckoutClient />
            </Suspense>

            {/* Safety Compliance Branding */}
            <div className="mt-12 opacity-30 flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PCI DSS Compliant Gateway</span>
                </div>
                <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Premium Node Infrastructure</span>
                </div>
            </div>
        </div>
    );
}
