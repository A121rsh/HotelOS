"use client";

import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "How do I initiate a property node?",
        answer: "Registering for HotelOS is a streamlined process. Simply click 'Book a Demo' to schedule an architectural walkthrough, after which our team will materialize your first property node within hours."
    },
    {
        question: "What is the node sync latency?",
        answer: "Our proprietary synchronization engine operates at sub-second speeds. While legacy systems take minutes to update OTAs, HotelOS nodes synchronize across 100+ global channels in real-time."
    },
    {
        question: "Is data transmission encrypted?",
        answer: "Enterprise security is our core protocol. We use multi-layered encryption (AES-256) and decentralized node architecture to ensure zero data latency or exposure."
    },
    {
        question: "Can I map custom property types?",
        answer: "Yes. From luxury boutique villas to massive enterprise resort portfolios, our system is built to map and synchronize any property node configuration imaginable."
    },
    {
        question: "Which global channels are supported?",
        answer: "We support mapping and synchronization across 100+ global channels including Booking.com, Airbnb, Expedia, and local high-volume OTAs via our unified command center."
    },
    {
        question: "Is there 24/7 technical support?",
        answer: "Every active node is monitored by our Global Operations Center. Depending on your plan, you have access to priority technical nodes and dedicated account orchestrators."
    }
];

export function FAQ() {
    return (
        <section id="faqs" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#b5f347] inline-block mb-8"
                    >
                        Protocol Support
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-12">
                        Commonly <br />
                        <span className="text-[#b5f347]">Sync Inquiries</span>
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} {...faq} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group border rounded-[2.5rem] p-8 transition-all duration-500 cursor-pointer overflow-hidden",
                isOpen
                    ? "bg-[#151515] border-[#b5f347]/30 shadow-2xl"
                    : "bg-[#151515]/50 border-white/5 hover:border-[#b5f347]/20 hover:bg-[#151515]/80"
            )}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center justify-between gap-6 mb-2">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors duration-500",
                        isOpen ? "bg-[#b5f347] text-black" : "bg-white/5 text-slate-400"
                    )}>
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black font-outfit text-white tracking-tight leading-none uppercase">{question}</h3>
                </div>
                <div className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full border border-white/10 flex items-center justify-center transition-all",
                    isOpen ? "bg-[#b5f347] text-black rotate-180" : "bg-white/5 text-slate-500"
                )}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
            </div>

            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? 24 : 0
                }}
                className="overflow-hidden"
            >
                <div className="pt-4 border-t border-white/5 italic">
                    <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-wider">
                        {answer}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
