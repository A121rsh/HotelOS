    import { auth } from "@/auth";
import { db } from "@/lib/db";
import NewBookingForm from "@/components/NewBookingForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewBookingPage() {
  const session = await auth();
  
  // Hotel aur Rooms data fetch karo
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: { 
        hotel: { 
            include: { 
                // Sirf Available rooms hi dikhana chahiye booking ke liye
                rooms: {
                    where: { status: "AVAILABLE" },
                    orderBy: { number: 'asc' }
                } 
            } 
        } 
    }
  });

  const rooms = user?.hotel?.rooms || [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/bookings">
            <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-900">New Reservation</h1>
            <p className="text-slate-500 text-sm">Create a booking with KYC & Payment details.</p>
        </div>
      </div>

      {/* Form Component Load Karo */}
      <NewBookingForm rooms={rooms} />
    </div>
  );
}