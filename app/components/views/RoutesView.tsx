"use client";

import React from "react";
import { RouteSchedule } from "../../types/dashboard";

interface RoutesViewProps {
  routes: RouteSchedule[];
  onSelectRouteAndMap: (routeCode: string, droneId: string) => void;
}

export default function RoutesView({
  routes,
  onSelectRouteAndMap,
}: RoutesViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
          Active Airspace Flight Corridors
        </h1>
        <p className="text-xs text-zinc-400">
          Designated low-altitude UAV highway corridors, mountain pass clearances, and waypoint elevation charts
        </p>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="rounded-xl border border-white/10 bg-[#0c0f16]/90 p-5 shadow-xl backdrop-blur-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-base font-black text-cyan-400">
                  {route.routeCode}
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white">
                  {route.droneId} ({route.droneName})
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {route.status}
                </span>
              </div>

              <div className="font-mono text-xs text-zinc-300">
                <span>Sched ETA: {route.scheduledEta}</span>
                <span className="mx-2 text-zinc-600">|</span>
                <span className="text-emerald-400 font-bold">Est: {route.estimatedEta}</span>
              </div>
            </div>

            {/* Path description & distance */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-zinc-300">
                <span className="font-bold text-white">{route.origin}</span>
                <span className="text-emerald-400">━━━━━━━━➔</span>
                <span className="font-bold text-white">{route.destination}</span>
              </div>
              <span className="text-zinc-400">{route.distanceKm} km Corridor</span>
            </div>

            {/* Waypoint Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                <span>SORTIE PROGRESSION</span>
                <span className="font-bold text-emerald-400">{route.progressPct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                  style={{ width: `${route.progressPct}%` }}
                />
              </div>
            </div>

            {/* Waypoint coordinates list */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
              <span className="text-zinc-500 uppercase">Waypoints:</span>
              {route.coordinates.map((coord, idx) => (
                <span
                  key={idx}
                  className="rounded bg-black/40 px-2 py-0.5 text-zinc-300 border border-white/5"
                >
                  WP-{idx + 1}: [{coord[0].toFixed(3)}, {coord[1].toFixed(3)}]
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => onSelectRouteAndMap(route.routeCode, route.droneId)}
              className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-4 py-2 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 transition"
            >
              Visualize Corridor on 3D Relief Map ➔
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
