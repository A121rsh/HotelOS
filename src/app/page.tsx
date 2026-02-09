import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Hotel 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Hotel OS</span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                    Login
                </Button>
            </Link>
            <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                    Start Free Trial
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm mb-6 border border-blue-100">
                🚀 New: Integrated Booking Engine
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Manage your Hotel <br/>
                <span className="text-blue-600">Like a Pro.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                The all-in-one platform to manage bookings, staff, rooms, and guests. 
                Say goodbye to registers and spreadsheets.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register-hotel">
                    <Button className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl rounded-full">
                        Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="#features">
                    <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300">
                        Learn More
                    </Button>
                </Link>
            </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
                <p className="text-slate-500 mt-2">Powerful features to grow your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                        <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Dashboard</h3>
                    <p className="text-slate-500">Get a bird's eye view of your revenue, occupancy, and upcoming tasks in real-time.</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                        <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Engine</h3>
                    <p className="text-slate-500">Your own commission-free website. Let guests book rooms directly without paying OTAs.</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Reliable</h3>
                    <p className="text-slate-500">Role-based access for staff, secure data storage, and 99.9% uptime guarantee.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your hotel?</h2>
            <p className="text-slate-400 mb-10 text-lg">Join hundreds of hotel owners managing their business effortlessly.</p>
            <Link href="/register-hotel">
                <Button className="h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full">
                    Start Your Free Trial
                </Button>
            </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 Hotel OS. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Contact</a>
            </div>
        </div>
      </footer>

    </div>
  );
}