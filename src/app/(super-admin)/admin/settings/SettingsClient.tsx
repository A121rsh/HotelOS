"use client";

import { useState } from "react";
import {
    Zap,
    ShieldCheck,
    Globe,
    Mail,
    Server,
    Loader2,
    Save,
    AlertTriangle,
    Eye,
    EyeOff
} from "lucide-react";
import { updateSystemConfig, toggleMaintenanceMode } from "@/actions/system";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SettingsClient({ initialConfig }: { initialConfig: any }) {
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [config, setConfig] = useState(initialConfig || {
        siteName: "HotelOS",
        supportEmail: "",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
        isMaintenanceMode: false,
        maintenanceMessage: "",
        primaryColor: "#2563eb",
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateSystemConfig(config);
            if (res.success) toast.success("Authority Protocols synchronized successfully.");
            else toast.error(res.error);
        } catch (error) {
            toast.error("Critical failure during synchronization.");
        } finally {
            setLoading(false);
        }
    };

    const handleMaintenanceToggle = async (checked: boolean) => {
        const msg = config.maintenanceMessage || "System is undergoing scheduled synchronization.";
        setLoading(true);
        try {
            const res = await toggleMaintenanceMode(checked, msg);
            if (res.success) {
                setConfig({ ...config, isMaintenanceMode: checked });
                toast.warning(`Global Maintenance Mode: ${checked ? "ACTIVATED" : "DEACTIVATED"}`);
            } else toast.error(res.error);
        } catch (error) {
            toast.error("Authority override failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-12 pb-20">

            {/* 1. GLOBAL STATE OVERRIDE */}
            <div className={cn(
                "p-12 rounded-[3.5rem] border-2 transition-all duration-700 shadow-2xl overflow-hidden relative",
                config.isMaintenanceMode
                    ? "bg-rose-50 border-rose-200 shadow-rose-200/50"
                    : "bg-white border-slate-100 shadow-slate-200/50"
            )}>
                {config.isMaintenanceMode && (
                    <div className="absolute top-0 right-0 p-12 opacity-10 animate-pulse">
                        <AlertTriangle className="h-40 w-40 text-rose-600" />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className={cn(
                            "h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl",
                            config.isMaintenanceMode ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
                        )}>
                            <Zap className={cn("h-10 w-10", config.isMaintenanceMode && "animate-pulse")} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Global Maintenance Protocol</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3 italic">Intercepts all node traffic across the grid</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-xl border border-slate-50">
                        <span className={cn("font-black text-xs uppercase tracking-widest", config.isMaintenanceMode ? "text-rose-600" : "text-slate-400")}>
                            {config.isMaintenanceMode ? "LOCKDOWN ACTIVE" : "OPERATIONAL"}
                        </span>
                        <Switch
                            checked={config.isMaintenanceMode}
                            onCheckedChange={handleMaintenanceToggle}
                            disabled={loading}
                            className="data-[state=checked]:bg-rose-600"
                        />
                    </div>
                </div>

                {config.isMaintenanceMode && (
                    <div className="mt-10 max-w-2xl">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3 block">Public Broadcast Message</Label>
                        <Input
                            value={config.maintenanceMessage}
                            onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                            className="h-14 rounded-2xl border-rose-200 bg-white/50 focus:bg-white text-rose-950 font-bold"
                            placeholder="Inform tenants about the sync window..."
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* 2. CORE IDENTITY PROTOCOLS */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-10">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100/50">
                            <Globe className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900">Platform Identity</h3>
                    </div>

                    <div className="space-y-8">
                        <SettingField label="Establishment Name" value={config.siteName} onChange={(v: string) => setConfig({ ...config, siteName: v })} placeholder="HotelOS Enterprise" />
                        <SettingField label="Master Support Email" value={config.supportEmail} onChange={(v: string) => setConfig({ ...config, supportEmail: v })} placeholder="central@hotelos.com" />
                        <SettingField label="Primary Global Color" value={config.primaryColor} onChange={(v: string) => setConfig({ ...config, primaryColor: v })} type="color" />
                    </div>
                </div>

                {/* 3. SMTP TRANSMISSION PROTOCOLS */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-10">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/50">
                            <Mail className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900">Secure SMTP Engine</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <SettingField label="SMTP Host Address" value={config.smtpHost} onChange={(v: string) => setConfig({ ...config, smtpHost: v })} placeholder="smtp.resend.com" />
                            </div>
                            <SettingField label="Node Port" value={config.smtpPort} onChange={(v: string) => setConfig({ ...config, smtpPort: parseInt(v) })} type="number" />
                        </div>
                        <SettingField label="Identity (Username)" value={config.smtpUser} onChange={(v: string) => setConfig({ ...config, smtpUser: v })} placeholder="resend@node.smtp" />
                        <div className="relative">
                            <SettingField label="Access Cipher (Password)" value={config.smtpPass} onChange={(v: string) => setConfig({ ...config, smtpPass: v })} type={showPass ? "text" : "password"} />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-6 top-12 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAVE COMMAND */}
            <div className="flex justify-end pt-10">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-20 px-16 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/30 transition-all active:scale-95 group"
                >
                    {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <>
                            Synchronize Authority Overrides
                            <Save className="ml-4 h-5 w-5 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

interface SettingFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

function SettingField({ label, value, onChange, placeholder, type = "text" }: SettingFieldProps) {
    return (
        <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-500 font-bold text-slate-900 transition-all px-6"
            />
        </div>
    );
}
