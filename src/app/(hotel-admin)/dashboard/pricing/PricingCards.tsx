
"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
                    color: "#2563eb",
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
        <div className="space-y-8">
            {isLocked && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-bold">
                                Your trial or subscription has expired!
                            </p>
                            <p className="text-sm text-red-600 mt-1">
                                Most dashboard features are now locked, but you can still view your current bookings. Please select a plan below to restore full access.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {visiblePlans.map((plan) => {
                    const isCurrent = plan.id === currentPlanId;

                    return (
                        <Card key={plan.id} className={cn(
                            "relative flex flex-col border-2 transition-all duration-300 hover:shadow-2xl",
                            isCurrent ? "border-blue-600 shadow-lg scale-105 z-10" : "border-slate-200 hover:border-slate-300"
                        )}>
                            {isCurrent && (
                                <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Current Plan
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                                    <span className="text-slate-500 font-medium ml-1">/month</span>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                        <p className="ml-3 text-sm text-slate-600">
                                            Up to <span className="font-bold">{plan.maxRooms}</span> Rooms
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </div>
                                        <p className="ml-3 text-sm text-slate-600">
                                            {plan.maxBookings === -1 ? "Unlimited" : `Up to ${plan.maxBookings}`} Bookings/mo
                                        </p>
                                    </li>
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                                                <Check className="h-4 w-4 text-green-600" />
                                            </div>
                                            <p className="ml-3 text-sm text-slate-600">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={cn(
                                        "w-full py-6 text-lg font-bold transition-all duration-300",
                                        isCurrent
                                            ? "bg-slate-100 text-slate-500 hover:bg-slate-100 cursor-default"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                    )}
                                    disabled={(!isLocked && isCurrent) || !!loading}
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    {loading === plan.id ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                    ) : (isLocked && isCurrent) ? (
                                        "Renew Plan"
                                    ) : isCurrent ? (
                                        "Your Active Plan"
                                    ) : (
                                        `Select ${plan.name}`
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
