"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Activity", href: "#features" },
        { name: "Manage", href: "#manage" },
        { name: "Program", href: "#pricing" },
        { name: "Documents", href: "#faqs" },
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-6 md:px-12",
                    scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* LOGO - Neon Green Theme */}
                    <Link href="/" className="flex items-center gap-2 group relative z-[110]">
                        <div className="bg-[#b5f347] h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-black">
                            <Sparkles className="h-4 w-4 md:h-5 md:w-5 fill-black" />
                        </div>
                        <span className="text-lg md:text-xl font-black font-outfit text-white tracking-tighter uppercase whitespace-nowrap">Hotel<span className="text-[#b5f347]">OS</span></span>
                    </Link>

                    {/* CENTERED NAV - Desktop Only */}
                    <nav className="hidden lg:flex items-center gap-8 bg-white/5 border border-white/10 px-8 py-2 rounded-full">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] font-medium text-slate-400 hover:text-[#b5f347] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA ACTIONS */}
                    <div className="flex items-center gap-2 md:gap-4 relative z-[110]">
                        <Link href="/login" className="hidden lg:block text-[13px] font-bold text-[#b5f347] hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button className="h-9 md:h-10 px-4 md:px-6 bg-[#b5f347] text-black rounded-full text-[12px] md:text-[13px] font-black hover:bg-[#a2db3f] transition-all shadow-lg shadow-[#b5f347]/20 whitespace-nowrap">
                                Sign up
                            </Button>
                        </Link>
                        <button
                            className="p-1 md:p-2 text-white lg:hidden flex items-center justify-center transition-colors hover:text-[#b5f347]"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* FULL SCREEN Mobile Nav Overlay - Moved outside header to prevent clipping */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="fixed inset-0 z-[150] bg-[#0a0a0a] flex flex-col justify-center items-center p-8 overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[#b5f347]/5 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                        <div className="flex flex-col gap-8 items-center text-center w-full max-w-sm relative z-10">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (i * 0.05) }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-3xl font-black text-white hover:text-[#b5f347] transition-all uppercase tracking-tighter"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="h-px w-full bg-white/10 my-4"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="w-full flex flex-col gap-4"
                            >
                                <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl text-[#b5f347] border-[#b5f347]/20 hover:bg-[#b5f347]/5 text-lg font-bold uppercase tracking-tight">Log In</Button>
                                </Link>
                                <Link href="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-14 rounded-2xl bg-[#b5f347] text-black font-black text-lg shadow-xl shadow-[#b5f347]/20 uppercase tracking-tight">Get Started</Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Large Background Branding in Menu */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.02] select-none text-[25vw] font-black tracking-tighter text-white whitespace-nowrap">
                            HOTELOS
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
