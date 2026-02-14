import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    FileText,
    Building2,
    ShieldCheck,
    Globe,
    Calendar,
    User,
    Crown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface InvoicePageProps {
    params: Promise<{ bookingId: string }>;
    searchParams: Promise<{ gst?: string }>;
}

export default async function InvoicePage(props: InvoicePageProps) {
    const session = await auth();
    if (!session) return redirect("/login");

    const params = await props.params;
    const searchParams = await props.searchParams;

    const bookingId = params.bookingId;
    const gstRate = parseInt(searchParams.gst || "0");

    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            room: true,
            hotel: true
        }
    });

    if (!booking) return notFound();

    // Calculations
    const roomTotal = booking.totalAmount;
    const gstAmount = (roomTotal * gstRate) / 100;
    const grandTotal = roomTotal + gstAmount;

    const advancePaid = booking.paidAmount;
    const balanceDue = grandTotal - advancePaid;

    // Dates formatting
    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const days = Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-12 flex flex-col items-center print:bg-white print:p-0 font-inter selection:bg-[#a1f554] selection:text-black">

            {/* Background Effects (Hidden in Print) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#a1f554]/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#a1f554]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Top Controls (Hidden in Print) */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-10 print:hidden relative z-10">
                <Link href="/dashboard/bookings">
                    <Button variant="ghost" className="h-11 px-6 rounded-2xl text-white/50 hover:text-[#a1f554] hover:bg-[#a1f554]/10 border border-white/5 hover:border-[#a1f554]/20 font-bold uppercase tracking-widest text-[10px] gap-2 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Nexus
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">Status</span>
                        <span className="text-xs font-black text-[#a1f554] uppercase tracking-tight mt-1 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Digital Original
                        </span>
                    </div>
                    <PrintButton />
                </div>
            </div>

            {/* --- EXECUTIVE INVOICE DOCUMENT --- */}
            <div className="bg-[#0f110d] w-full max-w-4xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl shadow-black print:shadow-none print:w-full print:max-w-none print:p-12 border border-white/5 print:border-none relative overflow-hidden print:bg-white print:text-black">

                {/* Background Emblem (Print Subtle) */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none print:opacity-[0.02]">
                    <Crown className="h-64 w-64 text-[#a1f554] print:text-black" />
                </div>

                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.01)_1px,transparent_0)] bg-[size:40px_40px] print:hidden" />

                {/* HEADER SECTION */}
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start border-b border-white/10 print:border-black/10 pb-10 mb-10 gap-8">
                    <div className="flex items-start gap-8">
                        {/* 🏰 HOTEL LOGO / BRANDING */}
                        <div className="flex-shrink-0">
                            {booking.hotel.logo ? (
                                <div className="h-24 w-24 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 print:border-black/5">
                                    <Image
                                        src={booking.hotel.logo}
                                        alt={booking.hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-24 w-24 bg-[#a1f554] rounded-2xl flex items-center justify-center text-black shadow-xl shadow-[#a1f554]/20">
                                    <Building2 className="h-12 w-12" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-white print:text-black uppercase tracking-tight font-outfit leading-none">{booking.hotel.name}</h1>

                            {booking.hotel.address && (
                                <div className="text-xs text-white/50 print:text-black/60 max-w-xs flex items-start gap-2 pt-1 font-medium leading-relaxed">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#a1f554]" /> {booking.hotel.address}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-white/40 print:text-black/50 uppercase tracking-widest pt-2">
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[#a1f554]" /> {booking.hotel.mobile}</span>
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#a1f554]" /> {booking.hotel.hotelEmail}</span>
                            </div>

                            {booking.hotel.gstNumber && (
                                <div className="inline-flex items-center gap-2 bg-white/5 print:bg-black/5 px-3 py-1.5 rounded-lg border border-white/5 print:border-black/5 mt-2">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse" />
                                    <p className="text-[10px] font-black text-white/60 print:text-black uppercase tracking-[0.1em]">
                                        GSTIN: <span className="text-[#a1f554] print:text-black font-black">{booking.hotel.gstNumber}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                        <div className="bg-[#a1f554] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            Verified Fiscal Payload
                        </div>
                        <h2 className="text-6xl font-black text-white/5 print:text-black/10 uppercase tracking-tighter leading-none font-outfit select-none pointer-events-none">Invoice</h2>
                        <div className="mt-2 space-y-1">
                            <p className="text-2xl font-black text-white print:text-black font-outfit uppercase tracking-tight">#{booking.id.slice(-6).toUpperCase()}</p>
                            <p className="text-[10px] font-black text-white/30 print:text-black/40 uppercase tracking-widest">Cycle: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* RECIPIENT & STAY DETAILS */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/5 print:bg-black/5 p-8 rounded-[2rem] border border-white/5 print:border-black/5 shadow-inner backdrop-blur-sm">
                        <p className="text-[10px] font-black text-white/30 print:text-black/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <User className="h-3 w-3 text-[#a1f554]" /> Account / Subject
                        </p>
                        <h3 className="text-2xl font-black text-white print:text-black font-outfit uppercase tracking-tight">{booking.guestName}</h3>
                        <div className="mt-6 space-y-3">
                            <p className="text-sm font-bold text-white/70 print:text-black/70 flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-[#a1f554]" /> {booking.guestMobile}
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-[9px] font-black bg-white/10 print:bg-black/10 px-2 py-1 rounded border border-white/10 print:border-black/10 text-[#a1f554] print:text-black uppercase tracking-widest">{booking.idType}</span>
                                <span className="text-sm font-black text-white/30 print:text-black/30 tracking-widest uppercase">{booking.idNumber.slice(0, -4).replace(/./g, 'X')}{booking.idNumber.slice(-4)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border border-white/10 print:border-black/5 rounded-[2rem] relative overflow-hidden group hover:border-[#a1f554]/30 transition-all">
                        <p className="text-[10px] font-black text-white/30 print:text-black/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-[#a1f554]" /> Stay Specification
                        </p>
                        <div className="space-y-5">
                            <div>
                                <p className="text-lg font-black text-white print:text-black uppercase tracking-tight">Room {booking.room.number}</p>
                                <p className="text-[10px] font-bold text-white/40 print:text-black/40 uppercase tracking-widest">{booking.room.type} Cluster</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-white/30 print:text-black/30 uppercase tracking-widest">Initialization</span>
                                    <p className="text-sm font-bold text-white/80 print:text-black/80">{checkIn}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-white/30 print:text-black/30 uppercase tracking-widest">Termination</span>
                                    <p className="text-sm font-bold text-white/80 print:text-black/80">{checkOut}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 print:border-black/5">
                                <p className="text-[10px] font-black text-white/40 print:text-black/40 uppercase tracking-widest">Orbital Duration: <span className="text-[#a1f554] font-black">{days} Cycles</span></p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <Crown className="h-6 w-6 text-[#a1f554]" />
                        </div>
                    </div>
                </div>

                {/* LINE ITEMS TABLE */}
                <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/10 print:border-black/10 mb-12 shadow-2xl shadow-black/20">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 print:bg-black/5 text-white print:text-black uppercase tracking-[0.2em] text-[10px] font-black">
                            <tr>
                                <th className="p-6 font-black border-b border-white/10 print:border-black/5">Service Definition</th>
                                <th className="p-6 text-right font-black border-b border-white/10 print:border-black/5">Unit Matrix</th>
                                <th className="p-6 text-right font-black border-b border-white/10 print:border-black/5">Cycles</th>
                                <th className="p-6 text-right font-black border-b border-white/10 print:border-black/5">Fiscal Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 print:divide-black/5">
                            <tr className="hover:bg-white/5 print:hover:bg-black/5 transition-colors">
                                <td className="p-6">
                                    <p className="font-black text-white print:text-black uppercase tracking-tight">Accommodation Core</p>
                                    <p className="text-[9px] font-bold text-white/30 print:text-black/40 uppercase tracking-widest mt-1">Premium Habitation Services</p>
                                </td>
                                <td className="p-6 text-right font-bold text-white/60 print:text-black/60">₹{booking.room.price.toLocaleString()}</td>
                                <td className="p-6 text-right font-bold text-white/60 print:text-black/60">{days}</td>
                                <td className="p-6 text-right font-black text-[#a1f554] print:text-black">₹{roomTotal.toLocaleString('en-IN')}</td>
                            </tr>

                            {gstRate > 0 ? (
                                <tr className="bg-white/[0.02] print:bg-black/[0.02]">
                                    <td className="p-6">
                                        <p className="font-black text-white/60 print:text-black/60 uppercase tracking-tight">Regulatory Tax Matrix</p>
                                        <p className="text-[9px] font-bold text-white/30 print:text-black/30 uppercase tracking-widest mt-1">Institutional Levy — {gstRate}%</p>
                                    </td>
                                    <td className="p-6 text-right text-white/20 print:text-black/20">—</td>
                                    <td className="p-6 text-right text-white/20 print:text-black/20">—</td>
                                    <td className="p-6 text-right font-black text-white/80 print:text-black/80">₹{gstAmount.toLocaleString('en-IN')}</td>
                                </tr>
                            ) : (
                                <tr className="bg-white/[0.01] print:bg-black/[0.01] italic">
                                    <td className="p-6">
                                        <p className="font-bold text-white/20 print:text-black/20 uppercase tracking-tight">Tax Exemption Cluster</p>
                                        <p className="text-[9px] font-bold text-white/20 print:text-black/20 uppercase tracking-widest mt-1">Zero-rated yield classification</p>
                                    </td>
                                    <td className="p-6 text-right text-white/10 print:text-black/10">—</td>
                                    <td className="p-6 text-right text-white/10 print:text-black/10">—</td>
                                    <td className="p-6 text-right font-bold text-white/20 print:text-black/20">₹0.00</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* SUMMARY & SETTLEMENT */}
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex-1 space-y-6 max-w-sm">
                        <div className="p-8 bg-[#a1f554]/5 print:bg-black/5 rounded-[2rem] border border-[#a1f554]/10 border-dashed relative group">
                            <p className="text-[10px] font-black text-[#a1f554] print:text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5" /> Integrity Protocol
                            </p>
                            <p className="text-[10px] text-white/40 print:text-black/50 font-medium leading-relaxed italic">
                                This document is an encoded system record of orbital habitation services. Digital verification node redundant. Signature requirements deprecated.
                            </p>
                            <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-ping" />
                        </div>
                        <div className="flex items-center gap-4 px-2">
                            <Globe className="h-5 w-5 text-white/10 print:text-black/10" />
                            <span className="text-[10px] font-black text-white/20 print:text-black/20 uppercase tracking-[0.3em]">Hash: {bookingId.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-96 space-y-4">
                        <div className="flex justify-between items-center text-white/40 print:text-black/50 font-bold uppercase tracking-widest text-[10px] px-2">
                            <span>Base Yield</span>
                            <span>₹{roomTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/40 print:text-black/50 font-bold uppercase tracking-widest text-[10px] px-2">
                            <span>Tax Allocation</span>
                            <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-2xl font-black text-white print:text-black border-t-2 border-white/10 print:border-black/5 pt-8 mt-6 font-outfit uppercase tracking-tight px-2">
                            <span>Grand Total</span>
                            <span className="text-[#a1f554] print:text-black">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-[#a1f554]/60 print:text-black/60 font-black uppercase tracking-widest text-[10px] pt-2 px-2">
                            <span>Settled Advance</span>
                            <span>- ₹{advancePaid.toLocaleString('en-IN')}</span>
                        </div>

                        <div className={cn(
                            "flex justify-between items-center p-8 rounded-[2.5rem] border mt-8 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] print:shadow-none print:border-black/10",
                            balanceDue > 0
                                ? "bg-red-500/10 border-red-500/20 text-red-500 print:bg-red-50 print:text-red-600"
                                : "bg-[#a1f554] border-[#a1f554] text-black"
                        )}>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">{balanceDue > 0 ? "Residual Liability" : "Protocol Status"}</p>
                                <p className="text-2xl font-black font-outfit uppercase tracking-tighter mt-1">{balanceDue > 0 ? "Balance Overdue" : "Fully Synchronized"}</p>
                            </div>
                            <p className="text-3xl font-black font-outfit tracking-tighter">₹{Math.max(0, balanceDue).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* FOOTER & GRATITUDE */}
                <div className="relative z-10 mt-24 md:mt-32 pt-12 border-t border-white/5 print:border-black/5 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-14 w-14 bg-white/5 print:bg-black/5 rounded-2xl flex items-center justify-center text-[#a1f554] print:text-black border border-white/5 print:border-black/5">
                            <Crown className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-white print:text-black font-outfit uppercase tracking-tight">Luxury Redefined. Operation Absolute.</p>
                            <p className="text-[9px] font-black text-white/30 print:text-black/40 uppercase tracking-[0.3em] mt-3 flex items-center justify-center gap-2">
                                For specialized orbital support, contact <span className="text-[#a1f554] print:text-black not-italic font-black">{booking.hotel.mobile}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}