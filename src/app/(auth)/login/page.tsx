"use client";

import { useState, useEffect } from "react";
import { doLogin } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  Hotel,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      const res = await doLogin(formData);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res?.success && res.destination) {
        // ✅ Explicitly redirect on client side
        router.push(res.destination);
        // We don't set isLoading(false) here to keep the loader until page changes
      }
    } catch (err) {
      console.error("Login Submission Error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  // ⏳ Authenticated State Handling
  if (status === "authenticated") {
    return (
      <div className="h-screen h-[100dvh] bg-[#0a0a0a] flex items-center justify-center p-6 font-inter relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b5f347]/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[400px] w-full bg-[#151515] border border-white/5 p-8 md:p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="h-32 w-32 text-[#b5f347]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-[#b5f347]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#b5f347]/20 shadow-inner">
              <Hotel className="h-8 w-8 text-[#b5f347]" />
            </div>

            <h2 className="text-2xl font-black font-outfit text-white tracking-tight uppercase mb-4">Node Authorized</h2>
            <p className="text-slate-500 font-bold mb-10 uppercase tracking-widest text-[9px] leading-relaxed">
              Active Encrypted Session:<br />
              <span className="text-white">{session?.user?.email}</span>
            </p>

            <div className="space-y-4 w-full">
              <Button
                onClick={() => router.replace(session?.user?.role === "ADMIN" ? "/admin" : "/dashboard")}
                className="w-full h-14 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#b5f347]/10 transition-all active:scale-[0.98]"
              >
                Access Command Center
              </Button>
              <Link href="/signout" className="block w-full">
                <Button variant="ghost" className="w-full h-14 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/5 font-black text-[11px] uppercase tracking-[0.2em] transition-all">
                  Terminate Session
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="h-screen h-[100dvh] bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#b5f34708_0%,_transparent_70%)] pointer-events-none" />

        <div className="flex flex-col items-center justify-center space-y-12 relative z-10">
          <div className="relative w-40 h-20">
            <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full">
              <path
                d="M30,25 C30,12 15,12 15,25 C15,38 30,38 30,25 C30,12 70,38 70,25 C70,12 85,12 85,25 C85,38 70,38 70,25 C70,12 30,38 30,25"
                fill="none"
                stroke="#b5f347"
                strokeWidth="1"
                className="opacity-20"
              />
              <motion.path
                d="M30,25 C30,12 15,12 15,25 C15,38 30,38 30,25 C30,12 70,38 70,25 C70,12 85,12 85,25 C85,38 70,38 70,25 C70,12 30,38 30,25"
                fill="none"
                stroke="#b5f347"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0.2, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ filter: "drop-shadow(0 0 8px #b5f347)" }}
              />
            </svg>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black font-outfit text-white tracking-[0.2em] uppercase">System Provisioning</h2>
            <div className="flex flex-col items-center gap-2">
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[9px] font-bold text-[#b5f347] uppercase tracking-[0.3em]"
              >
                Authorized Access Only
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen h-[100dvh] bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6 font-inter">

      {/* Background Architectural Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b5f347]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Brand Identity */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Link href="/" className="group">
              <div className="h-12 w-12 rounded-xl bg-[#b5f347] flex items-center justify-center shadow-2xl shadow-[#b5f347]/20 transition-all duration-500 group-hover:rotate-[10deg] active:scale-95">
                <Hotel className="h-6 w-6 text-black" />
              </div>
            </Link>
          </div>
          <h1 className="text-2xl font-black font-outfit text-white tracking-tighter leading-none mb-1 uppercase">
            Hotel<span className="text-[#b5f347]">OS</span>
          </h1>
          <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.4em]">Proprietary Command Node v4.2</p>
        </div>

        <div className="bg-[#151515] border border-white/5 shadow-[0_32px_120px_-20px_rgba(0,0,0,1)] rounded-[2.5rem] overflow-hidden backdrop-blur-3xl relative">
          {/* Top Glow Ray */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b5f347]/40 to-transparent" />

          <div className="px-8 pt-8 pb-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black font-outfit text-white tracking-tight uppercase leading-none">Executive Login</h2>
              <KeyRound className="h-4 w-4 text-[#b5f347]/40" />
            </div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none">Access Token Provisioning Required.</p>
          </div>

          <form action={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
                    <Shield className="h-4 w-4 text-red-500 shrink-0" />
                    <span className="text-red-500 font-black text-[8px] uppercase tracking-widest leading-none">Node Alert: {error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Command Identity</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. administrator@hotel.com"
                    required
                    className="h-12 pl-12 rounded-xl border-white/5 bg-white/2 focus:bg-white/5 focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Security Protocol</Label>
                  <button type="button" className="text-[8px] font-bold text-[#b5f347]/40 hover:text-[#b5f347] transition-all uppercase tracking-widest leading-none">Recovery</button>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    required
                    className="h-12 pl-12 pr-12 rounded-xl border-white/5 bg-white/2 focus:bg-white/5 focus:border-[#b5f347]/30 focus:ring-0 transition-all font-bold text-white placeholder:text-slate-800 text-sm"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-800 group-focus-within:text-[#b5f347] transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full h-14 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#b5f347]/5 group relative active:scale-95 transition-all mb-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Authorize Connection</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-white" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-white">Encrypted</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-white" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-white">Verified Node</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center px-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
            New Entity? {" "}
            <Link href="/register" className="text-[#b5f347] hover:text-white transition-all underline decoration-[#b5f347]/30 underline-offset-4">
              Register Core HQ
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Extreme Bottom Visual Marker */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 hidden md:flex opacity-20 hover:opacity-60 transition-opacity cursor-default">
        <div className="h-1 w-1 rounded-full bg-[#b5f347]" />
        <div className="h-px w-20 bg-white/20" />
        <span className="text-[7px] font-black text-white uppercase tracking-[0.6em] whitespace-nowrap">SECURE.COMMAND_NODE.ACTIVE</span>
        <div className="h-px w-20 bg-white/20" />
        <div className="h-1 w-1 rounded-full bg-[#b5f347]" />
      </div>
    </div>
  );
}