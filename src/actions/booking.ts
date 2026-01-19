"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ================================
// 1. CREATE BOOKING
// ================================
export async function createBooking(formData: FormData) {
  const session = await auth();
  
  // 1. User aur Hotel find karo
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: {
        ownedHotel: true,
        workingAt: true
    }
  });

  const hotel = user?.ownedHotel || user?.workingAt;

  if (!hotel) {
    return { error: "Unauthorized: No hotel linked to this account." };
  }

  // 2. Form Data processing
  const guestName = formData.get("guestName") as string;
  const guestMobile = formData.get("guestMobile") as string;
  const guestEmail = formData.get("guestEmail") as string;
  
  const idType = formData.get("idType") as string;
  const idNumber = formData.get("idNumber") as string;
  const idImage = formData.get("idImage") as string;
  
  const roomId = formData.get("roomId") as string;
  const checkIn = new Date(formData.get("checkIn") as string);
  const checkOut = new Date(formData.get("checkOut") as string);
  
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const advanceAmount = parseFloat(formData.get("advanceAmount") as string) || 0;
  const paymentMode = formData.get("paymentMode") as string; 

  if (!guestName || !guestMobile || !roomId || !checkIn || !checkOut) {
    return { error: "Please fill all required fields" };
  }

  // 3. Availability Check
  const existingBooking = await db.booking.findFirst({
    where: {
      roomId,
      hotelId: hotel.id,
      OR: [
        { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }
      ],
      NOT: { status: "CANCELLED" }
    }
  });

  if (existingBooking) {
    return { error: "Room is already booked for these dates!" };
  }

  try {
    // 4. Create Booking
    await db.booking.create({
      data: {
        hotelId: hotel.id,
        roomId,
        guestName,
        guestMobile,
        guestEmail,
        idType,
        idNumber,
        idImage,
        checkIn,
        checkOut,
        totalAmount,
        paidAmount: advanceAmount,
        dueAmount: totalAmount - advanceAmount,
        status: "CONFIRMED",
        
        // ✅ NEW: AUDIT TRAIL (Kisne booking banayi)
        createdById: user.id, 
        
        payments: advanceAmount > 0 ? {
            create: {
                amount: advanceAmount,
                type: "ADVANCE",
                mode: paymentMode === "UPI" ? "UPI" : paymentMode === "CARD" ? "CARD" : "CASH"
            }
        } : undefined
      }
    });

    // 5. Room Status Update (Agar aaj hi check-in hai)
    const today = new Date();
    today.setHours(0,0,0,0);
    if (checkIn <= today && checkOut > today) {
        await db.room.update({
            where: { id: roomId },
            data: { status: "BOOKED" }
        });
    }

    revalidatePath("/dashboard/bookings");
    return { success: "Booking Successful!" };

  } catch (error) {
    console.log(error);
    return { error: "Failed to create booking" };
  }
}

// ================================
// 2. DELETE BOOKING
// ================================
export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await db.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/dashboard/bookings");
    return { success: "Booking deleted successfully" };
  } catch (_error) {
    return { error: "Failed to delete booking" };
  }
}

// ================================
// 3. UPDATE BOOKING STATUS
// ================================
export async function updateBookingStatus(
  bookingId: string,
  newStatus: "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED"
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    // 1. Status Update
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: { room: true }
    });

    // 2. Room Status Sync logic
    if (newStatus === "CHECKED_OUT") {
        await db.room.update({
            where: { id: booking.roomId },
            data: { status: "DIRTY" }
        });
    } else if (newStatus === "CANCELLED") {
        await db.room.update({
            where: { id: booking.roomId },
            data: { status: "AVAILABLE" }
        });
    } else if (newStatus === "CHECKED_IN") {
        await db.room.update({
            where: { id: booking.roomId },
            data: { status: "BOOKED" }
        });
    }

    revalidatePath("/dashboard/bookings");
    return { success: "Booking status updated" };
  } catch (_error) {
    return { error: "Failed to update booking status" };
  }
}