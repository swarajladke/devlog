"use client";

import { useEffect, useState } from "react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Zap,
    Target,
    BookOpen,
    CalendarDays,
    Hash,
    ArrowUpRight,
    Activity,
    TrendingUp,
    LayoutGrid,
    ChevronRight,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
    totalLogs: number;
    totalProjects: number;
    totalResources: number;
    tagStats: { name: string, value: number }[];
    activityData: { date: string, count: number }[];
    streak: number;
}

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Professional Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/[0.05] animate-reveal">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">System Overview</p>
                    <h1 className="text-5xl font-bold tracking-tight text-white leading-none">
                        Dashboard <span className="text-zinc-500 font-medium">Metrics</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button className="btn-primary">
                        Export Report
                    </button>
                </div>
            </header>

            {/* Refined Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-4 gap-6 min-h-[850px]">

                {/* Main Activity Area */}
                <div className="md:col-span-4 md:row-span-2 glass-card flex flex-col pt-10 animate-reveal [animation-delay:100ms]">
                    <div className="px-2 flex justify-between items-center mb-12">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Development Activity</h3>
                            <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-widest font-mono">Registry Density Index</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <Activity size={12} className="text-emerald-500" />
                            System Active
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <Tooltip
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-2xl">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
                                                    <p className="text-lg font-bold text-white">{payload[0].value} <span className="text-xs text-zinc-500 font-medium lowercase">entries</span></p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={0.1}
                                    fill="#6366f1"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="md:col-span-2 md:row-span-1 glass-card flex flex-col justify-between animate-reveal [animation-delay:200ms]">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-lg bg-indigo-500/5 text-indigo-500 border border-indigo-500/10">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Growth</span>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight">+12.4%</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Monthly Delta</p>
                    </div>
                </div>

                <div className="md:col-span-2 md:row-span-1 glass-card flex flex-col justify-between animate-reveal [animation-delay:300ms]">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-lg bg-orange-500/5 text-orange-500 border border-orange-500/10">
                            <Zap size={20} />
                        </div>
                        <ArrowUpRight size={14} className="text-zinc-700" />
                    </div>
                    <div className="mt-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{stats?.streak || 0} Days</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Registry Streak</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="md:col-span-2 md:row-span-2 glass-card flex flex-col animate-reveal [animation-delay:400ms]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Categories</h3>
                        <Activity size={16} className="text-zinc-600" />
                    </div>
                    <div className="h-[180px] mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.tagStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {stats?.tagStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} strokeWidth={0} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex-1">
                        {stats?.tagStats.slice(0, 3).map((tag, i) => (
                            <div key={tag.name} className="flex justify-between items-center group/item cursor-default">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[11px] font-medium text-zinc-500 group-hover/item:text-zinc-300 transition-colors">{tag.name}</span>
                                </div>
                                <span className="text-[10px] font-bold font-mono text-zinc-600">{tag.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Access List */}
                <div className="md:col-span-2 md:row-span-2 glass-card bg-transparent flex flex-col animate-reveal [animation-delay:500ms]">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quick Navigation</h3>
                        <div className="space-y-1.5">
                            {[
                                { label: "Project Pipeline", count: stats?.totalProjects },
                                { label: "Resource Library", count: stats?.totalResources },
                                { label: "Learning Logs", count: stats?.totalLogs }
                            ].map((item, id) => (
                                <div key={id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-all group cursor-pointer">
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold font-mono text-zinc-600">{item.count}</span>
                                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="md:col-span-2 md:row-span-1 glass-card flex items-center gap-5 animate-reveal [animation-delay:600ms]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">System Status</h4>
                        <p className="text-xs font-bold text-white tracking-tight">All Operations Nominal</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, color }: { title: string, value: number, icon: any, trend: string, color: string }) {
    const colorMap: Record<string, string> = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    };

    return (
        <div className="glass-card p-6 group cursor-default">
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-2.5 rounded-xl border transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/20", colorMap[color])}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-all duration-300" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-bold text-white tracking-tighter group-hover:text-gradient transition-all">{value}</h2>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{trend}</span>
                </div>
            </div>
        </div>
    );
}
