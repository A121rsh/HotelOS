
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { HotelForm } from "@/app/(hotel-admin)/onboarding/HotelForm"; // Client Component

export default async function OnboardingPage() {
    const session = await auth();
    if (!session) redirect("/login");

    // Check if user already has a hotel
    const hotel = await db.hotel.findUnique({
        where: { userId: session.user.id }
    });

    if (hotel) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <HotelForm />
        </div>
    );
}
