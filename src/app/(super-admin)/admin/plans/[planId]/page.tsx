import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditPlanForm } from "./EditPlanForm";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EditPlanPage({ params }: { params: Promise<{ planId: string }> }) {
    const { planId } = await params;

    const plan = await db.subscriptionPlan.findUnique({
        where: { id: planId }
    });

    if (!plan) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20 px-4 md:px-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex items-center gap-4">
                    <Link href="/admin/plans">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Package className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Edit Plan</h1>
                            <p className="text-slate-400 text-sm mt-1">Editing: <span className="text-[#a1f554] font-semibold">{plan.name}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <EditPlanForm plan={plan} />
        </div>
    );
}