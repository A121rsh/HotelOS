"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteHotel } from "@/actions/delete-hotel";
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

interface DeleteHotelButtonProps {
    hotelId: string;
    hotelName: string;
}

export function DeleteHotelButton({ hotelId, hotelName }: DeleteHotelButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmName, setConfirmName] = useState("");

    const handleDelete = async () => {
        if (confirmName !== hotelName) {
            toast.error("Confirmation protocol mismatch.");
            return;
        }

        setLoading(true);
        try {
            const res = await deleteHotel(hotelId);
            if (res.success) {
                toast.success(res.success);
                setOpen(false);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Critical failure during decommissioning.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-11 w-11 p-0 rounded-2xl bg-red-50 hover:bg-red-600 hover:text-white transition-all text-red-600 shadow-sm"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-8 font-inter overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Trash2 className="h-32 w-32" />
                </div>

                <DialogHeader>
                    <div className="mx-auto h-16 w-16 bg-red-100 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-red-500/10">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <DialogTitle className="text-3xl font-black font-outfit text-center text-slate-900 leading-none">
                        Purge Property Node?
                    </DialogTitle>
                    <DialogDescription className="text-center pt-4 text-slate-500 font-medium leading-relaxed">
                        This operation will permanently erase <span className="font-black text-slate-900">"{hotelName}"</span> and all associated staff, inventory, and fiscal history from the grid. This action is <span className="text-red-600 font-black italic">irreversible</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identity Confirmation Required</p>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Type property name to confirm"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-900 focus:outline-none focus:border-red-500 focus:ring-0 transition-all text-center placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-3">
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading || confirmName !== hotelName}
                        className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-red-500/20 disabled:opacity-50 group"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Initiate Purge Sequence
                                <Trash2 className="ml-3 h-4 w-4 transition-transform group-hover:scale-110" />
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="w-full h-12 rounded-xl text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50"
                    >
                        Abort Decommissioning
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
