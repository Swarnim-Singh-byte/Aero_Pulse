"use client";

import React from "react";

export default function MaintenanceView() {
  const maintenanceLogs = [
    {
      unitId: "AP-309",
      task: "Gimbal Tension Re-calibration & Bushing Lubrication",
      urgency: "HIGH",
      assignedTech: "Eng. R. Nair",
      scheduledDate: "Today 16:00 UTC",
      status: "In Progress",
    },
    {
      unitId: "AP-418",
      task: "Rotor Blade 100-Hour Micro-Crack Ultrasonic Scan",
      urgency: "ROUTINE",
      assignedTech: "Lead Tech S. Verma",
      scheduledDate: "Tomorrow 08:00 UTC",
      status: "Queued",
    },
    {
      unitId: "AP-612",
      task: "LiPo Pack Internal Resistance & Cell Balancing Check",
      urgency: "NOMINAL",
      assignedTech: "Avionics Specialist K. Sen",
      scheduledDate: "Tomorrow 11:30 UTC",
      status: "Queued",
    },
    {
      unitId: "NEST-BAY-04",
      task: "Automated Robotic Docking Pad Inductive Coil Cleaning",
      urgency: "ROUTINE",
      assignedTech: "Station Crew Beta",
      scheduledDate: "Sep 15, 04:00 UTC",
      status: "Scheduled",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
          Fleet Maintenance & Airworthiness Logs
        </h1>
        <p className="text-xs text-zinc-400">
          Component wear diagnostics, motor vibration telemetry, ultrasonic rotor checks, and battery cell health
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maintenanceLogs.map((log, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-[#0c0f16]/90 p-4 shadow-xl backdrop-blur-md space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-black text-white">{log.unitId}</span>
              <span
                className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold ${
                  log.urgency === "HIGH"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {log.urgency}
              </span>
            </div>

            <h3 className="text-xs font-bold text-zinc-200">{log.task}</h3>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/5">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Technician</span>
                <span className="text-zinc-200">{log.assignedTech}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase">Schedule</span>
                <span className="text-zinc-200">{log.scheduledDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
