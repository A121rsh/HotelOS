"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Globe,
    X,
    Loader2,
    ShieldCheck,
    Zap,
    Lock,
    Key,
    Server,
    Sparkles,
    Calendar,
    ChevronDown
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createChannel } from "@/actions/channel";

export default function AddChannelModal({ hotelId }: { hotelId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("BOOKING_COM");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        formData.append("hotelId", hotelId);
        formData.append("type", selectedType);

        const res = await createChannel(formData);
        setIsLoading(false);

        if (res.success) {
            setIsOpen(false);
        } else {
            alert(res.error);
        }
    }

    const channelIdentities = [
        { id: "BOOKING_COM", name: "Booking.com", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "AIRBNB", name: "Airbnb", icon: Sparkles, color: "text-rose-500", bg: "bg-rose-50" },
        { id: "EXPEDIA", name: "Expedia", icon: Server, color: "text-yellow-600", bg: "bg-yellow-50" },
        { id: "AGODA", name: "Agoda", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
        { id: "ICAL", name: "iCal Feed", icon: Calendar, color: "text-slate-600", bg: "bg-slate-50" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-14 px-8 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group">
                    <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
                    Connect New Channel
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl p-0 rounded-[2rem] md:rounded-[3rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto scrollbar-hide">
                    {/* Radix Requirements */}
                    <DialogTitle className="sr-only">Channel Connection Protocol</DialogTitle>
                    <DialogDescription className="sr-only">Authenticate and bridge a new OTA distribution node to the property core.</DialogDescription>

                    {/* 1. BOUTIQUE COMMAND HEADER */}
                    <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                                <Globe className="h-8 w-8 animate-spin-slow" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black font-outfit uppercase tracking-tight leading-none italic">Channel Bridge</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-blue-400" /> Secure Node Authentication
                                </p>
                            </div>
                        </div>
                        <Globe className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5 pointer-events-none" />
                    </div>

                    <form action={handleSubmit} className="p-10 space-y-10">

                        {/* 2. IDENTITY SELECTION */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Provider</Label>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {channelIdentities.map((ch) => (
                                    <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => setSelectedType(ch.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all group/btn",
                                            selectedType === ch.id
                                                ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20"
                                                : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                        )}
                                    >
                                        <ch.icon className={cn("h-8 w-8 mb-3 transition-transform group-hover/btn:scale-110", ch.color)} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{ch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. CONNECTION PARAMETERS */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-blue-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node Credentials</Label>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Channel Label</Label>
                                    <div className="relative group">
                                        <Server className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            name="name"
                                            placeholder="e.g. Booking.com - Imperial Deluxe"
                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                {selectedType === 'ICAL' ? (
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">iCal Source URL</Label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                name="iCalUrl"
                                                placeholder="https://airbnb.com/calendar/..."
                                                className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 font-mono text-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">API Node Key</Label>
                                            <div className="relative group">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                                <Input
                                                    name="apiKey"
                                                    placeholder="AK_XXXX..."
                                                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 font-mono text-xs"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">API Secret Protocol</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                                <Input
                                                    name="apiSecret"
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. EXECUTION COMMAND */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 bg-slate-900 border-none hover:bg-black text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-900/20 group"
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Establishing Synchronization...</>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-5 w-5 mr-3 group-hover:scale-125 transition-transform" />
                                        Authorize & Bridge Channel
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
