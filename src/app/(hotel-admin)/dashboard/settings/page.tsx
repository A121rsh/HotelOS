import { auth } from "@/auth";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateHotelSettings } from "@/actions/settings";
import { Building2, Save, Mail, Phone, MapPin, FileText } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);

  if (!hotel) {
    return <div>Hotel not found</div>;
  }

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
            <Building2 className="h-5 w-5 text-blue-600" /> Hotel Profile & Billing
          </CardTitle>
          <CardDescription>
            This information will appear on your printed Invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ❌ PURANA CODE (Error wala):
             action={async (formData) => { await updateHotelSettings(formData); }}

             ✅ NAYA CODE (Sahi):
             Direct function pass karein. Next.js apne aap arguments handle kar lega.
          */}
          <form action={updateHotelSettings} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label>Hotel Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input name="name" defaultValue={hotel.name} className="pl-9 font-medium" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input name="email" defaultValue={hotel.hotelEmail} className="pl-9" />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input name="mobile" defaultValue={hotel.mobile} className="pl-9" />
                </div>
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <Label>GSTIN Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input name="gstNumber" defaultValue={hotel.gstNumber || ""} placeholder="e.g. 24AAAAA0000A1Z5" className="pl-9 uppercase" />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label>Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input name="address" defaultValue={hotel.address || ""} placeholder="Building No, Street Name, City, State - Zipcode" className="pl-9" />
                </div>
              </div>

              {/* AMENITIES SECTION */}
              <div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100">
                <h3 className="font-medium text-slate-900 mb-4">Hotel Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["WIFI", "TV", "AC", "PARKING", "POOL", "BREAKFAST", "GYM", "RESTAURANT"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="amenities"
                        value={item}
                        // @ts-ignore
                        defaultChecked={(hotel.amenities || []).includes(item)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label className="text-sm font-normal text-slate-600 capitalize">{item.toLowerCase()}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* BANNER IMAGE SECTION */}
              <div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100">
                <Label>Hotel Banner Image (URL)</Label>
                <p className="text-xs text-slate-500 mb-2">Paste a direct link to your hotel image.</p>
                {/* @ts-ignore */}
                <Input name="bannerImage" defaultValue={(hotel.images && hotel.images[0]) || ""} placeholder="https://images.unsplash.com/photo-..." />
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

    </div >
  );
}