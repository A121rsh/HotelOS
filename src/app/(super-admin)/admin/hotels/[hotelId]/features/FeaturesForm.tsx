"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateHotelFeatures } from "@/actions/manage-hotel-features";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
    LayoutGrid,
    BookOpen,
    Box,
    Users,
    Sparkles,
    ListTodo,
    ShieldCheck,
    Settings,
    CreditCard,
    Loader2,
    Save,
    RotateCcw,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_FEATURES = [
    { id: "DASHBOARD", label: "Dashboard Overview", icon: LayoutGrid, desc: "Primary performance intelligence layer" },
    { id: "BOOKINGS", label: "Bookings Management", icon: BookOpen, desc: "Guest reservation and stay lifecycle" },
    { id: "ROOMS", label: "Room & Inventory", icon: Box, desc: "Property unit and housekeeping records" },
    { id: "GUESTS", label: "Guest Database", icon: Users, desc: "CRM-inspired visitor identity tracking" },
    { id: "HOUSEKEEPING", label: "Housekeeping Module", icon: Sparkles, desc: "Environmental maintenance coordination" },
    { id: "TASKS", label: "Task Management", icon: ListTodo, desc: "Boutique operational queue" },
    { id: "CHANNELS", label: "Channel Manager", icon: Globe, desc: "Global OTA distribution and inventory sync" },
    { id: "STAFF", label: "Staff Management", icon: ShieldCheck, desc: "Human resource governance" },
    { id: "SETTINGS", label: "Hotel Settings", icon: Settings, desc: "Property configuration engine" },
    { id: "PRICING", label: "Subscription & Plans", icon: CreditCard, desc: "Fiscal architecture and billing" },
];

export function FeaturesForm({ hotelId, initialBlocked }: { hotelId: string, initialBlocked: string[] }) {
    const [blocked, setBlocked] = useState<string[]>(initialBlocked);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleFeature = (featureId: string) => {
        setBlocked(prev =>
            prev.includes(featureId)
                ? prev.filter(id => id !== featureId)
                : [...prev, featureId]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        const res = await updateHotelFeatures(hotelId, blocked);
        if (res.success) {
            toast.success("Hotel features updated successfully");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update features");
        }
        setLoading(false);
    };

    return (
        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                        <Settings className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-2xl font-black font-outfit text-slate-900 tracking-tight">Access Restrictions</CardTitle>
                </div>
                <CardDescription className="text-slate-500 font-medium">
                    Select the modules you wish to <span className="text-red-600 font-black uppercase tracking-tight">deactivate</span> for this property node.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ALL_FEATURES.map((feature) => {
                        const isBlocked = blocked.includes(feature.id);
                        return (
                            <div
                                key={feature.id}
                                onClick={() => toggleFeature(feature.id)}
                                className={cn(
                                    "relative flex items-center gap-4 p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group",
                                    isBlocked
                                        ? "bg-red-50 border-red-100 shadow-inner"
                                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-500",
                                    isBlocked
                                        ? "bg-white text-red-500 shadow-sm"
                                        : "bg-white text-slate-400 group-hover:text-blue-600 shadow-sm"
                                )}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest leading-none",
                                        isBlocked ? "text-red-700" : "text-slate-900"
                                    )}>{feature.label}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight truncate">{feature.desc}</p>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id={feature.id}
                                        checked={isBlocked}
                                        onCheckedChange={() => toggleFeature(feature.id)}
                                        className={cn(
                                            "h-6 w-6 rounded-lg border-2 transition-all",
                                            isBlocked ? "bg-red-600 border-red-600 text-white" : "border-slate-200"
                                        )}
                                    />
                                </div>

                                {isBlocked && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-red-600 text-white border-none font-black text-[7px] uppercase tracking-widest px-1.5 py-0.5">Restricted</Badge>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            <CardFooter className="p-10 pt-0 flex justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-14 px-8 rounded-2xl border-slate-200 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Revert
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="h-14 px-10 bg-slate-900 hover:bg-black text-white rounded-2xl border-none font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
                >
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning Access...</>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Update Governance
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
