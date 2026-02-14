import { db } from "@/lib/db";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { About } from "@/components/landing/About";
import { Comparison } from "@/components/landing/Comparison";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

async function getPlans() {
    return await db.subscriptionPlan.findMany({
        orderBy: { price: "asc" }
    });
}

export default async function LandingPage() {
    const plans = await getPlans();

    return (
        <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#b5f347] selection:text-black overflow-x-hidden text-white">
            <Header />

            <main className="overflow-x-hidden">
                {/* 1. HERO - Background Text + Floating Widgets */}
                <Hero />

                {/* 2. HI-FI FEATURES - Asymmetric Person Widget + Pop-out Globe */}
                <Features />

                {/* 3. WHO WE SERVE - Property Portfolios & Compliance */}
                <About />

                {/* 4. PRICING - 4 Tier Command Nodes */}
                <Pricing plans={plans as any} />

                {/* 5. COMPARISON - Competitive Node Sync */}
                <Comparison />

                {/* 6. FAQ - Curated Protocols */}
                <FAQ />
            </main>

            <Footer />
        </div>
    );
}
