import { db } from "@/lib/db";
import { SettingsClient } from "./SettingsClient";
import { Settings, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getConfig() {
    return await db.systemConfig.findUnique({
        where: { id: "singleton" }
    });
}

export default async function AdminSettingsPage() {
    const config = await getConfig();

    return (
        <div className="max-w-[1500px] mx-auto space-y-12 font-inter">

            {/* SETTINGS HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="flex items-center gap-8">
                    <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
                        <Settings className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Authority Protocol</h1>
                        <div className="flex items-center gap-3 mt-3">
                            <Badge className="bg-blue-50 text-blue-600 border-none font-black uppercase tracking-widest text-[9px] px-3 py-1">Master Configuration Registry</Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authorized Personnel Only
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <SettingsClient initialConfig={config} />

            {/* FOOTER INTELLIGENCE */}
            <div className="p-12 bg-slate-100/50 rounded-[3rem] border border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 mt-20">
                <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">System Synchronization Integrity Valid v1.0.42</p>
                </div>
                <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Active Encryption: SHA-256</span>
                    <div className="h-4 w-px bg-slate-300" />
                    <span>Central Node: 1A-42-F9</span>
                </div>
            </div>
        </div>
    );
}
