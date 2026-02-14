"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Printer,
    Receipt,
    Percent,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Zap,
    Building2,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateInvoiceModalProps {
    bookingId: string;
    roomPrice: number;
}

export default function GenerateInvoiceModal({ bookingId, roomPrice }: GenerateInvoiceModalProps) {
    const [gstRate, setGstRate] = useState("12");
    const [open, setOpen] = useState(false);
    const router = useRouter();

    function handleGenerate() {
        setOpen(false);
        router.push(`/dashboard/invoices/${bookingId}?gst=${gstRate}`);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-all hover:bg-white/5 hover:text-[#a1f554] w-full group">
                    <Receipt className="mr-3 h-4 w-4 text-[#a1f554] group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white/60 group-hover:text-white">Provision Invoice</span>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl p-0 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_100px_rgba(161,245,84,0.05)] font-inter focus:outline-none overflow-hidden text-white selection:bg-[#a1f554] selection:text-black">
                <div className="max-h-[92vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Provision Invoice</DialogTitle>
                    <DialogDescription className="sr-only">Configure tax architecture and generate an official fiscal document for this booking.</DialogDescription>

                    {/* 1. INVOICE ENGINE HEADER */}
                    <div className="bg-[#0f110d] p-10 relative overflow-hidden border-b border-white/5">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20 shadow-[0_0_20px_rgba(161,245,84,0.1)]">
                                <Printer className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black font-outfit uppercase tracking-tight leading-none">Invoice Engine</h2>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#a1f554]" /> Compliance Logic Active v4.2
                                </p>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#a1f554]/5 rounded-full blur-[60px]" />
                        <Building2 className="absolute -bottom-10 -right-10 h-48 w-48 text-white/[0.02] pointer-events-none" />
                    </div>

                    <div className="p-10 space-y-10">
                        {/* 2. PRICE VITALS */}
                        <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-sm group hover:border-white/10 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Unit Base Price</p>
                                <p className="text-3xl font-black font-outfit text-white mt-3 tracking-tight">₹{roomPrice.toLocaleString()}</p>
                            </div>
                            <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 border border-white/5 shadow-sm group-hover:text-[#a1f554] group-hover:border-[#a1f554]/20 transition-all">
                                <Receipt className="h-7 w-7" />
                            </div>
                        </div>

                        {/* 3. TAX ARCHITECTURE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] shadow-[0_0_10px_rgba(161,245,84,1)] animate-pulse" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Tax Architecture (GST)</Label>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { rate: "0", label: "Tax Exempt", desc: "Non-GST / Under ₹1000", color: "#a1f554", icon: CheckCircle2 },
                                    { rate: "12", label: "Standard GST", desc: "Business / ₹1001-7500", color: "#3b82f6", icon: Zap },
                                    { rate: "18", label: "Luxury Tax", desc: "High-End / Over ₹7500", color: "#8b5cf6", icon: ShieldCheck }
                                ].map((item) => {
                                    const active = gstRate === item.rate;
                                    return (
                                        <div
                                            key={item.rate}
                                            onClick={() => setGstRate(item.rate)}
                                            className={cn(
                                                "relative flex items-center justify-between p-6 rounded-[2.2rem] border transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99]",
                                                active
                                                    ? "bg-white/10 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all",
                                                    active ? "bg-[#a1f554] text-black shadow-[0_0_30px_rgba(161,245,84,0.3)]" : "bg-white/5 text-white/20 group-hover:text-white/40 border border-white/5"
                                                )}>
                                                    {item.rate}%
                                                </div>
                                                <div>
                                                    <p className={cn(
                                                        "text-base font-black uppercase tracking-tight",
                                                        active ? "text-[#a1f554]" : "text-white/80 group-hover:text-white"
                                                    )}>{item.label}</p>
                                                    <p className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-[0.1em]">{item.desc}</p>
                                                </div>
                                            </div>
                                            {active && (
                                                <div className="h-10 w-10 rounded-full bg-black/40 border border-[#a1f554]/30 flex items-center justify-center shadow-lg text-[#a1f554]">
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. DISPATCH COMMAND */}
                        <Button
                            onClick={handleGenerate}
                            className="w-full h-18 bg-[#a1f554] hover:bg-[#b4f876] text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(161,245,84,0.15)] group active:scale-[0.98] border-none"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <Printer className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                Construct & Manifest Document
                                <ChevronRight className="h-4 w-4 opacity-30 group-hover:translate-x-2 transition-all" />
                            </div>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}