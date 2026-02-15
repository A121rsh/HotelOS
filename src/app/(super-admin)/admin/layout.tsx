import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Protect Admin Route: Only allow role === "ADMIN"
    if (!session || session.user.role !== "ADMIN") {
        if (session) {
            redirect("/");
        }
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-[#050505] font-inter selection:bg-[#a1f554]/30 selection:text-white">
            {/* HIGH-AUTHORITY SIDEBAR (Responsive) */}
            <SuperAdminSidebar email={session.user.email as string} />

            {/* MAIN INTELLIGENCE CANVAS */}
            <main className="flex-1 min-h-screen relative overflow-hidden pt-16 lg:pt-0">
                {/* Ambient Grid Glows */}
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#a1f554]/5 rounded-full blur-[180px] -z-10 pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px] -z-10 pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="p-4 md:p-8 lg:p-12 xl:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
}

function HotelsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="8" x="2" y="2" rx="2" /><path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M10 18H2" /><path d="M10 14H2" /><path d="M2 22h12" /><path d="M16 14v8" /><path d="M20 14v8" /><path d="M22 18h-4" /></svg>
    )
}
