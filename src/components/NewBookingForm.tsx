"use client";

import { useState, useEffect } from "react";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import {
    Loader2,
    Calendar,
    User,
    Phone,
    Mail,
    CheckCircle2,
    IndianRupee,
    Fingerprint,
    ChevronRight,
    ArrowLeft,
    DoorOpen,
    Clock,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

export default function NewBookingForm({ rooms }: { rooms: any[] }) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form States
    const [guestName, setGuestName] = useState("");
    const [guestMobile, setGuestMobile] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [idType, setIdType] = useState("AADHAR");
    const [idNumber, setIdNumber] = useState("");
    const [idUrl, setIdUrl] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [advance, setAdvance] = useState(0);
    const [paymentMode, setPaymentMode] = useState("CASH");

    // Auto-Calculate Bill
    useEffect(() => {
        if (selectedRoomId && checkIn && checkOut) {
            const room = rooms.find(r => r.id === selectedRoomId);
            if (room) {
                const start = new Date(checkIn);
                const end = new Date(checkOut);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (days > 0) setTotalAmount(days * room.price);
                else setTotalAmount(0);
            }
        }
    }, [selectedRoomId, checkIn, checkOut, rooms]);

    const handleNext = () => {
        if (step === 1 && (!guestName || !guestMobile)) {
            toast.error("Please fill in guest details");
            return;
        }
        if (step === 2 && (!selectedRoomId || !checkIn || !checkOut)) {
            toast.error("Please select room and dates");
            return;
        }
        setStep(s => s + 1);
    };

    const handleBack = () => setStep(s => s - 1);

    async function handleSubmit() {
        if (!idNumber || !idUrl) {
            toast.error("Please provide ID details");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("guestName", guestName);
        formData.append("guestMobile", guestMobile);
        formData.append("guestEmail", guestEmail);
        formData.append("idType", idType);
        formData.append("idNumber", idNumber);
        formData.append("idImage", idUrl);
        formData.append("roomId", selectedRoomId);
        formData.append("checkIn", checkIn);
        formData.append("checkOut", checkOut);
        formData.append("totalAmount", totalAmount.toString());
        formData.append("advanceAmount", advance.toString());
        formData.append("paymentMode", paymentMode);

        const res = await createBooking(formData);
        setLoading(false);

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Booking created successfully");
            setTimeout(() => {
                window.location.href = "/dashboard/bookings";
            }, 800);
        }
    }

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    const nights = checkIn && checkOut ? Math.ceil(Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/bookings">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">New Booking</h1>
                        <p className="text-sm text-slate-400 mt-1">Step {step} of 3</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={cn(
                            "h-2 w-16 rounded-full transition-all",
                            step >= i ? "bg-[#a1f554]" : "bg-white/10"
                        )} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Steps */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Guest Details */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#0f110d] rounded-2xl border border-white/10 p-6 md:p-8"
                            >
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                                    <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 flex items-center justify-center border border-[#a1f554]/20">
                                        <User className="h-5 w-5 text-[#a1f554]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Guest Information</h2>
                                        <p className="text-xs text-slate-400">Enter guest details</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Guest Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="guestName" className="text-sm font-semibold text-white">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="guestName"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="John Doe"
                                            className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="guestMobile" className="text-sm font-semibold text-white">
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="guestMobile"
                                                value={guestMobile}
                                                onChange={(e) => setGuestMobile(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="guestEmail" className="text-sm font-semibold text-white">
                                                Email (Optional)
                                            </Label>
                                            <Input
                                                id="guestEmail"
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                placeholder="john@example.com"
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Button 
                                        onClick={handleNext} 
                                        className="w-full h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold"
                                    >
                                        Next: Room & Dates
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Room & Dates */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#0f110d] rounded-2xl border border-white/10 p-6 md:p-8"
                            >
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                                    <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 flex items-center justify-center border border-[#a1f554]/20">
                                        <DoorOpen className="h-5 w-5 text-[#a1f554]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Room & Dates</h2>
                                        <p className="text-xs text-slate-400">Select room and booking dates</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Room Selection */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-white">Select Room *</Label>
                                        <Select onValueChange={setSelectedRoomId} value={selectedRoomId}>
                                            <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 focus:ring-1 focus:ring-[#a1f554]/30 text-white">
                                                <SelectValue placeholder="Choose a room" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-white/10 bg-[#0f110d] text-white">
                                                {rooms.map(room => (
                                                    <SelectItem key={room.id} value={room.id} className="focus:bg-white/10">
                                                        Room {room.number} - {room.type.replace('_', ' ')} - ₹{room.price}/night
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Check-in Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="checkIn" className="text-sm font-semibold text-white">
                                                Check-in Date *
                                            </Label>
                                            <Input
                                                id="checkIn"
                                                type="date"
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                                required
                                            />
                                        </div>

                                        {/* Check-out Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="checkOut" className="text-sm font-semibold text-white">
                                                Check-out Date *
                                            </Label>
                                            <Input
                                                id="checkOut"
                                                type="date"
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <Button 
                                        onClick={handleBack}
                                        variant="outline"
                                        className="h-12 px-6 border-white/10 bg-transparent hover:bg-white/5 text-white rounded-xl"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={handleNext}
                                        className="flex-1 h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold"
                                    >
                                        Next: Payment & ID
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Payment & ID */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#0f110d] rounded-2xl border border-white/10 p-6 md:p-8"
                            >
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                                    <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 flex items-center justify-center border border-[#a1f554]/20">
                                        <CheckCircle2 className="h-5 w-5 text-[#a1f554]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Payment & Verification</h2>
                                        <p className="text-xs text-slate-400">Complete booking details</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* ID Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-white">ID Type *</Label>
                                            <Select onValueChange={setIdType} value={idType}>
                                                <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 focus:ring-1 focus:ring-[#a1f554]/30 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-white/10 bg-[#0f110d] text-white">
                                                    <SelectItem value="AADHAR">Aadhar Card</SelectItem>
                                                    <SelectItem value="PASSPORT">Passport</SelectItem>
                                                    <SelectItem value="DL">Driving License</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="idNumber" className="text-sm font-semibold text-white">
                                                ID Number *
                                            </Label>
                                            <Input
                                                id="idNumber"
                                                value={idNumber}
                                                onChange={(e) => setIdNumber(e.target.value)}
                                                placeholder="Enter ID number"
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* ID Upload */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-white">Upload ID Photo *</Label>
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 bg-white/5">
                                            <ImageUpload
                                                value={idUrl ? [idUrl] : []}
                                                onChange={(url) => setIdUrl(url)}
                                                onRemove={() => setIdUrl("")}
                                                label="Upload ID"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-6">
                                        <h3 className="text-sm font-semibold text-white mb-4">Payment Details</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="advance" className="text-sm font-semibold text-white">
                                                    Advance Amount
                                                </Label>
                                                <Input
                                                    id="advance"
                                                    type="number"
                                                    value={advance}
                                                    onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
                                                    placeholder="0"
                                                    className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-white">Payment Mode</Label>
                                                <Select onValueChange={setPaymentMode} value={paymentMode}>
                                                    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 focus:ring-1 focus:ring-[#a1f554]/30 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-white/10 bg-[#0f110d] text-white">
                                                        <SelectItem value="CASH">Cash</SelectItem>
                                                        <SelectItem value="UPI">UPI</SelectItem>
                                                        <SelectItem value="CARD">Card</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <Button 
                                        onClick={handleBack}
                                        variant="outline"
                                        className="h-12 px-6 border-white/10 bg-transparent hover:bg-white/5 text-white rounded-xl"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={handleSubmit}
                                        className="flex-1 h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Create Booking
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-[#0f110d] rounded-2xl border border-white/10 p-6 sticky top-24">
                        <h3 className="text-sm font-semibold text-white mb-6">Booking Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                <DoorOpen className="h-5 w-5 text-[#a1f554]" />
                                <span className="text-sm text-white">
                                    {selectedRoom ? `Room ${selectedRoom.number} - ${selectedRoom.type.replace('_', ' ')}` : 'No room selected'}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                <Clock className="h-5 w-5 text-[#8ba4b8]" />
                                <span className="text-sm text-white">
                                    {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Select dates'}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-6" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Amount</span>
                                <span className="text-white font-semibold">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Advance</span>
                                <span className="text-[#a1f554] font-semibold">₹{advance.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10 my-3" />
                            <div className="flex justify-between">
                                <span className="text-sm font-semibold text-white">Balance Due</span>
                                <span className={cn(
                                    "text-lg font-bold",
                                    totalAmount - advance > 0 ? "text-red-400" : "text-[#a1f554]"
                                )}>
                                    ₹{(totalAmount - advance).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-[#a1f554]/10 rounded-xl border border-[#a1f554]/20">
                            <p className="text-xs text-slate-300 text-center">
                                All booking information is encrypted and secure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}