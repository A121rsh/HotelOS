"use client";

import { useState } from "react";
import {
    Zap,
    Globe,
    Mail,
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
        primaryColor: "#a1f554",
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateSystemConfig(config);
            if (res.success) toast.success("Settings saved successfully");
            else toast.error(res.error);
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const handleMaintenanceToggle = async (checked: boolean) => {
        const msg = config.maintenanceMessage || "System is under maintenance. Please check back soon.";
        setLoading(true);
        try {
            const res = await toggleMaintenanceMode(checked, msg);
            if (res.success) {
                setConfig({ ...config, isMaintenanceMode: checked });
                toast.warning(`Maintenance mode ${checked ? "enabled" : "disabled"}`);
            } else toast.error(res.error);
        } catch (error) {
            toast.error("Failed to toggle maintenance mode");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 pb-20">

            {/* Maintenance Mode */}
            <div className={cn(
                "p-6 md:p-8 rounded-2xl border transition-all shadow-xl relative overflow-hidden",
                config.isMaintenanceMode
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-[#0f110d] border-white/10"
            )}>
                {config.isMaintenanceMode && (
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <AlertTriangle className="h-32 w-32 text-red-500" />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className={cn(
                            "h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center transition-all shadow-lg border",
                            config.isMaintenanceMode
                                ? "bg-red-500/20 border-red-500/30 text-red-500"
                                : "bg-[#a1f554]/10 border-[#a1f554]/20 text-[#a1f554]"
                        )}>
                            <Zap className={cn("h-6 w-6 md:h-7 md:w-7", config.isMaintenanceMode && "animate-pulse")} />
                        </div>
                        <div>
                            <h2 className={cn("text-xl md:text-2xl font-bold", config.isMaintenanceMode ? "text-red-500" : "text-white")}>
                                {config.isMaintenanceMode ? "Maintenance Active" : "System Status"}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {config.isMaintenanceMode ? "Site is in maintenance mode" : "All systems operational"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className={cn("text-xs font-semibold", config.isMaintenanceMode ? "text-red-400" : "text-slate-400")}>
                            {config.isMaintenanceMode ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                            checked={config.isMaintenanceMode}
                            onCheckedChange={handleMaintenanceToggle}
                            disabled={loading}
                            className="data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-slate-700"
                        />
                    </div>
                </div>

                {config.isMaintenanceMode && (
                    <div className="mt-6 relative z-10">
                        <Label className="text-sm font-semibold text-white mb-2 block">Maintenance Message</Label>
                        <Input
                            value={config.maintenanceMessage}
                            onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                            className="h-12 rounded-xl border-red-500/20 bg-red-500/5 focus:bg-red-500/10 focus:border-red-500/40 text-white"
                            placeholder="Enter message to display..."
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                {/* General Settings */}
                <div className="bg-[#0f110d] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                        <div className="h-10 w-10 bg-[#a1f554]/10 text-[#a1f554] rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                            <Globe className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">General</h3>
                            <p className="text-xs text-slate-400">Basic site information</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SettingField 
                            label="Site Name" 
                            value={config.siteName} 
                            onChange={(v: string) => setConfig({ ...config, siteName: v })} 
                            placeholder="HotelOS" 
                        />
                        <SettingField 
                            label="Support Email" 
                            value={config.supportEmail} 
                            onChange={(v: string) => setConfig({ ...config, supportEmail: v })} 
                            placeholder="support@example.com" 
                        />
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-white">Primary Color</Label>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                                <Input
                                    type="color"
                                    value={config.primaryColor}
                                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                    className="h-10 w-20 p-1 bg-transparent border-none cursor-pointer"
                                />
                                <span className="text-sm font-mono text-white">{config.primaryColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMTP Settings */}
                <div className="bg-[#0f110d] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                        <div className="h-10 w-10 bg-[#a1f554]/10 text-[#a1f554] rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Email (SMTP)</h3>
                            <p className="text-xs text-slate-400">Email server configuration</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <SettingField 
                                    label="SMTP Host" 
                                    value={config.smtpHost} 
                                    onChange={(v: string) => setConfig({ ...config, smtpHost: v })} 
                                    placeholder="smtp.example.com" 
                                />
                            </div>
                            <SettingField 
                                label="Port" 
                                value={config.smtpPort} 
                                onChange={(v: string) => setConfig({ ...config, smtpPort: parseInt(v) || 587 })} 
                                type="number" 
                            />
                        </div>
                        <SettingField 
                            label="Username" 
                            value={config.smtpUser} 
                            onChange={(v: string) => setConfig({ ...config, smtpUser: v })} 
                            placeholder="user@example.com" 
                        />
                        <div className="relative">
                            <SettingField 
                                label="Password" 
                                value={config.smtpPass} 
                                onChange={(v: string) => setConfig({ ...config, smtpPass: v })} 
                                type={showPass ? "text" : "password"} 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-11 text-slate-400 hover:text-[#a1f554] transition-colors"
                            >
                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 rounded-xl bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold transition-all shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
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
        <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
            />
        </div>
    );
}