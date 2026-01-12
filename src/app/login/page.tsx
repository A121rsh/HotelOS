// src/app/login/page.tsx
"use client";

import { useState } from "react";
// NextAuth ka client-side signin function (next-auth/react se nahi, server actions better hain but abhi simple rakhte hain)
// Note: NextAuth v5 beta mein client side import kabhi kabhi change hota hai, 
// hum abhi simple Server Action approach use karenge login ke liye agle step mein.
// Lekin UI pehle bana lete hain.

import { doLogin } from "@/actions/login"; // Ye action hum abhi banayenge
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await doLogin(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login to HotelO.S.</h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="admin@hotel.com" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" placeholder="******" required />
          </div>

          <Button type="submit" className="w-full">Sign In</Button>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}