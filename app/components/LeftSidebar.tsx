"use client";

import React, { useState } from "react";
import { DroneUnit, FleetSummary } from "../types/dashboard";
import { OPERATIONAL_EFFICIENCY_DATA, EFFICIENCY_TARGET_THRESHOLD, CURRENT_EFFICIENCY } from "../data/mockDroneData";

interface LeftSidebarProps {
  fleet: DroneUnit[];
  fleetSummary: FleetSummary;
  selectedDroneId: string | null;
  onSelectDrone: (droneId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function LeftSidebar({
  fleet,
  fleetSummary,
  selectedDroneId,
  onSelectDrone,
  collapsed,
  onToggleCollapse,
}: LeftSidebarProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredFleet = fleet.filter((unit) => {
    if (filterType !== "all" && unit.type !== filterType) return false;
    if (searchFilter.trim() !== "") {
      const q = searchFilter.toLowerCase();
      return (
        unit.id.toLowerCase().includes(q) ||
        unit.name.toLowerCase().includes(q) ||
        unit.callsign.toLowerCase().includes(q) ||
        unit.payloadType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate coordinates for the mini SVG Operational Efficiency Chart
  const svgWidth = 260;
  const svgHeight = 65;
  const minVal = 88;
  const maxVal = 98;
  const range = maxVal - minVal;

  const points = OPERATIONAL_EFFICIENCY_DATA.map((d, i) => {
    const x = (i / (OPERATIONAL_EFFICIENCY_DATA.length - 1)) * svgWidth;
    const y = svgHeight - ((d.value - minVal) / range) * (svgHeight - 12) - 6;
    return `${x},${y}`;
  }).join(" ");

  const targetY = svgHeight - ((EFFICIENCY_TARGET_THRESHOLD - minVal) / range) * (svgHeight - 12) - 6;

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-white/10 bg-[#0a0c10]/80 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-14" : "w-80 sm:w-96"
      } h-[calc(100vh-3.5rem)]`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        title={collapsed ? "Expand Fleet Sidebar" : "Collapse Fleet Sidebar"}
        className="absolute -right-3.5 top-5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#12161f] text-zinc-300 shadow-lg hover:border-emerald-400 hover:text-white transition"
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {collapsed ? (
        // Collapsed Slim View
        <div className="flex h-full flex-col items-center py-4 space-y-6">
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="font-mono text-xs font-bold text-emerald-400">{fleetSummary.airborneCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Air</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="font-mono text-xs font-bold text-zinc-300">{fleetSummary.dockedCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Dock</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="font-mono text-xs font-bold text-red-400">{fleetSummary.warningCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Warn</span>
          </div>
          <div className="w-8 border-t border-white/10" />
          <div className="flex flex-col items-center space-y-3">
            {fleet.slice(0, 6).map((unit) => (
              <button
                key={unit.id}
                onClick={() => onSelectDrone(unit.id)}
                title={`${unit.id} - ${unit.callsign}`}
                className={`flex h-8 w-8 items-center justify-center rounded font-mono text-[10px] font-bold border transition ${
                  selectedDroneId === unit.id
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                {unit.id.replace("AP-", "")}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Full Expanded View
        <div className="flex h-full flex-col overflow-hidden">
          {/* Section 1: Fleet Header & Status Indicators */}
          <div className="border-b border-white/10 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                  Fleet Status
                </h2>
                <p className="text-[10px] text-zinc-400">
                  Tactical UAV Grid · Northern Himalayan Sector
                </p>
              </div>
              <div className="flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="font-mono text-[10px] font-semibold text-emerald-400">
                  {fleetSummary.airborneCount} ACTIVE
                </span>
              </div>
            </div>

            {/* Fleet Counts by Drone Type */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setFilterType(filterType === "heavy-lift" ? "all" : "heavy-lift")}
                className={`flex flex-col items-center rounded border p-1.5 transition ${
                  filterType === "heavy-lift"
                    ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-base font-extrabold text-white">
                  {fleetSummary.byType.heavyLift}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Heavy Cargo</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === "vtol-recon" ? "all" : "vtol-recon")}
                className={`flex flex-col items-center rounded border p-1.5 transition ${
                  filterType === "vtol-recon"
                    ? "border-cyan-500/50 bg-cyan-950/30 text-cyan-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-base font-extrabold text-white">
                  {fleetSummary.byType.vtolRecon}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">VTOL Recon</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === "rapid-quad" ? "all" : "rapid-quad")}
                className={`flex flex-col items-center rounded border p-1.5 transition ${
                  filterType === "rapid-quad"
                    ? "border-purple-500/50 bg-purple-950/30 text-purple-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-base font-extrabold text-white">
                  {fleetSummary.byType.rapidQuad}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Rapid Quad</span>
              </button>

              <button
                onClick={() => setFilterType(filterType === "dock-relay" ? "all" : "dock-relay")}
                className={`flex flex-col items-center rounded border p-1.5 transition ${
                  filterType === "dock-relay"
                    ? "border-amber-500/50 bg-amber-950/30 text-amber-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                <span className="font-mono text-base font-extrabold text-white">
                  {fleetSummary.byType.dockRelay}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-400">Hub Relay</span>
              </button>
            </div>

            {/* Online / Standby / Warning Ribbon */}
            <div className="flex items-center justify-between rounded bg-black/40 px-2.5 py-1.5 text-[11px] font-mono border border-white/5">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span className="text-zinc-400">Airborne:</span>
                <span className="font-bold text-zinc-100">{fleetSummary.airborneCount}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <span className="text-zinc-400">Docked:</span>
                <span className="font-bold text-zinc-100">{fleetSummary.dockedCount}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] animate-pulse" />
                <span className="text-zinc-400">Alerts:</span>
                <span className="font-bold text-red-400">{fleetSummary.warningCount}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Operational Efficiency Mini Line Chart */}
          <div className="border-b border-white/10 p-3.5 bg-black/25">
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Operational Efficiency
                </span>
                <span className="rounded bg-emerald-500/20 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-400">
                  +{((CURRENT_EFFICIENCY - EFFICIENCY_TARGET_THRESHOLD)).toFixed(1)}% vs SLA
                </span>
              </div>
              <span className="font-mono text-base font-black text-emerald-400">
                {CURRENT_EFFICIENCY}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-mono">
              <span>24-Hour Sortie SLA</span>
              <span className="text-amber-400/80">Target: {EFFICIENCY_TARGET_THRESHOLD}%</span>
            </div>

            {/* SVG Mini Chart with Threshold Line */}
            <div className="relative h-16 w-full rounded border border-white/5 bg-black/40 p-1">
              <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                <defs>
                  <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Target Threshold Line */}
                <line
                  x1="0"
                  y1={targetY}
                  x2={svgWidth}
                  y2={targetY}
                  stroke="#eab308"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  strokeOpacity="0.75"
                />

                {/* Fill Area */}
                <polygon
                  points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
                  fill="url(#effGradient)"
                />

                {/* Line Path */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Current Dot */}
                <circle
                  cx={svgWidth}
                  cy={svgHeight - ((CURRENT_EFFICIENCY - minVal) / range) * (svgHeight - 12) - 6}
                  r="3.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Section 3: Filter & Search Bar */}
          <div className="p-2.5 border-b border-white/10 flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Filter units..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-2 top-1.5 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            {filterType !== "all" && (
              <button
                onClick={() => setFilterType("all")}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          {/* Section 4: Scrollable List of Individual Unit Cards */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filteredFleet.map((unit) => {
              const isSelected = selectedDroneId === unit.id;
              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectDrone(unit.id)}
                  className={`group relative cursor-pointer rounded-lg border p-2.5 transition-all ${
                    isSelected
                      ? "border-emerald-400/80 bg-[#141a24]/90 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                      : "border-white/10 bg-[#0e1117]/60 hover:border-white/20 hover:bg-[#141720]/80"
                  }`}
                >
                  {/* Tactical Corner Accent on Selected */}
                  {isSelected && (
                    <>
                      <span className="absolute -top-[1px] -left-[1px] h-2 w-2 border-t-2 border-l-2 border-emerald-400" />
                      <span className="absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b-2 border-r-2 border-emerald-400" />
                    </>
                  )}

                  {/* Card Header: Unit ID, Callsign, Online/Offline Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black tracking-wider text-white">
                        {unit.id}
                      </span>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400 border border-white/5">
                        {unit.callsign}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-[10px] text-zinc-400">{unit.lastActive}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                          unit.status === "airborne"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : unit.status === "warning"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                            : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                        }`}
                      >
                        {unit.status === "airborne" && (
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                        )}
                        {unit.status}
                      </span>
                    </div>
                  </div>

                  {/* Unit Model & Route */}
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-medium truncate max-w-[170px]">
                      {unit.name}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {unit.speedKmh > 0 ? `${unit.speedKmh} km/h` : "DOCKED"}
                    </span>
                  </div>

                  {/* Mini Telemetry Grid */}
                  <div className="mt-2 grid grid-cols-3 gap-1 rounded bg-black/40 p-1.5 text-[10px] font-mono border border-white/5">
                    <div>
                      <span className="text-zinc-400">BATTERY</span>
                      <div className="flex items-center space-x-1">
                        <span
                          className={`font-bold ${
                            unit.batteryPct > 50
                              ? "text-emerald-400"
                              : unit.batteryPct > 25
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {unit.batteryPct}%
                        </span>
                        <div className="h-1.5 w-7 rounded bg-zinc-700 overflow-hidden">
                          <div
                            className={`h-full ${
                              unit.batteryPct > 50
                                ? "bg-emerald-400"
                                : unit.batteryPct > 25
                                ? "bg-amber-400"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${unit.batteryPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-400">ALT (AGL)</span>
                      <p className="font-bold text-zinc-200">{unit.altitudeAgl}m</p>
                    </div>

                    <div>
                      <span className="text-zinc-400">PAYLOAD</span>
                      <p className="font-bold text-zinc-200">
                        {unit.payloadKg.toFixed(1)}/{unit.maxPayloadKg}kg
                      </p>
                    </div>
                  </div>

                  {/* Mini Route Sparkline & Corridor Tag */}
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[9px] font-mono text-zinc-400 truncate max-w-[160px]">
                      {unit.routeName}
                    </span>

                    {/* SVG Sparkline */}
                    <div className="h-4 w-18">
                      <svg className="h-full w-full" viewBox="0 0 60 16">
                        <polyline
                          points={unit.sparklineData
                            .map((val, idx) => {
                              const x = (idx / (unit.sparklineData.length - 1)) * 60;
                              const y = 14 - (val / 120) * 12;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke={unit.status === "warning" ? "#ef4444" : "#10b981"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
