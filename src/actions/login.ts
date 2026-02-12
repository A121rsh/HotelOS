"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db"; // ✅ Database import kiya

export async function doLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Login se pehle check karo ki user ka Role kya hai
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    // 2. Determine Destination
    let destination = "/dashboard";
    if (existingUser?.role === "ADMIN") {
      destination = "/admin";
    }

    // 3. NextAuth Sign In call karo
    await signIn("credentials", {
      email,
      password,
      redirectTo: destination,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error; // Next.js redirect ke liye ye zaroori hai
  }
}