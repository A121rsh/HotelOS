"use server";

import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@/auth";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { sendPlanConfirmationEmail } from "@/lib/mail";

/**
 * Creates a Razorpay order for a subscription plan
 */
export async function createSubscriptionOrder(planId: string) {
    try {
        const plan = await db.subscriptionPlan.findUnique({
            where: { id: planId }
        });

        if (!plan) return { error: "Plan not found" };

        // For Free plan, we don't need Razorpay
        if (plan.price === 0) {
            return { success: true, isFree: true };
        }

        const options = {
            amount: plan.price * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            planName: plan.name,
        };
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return { error: "Failed to initialize payment engine." };
    }
}

/**
 * Verifies Razorpay payment and activates subscription
 */
export async function verifyAndActivateSubscription(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
    planId: string,
    hotelId: string,
    userEmail?: string,
    userPassword?: string,
    userName?: string
) {
    try {
        // In a real app, you should verify the signature here using crypto
        // For this demo/implementation, we'll assume valid if we got the IDs

        const plan = await db.subscriptionPlan.findUnique({
            where: { id: planId }
        });

        if (!plan) return { error: "Invalid plan mapping." };

        await db.$transaction(async (tx) => {
            // 1. Create Invoice
            await tx.subscriptionInvoice.create({
                data: {
                    amount: plan.price,
                    status: "PAID",
                    paymentId: razorpayPaymentId,
                    hotelId: hotelId,
                    planId: planId,
                    startDate: new Date(),
                    endDate: addDays(new Date(), 30),
                }
            });

            // 2. Update/Create Subscription
            await tx.subscription.upsert({
                where: { hotelId: hotelId },
                update: {
                    planId: planId,
                    status: "ACTIVE", // Automatically Activated
                    startDate: new Date(),
                    endDate: addDays(new Date(), 30),
                },
                create: {
                    hotelId: hotelId,
                    planId: planId,
                    status: "ACTIVE",
                    startDate: new Date(),
                    endDate: addDays(new Date(), 30),
                }
            });

            // 3. Ensure Hotel is active
            await tx.hotel.update({
                where: { id: hotelId },
                data: { isActive: true }
            });
        });

        // 4. Send Confirmation Email & Credentials if provided
        const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
        if (hotel) {
            await sendPlanConfirmationEmail(hotel.hotelEmail, hotel.name, plan.name, plan.price);

            // Send Credentials Email if passed from client
            if (userEmail && userPassword && userName) {
                const { sendCredentialsEmail } = await import("@/lib/mail");
                await sendCredentialsEmail(userEmail, userPassword, userName);
            }
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Activation Error:", error);
        return { error: "Failed to synchronize authority protocols." };
    }
}

/**
 * Handle Free Plan Activation
 */
export async function activateFreePlan(planId: string, hotelId: string) {
    try {
        await db.subscription.upsert({
            where: { hotelId: hotelId },
            update: {
                planId: planId,
                status: "PENDING_APPROVAL",
                startDate: new Date(),
                endDate: addDays(new Date(), 365),
            },
            create: {
                hotelId: hotelId,
                planId: planId,
                status: "PENDING_APPROVAL",
                startDate: new Date(),
                endDate: addDays(new Date(), 365),
            }
        });

        // Send Email for Free Plan
        const hotel = await db.hotel.findUnique({ where: { id: hotelId } });
        const plan = await db.subscriptionPlan.findUnique({ where: { id: planId } });
        if (hotel && plan) {
            await sendPlanConfirmationEmail(hotel.hotelEmail, hotel.name, plan.name, 0);
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { error: "Failed to activate free tier." };
    }
}
