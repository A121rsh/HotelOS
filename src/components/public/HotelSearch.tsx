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
        router.push(`/hotel/${hotelId}/search?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    }

    return (
        <div className="max-w-5xl mx-auto -mt-20 relative z-30 px-4">
            <div className="bg-white/70 backdrop-blur-3xl p-2 rounded-[3rem] shadow-2xl border border-white/20">
                <div className="bg-white rounded-[2.8rem] p-4 shadow-inner flex flex-col md:flex-row gap-2 items-stretch">

                    {/* Check In */}
                    <div className="flex-1 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                <CalendarDays className="h-3.5 w-3.5 text-blue-600" /> Check-In
                            </Label>
                            <input
                                type="date"
                                min={today}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="bg-transparent border-none outline-none text-lg font-black font-outfit text-slate-900 w-full cursor-pointer focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-slate-100 my-8" />

                    {/* Check Out */}
                    <div className="flex-1 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                <CalendarDays className="h-3.5 w-3.5 text-blue-600" /> Check-Out
                            </Label>
                            <input
                                type="date"
                                min={checkIn}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="bg-transparent border-none outline-none text-lg font-black font-outfit text-slate-900 w-full cursor-pointer focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-slate-100 my-8" />

                    {/* Guests */}
                    <div className="md:w-60 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                <Users className="h-3.5 w-3.5 text-blue-600" /> Guests
                            </Label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="bg-transparent border-none outline-none text-lg font-black font-outfit text-slate-900 w-16 focus:ring-0"
                                />
                                <span className="text-slate-400 font-bold text-sm">Members</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <Button
                        onClick={handleSearch}
                        className="md:w-52 h-auto py-8 md:py-0 rounded-[2.2rem] bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 group transition-all"
                    >
                        <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Find Rooms
                    </Button>
                </div>
            </div>
        </div>
    );
}
