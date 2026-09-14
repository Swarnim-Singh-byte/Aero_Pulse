"use client";

import React from "react";

export default function IncidentsView() {
  const incidents = [
    {
      id: "INC-2026-088",
      date: "Today 14:18 UTC",
      severity: "LEVEL 2",
      title: "Geofence Exclusion Buffer Penetration — Sector 7",
      droneId: "AP-926",
      resolution: "Autonomous flight controller initiated 15-degree bank maneuver to re-enter safe civilian corridor. Air Traffic Control notified.",
      status: "Closed",
    },
    {
      id: "INC-2026-087",
      date: "Yesterday 09:42 UTC",
      severity: "LEVEL 3",
      title: "Sudden Mountain Downdraft (-12 m/s) in Rohtang Pass",
      droneId: "AP-804",
      resolution: "Turbine throttle automatically boosted to 94% motor RPM. Altitude stabilized within 8 seconds without cargo shifting.",
      status: "Investigated",
    },
    {
      id: "INC-2026-086",
      date: "Sep 12, 16:30 UTC",
      severity: "LEVEL 1",
      title: "Secondary RF Link Packet Loss (2.4GHz backup failover)",
      droneId: "AP-512",
      resolution: "SATCOM transponder switched to Iridium mesh channel with zero interruption to waypoint guidance.",
      status: "Resolved",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
          Incident Black-Box & Safety Audit
        </h1>
        <p className="text-xs text-zinc-400">
          Official DGCA / Smart India Hackathon flight incident logs, flight termination records, and telemetry replay archives
        </p>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="rounded-xl border border-white/10 bg-[#0c0f16]/90 p-5 shadow-xl backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-red-400">{inc.id}</span>
                <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-red-300 border border-red-500/30">
                  {inc.severity}
                </span>
                <span className="text-zinc-400 font-mono text-xs">Drone: {inc.droneId}</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">{inc.date}</span>
            </div>

            <h3 className="text-sm font-bold text-zinc-100">{inc.title}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-black/40 p-3 rounded border border-white/5">
              {inc.resolution}
            </p>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
              <span className="text-emerald-400 font-bold">Status: {inc.status}</span>
              <button className="text-zinc-400 hover:text-white transition">
                Download Black-Box Telemetry CSV ➔
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
