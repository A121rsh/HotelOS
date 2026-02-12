// src/app/login/page.tsx
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🛑 Redirect if already authenticated - Only if not explicitly visiting login
  useEffect(() => {
    // If we just authenticated via form, we redirect. 
    // If we were ALREADY authenticated when page loaded, we show a choice.
  }, [status, session, router]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      const res = await doLogin(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        // Success handled by doLogin or redirection
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ⏳ Authenticated State Handling
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-inter">
        <div className="max-w-[480px] w-full bg-white/10 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 animate-pulse">
            <ShieldCheck className="h-40 w-40 text-blue-400" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-20 w-20 bg-white rounded-[1.8rem] flex items-center justify-center mb-8 shadow-2xl">
              <Hotel className="h-10 w-10 text-slate-900" />
            </div>

            <h2 className="text-3xl font-black font-outfit text-white tracking-tight leading-none mb-4">Access Confirmed</h2>
            <p className="text-slate-400 font-bold mb-10 uppercase tracking-widest text-[10px]">Active Session Detected: {session?.user?.email}</p>

            <div className="space-y-4 w-full">
              <Button
                onClick={() => router.replace(session?.user?.role === "ADMIN" ? "/admin" : "/dashboard")}
                className="w-full h-16 btn-premium rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/20"
              >
                Enter Command Center
              </Button>
              <Link href="/api/auth/signout" className="block">
                <Button variant="ghost" className="w-full h-16 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest">
                  Disconnect Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
          <div className="relative">
            <div className="h-24 w-24 rounded-[2rem] bg-white text-slate-900 flex items-center justify-center shadow-2xl">
              <Hotel className="h-12 w-12" />
            </div>
            <div className="absolute -inset-4 rounded-[2.5rem] bg-white/5 blur-xl"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black font-outfit text-white tracking-widest uppercase">System Provisioning</h2>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Authorized Access Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-6 font-inter">

      {/* Background Architectural Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[480px]"
      >
        {/* Brand Identity */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Link href="/" className="group">
              <div className="relative">
                <div className="h-20 w-20 rounded-[1.8rem] bg-slate-900 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Hotel className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-2 rounded-[2.2rem] bg-slate-900/5 blur-md"></div>
              </div>
            </Link>
          </div>
          <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-3 italic">
            Hotel<span className="text-blue-600">OS</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-slate-200" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Proprietary Governance</p>
            <span className="h-px w-8 bg-slate-200" />
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 pb-0 space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Executive Login</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <KeyRound className="h-5 w-5" />
              </div>
            </div>
            <CardDescription className="text-slate-500 font-medium">Provision your credentials to unlock the property control center.</CardDescription>
          </CardHeader>

          <form action={handleSubmit}>
            <CardContent className="p-10 space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive" className="bg-red-50 border-red-100 rounded-2xl p-4">
                      <AlertDescription className="text-red-600 font-bold text-xs flex items-center gap-2 uppercase tracking-tight">
                        <Shield className="h-4 w-4" />
                        Authentication Failed: {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Command Identity</Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. administrator@hotel.com"
                      required
                      className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Protocol</Label>
                    <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Reset Key</button>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Access Token Required"
                      required
                      className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group/tip">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold text-blue-900/60 leading-tight uppercase tracking-tight">
                  Use authorized credentials provided during property establishment for full operational access.
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-10 pt-0 flex flex-col gap-6">
              <Button
                type="submit"
                className="w-full h-16 btn-premium rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 group overflow-hidden relative"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Authorize Connection
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="flex flex-col items-center gap-4">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Secure End-to-End Encryption Protocol Active</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 opacity-50">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
                  </div>
                  <div className="h-3 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 opacity-50">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protected</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            New Property Establishment? {" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Register Headquarters
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}