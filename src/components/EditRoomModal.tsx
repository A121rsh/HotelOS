"use client";

import { useState } from "react";
import { updateRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pencil,
  X,
  Loader2,
  IndianRupee,
  Hash,
  Tag,
  ShieldCheck,
  Box,
  Save,
  RotateCcw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditRoomModalProps {
  room: {
    id: string;
    number: string;
    type: string;
    price: number;
  }
}

export default function EditRoomModal({ room }: EditRoomModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    await updateRoom(formData);
    setIsLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-all hover:bg-slate-100 hover:text-slate-900 w-full group">
          <Pencil className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="font-bold text-slate-600 group-hover:text-slate-900">Modify Identity</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
        <div className="max-h-[92vh] overflow-y-auto">
          {/* Radix Accessibility Requirements */}
          <DialogTitle className="sr-only">Modify Room Identity</DialogTitle>
          <DialogDescription className="sr-only">Update the number, type, and price for this room unit.</DialogDescription>

          {/* 1. EXECUTIVE HEADER */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-5">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                <Pencil className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Modify Node</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Hash className="h-3 w-3" /> System ID: <span className="text-white">{room.id.slice(-8).toUpperCase()}</span>
                </p>
              </div>
            </div>
            <Box className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
          </div>

          <form action={handleSubmit} className="p-10 space-y-8">
            <input type="hidden" name="roomId" value={room.id} />

            <div className="grid grid-cols-2 gap-8">
              {/* Unit ID */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Node Identifier</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Hash className="h-full w-full" />
                  </div>
                  <Input
                    name="number"
                    defaultValue={room.number}
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Fiscal Rate */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fiscal Rate (Nightly)</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <IndianRupee className="h-full w-full" />
                  </div>
                  <Input
                    name="price"
                    type="number"
                    defaultValue={room.price}
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Unit Classification</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Tag className="h-full w-full" />
                </div>
                <select
                  name="type"
                  defaultValue={room.type}
                  className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 pl-12 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="Standard">Standard Node</option>
                  <option value="Deluxe">Deluxe Suite</option>
                  <option value="Super Deluxe">Super Deluxe Executive</option>
                  <option value="Suite">Presidential Suite</option>
                  <option value="Dormitory">Communal Dormitory</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-blue-600 transition-colors">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* 3. COMMAND FOOTER */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                onClick={() => setOpen(false)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Abort Changes
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-14 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-3" /> Syncing Node Data...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                    Update Registry
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