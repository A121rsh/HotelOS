"use server";

import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function registerHotel(formData: FormData) {
  const hotelName = formData.get("hotelName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile = formData.get("mobile") as string;
  const ownerName = formData.get("ownerName") as string;
  const logo = formData.get("logo") as string;

  // ❌ VALIDATION REMOVED (Temporary)
  // if (!hotelName || !email || !password || !mobile || !ownerName) {
  //   return { error: "All fields are required" };
  // }

  // 1. Check if User Already Exists
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "Email already registered!" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    // ✅ CORRECT SCHEMA LOGIC (User + Hotel ek saath)
    await db.user.create({
      data: {
        name: ownerName,
        email: email,
        password: hashedPassword,
        role: "OWNER",
        
        // Hotel yahan create hoga aur User se link ho jayega
        ownedHotel: {
          create: {
            name: hotelName,
            mobile: mobile,
            hotelEmail: email,
            logo: logo || "",
          }
        }
      }
    });

    return { success: "Hotel registered successfully!" };

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong during registration." };
  }
}