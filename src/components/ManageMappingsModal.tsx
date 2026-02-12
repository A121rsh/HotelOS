"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    X,
    Loader2,
    ShieldCheck,
    Box,
    Link as LinkIcon,
    Percent,
    IndianRupee,
    Trash2,
    Plus,
    Tag,
    AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createMapping, deleteMapping } from "@/actions/channel";

interface ManageMappingsModalProps {
    channel: any;
    rooms: any[];
}

export default function ManageMappingsModal({ channel, rooms }: ManageMappingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [markupType, setMarkupType] = useState("PERCENTAGE");

    async function handleAddMapping(formData: FormData) {
        setIsLoading(true);
        formData.append("channelId", channel.id);
        formData.append("markupType", markupType);

        const res = await createMapping(formData);
        setIsLoading(false);

        if (!res.success) {
            alert(res.error);
        } else {
            setSelectedRoomId("");
        }
    }

    async function handleRemoveMapping(id: string) {
        if (!confirm("Revoking this mapping will halt ARI synchronization for this unit. Authorize revocation?")) return;
        const res = await deleteMapping(id);
        if (!res.success) alert(res.error);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    Deploy Mappings
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl p-0 rounded-[2rem] md:rounded-[3rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto scrollbar-hide">
                    {/* Radix Requirements */}
                    <DialogTitle className="sr-only">Inventory Mapping Protocol</DialogTitle>
                    <DialogDescription className="sr-only">Link local property inventory to external OTA nodes and configure dynamic pricing markups.</DialogDescription>

                    {/* 1. BOUTIQUE COMMAND HEADER */}
                    <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
                                <LinkIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black font-outfit uppercase tracking-tight leading-none italic">Inventory Hub</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Authorized Mapping Interface
                                </p>
                            </div>
                        </div>
                        <Box className="absolute -bottom-10 -right-10 h-48 w-48 text-white/5 pointer-events-none" />
                    </div>

                    <div className="p-10 space-y-10">
                        {/* 2. ADD NEW MAPPING SECTOR */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deploy New Node</Label>
                            </div>

                            <form action={handleAddMapping} className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Local Resource</Label>
                                    <select
                                        name="roomId"
                                        required
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(e.target.value)}
                                        className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Inventory Node...</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                R{room.number} - {room.type} (₹{room.price})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">OTA External Identifier</Label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            name="externalRoomId"
                                            placeholder="EXT_XXXXX"
                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Markup Protocol</Label>
                                    <div className="flex bg-white rounded-2xl border border-slate-200 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setMarkupType("PERCENTAGE")}
                                            className={cn(
                                                "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                                markupType === "PERCENTAGE" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                                            )}
                                        >
                                            <Percent className="h-3 w-3" /> Percentage
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMarkupType("FIXED")}
                                            className={cn(
                                                "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                                markupType === "FIXED" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
                                            )}
                                        >
                                            <IndianRupee className="h-3 w-3" /> Fixed Rate
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Delta Value</Label>
                                    <div className="relative group">
                                        {markupType === "PERCENTAGE" ? <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" /> : <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />}
                                        <Input
                                            name="markupValue"
                                            type="number"
                                            step="0.01"
                                            placeholder={markupType === "PERCENTAGE" ? "e.g. 15" : "e.g. 500"}
                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-2 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 group"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Initializing Mapping...</>
                                        ) : (
                                            <>
                                                <Zap className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                                                Confirm Mapping Deployment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* 3. ACTIVE MAPPINGS REGISTRY */}
                        <div className="space-y-6 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-emerald-500" />
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployed Mapping Registry</Label>
                                </div>
                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px]">{channel.mappings.length} Nodes</Badge>
                            </div>

                            <div className="space-y-3">
                                {channel.mappings.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No operational mappings found.</p>
                                    </div>
                                ) : (
                                    channel.mappings.map((mapping: any) => (
                                        <div key={mapping.id} className="group/item flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                                    R{mapping.room.number}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{mapping.room.type}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-100 uppercase tracking-widest px-1.5 h-4">
                                                            OTA ID: {mapping.externalRoomId}
                                                        </Badge>
                                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                                        <p className="text-[10px] font-bold text-emerald-600">
                                                            Markup: {mapping.markupValue}{mapping.markupType === 'PERCENTAGE' ? '%' : ' INR'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleRemoveMapping(mapping.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-xl bg-red-50 text-red-200 hover:text-red-600 hover:bg-red-100 transition-all opacity-0 group-hover/item:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
