import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper"; // ✅ HELPER USE KIYA
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Trash2, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddStaffModal from "@/components/AddStaffModal"; 
import { deleteStaff } from "@/actions/staff"; 

export default async function StaffPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // 1. Check karo ki ye User (Admin) hai ya nahi
  // Staff page sirf Owner dekh sakta hai, Staff khud apna page nahi dekh sakta (usually)
  const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: { ownedHotel: true }
  });

  const hotel = user?.ownedHotel;

  // Security: Agar user Owner nahi hai, to Access Denied
  if (!hotel) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
            <Shield className="h-16 w-16 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
            <p className="text-slate-500">Only Hotel Owners can manage staff.</p>
        </div>
      );
  }

  // 2. Staff List fetch karo (Isi hotel ke employees)
  const staffList = await db.user.findMany({
      where: { workingAtId: hotel.id }, // Jo log is hotel me kaam karte hain
      orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
               <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
               <p className="text-slate-500 mt-1">Manage access roles for your employees.</p>
           </div>
           <AddStaffModal />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* 1. ADMIN CARD (Owner Himself) */}
           <Card className="border-l-4 border-l-slate-900 bg-slate-50/50">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {session.user.name} <span className="text-xs font-normal text-slate-400">(You)</span>
                   </CardTitle>
                   <Shield className="h-5 w-5 text-slate-900"/>
               </CardHeader>
               <CardContent>
                   <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                       <Mail className="h-4 w-4"/> {session.user.email}
                   </p>
                   <Badge className="bg-slate-900">OWNER / ADMIN</Badge>
               </CardContent>
           </Card>

           {/* 2. STAFF LIST */}
           {staffList.map((staff) => (
               <Card key={staff.id} className={`border-l-4 shadow-sm transition-all hover:shadow-md
                   ${staff.role === 'FRONT_DESK' ? 'border-l-blue-500' : 'border-l-green-500'}
               `}>
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <CardTitle className="text-lg font-bold">{staff.name}</CardTitle>
                       {staff.role === 'FRONT_DESK' ? <User className="h-5 w-5 text-blue-500"/> : <Sparkles className="h-5 w-5 text-green-500"/>}
                   </CardHeader>
                   <CardContent>
                       <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                           <Mail className="h-4 w-4"/> {staff.email}
                       </p>
                       <div className="flex justify-between items-center">
                           <Badge variant="secondary" className={`
                               ${staff.role === 'FRONT_DESK' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                           `}>
                               {staff.role.replace('_', ' ')}
                           </Badge>
                           
                           {/* Server Action for Delete */}
                           <form action={async () => {
                               "use server";
                               await deleteStaff(staff.id);
                           }}>
                               <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 h-8">
                                   <Trash2 className="h-4 w-4 mr-1"/> Remove
                               </Button>
                           </form>
                       </div>
                   </CardContent>
               </Card>
           ))}

           {staffList.length === 0 && (
               <div className="col-span-full py-10 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                   No staff members added yet. Add a Receptionist or Housekeeper.
               </div>
           )}
       </div>
    </div>
  );
}