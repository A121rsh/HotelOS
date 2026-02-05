"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CalendarDays, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HotelSearch({ hotelId }: { hotelId: string }) {
  const router = useRouter();
  
  // Default: Aaj ki date aur Kal ki date
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  function handleSearch() {
    // Search Page par redirect karo (Query Params ke sath)
    router.push(`/hotel/${hotelId}/search?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto -mt-16 relative z-10 flex flex-col md:flex-row gap-4 items-end">
        
        {/* Check In */}
        <div className="w-full space-y-2">
            <Label className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <CalendarDays className="h-4 w-4" /> Check-In
            </Label>
            <Input 
                type="date" 
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 border-slate-200 focus:border-blue-500 font-medium"
            />
        </div>

        {/* Check Out */}
        <div className="w-full space-y-2">
            <Label className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <CalendarDays className="h-4 w-4" /> Check-Out
            </Label>
            <Input 
                type="date" 
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 border-slate-200 focus:border-blue-500 font-medium"
            />
        </div>

        {/* Guests */}
        <div className="w-full md:w-48 space-y-2">
            <Label className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <Users className="h-4 w-4" /> Guests
            </Label>
            <Input 
                type="number" 
                min={1} 
                max={10}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="h-12 border-slate-200 focus:border-blue-500 font-medium"
            />
        </div>

        {/* Search Button */}
        <Button 
            onClick={handleSearch}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold w-full md:w-auto"
        >
            <Search className="mr-2 h-4 w-4" /> Search
        </Button>
    </div>
  );
}