import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FeaturesForm } from "./FeaturesForm";
import { ChevronLeft, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function HotelFeaturesPage({ params }: { params: { hotelId: string } }) {
    const { hotelId } = await params;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
    });

    if (!hotel) return notFound();

    return (
        <div className="max-w-[1200px] mx-auto space-y-10 pb-10 font-inter">
            {/* 1. GOVERNANCE HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/hotels">
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Feature Governance</h1>
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">Admin Level</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-400 font-bold text-sm">Managing Node Identity:</p>
                                <p className="text-blue-600 font-black font-outfit uppercase tracking-tight">{hotel.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. GOVERNANCE FORM CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <FeaturesForm
                        hotelId={hotel.id}
                        initialBlocked={hotel.blockedFeatures}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black font-outfit uppercase tracking-tight">Access Control</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    Disabling features will immediately restrict access for all property personnel. Use this to enforce compliance or manage subscription overages.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Synchronization Active</span>
                                </div>
                            </div>
                        </div>
                        <Globe className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
