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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTask } from "@/actions/task";
import {
  Loader2,
  PlusCircle,
  ListTodo,
  User,
  FileText,
  CheckCircle2,
  Sparkles,
  Calendar,
  ChevronDown,
  Building2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        <Button className="h-12 px-6 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group">
          <PlusCircle className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform" />
          Initialize Workflow Node
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl font-inter focus:outline-none overflow-hidden text-slate-900">
        <div className="max-h-[92vh] overflow-y-auto">
          {/* Radix Accessibility Requirements */}
          <DialogTitle className="sr-only">Initialize New Workflow Task</DialogTitle>
          <DialogDescription className="sr-only">Add a new operational task to the queue by providing a title, description, and assigning personnel.</DialogDescription>

          {/* 1. OPERATIONAL QUEUE HEADER */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-5">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                <ListTodo className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tight leading-none">Operational Queue</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-amber-500" /> Real-time Workflow Dispatch v4.2
                </p>
              </div>
            </div>
            <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5 pointer-events-none" />
          </div>

          <form action={handleSubmit} className="p-10 space-y-8">

            {/* 2. TASK SPECIFICATIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Task Specifications</Label>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    name="title"
                    placeholder="Primary Objective (e.g. System Audit Room 302)"
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>

                <div className="relative group">
                  <Textarea
                    name="description"
                    placeholder="Operational Nuance & Instructions (Optional)"
                    className="min-h-[120px] p-6 rounded-[2rem] border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. PERSONNEL ALLOCATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel Allocation</Label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <User className="h-full w-full" />
                </div>
                <select
                  name="assignedToId"
                  className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 pl-12 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Locate Operational Personnel</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} — Personnel Node
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-blue-600 transition-colors">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* 4. DISPATCH COMMAND */}
            <Button
              type="submit"
              className="w-full h-14 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-3" /> Dispatching Workflow...</>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Authorize Workflow Dispatch
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}