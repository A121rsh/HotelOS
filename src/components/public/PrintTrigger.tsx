"use client"; // 👈 Ye zaroori hai interactivity ke liye

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintTrigger() {
  return (
    <Button 
        variant="outline" 
        className="w-full mt-4" 
        onClick={() => window.print()} // ✅ Ab ye chalega
    >
      <Printer className="mr-2 h-4 w-4" /> Print Receipt
    </Button>
  );
}