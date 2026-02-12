import { db } from "@/lib/db";
import {
    Globe,
    TrendingUp,
    Users,
    ShieldCheck,
    Zap,
    IndianRupee,
    Hotel,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChartCustom, BarChartCustom } from "@/components/admin/DataVisualizer";
import { cn } from "@/lib/utils";

async function getAdminStats() {
    const hotels = await db.hotel.findMany({
        include: {
            subscription: { include: { plan: true } },
            invoices: { where: { status: "PAID" } }
        }
    });

    const activeHotels = hotels.filter(h => h.isActive).length;
    const deactivatedHotels = hotels.length - activeHotels;

    const totalRevenue = hotels.reduce((acc, h) => {
        return acc + h.invoices.reduce((sum, inv) => sum + inv.amount, 0);
    }, 0);

    const totalRooms = await db.room.count();
    const totalBookings = await db.booking.count();

    // Mock Growth Data (In a real app, calculate from dates)
    const growthData = [
        { label: "Jan", value: 12 },
        { label: "Feb", value: 25 },
        { label: "Mar", value: 18 },
        { label: "Apr", value: 32 },
        { label: "May", value: 45 },
        { label: "Jun", value: 40 },
    ];

    const revenueData = [
        { label: "Week 1", value: 5000 },
        { label: "Week 2", value: 8500 },
        { label: "Week 3", value: 12000 },
        { label: "Week 4", value: 9800 },
    ];

    return {
        activeHotels,
        deactivatedHotels,
        totalRevenue,
        totalRooms,
        totalBookings,
        growthData,
        revenueData
    };
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-12">

            {/* CORE METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    title="Global Liquidity"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    trend="+24.5%"
                    trendType="up"
                    color="blue"
                />
                <MetricCard
                    title="Active Tenants"
                    value={stats.activeHotels}
                    icon={Globe}
                    trend="+5 today"
                    trendType="up"
                    color="emerald"
                />
                <MetricCard
                    title="Deactivated Nodes"
                    value={stats.deactivatedHotels}
                    icon={ShieldCheck}
                    trend="-2.1%"
                    trendType="down"
                    color="rose"
                />
                <MetricCard
                    title="Sync Efficiency"
                    value="99.8%"
                    icon={Zap}
                    trend="Stable"
                    trendType="neutral"
                    color="indigo"
                />
            </div>

            {/* INTELLIGENCE GRAPHS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Revenue Intelligence */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden p-10">
                    <CardHeader className="px-0 pt-0 pb-10 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black font-outfit text-slate-900">Revenue Flow</CardTitle>
                            <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Fiscal Quarter Performance Analysis</CardDescription>
                        </div>
                        <Badge className="bg-slate-900 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 text-white">Live Monitoring</Badge>
                    </CardHeader>
                    <CardContent className="px-0">
                        <AreaChartCustom data={stats.revenueData} height={280} color="#2563eb" />
                    </CardContent>
                </Card>

                {/* Tenant Growth Intelligence */}
                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden p-10">
                    <CardHeader className="px-0 pt-0 pb-10">
                        <CardTitle className="text-2xl font-black font-outfit text-slate-900">Tenant Growth</CardTitle>
                        <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Establishment Scaling Registry</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <BarChartCustom data={stats.growthData} height={280} color="#10b981" />
                    </CardContent>
                </Card>
            </div>

            {/* STATUS & HEALTH SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">Infrastructure Health</p>
                        <h3 className="text-4xl font-black font-outfit tracking-tight mb-8 leading-none">Global Sync Status</h3>

                        <div className="space-y-6 flex-1">
                            <HealthMetric label="Database Nodes" value="Optimal" pct={100} color="bg-emerald-500" />
                            <HealthMetric label="API Synchronizer" value="Active" pct={98} color="bg-blue-500" />
                            <HealthMetric label="Fiscal Engine" value="Processing" pct={100} color="bg-indigo-500" />
                        </div>
                    </div>
                </Card>

                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black font-outfit text-slate-900 leading-none">Property Status Hub</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Property Nodes Across Global Grid</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatusBox label="Active" count={stats.activeHotels} color="emerald" />
                        <StatusBox label="Deactivated" count={stats.deactivatedHotels} color="rose" />
                        <StatusBox label="Total Rooms" count={stats.totalRooms} color="blue" />
                        <StatusBox label="Total Bookings" count={stats.totalBookings} color="indigo" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, trendType, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600 shadow-blue-100/50",
        emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100/50",
        rose: "bg-rose-50 text-rose-600 shadow-rose-100/50",
        indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-100/50",
    };

    return (
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group hover:translate-y-[-5px] transition-all duration-500">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-6", colorClasses[color])}>
                        <Icon className="h-8 w-8" />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-50",
                        trendType === "up" ? "text-emerald-500" : trendType === "down" ? "text-rose-500" : "text-slate-400"
                    )}>
                        {trendType === "up" ? <ArrowUpRight className="h-3 w-3" /> : trendType === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                        {trend}
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{title}</h3>
                    <p className="text-4xl font-black font-outfit text-slate-900 tracking-tight">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function HealthMetric({ label, value, pct, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="text-slate-400">{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function StatusBox({ label, count, color }: any) {
    const colorMap: any = {
        emerald: "text-emerald-500 bg-emerald-50 border-emerald-100",
        rose: "text-rose-500 bg-rose-50 border-rose-100",
        blue: "text-blue-500 bg-blue-50 border-blue-100",
        indigo: "text-indigo-500 bg-indigo-50 border-indigo-100",
    };

    return (
        <div className={cn("p-6 rounded-[2rem] border text-center transition-transform hover:scale-105 duration-300", colorMap[color])}>
            <p className="text-3xl font-black font-outfit mb-1 leading-none">{count}</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
        </div>
    );
}
