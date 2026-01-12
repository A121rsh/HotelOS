"use client";

import { useState, useEffect } from "react";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Calendar } from "lucide-react";

// --- 🎨 CUSTOM REAL ICONS (Colorful) ---
const Icons = {
  Cash: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5"/>
      <path d="M12 6V18M8 10C8 10 9.5 9 12 9C14.5 9 16 10 16 12C16 14 14.5 15 12 15C9.5 15 8 16 8 18" stroke="#15803D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  UPI: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect width="24" height="24" rx="4" fill="#F0FDF4"/>
      <path d="M4 6L12 14L20 6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 12L12 20L20 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Card: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5"/>
      <path d="M2 10H22" stroke="#2563EB" strokeWidth="1.5"/>
      <path d="M6 15H10" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Aadhar: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2C8 2 6 5 6 9C6 13 9 16 12 16C15 16 18 13 18 9C18 5 16 2 12 2Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5"/>
      <path d="M8 22V19C8 17.5 9.5 17 12 17C14.5 17 16 17.5 16 19V22" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 12V12.01" stroke="#EA580C" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Passport: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <rect x="4" y="3" width="16" height="18" rx="2" fill="#1E40AF"/>
      <circle cx="12" cy="12" r="4" stroke="#FBBF24" strokeWidth="1.5"/>
      <path d="M12 10V14M10 12H14" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5"/>
        <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
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
    <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 max-w-4xl mx-auto">
      
      <form action={handleSubmit} className="space-y-8">
        
        {/* 1. ROOM & DATES */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600"/> 
                </div>
                <h3 className="text-lg font-bold text-slate-900">Stay Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-slate-600">Select Room</Label>
                    <div className="relative">
                        <select 
                            name="roomId" 
                            className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose Available Room --</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    Room {room.number} ({room.type}) — ₹{room.price}/night
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-600">Check-In</Label>
                    <Input type="date" name="checkIn" className="h-11" onChange={(e) => setCheckIn(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-600">Check-Out</Label>
                    <Input type="date" name="checkOut" className="h-11" onChange={(e) => setCheckOut(e.target.value)} required />
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* 2. GUEST & KYC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Guest Details */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Icons.User />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Guest Details</h3>
                </div>
                <div className="space-y-4">
                    <Input name="guestName" placeholder="e.g. Rahul Sharma" required className="h-11 bg-slate-50 border-slate-200" />
                    <Input name="guestMobile" placeholder="e.g. 98765 43210" required className="h-11 bg-slate-50 border-slate-200" />
                    <Input name="guestEmail" placeholder="e.g. rahul@gmail.com (Optional)" className="h-11 bg-slate-50 border-slate-200" />
                </div>
            </div>

            {/* KYC Details */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-orange-50 rounded-lg flex items-center justify-center">
                         {idType === 'AADHAR' ? <Icons.Aadhar /> : idType === 'PASSPORT' ? <Icons.Passport /> : <Icons.Card />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Identity Proof</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <select 
                            name="idType" 
                            className="h-11 w-1/3 rounded-lg border border-slate-300 px-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => setIdType(e.target.value)}
                        >
                            <option value="AADHAR">Aadhar Card</option>
                            <option value="PASSPORT">Passport</option>
                            <option value="DL">Driving License</option>
                        </select>
                        <Input 
                            name="idNumber" 
                            placeholder={idType === 'AADHAR' ? "XXXX XXXX XXXX" : "ID Number"} 
                            className="w-2/3 h-11 bg-white" 
                            required 
                        />
                    </div>
                    
                    {/* Image Upload */}
                    <input type="hidden" name="idImage" value={idUrl} />
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <ImageUpload 
                            value={idUrl ? [idUrl] : []} 
                            onChange={(url) => setIdUrl(url)}
                            onRemove={() => setIdUrl("")}
                        />
                        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium uppercase tracking-wide">
                            Scan or Upload Front Side
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* 3. PAYMENT (Real Feel) */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                     {paymentMode === 'CASH' ? <Icons.Cash /> : paymentMode === 'UPI' ? <Icons.UPI /> : <Icons.Card />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">Payment & Billing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Bill Amount</Label>
                    <div className="h-11 flex items-center px-4 bg-slate-200 rounded-lg border border-slate-300 text-slate-500 font-mono text-xl font-bold">
                        ₹ {totalAmount.toLocaleString()}
                    </div>
                    <input type="hidden" name="totalAmount" value={totalAmount} />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Advance Paid</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <Input 
                            name="advanceAmount" 
                            type="number" 
                            placeholder="0" 
                            className="h-11 pl-8 bg-white font-semibold text-lg border-green-200 focus:ring-green-500"
                            onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)} 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Payment Mode</Label>
                    <select 
                        name="paymentMode" 
                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="CASH">Cash Payment</option>
                        <option value="UPI">UPI / GPay / PhonePe</option>
                        <option value="CARD">Credit / Debit Card</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                <div className="text-sm text-slate-500">
                    {totalAmount > 0 && advance < totalAmount ? "Guest needs to pay remaining amount at checkout." : "Full payment received."}
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase mr-2">Balance Due</span>
                    <span className={`text-2xl font-bold ${totalAmount - advance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹ {(totalAmount - advance).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>

        {/* Submit */}
        <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 h-14 text-lg font-semibold shadow-xl rounded-xl transition-all active:scale-[0.99]" 
            disabled={loading}
        >
            {loading ? <Loader2 className="animate-spin mr-2"/> : "Confirm Booking & Check-In Guest"}
        </Button>

      </form>
    </div>
  );
}