"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerHotel } from "@/actions/register"; // ✅ Import Action correctly
import ImageUpload from "@/components/ImageUpload"; 
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 🛑 Page refresh rokne ke liye
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    if (logoUrl) {
        formData.append("logo", logoUrl);
    }

    try {
        const result = await registerHotel(formData);

        if (result?.error) {
            alert("Error: " + result.error);
        } else {
            alert("✅ Registration Successful! Please Login.");
            router.push("/login"); // Redirect to login
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Hotel Owner Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Owner Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">👤 Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input name="ownerName" placeholder="e.g. Zubair Raza" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input name="email" type="email" placeholder="owner@gmail.com" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input name="password" type="password" required />
                </div>
            </div>

            <hr />

            {/* Hotel Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">🏨 Hotel Info</h3>
                <div className="space-y-2">
                    <Label>Hotel Name</Label>
                    <Input name="hotelName" placeholder="e.g. Taj Palace" required />
                </div>
                <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input name="mobile" placeholder="+91 9876543210" required />
                </div>
            </div>

            <hr />

            {/* Logo Upload */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">📸 Hotel Branding</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                    <ImageUpload 
                        value={logoUrl ? [logoUrl] : []} 
                        onChange={(url) => setLogoUrl(url)}
                        onRemove={() => setLogoUrl("")}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 size-lg text-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Registration"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}