"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { addDays } from "date-fns";

export async function registerHotel(formData: FormData) {
  const hotelName = formData.get("hotelName") as string;
  const ownerName = formData.get("ownerName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;
  const logo = formData.get("logo") as string;
  const planId = formData.get("planId") as string;

  if (!hotelName || !ownerName || !email || !password || !mobile) {
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
          name: ownerName,
          email: email,
          password: hashedPassword,
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
            status: "PENDING_APPROVAL", // Will become ACTIVE after payment/approval
            startDate: new Date(),
            endDate: addDays(new Date(), 30), // Default 30 days
          }
        });
      }

      return { success: true, userId: newUser.id, hotelId: newHotel.id };
    });

    return result;

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong during registration." };
  }
}