"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { approveSubscription } from "@/actions/approve-subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ApproveSubscriptionButton({ hotelId }: { hotelId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        if (!confirm("Are you sure you want to approve this subscription?")) return;

        setLoading(true);
        const res = await approveSubscription(hotelId);
        if (res.success) {
            toast.success("Subscription approved successfully!");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to approve");
        }
        setLoading(false);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            onClick={handleApprove}
            disabled={loading}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
            Approve
        </Button>
    );
}
