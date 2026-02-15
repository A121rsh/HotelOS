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
        <div className="w-full">
            <div className="bg-[#0f110d]/40 backdrop-blur-3xl p-2 rounded-[3rem] shadow-2xl border border-white/10">
                <div className="bg-[#0f110d] rounded-[2.8rem] p-4 shadow-inner flex flex-col md:flex-row gap-2 items-stretch">

                    {/* Check In */}
                    <div className="flex-1 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                <CalendarDays className="h-3.5 w-3.5 text-[#a1f554]" /> Check-In
                            </Label>
                            <input
                                type="date"
                                min={today}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="bg-transparent border-none outline-none text-lg font-bold text-white w-full cursor-pointer focus:ring-0 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-white/5 my-8" />

                    {/* Check Out */}
                    <div className="flex-1 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                <CalendarDays className="h-3.5 w-3.5 text-[#a1f554]" /> Check-Out
                            </Label>
                            <input
                                type="date"
                                min={checkIn}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="bg-transparent border-none outline-none text-lg font-bold text-white w-full cursor-pointer focus:ring-0 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-white/5 my-8" />

                    {/* Guests */}
                    <div className="md:w-60 group">
                        <div className="h-full p-6 rounded-[2rem] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 flex flex-col justify-center">
                            <Label className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                <Users className="h-3.5 w-3.5 text-[#a1f554]" /> Guests
                            </Label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="bg-transparent border-none outline-none text-lg font-bold text-white w-16 focus:ring-0"
                                />
                                <span className="text-slate-500 font-bold text-sm">Members</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <Button
                        onClick={handleSearch}
                        className="md:w-52 h-auto py-8 md:py-0 rounded-[2.2rem] bg-[#a1f554] hover:bg-[#8fd445] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#a1f554]/10 group transition-all"
                    >
                        <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Find Rooms
                    </Button>
                </div>
            </div>
        </div>
    );
}

