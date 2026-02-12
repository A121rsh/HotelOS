import { db } from "@/lib/db";
import { auth } from "@/auth";
import { AlertTriangle, Zap, ShieldCheck } from "lucide-react";

export async function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    // 1. Fetch Global State (Safety check for missing model)
    if (!(db as any).systemConfig) return <>{children}</>;

    const config = await (db as any).systemConfig.findUnique({
        where: { id: "singleton" }
    });

    // 2. If not in maintenance, proceed
    if (!config?.isMaintenanceMode) return <>{children}</>;

    // 3. Bypass for Admin (So they can turn it off)
    const session = await auth();
    if (session?.user?.role === "ADMIN") return <>{children}</>;

    // 4. Render Lockdown Screen
    return (
        <div className="fixed inset-0 min-h-screen bg-slate-900 z-[9999] flex items-center justify-center p-6 font-inter overflow-hidden">
            {/* Background Architect */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-2xl w-full bg-slate-950/40 backdrop-blur-3xl border border-white/5 p-12 md:p-16 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 animate-pulse">
                    <Zap className="h-40 w-40 text-blue-400" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="h-24 w-24 bg-rose-500/20 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-rose-500/20">
                        <AlertTriangle className="h-12 w-12 text-rose-500" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight leading-none mb-6 italic">
                        System <span className="text-rose-500 tracking-tighter">Lockdown</span>
                    </h1>

                    <p className="text-slate-400 font-bold leading-relaxed mb-10 text-lg">
                        {config.maintenanceMessage || "The global property grid is currently undergoing scheduled synchronization. Operational access is temporarily suspended."}
                    </p>

                    <div className="space-y-6 w-full max-w-sm mx-auto">
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Atomic Integrity Valid</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                <span>Sync Progress</span>
                                <span className="text-rose-500">Enforced</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 w-[100%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5 flex justify-center gap-6">
                        <ShieldCheck className="h-5 w-5 text-slate-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Central Authority Directive 42.1</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
