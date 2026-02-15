import { db } from "@/lib/db";
import PublicHeader from "@/components/public/PublicHeader";
import { notFound } from "next/navigation";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ hotelId: string }>;
}

export default async function HotelLayout({ children, params }: LayoutProps) {
    const resolvedParams = await params;
    const hotelId = resolvedParams.hotelId;

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
        select: {
            id: true,
            name: true,
            logo: true,
        }
    });

    if (!hotel) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader hotel={hotel} />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
