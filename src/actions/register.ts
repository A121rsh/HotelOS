"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerHotel(formData: FormData) {
  const hotelName = formData.get("hotelName") as string;
  const ownerName = formData.get("ownerName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;
  const logo = formData.get("logo") as string;

  if (!hotelName || !ownerName || !email || !password || !mobile) {
    return { error: "Please fill all required fields." };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email already registered." };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                name: ownerName,
                email: email,
                password: hashedPassword,
                role: "OWNER"
            }
        });

        await tx.hotel.create({
            data: {
                name: hotelName,
                mobile: mobile,
                hotelEmail: email,
                userId: newUser.id,
                logo: logo || null,
                isActive: true
            }
        });
    });

    return { success: true };

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong." };
  }
}