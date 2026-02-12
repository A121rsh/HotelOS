"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hotel, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Benefits", href: "#features" },
        { name: "Process", href: "#process" },
        { name: "Compare", href: "#pricing" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQs", href: "#faqs" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 pointer-events-none">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full transition-all duration-500 pointer-events-auto",
                    scrolled
                        ? "bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                        : "bg-white/40 backdrop-blur-md border border-white/20"
                )}
            >
                {/* 1. SYMMETRIC LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-slate-900 p-2 rounded-xl text-white">
                        <Hotel className="h-4 w-4" />
                    </div>
                    <span className="text-xl font-black font-instrument text-slate-900 tracking-tighter uppercase italic">Hotel<span className="text-emerald-500">OS</span></span>
                </Link>

                {/* 2. MINIMALIST NAV */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* 3. EXECUTIVE ACTION */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block">
                        <Button variant="ghost" className="text-xs font-bold text-slate-700 hover:text-slate-900">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button className="h-10 px-6 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                            View Plans
                        </Button>
                    </Link>
                    <button
                        className="md:hidden p-2 text-slate-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden absolute top-24 left-4 right-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-8 pointer-events-auto"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-2xl font-black font-instrument text-slate-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/login" className="w-full mt-4">
                                <Button className="w-full h-14 rounded-full bg-slate-900 text-white">Join the Community</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
