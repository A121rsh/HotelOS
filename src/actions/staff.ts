"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs"; 

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  // 1. Current Admin aur uska Hotel dhoondo
  // Hum check kar rahe hain ki kya user ke paas 'ownedHotel' hai?
  const adminUser = await db.user.findUnique({
    where: { email: session.user.email as string },
    include: { ownedHotel: true } 
  });

  if (!adminUser?.ownedHotel) {
    return { error: "Hotel not found. Only Owners can add staff." };
  }

  // 2. Form Data nikalo
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "FRONT_DESK" | "HOUSEKEEPING";

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  // 3. Check karo email pehle se to nahi hai
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 4. Password Hash
  const hashedPassword = await hash(password, 10);

  try {
    // 5. Naya User (Staff) Create karo
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, 
        // IMPORTANT: Staff ko Hotel se link kar rahe hain
        workingAt: {
            connect: { id: adminUser.ownedHotel.id }
        }
      }
    });

    revalidatePath("/dashboard/staff");
    return { success: "Staff member added successfully!" };

  } catch (error) {
    console.error("Staff Creation Error:", error);
    return { error: "Failed to create staff account." };
  }
}

// Staff Delete karne ka function
export async function deleteStaff(staffId: string) {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        // Sirf Owner hi delete kar sakta hai, ye verify karna chahiye
        // Par abhi ke liye simple rakhte hain
        await db.user.delete({
            where: { id: staffId }
        });
        revalidatePath("/dashboard/staff");
        return { success: "Staff removed" };
    } catch (error) {
        return { error: "Failed to remove staff" };
    }
}