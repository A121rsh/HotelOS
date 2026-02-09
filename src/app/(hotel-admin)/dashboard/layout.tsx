import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { AccessGuard } from "@/components/AccessGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);

  if (!hotel) redirect("/onboarding");

  // ✅ CHECK: Subscription Status
  const subscription = await db.subscription.findUnique({
    where: { hotelId: hotel.id },
    include: { plan: true }
  });

  const isExpired = subscription ? new Date() > new Date(subscription.endDate) : false;
  const isLocked = isExpired || (subscription?.status as string) !== "ACTIVE";

  // Hide pricing if they have a non-free plan selected (active or pending)
  const hasActivePlan = subscription && subscription.plan.slug !== "free" &&
    ((subscription.status as string) === "ACTIVE" || (subscription.status as string) === "PENDING_APPROVAL");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        hotelName={hotel.name}
        hotelLogo={hotel.logo}
        isLocked={isLocked}
        blockedFeatures={hotel.blockedFeatures}
        hasActivePlan={!!hasActivePlan}
      />
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
        <AccessGuard
          isLocked={isLocked}
          blockedFeatures={hotel.blockedFeatures}
          hasActivePlan={!!hasActivePlan}
        >
          {children}
        </AccessGuard>
      </main>
    </div>
  );
}