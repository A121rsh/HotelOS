"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePlan } from "@/actions/manage-plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    maxRooms: number;
    maxBookings: number;
    features: string[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className="w-full h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Plan
                </>
            )}
        </Button>
    );
}

export function EditPlanForm({ plan }: { plan: Plan }) {
    const updatePlanWithId = updatePlan.bind(null, plan.id);

    return (
        <Card className="bg-[#0f110d] border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="p-6 md:p-8 border-b border-white/10">
                <CardTitle className="text-xl font-bold text-white">Edit Plan</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                    Update the subscription plan details
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <form
                    action={async (formData) => {
                        await updatePlanWithId(formData);
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-white">
                            Plan Name *
                        </Label>
                        <Input 
                            id="name"
                            name="name" 
                            defaultValue={plan.name} 
                            required 
                            className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-semibold text-white">
                            Monthly Price (₹) *
                        </Label>
                        <Input 
                            id="price"
                            name="price" 
                            type="number" 
                            defaultValue={plan.price} 
                            required 
                            className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="maxRooms" className="text-sm font-semibold text-white">
                                Max Rooms *
                            </Label>
                            <Input 
                                id="maxRooms"
                                name="maxRooms" 
                                type="number" 
                                defaultValue={plan.maxRooms} 
                                required 
                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxBookings" className="text-sm font-semibold text-white">
                                Max Bookings *
                            </Label>
                            <Input 
                                id="maxBookings"
                                name="maxBookings" 
                                type="number" 
                                defaultValue={plan.maxBookings} 
                                required 
                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-white">
                            Description
                        </Label>
                        <Textarea 
                            id="description"
                            name="description" 
                            defaultValue={plan.description || ""}
                            rows={3}
                            className="rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features" className="text-sm font-semibold text-white">
                            Features
                        </Label>
                        <Textarea 
                            id="features"
                            name="features" 
                            defaultValue={plan.features.join(", ")}
                            rows={4}
                            className="rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white resize-none"
                        />
                        <p className="text-xs text-slate-500">Separate features with commas</p>
                    </div>

                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}