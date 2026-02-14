"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerHotel } from "@/actions/register";
import {
  Loader2,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Hotel,
  ArrowLeft,
  Crown,
  Sparkles,
  Zap,
  Globe,
  MapPin,
  Star,
  Quote,
  Building
} from "lucide-react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const testimonials = [
  {
    quote: "Provisioning our headquarters with HotelOS was the smoothest technical transition our team has experienced.",
    author: "Sarah Jenkins",
    role: "Luxury Portfolio Director"
  }
];

import ImageUpload from "@/components/ImageUpload";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planId = searchParams.get("planId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hotelName = formData.get("hotelName") as string;

    if (logoUrl) formData.append("logo", logoUrl);
    if (planId) formData.append("planId", planId);

    try {
      const result = await registerHotel(formData) as any;

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Store credentials temporarily for post-payment email
        // We do not store sensitive data permanently, just for the session flow
        if (typeof window !== "undefined") {
          sessionStorage.setItem("temp_reg_email", email);
          sessionStorage.setItem("temp_reg_pass", password);
          sessionStorage.setItem("temp_reg_name", formData.get("firstName") + " " + formData.get("lastName"));
        }

        setSuccess(true);
        await signIn("credentials", { email, password, redirect: false });
        // Reduced delay for snappier experience
        setTimeout(() => {
          router.push(`/checkout?planId=${planId || ""}&hotelId=${result.hotelId}`);
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 p-12 bg-[#111111]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CheckCircle2 className="h-32 w-32 text-[#b5f347]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mx-auto w-24 h-24 bg-[#b5f347] rounded-3xl flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(181,243,71,0.2)]">
            <CheckCircle2 className="h-12 w-12 text-black" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black font-outfit text-white tracking-tighter uppercase leading-none">Node Established</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] leading-relaxed max-w-[320px] mx-auto opacity-60">
              Your administrative authority has been verified. Finalizing environmental sync.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 mt-12 w-full max-w-sm">
            <div className="h-[3px] w-full bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[#b5f347] shadow-[0_0_20px_rgba(181,243,71,0.5)]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#b5f347]" />
              <span className="text-[10px] font-black text-[#b5f347] uppercase tracking-[0.5em]">Executing Priority Redirect</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl"
    >
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black font-outfit text-white tracking-tighter uppercase leading-none mb-4 italic-none">
          Establish <span className="text-[#b5f347]">Administrative Node</span>
        </h2>
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] leading-none opacity-80">
          Provision your global headquarters and secure elite access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                <ShieldCheck className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-red-500 font-black text-[10px] uppercase tracking-widest leading-none">Security Alert: {error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-12">
          {/* SECTION 1: ENTITY IDENTITY */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 opacity-30 px-1">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Step 01: Property Identity</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Property Name</Label>
                <div className="relative group">
                  <Input
                    name="hotelName"
                    placeholder="e.g. Grand Heritage Node"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-800 group-focus-within:text-[#b5f347] transition-colors flex items-center justify-center">
                    <Building className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Establish Brand Logo</Label>
                <div className="h-14 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center px-4 justify-between group/upload">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">SVG/PNG Profile</span>
                  </div>
                  <div className="scale-[0.5] origin-right">
                    <ImageUpload
                      value={logoUrl ? [logoUrl] : []}
                      onChange={(url) => setLogoUrl(url)}
                      onRemove={() => setLogoUrl("")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ADMINISTRATIVE PROFILES */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 opacity-30 px-1">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Step 02: Admin Credentials</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin First Name</Label>
                <div className="relative group">
                  <Input
                    name="firstName"
                    placeholder="Alexander"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Last Name</Label>
                <div className="relative group">
                  <Input
                    name="lastName"
                    placeholder="Parkinson"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Authorized Email</Label>
                <div className="relative group">
                  <Input
                    name="email"
                    type="email"
                    placeholder="alexander@hotel-hq.com"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Phone Line</Label>
                <div className="relative group flex items-center">
                  <div className="absolute left-5 flex items-center gap-2 z-10 py-1 pr-3 border-r border-white/10">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-[10px] font-black text-slate-600">+91</span>
                  </div>
                  <Input
                    name="mobile"
                    placeholder="98765 43210"
                    required
                    className="h-14 pl-28 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm w-full"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Territory (State)</Label>
                <div className="relative group">
                  <Input
                    name="state"
                    placeholder="e.g. Maharashtra"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
                <input type="hidden" name="country" value="India" />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Access Token (Password)</Label>
                <div className="relative group">
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••••••••••"
                    required
                    className="h-14 pl-14 rounded-2xl border-white/5 bg-white/[0.02] focus:bg-white/[0.05] focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={loading}
                  />
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-12 lg:pb-0">
          <Button type="submit" className="w-full h-18 py-6 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(181,243,71,0.2)] active:scale-[0.98] transition-all group relative overflow-hidden" disabled={loading}>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Initializing Core...</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span>Deploy Headquarters</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>

          <div className="mt-8 flex items-center justify-between px-2">
            <button
              onClick={() => router.back()}
              type="button"
              className="flex items-center gap-2 text-[9px] font-black text-slate-800 uppercase tracking-[0.2em] hover:text-[#b5f347] transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="h-3 w-3" />
              Return to Plan Grid
            </button>
            <div className="flex items-center gap-4 opacity-10">
              <ShieldCheck className="h-4 w-4 text-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">AES-256 SECURED</span>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen lg:h-screen w-screen lg:h-[100dvh] bg-[#0a0a0a] flex flex-col lg:flex-row font-outfit lg:overflow-hidden relative">

      {/* LEFT SIDE: Information & Branding */}
      <div className="w-full lg:w-[38%] bg-[#070707] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 shrink-0">

        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#b5f347]/5 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>

        {/* Logo */}
        <Link href="/" className="mb-8 lg:mb-4 group relative z-10 w-fit">
          <div className="flex items-center gap-4">
            <div className="bg-[#b5f347] p-2.5 rounded-xl shadow-2xl shadow-[#b5f347]/20 group-hover:rotate-[10deg] transition-all duration-500">
              <Hotel className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic-none">
              Hotel<span className="text-[#b5f347]">OS</span>
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="relative z-10 max-w-sm mb-12 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] uppercase tracking-tighter mb-4 italic-none">
              Setup your <br />
              <span className="text-[#b5f347]">Sovereign Node</span>
            </h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-xs leading-relaxed uppercase tracking-[0.2em] mb-8 max-w-xs">
              The all-in-one OS for elite property management. Establish headquarters and provision your global hotel node.
            </p>
          </motion.div>
        </div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#151515] border border-white/5 rounded-2xl p-6 shadow-2xl relative z-10"
        >
          <Quote className="h-8 w-8 text-[#b5f347] absolute top-[-16px] left-6 opacity-20" />
          <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-4 italic">
            &ldquo;Provisioning our headquarters with HotelOS was the smoothest technical transition our team has experienced.&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">Sarah Jenkins</p>
                <p className="text-[#b5f347] font-bold text-[8px] uppercase tracking-widest leading-none">Director</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-2 w-2 fill-[#b5f347] text-[#b5f347]" />)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:flex-1 h-full py-12 px-6 lg:px-0 flex flex-col items-center relative lg:overflow-y-auto bg-[#0a0a0a]">

        {/* Step Indicator */}
        <div className="flex items-center gap-8 lg:gap-12 opacity-10 mb-12 mt-8 lg:mt-16 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <div className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-[#b5f347]" />
            <span className="text-[6px] lg:text-[7px] font-black text-white uppercase tracking-[0.4em]">Node Registry</span>
          </div>
          <div className="h-px w-8 lg:w-16 bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-[#b5f347]" />
            <span className="text-[6px] lg:text-[7px] font-black text-white uppercase tracking-[0.4em]">Provisioning</span>
          </div>
          <div className="h-px w-8 lg:w-16 bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full border border-slate-700" />
            <span className="text-[6px] lg:text-[7px] font-black text-slate-800 uppercase tracking-[0.4em]">Final Sync</span>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#b5f347]" />
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Establishing Secure Channel...</span>
          </div>
        }>
          <RegisterForm />
        </Suspense>

        <div className="hidden lg:block opacity-5 space-x-12 mt-auto pb-10 pt-10 shrink-0">
          <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">SYSTEM.NODE_REGISTRY.042</span>
          <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">ENCRYPTED_TRANSMISSION.ACTIVE</span>
        </div>
      </div>
    </div>
  );
}