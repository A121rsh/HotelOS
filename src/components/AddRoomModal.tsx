"use client";

import { useState } from "react";
import { createRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import {
    Plus,
    Loader2,
    DoorOpen,
    IndianRupee,
    Hash,
    Tag,
    CheckCircle2,
    X,
    Image as ImageIcon,
    Users
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
import { toast } from "sonner";

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
            toast.success("Room created successfully");
            setIsOpen(false);
            setImageUrl("");
        } else {
            toast.error(res?.error || "Error creating room");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="h-12 md:h-14 px-4 md:px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl group"
                >
                    <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline">Add Room</span>
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
                    <DialogTitle className="sr-only">Add New Room</DialogTitle>
                    <DialogDescription className="sr-only">
                        Create a new room by providing room details and uploading an image.
                    </DialogDescription>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-black to-[#0f110d] p-6 md:p-8 relative overflow-hidden border-b border-white/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#a1f554] rounded-full blur-[120px] opacity-10" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20">
                                <DoorOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Add New Room</h2>
                                <p className="text-xs text-slate-400 mt-1">Create a new room listing</p>
                            </div>
                        </div>
                    </div>

                    <form action={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
                        {/* Room Details */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <DoorOpen className="h-4 w-4 text-[#a1f554]" />
                                Room Details
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="number" className="text-xs text-slate-400">
                                        Room Number
                                    </Label>
                                    <Input
                                        id="number"
                                        name="number"
                                        placeholder="101"
                                        className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-xs text-slate-400">
                                        Room Type
                                    </Label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#a1f554]/50 focus:bg-white/10 focus:ring-1 focus:ring-[#a1f554]/30 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="DELUXE" className="bg-[#0f110d]">Deluxe</option>
                                        <option value="SUPER_DELUXE" className="bg-[#0f110d]">Super Deluxe</option>
                                        <option value="SUITE" className="bg-[#0f110d]">Suite</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-xs text-slate-400">
                                        Price per Night (₹)
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="2000"
                                        className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity" className="text-xs text-slate-400">
                                        Guest Capacity
                                    </Label>
                                    <Input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        placeholder="2"
                                        defaultValue="2"
                                        className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Room Image */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-[#8ba4b8]" />
                                Room Image
                            </Label>
                            <div className="rounded-xl border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-all">
                                <ImageUpload
                                    value={imageUrl ? [imageUrl] : []}
                                    onChange={setImageUrl}
                                    onRemove={() => setImageUrl("")}
                                    label="Upload Image"
                                />
                                {!imageUrl && (
                                    <div className="text-center mt-4">
                                        <p className="text-xs text-slate-400">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
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
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Create Room
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