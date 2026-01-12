"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Trash2,
  Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRoom } from "@/actions/room";
import EditRoomModal from "@/components/EditRoomModal";

interface RoomActionsProps {
    room: {
        id: string;
        number: string;
        type: string;
        price: number;
        // status ki zaroorat nahi hai edit/delete ke liye
    }
}

export default function RoomActions({ room }: RoomActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete Room ${room.number}?`)) {
            setLoading(true);
            await deleteRoom(room.id);
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border border-slate-100 rounded-xl">
                
                {/* ✅ Edit Button (Modal click propagation rokne ke liye wrapper) */}
                <div onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                    <EditRoomModal room={room} />
                </div>
                
                <div className="h-px bg-slate-100 my-1"/>
                
                {/* ✅ Delete Button */}
                <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2 p-2"
                >
                    <Trash2 className="h-4 w-4" /> Delete Room
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}