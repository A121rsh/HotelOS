"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markRoomClean, markRoomDirty, markRoomMaintenance } from "@/actions/housekeeping";
import { Sparkles, Trash2, Wrench, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HousekeepingCardProps {
  room: {
    id: string;
    number: string;
    type: string;
    status: string;
  };
}

export default function HousekeepingCard({ room }: HousekeepingCardProps) {
  const [loading, setLoading] = useState(false);

  // Helper to handle actions
  const handleAction = async (action: Function, id: string) => {
    setLoading(true);
    await action(id);
    setLoading(false);
  };

  const isDirty = room.status === "DIRTY";
  const isClean = room.status === "AVAILABLE";
  const isMaintenance = room.status === "MAINTENANCE";

  return (
    <div className={`
        relative border-2 rounded-xl p-5 shadow-sm transition-all
        ${isDirty ? "border-orange-200 bg-orange-50/50" : 
          isClean ? "border-green-200 bg-green-50/50" : 
          "border-slate-200 bg-slate-50"}
    `}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-2xl font-bold text-slate-900">{room.number}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{room.type}</p>
            </div>
            <Badge className={`
                ${isDirty ? "bg-orange-500 hover:bg-orange-600" : 
                  isClean ? "bg-green-600 hover:bg-green-700" : 
                  "bg-slate-500"}
            `}>
                {room.status === 'AVAILABLE' ? 'CLEAN' : room.status}
            </Badge>
        </div>

        {/* Status Indicator Icon */}
        <div className="flex items-center gap-2 mb-6">
            {isDirty && (
                <div className="flex items-center gap-2 text-orange-700 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" /> Needs Cleaning
                </div>
            )}
            {isClean && (
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Ready for Guests
                </div>
            )}
            {isMaintenance && (
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Wrench className="h-4 w-4" /> Under Repair
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
            
            {/* AGAR GANDA HAI -> TO CLEAN KARO */}
            {isDirty && (
                <Button 
                    onClick={() => handleAction(markRoomClean, room.id)} 
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Mark as Clean
                </Button>
            )}

            {/* AGAR SAAF HAI -> TO MAINTENANCE YA DIRTY MARK KARO */}
            {isClean && (
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => handleAction(markRoomDirty, room.id)} 
                        disabled={loading}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                        <Trash2 className="h-3 w-3 mr-2" /> Dirty
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => handleAction(markRoomMaintenance, room.id)} 
                        disabled={loading}
                        className="text-slate-600 border-slate-200 hover:bg-slate-50"
                    >
                        <Wrench className="h-3 w-3 mr-2" /> Repair
                    </Button>
                </div>
            )}

             {/* AGAR MAINTENANCE HAI -> TO CLEAN KARO */}
             {isMaintenance && (
                <Button 
                    onClick={() => handleAction(markRoomClean, room.id)} 
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Repair Finished
                </Button>
            )}

        </div>
    </div>
  );
}