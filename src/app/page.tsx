import { db } from "@/lib/db";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { About } from "@/components/landing/About";
import { Footer } from "@/components/landing/Footer";

async function getPlans() {
    return await db.subscriptionPlan.findMany({
        orderBy: { price: "asc" }
    });
}

export default async function LandingPage() {
    const plans = await getPlans();

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                <Hero />
                <Features />
                <About />
                <Pricing plans={plans as any} />
            </main>

            <Footer />
        </div>
    );
}
