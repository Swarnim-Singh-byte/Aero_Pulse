"use client";

import React, { useState, useEffect } from "react";
import { DroneUnit, RouteSchedule, OperationalAlert } from "../types/dashboard";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  drones: DroneUnit[];
  routes: RouteSchedule[];
  alerts: OperationalAlert[];
  onSelectDrone: (id: string) => void;
  onSelectRoute: (code: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  drones,
  routes,
  alerts,
  onSelectDrone,
  onSelectRoute,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Handled by parent or toggled
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingDrones = drones.filter(
    (d) =>
      d.id.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.callsign.toLowerCase().includes(q) ||
      d.payloadType.toLowerCase().includes(q)
  );

  const matchingRoutes = routes.filter(
    (r) =>
      r.routeCode.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
  );

  const matchingAlerts = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.affectedLocation.toLowerCase().includes(q) ||
      a.affectedSector.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 pt-20 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0e1117] shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center border-b border-white/10 px-4 py-3">
          <svg className="h-5 w-5 text-zinc-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search tactical units, flight paths, alert zones, or manifests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto p-4 space-y-4 font-mono">
          {/* Drone Units */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Drone Units ({matchingDrones.length})
            </div>
            <div className="space-y-1">
              {matchingDrones.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDrone(d.id);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2 hover:border-emerald-400/50 hover:bg-emerald-950/20 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{d.id}</span>
                    <span className="text-zinc-400 text-xs">· {d.callsign}</span>
                    <span className="text-[10px] text-zinc-500">{d.typeName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="text-emerald-400">{d.status}</span>
                    <span className="text-zinc-400">{d.speedKmh} km/h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Routes */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Flight Corridors ({matchingRoutes.length})
            </div>
            <div className="space-y-1">
              {matchingRoutes.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRoute(r.routeCode);
                    onSelectDrone(r.droneId);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2 hover:border-cyan-400/50 hover:bg-cyan-950/20 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-300 text-xs">{r.routeCode}</span>
                    <span className="text-zinc-300 text-xs truncate max-w-[240px]">
                      {r.origin} ➔ {r.destination}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{r.estimatedEta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Active Warnings ({matchingAlerts.length})
            </div>
            <div className="space-y-1">
              {matchingAlerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    if (a.droneId) onSelectDrone(a.droneId);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2 hover:border-red-400/50 hover:bg-red-950/20 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="rounded px-1 text-[9px] font-bold uppercase bg-red-500/20 text-red-400">
                      {a.severity}
                    </span>
                    <span className="text-xs text-zinc-200 font-medium truncate max-w-[280px]">
                      {a.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{a.affectedSector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
