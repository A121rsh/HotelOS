
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import { deletePlan } from "@/actions/manage-plans";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function DeletePlanButton({ planId, planName }: { planId: string, planName: string }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const res = await deletePlan(planId);
        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Plan deleted successfully");
            setOpen(false);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Plan</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the <strong>{planName}</strong> plan? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
