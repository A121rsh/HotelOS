"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  LogOut,
  Trash2,
  DollarSign,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { deleteBooking, updateBookingStatus } from "@/actions/booking";
import GenerateInvoiceModal from "@/components/GenerateInvoiceModal";
import AddPaymentModal from "@/components/AddPaymentModal";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  roomPrice: number;
  dueAmount: number;
}

export default function BookingActions({ bookingId, status, roomPrice, dueAmount }: BookingActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: "CHECKED_IN" | "CHECKED_OUT") => {
    setLoading(true);
    const result = await updateBookingStatus(bookingId, newStatus);
    setLoading(false);

    if (result.success) {
      toast.success(newStatus === "CHECKED_IN" ? "Guest checked in successfully" : "Guest checked out successfully");
    } else {
      toast.error(result.error || "Status update failed");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      setLoading(true);
      const result = await deleteBooking(bookingId);
      setLoading(false);

      if (result.success) {
        toast.success("Booking deleted successfully");
      } else {
        toast.error(result.error || "Delete failed");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2 bg-[#0f110d] rounded-xl shadow-2xl border border-white/10"
      >
        {/* Payment Actions */}
        <div className="px-2 py-1.5 mb-2">
          <p className="text-xs text-slate-500 font-medium">Payment</p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="mb-2">
          <AddPaymentModal bookingId={bookingId} dueAmount={dueAmount} />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <GenerateInvoiceModal bookingId={bookingId} roomPrice={roomPrice} />
        </div>

        <DropdownMenuSeparator className="bg-white/10 my-2" />

        {/* Status Actions */}
        <div className="px-2 py-1.5 mb-2">
          <p className="text-xs text-slate-500 font-medium">Status</p>
        </div>

        <DropdownMenuItem
          onClick={() => handleStatusUpdate("CHECKED_IN")}
          disabled={status === "CHECKED_IN"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-white hover:bg-[#8ba4b8]/10 focus:bg-[#8ba4b8]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="h-4 w-4 text-[#8ba4b8]" />
          <span className="text-sm font-medium">Check In</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleStatusUpdate("CHECKED_OUT")}
          disabled={status === "CHECKED_OUT"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-white hover:bg-blue-500/10 focus:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium">Check Out</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10 my-2" />

        {/* Delete Action */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm font-medium">Delete Booking</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}