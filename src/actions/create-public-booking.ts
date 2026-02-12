"use server";

import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";
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

  // 2.5 ✅ Enforce Subscription Limits
  const subscription = await db.subscription.findUnique({
    where: { hotelId },
    include: { plan: true }
  });

  if (subscription?.plan?.maxBookings !== -1) {
    const limit = subscription?.plan?.maxBookings || 0; // Default 0 if no plan (shouldn't happen if checking logic matches)

    // If no subscription found, what to do? 
    // Implementation Plan says "Enforce". 
    // We will assume valid subscription exists. If not, we might skip limit or block.
    // Let's block if limit > 0.

    if (subscription) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const currentMonthBookings = await db.booking.count({
        where: {
          hotelId: hotelId,
          createdAt: { gte: startOfMonth }
        }
      });

      if (currentMonthBookings >= limit) {
        return { error: "This hotel is unable to accept online bookings at the moment (Limit Reached)." };
      }
    }
  }

  // 3. ✅ Check Availability (Prevent Double Booking)
  const overlappingBooking = await db.booking.findFirst({
    where: {
      roomId: roomId,
      status: { not: "CANCELLED" },
      OR: [
        {
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn }
        }
      ]
    }
  });

  if (overlappingBooking) {
    return { error: "Room no longer available." };
  }

  // Calculate Total Price
  const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.price * days;

  return {
    success: true,
    data: {
      hotelId,
      roomId,
      guestName,
      guestMobile,
      guestEmail,
      checkIn,
      checkOut,
      totalAmount,
      roomPrice: room.price,
      days
    }
  };
}

// ----------------------------------------------------------------------
// PAY NOW: Razorpay Order Creation
// ----------------------------------------------------------------------
export async function createRazorpayOrder(amount: number) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Ensure integer paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    return { orderId: order.id, amount: order.amount };
  } catch (error) {
    console.error("Razorpay Error:", error);
    return { error: "Payment initiation failed" };
  }
}

// ----------------------------------------------------------------------
// PAY NOW: Verify & Create Booking (PAID)
// ----------------------------------------------------------------------
export async function verifyAndCreateBooking(
  paymentData: {
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  },
  bookingData: any
) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  // 1. Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return { error: "Payment verification failed" };
  }

  // 2. Create Booking (CONFIRMED + PAID)
  try {
    const booking = await db.booking.create({
      data: {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        guestName: bookingData.guestName,
        guestMobile: bookingData.guestMobile,
        guestEmail: bookingData.guestEmail,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalAmount: bookingData.totalAmount,
        paidAmount: bookingData.totalAmount, // Full paid
        status: "CONFIRMED",
        idType: "Online",
        idNumber: "N/A",
        payments: {
          create: {
            amount: bookingData.totalAmount,
            mode: "ONLINE",
            type: "FULL_PAYMENT"
          }
        }
      }
    });

    return { success: true, bookingId: booking.id };

    return { success: true, bookingId: booking.id };
  } catch (error) {
    return { error: "Booking creation failed after payment" };
  }
}

// ----------------------------------------------------------------------
// PAY LATER: Create Booking (UNPAID)
// ----------------------------------------------------------------------
export async function createPayInHotelBooking(bookingData: any) {
  try {
    const booking = await db.booking.create({
      data: {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        guestName: bookingData.guestName,
        guestMobile: bookingData.guestMobile,
        guestEmail: bookingData.guestEmail,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalAmount: bookingData.totalAmount,
        paidAmount: 0, // Not paid yet
        status: "CONFIRMED",
        idType: "Online (Pay Later)",
        idNumber: "N/A",
      }
    });

    return { success: true, bookingId: booking.id };

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Pay Later Error:", error);
    return { error: "Failed to create booking" };
  }
}
