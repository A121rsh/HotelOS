
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.log("Usage: npx tsx scripts/toggle-subscription.ts <email>");
        return;
    }

    const user = await db.user.findUnique({
        where: { email },
        include: { ownedHotel: { include: { subscription: true } } }
    });

    if (!user || !user.ownedHotel) {
        console.log("User or Hotel not found.");
        return;
    }

    const sub = user.ownedHotel.subscription;

    if (!sub) {
        console.log("No subscription found for this hotel.");
        return;
    }

    const newStatus = sub.status === "ACTIVE" ? "EXPIRED" : "ACTIVE";
    const newEndDate = newStatus === "ACTIVE"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        : new Date(Date.now() - 24 * 60 * 60 * 1000); // -1 day

    await db.subscription.update({
        where: { id: sub.id },
        data: {
            status: newStatus,
            endDate: newEndDate
        }
    });

    console.log(`\n✅ Subscription for ${user.email} (${user.ownedHotel.name}) updated!`);
    console.log(`Status: ${sub.status} -> ${newStatus}`);
    console.log(`EndDate: ${newEndDate.toISOString()}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.$disconnect();
    });
