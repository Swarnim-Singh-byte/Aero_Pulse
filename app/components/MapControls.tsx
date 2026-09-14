"use client";

import React from "react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onTogglePitch: () => void;
  is3DPitched: boolean;
  onOpenSettings: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onTogglePitch,
  is3DPitched,
  onOpenSettings,
}: MapControlsProps) {
  return (
    <div className="pointer-events-auto absolute bottom-24 left-4 z-20 flex flex-col space-y-1.5">
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        title="Zoom In (+)"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0c0f14]/85 text-zinc-300 shadow-xl backdrop-blur-md hover:border-emerald-500/50 hover:bg-[#141822] hover:text-white transition active:scale-95"
      >
        <span className="font-mono text-base font-bold">+</span>
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        title="Zoom Out (−)"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0c0f14]/85 text-zinc-300 shadow-xl backdrop-blur-md hover:border-emerald-500/50 hover:bg-[#141822] hover:text-white transition active:scale-95"
      >
        <span className="font-mono text-base font-bold">−</span>
      </button>

      {/* 2D / 3D Pitch Toggle */}
      <button
        onClick={onTogglePitch}
        title={is3DPitched ? "Switch to 2D Nadir View (0°)" : "Switch to 3D Oblique View (53°)"}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-[10px] font-black shadow-xl backdrop-blur-md transition active:scale-95 ${
          is3DPitched
            ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
            : "border-white/10 bg-[#0c0f14]/85 text-zinc-300 hover:text-white"
        }`}
      >
        {is3DPitched ? "3D" : "2D"}
      </button>

      {/* Reset Bearing / North */}
      <button
        onClick={onResetBearing}
        title="Reset Camera North"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0c0f14]/85 text-zinc-300 shadow-xl backdrop-blur-md hover:border-white/30 hover:text-white transition active:scale-95"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 19 21 12 17 5 21 12 2" fill="rgba(239,68,68,0.4)" />
        </svg>
      </button>

      {/* Settings Dialog Trigger */}
      <button
        onClick={onOpenSettings}
        title="Map Tile & Shader Settings"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0c0f14]/85 text-zinc-300 shadow-xl backdrop-blur-md hover:border-white/30 hover:text-white transition active:scale-95"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  );
}
