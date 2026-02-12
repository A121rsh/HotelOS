"use client";

import { useState } from "react";
import { createRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import {
    Plus,
    X,
    Loader2,
    BedDouble,
    IndianRupee,
    Hash,
    Tag,
    Sparkles,
    ShieldCheck,
    Building2,
    Box
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

export default function AddRoomModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        if (imageUrl) {
            formData.append("image", imageUrl);
        }

        const res = await createRoom(formData);
        setIsLoading(false);

        if (res?.success) {
            setIsOpen(false);
            setImageUrl("");
        } else {
            alert(res?.error || "Error creating room");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="h-12 px-6 bg-slate-900 text-white hover:bg-black rounded-2xl border-none font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
                >
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Architect New Room
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto">
                    {/* Radix Accessibility Requirements */}
                    <DialogTitle className="sr-only">Architect New Room Node</DialogTitle>
                    <DialogDescription className="sr-only">Provision a new room unit by specifying its identifier, classification, and fiscal nightly rate.</DialogDescription>

                    {/* 1. BOUTIQUE COMMAND HEADER */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                                <Box className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Architect Node</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-amber-500" /> New Inventory Session
                                </p>
                            </div>
                        </div>
                        <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
                    </div>

                    <form action={handleSubmit} className="p-10 space-y-8">
                        {/* 2. IDENTITY SECTOR */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-blue-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Identity</Label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Node Identifier</Label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            name="number"
                                            placeholder="302"
                                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Classification</Label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                                        <select
                                            name="type"
                                            className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 pl-12 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="DELUXE">Deluxe Collection</option>
                                            <option value="SUPER_DELUXE">Super Deluxe</option>
                                            <option value="SUITE">Imperial Suite</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Fiscal Rate (Nightly)</Label>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        name="price"
                                        type="number"
                                        placeholder="8500"
                                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. VISUAL ASSET SECTOR */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BedDouble className="h-4 w-4 text-emerald-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual Representation</Label>
                            </div>
                            <div className="rounded-[2rem] border border-dashed border-slate-200 p-4 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all box-border overflow-hidden">
                                <ImageUpload
                                    value={imageUrl ? [imageUrl] : []}
                                    onChange={setImageUrl}
                                    onRemove={() => setImageUrl("")}
                                />
                            </div>
                        </div>

                        {/* 4. EXECUTION COMMAND */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-16 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Materializing Inventory...</>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                                        Commit & Deploy Room Node
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