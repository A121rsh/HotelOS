// src/app/page.tsx (or src/app/page.tsx depending on your route)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerHotel } from "@/actions/register"; 
import ImageUpload from "@/components/ImageUpload"; 
import { 
  Loader2, 
  Hotel, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building, 
  Camera,
  CheckCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Calculate form progress
  useEffect(() => {
    let progress = 0;
    const form = document.getElementById("registration-form") as HTMLFormElement;
    if (form) {
      const inputs = form.querySelectorAll("input[required]");
      const filled = Array.from(inputs).filter((input: any) => input.value).length;
      progress = Math.round((filled / inputs.length) * 100);
    }
    setFormProgress(progress);
  }, [logoUrl]);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    
    if (logoUrl) {
        formData.append("logo", logoUrl);
    }

    try {
        const result = await registerHotel(formData);

        if (result?.error) {
            setErrors({ form: result.error });
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
    } catch (error) {
        console.error(error);
        setErrors({ form: "Something went wrong. Please try again." });
    } finally {
        setLoading(false);
    }
  };

  // Loading state
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Checking your session...</p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Registration Successful!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Your hotel has been registered with HotelO.S.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300">
                Welcome to the HotelO.S. family! Your account is being set up.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You'll be redirected to login in a few seconds...
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Account Created</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Setting Up</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="flex items-center space-x-2">
                <Hotel className="h-5 w-5 text-cyan-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Ready to Use</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
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
            HotelO.S. Registration
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Join thousands of hotels using our professional management system
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Registration Progress
            </span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              {formProgress}%
            </Badge>
          </div>
          <Progress value={formProgress} className="h-2" />
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Hotel Registration Form
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Complete all sections to register your hotel. All fields are required.
            </CardDescription>
          </CardHeader>

          <form id="registration-form" onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {errors.form && (
                <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                  <AlertDescription>
                    {errors.form}
                  </AlertDescription>
                </Alert>
              )}

              {/* Owner Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Owner Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="ownerName"
                        name="ownerName"
                        placeholder="e.g. Zubair Raza"
                        required
                        className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                        disabled={loading}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  
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
                        placeholder="owner@hotel.com"
                        required
                        className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                        disabled={loading}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
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
                      type="password"
                      placeholder="Create a strong password"
                      required
                      className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                      disabled={loading}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>
              </div>

              <Separator />

              {/* Hotel Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Building className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Hotel Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotelName" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Hotel Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="hotelName"
                        name="hotelName"
                        placeholder="e.g. Taj Palace"
                        required
                        className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                        disabled={loading}
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        name="mobile"
                        placeholder="+91 9876543210"
                        required
                        className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                        disabled={loading}
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Logo Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Hotel Branding
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <Card className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700">
                    <CardContent className="pt-6">
                      <ImageUpload 
                        value={logoUrl ? [logoUrl] : []} 
                        onChange={(url) => setLogoUrl(url)}
                        onRemove={() => setLogoUrl("")}
                      />
                    </CardContent>
                  </Card>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Upload your hotel logo (Recommended: 300x300px, PNG or JPG)
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                    I agree to the HotelO.S.{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Sign in here
                </a>
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
                <p>By registering, you agree to our terms. Contact support@hotelos.com for assistance.</p>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Secure & Encrypted</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Free 30-Day Trial</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">No credit card required</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Hotel className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">24/7 Support</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Dedicated hotel experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}