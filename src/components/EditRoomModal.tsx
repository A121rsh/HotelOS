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
  Tag 
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Props define kiye taaki purana data aa sake
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
        {/* Ye button Dropdown menu me dikhega */}
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 w-full cursor-pointer">
            <Pencil className="mr-2 h-4 w-4"/> Edit Details
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Room {room.number}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4 py-4">
            <input type="hidden" name="roomId" value={room.id} />
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Room Number</Label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="number" defaultValue={room.number} className="pl-9" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="price" type="number" defaultValue={room.price} className="pl-9" required />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Room Category</Label>
                <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select 
                        name="type" 
                        defaultValue={room.type}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                    >
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Super Deluxe">Super Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Dormitory">Dormitory</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : "Update Room"}
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}