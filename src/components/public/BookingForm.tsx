"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Hotel } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    createPublicBooking,
    createRazorpayOrder,
    verifyAndCreateBooking,
    createPayInHotelBooking
} from "@/actions/create-public-booking";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
            // 1. Validate & Prepare Data (Common for both)
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

            // ==========================================
            // CASE 1: ONLINE PAYMENT (Razorpay)
            // ==========================================
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
                        color: "#0f172a", // slate-900
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
                    // Log error details for better debugging
                    console.error("Payment Failed Data:", response.error);
                    alert(`Payment Failed: ${response.error.description || "Technical Issue"}. Please try again or use 'Pay at Hotel'.`);
                    setLoading(false);
                });
            }
            // ==========================================
            // CASE 2: PAY AT HOTEL
            // ==========================================
            else {
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

            <Card>
                <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleBooking} className="space-y-6">
                        <input type="hidden" name="hotelId" value={hotelId} />
                        <input type="hidden" name="roomId" value={roomId} />
                        <input type="hidden" name="checkIn" value={checkIn} />
                        <input type="hidden" name="checkOut" value={checkOut} />

                        {/* Guest Details */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input name="guestName" placeholder="e.g. Rahul Kumar" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mobile Number</Label>
                                    <Input name="guestMobile" placeholder="+91 98765..." required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input name="guestEmail" type="email" placeholder="rahul@example.com" required />
                            </div>
                        </div>

                        {/* Payment Mode Selection */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <Label className="text-base font-semibold">Payment Option</Label>
                            <RadioGroup
                                defaultValue="ONLINE"
                                onValueChange={(val) => setPaymentMode(val as any)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <RadioGroupItem value="ONLINE" id="online" className="peer sr-only" />
                                    <Label
                                        htmlFor="online"
                                        className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold">Pay Now</span>
                                                <span className="text-xs text-muted-foreground">UPI, Cards, Netbanking</span>
                                            </div>
                                        </div>
                                    </Label>
                                </div>

                                <div>
                                    <RadioGroupItem value="PAY_AT_HOTEL" id="pay-later" className="peer sr-only" />
                                    <Label
                                        htmlFor="pay-later"
                                        className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Hotel className="h-5 w-5 text-orange-600" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold">Pay at Hotel</span>
                                                <span className="text-xs text-muted-foreground">Book now, pay later</span>
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className={`w-full h-12 text-lg font-bold transition-all ${paymentMode === "ONLINE"
                                        ? "bg-slate-900 hover:bg-slate-800"
                                        : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                ) : (
                                    <>
                                        {paymentMode === "ONLINE" ? (
                                            <><CreditCard className="mr-2 h-5 w-5" /> Pay ₹{totalAmount.toLocaleString()} Now</>
                                        ) : (
                                            <><Hotel className="mr-2 h-5 w-5" /> Confirm Booking (Pay Later)</>
                                        )}
                                    </>
                                )}
                            </Button>

                            {paymentMode === "ONLINE" && (
                                <p className="text-xs text-center text-slate-500 mt-2">
                                    Secure payment via Razorpay. Your booking is confirmed instantly.
                                </p>
                            )}
                            {paymentMode === "PAY_AT_HOTEL" && (
                                <p className="text-xs text-center text-slate-500 mt-2">
                                    Your room will be reserved. Please pay at the reception upon arrival.
                                </p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
