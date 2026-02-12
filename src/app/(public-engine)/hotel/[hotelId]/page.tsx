import { db } from "@/lib/db";
import HotelSearch from "@/components/public/HotelSearch";
import { Wifi, Tv, Coffee, Car, MapPin, Star, ShieldCheck, Sparkles, Building2 } from "lucide-react";

interface PageProps {
    params: Promise<{ hotelId: string }>;
}

export default async function PublicHotelPage({ params }: PageProps) {
    const resolvedParams = await params;
    const hotelId = resolvedParams.hotelId;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId }
    });

    if (!hotel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border border-slate-100 max-w-lg">
                    <div className="h-24 w-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <Building2 className="h-12 w-12" />
                    </div>
                    <h1 className="text-4xl font-black font-outfit text-slate-900 mb-4 tracking-tight">Node Not Found</h1>
                    <p className="text-slate-500 font-medium mb-0">The requested property identifier is either invalid or decommissioned. Reference: {hotelId}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/50 min-h-screen pb-20">
            {/* CINEMATIC HERO SECTION */}
            <div className="relative h-[650px] bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900 z-10" />
                    {hotel.images.length > 0 ? (
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover scale-105 animate-slow-zoom"
                        />
                    ) : (
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
                    )}
                </div>

                {/* Hero Content */}
                <div className="relative z-20 text-center max-w-4xl px-4 pt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="h-3 w-3 text-blue-400 fill-current" />
                        <span>Executive Hospitality Node</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-outfit text-white tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {hotel.name}
                    </h1>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 font-bold mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-400" />
                            <span className="text-lg">Premium Location</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-400 fill-current" />
                            <span className="text-lg">4.9 Overall Rating</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            <span className="text-lg">Verified Property</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING SEARCH INTERFACE */}
            <div className="max-w-7xl mx-auto px-4">
                <HotelSearch hotelId={hotelId} />
            </div>

            {/* AMENITIES PROTOCOL GRID */}
            <div className="max-w-7xl mx-auto px-4 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 tracking-tight mb-4">World-Class <span className="text-blue-600">Infrastructure.</span></h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Every node within {hotel.name} is engineered for peak guest comfort. We've optimized the hospitality stack to ensure a seamless residential experience.
                        </p>
                    </div>
                    <div className="hidden lg:block pb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Protocol Status</p>
                        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-xl border border-slate-50">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black text-slate-900 uppercase">All Systems Optimal</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(hotel.amenities.length > 0 ? hotel.amenities : ["Wifi", "Smart TV", "Breakfast", "Parking"]).map((amenity) => {
                        const iconKey = amenity.toUpperCase();
                        const Icon = iconKey.includes("WIFI") ? Wifi :
                            iconKey.includes("TV") ? Tv :
                                iconKey.includes("COFFEE") || iconKey.includes("BREAKFAST") ? Coffee :
                                    iconKey.includes("PARKING") ? Car : ShieldCheck;

                        return (
                            <div key={amenity} className="group p-10 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:-translate-y-2">
                                <div className="h-20 w-20 bg-slate-50 text-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black font-outfit text-slate-900 mb-2 uppercase tracking-tight">{amenity}</h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-none">Operational</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PROPERTY METRICS BAR */}
            <div className="bg-slate-900 py-16 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    <div>
                        <p className="text-3xl font-black font-outfit text-white mb-1">50+</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Premium Suites</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black font-outfit text-white mb-1">10k</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Guest Check-ins</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black font-outfit text-white mb-1">24/7</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Protocol</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black font-outfit text-white mb-1">4.9</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satisfaction Index</p>
                    </div>
                </div>
            </div>
        </div>
    );
}