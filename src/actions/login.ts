"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";

export async function doLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Check user role before login to determine destination
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    let destination = "/dashboard";
    if (existingUser?.role === "ADMIN") {
      destination = "/admin";
    }

    // 2. NextAuth Sign In with redirect: false
    // Note: We handle the redirect on the client side to avoid catching redirect errors
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { error: "Invalid email or password!" };
    }

    return { success: true, destination };

  } catch (error) {
    console.error("Login Error:", error);
    return { error: "An unexpected error occurred during authorization." };
  }
}