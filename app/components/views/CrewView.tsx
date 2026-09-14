"use client";

import React from "react";

export default function CrewView() {
  const crewMembers = [
    {
      name: "Cmdr. Vikram Sharma",
      callsign: "FALCON-LEAD",
      role: "Mission Commander & Senior Remote Pilot",
      status: "ON DUTY — COMMAND SEAT",
      certs: "DGCA RPC #9942-UAV · BVLOS Certified",
      sortiesLogged: 428,
      hours: "1,240 hrs",
    },
    {
      name: "Lt. Ananya Deshmukh",
      callsign: "RADAR-EYE",
      role: "Airspace Dispatch & UTM Controller",
      status: "ON DUTY — CONSOLE 2",
      certs: "ICAO ATC Rating · UTM Fleet Orchestrator",
      sortiesLogged: 612,
      hours: "1,890 hrs",
    },
    {
      name: "Devendra Patel",
      callsign: "VOLT-MASTER",
      role: "Avionics & Telemetry Systems Specialist",
      status: "ACTIVE TELEMETRY",
      certs: "FAA Part 107 · Lithium High-Voltage Spec",
      sortiesLogged: 340,
      hours: "980 hrs",
    },
    {
      name: "Sunita Rawat",
      callsign: "RESCUE-LEAD",
      role: "Mountain Logistics & Dropzone Coordinator",
      status: "FORWARD BASE SOLANG",
      certs: "High-Altitude Mountain Rescue · First Aid Lead",
      sortiesLogged: 295,
      hours: "740 hrs",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-mono text-xl font-black uppercase tracking-wider text-white">
          Tactical Operations Crew & Pilot Dispatch
        </h1>
        <p className="text-xs text-zinc-400">
          Certified BVLOS UAV pilots, UTM controllers, field logistics recovery leads, and avionics engineers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crewMembers.map((member, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-[#0c0f16]/90 p-5 shadow-xl backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 font-mono text-sm font-bold text-white">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{member.name}</h3>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                    {member.callsign}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                {member.status}
              </span>
            </div>

            <div className="font-mono text-xs text-zinc-300 space-y-1">
              <p className="text-zinc-400">{member.role}</p>
              <p className="text-[11px] text-zinc-500">{member.certs}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-white/5">
              <div className="rounded bg-black/40 p-2">
                <span className="text-zinc-500 block text-[9px] uppercase">Sorties Piloted</span>
                <span className="font-bold text-white">{member.sortiesLogged}</span>
              </div>
              <div className="rounded bg-black/40 p-2">
                <span className="text-zinc-500 block text-[9px] uppercase">Flight Hours</span>
                <span className="font-bold text-emerald-400">{member.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
