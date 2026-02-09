
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Protect Admin Route: Only allow role === "ADMIN"
    if (!session || session.user.role !== "ADMIN") {
        // If user is logged in but not admin, send to 403 or home
        if (session) {
            redirect("/"); // Or show an unauthorized page
        }
        // If not logged in, send to login
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight">HotelOS Admin</h2>
                    <p className="text-xs text-slate-400 mt-1">Super Admin Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transitionify"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/hotels"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transitionify"
                    >
                        <Users className="h-5 w-5" />
                        Hotels
                    </Link>
                    <Link
                        href="/admin/plans"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transitionify"
                    >
                        <CreditCard className="h-5 w-5" />
                        Plans & Billing
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    {/* Logout logic can be added here or reuse user button */}
                    <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400">
                        <LogOut className="h-4 w-4" />
                        <span>
                            {session.user.email}
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
