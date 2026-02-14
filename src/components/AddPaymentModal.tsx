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
                <div className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-all hover:bg-white/5 hover:text-[#a1f554] w-full group">
                    <IndianRupee className="mr-3 h-4 w-4 text-[#a1f554] group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white/60 group-hover:text-white">Record Settlement</span>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl p-0 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_100px_rgba(161,245,84,0.05)] font-inter focus:outline-none overflow-hidden text-white selection:bg-[#a1f554] selection:text-black">
                <div className="max-h-[92vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Record Fiscal Settlement</DialogTitle>
                    <DialogDescription className="sr-only">Record a new payment for this booking by specifying the amount and payment protocol.</DialogDescription>

                    {/* 1. FISCAL PROTOCOL HEADER */}
                    <div className="bg-[#0f110d] p-10 relative overflow-hidden border-b border-white/5">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20 shadow-[0_0_20px_rgba(161,245,84,0.1)]">
                                <IndianRupee className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black font-outfit uppercase tracking-tight leading-none">Fiscal Settlement</h2>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#a1f554]" /> Secure Transaction Node v4.0
                                </p>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#a1f554]/5 rounded-full blur-[60px]" />
                        <Building2 className="absolute -bottom-10 -right-10 h-48 w-48 text-white/[0.02] pointer-events-none" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        {/* 2. LIABILITY READOUT */}
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-sm group hover:border-white/10 transition-all flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Residual Liability</p>
                                <p className="text-3xl font-black font-outfit text-red-500 mt-3 tracking-tight">₹{dueAmount.toLocaleString()}</p>
                            </div>
                            <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 border border-white/5 shadow-sm group-hover:text-red-500 group-hover:border-red-500/20 transition-all">
                                <DollarSign className="h-7 w-7" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* 3. SETTLEMENT AMOUNT */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] shadow-[0_0_10px_rgba(161,245,84,1)] animate-pulse" />
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Settlement Provision</Label>
                                </div>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-focus-within:text-[#a1f554] transition-colors" />
                                    <Input
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="h-20 pl-16 rounded-[1.5rem] border-white/5 bg-white/5 focus:bg-white/10 focus:ring-[#a1f554] focus:border-[#a1f554]/30 transition-all font-black text-3xl text-white placeholder:text-white/10"
                                        type="number"
                                        max={dueAmount}
                                    />
                                </div>
                            </div>

                            {/* 4. PAYMENT PROTOCOL */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] shadow-[0_0_10px_rgba(161,245,84,1)] animate-pulse" />
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Payment Protocol</Label>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: "CASH", label: "Cash", icon: IndianRupee, color: "#a1f554" },
                                        { id: "UPI", label: "UPI", icon: Zap, color: "#3b82f6" },
                                        { id: "CARD", label: "Card", icon: CreditCard, color: "#8b5cf6" }
                                    ].map((item) => {
                                        const active = mode === item.id;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setMode(item.id as any)}
                                                className={cn(
                                                    "relative p-6 rounded-[1.5rem] border transition-all cursor-pointer flex flex-col items-center gap-3 group hover:scale-[1.02] active:scale-[0.98]",
                                                    active
                                                        ? "bg-white/10 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                                                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                                                    active ? "bg-[#a1f554] text-black shadow-[0_0_20px_rgba(161,245,84,0.2)]" : "bg-white/5 text-white/20 group-hover:text-white/40 border border-white/5"
                                                )}>
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                                    active ? "text-[#a1f554]" : "text-white/40 group-hover:text-white/60"
                                                )}>{item.label}</span>
                                                {active && (
                                                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#a1f554] text-black flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                                        <CheckCircle2 className="h-4 w-4" />
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
                            className="w-full h-18 bg-[#a1f554] hover:bg-[#b4f876] text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(161,245,84,0.15)] group active:scale-[0.98] border-none"
                            disabled={loading || parseFloat(amount) <= 0}
                        >
                            {loading ? (
                                <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Syncing Fiscal Node...</>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    <ShieldCheck className="h-5 w-5 group-hover:scale-125 transition-transform" />
                                    Authorize & Push Transaction
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