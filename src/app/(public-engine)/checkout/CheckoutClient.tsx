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
    Lock,
    Hotel,
    Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { toast } from "sonner";
import Link from "next/link";

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
                        router.push("/login");
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
                const tempEmail = sessionStorage.getItem("temp_reg_email");
                const tempPass = sessionStorage.getItem("temp_reg_pass");
                const tempName = sessionStorage.getItem("temp_reg_name");

                const verifyRes = await verifyAndActivateSubscription(
                    response.razorpay_payment_id,
                    response.razorpay_order_id,
                    response.razorpay_signature,
                    planId!,
                    hotelId!,
                    tempEmail || undefined,
                    tempPass || undefined,
                    tempName || undefined
                );

                // Clear sensitive data
                sessionStorage.removeItem("temp_reg_email");
                sessionStorage.removeItem("temp_reg_pass");
                sessionStorage.removeItem("temp_reg_name");

                if (verifyRes.success) {
                    setIsSuccess(true);
                    toast.success("Payment successful! Welcome to the elite.");
                    setTimeout(() => {
                        router.push("/login");
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
                color: "#b5f347"
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
            <div className="flex flex-col items-center gap-8 p-20 h-screen w-full bg-[#0a0a0a] justify-center">
                <div className="h-24 w-24 rounded-[2.5rem] bg-[#111111] border border-[#b5f347]/20 flex items-center justify-center shadow-[0_0_50px_rgba(181,243,71,0.1)] relative overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="h-10 w-10 text-[#b5f347]" />
                    </motion.div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#b5f34722_0%,transparent_70%)]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-80">Synchronizing Gateway</span>
                    <span className="text-[8px] font-bold text-slate-800 uppercase tracking-widest">Protocol: Razorpay Security v3.1</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#0a0a0a] flex overflow-hidden font-outfit relative">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* LEFT SIDE: ORDER SUMMARY & BRANDING */}
            <div className="hidden lg:flex w-[40%] h-full bg-[#090909] border-r border-white/5 flex-col relative overflow-hidden p-16 justify-between">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#b5f347]/5 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                </div>

                {/* Header/Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16 group w-fit">
                        <div className="bg-[#b5f347] p-2.5 rounded-xl shadow-2xl shadow-[#b5f347]/20 group-hover:rotate-[10deg] transition-all">
                            <Hotel className="h-6 w-6 text-black" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter uppercase italic-none">
                            Hotel<span className="text-[#b5f347]">OS</span>
                        </span>
                    </Link>

                    {/* Summary Card Content */}
                    <div className="space-y-12">
                        <div>
                            <p className="text-[10px] font-black text-[#b5f347] uppercase tracking-[0.5em] mb-6">Allocation Summary</p>
                            <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-[0.9]">
                                {orderData?.planName || "Core"} <span className="text-slate-800">Node</span>
                            </h2>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                                You are provisioning a secure enterprise node within the global HotelOS network.
                            </p>
                        </div>

                        <div className="space-y-6 pt-12 border-t border-white/5">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Base Subscription</span>
                                <span className="text-2xl font-black text-white tracking-tighter">₹{orderData ? orderData.amount / 100 : "..."}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Node Allocation Fee</span>
                                <span className="text-2xl font-black text-[#b5f347] tracking-tighter">₹0</span>
                            </div>
                        </div>

                        <div className="pt-12 flex flex-col gap-6">
                            <div className="flex justify-between w-full items-baseline">
                                <span className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Total Settlement</span>
                                <span className="text-6xl font-black text-white tracking-tighter">₹{orderData ? orderData.amount / 100 : "..."}</span>
                            </div>
                            <div className="w-full h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center px-4 border border-white/5">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">{orderData?.orderId || "GENERATING_ID..."}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer/Trust */}
                <div className="relative z-10 opacity-30">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-white" />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">SECURED BY RAZORPAY TRUST LAYER</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: PAYMENT FORM */}
            <div className="flex-1 w-full h-full relative flex flex-col bg-[#0a0a0a] overflow-y-auto">
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-[#b5f347]/5 rounded-full blur-[160px]" />
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full p-8 lg:p-24 relative z-10">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 bg-[#111111]/50 border border-white/5 rounded-[3rem] p-12"
                            >
                                <div className="mx-auto h-24 w-24 rounded-3xl bg-[#b5f347] text-black flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(181,243,71,0.2)]">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h3 className="text-4xl font-black font-outfit text-white mb-4 uppercase italic tracking-tighter">Settlement Confirmed.</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mb-12 opacity-60 max-w-sm mx-auto">
                                    Authority established. Your enterprise property node is being provisioned.
                                </p>
                                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-[#b5f347] uppercase tracking-[0.4em] bg-[#b5f347]/5 py-4 rounded-2xl border border-[#b5f347]/10 max-w-xs mx-auto">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Redirecting to HQ
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="checkout"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                {/* Header */}
                                <div>
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="h-16 w-16 rounded-3xl bg-[#b5f347]/10 border border-[#b5f347]/20 flex items-center justify-center shadow-[0_0_30px_rgba(181,243,71,0.1)]">
                                            <CreditCard className="h-7 w-7 text-[#b5f347]" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black font-outfit text-white tracking-tighter uppercase leading-none mb-2">Finalize <span className="text-[#b5f347]">Handshake</span></h3>
                                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Node Investment Protocol</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-lg">
                                        Complete your subscription to activate full administrative access. Your connection is secured with end-to-end encryption.
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4">
                                        <ShieldCheck className="h-6 w-6 text-red-500 shrink-0" />
                                        <span className="text-red-500 font-black text-[10px] uppercase tracking-widest leading-none">Security Exception: {error}</span>
                                    </div>
                                )}

                                <div className="space-y-8 bg-[#111111]/50 border border-white/5 rounded-3xl p-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 opacity-60">Legal Entity Identification</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <Input
                                                    placeholder="Property Holdings Node"
                                                    className="h-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 transition-all text-sm font-bold text-white placeholder:text-slate-800"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                                    <Building2 className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <Input
                                                    placeholder="Tax ID / GSTIN (Optional)"
                                                    className="h-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 transition-all text-sm font-bold text-white placeholder:text-slate-800"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                                    <Globe className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            onClick={handlePayment}
                                            disabled={processing || !orderData}
                                            className="w-full h-20 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_24px_48px_-12px_rgba(181,243,71,0.2)] group relative overflow-hidden active:scale-[0.98] transition-all"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                            <div className="flex items-center justify-center gap-4 relative z-10 hidden group-hover:flex">
                                                <span>Execute Transaction</span>
                                                <ArrowRight className="h-5 w-5" />
                                            </div>
                                            <div className="flex items-center justify-center gap-4 relative z-10 group-hover:hidden">
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        <span>Authorizing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Authorize Settlement</span>
                                                        <ArrowRight className="h-5 w-5" />
                                                    </>
                                                )}
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                {/* TRUST ICONS */}
                                <div className="grid grid-cols-3 gap-4 opacity-40">
                                    {[
                                        { icon: Lock, label: "AES-256", sub: "Encrypted" },
                                        { icon: ShieldCheck, label: "PCI DSS", sub: "Compliant" },
                                        { icon: Zap, label: "Instant", sub: "Provisions" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center text-center gap-2">
                                            <item.icon className="h-4 w-4 text-[#b5f347]" />
                                            <div>
                                                <p className="text-[8px] font-black text-white uppercase tracking-widest">{item.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
