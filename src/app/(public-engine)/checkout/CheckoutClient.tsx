"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    createSubscriptionOrder,
    verifyAndActivateSubscription,
    activateFreePlan
} from "@/actions/subscription";
import {
    Loader2,
    ShieldCheck,
    Zap,
    CheckCircle2,
    CreditCard,
    Building2,
    ArrowRight,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get("planId");
    const hotelId = searchParams.get("hotelId");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!planId || !hotelId) {
            router.push("/");
            return;
        }

        async function initCheckout() {
            const res = await createSubscriptionOrder(planId!);
            if (res.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            if (res.isFree) {
                // Auto activate free plan
                const activateRes = await activateFreePlan(planId!, hotelId!);
                if (activateRes.success) {
                    setIsSuccess(true);
                    setTimeout(() => {
                        router.push("/welcome");
                    }, 2000);
                } else {
                    setError(activateRes.error!);
                }
            } else {
                setOrderData(res);
            }
            setLoading(false);
        }

        initCheckout();
    }, [planId, hotelId, router]);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            toast.error("Security protocols are still initializing. Please wait a moment.");
            return;
        }
        if (!orderData) return;
        setProcessing(true);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "HotelOS Subscription",
            description: `Payment for ${orderData.planName} Plan`,
            order_id: orderData.orderId,
            handler: async function (response: any) {
                const verifyRes = await verifyAndActivateSubscription(
                    response.razorpay_payment_id,
                    response.razorpay_order_id,
                    response.razorpay_signature,
                    planId!,
                    hotelId!
                );

                if (verifyRes.success) {
                    setIsSuccess(true);
                    toast.success("Payment successful! Welcome to the elite.");
                    setTimeout(() => {
                        router.push("/welcome");
                    }, 2500);
                } else {
                    setError(verifyRes.error!);
                    setProcessing(false);
                }
            },
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            theme: {
                color: "#2563eb"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            setError(response.error.description);
            setProcessing(false);
        });
        rzp.open();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-6 p-20">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-2xl animate-spin">
                    <Loader2 className="h-10 w-10 text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Payment Gateway</span>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-none shadow-[0_32px_128px_-32px_rgba(0,0,0,0.15)] bg-white/90 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 px-12"
                            >
                                <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-10 shadow-xl shadow-emerald-500/10 border border-emerald-100">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h3 className="text-4xl font-black font-outfit text-slate-900 mb-4 uppercase italic tracking-tighter">Handshake Established.</h3>
                                <p className="text-slate-500 font-bold text-lg mb-12">
                                    Net settlement received. Your enterprise property node is being allocated on our high-authority cloud.
                                    <br /><span className="text-blue-600">Redirecting to provisioning console...</span>
                                </p>
                                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-full border border-slate-100 max-w-xs mx-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Synchronizing Authority
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="checkout">
                                <CardHeader className="text-center pt-14 pb-8 px-12">
                                    <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                                        <CreditCard className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none italic underline decoration-blue-500 underline-offset-8">
                                        Finalize <span className="text-blue-600">Investment</span>
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium text-lg mt-6">
                                        Review your node selection and authorize the secure transaction to activate your enterprise environment.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-12 pb-8">
                                    {error && (
                                        <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 flex items-center gap-4 mb-8">
                                            <ShieldCheck className="h-6 w-6 shrink-0" />
                                            <span className="text-xs font-black uppercase tracking-tight">Security Exception: {error}</span>
                                        </div>
                                    )}

                                    {/* 2. INSTITUTIONAL BILLING INFRASTRUCTURE */}
                                    <div className="space-y-6">
                                        <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 backdrop-blur-md">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Fiscal Identity</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Billing & Tax Compliance Node</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Company / Legal Name</Label>
                                                    <Input
                                                        placeholder="Property Holdings Ltd."
                                                        className="h-12 rounded-xl border-slate-200 bg-white/50 text-[11px] font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax ID / GSTIN (Optional)</Label>
                                                    <Input
                                                        placeholder="29AAAAA0000A1Z5"
                                                        className="h-12 rounded-xl border-slate-200 bg-white/50 text-[11px] font-bold"
                                                    />
                                                </div>
                                                <div className="col-span-full space-y-1.5">
                                                    <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Address</Label>
                                                    <Input
                                                        placeholder="Suite 500, Corporate Plaza, MG Road"
                                                        className="h-12 rounded-xl border-slate-200 bg-white/50 text-[11px] font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                                <Zap className="h-32 w-32" />
                                            </div>
                                            <div className="relative z-10 flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Selected Fiscal Node</p>
                                                    <h3 className="text-3xl font-black font-outfit tracking-tight capitalize">{orderData?.planName} Bundle</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Settlement</p>
                                                    <h3 className="text-3xl font-black font-outfit tracking-tight">₹{orderData?.amount / 100}</h3>
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Governance Active</span>
                                                </div>
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">ORDER_ID: {orderData?.orderId}</span>
                                            </div>
                                        </div>

                                        {/* Trust Badges */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">AES-256 TLS</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">End-to-End Encryption</p>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Instant Provision</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Zero-Latency Sync</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="px-12 pb-14 pt-4">
                                    <Button
                                        onClick={handlePayment}
                                        disabled={processing || !orderData}
                                        className="w-full h-20 btn-premium rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_24px_48px_-12px_rgba(37,99,235,0.3)] group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        {processing ? (
                                            <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Authorizing Settlement...</>
                                        ) : (
                                            <>
                                                Authorize Payment Protocol
                                                <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                <p className="text-center mt-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]"> Secure Fiscal node regulated by RBI guidelines </p>
            </motion.div>
        </>
    );
}
