"use client";

import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    features: string[];
}

export function Pricing({ plans }: { plans: Plan[] }) {
    // Sort plans by price to ensure Free is first, then Basic, then Premium
    const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

    return (
        <section id="pricing" className="py-40 bg-white relative overflow-hidden">
            {/* Subtle Gradient Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-24 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-[5.5rem] font-black font-instrument text-slate-900 mb-6 tracking-tighter leading-[1.1]"
                    >
                        Choose the plan that's <br /> <span className="italic text-slate-400">Right for You.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg font-medium"
                    >
                        Scalable power for every property tier.
                        Transparent pricing with no hidden costs.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {sortedPlans.map((plan, index) => {
                        const isPrimary = plan.slug === "basic" || plan.slug === "pro";
                        const isPremium = plan.slug === "premium" || plan.slug === "professional";

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className={cn(
                                    "relative p-12 rounded-[3.5rem] flex flex-col transition-all duration-700 group",
                                    isPrimary
                                        ? "bg-slate-900 text-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] scale-105 z-20"
                                        : "bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]"
                                )}
                            >
                                {isPrimary && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center",
                                            isPrimary ? "bg-white/10 text-emerald-400" : "bg-slate-100 text-slate-900"
                                        )}>
                                            {isPrimary ? <Zap className="h-5 w-5 fill-current" /> : index === 0 ? <Building2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5 fill-current" />}
                                        </div>
                                        <h3 className="text-xl font-black font-instrument uppercase tracking-tighter italic">{plan.name}</h3>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-6xl font-black font-instrument tracking-tighter">₹{plan.price}</span>
                                        <span className={cn(
                                            "font-bold text-xs uppercase tracking-widest",
                                            isPrimary ? "text-slate-400" : "text-slate-500"
                                        )}>/mo</span>
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium leading-relaxed opacity-70",
                                        isPrimary ? "text-slate-300" : "text-slate-500"
                                    )}>
                                        {plan.description || "The essentials to get your property up and running smoothly."}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-16 flex-1">
                                    {plan.features.slice(0, 5).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-4 text-xs font-bold tracking-tight">
                                            <div className={cn(
                                                "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                                isPrimary ? "bg-emerald-400/20 text-emerald-400" : "bg-emerald-50 text-emerald-500"
                                            )}>
                                                <Check className="h-3 w-3 stroke-[3]" />
                                            </div>
                                            <span className={isPrimary ? "text-slate-300" : "text-slate-600"}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href={`/onboarding?planId=${plan.id}`}>
                                    <Button
                                        className={cn(
                                            "w-full h-14 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                                            isPrimary
                                                ? "bg-white text-slate-900 hover:bg-emerald-100"
                                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                                        )}
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Secure Trust Footer */}
                <div className="mt-24 text-center opacity-30">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                        End-to-End Encrypted . Institutional Grade . 99.9% Uptime
                    </p>
                </div>
            </div>
        </section>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
