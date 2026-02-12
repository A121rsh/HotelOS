"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Purges a hotel and all its associated data from the global grid.
 * This is a destructive operation and cannot be reversed.
 */
export async function deleteHotel(hotelId: string) {
    const session = await auth();

    // Verify Authority
    if (!session || (session.user as any).role !== "ADMIN") {
        return { error: "Unauthorized access protocols. High-level clearance required." };
    }

    try {
        const result = await db.$transaction(async (tx) => {
            // 1. Trace the establishment and its associated entities
            const hotel = await tx.hotel.findUnique({
                where: { id: hotelId },
                include: {
                    staff: true,
                    rooms: true,
                    bookings: true,
                }
            });

            if (!hotel) {
                return { error: "Target node not found in the registry." };
            }

            // 2. Erase associated operational data
            // Delete payments first because they depend on bookings
            await tx.payment.deleteMany({
                where: {
                    booking: {
                        hotelId: hotelId
                    }
                }
            });

            await tx.booking.deleteMany({ where: { hotelId } });
            await tx.task.deleteMany({ where: { hotelId } });
            await tx.room.deleteMany({ where: { hotelId } });

            // 3. Clear fiscal records
            await tx.subscriptionInvoice.deleteMany({ where: { hotelId } });
            await tx.subscription.deleteMany({ where: { hotelId } });

            // 4. Trace and mark staff for removal
            const staffIds = hotel.staff.map(s => s.id);
            const ownerId = hotel.userId;

            // 5. Decommission the establishment
            await tx.hotel.delete({ where: { id: hotelId } });

            // 6. Purge identified administrative and operational personnel
            if (staffIds.length > 0) {
                await tx.user.deleteMany({
                    where: { id: { in: staffIds } }
                });
            }

            if (ownerId) {
                await tx.user.delete({
                    where: { id: ownerId }
                });
            }

            return { success: true };
        });

        if (result.error) return result;

        revalidatePath("/admin/hotels");
        return { success: "Node successfully decommissioned and purged from history." };

    } catch (error) {
        console.error("Decommission Error:", error);
        return { error: "Failed to synchronize decommissioning protocols." };
    }
}
