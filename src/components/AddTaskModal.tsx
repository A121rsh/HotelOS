"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTask } from "@/actions/task";
import {
  Loader2,
  PlusCircle,
  User,
  FileText,
  CheckCircle2,
  ChevronDown,
  Target,
  X
} from "lucide-react";

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
        <Button className="h-14 px-6 bg-[#B0FF4D] hover:bg-[#a2eb46] text-black rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-[#B0FF4D]/20 group hover:-translate-y-0.5">
          <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 z-50 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">Create New Task</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new task by providing a title, description, and assigning it to a team member.
          </DialogDescription>

          {/* Header */}
          <div className="bg-gradient-to-br from-black to-[#0c0c0c] p-8 relative overflow-hidden border-b border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B0FF4D] rounded-full blur-[120px] opacity-10" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-14 w-14 bg-[#B0FF4D]/10 rounded-2xl flex items-center justify-center text-[#B0FF4D] border border-[#B0FF4D]/20">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                <p className="text-xs text-slate-400 mt-1">Fill in the details below</p>
              </div>
            </div>
          </div>

          <form action={handleSubmit} className="p-8 space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B0FF4D]" />
                Task Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title..."
                className="h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#B0FF4D]/50 focus:ring-1 focus:ring-[#B0FF4D]/30 transition-all text-white placeholder:text-slate-500"
                required
              />
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B0FF4D]" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add task details and requirements..."
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 focus:bg-white/10 focus:border-[#B0FF4D]/50 focus:ring-1 focus:ring-[#B0FF4D]/30 transition-all text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <Label htmlFor="assignedToId" className="text-sm font-semibold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Assign To
              </Label>
              <div className="relative">
                <select
                  id="assignedToId"
                  name="assignedToId"
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                  required
                  defaultValue=""
                >
                  <option value="" disabled className="bg-[#0c0c0c] text-slate-400">
                    Select team member...
                  </option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id} className="bg-[#0c0c0c] text-white py-2">
                      {staff.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white transition-all"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#B0FF4D] hover:bg-[#a2eb46] text-black rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Create Task
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}