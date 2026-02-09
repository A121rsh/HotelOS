
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePlan } from "@/actions/manage-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Plan"}
        </Button>
    );
}

export function EditPlanForm({ plan }: { plan: Plan }) {
    const updatePlanWithId = updatePlan.bind(null, plan.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={updatePlanWithId} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Plan Name</Label>
                        <Input name="name" defaultValue={plan.name} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Monthly Price (₹)</Label>
                        <Input name="price" type="number" defaultValue={plan.price} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Max Rooms</Label>
                            <Input name="maxRooms" type="number" defaultValue={plan.maxRooms} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Bookings (-1 for Unlimited)</Label>
                            <Input name="maxBookings" type="number" defaultValue={plan.maxBookings} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={plan.description || ""} />
                    </div>

                    <div className="space-y-2">
                        <Label>Features (Comma separated)</Label>
                        <Textarea name="features" defaultValue={plan.features.join(", ")} />
                    </div>

                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
