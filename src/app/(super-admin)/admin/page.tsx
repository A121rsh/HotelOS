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
    Activity,
    DoorOpen,
    Calendar
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

    // Mock Growth Data
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
        <div className="space-y-8 md:space-y-12">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Activity className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-slate-400 text-sm mt-1">System overview and analytics</p>
                        </div>
                    </div>
                    <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 px-4 py-2 font-semibold">
                        Live
                    </Badge>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    trend="+24.5%"
                    trendType="up"
                    color="green"
                />
                <MetricCard
                    title="Active Hotels"
                    value={stats.activeHotels}
                    icon={Hotel}
                    trend="+5 this month"
                    trendType="up"
                    color="blue"
                />
                <MetricCard
                    title="Total Rooms"
                    value={stats.totalRooms}
                    icon={DoorOpen}
                    trend={`${stats.activeHotels} hotels`}
                    trendType="neutral"
                    color="purple"
                />
                <MetricCard
                    title="Bookings"
                    value={stats.totalBookings}
                    icon={Calendar}
                    trend="All time"
                    trendType="neutral"
                    color="yellow"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* Revenue Chart */}
                <Card className="lg:col-span-2 bg-[#0f110d] border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <CardHeader className="p-6 md:p-8 border-b border-white/10">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-white">Revenue Overview</CardTitle>
                                <CardDescription className="text-slate-400 text-sm mt-1">Weekly performance</CardDescription>
                            </div>
                            <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 w-fit">
                                This Month
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <AreaChartCustom data={stats.revenueData} height={280} color="#a1f554" />
                    </CardContent>
                </Card>

                {/* Hotel Growth Chart */}
                <Card className="bg-[#0f110d] border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <CardHeader className="p-6 md:p-8 border-b border-white/10">
                        <CardTitle className="text-xl font-bold text-white">Hotel Growth</CardTitle>
                        <CardDescription className="text-slate-400 text-sm mt-1">Monthly signups</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <BarChartCustom data={stats.growthData} height={280} color="#8ba4b8" />
                    </CardContent>
                </Card>
            </div>

            {/* System Status & Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* System Health */}
                <Card className="bg-gradient-to-br from-[#0f110d] to-black border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1f554] rounded-full blur-[100px] opacity-10" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                                <Zap className="h-5 w-5 text-[#a1f554]" />
                            </div>
                            <h3 className="text-lg font-bold text-white">System Health</h3>
                        </div>

                        <div className="space-y-4">
                            <HealthMetric label="Database" value="Optimal" pct={100} color="bg-[#a1f554]" />
                            <HealthMetric label="API Status" value="Active" pct={98} color="bg-[#8ba4b8]" />
                            <HealthMetric label="Services" value="Running" pct={100} color="bg-blue-500" />
                        </div>
                    </div>
                </Card>

                {/* Statistics */}
                <Card className="lg:col-span-2 bg-[#0f110d] border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-[#8ba4b8]/10 rounded-xl flex items-center justify-center border border-[#8ba4b8]/20">
                            <Users className="h-5 w-5 text-[#8ba4b8]" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Platform Statistics</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatusBox label="Active Hotels" count={stats.activeHotels} color="green" />
                        <StatusBox label="Inactive" count={stats.deactivatedHotels} color="red" />
                        <StatusBox label="Total Rooms" count={stats.totalRooms} color="blue" />
                        <StatusBox label="Bookings" count={stats.totalBookings} color="purple" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, trendType, color }: any) {
    const colorClasses: any = {
        green: "bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20",
        blue: "bg-[#8ba4b8]/10 text-[#8ba4b8] border-[#8ba4b8]/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    return (
        <Card className="bg-[#0f110d] border-white/10 rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-all shadow-xl">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border", colorClasses[color])}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                        trendType === "up" ? "text-[#a1f554] bg-[#a1f554]/10" : 
                        trendType === "down" ? "text-red-400 bg-red-500/10" : 
                        "text-slate-400 bg-white/5"
                    )}>
                        {trendType === "up" ? <ArrowUpRight className="h-3 w-3" /> : 
                         trendType === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                        {trend}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">{title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
                </div>
            </div>
        </Card>
    );
}

function HealthMetric({ label, value, pct, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-white font-semibold">{value}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000 rounded-full", color)} 
                    style={{ width: `${pct}%` }} 
                />
            </div>
        </div>
    );
}

function StatusBox({ label, count, color }: any) {
    const colorMap: any = {
        green: "text-[#a1f554] bg-[#a1f554]/10 border-[#a1f554]/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
        blue: "text-[#8ba4b8] bg-[#8ba4b8]/10 border-[#8ba4b8]/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    };

    return (
        <div className={cn("p-4 md:p-5 rounded-xl border text-center hover:scale-105 transition-transform", colorMap[color])}>
            <p className="text-2xl md:text-3xl font-bold mb-1">{count}</p>
            <p className="text-xs font-medium opacity-80">{label}</p>
        </div>
    );
}