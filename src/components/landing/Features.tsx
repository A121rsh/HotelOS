"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Globe,
    Bed,
    Users,
    Sparkles,
    CreditCard,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Sovereign Dashboard",
        description: "Real-time master-view of property nodes, occupancy heatmaps, and executive revenue intelligence.",
        icon: LayoutDashboard,
        color: "blue",
        badge: "Core Node"
    },
    {
        title: "Distribution Hub",
        description: "Zero-latency synchronization with global OTAs. Manage ARI from a central high-authority bridge.",
        icon: Globe,
        color: "cyan",
        badge: "Live Sync"
    },
    {
        title: "Inventory Control",
        description: "Coordinate room tiers, dynamic pricing rules, and environmental maintenance logs.",
        icon: Bed,
        color: "purple",
        badge: "Scale 2.0"
    },
    {
        title: "Guest CRM Registry",
        description: "Archival-grade visitor database with automated loyalty identification and behavioral tagging.",
        icon: Users,
        color: "emerald",
        badge: "Encrypted"
    },
    {
        title: "Environmental Ops",
        description: "Precision-timed housekeeping cycles and staff task delegation with real-time status pulses.",
        icon: Sparkles,
        color: "orange",
        badge: "Operational"
    },
    {
        title: "Fiscal Architecture",
        description: "Institutional-grade billing system with GST-compliant invoicing and multi-channel ledger.",
        icon: CreditCard,
        color: "indigo",
        badge: "Financial"
    }
];

const colorMap: any = {
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20",
    purple: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    orange: "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20",
    indigo: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
};

export function Features() {
    const steps = [
        {
            title: "Connect Your Property",
            step: "STEP 1",
            desc: "Sync your inventory and rates in minutes. Integrated with 400+ channels globally.",
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Automate Hospitality",
            step: "STEP 2",
            desc: "Enable AI-driven check-ins and smart housekeeping cycles. No manual coordination needed.",
            color: "bg-emerald-500",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Scale Revenue",
            step: "STEP 3",
            desc: "Watch your occupancy grow with dynamic pricing. Real-time intelligence at your fingertips.",
            color: "bg-amber-500",
            lightColor: "bg-amber-50",
            textColor: "text-amber-600"
        }
    ];

    return (
        <section id="features" className="py-40 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">

                {/* Section Header */}
                <div className="mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-instrument text-slate-900 tracking-tighter"
                    >
                        Ready to revolutionize <br /> your <span className="text-emerald-500">guest experience?</span>
                    </motion.h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            <div className="bg-slate-50 p-12 rounded-[3.5rem] aspect-[4/5] flex flex-col items-center justify-between border border-slate-100 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 group">
                                <span className={`text-[10px] font-black tracking-widest uppercase ${item.textColor}`}>
                                    {item.step}
                                </span>

                                <div className="text-center">
                                    <h3 className="text-2xl font-black font-instrument text-slate-900 mb-4 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className={`h-20 w-20 rounded-[2rem] ${item.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <div className={`h-8 w-8 rounded-full ${item.color} opacity-40`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Setup Quote Block */}
                <div className="mt-48 max-w-2xl mx-auto text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-200 mx-auto mb-8 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" alt="Founder" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2 tracking-tight uppercase">Quick and Easy Setup</h4>
                    <p className="text-slate-500 font-medium italic">
                        "We've scaled to thousands of rooms daily - HotelOS's dashboard
                        is the only thing that keeps us sane and growing."
                    </p>
                    <div className="mt-8 flex justify-center gap-12 opacity-30 grayscale saturate-0 items-center">
                        <span className="font-bold tracking-tighter text-xl">TRUSTED</span>
                        <span className="font-bold tracking-tighter text-xl">SECURE</span>
                        <span className="font-bold tracking-tighter text-xl">ELITE</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
