"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    ShieldCheck,
    Phone,
    Mail,
    BedDouble,
    User,
    Receipt,
    IndianRupee,
    Clock,
    MapPin,
    Users,
    Copy,
    Download,
    MoreVertical
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BookingActions from "@/components/BookingActions";
import { useState } from "react";

interface BookingDetailViewProps {
    booking: any;
    statusMessage: string;
    id: string;
}

export default function BookingDetailView({ booking, statusMessage, id }: BookingDetailViewProps) {
    const nights = Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const dueAmount = booking.totalAmount - booking.paidAmount;
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        >
            {/* Enhanced Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Link 
                    href="/dashboard/bookings" 
                    className="group flex items-center gap-3 px-4 py-2 -ml-4 rounded-full hover:bg-slate-50 transition-all duration-200"
                >
                    <div className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Back to Bookings</span>
                </Link>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                        roomPrice={booking.room.price}
                        dueAmount={dueAmount}
                    />
                </div>
            </div>

            {/* Enhanced Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-8 lg:p-12 shadow-2xl mb-8"
            >
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-400/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10">
                    {/* Top Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Badge className={cn(
                                "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border-0 shadow-lg",
                                booking.status === 'CONFIRMED' && "bg-emerald-500 text-white",
                                booking.status === 'CHECKED_IN' && "bg-blue-500 text-white",
                                booking.status === 'PENDING' && "bg-amber-500 text-white",
                                booking.status === 'CANCELLED' && "bg-rose-500 text-white",
                                booking.status === 'COMPLETED' && "bg-slate-700 text-white"
                            )}>
                                {booking.status.replace('_', ' ')}
                            </Badge>
                            
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                <span className="text-xs font-medium text-emerald-300">Verified Booking</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-emerald-100/70 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>Booking ID: #{booking.id.slice(-8)}</span>
                            <button 
                                onClick={() => handleCopy(booking.id)}
                                className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative"
                            >
                                <Copy className="h-3.5 w-3.5" />
                                {copied && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                                {booking.guestName}
                            </h1>
                            
                            <p className="text-emerald-100/80 text-lg max-w-2xl leading-relaxed">
                                {statusMessage}
                            </p>

                            {/* Quick Info Chips */}
                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                    <BedDouble className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium">Room {booking.room.number}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                    <Calendar className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                    <Users className="h-4 w-4 text-emerald-300" />
                                    <span className="text-sm font-medium">2 Adults</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 min-w-[200px]">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                                <p className="text-xs font-medium text-emerald-300/80 mb-1">Check-in</p>
                                <p className="text-xl font-bold">{format(new Date(booking.checkIn), 'dd MMM')}</p>
                                <p className="text-xs text-emerald-300/60 mt-1">2:00 PM</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                                <p className="text-xs font-medium text-emerald-300/80 mb-1">Check-out</p>
                                <p className="text-xl font-bold">{format(new Date(booking.checkOut), 'dd MMM')}</p>
                                <p className="text-xs text-emerald-300/60 mt-1">11:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Timeline Card - Redesigned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Stay Timeline</h3>
                                    <p className="text-sm text-slate-500">Check-in and check-out schedule</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-100 to-slate-100" />
                                
                                {/* Check-in */}
                                <div className="relative flex gap-6 mb-12">
                                    <div className="relative z-10">
                                        <div className="h-16 w-16 rounded-full bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center">
                                            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">IN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-slate-900">Check-in</h4>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                Completed
                                            </Badge>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900 mb-1">
                                            {format(new Date(booking.checkIn), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        <p className="text-slate-500 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            2:00 PM - Early check-in available upon request
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Check-out */}
                                <div className="relative flex gap-6">
                                    <div className="relative z-10">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center">
                                            <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">OUT</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-slate-900">Check-out</h4>
                                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                                Upcoming
                                            </Badge>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900 mb-1">
                                            {format(new Date(booking.checkOut), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        <p className="text-slate-500 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            11:00 AM - Late check-out subject to availability
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact & Identity Cards - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900">Contact Information</h4>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Mobile</p>
                                            <p className="font-medium text-slate-900">{booking.guestMobile}</p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-full">
                                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="font-medium text-slate-900">{booking.guestEmail || "Not provided"}</p>
                                        </div>
                                    </div>
                                    {booking.guestEmail && (
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-full">
                                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Identity Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900">Identity Verification</h4>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-xs text-slate-500 mb-1">ID Type</p>
                                    <p className="font-semibold text-slate-900">{booking.idType}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-slate-500 mb-1">ID Number</p>
                                    <p className="font-mono text-sm font-medium text-slate-900">{booking.idNumber}</p>
                                </div>
                                
                                {booking.idImage && (
                                    <button className="w-full mt-4 relative group overflow-hidden rounded-xl">
                                        <img 
                                            src={booking.idImage} 
                                            alt="ID Document" 
                                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">View Document</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar - 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    {/* Payment Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden sticky top-24">
                        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-transparent">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                        <IndianRupee className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900">Payment Summary</h4>
                                </div>
                                <Receipt className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {/* Amount Breakdown */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Room charges ({nights} nights)</span>
                                    <span className="font-medium text-slate-900">₹{booking.totalAmount.toLocaleString()}</span>
                                </div>
                                
                                {booking.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{booking.discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {booking.taxAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-slate-600">
                                        <span>Taxes & fees</span>
                                        <span>+₹{booking.taxAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">Total Amount</span>
                                        <span className="text-xl font-bold text-slate-900">₹{booking.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Paid amount</span>
                                    <span className="font-medium text-emerald-600">₹{booking.paidAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            {/* Due Amount Card */}
                            <div className={cn(
                                "p-5 rounded-xl mb-6 text-center",
                                dueAmount > 0 ? "bg-rose-50" : "bg-emerald-50"
                            )}>
                                <p className="text-xs uppercase tracking-wider font-semibold mb-2 text-slate-500">
                                    {dueAmount > 0 ? "Pending Payment" : "Fully Paid"}
                                </p>
                                <p className={cn(
                                    "text-4xl font-bold",
                                    dueAmount > 0 ? "text-rose-600" : "text-emerald-600"
                                )}>
                                    ₹{dueAmount.toLocaleString()}
                                </p>
                                {dueAmount > 0 && (
                                    <p className="text-xs text-rose-600 mt-2">Due immediately</p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/20">
                                    Process Payment
                                </Button>
                                
                                <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl">
                                    Send Invoice
                                </Button>
                                
                                <details className="group">
                                    <summary className="text-xs text-center text-slate-500 cursor-pointer hover:text-slate-700 list-none mt-4">
                                        Advanced Options
                                    </summary>
                                    <div className="mt-3 space-y-2">
                                        <Button variant="ghost" className="w-full h-10 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-sm">
                                            Apply Discount
                                        </Button>
                                        <Button variant="ghost" className="w-full h-10 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-sm">
                                            Refund Payment
                                        </Button>
                                    </div>
                                </details>
                            </div>
                        </div>
                        
                        {/* Footer Note */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <p className="text-xs text-slate-500 text-center">
                                Invoice will be sent automatically upon check-out
                            </p>
                        </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4">
                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Quick Actions</h5>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 text-center hover:bg-slate-50 rounded-xl transition-colors group">
                                <Phone className="h-5 w-5 mx-auto mb-1 text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-xs text-slate-600 group-hover:text-emerald-600">Call Guest</span>
                            </button>
                            <button className="p-3 text-center hover:bg-slate-50 rounded-xl transition-colors group">
                                <Mail className="h-5 w-5 mx-auto mb-1 text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-xs text-slate-600 group-hover:text-emerald-600">Send Email</span>
                            </button>
                            <button className="p-3 text-center hover:bg-slate-50 rounded-xl transition-colors group">
                                <MapPin className="h-5 w-5 mx-auto mb-1 text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-xs text-slate-600 group-hover:text-emerald-600">Directions</span>
                            </button>
                            <button className="p-3 text-center hover:bg-slate-50 rounded-xl transition-colors group">
                                <Receipt className="h-5 w-5 mx-auto mb-1 text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-xs text-slate-600 group-hover:text-emerald-600">Print</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}