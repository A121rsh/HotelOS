"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Hotel, Building, Phone, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function OnboardingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get("planId");

    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const hotelName = formData.get("hotelName");
        const mobile = formData.get("mobile");

        // Use URLSearchParams to pass data to the next step
        const params = new URLSearchParams();
        if (planId) params.append("planId", planId);
        if (hotelName) params.append("hotelName", hotelName as string);
        if (mobile) params.append("mobile", mobile as string);
        if (logoUrl) params.append("logo", logoUrl);

        router.push(`/register?${params.toString()}`);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
        >
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <CardHeader className="text-center pt-10">
                    <div className="mx-auto mb-6 bg-blue-50 p-4 rounded-3xl w-fit shadow-sm">
                        <Hotel className="h-10 w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-3xl font-black font-outfit text-slate-900">Hotel Details</CardTitle>
                    <CardDescription className="text-slate-500 text-lg mt-2">
                        Tell us about your property. This takes less than 60 seconds.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold ml-1">Hotel Name</Label>
                                <div className="relative group">
                                    <Input
                                        name="hotelName"
                                        placeholder="e.g. Grand Heritage Resort"
                                        required
                                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-lg"
                                    />
                                    <Building className="h-5 w-5 absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold ml-1">Mobile Number</Label>
                                <div className="relative group">
                                    <Input
                                        name="mobile"
                                        placeholder="+91 9876543210"
                                        required
                                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all text-lg"
                                    />
                                    <Phone className="h-5 w-5 absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2 text-center">
                                <Label className="text-slate-700 font-bold block mb-2">Property Logo (Optional)</Label>
                                <div className="flex justify-center">
                                    <div className="w-full">
                                        <ImageUpload
                                            value={logoUrl ? [logoUrl] : []}
                                            onChange={(url) => setLogoUrl(url)}
                                            onRemove={() => setLogoUrl("")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-16 btn-premium rounded-2xl text-xl font-bold group" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Moving to next step...</>
                            ) : (
                                <>
                                    Next: Create Account
                                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                            <Sparkles className="h-4 w-4 text-blue-400" />
                            <span>Your data is encrypted and secure</span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
