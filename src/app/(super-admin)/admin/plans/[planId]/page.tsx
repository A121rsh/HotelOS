
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditPlanForm } from "./EditPlanForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPlanPage({ params }: { params: Promise<{ planId: string }> }) {
    const { planId } = await params;

    const plan = await db.subscriptionPlan.findUnique({
        where: { id: planId }
    });

    if (!plan) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/admin/plans" className="flex items-center text-slate-500 hover:text-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
            </Link>

            <EditPlanForm plan={plan} />
        </div>
    );
}
