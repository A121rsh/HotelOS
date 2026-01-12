// src/components/PrintButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <Button 
      className="bg-slate-900 gap-2 hover:bg-slate-800 text-white"
      onClick={() => {
        // Ye browser ka native print dialog open karega
        window.print();
      }}
    >
      <Printer className="h-4 w-4" /> Print Invoice
    </Button>
  );
}