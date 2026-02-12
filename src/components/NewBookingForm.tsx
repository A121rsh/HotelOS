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
    ShieldCheck,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    Sparkles,
    ArrowRight,
    Search,
    Building2,
    Zap,
    Download,
    Eye,
    Tag,
    Clock,
    CheckCircle2,
    IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 🎨 EXECUTIVE ICON SYSTEM ---
const Icons = {
    Cash: () => (
        <div className="h-6 w-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CreditCard className="h-3.5 w-3.5" />
        </div>
    ),
    UPI: () => (
        <div className="h-6 w-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
            <Zap className="h-3.5 w-3.5" />
        </div>
    ),
    Card: () => (
        <div className="h-6 w-6 bg-slate-900 rounded-lg flex items-center justify-center text-white border border-slate-800">
            <CreditCard className="h-3.5 w-3.5" />
        </div>
    ),
    Aadhar: () => (
        <div className="h-6 w-6 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 border border-orange-100">
            <ShieldCheck className="h-3.5 w-3.5" />
        </div>
    ),
    Passport: () => (
        <div className="h-6 w-6 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100">
            <MapPin className="h-3.5 w-3.5" />
        </div>
    ),
    User: () => (
        <div className="h-6 w-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200">
            <User className="h-3.5 w-3.5" />
        </div>
    )
};

export default function NewBookingForm({ rooms }: { rooms: any[] }) {
    const [loading, setLoading] = useState(false);

    // States
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [advance, setAdvance] = useState(0);
    const [idUrl, setIdUrl] = useState("");

    // Payment Mode & ID Type State for Icon Switching
    const [paymentMode, setPaymentMode] = useState("CASH");
    const [idType, setIdType] = useState("AADHAR");

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

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await createBooking(formData);
        setLoading(false);
        if (res?.error) alert(res.error);
        else window.location.href = "/dashboard/bookings";
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 font-inter">

            {/* 1. ENGINE HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Stay Provisioning</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">Real-time Activation</Badge>
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Identity verification protocol active
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provisioning Node</p>
                        <p className="text-sm font-black text-slate-900 font-outfit uppercase tracking-tight">System Portal v4.2</p>
                    </div>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN: GUEST & IDENTITY */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* 1. PERSONNEL IDENTITY */}
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 border border-white/10">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black font-outfit uppercase tracking-tight">Personnel Identity</h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Guest demographic & registry data</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Legal Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                            <Input name="guestName" placeholder="e.g. Rahul Sharma" required className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mobile Terminal</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                            <Input name="guestMobile" placeholder="e.g. 98765 43210" required className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Communication Endpoint (Optional)</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                        <Input name="guestEmail" placeholder="e.g. rahul@corporate.com" className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. IDENTITY SCAN */}
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-400 border border-white/10">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black font-outfit uppercase tracking-tight">Identity Scan</h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official government documentation</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Credential Type</Label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {idType === 'AADHAR' ? <Icons.Aadhar /> : idType === 'PASSPORT' ? <Icons.Passport /> : <Icons.User />}
                                                </div>
                                                <select
                                                    name="idType"
                                                    className="h-14 w-full pl-12 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                                    onChange={(e) => setIdType(e.target.value)}
                                                >
                                                    <option value="AADHAR">Aadhar Card</option>
                                                    <option value="PASSPORT">Passport</option>
                                                    <option value="DL">Driving License</option>
                                                    <option value="VOTER_ID">Voter Identification</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Credential ID</Label>
                                            <div className="relative group">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                <Input
                                                    name="idNumber"
                                                    placeholder={idType === 'AADHAR' ? "XXXX XXXX XXXX" : "Input identification number"}
                                                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-orange-500 transition-all font-bold text-slate-700"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Physical Scan (Front Side)</Label>
                                        <input type="hidden" name="idImage" value={idUrl} />
                                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-4 bg-slate-50 hover:bg-white hover:border-orange-300 transition-all group shadow-inner">
                                            <ImageUpload
                                                value={idUrl ? [idUrl] : []}
                                                onChange={(url) => setIdUrl(url)}
                                                onRemove={() => setIdUrl("")}
                                            />
                                            {!idUrl && (
                                                <p className="text-[8px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest italic group-hover:text-orange-500 transition-colors">
                                                    Place credential within visual aperture
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STAY & FISCAL VITALS */}
                    <div className="space-y-10">

                        {/* 3. STAY CONFIGURATION */}
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-8 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black font-outfit uppercase tracking-tight">Stay Vitals</h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Temporal occupancy metrics</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Asset Allocation</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <select
                                            name="roomId"
                                            className="h-14 w-full pl-12 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                            onChange={(e) => setSelectedRoomId(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose Registry Node</option>
                                            {rooms.map(room => (
                                                <option key={room.id} value={room.id}>
                                                    Room {room.number} — {room.type} (₹{room.price})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Check-In Node</Label>
                                        <Input type="date" name="checkIn" className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 px-6 focus:bg-white focus:ring-emerald-500 transition-all" onChange={(e) => setCheckIn(e.target.value)} required />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Check-Out Node</Label>
                                        <Input type="date" name="checkOut" className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-700 px-6 focus:bg-white focus:ring-emerald-500 transition-all" onChange={(e) => setCheckOut(e.target.value)} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. FISCAL SETTLEMENT */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-black font-outfit uppercase tracking-tight">Fiscal Settlement</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Liability</p>
                                        <p className="text-4xl font-black font-outfit text-white mt-1 uppercase tracking-tight">₹{totalAmount.toLocaleString()}</p>
                                        <input type="hidden" name="totalAmount" value={totalAmount} />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Advance Provision</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                                                <IndianRupee className="h-5 w-5" />
                                            </div>
                                            <Input
                                                name="advanceAmount"
                                                type="number"
                                                placeholder="0.00"
                                                className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 focus:ring-blue-500 transition-all font-black text-white placeholder:text-slate-600"
                                                onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Payment Protocol</Label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {paymentMode === 'CASH' ? <Icons.Cash /> : paymentMode === 'UPI' ? <Icons.UPI /> : <Icons.Card />}
                                            </div>
                                            <select
                                                name="paymentMode"
                                                className="h-14 w-full pl-12 rounded-2xl border border-white/10 bg-white/5 font-black text-white outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                                onChange={(e) => setPaymentMode(e.target.value)}
                                            >
                                                <option value="CASH" className="text-slate-900">Cash Currency</option>
                                                <option value="UPI" className="text-slate-900">UPI Interface</option>
                                                <option value="CARD" className="text-slate-900">Card Settlement</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-2">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center italic leading-relaxed">
                                        {totalAmount > 0 && advance < totalAmount ? "Guest maintains residual liability for checkout phase." : "Node provisioning fully funded."}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residual</span>
                                        <span className={cn("text-2xl font-black font-outfit tracking-tighter", totalAmount - advance > 0 ? "text-red-400" : "text-emerald-400")}>
                                            ₹{(totalAmount - advance).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ACTIVATION COMMAND */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-xl h-20 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black text-xl uppercase tracking-tighter transition-all shadow-2xl shadow-slate-900/40 group active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin h-8 w-8 mr-4" /> Provisioning Stay Node...</>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <CheckCircle2 className="h-8 w-8 group-hover:scale-110 transition-all" />
                                Authorize Provisioning & Entry
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-all opacity-30" />
                            </div>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black", className)}>
            {children}
        </span>
    );
}