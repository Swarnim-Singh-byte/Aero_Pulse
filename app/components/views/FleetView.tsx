"use client";

import React, { useState } from "react";
import { DroneUnit, FleetSummary } from "../../types/dashboard";

interface FleetViewProps {
  fleet: DroneUnit[];
  fleetSummary: FleetSummary;
  onSelectDroneAndMap: (droneId: string) => void;
}

export default function FleetView({
  fleet,
  fleetSummary,
  onSelectDroneAndMap,
}: FleetViewProps) {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered = fleet.filter(
    (d) => selectedType === "all" || d.type === selectedType
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
            Fleet Operations Inventory
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time avionics, battery cycle health, payload specifications, and firmware status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {["all", "heavy-lift", "vtol-recon", "rapid-quad", "dock-relay"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold uppercase transition border ${
                selectedType === t
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#0c1017]/80 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Total Commissioned Units
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-black text-white">{fleetSummary.totalDrones}</span>
            <span className="font-mono text-xs text-emerald-400 font-bold">100% Operational</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0c1017]/80 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Airborne in Flight
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-black text-emerald-400">
              {fleetSummary.airborneCount}
            </span>
            <span className="font-mono text-xs text-zinc-400">Sorties active</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0c1017]/80 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Docked / Charging
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-black text-zinc-300">
              {fleetSummary.dockedCount}
            </span>
            <span className="font-mono text-xs text-zinc-400">Fast charge</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0c1017]/80 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Attention / Alerts
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-black text-red-400">
              {fleetSummary.warningCount}
            </span>
            <span className="font-mono text-xs text-red-400">Gimbal tension</span>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((drone) => (
          <div
            key={drone.id}
            className="rounded-xl border border-white/10 bg-[#0c0f16]/90 p-4 shadow-xl backdrop-blur-md space-y-3 hover:border-white/20 transition"
          >
            {/* Unit Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-black text-white">{drone.id}</span>
                  <span className="rounded bg-white/10 px-1.5 py-0.2 font-mono text-[10px] text-emerald-300">
                    {drone.callsign}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">{drone.name}</p>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                  drone.status === "airborne"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : drone.status === "warning"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                }`}
              >
                {drone.status}
              </span>
            </div>

            {/* Battery & Health */}
            <div className="rounded-lg border border-white/5 bg-black/40 p-2.5 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">LiPo Battery:</span>
                <span className="font-bold text-white">
                  {drone.batteryPct}% ({drone.batteryVoltage}V)
                </span>
              </div>
              <div className="h-1.5 w-full rounded bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full ${
                    drone.batteryPct > 50
                      ? "bg-emerald-400"
                      : drone.batteryPct > 25
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${drone.batteryPct}%` }}
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
              <div className="rounded bg-white/5 p-2">
                <span className="text-zinc-500 block text-[9px] uppercase">Payload Load</span>
                <span className="font-bold text-white">
                  {drone.payloadKg.toFixed(1)} / {drone.maxPayloadKg} kg
                </span>
              </div>

              <div className="rounded bg-white/5 p-2">
                <span className="text-zinc-500 block text-[9px] uppercase">Speed / Altitude</span>
                <span className="font-bold text-white">
                  {drone.speedKmh} km/h · {drone.altitudeAgl}m
                </span>
              </div>
            </div>

            {/* Current Route */}
            <div className="text-[11px] font-mono text-zinc-400">
              <span className="text-zinc-500 block text-[9px] uppercase">Mission Route:</span>
              <span className="text-zinc-200 truncate block">{drone.routeName}</span>
            </div>

            {/* Action */}
            <button
              onClick={() => onSelectDroneAndMap(drone.id)}
              className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 py-2 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 transition flex items-center justify-center space-x-1.5"
            >
              <span>Track on 3D Live Map</span>
              <span>➔</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
