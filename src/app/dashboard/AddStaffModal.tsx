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
import { Loader2, UserPlus } from "lucide-react";

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
        // Page apne aap refresh ho jayega due to server action
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4"/> Add New Employee
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 py-4">
            
            <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" placeholder="e.g. Raju Sharma" required />
            </div>

            <div className="space-y-2">
                <Label>Email Address (For Login)</Label>
                <Input name="email" type="email" placeholder="staff@hotel.com" required />
            </div>

            <div className="space-y-2">
                <Label>Set Password</Label>
                <Input name="password" type="password" placeholder="******" required />
            </div>

            <div className="space-y-2">
                <Label>Role / Designation</Label>
                <select 
                    name="role" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                >
                    <option value="FRONT_DESK">Receptionist (Front Desk)</option>
                    <option value="HOUSEKEEPING">Housekeeping Staff</option>
                </select>
            </div>

            <Button type="submit" className="w-full bg-slate-900" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Create Account"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}