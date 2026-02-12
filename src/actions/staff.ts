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
  const role = formData.get("role") as "MANAGER";

  // Get permissions from checkboxes
  const rawPermissions = formData.getAll("permissions") as string[];

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
        role: role || "MANAGER",
        permissions: rawPermissions,
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

export async function updateStaff(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const staffId = formData.get("staffId") as string;
  const name = formData.get("name") as string;
  const rawPermissions = formData.getAll("permissions") as string[];

  if (!staffId || !name) {
    return { error: "Staff ID and Name are required" };
  }

  try {
    await db.user.update({
      where: { id: staffId },
      data: {
        name,
        permissions: rawPermissions
      }
    });

    revalidatePath("/dashboard/staff");
    return { success: "Staff updated successfully" };
  } catch (error) {
    return { error: "Failed to update staff" };
  }
}

export async function deleteStaff(staffId: string) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    await db.user.delete({ where: { id: staffId } });
    revalidatePath("/dashboard/staff");
    return { success: "Staff removed" };
  } catch (error) {
    return { error: "Failed to remove staff" };
  }
}