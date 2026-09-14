"use client";

import React, { useState } from "react";
import { OperationalAlert } from "../types/dashboard";

interface RightSidebarProps {
  alerts: OperationalAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onSelectDrone: (droneId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function RightSidebar({
  alerts,
  onAcknowledgeAlert,
  onSelectDrone,
  collapsed,
  onToggleCollapse,
}: RightSidebarProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) return false;
    if (filterCategory !== "all" && alert.category !== filterCategory) return false;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const advisoryCount = alerts.filter((a) => a.severity === "advisory").length;

  return (
    <aside
      className={`relative z-20 flex flex-col border-l border-white/10 bg-[#0a0c10]/80 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-14" : "w-80 sm:w-96"
      } h-[calc(100vh-3.5rem)]`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        title={collapsed ? "Expand Warnings Sidebar" : "Collapse Warnings Sidebar"}
        className="absolute -left-3.5 top-5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#12161f] text-zinc-300 shadow-lg hover:border-red-400 hover:text-white transition"
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            collapsed ? "" : "rotate-180"
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
            <span className="font-mono text-xs font-bold text-red-400 animate-pulse">{criticalCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Crit</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="font-mono text-xs font-bold text-amber-400">{warningCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Warn</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-center">
            <span className="font-mono text-xs font-bold text-cyan-400">{advisoryCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400">Adv</span>
          </div>
          <div className="w-8 border-t border-white/10" />
          <div className="flex flex-col items-center space-y-2">
            <span className="rotate-90 font-mono text-[10px] tracking-widest text-zinc-400">
              WARNINGS
            </span>
          </div>
        </div>
      ) : (
        // Full Expanded View
        <div className="flex h-full flex-col overflow-hidden">
          {/* Section 1: Header & Counts */}
          <div className="border-b border-white/10 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                  Warnings & Hazards
                </h2>
              </div>
              <span className="font-mono text-[11px] font-bold text-red-400">
                {alerts.length} Active
              </span>
            </div>

            {/* Filter Severity Pills */}
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setFilterSeverity("all")}
                className={`rounded py-1 text-center font-mono text-[10px] font-bold transition border ${
                  filterSeverity === "all"
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilterSeverity("critical")}
                className={`rounded py-1 text-center font-mono text-[10px] font-bold transition border ${
                  filterSeverity === "critical"
                    ? "border-red-500/50 bg-red-950/40 text-red-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:text-red-300"
                }`}
              >
                Crit ({criticalCount})
              </button>
              <button
                onClick={() => setFilterSeverity("warning")}
                className={`rounded py-1 text-center font-mono text-[10px] font-bold transition border ${
                  filterSeverity === "warning"
                    ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:text-amber-300"
                }`}
              >
                Warn ({warningCount})
              </button>
              <button
                onClick={() => setFilterSeverity("advisory")}
                className={`rounded py-1 text-center font-mono text-[10px] font-bold transition border ${
                  filterSeverity === "advisory"
                    ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300"
                    : "border-white/5 bg-white/5 text-zinc-400 hover:text-cyan-300"
                }`}
              >
                Adv ({advisoryCount})
              </button>
            </div>

            {/* Category Quick Tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {["all", "capacity", "schedule", "geofence", "weather"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider transition ${
                    filterCategory === cat
                      ? "bg-white/20 text-white font-bold"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Alert List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredAlerts.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-zinc-500">No active alerts match filter</span>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === "critical";
                const isWarning = alert.severity === "warning";

                return (
                  <div
                    key={alert.id}
                    className={`group relative rounded-lg border p-3 transition-all ${
                      isCritical
                        ? "border-red-500/40 bg-red-950/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                        : isWarning
                        ? "border-amber-500/30 bg-amber-950/15"
                        : "border-cyan-500/20 bg-cyan-950/10"
                    }`}
                  >
                    {/* Header: ID, Severity Badge, Timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-black uppercase tracking-wider ${
                            isCritical
                              ? "bg-red-500/30 text-red-300 border border-red-500/50 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                              : isWarning
                              ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                              : "bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">{alert.id}</span>
                      </div>

                      <div className="text-right font-mono text-[10px] text-zinc-400">
                        <span>{alert.timestamp}</span>
                        <span className="ml-1.5 text-zinc-500">({alert.timeAgo})</span>
                      </div>
                    </div>

                    {/* Alert Title */}
                    <h3 className="mt-1.5 text-xs font-bold text-zinc-100 leading-snug">
                      {alert.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">
                      {alert.description}
                    </p>

                    {/* Affected Location Breakdown */}
                    <div className="mt-2.5 rounded bg-black/40 p-2 space-y-1 text-[10px] font-mono border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">AFFECTED SECTOR:</span>
                        <span className="text-zinc-200 font-semibold">{alert.affectedSector}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">LOCATION:</span>
                        <span className="text-zinc-200 truncate max-w-[170px]">
                          {alert.affectedLocation}
                        </span>
                      </div>
                      {alert.droneId && (
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-zinc-400">TARGET DRONE:</span>
                          <button
                            onClick={() => onSelectDrone(alert.droneId!)}
                            className="font-bold text-emerald-400 hover:underline flex items-center space-x-1"
                          >
                            <span>{alert.droneId}</span>
                            <span className="text-[9px]">➔ Focus</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[9px] font-mono uppercase text-zinc-400">
                        Category: {alert.category}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className={`rounded px-2 py-0.8 text-[10px] font-mono font-semibold transition ${
                            alert.acknowledged
                              ? "bg-zinc-800 text-zinc-400 cursor-default"
                              : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
