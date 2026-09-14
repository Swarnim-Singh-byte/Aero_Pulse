"use client";

import React, { useState } from "react";
import { RouteSchedule, VolumeMetric } from "../types/dashboard";

interface BottomPanelsProps {
  scheduleOffsets: RouteSchedule[];
  volumeMetrics: VolumeMetric;
  onSelectDrone: (droneId: string) => void;
  onSelectRoute: (routeId: string) => void;
}

export default function BottomPanels({
  scheduleOffsets,
  volumeMetrics,
  onSelectDrone,
  onSelectRoute,
}: BottomPanelsProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Sparkline coordinates for Live Volume widget
  const svgW = 120;
  const svgH = 34;
  const data = volumeMetrics.sparklineHours;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const sparklinePoints = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * svgW;
      const y = svgH - ((val - minVal) / range) * (svgH - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="pointer-events-auto absolute bottom-3 left-4 right-4 z-20 transition-all duration-300">
      {/* Toggle Bar */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-[#0e1218]/90 px-3 py-0.5 text-[10px] font-mono text-zinc-400 backdrop-blur-md hover:border-white/25 hover:text-white transition shadow-lg"
        >
          <span>{collapsed ? "▲ Expand Telemetry Gauges" : "▼ Minimize Bottom Panels"}</span>
        </button>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Panel 1: Schedule Offset Widget (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#0a0d13]/85 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                  Schedule Offset & Route Timetable
                </h3>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">
                5 Corridors Active
              </span>
            </div>

            {/* Table of Routes */}
            <div className="mt-2 max-h-36 overflow-y-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-400">
                    <th className="pb-1">Route Code</th>
                    <th className="pb-1">Drone</th>
                    <th className="pb-1">Waypoints / Path</th>
                    <th className="pb-1 text-center">Sched / Live ETA</th>
                    <th className="pb-1 text-center">Variance</th>
                    <th className="pb-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scheduleOffsets.map((route) => {
                    const isDelay = route.varianceSeconds > 0;
                    const isAhead = route.varianceSeconds < 0;

                    return (
                      <tr
                        key={route.id}
                        className="group hover:bg-white/5 transition cursor-pointer"
                        onClick={() => {
                          onSelectDrone(route.droneId);
                          onSelectRoute(route.routeCode);
                        }}
                      >
                        <td className="py-1.5 font-bold text-white group-hover:text-emerald-400">
                          {route.routeCode}
                        </td>
                        <td className="py-1.5 text-zinc-300">
                          <span className="rounded bg-white/5 px-1 py-0.5 text-[10px] border border-white/5">
                            {route.droneId}
                          </span>
                        </td>
                        <td className="py-1.5 text-zinc-300 truncate max-w-[200px]">
                          {route.origin} ➔ {route.destination}
                        </td>
                        <td className="py-1.5 text-center text-zinc-300">
                          <span className="text-zinc-400">{route.scheduledEta}</span>
                          <span className="mx-1 text-zinc-600">/</span>
                          <span className="font-bold text-white">{route.estimatedEta}</span>
                        </td>
                        <td className="py-1.5 text-center">
                          <span
                            className={`inline-flex rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                              isDelay
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : isAhead
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30"
                            }`}
                          >
                            {route.varianceText}
                          </span>
                        </td>
                        <td className="py-1.5 text-right">
                          <span className="text-[10px] text-zinc-300 font-medium">
                            {route.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel 2: Live Volume Widget */}
          <div className="rounded-xl border border-white/10 bg-[#0a0d13]/85 p-3 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                    Live Volume
                  </h3>
                </div>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <span>▲</span>
                  <span>+{volumeMetrics.changePct}% vs yday</span>
                </span>
              </div>

              {/* Large Current Number and Trend Sparkline */}
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    CUMULATIVE PAYLOAD DELIVERED
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-mono text-2xl font-black text-white tracking-tight">
                      {volumeMetrics.totalPayloadTodayKg.toLocaleString()}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">KG</span>
                  </div>
                </div>

                {/* SVG Trend Sparkline */}
                <div className="h-9 w-32 rounded bg-black/40 p-1 border border-white/5">
                  <svg className="h-full w-full" viewBox={`0 0 ${svgW} ${svgH}`}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points={`0,${svgH} ${sparklinePoints} ${svgW},${svgH}`}
                      fill="url(#volGrad)"
                    />
                    <polyline
                      points={sparklinePoints}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={svgW}
                      cy={svgH - ((data[data.length - 1] - minVal) / range) * (svgH - 8) - 4}
                      r="3"
                      fill="#10b981"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sub-Metrics Ribbon */}
            <div className="mt-3 grid grid-cols-3 gap-1 rounded bg-black/40 p-1.5 text-center font-mono text-[10px] border border-white/5">
              <div>
                <span className="text-[8px] uppercase text-zinc-400">Sorties</span>
                <p className="font-bold text-white text-xs">{volumeMetrics.todaySortiesCount}</p>
              </div>
              <div>
                <span className="text-[8px] uppercase text-zinc-400">SLA Rate</span>
                <p className="font-bold text-emerald-400 text-xs">
                  {volumeMetrics.successRatePct}%
                </p>
              </div>
              <div>
                <span className="text-[8px] uppercase text-zinc-400">CO₂ Offset</span>
                <p className="font-bold text-teal-300 text-xs">
                  {volumeMetrics.carbonOffsetKg} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
