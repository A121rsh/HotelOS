"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- HELPERS ---
async function getHotel() {
    const session = await auth();
    if (!session) return null;

    const user = await db.user.findUnique({
        where: { email: session.user.email as string },
        include: {
            ownedHotel: true,
            workingAt: true
        }
    });

    return user?.ownedHotel || user?.workingAt;
}

// --- CHANNEL ACTIONS ---

export async function createChannel(formData: FormData) {
    const hotel = await getHotel();
    if (!hotel) return { error: "Ownership/Management authority required." };

    const name = formData.get("name") as string;
    const type = formData.get("type") as any;
    const apiKey = formData.get("apiKey") as string;
    const apiSecret = formData.get("apiSecret") as string;
    const iCalUrl = formData.get("iCalUrl") as string;

    if (!name || !type) return { error: "Channel Name and Type are required." };

    try {
        await db.channel.create({
            data: {
                name,
                type,
                apiKey,
                apiSecret,
                iCalUrl,
                hotelId: hotel.id
            }
        });

        revalidatePath("/dashboard/channels");
        return { success: "Channel Node synchronized successfully." };
    } catch (error) {
        console.error(error);
        return { error: "Failed to establish channel connection." };
    }
}

export async function updateChannel(formData: FormData) {
    const hotel = await getHotel();
    if (!hotel) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const apiKey = formData.get("apiKey") as string;
    const apiSecret = formData.get("apiSecret") as string;
    const iCalUrl = formData.get("iCalUrl") as string;
    const isActive = formData.get("isActive") === "true";

    try {
        await db.channel.update({
            where: { id, hotelId: hotel.id },
            data: {
                name,
                apiKey,
                apiSecret,
                iCalUrl,
                isActive
            }
        });

        revalidatePath("/dashboard/channels");
        return { success: "Channel configuration updated." };
    } catch (error) {
        return { error: "Update sequence failed." };
    }
}

export async function deleteChannel(id: string) {
    const hotel = await getHotel();
    if (!hotel) return { error: "Unauthorized" };

    try {
        await db.channel.delete({
            where: { id, hotelId: hotel.id }
        });

        revalidatePath("/dashboard/channels");
        return { success: "Channel Node decommissioned." };
    } catch (error) {
        return { error: "Decommissioning failed." };
    }
}

// --- MAPPING ACTIONS ---

export async function createMapping(formData: FormData) {
    const hotel = await getHotel();
    if (!hotel) return { error: "Unauthorized" };

    const channelId = formData.get("channelId") as string;
    const roomId = formData.get("roomId") as string;
    const externalRoomId = formData.get("externalRoomId") as string;
    const markupType = formData.get("markupType") as string;
    const markupValue = parseFloat(formData.get("markupValue") as string || "0");

    if (!channelId || !roomId || !externalRoomId) {
        return { error: "Mapping parameters incomplete." };
    }

    try {
        await db.channelMapping.create({
            data: {
                channelId,
                roomId,
                externalRoomId,
                markupType,
                markupValue
            }
        });

        revalidatePath("/dashboard/channels");
        return { success: "Inventory mapping established." };
    } catch (error) {
        return { error: "Mapping deployment failed." };
    }
}

export async function deleteMapping(id: string) {
    try {
        await db.channelMapping.delete({ where: { id } });
        revalidatePath("/dashboard/channels");
        return { success: "Mapping revoked." };
    } catch (error) {
        return { error: "Revocation failed." };
    }
}

// --- SYNC ACTIONS (ARI) ---

export async function triggerManualSync(channelId: string) {
    const hotel = await getHotel();
    if (!hotel) return { error: "Unauthorized" };

    try {
        // 1. Create Log Entry
        const log = await db.channelSyncLog.create({
            data: {
                channelId,
                type: "ARI_PUSH",
                status: "PENDING",
                message: "Manual sync sequence initiated by administrator."
            }
        });

        // 2. Fetch Channel & Mappings
        const channel = await db.channel.findUnique({
            where: { id: channelId },
            include: {
                mappings: {
                    include: { room: true }
                }
            }
        });

        if (!channel) throw new Error("Channel not found.");

        // 3. Simulation Logic (For Phase 1)
        // In real apps, this is where we'd call the OTA API
        console.log(`Syncing ARI for Channel: ${channel.name}`);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network latency

        // 4. Update Log & Channel
        await db.channelSyncLog.update({
            where: { id: log.id },
            data: {
                status: "SUCCESS",
                message: `Successfully synchronized ${channel.mappings.length} room mappings.`,
                payload: { syncedAt: new Date().toISOString() }
            }
        });

        await db.channel.update({
            where: { id: channelId },
            data: { lastSyncAt: new Date() }
        });

        revalidatePath("/dashboard/channels");
        return { success: "Global ARI synchronization complete." };
    } catch (error: any) {
        return { error: error.message || "Synchronization failed." };
    }
}
