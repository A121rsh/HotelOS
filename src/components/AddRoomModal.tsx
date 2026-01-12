"use client";

import { useState } from "react";
import { createRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  X, 
  Loader2, 
  BedDouble, 
  IndianRupee, 
  Hash, 
  Tag 
} from "lucide-react";

export default function AddRoomModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const res = await createRoom(formData);
    setIsLoading(false);
    
    if (res?.success) {
        setIsOpen(false);
        // Toast notification ka code yahan aa sakta hai future mein
    } else {
        alert(res?.error || "Error creating room");
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all">
        <Plus className="h-4 w-4 mr-2" /> Add New Room
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BedDouble className="h-5 w-5 text-blue-600" /> 
                        Add New Room
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Fill in the details to add to inventory.</p>
                </div>
                <button 
                    type="button" // Important: Taaki ye form submit na kare
                    onClick={() => setIsOpen(false)} 
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-slate-400"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="p-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                    {/* Room Number */}
                    <div className="space-y-2">
                        <Label className="text-slate-600 font-medium">Room Number</Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                                name="number" 
                                placeholder="101" 
                                className="pl-10 h-10 border-slate-200 focus-visible:ring-blue-500" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label className="text-slate-600 font-medium">Price (Per Night)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                                name="price" 
                                type="number" 
                                placeholder="2500" 
                                className="pl-10 h-10 border-slate-200 focus-visible:ring-blue-500" 
                                required 
                            />
                        </div>
                    </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                    <Label className="text-slate-600 font-medium">Room Category</Label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <select 
                            name="type" 
                            defaultValue=""
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 pl-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            required
                        >
                            <option value="" disabled>Select Room Type</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Super Deluxe">Super Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Dormitory">Dormitory</option>
                        </select>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-slate-50 mt-4">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full text-slate-600 hover:bg-slate-100" 
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-md text-white" 
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Plus className="h-4 w-4 mr-2" />}
                        Save Room
                    </Button>
                </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}