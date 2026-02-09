"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateHotelFeatures } from "@/actions/manage-hotel-features";
import { useRouter } from "next/navigation";

const ALL_FEATURES = [
    { id: "DASHBOARD", label: "Dashboard Overview" },
    { id: "BOOKINGS", label: "Bookings Management" },
    { id: "ROOMS", label: "Room & Inventory Control" },
    { id: "GUESTS", label: "Guest Database" },
    { id: "HOUSEKEEPING", label: "Housekeeping Module" },
    { id: "TASKS", label: "Task Management" },
    { id: "STAFF", label: "Staff Management" },
    { id: "SETTINGS", label: "Hotel Settings" },
    { id: "PRICING", label: "Subscription & Plans" },
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
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Blocked Features</CardTitle>
                <CardDescription>
                    Select the features you want to DISABLE for this hotel.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ALL_FEATURES.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-slate-50 transition-colors">
                            <Checkbox
                                id={feature.id}
                                checked={blocked.includes(feature.id)}
                                onCheckedChange={() => toggleFeature(feature.id)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor={feature.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {feature.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 mt-4">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
