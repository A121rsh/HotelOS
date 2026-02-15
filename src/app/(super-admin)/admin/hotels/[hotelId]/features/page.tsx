import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FeaturesForm } from "./FeaturesForm";
import { ChevronLeft, ShieldCheck, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function HotelFeaturesPage({ params }: { params: Promise<{ hotelId: string }> }) {
    const { hotelId } = await params;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
    });

    if (!hotel) return notFound();

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/hotels">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                                <Settings className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold text-white">Feature Settings</h1>
                                <p className="text-slate-400 text-sm mt-1">Managing: <span className="text-[#a1f554] font-semibold">{hotel.name}</span></p>
                            </div>
                        </div>
                    </div>
                    <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 px-4 py-2 font-semibold">
                        Admin Access
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <FeaturesForm
                        hotelId={hotel.id}
                        initialBlocked={hotel.blockedFeatures}
                    />
                </div>

                {/* Info Card */}
                <div className="space-y-6">
                    <div className="bg-[#0f110d] rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1f554] rounded-full blur-[100px] opacity-10" />

                        <div className="relative z-10 space-y-6">
                            <div className="h-12 w-12 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                                <ShieldCheck className="h-6 w-6 text-[#a1f554]" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white">Access Control</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Disabling features will immediately restrict access for hotel staff. Use this to manage subscription limits or enforce compliance.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse" />
                                    <span className="text-xs text-slate-500">Changes apply instantly</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}