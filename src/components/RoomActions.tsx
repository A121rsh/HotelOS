"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    MoreVertical,
    Trash2,
    Loader2,
    Edit
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRoom } from "@/actions/room";
import EditRoomModal from "@/components/EditRoomModal";
import { toast } from "sonner";

interface RoomActionsProps {
    room: {
        id: string;
        number: string;
        type: string;
        price: number;
        capacity?: number;
        image?: string | null;
    }
}

export default function RoomActions({ room }: RoomActionsProps) {
    const [loading, setLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete Room ${room.number}? This action cannot be undone.`)) {
            setLoading(true);
            const res = await deleteRoom(room.id);
            setLoading(false);
            if (res.success) {
                toast.success("Room deleted successfully");
            } else {
                toast.error(res.error || "Error deleting room");
            }
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-9 w-9 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-all"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreVertical className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    align="end" 
                    className="w-48 bg-[#0f110d] border border-white/10 p-2 rounded-xl shadow-2xl"
                >
                    {/* Edit Button */}
                    <DropdownMenuItem
                        onClick={() => setIsEditOpen(true)}
                        className="text-white hover:bg-white/10 cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-all"
                    >
                        <Edit className="h-4 w-4 text-[#a1f554]" />
                        <span className="text-sm font-medium">Edit Room</span>
                    </DropdownMenuItem>

                    <div className="h-px bg-white/10 my-2" />

                    {/* Delete Button */}
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-white hover:bg-red-500/10 cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-all group"
                    >
                        <Trash2 className="h-4 w-4 text-red-500/70 group-hover:text-red-500" />
                        <span className="text-sm font-medium text-red-500/70 group-hover:text-red-500">Delete Room</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Modal */}
            <EditRoomModal 
                room={room} 
                isOpen={isEditOpen} 
                onOpenChange={setIsEditOpen}
            />
        </>
    );
}