import { db } from "@/lib/db";
import { SettingsClient } from "./SettingsClient";
import { Settings } from "lucide-react";

async function getConfig() {
    return await db.systemConfig.findUnique({
        where: { id: "singleton" }
    });
}

export default async function AdminSettingsPage() {
    const config = await getConfig();

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                    <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                        <Settings className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-white">System Settings</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage system configuration</p>
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <SettingsClient initialConfig={config} />
        </div>
    );
}