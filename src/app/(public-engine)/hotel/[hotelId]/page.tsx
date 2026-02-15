import { db } from "@/lib/db";
import HotelSearch from "@/components/public/HotelSearch";
import { Wifi, Tv, Coffee, Car, MapPin, Star, ShieldCheck, Building2, Sparkles, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ hotelId: string }>;
}

export default async function PublicHotelPage({ params }: PageProps) {
    const resolvedParams = await params;
    const hotelId = resolvedParams.hotelId;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
        include: {
            rooms: {
                take: 3,
                where: { status: "AVAILABLE" }
            }
        }
    });

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-[#0f110d] p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-md border border-white/10">
                    <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Hotel Not Found</h1>
                    <p className="text-slate-400">The hotel you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#a1f554] selection:text-black">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />
                    {hotel.images.length > 0 ? (
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a0c08] to-[#1a1d17]" />
                    )}
                </div>

                {/* Hero Content */}
                <div className="container relative z-20 mx-auto px-4 pt-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[#a1f554] text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Sparkles className="h-4 w-4" />
                            <span className="uppercase tracking-[0.2em]">Experience Excellence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
                            Discover Your <span className="text-[#a1f554]">Sanctuary</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both delay-100">
                            Immerse yourself in unparalleled luxury at {hotel.name}, where every detail is crafted for your ultimate comfort.
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium animate-in fade-in slide-in-from-bottom-16 duration-1000 fill-mode-both delay-200">
                            <div className="flex items-center gap-2 text-white/80">
                                <div className="h-8 w-8 bg-[#a1f554]/10 rounded-lg flex items-center justify-center border border-[#a1f554]/20">
                                    <MapPin className="h-4 w-4 text-[#a1f554]" />
                                </div>
                                <span>Prime District</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2 text-white/80">
                                <div className="h-8 w-8 bg-[#a1f554]/10 rounded-lg flex items-center justify-center border border-[#a1f554]/20">
                                    <Star className="h-4 w-4 text-[#a1f554] fill-[#a1f554]" />
                                </div>
                                <span>5.0 Excellence</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2 text-white/80">
                                <div className="h-8 w-8 bg-[#a1f554]/10 rounded-lg flex items-center justify-center border border-[#a1f554]/20">
                                    <Shield className="h-4 w-4 text-[#a1f554]" />
                                </div>
                                <span>Safety Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-10" />
            </section>

            {/* Search Section */}
            <div className="relative z-30 -mt-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <HotelSearch hotelId={hotelId} />
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-lg bg-[#a1f554]/10 text-[#a1f554] text-xs font-bold mb-6 tracking-widest uppercase">
                            Premium Amenities
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                            Elevating Your <br />
                            <span className="text-slate-400">Experience Everyday.</span>
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">
                            We offer a collection of curated services and world-class facilities designed to make your stay memorable. From seamless connectivity to gourmet experiences, everything you need is right here.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {(hotel.amenities.length > 0 ? hotel.amenities.slice(0, 4) : ["High-Speed WiFi", "Smart TV", "Morning Cafe", "Private Parking"]).map((amenity) => (
                                <div key={amenity} className="flex items-center gap-3 text-slate-300">
                                    <div className="h-6 w-6 rounded-full bg-[#a1f554]/20 flex items-center justify-center shrink-0">
                                        <div className="h-2 w-2 rounded-full bg-[#a1f554]" />
                                    </div>
                                    <span className="font-medium">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-[450px]">
                        <div className="rounded-3xl bg-[#0f110d] border border-white/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" alt="Luxury" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="rounded-3xl bg-[#0f110d] border border-white/10 overflow-hidden relative mt-12 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
                            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" alt="Comfort" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
                    {[
                        { icon: Wifi, title: "Connectivity", desc: "Super-fast fiber WiFi" },
                        { icon: Tv, title: "Entertainment", desc: "4K Smart TV in all rooms" },
                        { icon: Coffee, title: "Gourmet", desc: "Breakfast & Cafe access" },
                        { icon: Car, title: "Valet", desc: "Secure 24/7 parking" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-[2.5rem] bg-[#0f110d] border border-white/5 hover:border-[#a1f554]/30 transition-all group">
                            <div className="h-16 w-16 bg-[#a1f554]/5 rounded-2xl flex items-center justify-center mb-8 border border-[#a1f554]/10 group-hover:bg-[#a1f554]/10 transition-colors">
                                <item.icon className="h-8 w-8 text-[#a1f554]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Property Stats */}
                <div className="rounded-[4rem] bg-[#a1f554] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl shadow-[#a1f554]/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -mr-20 -mt-20" />

                    <div className="text-black max-w-sm relative z-10">
                        <h4 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Unmatched <br />Quality.</h4>
                        <p className="font-medium opacity-70">A legacy of excellence and trust building memories for a lifetime.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 md:gap-20 relative z-10">
                        <div className="text-black">
                            <p className="text-5xl font-black mb-2">50+</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Exquisite Rooms</p>
                        </div>
                        <div className="text-black">
                            <p className="text-5xl font-black mb-2">12k</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Happy Guests</p>
                        </div>
                        <div className="text-black">
                            <p className="text-5xl font-black mb-2">24/7</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Elite Service</p>
                        </div>
                        <div className="text-black">
                            <p className="text-5xl font-black mb-2">4.9</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Master Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Footer Section */}
            <div className="bg-[#0f110d] py-24 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold mb-6 text-[#a1f554]">
                                {hotel.name}
                            </h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Experience a new standard of luxury and hospitality. Our commitment to excellence ensures every guest enjoys an unforgettable journey.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="secondary" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    Privacy Policy
                                </Button>
                                <Button variant="secondary" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                    Terms of Service
                                </Button>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 text-slate-400 mb-4">
                                <MapPin className="h-4 w-4" />
                                <span>Main Street Avenue, Luxury District</span>
                            </div>
                            <h4 className="text-3xl font-bold mb-8">Ready for your <br />next adventure?</h4>
                            <Button className="bg-[#a1f554] hover:bg-[#8fd445] text-black font-bold h-16 px-10 rounded-full text-lg shadow-xl shadow-[#a1f554]/10 group">
                                Start Booking <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
