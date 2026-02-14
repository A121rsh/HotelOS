
// Final build trigger for Vercel deployment fix
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
  CheckCircle2,
  Cpu,
  Fingerprint,
  Zap,
  Globe
} from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);

  if (!hotel) {
    return <div className="p-10 text-center font-bold text-[#a1f554]/40 uppercase tracking-widest font-outfit">Access Denied: Node Not Identified.</div>;
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
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-inter selection:bg-[#a1f554] selection:text-black">

      {/* Background Narrative Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#a1f554]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#a1f554]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">

        {/* Institutional Header */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#a1f554]/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all duration-1000" />
          <div className="relative bg-[#0c0c0c]/80 backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 lg:gap-12">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20 shadow-[0_0_30px_rgba(161,245,84,0.1)] group-hover:scale-105 transition-transform duration-500">
                <Cpu className="h-10 w-10 text-[#a1f554]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20 text-[9px] font-black tracking-widest px-2 py-0.5 uppercase">Node Admin 01</Badge>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-outfit italic">
                  Node <span className="text-[#a1f554]">Configurations</span>
                </h1>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Institutional operational protocols & identification matrices</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Authorization Matrix</div>
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                <Fingerprint className="h-4 w-4 text-[#a1f554]" />
                <span className="text-xs font-black text-[#a1f554] uppercase tracking-widest">{hotel.name.slice(0, 8)}...SYSTEM_AUTH</span>
              </div>
            </div>
          </div>
        </div>

        <form action={updateHotelSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Logic Stream */}
          <div className="lg:col-span-8 space-y-10">

            {/* CORE IDENTITY MATRIX */}
            <Card className="border-white/5 bg-[#0c0c0c]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl group hover:border-[#a1f554]/20 transition-all duration-500">
              <CardHeader className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/10 group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6 text-[#a1f554]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight font-outfit">Identity Matrix</CardTitle>
                    <CardDescription className="text-white/30 text-[9px] uppercase tracking-widest font-black mt-1">Foundational property identification & communication routes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 group/field">
                    <Label htmlFor="name" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#a1f554] transition-colors">Property Designation</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        defaultValue={hotel.name}
                        className="h-14 pl-6 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-white font-bold tracking-tight text-lg"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><Globe className="h-4 w-4" /></div>
                    </div>
                  </div>

                  <div className="space-y-3 group/field">
                    <Label htmlFor="gstNumber" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#a1f554] transition-colors">Tax Protocol ID (GST)</Label>
                    <div className="relative">
                      <Input
                        id="gstNumber"
                        name="gstNumber"
                        defaultValue={hotel.gstNumber || ""}
                        placeholder="AUTH_ID_REQUIRED"
                        className="h-14 pl-6 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-[#a1f554] font-black uppercase tracking-widest placeholder:text-white/10"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><Zap className="h-4 w-4" /></div>
                    </div>
                  </div>

                  <div className="space-y-3 group/field">
                    <Label htmlFor="email" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#a1f554] transition-colors">Digital Comm Route</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={hotel.hotelEmail}
                        className="h-14 pl-6 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-white font-medium"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><Mail className="h-4 w-4" /></div>
                    </div>
                  </div>

                  <div className="space-y-3 group/field">
                    <Label htmlFor="mobile" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#a1f554] transition-colors">Telemetric Line</Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        name="mobile"
                        defaultValue={hotel.mobile}
                        className="h-14 pl-6 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-white font-bold"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><Phone className="h-4 w-4" /></div>
                    </div>
                  </div>

                  <div className="col-span-full space-y-3 group/field">
                    <Label htmlFor="address" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 group-focus-within/field:text-[#a1f554] transition-colors">Physical Node Coordinates</Label>
                    <div className="relative">
                      <Input
                        id="address"
                        name="address"
                        defaultValue={hotel.address || ""}
                        placeholder="Global positioning required..."
                        className="h-16 pl-6 rounded-2xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-white font-medium placeholder:text-white/10"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20"><MapPin className="h-5 w-5" /></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CAPACITY AUGMENTATION (Amenities) */}
            <Card className="border-white/5 bg-[#0c0c0c]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl group hover:border-[#a1f554]/20 transition-all duration-500">
              <CardHeader className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/10 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6 text-[#a1f554]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight font-outfit">Capability Array</CardTitle>
                    <CardDescription className="text-white/30 text-[9px] uppercase tracking-widest font-black mt-1">Authorized amenity modules and guest interface enhancements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {["WIFI", "TV", "AC", "PARKING", "POOL", "BREAKFAST", "GYM", "RESTAURANT"].map((item) => {
                    const Icon = amenityIcons[item] || Sparkles;
                    return (
                      <label
                        key={item}
                        className="relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-[#a1f554]/30 transition-all cursor-pointer group/node"
                      >
                        <input
                          type="checkbox"
                          name="amenities"
                          value={item}
                          // @ts-ignore
                          defaultChecked={(hotel.amenities || []).includes(item)}
                          className="peer absolute opacity-0"
                        />
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover/node:scale-110 peer-checked:bg-[#a1f554] peer-checked:text-black peer-checked:shadow-[0_0_20px_rgba(161,245,84,0.3)] transition-all duration-500">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest peer-checked:text-[#a1f554] group-hover/node:text-white/50 transition-colors">{item}</span>

                        <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all duration-500">
                          <div className="h-2 w-2 rounded-full bg-[#a1f554] shadow-[0_0_10px_#a1f554]" />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auxiliary Node Control (Sidebar) */}
          <div className="lg:col-span-4 space-y-10">

            {/* VISUAL RECOGNITION (Banner) */}
            <Card className="border-white/5 bg-[#0c0c0c]/60 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl lg:sticky lg:top-24 hover:border-[#a1f554]/20 transition-all duration-500">
              <CardHeader className="p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <ImageIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-white uppercase tracking-tight font-outfit">Visual ID Card</CardTitle>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Primary node recognition asset</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="bannerImage" className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Asset Source URL</Label>
                  <Input
                    id="bannerImage"
                    name="bannerImage"
                    // @ts-ignore
                    defaultValue={(hotel.images && hotel.images[0]) || ""}
                    className="h-12 rounded-xl border-white/5 bg-white/[0.03] focus:bg-white/[0.08] focus:border-[#a1f554]/30 transition-all text-white/50 text-[10px] font-mono"
                  />

                  {/* High-Fi Preview */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 bg-black group-hover:border-[#a1f554]/10 transition-colors">
                    <img
                      // @ts-ignore
                      src={(hotel.images && hotel.images[0]) || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
                      alt="Node Preview"
                      className="h-full w-full object-cover grayscale-[20%] brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] shadow-[0_0_10px_#a1f554]" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Preview</span>
                      </div>
                      <Badge className="bg-black/50 backdrop-blur-md text-white/40 border-white/10 text-[8px] uppercase tracking-tighter">HD_STREAM_01</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-[#a1f554]/5 rounded-2xl border border-[#a1f554]/10">
                    <ShieldCheck className="h-5 w-5 text-[#a1f554] shrink-0" />
                    <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                      Protocol Synchronization: Changes are automatically pushed to global delivery networks & invoice generation engines.
                    </p>
                  </div>

                  <Button type="submit" className="w-full h-16 bg-[#a1f554] hover:bg-[#b4f876] text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-[0_20px_40px_rgba(161,245,84,0.1)] hover:shadow-[0_25px_50px_rgba(161,245,84,0.2)] group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <div className="flex items-center justify-center gap-3 relative z-10 transition-transform group-hover:scale-[1.02]">
                      <Save className="h-5 w-5" />
                      Commit Configurations
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}