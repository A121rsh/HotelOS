
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createHotel } from "@/actions/create-hotel";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Hotel, Building, Phone, Camera, CheckCircle } from "lucide-react";

export function HotelForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        if (logoUrl) formData.append("logo", logoUrl);

        const res = await createHotel(formData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.refresh(); // Refresh page to trigger server-redirect to dashboard
            router.push("/dashboard");
        }
    }

    return (
        <Card className="w-full max-w-lg border border-slate-200 shadow-xl">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit">
                    <Hotel className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Set Up Your Hotel</CardTitle>
                <CardDescription>
                    Fill in your hotel details to get started. It only takes a minute.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Hotel Name</Label>
                        <div className="relative">
                            <Input name="hotelName" placeholder="e.g. Grand Plaza" required className="pl-10" />
                            <Building className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <div className="relative">
                            <Input name="mobile" placeholder="+91 9876543210" required className="pl-10" />
                            <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Hotel Logo (Optional)</Label>
                        <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50">
                            <ImageUpload
                                value={logoUrl ? [logoUrl] : []}
                                onChange={(url) => setLogoUrl(url)}
                                onRemove={() => setLogoUrl("")}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                        ) : (
                            <>Complete Setup</>
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <Button
                            variant="link"
                            type="button"
                            className="text-slate-500 text-sm"
                            onClick={() => window.location.href = "/api/auth/signout"}
                        >
                            Log Out
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
