
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PricingCards } from "./PricingCards";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { Shield, Zap, Sparkles } from "lucide-react";

export default async function PricingPage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/login");
    }

    const hotel = await getHotelByUserId(session.user.id!);
    if (!hotel) {
        redirect("/register");
    }

    const plans = await db.subscriptionPlan.findMany({
        orderBy: {
            price: "asc",
        },
    });

    const currentSubscription = await db.subscription.findUnique({
        where: {
            hotelId: hotel.id,
        },
        include: {
            plan: true,
        },
    });

    const isExpired = currentSubscription ? new Date() > new Date(currentSubscription.endDate!) : false;
    const isLocked = isExpired || currentSubscription?.status === "EXPIRED";

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-inter selection:bg-[#a1f554] selection:text-black">

            {/* Background Narrative Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#a1f554]/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#a1f554]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 group hover:border-[#a1f554]/30 transition-all">
                        <Shield className="h-4 w-4 text-[#a1f554] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Operational Scaling Protocol</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-outfit italic leading-none">
                        Upgrade Your <span className="text-[#a1f554]">Command Node</span>
                    </h1>

                    <p className="mt-8 text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                        Authorize higher bandwidth for your property operations. Select an institutional tier to unlock advanced administrative modules and scaling capabilities.
                    </p>

                    <div className="flex items-center justify-center gap-8 pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#a1f554] shadow-[0_0_10px_#a1f554]" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Digital Resilience</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#a1f554] shadow-[0_0_10px_#a1f554]" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Infinite Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#a1f554] shadow-[0_0_10px_#a1f554]" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Enterprise Logic</span>
                        </div>
                    </div>
                </div>

                <PricingCards
                    plans={plans}
                    currentPlanId={currentSubscription?.planId || undefined}
                    hotelId={hotel.id}
                    isLocked={isLocked}
                />
            </div>
        </div>
    );
}
