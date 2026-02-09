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
  KeyRound
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🛑 Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [status, session, router]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      const res = await doLogin(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ⏳ Loading state
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-sm"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">HotelO.S.</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Loading your session...</p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Hotel className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-30 blur-md"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            HotelO.S.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            Hotel Operations System • Professional Management Suite
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>

          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Secure Login
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <form action={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                  <AlertDescription className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@hotel.com"
                      required
                      className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>

              <div className="relative w-full">
                <Separator className="my-4" />
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 text-sm text-slate-500 dark:text-slate-400">
                  or
                </div>
              </div>

              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <p>
                  Demo credentials?{" "}
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    admin@hotel.com / admin123
                  </span>
                </p>
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
                <p>© {new Date().getFullYear()} HotelO.S. • Secure Hotel Management Platform</p>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* System Status */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Active</span>
          </div>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>SSL Secured</span>
          </div>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}