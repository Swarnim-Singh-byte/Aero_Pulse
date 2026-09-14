"use client";

import React, { useState } from "react";
import { VolumeMetric } from "../../types/dashboard";

interface AnalyticsViewProps {
  volumeMetrics: VolumeMetric;
}

const hourlySorties = [
  { hour: "06:00", count: 4,  tonnage: 82,  wind: 12 },
  { hour: "08:00", count: 7,  tonnage: 165, wind: 18 },
  { hour: "10:00", count: 9,  tonnage: 240, wind: 22 },
  { hour: "12:00", count: 6,  tonnage: 175, wind: 31 },
  { hour: "14:00", count: 11, tonnage: 310, wind: 28 },
  { hour: "16:00", count: 8,  tonnage: 220, wind: 24 },
  { hour: "18:00", count: 3,  tonnage: 92,  wind: 15 },
];

const maxTonnage = Math.max(...hourlySorties.map((h) => h.tonnage));
const SVG_W = 600;
const SVG_H = 120;
const BAR_W = 54;
const GAP = (SVG_W - hourlySorties.length * BAR_W) / (hourlySorties.length + 1);

export default function AnalyticsView({ volumeMetrics }: AnalyticsViewProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const kpis = [
    {
      label: "Total Cargo Transported",
      value: `${volumeMetrics.totalPayloadTodayKg.toLocaleString()}`,
      unit: "KG",
      sub: `+${volumeMetrics.changePct}% vs avg`,
      color: "text-white",
      accent: "text-emerald-400",
      glow: "shadow-emerald-950",
    },
    {
      label: "Completed Sorties",
      value: `${volumeMetrics.todaySortiesCount}`,
      unit: "missions",
      sub: "Avg 22m duration",
      color: "text-white",
      accent: "text-cyan-400",
      glow: "shadow-cyan-950",
    },
    {
      label: "On-Time SLA Delivery",
      value: `${volumeMetrics.successRatePct}%`,
      unit: "",
      sub: "Above 90.0% Target",
      color: "text-emerald-400",
      accent: "text-emerald-400",
      glow: "shadow-emerald-950",
    },
    {
      label: "Carbon Offset Saved",
      value: `${volumeMetrics.carbonOffsetKg}`,
      unit: "kg CO₂",
      sub: "Replaces diesel haulage",
      color: "text-teal-400",
      accent: "text-teal-400",
      glow: "shadow-teal-950",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
            Mission Analytics &amp; Performance KPIs
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Flight velocity metrics, payload tonnage distribution, mountain wind vector impacts, and carbon offsets
          </p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live — UTC Timeline</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/8 bg-[#0c1017]/80 p-4 space-y-1 hover:border-white/15 transition"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {kpi.label}
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className={`font-mono text-3xl font-black ${kpi.color}`}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className={`font-mono text-xs font-bold ${kpi.accent}`}>
                  {kpi.unit}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-mono ${kpi.accent}`}>{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* SVG Bar Chart: Payload Tonnage by Hour */}
      <div className="rounded-2xl border border-white/8 bg-[#0c0f16]/90 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              Payload Tonnage Dispatch by Hour
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
              Wind speed overlay (knots) — hover bars for details
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[10px] font-mono text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-emerald-700 to-emerald-400" />
              <span>Payload (kg)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="h-0.5 w-4 border-t-2 border-dashed border-amber-400/70" />
              <span>Wind (kn)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/30 p-3">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H + 30}`}
            className="w-full"
            style={{ height: "180px" }}
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = SVG_H - (pct / 100) * SVG_H;
              return (
                <g key={pct}>
                  <line
                    x1={0} y1={y} x2={SVG_W} y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                  <text x={2} y={y - 3} fill="rgba(255,255,255,0.25)" fontSize={8} fontFamily="monospace">
                    {Math.round((pct / 100) * maxTonnage)}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {hourlySorties.map((item, idx) => {
              const barH = (item.tonnage / maxTonnage) * SVG_H;
              const x = GAP + idx * (BAR_W + GAP);
              const y = SVG_H - barH;
              const isHovered = hoveredBar === idx;

              return (
                <g key={idx} onMouseEnter={() => setHoveredBar(idx)} onMouseLeave={() => setHoveredBar(null)}>
                  <defs>
                    <linearGradient id={`bar-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isHovered ? "#34d399" : "#10b981"} stopOpacity="1" />
                      <stop offset="100%" stopColor={isHovered ? "#059669" : "#065f46"} stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <rect
                    x={x} y={y} width={BAR_W} height={barH}
                    fill={`url(#bar-grad-${idx})`}
                    rx={3}
                    className="transition-all duration-200"
                    opacity={isHovered ? 1 : 0.85}
                  />
                  {/* Highlight on hover */}
                  {isHovered && (
                    <rect x={x} y={y} width={BAR_W} height={barH} fill="rgba(255,255,255,0.08)" rx={3} />
                  )}
                  {/* Count badge on bar */}
                  <text
                    x={x + BAR_W / 2} y={y - 5}
                    textAnchor="middle"
                    fill={isHovered ? "#ffffff" : "rgba(255,255,255,0.6)"}
                    fontSize={9}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {item.count}↑
                  </text>
                  {/* Hour label */}
                  <text
                    x={x + BAR_W / 2} y={SVG_H + 14}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {item.hour}
                  </text>
                  {/* Tonnage below hour */}
                  <text
                    x={x + BAR_W / 2} y={SVG_H + 25}
                    textAnchor="middle"
                    fill={isHovered ? "#34d399" : "rgba(255,255,255,0.25)"}
                    fontSize={7}
                    fontFamily="monospace"
                  >
                    {item.tonnage}kg
                  </text>
                </g>
              );
            })}

            {/* Wind overlay line */}
            <polyline
              points={hourlySorties
                .map((item, idx) => {
                  const x = GAP + idx * (BAR_W + GAP) + BAR_W / 2;
                  const y = SVG_H - (item.wind / 45) * SVG_H;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeOpacity={0.65}
            />
            {/* Wind dots */}
            {hourlySorties.map((item, idx) => {
              const x = GAP + idx * (BAR_W + GAP) + BAR_W / 2;
              const y = SVG_H - (item.wind / 45) * SVG_H;
              return (
                <circle key={idx} cx={x} cy={y} r={2.5} fill="#fbbf24" opacity={0.8} />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Route Performance Table */}
      <div className="rounded-2xl border border-white/8 bg-[#0c0f16]/90 p-5 shadow-xl">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white mb-4">
          Sector Route Performance Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left">
            <thead>
              <tr className="border-b border-white/8 text-[9px] uppercase tracking-widest text-zinc-500">
                <th className="pb-2 pr-4">Sector</th>
                <th className="pb-2 pr-4 text-right">Sorties</th>
                <th className="pb-2 pr-4 text-right">Avg Delay</th>
                <th className="pb-2 pr-4 text-right">SLA%</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { sector: "Manali ➔ Solang Valley",      count: 14, avgDelay: "-0m 45s", sla: 99.2, ok: true  },
                { sector: "Solang ➔ Dhundi Outpost",     count: 9,  avgDelay: "+3m 40s", sla: 88.1, ok: false },
                { sector: "Atal Tunnel ➔ Kothi Forward", count: 11, avgDelay: "+1m 55s", sla: 91.4, ok: true  },
                { sector: "Rohtang ➔ Gramphu Station",   count: 7,  avgDelay: "+0m 10s", sla: 98.8, ok: true  },
                { sector: "Manali ➔ Kullu Clinic",       count: 7,  avgDelay: "-0m 50s", sla: 100,  ok: true  },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/4 transition">
                  <td className="py-2 pr-4 text-zinc-200 font-medium">{row.sector}</td>
                  <td className="py-2 pr-4 text-right text-zinc-300">{row.count}</td>
                  <td className={`py-2 pr-4 text-right font-bold ${row.ok ? "text-emerald-400" : "text-red-400"}`}>
                    {row.avgDelay}
                  </td>
                  <td className={`py-2 pr-4 text-right font-bold ${row.sla >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                    {row.sla}%
                  </td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${
                      row.ok
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                        : "bg-red-500/15 text-red-400 border-red-500/25"
                    }`}>
                      {row.ok ? "Nominal" : "Monitor"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
