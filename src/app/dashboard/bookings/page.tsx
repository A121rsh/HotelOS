import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Calendar } from "lucide-react";
import BookingActions from "@/components/BookingActions"; // ✅ Naya Component Import kiya

// --- Custom Icons ---
const Icons = {
  Aadhar: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 inline-block mr-1">
      <path d="M12 2C8 2 6 5 6 9C6 13 9 16 12 16C15 16 18 13 18 9C18 5 16 2 12 2Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5"/>
      <path d="M8 22V19C8 17.5 9.5 17 12 17C14.5 17 16 17.5 16 19V22" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Passport: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 inline-block mr-1">
      <rect x="5" y="4" width="14" height="16" rx="2" fill="#1E40AF"/>
      <circle cx="12" cy="12" r="3" stroke="#FBBF24" strokeWidth="1.5"/>
    </svg>
  ),
  IDCard: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 inline-block mr-1">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5"/>
      <circle cx="8" cy="12" r="2" fill="#CBD5E1"/>
      <path d="M14 10H18M14 14H18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

export default async function BookingsPage() {
  const session = await auth();
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: { 
        hotel: { 
            include: { 
                bookings: {
                    orderBy: { createdAt: 'desc' },
                    include: { room: true }
                }
            } 
        } 
    }
  });

  const bookings = user?.hotel?.bookings || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Bookings & Reservations</h1>
                <p className="text-slate-500 text-sm">Manage guest check-ins, check-outs and payments.</p>
            </div>
        </div>

        <Link href="/dashboard/bookings/new">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all active:scale-95 h-11 px-6 text-base">
                <Plus className="mr-2 h-4 w-4" /> New Booking
            </Button>
        </Link>
      </div>

      {/* BOOKING LIST TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        {bookings.length === 0 ? (
            <div className="text-center py-20 px-4">
                <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                    <Calendar className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No bookings found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-8">
                    Your reservation list is empty. Start by adding your first guest booking.
                </p>
                <Link href="/dashboard/bookings/new">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Create First Booking
                    </Button>
                </Link>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Guest</th>
                            <th className="px-6 py-4">Room & Stay</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="group hover:bg-blue-50/30 transition-colors">
                                
                                {/* Guest Column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm group-hover:border-blue-100 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                            {booking.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{booking.guestName}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="flex items-center" title={booking.idType}>
                                                    {booking.idType === 'AADHAR' ? <Icons.Aadhar /> : 
                                                     booking.idType === 'PASSPORT' ? <Icons.Passport /> : <Icons.IDCard />}
                                                    {booking.idType}
                                                </span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> {booking.guestMobile}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Room & Stay Column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-mono font-bold text-xs group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-700 transition-colors">
                                            Room {booking.room.number}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <div className="font-medium text-slate-900">
                                                {new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 
                                                <span className="text-slate-300 mx-1">—</span> 
                                                {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="mt-0.5">
                                                {Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} Nights
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Status Column */}
                                <td className="px-6 py-4">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                                        ${booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                          booking.status === 'CHECKED_IN' ? 'bg-green-50 text-green-700 border-green-200' :
                                          booking.status === 'CHECKED_OUT' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                          'bg-red-50 text-red-700 border-red-200'}
                                    `}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                                            ${booking.status === 'CONFIRMED' ? 'bg-blue-500' : 
                                              booking.status === 'CHECKED_IN' ? 'bg-green-500' :
                                              booking.status === 'CHECKED_OUT' ? 'bg-slate-500' : 'bg-red-500'}
                                        `}></span>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                </td>

                                {/* Payment Column */}
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
                                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                                            {booking.paidAmount >= booking.totalAmount ? (
                                                <span className="text-green-600 flex items-center gap-1">Paid <span className="text-xs">✓</span></span>
                                            ) : (
                                                <span className="text-red-500">Due: ₹{(booking.totalAmount - booking.paidAmount).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Actions Column (Ab Client Component se load hoga) */}
                                <td className="px-6 py-4 text-right">
                                    <BookingActions 
                                        bookingId={booking.id} 
                                        status={booking.status} 
                                        roomPrice={booking.room.price} 
                                        dueAmount={booking.totalAmount - booking.paidAmount}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}
