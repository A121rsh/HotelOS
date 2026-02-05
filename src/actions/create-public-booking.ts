"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createPublicBooking(formData: FormData) {
  const hotelId = formData.get("hotelId") as string;
  const roomId = formData.get("roomId") as string;
  const checkInStr = formData.get("checkIn") as string;
  const checkOutStr = formData.get("checkOut") as string;
  
  const guestName = formData.get("guestName") as string;
  const guestMobile = formData.get("guestMobile") as string;
  const guestEmail = formData.get("guestEmail") as string;

  // 1. Basic Validation
  if (!hotelId || !roomId || !checkInStr || !checkOutStr || !guestName || !guestMobile) {
    return { error: "Missing required fields" };
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  // 2. Room Price Fetch karo (Security: Client side price trust mat karna)
  const room = await db.room.findUnique({
    where: { id: roomId }
  });

  if (!room) return { error: "Room not found" };

  // Calculate Total Price
  const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.price * days;

  // 3. Create Booking in DB
  try {
    const booking = await db.booking.create({
      data: {
        hotelId,
        roomId,
        guestName,
        guestMobile,
        guestEmail,
        checkIn,
        checkOut,
        totalAmount,
        paidAmount: 0, // Abhi 0 hai, Payment Gateway lagne par change hoga
        status: "CONFIRMED", // Direct Confirm kar rahe hain (Pay at Hotel maanke)
        idType: "Online",
        idNumber: "N/A"
      }
    });
    
    // Booking ID return karo taaki Thank You page pe dikha sakein
    return { success: true, bookingId: booking.id };

  } catch (error) {
    console.error("Booking Error:", error);
    return { error: "Failed to create booking" };
  }
}