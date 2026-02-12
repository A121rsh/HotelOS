import { OnboardingForm } from "./OnboardingForm";
import Link from "next/link";
import { Hotel } from "lucide-react";

export default function PublicOnboardingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Header / Logo */}
            <div className="mb-12">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                        <Hotel className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold font-outfit text-slate-900 tracking-tight italic">
                        Hotel<span className="text-blue-600">OS</span>
                    </span>
                </Link>
            </div>

            <OnboardingForm />

            <div className="mt-12 text-slate-400 text-sm font-medium">
                Step 1 of 3: Property Setup
            </div>
        </div>
    );
}
