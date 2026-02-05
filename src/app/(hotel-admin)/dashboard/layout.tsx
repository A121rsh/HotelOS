import { auth } from "@/auth";
import { getHotelByUserId } from "@/lib/hotel-helper";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const hotel = await getHotelByUserId(session.user.id as string);
  const hotelName = hotel?.name || "HotelO.S.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar hotelName={hotelName} />
      <main className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}