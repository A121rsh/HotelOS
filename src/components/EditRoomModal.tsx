"use client";

import { useState } from "react";
import { updateRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pencil,
  Loader2,
  CheckCircle2,
  X,
  DoorOpen
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditRoomModalProps {
  room: {
    id: string;
    number: string;
    type: string;
    price: number;
    capacity?: number;
    image?: string | null;
  };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EditRoomModal({ room, isOpen, onOpenChange }: EditRoomModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use controlled state if provided, otherwise fallback to internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const res = await updateRoom(formData);
    setIsLoading(false);

    if (res?.success) {
      toast.success("Room updated successfully");
      setOpen(false);
    } else {
      toast.error(res?.error || "Error updating room");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-xl p-0 bg-[#0f110d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 z-50 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">Edit Room Details</DialogTitle>
          <DialogDescription className="sr-only">
            Update room number, type, and price information.
          </DialogDescription>

          {/* Header */}
          <div className="bg-gradient-to-br from-black to-[#0f110d] p-6 md:p-8 relative overflow-hidden border-b border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#a1f554] rounded-full blur-[120px] opacity-10" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="h-14 w-14 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20">
                <Pencil className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Edit Room</h2>
                <p className="text-xs text-slate-400 mt-1">Update room details</p>
              </div>
            </div>
          </div>

          <form action={handleSubmit} className="p-6 md:p-8 space-y-6">
            <input type="hidden" name="roomId" value={room.id} />

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-white flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-[#a1f554]" />
                Room Information
              </Label>

              <div className="space-y-4">
                {/* Room Number */}
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-xs text-slate-400">
                    Room Number
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    defaultValue={room.number}
                    className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white"
                    required
                  />
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs text-slate-400">
                    Room Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={room.type}
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#a1f554]/50 focus:bg-white/10 focus:ring-1 focus:ring-[#a1f554]/30 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="DELUXE" className="bg-[#0f110d]">Deluxe</option>
                    <option value="SUPER_DELUXE" className="bg-[#0f110d]">Super Deluxe</option>
                    <option value="SUITE" className="bg-[#0f110d]">Suite</option>
                    <option value="DORMITORY" className="bg-[#0f110d]">Dormitory</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs text-slate-400">
                    Price per Night (₹)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={room.price}
                    className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Update Room
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