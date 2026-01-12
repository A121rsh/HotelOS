import { db } from "@/lib/db";

export async function getHotelByUserId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      ownedHotel: true, // ✅ Owner ka hotel
      workingAt: true,  // ✅ Staff ka hotel
    }
  });

  if (!user) return null;

  // Jo bhi exist karta ho wo return karo
  return user.ownedHotel || user.workingAt;
}