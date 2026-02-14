// src/app/(public-engine)/layout.tsx

import Link from "next/link";
import { Hotel, UserCircle } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] font-sans selection:bg-[#b5f347] selection:text-black overflow-hidden relative">

      {/* 0. ATMOSPHERIC LANDING REFERENCE GLOW */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-[#00B386]/10 rounded-full blur-[160px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      </div>

      {/* 1. DYNAMIC SCROLLABLE CORE */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide flex flex-col items-center justify-center min-h-0">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center relative px-6">
          {children}
        </div>
      </main>
    </div>
  );
}