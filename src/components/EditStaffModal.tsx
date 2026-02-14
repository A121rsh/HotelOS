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
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { updateStaff } from "@/actions/staff";
import {
    Loader2,
    ShieldCheck,
    User,
    Shield,
    CheckCircle2,
    Pencil,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURE_LIST } from "@/lib/constants";

interface EditStaffModalProps {
    staff: {
        id: string;
        name: string | null;
        email: string;
        role: string;
        permissions: string[];
    }
}

export default function EditStaffModal({ staff }: EditStaffModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await updateStaff(formData);
        setLoading(false);

        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Edit staff member"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl p-0 bg-[#0f110d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-6 top-6 z-50 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="max-h-[85vh] overflow-y-auto">
                    <DialogTitle className="sr-only">Edit Staff Member</DialogTitle>
                    <DialogDescription className="sr-only">
                        Update staff member information and permissions.
                    </DialogDescription>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-black to-[#0f110d] p-6 md:p-8 relative overflow-hidden border-b border-white/5">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#a1f554] rounded-full blur-[120px] opacity-10" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20">
                                <Pencil className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Edit Staff Member</h2>
                                <p className="text-xs text-slate-400 mt-1">Update member information</p>
                            </div>
                        </div>
                    </div>

                    <form action={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
                        <input type="hidden" name="staffId" value={staff.id} />

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <User className="h-4 w-4 text-[#a1f554]" />
                                Basic Information
                            </Label>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs text-slate-400">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={staff.name || ""}
                                    className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                    <Shield className="h-3.5 w-3.5 text-[#8ba4b8]" />
                                    Email: <span className="text-white font-medium">{staff.email}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1 ml-6">Email cannot be changed</p>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-white flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#8ba4b8]" />
                                Permissions
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {FEATURE_LIST.map((feature) => (
                                    <label
                                        key={feature.id}
                                        className="group relative flex items-center p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#a1f554]/30 hover:bg-white/10 transition-all cursor-pointer has-[:checked]:bg-[#a1f554]/10 has-[:checked]:border-[#a1f554]/50"
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#a1f554] transition-colors">
                                                <feature.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white leading-none">{feature.label}</p>
                                                <p className="text-xs text-slate-400 mt-1 leading-tight">{feature.description}</p>
                                            </div>
                                            <div className="relative flex items-center justify-center h-5 w-5 rounded-md border-2 border-white/20 bg-white/5 group-hover:border-[#a1f554]/50 transition-all overflow-hidden shrink-0">
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={feature.id}
                                                    className="peer sr-only"
                                                    defaultChecked={staff.permissions.includes(feature.id)}
                                                />
                                                <div className="absolute inset-0 bg-[#a1f554] opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1 h-12 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white transition-all"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Update Staff
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