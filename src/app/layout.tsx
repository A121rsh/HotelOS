import type { Metadata } from "next";
import { Inter, Outfit, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AuthProvider from "@/components/providers/SessionProvider";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Hotel O.S.",
  description: "Hotel Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${instrument.variable} antialiased font-inter`}
      >
        {/* ✅ AuthProvider se wrap kiya */}
        <AuthProvider>
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
          <Toaster position="top-center" richColors />
        </AuthProvider>

        {/* ✅ Cloudinary Upload Widget Script */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="afterInteractive"
        />

        {/* ✅ Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
