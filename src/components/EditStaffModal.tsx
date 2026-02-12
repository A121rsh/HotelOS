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
    Zap,
    Building2,
    ChevronRight,
    CheckCircle2,
    Pencil
} from "lucide-react";
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
                <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black text-[9px] uppercase tracking-widest transition-all">
                    <Pencil className="h-3 w-3 mr-2" /> Modify Access
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
                <div className="max-h-[92vh] overflow-y-auto">
                    {/* Radix Accessibility Requirements */}
                    <DialogTitle className="sr-only">Modify Staff Authority</DialogTitle>
                    <DialogDescription className="sr-only">Update attributes and feature provisioning for this manager node.</DialogDescription>

                    {/* 1. EXECUTIVE MODIFICATION HEADER */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Authority Modification</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <Shield className="h-3 w-3 text-blue-500" /> System ID: <span className="text-white">{staff.id.slice(-8).toUpperCase()}</span>
                                </p>
                            </div>
                        </div>
                        <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
                    </div>

                    <form action={handleSubmit} className="p-8 space-y-8">
                        <input type="hidden" name="staffId" value={staff.id} />

                        {/* 2. IDENTITY SECTOR */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel Identity</Label>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        name="name"
                                        defaultValue={staff.name || ""}
                                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Network email reconfiguration is restricted to Root level only.</p>
                        </div>

                        {/* 3. AUTHORITY DELEGATION SECTOR */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Digital Access Re-Provisioning</Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {FEATURE_LIST.map((feature) => (
                                    <label
                                        key={feature.id}
                                        className="group relative flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-white transition-all cursor-pointer has-[:checked]:bg-blue-50/50 has-[:checked]:border-blue-500"
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                                <feature.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black uppercase text-slate-700 leading-none">{feature.label}</p>
                                                <p className="text-[8.5px] text-slate-400 font-bold mt-1 leading-tight">{feature.description}</p>
                                            </div>
                                            <div className="relative flex items-center justify-center h-5 w-5 rounded-lg border-2 border-slate-200 bg-white group-hover:border-blue-400 transition-all overflow-hidden shrink-0">
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={feature.id}
                                                    className="peer sr-only"
                                                    defaultChecked={staff.permissions.includes(feature.id)}
                                                />
                                                <div className="absolute inset-0 bg-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 4. EXECUTION COMMAND */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Abort
                            </Button>
                            <Button
                                type="submit"
                                className="flex-[2] h-14 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/20 group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Updating Node...</>
                                ) : (
                                    <>
                                        Commence Synchronization
                                        <ChevronRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
