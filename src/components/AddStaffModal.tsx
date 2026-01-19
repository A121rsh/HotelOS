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
} from "@/components/ui/dialog";
import { createStaff } from "@/actions/staff";
import { Loader2, UserPlus, ShieldCheck } from "lucide-react";

export default function AddStaffModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createStaff(formData);
    setLoading(false);

    if (res?.error) {
        alert(res.error);
    } else {
        setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4"/> Add New Manager
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Hotel Manager</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 py-4">
            
            <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" placeholder="e.g. Raju Sharma" required />
            </div>

            <div className="space-y-2">
                <Label>Email Address (For Login)</Label>
                <Input name="email" type="email" placeholder="manager@hotel.com" required />
            </div>

            <div className="space-y-2">
                <Label>Set Password</Label>
                <Input name="password" type="password" placeholder="******" required />
            </div>

            {/* ✅ ROLE SELECTION REMOVED: Auto-set to Manager */}
            <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2 p-2 bg-slate-100 rounded border border-slate-200 text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Manager (Full Access)</span>
                    {/* Hidden input taaki server ko pata chale ye Manager hai */}
                    <input type="hidden" name="role" value="MANAGER" />
                </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Create Manager Account"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}