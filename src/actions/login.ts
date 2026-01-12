// src/actions/login.ts
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function doLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // NextAuth ka signIn function call kar rahe hain
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Login ke baad kahan jana hai
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
    throw error; // Next.js redirect ke liye error throw karna zaroori hai
  }
}