"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs"; 

export async function createStaff(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const adminUser = await db.user.findUnique({
    where: { email: session.user.email as string },
    include: { ownedHotel: true } 
  });

  if (!adminUser?.ownedHotel) {
    return { error: "Hotel not found. Only Owners can add staff." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // ✅ Role fix kar diya (Frontend se hidden input "MANAGER" bhej raha hai)
  const role = formData.get("role") as "MANAGER"; 

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email already in use!" };

  const hashedPassword = await hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "MANAGER", // Fallback to Manager
        workingAt: {
            connect: { id: adminUser.ownedHotel.id }
        }
      }
    });

    revalidatePath("/dashboard/staff");
    return { success: "Manager added successfully!" };

  } catch (error) {
    console.error("Staff Creation Error:", error);
    return { error: "Failed to create staff account." };
  }
}

// Delete function same rahega...
export async function deleteStaff(staffId: string) {
    // ... purana code same
    try {
        await db.user.delete({ where: { id: staffId } });
        revalidatePath("/dashboard/staff");
        return { success: "Staff removed" };
    } catch (error) {
        return { error: "Failed to remove staff" };
    }
}