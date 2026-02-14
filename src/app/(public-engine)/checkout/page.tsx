import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import Link from "next/link";
import { Hotel, Loader2, ShieldCheck, Crown } from "lucide-react";

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-6 w-6 animate-spin text-[#b5f347]" />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Optimizing Enrollment Gateway...</span>
                </div>
            </div>
        }>
            <CheckoutClient />
        </Suspense>
    );
}
