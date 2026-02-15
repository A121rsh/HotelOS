"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Loader2, X } from "lucide-react";
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
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f110d] border-white/10 rounded-2xl shadow-2xl max-w-md">
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="h-4 w-4" />
                </button>

                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-bold text-white">Delete Plan</DialogTitle>
                    <DialogDescription className="text-sm text-slate-400">
                        Are you sure you want to delete <span className="text-white font-semibold">{planName}</span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-3 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)} 
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        disabled={loading}
                        className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}