import Link from "next/link";
import { Hotel, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicHeaderProps {
    hotel: {
        id: string;
        name: string;
        logo: string | null;
    };
}

export default function PublicHeader({ hotel }: PublicHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <Link href={`/hotel/${hotel.id}`} className="flex items-center gap-3 group">
                    <div className="h-12 w-12 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20 group-hover:scale-110 transition-transform overflow-hidden">
                        {hotel.logo ? (
                            <img src={hotel.logo} alt={hotel.name} className="w-full h-full object-cover" />
                        ) : (
                            <Hotel className="h-6 w-6 text-[#a1f554]" />
                        )}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white tracking-tight">{hotel.name}</p>
                        <p className="text-[10px] text-[#a1f554] font-bold uppercase tracking-widest leading-none">Official Portal</p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10 gap-2">
                        My Bookings
                    </Button>
                    <Button className="bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold rounded-xl px-6 h-11 flex gap-2">
                        <UserCircle className="h-5 w-5" />
                        Sign In
                    </Button>
                </div>
            </div>
        </header>
    );
}
