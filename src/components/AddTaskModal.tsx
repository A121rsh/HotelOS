"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTask } from "@/actions/task";
import { Loader2, PlusCircle } from "lucide-react";

interface StaffMember {
  id: string;
  name: string | null;
}

export default function AddTaskModal({ staffList }: { staffList: StaffMember[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createTask(formData);
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
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <PlusCircle className="mr-2 h-4 w-4"/> Assign New Task
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task to Staff</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 py-4">
            
            <div className="space-y-2">
                <Label>Task Title</Label>
                <Input name="title" placeholder="e.g. Repair AC in Room 101" required />
            </div>

            <div className="space-y-2">
                <Label>Details (Optional)</Label>
                <Textarea name="description" placeholder="Any specific instructions..." />
            </div>

            <div className="space-y-2">
                <Label>Assign To</Label>
                {/* ✅ FIX: defaultValue add kiya aur option se 'selected' hataya */}
                <select 
                    name="assignedToId" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    defaultValue="" 
                >
                    <option value="" disabled>Select Staff Member</option>
                    {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Assign Task"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 