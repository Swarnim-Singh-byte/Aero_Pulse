"use client";

import React, { useState, useEffect } from "react";
import { DashboardTab, OperationalAlert } from "../types/dashboard";

interface NavbarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  alerts: OperationalAlert[];
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onSelectDrone: (id: string) => void;
  show3DTerrain: boolean;
  onToggle3DTerrain: () => void;
  showCorridors: boolean;
  onToggleCorridors: () => void;
  showGeofences: boolean;
  onToggleGeofences: () => void;
}

export default function Navbar({
  currentTab,
  onTabChange,
  alerts,
  onOpenSearch,
  onOpenSettings,
  onSelectDrone,
  show3DTerrain,
  onToggle3DTerrain,
  showCorridors,
  onToggleCorridors,
  showGeofences,
  onToggleGeofences,
}: NavbarProps) {
  const [utcTime, setUtcTime] = useState<string>("");
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);
  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: DashboardTab; label: string; badge?: string }[] = [
    { id: "live-map", label: "Live Map" },
    { id: "fleet", label: "Fleet", badge: "8" },
    { id: "routes", label: "Routes", badge: "5" },
    { id: "analytics", label: "Analytics" },
    { id: "maintenance", label: "Maintenance", badge: "1" },
    { id: "incidents", label: "Incidents" },
    { id: "crew", label: "Crew" },
  ];

  return (
    <header className="relative z-30 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#090b0e]/85 px-4 backdrop-blur-md">
      {/* Brand & Mission Status */}
      <div className="flex items-center space-x-4">
        <div
          onClick={() => onTabChange("live-map")}
          className="flex cursor-pointer items-center space-x-2.5 transition hover:opacity-90"
        >
          {/* Tactical Logo Icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <svg
              className="h-5 w-5 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15 8 22 9 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9 9 8 12 2" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-black tracking-wider text-white">
                AEROPULSE
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-emerald-400 border border-emerald-500/30">
                OPS
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400">
              TACTICAL DRONE COMMAND
            </span>
          </div>
        </div>

        {/* Tactical Telemetry Ribbon */}
        <div className="hidden items-center space-x-2 border-l border-white/10 pl-4 lg:flex">
          <div className="flex items-center space-x-1.5 rounded bg-black/40 px-2 py-1 text-[11px] font-mono text-zinc-300 border border-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
            <span className="text-zinc-400">GNSS:</span>
            <span className="font-semibold text-emerald-400">RTK-FIX</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded bg-black/40 px-2 py-1 text-[11px] font-mono text-zinc-300 border border-white/5">
            <span className="text-zinc-400">MESH:</span>
            <span className="font-semibold text-zinc-200">99.8%</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded bg-black/40 px-2 py-1 text-[11px] font-mono text-zinc-300 border border-white/5">
            <span className="text-zinc-400">SECTOR:</span>
            <span className="font-semibold text-zinc-200">HIMACHAL-01</span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="flex items-center space-x-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-white/10 text-white shadow-inner border border-white/15"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                    isActive
                      ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls, Search & User */}
      <div className="flex items-center space-x-2.5">
        {/* Quick Map Layer Toggles */}
        {currentTab === "live-map" && (
          <div className="hidden items-center space-x-1.5 border-r border-white/10 pr-2.5 xl:flex">
            <button
              onClick={onToggle3DTerrain}
              title="Toggle 3D Terrain Relief Mesh"
              className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-mono font-medium transition ${
                show3DTerrain
                  ? "border border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              <span>3D TERRAIN</span>
            </button>

            <button
              onClick={onToggleCorridors}
              title="Toggle Flight Corridors"
              className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-mono font-medium transition ${
                showCorridors
                  ? "border border-cyan-500/40 bg-cyan-950/30 text-cyan-300"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              <span>CORRIDORS</span>
            </button>

            <button
              onClick={onToggleGeofences}
              title="Toggle Airspace Geofence Zones"
              className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-mono font-medium transition ${
                showGeofences
                  ? "border border-red-500/40 bg-red-950/30 text-red-300"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              <span>NO-FLY</span>
            </button>
          </div>
        )}

        {/* Tactical Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 rounded border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400 hover:border-white/20 hover:text-zinc-200 transition"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="hidden md:inline">Search units, routes...</span>
          <kbd className="hidden rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400 md:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 font-mono text-[9px] font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.7)]">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Popover */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-white/15 bg-[#0e1117]/95 p-3 shadow-2xl backdrop-blur-xl z-50">
              <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Active Dispatches ({alerts.length})
                </span>
                <span className="font-mono text-[10px] text-red-400">
                  {unreadAlerts.length} Unresolved
                </span>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (alert.droneId) onSelectDrone(alert.droneId);
                      setShowAlertsDropdown(false);
                    }}
                    className="cursor-pointer rounded border border-white/5 bg-white/5 p-2 transition hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          alert.severity === "critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : alert.severity === "warning"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-400">{alert.timeAgo}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-zinc-200 line-clamp-1">{alert.title}</p>
                    <p className="text-[10px] text-zinc-400">{alert.affectedSector}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map & Platform Settings */}
        <button
          onClick={onOpenSettings}
          title="Map & Visual Configuration"
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* Live UTC Clock */}
        <div className="hidden rounded border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-400 sm:block">
          {utcTime || "14:32:00 UTC"}
        </div>

        {/* Commander Profile */}
        <div className="flex items-center space-x-2 rounded border border-white/10 bg-white/5 px-2 py-1">
          <div className="relative flex h-7 w-7 items-center justify-center rounded bg-zinc-800 font-mono text-xs font-bold text-zinc-200 border border-white/10">
            VS
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0a0a0a]" />
          </div>
          <div className="hidden flex-col text-left xl:flex">
            <span className="text-[11px] font-semibold text-zinc-200">Cmdr. V. Sharma</span>
            <span className="text-[9px] font-mono tracking-wider text-emerald-400">MISSION CONTROLLER</span>
          </div>
        </div>
      </div>
    </header>
  );
}
