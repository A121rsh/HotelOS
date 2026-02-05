// src/app/(public-engine)/layout.tsx

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ✅ FIX: Added 'print:hidden' here */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
            {/* ... baaki ka code same rahega ... */}
            <div className="font-bold text-xl text-slate-900 tracking-tight">
                Hotel Booking
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <span className="text-sm font-medium text-slate-600 hover:text-blue-600">Admin Login</span>
                </Link>
            </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>
        {children}
      </main>

      {/* FOOTER */}
      {/* Footer ko bhi print mein chupa dete hain, acha lagega */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Powered by HotelOS Engine.</p>
        </div>
      </footer>
    </div>
  );
}