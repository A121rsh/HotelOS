import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getHotelByUserId } from "@/lib/hotel-helper"; // ✅ Helper use karein jo humne banaya tha

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // ✅ OLD BUGGY CODE HATA DIYA
  // const user = await db.user.findUnique(...) ❌

  // ✅ NEW FIXED CODE:
  // Helper function use karein jo Owner/Staff dono ko handle karega
  const hotel = await getHotelByUserId(session.user.id as string);

  // Agar naam nahi mila to default
  const hotelName = hotel?.name || "Hotel O.S.";

  return (
    <div className="h-full relative bg-slate-50">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-950">
        <Sidebar hotelName={hotelName} />
      </div>
      <main className="md:pl-72 min-h-screen transition-all">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}