
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PricingCards } from "./PricingCards";
import { getHotelByUserId } from "@/lib/hotel-helper";

export default async function PricingPage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/login");
    }

    const hotel = await getHotelByUserId(session.user.id!);
    if (!hotel) {
        redirect("/onboarding");
    }

    const plans = await db.subscriptionPlan.findMany({
        orderBy: {
            price: "asc",
        },
    });

    const currentSubscription = await db.subscription.findUnique({
        where: {
            hotelId: hotel.id,
        },
        include: {
            plan: true,
        },
    });

    const isExpired = currentSubscription ? new Date() > new Date(currentSubscription.endDate!) : false;
    const isLocked = isExpired || currentSubscription?.status === "EXPIRED";

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Upgrade Your Hotel
                </h1>
                <p className="mt-5 text-xl text-slate-500 max-w-2xl mx-auto">
                    Choose the best plan for your business and unlock more features.
                </p>
            </div>

            <PricingCards
                plans={plans}
                currentPlanId={currentSubscription?.planId || undefined}
                hotelId={hotel.id}
                isLocked={isLocked}
            />
        </div>
    );
}
