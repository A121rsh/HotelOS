import { db } from "@/lib/db";
import HotelSearch from "@/components/public/HotelSearch";
import { Wifi, Tv, Coffee, Car } from "lucide-react";

// ✅ 1. Type Change: params ab Promise hai
interface PageProps {
    params: Promise<{ hotelId: string }>;
}

export default async function PublicHotelPage({ params }: PageProps) {

    // ✅ 2. Pehle params ko await karo
    const resolvedParams = await params;
    const hotelId = resolvedParams.hotelId;

    // 3. Ab Database se Hotel dhoondo
    const hotel = await db.hotel.findUnique({
        where: { id: hotelId }
    });

    if (!hotel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-3xl font-bold text-slate-800">Hotel Not Found</h1>
                <p className="text-slate-500">Please check the URL or contact support.</p>
            </div>
        );
    }

    return (
        <div>
            {/* HERO SECTION (Banner) */}
            <div className="relative h-[450px] bg-slate-900 flex items-center justify-center">
                {hotel.images.length > 0 ? (
                    <img src={hotel.images[0]} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : hotel.logo ? (
                    <img src={hotel.logo} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-90" />
                )}

                <div className="relative z-10 text-center text-white px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                        {hotel.name}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-md">
                        Experience comfort and luxury. Book your perfect stay today.
                    </p>
                </div>
            </div>

            {/* SEARCH BAR SECTION */}
            <div className="px-4">
                <HotelSearch hotelId={hotelId} />
            </div>

            {/* AMENITIES SECTION */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Why Choose Us?</h2>
                    <p className="text-slate-500">World-class amenities for your comfort</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity) => {
                            const iconKey = amenity.toUpperCase();
                            // Simple Icon Mapping
                            const Icon =
                                iconKey.includes("WIFI") ? Wifi :
                                    iconKey.includes("TV") ? Tv :
                                        iconKey.includes("COFFEE") ? Coffee :
                                            iconKey.includes("PARKING") ? Car :
                                                Wifi; // Default Icon

                            return (
                                <div key={amenity} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 uppercase">{amenity}</h3>
                                </div>
                            );
                        })
                    ) : (
                        // FALLBACK: Show default amenities if none set (For existing hotels)
                        <>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Wifi className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900">Free Wifi</h3>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Tv className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900">Smart TV</h3>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Coffee className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900">Breakfast</h3>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Car className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900">Parking</h3>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}