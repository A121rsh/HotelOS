
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FeaturesForm } from "./FeaturesForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HotelFeaturesPage({ params }: { params: { hotelId: string } }) {
    const { hotelId } = await params;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
    });

    if (!hotel) return notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/hotels">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Features: {hotel.name}</h1>
                    <p className="text-muted-foreground">Control dashboard access for this hotel</p>
                </div>
            </div>

            <FeaturesForm
                hotelId={hotel.id}
                initialBlocked={hotel.blockedFeatures}
            />
        </div>
    );
}
