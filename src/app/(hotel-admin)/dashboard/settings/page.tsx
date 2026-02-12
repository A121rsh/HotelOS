import { auth } from "@/auth";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateHotelSettings } from "@/actions/settings";
import {
  Building2,
  Save,
  Mail,
  Phone,
  MapPin,
  FileText,
  Settings2,
  ShieldCheck,
  Wifi,
  Tv,
  Wind,
  Car,
  Waves,
  Coffee,
  Dumbbell,
  Utensils,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);

  if (!hotel) {
    return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;
  }

  const amenityIcons: Record<string, any> = {
    WIFI: Wifi,
    TV: Tv,
    AC: Wind,
    PARKING: Car,
    POOL: Waves,
    BREAKFAST: Coffee,
    GYM: Dumbbell,
    RESTAURANT: Utensils,
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20 font-inter">

      {/* 1. PREMIUM HEADER */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Settings2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Property Configuration</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[10px]">Primary Identity</Badge>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                  <ShieldCheck className="h-3 w-3" /> System Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
              <p className="text-xs font-bold text-emerald-500 uppercase">Synchronized</p>
            </div>
          </div>
        </div>
      </div>

      <form action={updateHotelSettings}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

          {/* LEFT COLUMN: PRIMARY DETAILS */}
          <div className="xl:col-span-2 space-y-10">

            {/* 2. CORE IDENTITY SECTION */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 md:p-10 pb-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black font-outfit text-slate-900">Boutique Identity</CardTitle>
                    <CardDescription className="font-medium text-slate-400">Public profile and billing information.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Property Name</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="name"
                        defaultValue={hotel.name}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">GSTIN (India)</Label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="gstNumber"
                        defaultValue={hotel.gstNumber || ""}
                        placeholder="e.g. 24AAAAA0000A1Z5"
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="email"
                        defaultValue={hotel.hotelEmail}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="mobile"
                        defaultValue={hotel.mobile}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="col-span-full space-y-3">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Property Headquarters Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        name="address"
                        defaultValue={hotel.address || ""}
                        placeholder="Building, Street, City, State - Zip"
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. EXPERIENCE & AMENITIES */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 md:p-10 pb-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black font-outfit text-slate-900">Guest Experience</CardTitle>
                    <CardDescription className="font-medium text-slate-400">Select services available at your property.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 md:p-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["WIFI", "TV", "AC", "PARKING", "POOL", "BREAKFAST", "GYM", "RESTAURANT"].map((item) => {
                    const Icon = amenityIcons[item] || Sparkles;
                    return (
                      <label
                        key={item}
                        className="relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-100 transition-all cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          name="amenities"
                          value={item}
                          // @ts-ignore
                          defaultChecked={(hotel.amenities || []).includes(item)}
                          className="peer absolute opacity-0"
                        />
                        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-all duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest peer-checked:text-blue-600 transition-colors">{item}</span>

                        {/* Checked Indicator */}
                        <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: VISUAL IDENTITY & CTA */}
          <div className="space-y-10">

            {/* 4. BRAND ASSETS SECTION */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden sticky top-24">
              <CardHeader className="p-8">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-xl font-black font-outfit text-slate-900">Visual Assets</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8 pt-0">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Banner URL</Label>
                  {/* @ts-ignore */}
                  <Input
                    name="bannerImage"
                    defaultValue={(hotel.images && hotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-xs truncate"
                  />

                  {/* PREVIEW BOX */}
                  <div className="aspect-[16/10] rounded-[1.5rem] bg-slate-100 border-4 border-white shadow-inner relative overflow-hidden group">
                    <img
                      // @ts-ignore
                      src={(hotel.images && hotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
                      alt="Hotel Preview"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Live Experience Preview</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-50" />

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-[1.5rem] border border-amber-100">
                    <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                      Verified data is automatically pushed to all Guest Invoices and Public Portals.
                    </p>
                  </div>

                  <Button type="submit" className="w-full h-16 btn-premium rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 group">
                    <Save className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

    </div>
  );
}