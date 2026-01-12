"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addPayment(bookingId: string, amount: number, mode: "CASH" | "UPI" | "CARD") {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  if (!amount || amount <= 0) return { error: "Invalid amount" };

  try {
    // 1. Booking dhoondo
    const booking = await db.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) return { error: "Booking not found" };

    // 2. Transaction Start (Prisma Transaction better hota par abhi simple rakhte hain)
    
    // Payment Record Create Karo
    await db.payment.create({
        data: {
            bookingId,
            amount,
            mode,
            type: "DUE_CLEARANCE" // Ye balance payment hai
        }
    });

    // 3. Booking Update Karo (Paid Amount badhao, Due Amount ghatao)
    const newPaidAmount = booking.paidAmount + amount;
    const newDueAmount = booking.totalAmount - newPaidAmount;

    await db.booking.update({
        where: { id: bookingId },
        data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            // Agar pura paisa de diya, aur status abhi bhi CONFIRMED hai, to CHECKED_OUT mat karo, 
            // wo manual hoga.
        }
    });

    revalidatePath("/dashboard/bookings");
    return { success: "Payment added successfully" };

  } catch (error) {
    console.log(error);
    return { error: "Failed to process payment" };
  }
}