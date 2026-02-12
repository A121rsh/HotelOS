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
                <div className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-all hover:bg-slate-100 hover:text-slate-900 w-full group">
                    <Receipt className="mr-3 h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-600 group-hover:text-slate-900">Provision Invoice</span>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto">
                    {/* Radix Accessibility Requirements */}
                    <DialogTitle className="sr-only">Provision Invoice</DialogTitle>
                    <DialogDescription className="sr-only">Configure tax architecture and generate an official fiscal document for this booking.</DialogDescription>

                    {/* 1. INVOICE ENGINE HEADER */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                                <Printer className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Invoice Engine</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Compliance Logic Active v4.2
                                </p>
                            </div>
                        </div>
                        <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
                    </div>

                    <div className="p-10 space-y-8">
                        {/* 2. PRICE VITALS */}
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Unit Base Price</p>
                                <p className="text-2xl font-black font-outfit text-slate-900 mt-2 tracking-tight">₹{roomPrice.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm">
                                <Receipt className="h-6 w-6" />
                            </div>
                        </div>

                        {/* 3. TAX ARCHITECTURE */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tax Architecture (GST)</Label>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { rate: "0", label: "Tax Exempt", desc: "Non-GST / Under ₹1000", color: "emerald", icon: CheckCircle2 },
                                    { rate: "12", label: "Standard GST", desc: "Business / ₹1001-7500", color: "blue", icon: Zap },
                                    { rate: "18", label: "Luxury Tax", desc: "High-End / Over ₹7500", color: "purple", icon: ShieldCheck }
                                ].map((item) => {
                                    const active = gstRate === item.rate;
                                    return (
                                        <div
                                            key={item.rate}
                                            onClick={() => setGstRate(item.rate)}
                                            className={cn(
                                                "relative flex items-center justify-between p-6 rounded-[2rem] border transition-all cursor-pointer group",
                                                active
                                                    ? `bg-${item.color}-50 border-${item.color}-600/50 shadow-xl shadow-${item.color}-600/5`
                                                    : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all",
                                                    active ? `bg-${item.color}-600 text-white shadow-lg` : "bg-white text-slate-300 group-hover:text-slate-500 shadow-sm"
                                                )}>
                                                    {item.rate}%
                                                </div>
                                                <div>
                                                    <p className={cn(
                                                        "text-sm font-black uppercase tracking-tight",
                                                        active ? `text-${item.color}-700` : "text-slate-900"
                                                    )}>{item.label}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{item.desc}</p>
                                                </div>
                                            </div>
                                            {active && (
                                                <div className={cn("h-8 w-8 rounded-full bg-white border flex items-center justify-center shadow-sm", `text-${item.color}-600 border-${item.color}-200`)}>
                                                    <item.icon className="h-4 w-4" />
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
                            className="w-full h-16 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Printer className="h-5 w-5 group-hover:scale-110 transition-transform text-blue-400" />
                                Construct & Print Document
                                <ChevronRight className="h-4 w-4 opacity-30 group-hover:translate-x-2 transition-all" />
                            </div>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}