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
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col items-center print:bg-white print:p-0 font-inter">

            {/* Top Controls (Hidden in Print) */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-10 print:hidden">
                <Link href="/dashboard/bookings">
                    <Button variant="ghost" className="h-10 px-4 rounded-xl text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] gap-2 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Registry
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Document Status</span>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tight mt-1 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Digital Original
                        </span>
                    </div>
                    <PrintButton />
                </div>
            </div>

            {/* --- EXECUTIVE INVOICE DOCUMENT --- */}
            <div className="bg-white w-full max-w-4xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 print:shadow-none print:w-full print:max-w-none print:p-12 border border-slate-100 relative overflow-hidden">

                {/* Background Emblem (Print Subtle) */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none print:opacity-[0.02]">
                    <Crown className="h-64 w-64 text-slate-900" />
                </div>

                {/* HEADER SECTION */}
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900/5 pb-10 mb-10 gap-8">
                    <div className="flex items-start gap-8">
                        {/* 🏰 HOTEL LOGO / BRANDING */}
                        <div className="flex-shrink-0">
                            {booking.hotel.logo ? (
                                <div className="h-20 w-20 relative rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                    <Image
                                        src={booking.hotel.logo}
                                        alt={booking.hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                                    <Building2 className="h-10 w-10" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight font-outfit leading-none">{booking.hotel.name}</h1>

                            {booking.hotel.address && (
                                <div className="text-xs text-slate-500 max-w-xs flex items-start gap-2 pt-1 font-medium leading-relaxed">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" /> {booking.hotel.address}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-slate-600 uppercase tracking-widest pt-2">
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-300" /> {booking.hotel.mobile}</span>
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-300" /> {booking.hotel.hotelEmail}</span>
                            </div>

                            {booking.hotel.gstNumber && (
                                <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 mt-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em]">
                                        GSTIN: <span className="text-blue-600">{booking.hotel.gstNumber}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            Official Fiscal Document
                        </div>
                        <h2 className="text-6xl font-black text-slate-100 uppercase tracking-tighter leading-none font-outfit select-none pointer-events-none">Invoice</h2>
                        <div className="mt-2 space-y-1">
                            <p className="text-lg font-black text-slate-900 font-outfit uppercase tracking-tight">#{booking.id.slice(-6).toUpperCase()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* RECIPIENT & STAY DETAILS */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <User className="h-3 w-3" /> Bill To / Consignee
                        </p>
                        <h3 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tight">{booking.guestName}</h3>
                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-slate-300" /> {booking.guestMobile}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                                <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 uppercase tracking-widest">{booking.idType}</span>
                                <span className="text-sm font-black text-slate-400 tracking-widest uppercase">{booking.idNumber.slice(0, -4).replace(/./g, 'X')}{booking.idNumber.slice(-4)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-2 border-slate-50 rounded-[2rem] relative overflow-hidden group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Stay Specification
                        </p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Room {booking.room.number}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{booking.room.type} Collection</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Activation</span>
                                    <p className="text-sm font-bold text-slate-700">{checkIn}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Termination</span>
                                    <p className="text-sm font-bold text-slate-700">{checkOut}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-50">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Nightly Cycles: <span className="text-slate-900 font-black">{days}</span></p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <Crown className="h-6 w-6 text-slate-900" />
                        </div>
                    </div>
                </div>

                {/* LINE ITEMS TABLE */}
                <div className="relative z-10 overflow-hidden rounded-[2rem] border border-slate-100 mb-12 shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900 text-white uppercase tracking-[0.2em] text-[10px] font-black">
                            <tr>
                                <th className="p-5 font-black">Description of Service</th>
                                <th className="p-5 text-right font-black">Unit Rate</th>
                                <th className="p-5 text-right font-black">Qty/Days</th>
                                <th className="p-5 text-right font-black">Fiscal Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="bg-white hover:bg-slate-50 transition-colors">
                                <td className="p-5">
                                    <p className="font-black text-slate-900 uppercase tracking-tight">Accommodation Services</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Primary Occupancy Rights</p>
                                </td>
                                <td className="p-5 text-right font-bold text-slate-600">₹{booking.room.price.toLocaleString()}</td>
                                <td className="p-5 text-right font-bold text-slate-600">{days}</td>
                                <td className="p-5 text-right font-black text-slate-900">₹{roomTotal.toLocaleString('en-IN')}</td>
                            </tr>

                            {gstRate > 0 ? (
                                <tr className="bg-slate-50/50">
                                    <td className="p-5">
                                        <p className="font-black text-slate-600 uppercase tracking-tight">Central Goods & Services Tax</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Standard Statutory Levy — {gstRate}%</p>
                                    </td>
                                    <td className="p-5 text-right text-slate-300">—</td>
                                    <td className="p-5 text-right text-slate-300">—</td>
                                    <td className="p-5 text-right font-black text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</td>
                                </tr>
                            ) : (
                                <tr className="bg-slate-50/20 italic">
                                    <td className="p-5">
                                        <p className="font-bold text-slate-400 uppercase tracking-tight">Statutory Tax (Exempt)</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Non-taxable supply classification</p>
                                    </td>
                                    <td className="p-5 text-right text-slate-300">—</td>
                                    <td className="p-5 text-right text-slate-300">—</td>
                                    <td className="p-5 text-right font-bold text-slate-400">₹0.00</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* SUMMARY & SETTLEMENT */}
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex-1 space-y-6 max-w-sm">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Digital Integrity Audit
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                This document is a system-generated authentic record of staying services rendered. No physical signature required for validity under digital protocol 4.2.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 px-2">
                            <Globe className="h-5 w-5 text-slate-200" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">System ID: {bookingId.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-80 space-y-4">
                        <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px] px-2">
                            <span>Subtotal Revenue</span>
                            <span>₹{roomTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px] px-2">
                            <span>Tax Allocation</span>
                            <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-xl font-black text-slate-900 border-t-2 border-slate-900 pt-6 mt-4 font-outfit uppercase tracking-tight px-2">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-emerald-600 font-black uppercase tracking-widest text-[10px] pt-2 px-2">
                            <span>Less: Advance Settlement</span>
                            <span>- ₹{advancePaid.toLocaleString('en-IN')}</span>
                        </div>

                        <div className={cn(
                            "flex justify-between items-center p-6 rounded-3xl border mt-6 transition-all shadow-xl",
                            balanceDue > 0
                                ? "bg-red-50 border-red-100 text-red-600 shadow-red-600/5 mt-8"
                                : "bg-black border-slate-800 text-white shadow-slate-900/40"
                        )}>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">{balanceDue > 0 ? "Residual Liability" : "Settlement Status"}</p>
                                <p className="text-2xl font-black font-outfit uppercase tracking-tighter mt-1">{balanceDue > 0 ? "Balance Due" : "Full Cleared"}</p>
                            </div>
                            <p className="text-3xl font-black font-outfit tracking-tighter">₹{Math.max(0, balanceDue).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* FOOTER & GRATITUDE */}
                <div className="relative z-10 mt-20 md:mt-32 pt-10 border-t border-slate-100 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100">
                            <Crown className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-black text-slate-900 font-outfit uppercase tracking-tight">Luxury Defined. Experience Absolute.</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic flex items-center justify-center gap-2">
                                For institutional queries, contact <span className="text-slate-900 not-italic">{booking.hotel.mobile}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}