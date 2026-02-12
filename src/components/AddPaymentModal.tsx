"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { addPayment } from "@/actions/payment";
import {
    IndianRupee,
    CreditCard,
    Loader2,
    Zap,
    ShieldCheck,
    Building2,
    X,
    ArrowRight,
    CheckCircle2,
    DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AddPaymentModalProps {
    bookingId: string;
    dueAmount: number;
}

export default function AddPaymentModal({ bookingId, dueAmount }: AddPaymentModalProps) {
    const [amount, setAmount] = useState(dueAmount.toString());
    const [mode, setMode] = useState<"CASH" | "UPI" | "CARD">("CASH");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await addPayment(bookingId, parseFloat(amount), mode);

        setLoading(false);
        if (res?.success) {
            setOpen(false);
        } else {
            alert(res?.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-all hover:bg-slate-100 hover:text-slate-900 w-full group">
                    <IndianRupee className="mr-3 h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-600 group-hover:text-slate-900">Record Settlement</span>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto">
                    {/* Radix Accessibility Requirements */}
                    <DialogTitle className="sr-only">Record Fiscal Settlement</DialogTitle>
                    <DialogDescription className="sr-only">Record a new payment for this booking by specifying the amount and payment protocol.</DialogDescription>

                    {/* 1. FISCAL PROTOCOL HEADER */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                                <IndianRupee className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Fiscal Settlement</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Secure Transaction Node v4.0
                                </p>
                            </div>
                        </div>
                        <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {/* 2. LIABILITY READOUT */}
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residual Liability</p>
                                <p className="text-3xl font-black font-outfit text-red-600 tracking-tight mt-1">₹{dueAmount.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* 3. SETTLEMENT AMOUNT */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Settlement Provision</Label>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <Input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="h-16 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-emerald-500 transition-all font-black text-2xl text-slate-900"
                                        type="number"
                                        max={dueAmount}
                                    />
                                </div>
                            </div>

                            {/* 4. PAYMENT PROTOCOL */}
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Payment Protocol</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: "CASH", label: "Cash", icon: IndianRupee, color: "emerald" },
                                        { id: "UPI", label: "UPI", icon: Zap, color: "blue" },
                                        { id: "CARD", label: "Card", icon: CreditCard, color: "indigo" }
                                    ].map((item) => {
                                        const active = mode === item.id;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setMode(item.id as any)}
                                                className={cn(
                                                    "relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 group",
                                                    active
                                                        ? `bg-${item.color}-50 border-${item.color}-200 shadow-sm`
                                                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                                    active ? `bg-white text-${item.color}-600 shadow-sm` : "bg-white text-slate-300 group-hover:text-slate-500 shadow-sm"
                                                )}>
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    active ? `text-${item.color}-700` : "text-slate-900"
                                                )}>{item.label}</span>
                                                {active && (
                                                    <div className={cn("absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-white border border shadow-sm flex items-center justify-center", `text-${item.color}-600 border-${item.color}-200`)}>
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 5. COMMAND FOOTER */}
                        <Button
                            type="submit"
                            className="w-full h-16 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
                            disabled={loading || parseFloat(amount) <= 0}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Processing Fiscal Node...</>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform text-emerald-500" />
                                    Authorize Transaction & Sync
                                    <ArrowRight className="h-4 w-4 opacity-30 group-hover:translate-x-2 transition-all" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}