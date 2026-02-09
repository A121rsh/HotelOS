
"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import Razorpay from "razorpay";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createSubscriptionOrder(planId: string, hotelId: string) {
    const session = await auth();
    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    const plan = await db.subscriptionPlan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        return { error: "Plan not found" };
    }

    if (plan.price === 0) {
        // Free plan: Update directly without payment
        await updateSubscription(hotelId, planId);
        return { success: true, free: true };
    }

    const options = {
        amount: plan.price * 100, // Amount in paise
        currency: "INR",
        receipt: `rcpt_${hotelId.slice(-10)}_${Date.now().toString().slice(-6)}`,
        notes: {
            hotelId,
            planId,
            type: "subscription_upgrade",
        },
    };

    try {
        const order = await razorpay.orders.create(options);
        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            planName: plan.name,
            hotelId,
            planId
        };
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return { error: "Failed to create payment order" };
    }
}

export async function verifySubscriptionPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    hotelId: string,
    planId: string
) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            await updateSubscription(hotelId, planId, razorpay_payment_id);
            revalidatePath("/dashboard/pricing");
            revalidatePath("/admin/hotels");
            return { success: true };
        } catch (error) {
            console.error("Subscription Update Error:", error);
            return { error: "Payment verified but subscription update failed" };
        }
    } else {
        return { error: "Invalid payment signature" };
    }
}

async function updateSubscription(hotelId: string, planId: string, paymentId?: string) {
    // Update or create subscription
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month from now

    await db.subscription.upsert({
        where: { hotelId },
        update: {
            planId,
            status: "PENDING_APPROVAL",
            startDate: new Date(),
            endDate,
        },
        create: {
            hotelId,
            planId,
            status: "PENDING_APPROVAL",
            startDate: new Date(),
            endDate,
        },
    });

    revalidatePath("/dashboard/pricing");
    revalidatePath("/dashboard");
    revalidatePath("/admin/hotels");

    // Log payment if paymentId is provided
    if (paymentId) {
        const plan = await db.subscriptionPlan.findUnique({ where: { id: planId } });
        if (plan) {
            await db.subscriptionInvoice.create({
                data: {
                    hotelId,
                    planId,
                    amount: plan.price,
                    status: "PAID",
                    paymentId,
                },
            });
        }
    }
}
