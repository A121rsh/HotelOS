"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBooking, updateBookingStatus } from "@/actions/booking";
import GenerateInvoiceModal from "@/components/GenerateInvoiceModal";
import AddPaymentModal from "@/components/AddPaymentModal"; // ✅ Import kiya

interface BookingActionsProps {
  bookingId: string;
  status: string;
  roomPrice: number;
  dueAmount: number; // ✅ New Prop: Due amount aana zaroori hai
}

export default function BookingActions({ bookingId, status, roomPrice, dueAmount }: BookingActionsProps) {
  const [loading, setLoading] = useState(false);

  // Status update handler
  const handleStatusUpdate = async (newStatus: "CHECKED_IN" | "CHECKED_OUT") => {
    setLoading(true);
    await updateBookingStatus(bookingId, newStatus);
    setLoading(false);
  };

  // Delete handler
  const handleDelete = async () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
        setLoading(true);
        await deleteBooking(bookingId);
        setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 p-2 bg-white rounded-xl shadow-xl border border-slate-100">
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manage Booking
        </div>

        {/* ✅ ADD PAYMENT OPTION (Sirf tab dikhega jab Due Amount > 0 ho) */}
        {dueAmount > 0 && (
            // stopPropagation zaroori hai taaki modal click karne par dropdown band na ho jaye
            <div onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                <AddPaymentModal bookingId={bookingId} dueAmount={dueAmount} />
            </div>
        )}

        {/* Generate Invoice Option */}
        <div onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
             <GenerateInvoiceModal bookingId={bookingId} roomPrice={roomPrice} />
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Status Actions */}
        <DropdownMenuItem 
            onClick={() => handleStatusUpdate("CHECKED_IN")}
            disabled={status === "CHECKED_IN" || status === "CANCELLED"}
            className="cursor-pointer"
        >
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Mark Check-In
        </DropdownMenuItem>

        <DropdownMenuItem 
            onClick={() => handleStatusUpdate("CHECKED_OUT")}
            disabled={status === "CHECKED_OUT" || status === "CANCELLED"}
            className="cursor-pointer"
        >
            <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span> Mark Check-Out
        </DropdownMenuItem>

        <div className="h-px bg-slate-100 my-2" />

        {/* Cancel Action */}
        <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
            Cancel Booking
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}