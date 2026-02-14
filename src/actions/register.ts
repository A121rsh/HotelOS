"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { addDays } from "date-fns";

export async function registerHotel(formData: FormData) {
  const hotelName = formData.get("hotelName") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;
  const country = formData.get("country") as string;
  const state = formData.get("state") as string;
  const logo = formData.get("logo") as string;
  const planId = formData.get("planId") as string;

  if (!hotelName || !firstName || !lastName || !email || !password || !mobile) {
    return { error: "Please fill all required fields." };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email already registered." };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Create User
      const newUser = await tx.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          name: `${firstName} ${lastName}`.trim(),
          email: email,
          password: hashedPassword,
          country: country,
          state: state,
          role: "OWNER"
        }
      });

      // 2. Create Hotel
      const newHotel = await tx.hotel.create({
        data: {
          name: hotelName,
          mobile: mobile,
          hotelEmail: email,
          userId: newUser.id,
          logo: logo || null,
          isActive: true
        }
      });

      // 3. Create initial Subscription if plan selected
      if (planId) {
        await tx.subscription.create({
          data: {
            hotelId: newHotel.id,
            planId: planId,
            status: "PENDING_APPROVAL", // Will become ACTIVE after payment
            startDate: new Date(),
            endDate: addDays(new Date(), 30), // Default 30 days
          }
        });
      }

      return { success: true, userId: newUser.id, hotelId: newHotel.id };
    });

    // Send credentials email - REMOVED per user request (will send after payment)
    // if (result.success) {
    //   const { sendCredentialsEmail } = await import("@/lib/mail");
    //   await sendCredentialsEmail(email, password, `${firstName} ${lastName}`);
    // }

    return result;

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong during registration." };
  }
}