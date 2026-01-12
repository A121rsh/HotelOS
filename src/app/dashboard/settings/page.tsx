import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateHotelSettings } from "@/actions/settings";
import { Building2, Save, Mail, Phone, MapPin, FileText } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: { hotel: true }
  });

  const hotel = user?.hotel;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your hotel profile, billing details and preferences.</p>
      </div>

      {/* 1. HOTEL PROFILE CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600"/> Hotel Profile & Billing
          </CardTitle>
          <CardDescription>
            This information will appear on your printed Invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateHotelSettings} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <Label>Hotel Name</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="name" defaultValue={hotel?.name} className="pl-9 font-medium" />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="email" defaultValue={hotel?.hotelEmail} className="pl-9" />
                    </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="mobile" defaultValue={hotel?.mobile} className="pl-9" />
                    </div>
                </div>

                {/* ✅ GST Number (Enabled) */}
                <div className="space-y-2">
                    <Label>GSTIN Number</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="gstNumber" defaultValue={hotel?.gstNumber || ""} placeholder="e.g. 24AAAAA0000A1Z5" className="pl-9 uppercase" />
                    </div>
                </div>

                {/* ✅ Address (Enabled - Full Width) */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>Full Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input name="address" defaultValue={hotel?.address || ""} placeholder="Building No, Street Name, City, State - Zipcode" className="pl-9" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                    <Save className="mr-2 h-4 w-4" /> Save Details
                </Button>
            </div>

          </form>
        </CardContent>
      </Card>
      
      {/* Security Info Placeholder */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
          <div className="mt-1">💡</div>
          <div>
              <p className="text-sm font-bold text-blue-900">Pro Tip</p>
              <p className="text-sm text-blue-700">Make sure your GST Number and Address are correct. They will be automatically printed on all guest invoices.</p>
          </div>
      </div>

    </div>
  );
}