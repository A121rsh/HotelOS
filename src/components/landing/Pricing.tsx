"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    isPopular?: boolean;
}

const testimonials = [
    {
        quote: "I appreciate the security features of the app, especially the two-factor authentication. It gives me peace of mind knowing my accounts are safe.",
        author: "David Johnson",
        role: "Software Engineer",
        rating: 5
    },
    {
        quote: "HotelOS has completely transformed how we manage our boutique hotels. The real-time sync is a game-changer for our revenue optimization.",
        author: "Sarah Jenkins",
        role: "Property Manager",
        rating: 5
    },
    {
        quote: "The interface is so clean and intuitive. My staff learned to use it in less than an hour, and our booking errors have dropped to zero.",
        author: "Marcus Thorne",
        role: "Hotel Owner",
        rating: 5
    }
];

export function Pricing({ plans: dbPlans }: { plans: any[] }) {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const nextTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    };

    const plans = dbPlans && dbPlans.length > 0 ? dbPlans : [
        {
            id: "1",
            name: "Trial Node",
            price: 0,
            description: "7-day executive trial for basic operational evaluation.",
            features: ["7 Days Access", "Up to 5 Rooms", "Basic Analytics", "Standard Support"],
        },
        {
            id: "2",
            name: "Business Node",
            price: 999,
            description: "The standard protocol for established property headquarters.",
            features: ["Monthly Access", "Up to 20 Rooms", "Advanced FinOps", "Priority Sync", "Email Support"],
            isPopular: true,
        },
        {
            id: "3",
            name: "Enterprise Core",
            price: 4999,
            description: "Custom global solutions for hotel chains and franchises.",
            features: ["Unlimited Bookings", "Channel Manager", "Alpha Feature Access", "24/7 VIP Support", "Dedicated Account Node"],
        }
    ];

    return (
        <section id="pricing" className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
            <div className="container mx-auto px-6">

                {/* HEADING SECTION */}
                <div className="text-center mb-20 md:mb-24 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] inline-block mb-8"
                    >
                        Pricing Model
                    </motion.div>
                    <h2 className="text-4xl md:text-7xl font-black text-white leading-[1] uppercase tracking-tighter mb-10 italic-none">
                        Scale Your <br />
                        <span className="text-[#b5f347]">Property Network</span>
                    </h2>

                    {/* BILLING TOGGLE */}
                    <div className="bg-[#151515] p-2 rounded-full inline-flex items-center gap-1 border border-white/5 mx-auto">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-6 md:px-10 py-2.5 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all",
                                billingCycle === "monthly" ? "bg-[#b5f347] text-black" : "text-slate-400 hover:text-white"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "px-6 md:px-10 py-2.5 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all",
                                billingCycle === "yearly" ? "bg-[#b5f347] text-black" : "text-slate-400 hover:text-white"
                            )}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                {/* PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-40">
                    {plans.map((plan: any, i: number) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative flex flex-col p-8 md:p-12 bg-[#151515] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-500 hover:border-[#b5f347]/30 group",
                                (plan.isPopular || plan.slug === 'business') && "ring-2 ring-[#b5f347]/30 bg-[#1a1a1a]"
                            )}
                        >
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{plan.name}</h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 h-auto lg:min-h-[4rem]">
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                        ₹{billingCycle === "yearly" ? Math.floor(plan.price * 10) : plan.price}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                        {billingCycle === "yearly" ? "/ Year" : "/ Month"}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 mb-8" />

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature: string, j: number) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="h-5 w-5 bg-[#b5f347]/10 border border-[#b5f347]/20 rounded-lg flex items-center justify-center">
                                            <Check className="h-3 w-3 text-[#b5f347]" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`/register?planId=${plan.id}`}>
                                <Button className={cn(
                                    "w-full h-16 md:h-20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black",
                                    (plan.isPopular || plan.slug === 'business')
                                        ? "bg-[#b5f347] text-black hover:bg-[#a2db3f]"
                                        : "bg-transparent text-white border border-white/20 hover:bg-white/5"
                                )}>
                                    Select Node
                                </Button>
                            </Link>

                        </motion.div>
                    ))}
                </div>

                {/* TESTIMONIAL CYCLER - Refined for Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6 md:space-y-8 text-center sm:text-left">
                        <p className="text-[10px] font-black text-[#b5f347] uppercase tracking-[0.4em]">Client Testimonials</p>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter">
                            System <br className="hidden md:block" />
                            <span className="text-[#b5f347]">Validation</span>
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-lg mx-auto sm:mx-0 text-base md:text-lg">
                            Hear from elite developers and property managers who have migrated their legacy portfolios to the HotelOS kernel.
                        </p>
                    </div>
                    <div className="hidden xl:block xl:col-span-1" />
                    <div className="lg:col-span-12 xl:col-span-6 relative">
                        <div className="bg-[#151515] p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 relative min-h-[350px] md:min-h-[380px] flex flex-col justify-center shadow-2xl overflow-hidden group">
                            {/* Background Decor */}
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="h-24 w-24 text-white" />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonialIndex}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="relative z-10"
                                >
                                    <p className="text-xl md:text-3xl font-bold text-white leading-relaxed mb-10 italic">
                                        &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-center sm:text-left">
                                            <p className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">{testimonials[testimonialIndex].author}</p>
                                            <p className="text-[#b5f347] font-bold text-xs uppercase tracking-widest">{testimonials[testimonialIndex].role}</p>
                                        </div>
                                        <div className="flex gap-1 text-[#b5f347]/50">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#b5f347]" />)}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <button
                                onClick={nextTestimonial}
                                className="absolute right-4 md:-right-4 bottom-4 sm:top-1/2 sm:-translate-y-1/2 h-16 w-16 md:h-20 md:w-20 bg-[#b5f347] rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(181,243,71,0.2)] hover:scale-110 active:scale-95 transition-all z-20 group border-4 border-[#0a0a0a] sm:border-8 md:border-[12px]"
                                aria-label="Next Testimonial"
                            >
                                <ArrowRight className="h-8 w-8 md:h-10 md:w-10 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex gap-2 mt-8 justify-center xl:justify-start">
                            {testimonials.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        i === testimonialIndex ? "w-10 bg-[#b5f347]" : "w-2 bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
