"use client";

import Link from "next/link";
import { Hotel, Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white pt-32 pb-16 border-t border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                    {/* Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-slate-900 p-2 rounded-xl text-white">
                                <Hotel className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-black font-outfit tracking-tighter uppercase italic text-slate-900">Hotel<span className="text-emerald-500">OS</span></span>
                        </Link>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                            Designing the next generation of hospitality experiences. Smart. Simple. Sovereign.
                        </p>
                        <div className="flex items-center gap-3">
                            <SocialLink icon={Github} />
                            <SocialLink icon={Twitter} />
                            <SocialLink icon={Linkedin} />
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Platform</h4>
                        <ul className="space-y-4 text-slate-500 font-bold text-sm">
                            <li><FooterLink href="#features">Benefits</FooterLink></li>
                            <li><FooterLink href="#pricing">Pricing</FooterLink></li>
                            <li><FooterLink href="/booking-engine">OS Engine</FooterLink></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Resources</h4>
                        <ul className="space-y-4 text-slate-500 font-bold text-sm">
                            <li><FooterLink href="/docs">Docs</FooterLink></li>
                            <li><FooterLink href="/guides">Community</FooterLink></li>
                            <li><FooterLink href="/privacy">Privacy</FooterLink></li>
                        </ul>
                    </div>

                    {/* Office */}
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Headquarters</h4>
                        <ul className="space-y-4 text-slate-500 font-bold text-sm">
                            <li>Level 42, Sovereign Tower</li>
                            <li>123 Tech Square, Bangalore</li>
                            <li className="text-slate-900 underline underline-offset-4">hello@locohotel.os</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <p>© 2026 HotelOS Systems. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
                        <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon }: { icon: any }) {
    return (
        <a href="#" className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500">
            <Icon className="h-4 w-4" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-slate-900 transition-all duration-300">
            {children}
        </Link>
    );
}
