"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap
} from "lucide-react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data from previous step
  const planId = searchParams.get("planId");
  const hotelName = searchParams.get("hotelName");
  const mobile = searchParams.get("mobile");
  const logo = searchParams.get("logo");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (hotelName) formData.append("hotelName", hotelName);
    if (mobile) formData.append("mobile", mobile);
    if (logo) formData.append("logo", logo);
    if (planId) formData.append("planId", planId);

    try {
      const result = await registerHotel(formData) as any;

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess(true);

        // Auto-login
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        setTimeout(() => {
          router.push(`/checkout?planId=${planId}&hotelId=${result.hotelId}`);
        }, 3000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 p-12 bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl"
      >
        <div className="mx-auto w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border-8 border-white">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none italic">Welcome to the Elite, <span className="text-blue-600 font-black">{hotelName}</span></h2>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            Your property headquarters has been established. Our system is currently provisioning your secure environment.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="h-2 w-full max-w-[200px] bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Authorized Redirect Initiated</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-xl"
    >
      <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-2xl rounded-[3.5rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
        <CardHeader className="text-center pt-12 pb-8 px-10">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl mb-6">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Enroll Property</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-lg mt-3">
            Secure the administrative command for <span className="text-slate-900 font-black">{hotelName}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-12 pb-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 text-red-600 p-5 rounded-[1.5rem] border border-red-100 flex items-center gap-3 overflow-hidden"
                >
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-tight leading-tight">Registration Blocked: {error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proprietor Name</Label>
                <div className="relative group">
                  <Input
                    name="ownerName"
                    placeholder="e.g. Master Administrator"
                    required
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                    disabled={loading}
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authorized Channel (Email)</Label>
                <div className="relative group">
                  <Input
                    name="email"
                    type="email"
                    placeholder="admin@hotel-hq.com"
                    required
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                    disabled={loading}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Token (Password)</Label>
                <div className="relative group">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Minimum 8 cryptographic characters"
                    required
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                    disabled={loading}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-4 p-5 bg-slate-50/80 rounded-[2rem] border border-slate-100 mb-8 group">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                  By proceeding, you authorize the establishment of this property node under our <a href="#" className="text-blue-600 underline">Standard Sovereign Terms</a>.
                </p>
              </div>

              <Button type="submit" className="w-full h-16 btn-premium rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 group relative overflow-hidden" disabled={loading}>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {loading ? (
                  <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Provisioning Node...</>
                ) : (
                  <>
                    Initialize Headquarters
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-12 pb-12 flex flex-col gap-6">
          <Button
            variant="ghost"
            className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
            onClick={() => router.back()}
            disabled={loading}
          >
            <ArrowLeft className="mr-3 h-4 w-4" />
            Adjust Hotel Profile
          </Button>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 opacity-30">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Instant Setup</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Step 02 / 03</div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden px-6 py-24 font-inter">
      {/* Background Architectural Patterns */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      {/* Corporate Branding */}
      <div className="mb-14">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-slate-900 p-3 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl shadow-slate-900/10">
            <Hotel className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-black font-outfit text-slate-900 tracking-tight italic">
            Hotel<span className="text-blue-600">OS</span>
          </span>
        </Link>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-6 p-20 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 animate-pulse">
          <div className="h-20 w-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shadow-inner">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600/30" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Optimizing Enrollment Gateway</span>
        </div>
      }>
        <RegisterForm />
      </Suspense>

      {/* Safety Compliance Branding */}
      <div className="mt-12 opacity-30 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ISO 27001 Certified System</span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-slate-400" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Premium Node Infrastructure</span>
        </div>
      </div>
    </div>
  );
}