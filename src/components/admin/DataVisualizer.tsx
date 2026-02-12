"use client";

import { motion } from "framer-motion";

interface ChartProps {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
}

export function AreaChartCustom({ data, height = 200, color = "#3b82f6" }: ChartProps) {
    if (!data.length) return null;

    const max = Math.max(...data.map(d => d.value), 1);
    const stepX = 100 / (data.length - 1);

    // Path calculation
    const points = data.map((d, i) => `${i * stepX},${100 - (d.value / max * 100)}`).join(" ");
    const areaPath = `0,100 ${points} 100,100`;

    return (
        <div style={{ height }} className="w-full relative px-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Area Gradient */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area */}
                <motion.polyline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    points={areaPath}
                    fill="url(#chartGradient)"
                    stroke="none"
                />

                {/* Line */}
                <motion.polyline
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Data Points */}
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={i * stepX}
                        cy={100 - (d.value / max * 100)}
                        r="0.5"
                        fill="white"
                        stroke={color}
                        strokeWidth="0.5"
                    />
                ))}
            </svg>

            {/* Labels */}
            <div className="flex justify-between mt-4">
                {data.map((d, i) => (
                    <span key={i} className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function BarChartCustom({ data, height = 200, color = "#3b82f6" }: ChartProps) {
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <div style={{ height }} className="w-full flex items-end justify-between gap-1 px-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / max) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        style={{ backgroundColor: color }}
                        className="w-full rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative"
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md z-10">
                            {d.value}
                        </div>
                    </motion.div>
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter truncate w-full text-center">
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
