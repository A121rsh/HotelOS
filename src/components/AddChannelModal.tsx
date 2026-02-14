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
    Lock,
    Key,
    Server,
    Sparkles,
    Calendar,
    Zap
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
        { id: "BOOKING_COM", name: "Booking.com", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "AIRBNB", name: "Airbnb", icon: Sparkles, color: "text-rose-500", bg: "bg-rose-500/10" },
        { id: "EXPEDIA", name: "Expedia", icon: Server, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { id: "AGODA", name: "Agoda", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: "ICAL", name: "iCal Feed", icon: Calendar, color: "text-[#8ba4b8]", bg: "bg-[#8ba4b8]/10" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 md:h-14 px-4 md:px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl group">
                    <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline">Add Channel</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl p-0 bg-[#0f110d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-6 top-6 z-50 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="max-h-[85vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Add New Channel</DialogTitle>
                    <DialogDescription className="sr-only">
                        Connect a new booking channel by providing credentials and configuration.
                    </DialogDescription>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-black to-[#0f110d] p-6 md:p-8 relative overflow-hidden border-b border-white/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#a1f554] rounded-full blur-[120px] opacity-10" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20">
                                <Globe className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Connect Channel</h2>
                                <p className="text-xs text-slate-400 mt-1">Add a new booking platform</p>
                            </div>
                        </div>
                    </div>

                    <form action={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">

                        {/* Provider Selection */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <Globe className="h-4 w-4 text-[#a1f554]" />
                                Select Platform
                            </Label>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {channelIdentities.map((ch) => (
                                    <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => setSelectedType(ch.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 md:p-5 rounded-xl border-2 transition-all group/btn",
                                            selectedType === ch.id
                                                ? "bg-[#a1f554]/10 border-[#a1f554] text-white shadow-lg"
                                                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10"
                                        )}
                                    >
                                        <ch.icon className={cn(
                                            "h-6 w-6 md:h-7 md:w-7 mb-2 transition-transform group-hover/btn:scale-110", 
                                            selectedType === ch.id ? ch.color : "text-slate-500"
                                        )} />
                                        <span className="text-xs font-semibold">{ch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="space-y-5">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <Lock className="h-4 w-4 text-[#8ba4b8]" />
                                Connection Details
                            </Label>

                            <div className="space-y-4">
                                {/* Channel Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs text-slate-400">
                                        Channel Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="e.g. Booking.com Main"
                                        className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                {selectedType === 'ICAL' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="iCalUrl" className="text-xs text-slate-400">
                                            iCal URL
                                        </Label>
                                        <Input
                                            id="iCalUrl"
                                            name="iCalUrl"
                                            placeholder="https://airbnb.com/calendar/..."
                                            className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500 font-mono text-xs"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="apiKey" className="text-xs text-slate-400">
                                                API Key
                                            </Label>
                                            <Input
                                                id="apiKey"
                                                name="apiKey"
                                                placeholder="Enter API key"
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500 font-mono text-xs"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="apiSecret" className="text-xs text-slate-400">
                                                API Secret
                                            </Label>
                                            <Input
                                                id="apiSecret"
                                                name="apiSecret"
                                                type="password"
                                                placeholder="Enter API secret"
                                                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white transition-all"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Connect Channel
                                    </>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}