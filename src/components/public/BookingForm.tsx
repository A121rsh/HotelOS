"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Hotel, User, Mail, Phone, ShieldCheck, Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    createPublicBooking,
    createRazorpayOrder,
    verifyAndCreateBooking,
    createPayInHotelBooking
} from "@/actions/create-public-booking";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface BookingFormProps {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    roomPrice: number;
    days: number;
    roomType: string;
}

export default function BookingForm({
    hotelId, roomId, checkIn, checkOut, roomPrice, days, roomType
}: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMode, setPaymentMode] = useState<"ONLINE" | "PAY_AT_HOTEL">("ONLINE");
    const totalAmount = roomPrice * days;

    async function handleBooking(formData: FormData) {
        setLoading(true);

        try {
            const res = await createPublicBooking(formData);

            if (res.error) {
                alert(res.error);
                setLoading(false);
                return;
            }

            const bookingData = res.data;
            if (!bookingData) {
                alert("Unexpected error: No booking data returned.");
                setLoading(false);
                return;
            }

            if (paymentMode === "ONLINE") {
                const orderRes = await createRazorpayOrder(totalAmount);

                if (orderRes.error || !orderRes.orderId) {
                    alert("Payment initialization failed. Please try 'Pay at Hotel' option.");
                    setLoading(false);
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderRes.amount,
                    currency: "INR",
                    name: "HotelOS Booking",
                    description: `Booking for ${roomType} (${days} Nights)`,
                    order_id: orderRes.orderId,
                    handler: async function (response: any) {
                        const verifyRes = await verifyAndCreateBooking(response, bookingData);

                        if (verifyRes.success) {
                            router.push(`/hotel/${hotelId}/success?bookingId=${verifyRes.bookingId}`);
                        } else {
                            alert("Payment verification failed! Please contact support.");
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: bookingData.guestName,
                        email: bookingData.guestEmail,
                        contact: bookingData.guestMobile,
                    },
                    theme: {
                        color: "#2563eb", // blue-600
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();

                rzp1.on('payment.failed', function (response: any) {
                    console.error("Payment Failed Data:", response.error);
                    alert(`Payment Failed: ${response.error.description || "Technical Issue"}. Please try again or use 'Pay at Hotel'.`);
                    setLoading(false);
                });
            } else {
                const hotelBookingRes = await createPayInHotelBooking(bookingData);

                if (hotelBookingRes.success) {
                    router.push(`/hotel/${hotelId}/success?bookingId=${hotelBookingRes.bookingId}`);
                } else {
                    alert("Failed to confirm booking. Please try again.");
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <form action={handleBooking} className="space-y-12">
                <input type="hidden" name="hotelId" value={hotelId} />
                <input type="hidden" name="roomId" value={roomId} />
                <input type="hidden" name="checkIn" value={checkIn} />
                <input type="hidden" name="checkOut" value={checkOut} />

                {/* Section: Personal Information */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-100/50">
                                <User className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Identity Protocol</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Input Node</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</Label>
                            <div className="relative group">
                                <Input
                                    name="guestName"
                                    placeholder="e.g. Alexander Pierce"
                                    required
                                    className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-500 font-bold text-slate-900 transition-all text-lg"
                                />
                                <User className="absolute left-6 top-5 h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Transmission</Label>
                            <div className="relative group">
                                <Input
                                    name="guestMobile"
                                    placeholder="+91 00000 00000"
                                    required
                                    className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-500 font-bold text-slate-900 transition-all text-lg"
                                />
                                <Phone className="absolute left-6 top-5 h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Master Email Address</Label>
                        <div className="relative group">
                            <Input
                                name="guestEmail"
                                type="email"
                                placeholder="residence@executive.com"
                                required
                                className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-500 font-bold text-slate-900 transition-all text-lg"
                            />
                            <Mail className="absolute left-6 top-5 h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-[10px] text-slate-400 ml-1 font-bold uppercase tracking-widest italic flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" /> Data encrypted at rest via TLS 1.3
                        </p>
                    </div>
                </div>

                {/* Section: Payment Method */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100/50">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Payment Selection</h2>
                    </div>

                    <RadioGroup
                        defaultValue="ONLINE"
                        onValueChange={(val) => setPaymentMode(val as any)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="relative">
                            <RadioGroupItem value="ONLINE" id="online" className="peer sr-only" />
                            <Label
                                htmlFor="online"
                                className={cn(
                                    "flex flex-col gap-6 rounded-[2.5rem] border-2 p-8 transition-all duration-500 cursor-pointer select-none",
                                    paymentMode === "ONLINE"
                                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/40"
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={cn("p-4 rounded-2xl", paymentMode === "ONLINE" ? "bg-white/10" : "bg-blue-50")}>
                                        <Zap className={cn("h-7 w-7", paymentMode === "ONLINE" ? "text-white" : "text-blue-600")} />
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {paymentMode === "ONLINE" && (
                                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black font-outfit tracking-tight">Secure Cloud Pay</p>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", paymentMode === "ONLINE" ? "text-white/40" : "text-slate-400")}>Instant Authorization Required</p>
                                </div>
                            </Label>
                        </div>

                        <div className="relative">
                            <RadioGroupItem value="PAY_AT_HOTEL" id="pay-later" className="peer sr-only" />
                            <Label
                                htmlFor="pay-later"
                                className={cn(
                                    "flex flex-col gap-6 rounded-[2.5rem] border-2 p-8 transition-all duration-500 cursor-pointer select-none",
                                    paymentMode === "PAY_AT_HOTEL"
                                        ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/40"
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={cn("p-4 rounded-2xl", paymentMode === "PAY_AT_HOTEL" ? "bg-white/10" : "bg-slate-50")}>
                                        <Hotel className={cn("h-7 w-7", paymentMode === "PAY_AT_HOTEL" ? "text-white" : "text-slate-600")} />
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {paymentMode === "PAY_AT_HOTEL" && (
                                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black font-outfit tracking-tight">On-Site Settlement</p>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", paymentMode === "PAY_AT_HOTEL" ? "text-white/40" : "text-slate-400")}>Settlement during Check-in</p>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Final Submit Section */}
                <div className="relative p-1">
                    <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-2xl opacity-10 -z-10" />
                    <div className="bg-slate-900/10 p-4 rounded-[3.2rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-inner">
                        <div className="flex items-center gap-5 px-6">
                            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Authorized Request</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protocol Sequence Locked & Verified</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "h-20 px-14 rounded-[2.2rem] text-sm font-black group transition-all duration-700 uppercase tracking-[0.3em] w-full md:w-auto overflow-hidden relative shadow-2xl active:scale-95",
                                paymentMode === "ONLINE"
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                                    : "bg-slate-900 hover:bg-black text-white shadow-slate-900/30"
                            )}
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Authorizing...</>
                            ) : (
                                <div className="flex items-center gap-4 relative z-10">
                                    <span>Execute Reservation</span>
                                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}
