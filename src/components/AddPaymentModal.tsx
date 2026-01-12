"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { addPayment } from "@/actions/payment";
import { IndianRupee, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddPaymentModalProps {
  bookingId: string;
  dueAmount: number;
}

export default function AddPaymentModal({ bookingId, dueAmount }: AddPaymentModalProps) {
  const [amount, setAmount] = useState(dueAmount.toString()); // Auto-fill pending amount
  const [mode, setMode] = useState<"CASH" | "UPI" | "CARD">("CASH");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const res = await addPayment(bookingId, parseFloat(amount), mode);
    
    setLoading(false);
    if (res?.success) {
        setOpen(false);
        // Toast success message here
    } else {
        alert(res?.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Ye button Dropdown ke andar natural lagega */}
        <div className="w-full text-left px-2 py-2 text-sm hover:bg-slate-100 text-slate-700 rounded flex items-center gap-2 cursor-pointer transition-colors">
            <IndianRupee className="h-4 w-4 text-green-600"/> Add Payment
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
                Pending Balance: <span className="font-bold text-red-600">₹{dueAmount}</span>
            </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label>Amount Received</Label>
                <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="pl-9 font-bold text-lg" 
                        type="number" 
                        max={dueAmount} // Due se zayada nahi le sakte
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Payment Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                    <div 
                        onClick={() => setMode("CASH")}
                        className={`border rounded-lg p-2 text-center cursor-pointer text-sm font-medium ${mode === "CASH" ? "bg-green-50 border-green-500 text-green-700" : "hover:bg-slate-50"}`}
                    >
                        Cash
                    </div>
                    <div 
                        onClick={() => setMode("UPI")}
                        className={`border rounded-lg p-2 text-center cursor-pointer text-sm font-medium ${mode === "UPI" ? "bg-blue-50 border-blue-500 text-blue-700" : "hover:bg-slate-50"}`}
                    >
                        UPI
                    </div>
                    <div 
                        onClick={() => setMode("CARD")}
                        className={`border rounded-lg p-2 text-center cursor-pointer text-sm font-medium ${mode === "CARD" ? "bg-purple-50 border-purple-500 text-purple-700" : "hover:bg-slate-50"}`}
                    >
                        Card
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 mt-2" disabled={loading || parseFloat(amount) <= 0}>
                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : "Confirm Payment"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}