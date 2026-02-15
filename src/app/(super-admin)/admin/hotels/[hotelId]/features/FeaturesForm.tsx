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
    DoorOpen,
    Users,
    Sparkles,
    ListTodo,
    ShieldCheck,
    Settings,
    CreditCard,
    Loader2,
    Save,
    X,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_FEATURES = [
    { id: "DASHBOARD", label: "Dashboard", icon: LayoutGrid },
    { id: "BOOKINGS", label: "Bookings", icon: BookOpen },
    { id: "ROOMS", label: "Rooms", icon: DoorOpen },
    { id: "GUESTS", label: "Guests", icon: Users },
    { id: "HOUSEKEEPING", label: "Housekeeping", icon: Sparkles },
    { id: "TASKS", label: "Tasks", icon: ListTodo },
    { id: "CHANNELS", label: "Channels", icon: Settings },
    { id: "STAFF", label: "Staff", icon: ShieldCheck },
    { id: "SETTINGS", label: "Settings", icon: Settings },
    { id: "PRICING", label: "Pricing", icon: CreditCard },
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
            toast.success("Features updated successfully");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update features");
        }
        setLoading(false);
    };

    return (
        <Card className="bg-[#0f110d] border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="p-6 md:p-8 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                        <Settings className="h-5 w-5 text-[#a1f554]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Feature Access</CardTitle>
                </div>
                <CardDescription className="text-slate-400 text-sm">
                    Select features to disable for this hotel
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {ALL_FEATURES.map((feature) => {
                        const isBlocked = blocked.includes(feature.id);
                        return (
                            <div
                                key={feature.id}
                                onClick={() => toggleFeature(feature.id)}
                                className={cn(
                                    "relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group",
                                    isBlocked
                                        ? "bg-red-500/10 border-red-500/20"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#a1f554]/30"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                                    isBlocked
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-white/10 text-slate-400 group-hover:text-[#a1f554]"
                                )}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                
                                <div className="text-center w-full">
                                    <p className={cn(
                                        "text-xs font-semibold truncate",
                                        isBlocked ? "text-red-400" : "text-white"
                                    )}>
                                        {feature.label}
                                    </p>
                                </div>

                                <Checkbox
                                    id={feature.id}
                                    checked={isBlocked}
                                    onCheckedChange={() => toggleFeature(feature.id)}
                                    className={cn(
                                        "h-5 w-5 rounded-md border-2 transition-all",
                                        isBlocked ? "bg-red-500 border-red-500 text-white" : "border-white/20"
                                    )}
                                />

                                {isBlocked && (
                                    <Badge className="absolute top-2 right-2 bg-red-500 text-white border-none text-[10px] px-2 py-0.5">
                                        Off
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            <CardFooter className="p-6 md:p-8 pt-0 flex flex-col sm:flex-row justify-between gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-12 px-6 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white transition-all"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="h-12 px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}