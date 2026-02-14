"use client";

import { useState } from "react";
import { Check, Loader2, Zap, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSubscriptionOrder, verifySubscriptionPayment } from "@/actions/subscription-checkout";

interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    maxRooms: number;
    maxBookings: number;
    features: string[];
    slug: string;
}

interface PricingCardsProps {
    plans: Plan[];
    currentPlanId?: string;
    hotelId: string;
    isLocked?: boolean;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function PricingCards({ plans, currentPlanId, hotelId, isLocked }: PricingCardsProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSelectPlan = async (plan: Plan) => {
        console.log("Selecting plan:", plan.name, plan.id);
        if (!isLocked && plan.id === currentPlanId) {
            console.log("Already on this plan and not locked.");
            return;
        }

        setLoading(plan.id);

        try {
            console.log("Calling createSubscriptionOrder...");
            const res = await createSubscriptionOrder(plan.id, hotelId);
            console.log("Order response:", res);

            if (res.error) {
                toast.error(res.error);
                setLoading(null);
                return;
            }

            if (res.free) {
                toast.success("Switched to Free plan successfully!");
                router.refresh();
                setLoading(null);
                return;
            }

            // Razorpay configuration
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: res.amount,
                currency: "INR",
                name: "HotelO.S.",
                description: `${plan.name} Subscription`,
                order_id: res.orderId,
                handler: async function (response: any) {
                    console.log("Razorpay payment successful, verifying...");
                    const verification = await verifySubscriptionPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        hotelId,
                        plan.id
                    );

                    if (verification.success) {
                        toast.success(`${plan.name} plan activated!`);
                        router.push("/dashboard");
                    } else {
                        toast.error(verification.error || "Payment verification failed");
                    }
                    setLoading(null);
                },
                prefill: {
                    name: "", // Will be filled from session if available
                    email: "",
                },
                theme: {
                    color: "#a1f554",
                },
                modal: {
                    ondismiss: function () {
                        console.log("Razorpay modal closed");
                        setLoading(null);
                    }
                }
            };

            if (window.Razorpay) {
                console.log("Opening Razorpay...");
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                console.error("Razorpay SDK not found on window");
                toast.error("Razorpay SDK failed to load. Please refresh the page.");
                setLoading(null);
            }

        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Something went wrong");
            setLoading(null);
        }
    };

    // Filter out free plan if subscription is locked (expired)
    const visiblePlans = isLocked ? plans.filter(p => p.slug !== 'free') : plans;

    return (
        <div className="space-y-12">
            {isLocked && (
                <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="h-20 w-20 text-red-500" />
                    </div>
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
                            <Shield className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-red-500 uppercase tracking-tight font-outfit">Subscription Terminated</h3>
                            <p className="text-sm text-red-400/80 font-medium leading-relaxed max-w-2xl">
                                Your operational license has expired. Systems are currently in read-only protocol. Please select a production-grade node below to restore full administrative capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
                {visiblePlans.map((plan) => {
                    const isCurrent = plan.id === currentPlanId;

                    return (
                        <div
                            key={plan.id}
                            className={cn(
                                "group relative flex flex-col rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] bg-[#0c0c0c]/80 backdrop-blur-xl",
                                isCurrent
                                    ? "border-[#a1f554] shadow-[0_0_50px_rgba(161,245,84,0.1)] ring-1 ring-[#a1f554]/20"
                                    : "border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
                            )}
                        >
                            {isCurrent && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#a1f554] text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(161,245,84,0.3)] z-20">
                                    Active Authority
                                </div>
                            )}

                            <div className="p-10 flex flex-col h-full">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight font-outfit group-hover:text-[#a1f554] transition-colors">{plan.name}</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 group-hover:text-white/50 transition-colors">{plan.description}</p>
                                </div>

                                <div className="mb-10 flex items-baseline gap-1">
                                    <span className="text-5xl font-black font-outfit text-white tracking-tighter">₹{plan.price}</span>
                                    <span className="text-white/20 font-bold text-[10px] uppercase tracking-widest ml-2">/ per orbital cycle</span>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div className="h-px bg-gradient-to-r from-[#a1f554]/20 to-transparent" />

                                    <ul className="space-y-5">
                                        <li className="flex items-center gap-4 group/item">
                                            <div className="h-8 w-8 rounded-xl bg-[#a1f554]/10 flex items-center justify-center text-[#a1f554] border border-[#a1f554]/10 group-hover/item:scale-110 transition-transform">
                                                <Zap className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/item:text-white/60 transition-colors leading-none">Capacity Matrix</p>
                                                <p className="text-sm font-bold text-white mt-1 uppercase tracking-tight">Up to {plan.maxRooms} Nodes</p>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-4 group/item">
                                            <div className="h-8 w-8 rounded-xl bg-[#a1f554]/10 flex items-center justify-center text-[#a1f554] border border-[#a1f554]/10 group-hover/item:scale-110 transition-transform">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/item:text-white/60 transition-colors leading-none">Traffic Load</p>
                                                <p className="text-sm font-bold text-white mt-1 uppercase tracking-tight">
                                                    {plan.maxBookings === -1 ? "Unlimited Throughput" : `Up to ${plan.maxBookings} Operations`}
                                                </p>
                                            </div>
                                        </li>
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-4 group/item">
                                                <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5 group-hover/item:border-[#a1f554]/20 group-hover/item:text-[#a1f554] transition-all">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover/item:text-white/60 transition-colors">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-12">
                                    <Button
                                        className={cn(
                                            "w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 group border-none",
                                            isCurrent
                                                ? "bg-white/5 text-white/30 cursor-default hover:bg-white/5"
                                                : "bg-[#a1f554] hover:bg-[#b4f876] text-black shadow-[0_20px_40px_rgba(161,245,84,0.1)] hover:shadow-[0_25px_50px_rgba(161,245,84,0.2)]"
                                        )}
                                        disabled={(!isLocked && isCurrent) || !!loading}
                                        onClick={() => handleSelectPlan(plan)}
                                    >
                                        {loading === plan.id ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Authorizing...</span>
                                            </div>
                                        ) : (isLocked && isCurrent) ? (
                                            <div className="flex items-center gap-3">
                                                <Shield className="h-5 w-5 group-hover:scale-125 transition-transform" />
                                                <span>Renew Authority</span>
                                            </div>
                                        ) : isCurrent ? (
                                            "Active Protocol"
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Zap className="h-5 w-5 group-hover:scale-125 transition-transform" />
                                                <span>Initialize {plan.name}</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center max-w-2xl mx-auto pt-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed">
                    All transactions are secured via military-grade encryption protocols. Multi-node redundancy included by default across all premium infrastructure.
                </p>
            </div>
        </div>
    );
}
