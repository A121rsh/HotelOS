import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { AccessGuard } from "@/components/AccessGuard";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // 🔐 Authority Bypass: Super Admins go to their own grid
  if ((session.user as any).role === "ADMIN") redirect("/admin");

  const hotel = await getHotelByUserId(session.user.id as string);

  // 🔄 State Recovery: Send only OWNERS without establishments to onboarding
  if (!hotel && (session.user as any).role === "OWNER") {
    redirect("/onboarding");
  }

  // 🛑 Security Protocol: If no establishment found for other roles, logout
  if (!hotel) redirect("/login");

  // ✅ CHECK: Subscription Status
  const subscription = await db.subscription.findUnique({
    where: { hotelId: hotel.id },
    include: {
      plan: true,
      invoices: {
        where: { status: "PAID" },
        take: 1
      }
    }
  });

  const hasPaid = (subscription?.invoices.length ?? 0) > 0 || subscription?.plan?.price === 0;

  if (subscription?.status === "PENDING_APPROVAL" && !hasPaid) {
    redirect(`/checkout?planId=${subscription.planId}&hotelId=${hotel.id}`);
  }

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
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 pt-20 md:pt-4">
        <AccessGuard
          isLocked={isLocked}
          isBlocked={!hotel.isActive}
          blockedFeatures={hotel.blockedFeatures}
          hasActivePlan={!!hasActivePlan}
          subscriptionStatus={subscription?.status as string}
          role={(session.user as any).role}
          permissions={(session.user as any).permissions || []}
        >
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </AccessGuard>
      </main>
    </div>
  );
}