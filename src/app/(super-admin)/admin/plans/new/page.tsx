
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlan } from "@/actions/manage-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create Plan"}
        </Button>
    );
}

export default function NewPlanPage() {
    const [error, setError] = useState("");

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/admin/plans" className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create Subscription Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        action={async (formData) => {
                            await createPlan(formData);
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label>Plan Name</Label>
                            <Input name="name" placeholder="e.g. Enterprise" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Monthly Price (₹)</Label>
                            <Input name="price" type="number" placeholder="5000" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Rooms</Label>
                                <Input name="maxRooms" type="number" placeholder="50" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Bookings (-1 for Unlimited)</Label>
                                <Input name="maxBookings" type="number" placeholder="-1" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea name="description" placeholder="Brief description of the plan..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Features (Comma separated)</Label>
                            <Textarea name="features" placeholder="Unlimited Access, Priority Support, API Access..." />
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
