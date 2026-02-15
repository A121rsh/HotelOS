"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlan } from "@/actions/manage-plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2, Package } from "lucide-react";
import Link from "next/link";

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
                    Creating...
                </>
            ) : (
                <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Create Plan
                </>
            )}
        </Button>
    );
}

export default function NewPlanPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4 md:px-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex items-center gap-4">
                    <Link href="/admin/plans">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Package className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Create Plan</h1>
                            <p className="text-slate-400 text-sm mt-1">Add a new subscription plan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <Card className="bg-[#0f110d] border-white/10 rounded-2xl shadow-xl">
                <CardHeader className="p-6 md:p-8 border-b border-white/10">
                    <CardTitle className="text-xl font-bold text-white">Plan Details</CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                        Enter the details for the new subscription plan
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <form
                        action={async (formData) => {
                            await createPlan(formData);
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
                                placeholder="e.g., Enterprise" 
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
                                placeholder="5000" 
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
                                    placeholder="50 (-1 for unlimited)" 
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
                                    placeholder="-1 (unlimited)" 
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
                                placeholder="Brief description of the plan..."
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
                                placeholder="Unlimited Access, Priority Support, API Access..."
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
        </div>
    );
}