"use client";

import React, { useState } from "react";
import { DroneUnit } from "../types/dashboard";

interface PayloadCardProps {
  drone: DroneUnit | null;
  onClose: () => void;
  onRth: (droneId: string) => void;
  onHold: (droneId: string) => void;
  onDivert: (droneId: string) => void;
}

function formatEta(s: number): string {
  if (s <= 0) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function PayloadCard({
  drone,
  onClose,
  onRth,
  onHold,
  onDivert,
}: PayloadCardProps) {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [showManifest, setShowManifest] = useState<boolean>(false);

  if (!drone) return null;

  const payloadPct = drone.maxPayloadKg > 0
    ? Math.round((drone.payloadKg / drone.maxPayloadKg) * 100)
    : 0;

  const batteryColor =
    drone.batteryPct > 50 ? "text-emerald-400" : drone.batteryPct > 25 ? "text-amber-400" : "text-red-400";
  const batteryBarColor =
    drone.batteryPct > 50 ? "from-emerald-500 to-teal-400" : drone.batteryPct > 25 ? "from-amber-500 to-yellow-400" : "from-red-600 to-red-400";

  const isWarning = drone.status === "warning";

  return (
    /* Position: bottom-center of map area, elevated over bottom panels */
    <div className="pointer-events-auto absolute bottom-[13rem] left-1/2 -translate-x-1/2 z-30 w-[26rem] animate-fade-in-up">
      <div
        className={`rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
          isWarning
            ? "border-red-500/40 bg-[#100a0a]/90 shadow-red-950/50"
            : "border-emerald-500/20 bg-[#090d13]/90"
        }`}
      >
        {/* ── Top Bar ──────────────────────────────────────── */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b ${
            isWarning ? "border-red-500/20 bg-red-950/20" : "border-white/8 bg-black/30"
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {/* Status dot */}
            <span
              className={`relative flex h-2.5 w-2.5 rounded-full ${
                isWarning ? "bg-red-500 animate-red-alert" : "bg-emerald-400 animate-glow-pulse"
              }`}
            />
            <span className="font-mono text-sm font-black tracking-widest text-white">
              {drone.id}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold border ${
                isWarning
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
              }`}
            >
              {drone.callsign}
            </span>
            <span className="font-mono text-[10px] text-zinc-400">{drone.typeName}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:bg-white/10 hover:text-white transition"
              title={minimized ? "Expand" : "Minimize"}
            >
              <span className="font-mono text-xs leading-none">{minimized ? "□" : "—"}</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition"
              title="Close"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-4 space-y-3">
            {/* ── Route + ETA ────────────────────────────── */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                  ACTIVE SORTIE CORRIDOR
                </span>
                <span className="block text-xs font-semibold text-zinc-200 truncate leading-snug">
                  {drone.routeName}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-0.5">
                  ETA DEST
                </span>
                <span
                  className={`block font-mono text-base font-black ${
                    isWarning ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {formatEta(drone.etaSeconds)}
                </span>
              </div>
            </div>

            {/* ── Telemetry Strip ───────────────────────── */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/6 bg-black/40 p-2.5 font-mono text-[11px]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">ALT (AGL)</span>
                <span className="font-bold text-white">{drone.altitudeAgl} m</span>
                <span className="block text-[9px] text-zinc-500">MSL {drone.altitudeMsl}m</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">SPEED</span>
                <span className="font-bold text-white">{drone.speedKmh} km/h</span>
                <span className="block text-[9px] text-zinc-500">Hdg {drone.headingDeg}°</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">BATTERY</span>
                <span className={`font-bold ${batteryColor}`}>
                  {drone.batteryPct}%
                </span>
                <span className="block text-[9px] text-zinc-500">{drone.batteryVoltage}V LiPo</span>
              </div>
            </div>

            {/* Battery bar */}
            <div className="h-1.5 w-full rounded-full bg-zinc-800/70 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${batteryBarColor} transition-all duration-700`}
                style={{ width: `${drone.batteryPct}%` }}
              />
            </div>

            {/* ── Payload Gauge ─────────────────────────── */}
            <div className="rounded-xl border border-white/6 bg-black/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-0.5">
                    PAYLOAD LOAD CAPACITY
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-mono text-xl font-black text-white">
                      {drone.payloadKg.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      / {drone.maxPayloadKg} kg Max
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono text-2xl font-black ${
                      payloadPct > 85 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {payloadPct}%
                  </span>
                  <span className="block text-[9px] font-mono text-zinc-500">RATED LOAD</span>
                </div>
              </div>

              {/* Payload bar */}
              <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    payloadPct > 85
                      ? "bg-gradient-to-r from-amber-500 to-red-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${Math.min(payloadPct, 100)}%` }}
                />
              </div>

              {/* Manifest toggle */}
              {drone.payloadManifest.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowManifest(!showManifest)}
                    className="flex items-center space-x-1 text-[9px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition"
                  >
                    <svg
                      className={`h-2.5 w-2.5 transition-transform ${showManifest ? "rotate-90" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>CARGO MANIFEST ({drone.payloadManifest.length} ITEMS)</span>
                  </button>

                  {showManifest && (
                    <div className="mt-1.5 space-y-1 max-h-28 overflow-y-auto pr-1">
                      {drone.payloadManifest.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded bg-white/4 px-2.5 py-1 font-mono text-[10px] border border-white/4"
                        >
                          <div className="min-w-0 flex items-center space-x-2">
                            <span className="shrink-0 rounded-sm bg-white/8 px-1 py-0.2 text-[8px] uppercase tracking-wider text-zinc-400 border border-white/6">
                              {item.category}
                            </span>
                            <span className="text-zinc-300 truncate">{item.item}</span>
                          </div>
                          <span className="shrink-0 ml-2 font-bold text-emerald-400">
                            {item.weightKg} kg
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Position + RSSI ───────────────────────── */}
            <div className="flex items-center justify-between rounded-lg border border-white/6 bg-black/30 px-3 py-1.5 font-mono text-[10px]">
              <div className="flex items-center space-x-1.5">
                <svg className="h-3 w-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="text-zinc-400">POS:</span>
                <span className="text-zinc-200">
                  {drone.lat.toFixed(4)}°N, {drone.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-zinc-400">RSSI:</span>
                <span className="text-emerald-400 font-bold">{drone.signalDbm} dBm</span>
                <span className="text-zinc-500">·</span>
                <span className="text-cyan-400 font-bold">{drone.gpsFix}</span>
              </div>
            </div>

            {/* ── Live PIP Camera Placeholder ───────────── */}
            <div className="relative h-20 w-full overflow-hidden rounded-lg border border-white/8 bg-[#04070a]">
              {/* Animated scan line */}
              <div
                className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scan-sweep"
              />
              {/* Dot grid */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:10px_10px]" />
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-7 w-7">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/50" />
                  <div className="absolute inset-[4px] rounded-full border border-emerald-500/30" />
                  <div className="absolute inset-1/2 -ml-0.5 -mt-0.5 h-1 w-1 rounded-full bg-emerald-400" />
                  {/* Cross lines */}
                  <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-px bg-emerald-500/25" />
                  <div className="absolute left-0 right-0 top-1/2 -mt-px h-px bg-emerald-500/25" />
                </div>
              </div>
              {/* REC badge */}
              <div className="absolute top-1.5 left-2.5 flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-[8px] font-bold text-red-400">REC · GIMBAL CAM 01</span>
              </div>
              {/* FOV badge */}
              <div className="absolute bottom-1.5 right-2.5 font-mono text-[8px] text-zinc-500">
                FOV 84° · 4K 60FPS
              </div>
            </div>

            {/* ── Action Buttons ────────────────────────── */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onRth(drone.id)}
                className="group relative flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-950/25 py-2.5 font-mono text-[10px] font-bold text-red-300 hover:border-red-400/60 hover:bg-red-950/50 transition active:scale-95"
              >
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.25"/>
                </svg>
                <span>RTH</span>
                <span className="text-[8px] font-normal text-red-400/70">Return Base</span>
              </button>

              <button
                onClick={() => onHold(drone.id)}
                className="flex flex-col items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/25 py-2.5 font-mono text-[10px] font-bold text-amber-300 hover:border-amber-400/60 hover:bg-amber-950/50 transition active:scale-95"
              >
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
                <span>HOLD</span>
                <span className="text-[8px] font-normal text-amber-400/70">Hover In Place</span>
              </button>

              <button
                onClick={() => onDivert(drone.id)}
                className="flex flex-col items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/25 py-2.5 font-mono text-[10px] font-bold text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-950/50 transition active:scale-95"
              >
                <svg className="h-4 w-4 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
                <span>DIVERT</span>
                <span className="text-[8px] font-normal text-cyan-400/70">Alt Corridor</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
