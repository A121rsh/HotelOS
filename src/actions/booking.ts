"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ================================
// 1. CREATE BOOKING (New Logic with Payment & KYC)
// ================================
export async function createBooking(formData: FormData) {
  const session = await auth();
  
  // User verify
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!user || !user.hotelId) {
    return { error: "Unauthorized: User or Hotel not found" };
  }

  // 1. Form Data nikalo
  const guestName = formData.get("guestName") as string;
  const guestMobile = formData.get("guestMobile") as string;
  const guestEmail = formData.get("guestEmail") as string;
  
  const idType = formData.get("idType") as string;
  const idNumber = formData.get("idNumber") as string;
  const idImage = formData.get("idImage") as string; // Cloudinary URL
  
  const roomId = formData.get("roomId") as string;
  const checkIn = new Date(formData.get("checkIn") as string);
  const checkOut = new Date(formData.get("checkOut") as string);
  
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  
  // Payment Fields
  const advanceAmount = parseFloat(formData.get("advanceAmount") as string) || 0;
  const paymentMode = formData.get("paymentMode") as string; 

  // 2. Validation
  if (!guestName || !guestMobile || !roomId || !checkIn || !checkOut) {
    return { error: "Please fill all required fields" };
  }

  // 3. Availability Check
  const existingBooking = await db.booking.findFirst({
    where: {
      roomId,
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
    // 4. Booking Create karo
    await db.booking.create({
      data: {
        hotelId: user.hotelId,
        roomId,
        guestName,
        guestMobile,
        guestEmail,
        idType,
        idNumber,
        idImage, // Cloudinary URL
        checkIn,
        checkOut,
        totalAmount,
        paidAmount: advanceAmount,
        dueAmount: totalAmount - advanceAmount,
        status: "CONFIRMED",
        
        // Payment History me Entry
        payments: advanceAmount > 0 ? {
            create: {
                amount: advanceAmount,
                type: "ADVANCE",
                mode: paymentMode === "UPI" ? "UPI" : paymentMode === "CARD" ? "CARD" : "CASH"
            }
        } : undefined
      }
    });

    // 5. Room ko 'Booked' mark karo (Agar aaj check-in hai)
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
// 2. DELETE BOOKING (Restored)
// ================================
export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

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
// 3. UPDATE BOOKING STATUS (Restored)
// ================================
export async function updateBookingStatus(
  bookingId: string,
  newStatus: "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED"
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    revalidatePath("/dashboard/bookings");
    return { success: "Booking status updated" };
  } catch (_error) {
    return { error: "Failed to update booking status" };
  }
}