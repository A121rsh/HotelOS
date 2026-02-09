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

      // Default rasta: Hotel Dashboard
      let destination = "/dashboard";

      // 2. NextAuth Sign In call karo (Dynamic Destination ke saath)
      await signIn("credentials", {
        email,
        password,
        redirectTo: destination, // ✅ Ab ye smart ho gaya hai
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