"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Printer, Receipt, Percent, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have utility for class merging or remove cn usage

interface GenerateInvoiceModalProps {
  bookingId: string;
  roomPrice: number;
}

export default function GenerateInvoiceModal({ bookingId, roomPrice }: GenerateInvoiceModalProps) {
  const [gstRate, setGstRate] = useState("12");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleGenerate() {
    setOpen(false);
    // URL me GST rate pass kar rahe hain
    router.push(`/dashboard/invoices/${bookingId}?gst=${gstRate}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Ye button Dropdown ke andar natural lagega */}
        <div className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 text-slate-700 rounded flex items-center gap-2 cursor-pointer transition-colors">
            <Receipt className="h-4 w-4 text-blue-600"/> Generate Invoice
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden gap-0">
        <div className="bg-slate-900 p-6 text-white">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Printer className="h-6 w-6"/> Invoice Settings
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                    Choose applicable tax rate for Room Price (₹{roomPrice})
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-3">
                <label 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${gstRate === "0" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}
                    `}
                    onClick={() => setGstRate("0")}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            0%
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Tax Exempt / Non-GST</p>
                            <p className="text-xs text-slate-500">For tariffs below ₹1000</p>
                        </div>
                    </div>
                    {gstRate === "0" && <CheckCircle2 className="h-5 w-5 text-blue-600"/>}
                </label>

                <label 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${gstRate === "12" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}
                    `}
                    onClick={() => setGstRate("12")}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                            12%
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Standard GST</p>
                            <p className="text-xs text-slate-500">For tariffs ₹1001 - ₹7500</p>
                        </div>
                    </div>
                    {gstRate === "12" && <CheckCircle2 className="h-5 w-5 text-blue-600"/>}
                </label>

                <label 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${gstRate === "18" ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}
                    `}
                    onClick={() => setGstRate("18")}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            18%
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Luxury GST</p>
                            <p className="text-xs text-slate-500">For tariffs above ₹7500</p>
                        </div>
                    </div>
                    {gstRate === "18" && <CheckCircle2 className="h-5 w-5 text-blue-600"/>}
                </label>
            </div>

            <Button onClick={handleGenerate} className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg shadow-lg mt-2">
                Create & Print Bill
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}