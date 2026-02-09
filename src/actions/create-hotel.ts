
"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function createHotel(formData: FormData) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { error: "Unauthorized" };
    }

    const hotelName = formData.get("hotelName") as string;
    const mobile = formData.get("mobile") as string;
    const logo = formData.get("logo") as string;
    const amenities = formData.getAll("amenities") as string[];

    if (!hotelName || !mobile) {
        return { error: "Hotel Name and Contact Number are required." };
    }

    try {
        // Verify user doesn't already have a hotel
        const existingHotel = await db.hotel.findUnique({
            where: { userId: session.user.id }
        });

        if (existingHotel) {
            return { error: "You already have a hotel registered." };
        }

        // Assign Free Plan by default
        let freePlan = await db.subscriptionPlan.findUnique({
            where: { slug: "free" }
        });

        if (!freePlan) {
            // Auto-create Free plan if missing (Self-healing)
            freePlan = await db.subscriptionPlan.create({
                data: {
                    name: "Free",
                    slug: "free",
                    description: "Perfect for small hotels starting out.",
                    price: 0,
                    maxRooms: 5,
                    maxBookings: 50,
                    features: ["Basic Dashboard", "5 Rooms Limit", "50 Bookings/Month"]
                }
            });
        }

        const hotel = await db.hotel.create({
            data: {
                name: hotelName,
                mobile: mobile,
                hotelEmail: session.user.email!,
                userId: session.user.id,
                logo: logo || null,
                isActive: true,
                amenities: amenities,
                // Create Subscription
                subscription: {
                    create: {
                        planId: freePlan.id,
                        status: "ACTIVE",
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 100)) // Forever for free tier
                    }
                }
            }
        });

        return { success: true, hotelId: hotel.id };
    } catch (error) {
        console.error("Create Hotel Error:", error);
        return { error: "Failed to create hotel." };
    }
}
