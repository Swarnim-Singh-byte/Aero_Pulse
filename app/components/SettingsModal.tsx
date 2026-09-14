"use client";

import React, { useState } from "react";

export interface MapSettingsConfig {
  satelliteSource: "mapbox" | "esri" | "maptiler";
  mapboxToken: string;
  maptilerKey: string;
  enableTerrainMesh: boolean;
  terrainExaggeration: number;
  enableHillshade: boolean;
  hillshadeExaggeration: number;
  rasterBrightnessMax: number;
  rasterSaturation: number;
  rasterContrast: number;
  vignetteOpacity: number;
  showContourLines: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MapSettingsConfig;
  onUpdateConfig: (newConfig: Partial<MapSettingsConfig>) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"map" | "shaders" | "telemetry">("map");
  const [localMapboxToken, setLocalMapboxToken] = useState(config.mapboxToken);

  if (!isOpen) return null;

  const handleSaveToken = () => {
    onUpdateConfig({ mapboxToken: localMapboxToken.trim() });
    if (typeof window !== "undefined") {
      localStorage.setItem("aeropulse_mapbox_token", localMapboxToken.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0e1117] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                Command Map & Shader Engine
              </h3>
              <p className="text-[10px] text-zinc-400">MapLibre GL JS · 3D Terrain-RGB · Shaders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-5 pt-2">
          {(["map", "shaders", "telemetry"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-3 pb-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "map" ? "Tile Sources" : tab === "shaders" ? "Moody Shaders" : "Telemetry"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto font-mono text-xs">
          {activeTab === "map" && (
            <>
              {/* Satellite Provider */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase text-[11px]">
                  Satellite Imagery Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateConfig({ satelliteSource: "mapbox" })}
                    className={`rounded border p-2 text-center transition ${
                      config.satelliteSource === "mapbox"
                        ? "border-emerald-400 bg-emerald-950/40 text-emerald-300"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold block">Mapbox Satellite</span>
                    <span className="text-[9px] text-zinc-400">api.mapbox.com/v4</span>
                  </button>

                  <button
                    onClick={() => onUpdateConfig({ satelliteSource: "esri" })}
                    className={`rounded border p-2 text-center transition ${
                      config.satelliteSource === "esri"
                        ? "border-emerald-400 bg-emerald-950/40 text-emerald-300"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold block">Esri World High-Res</span>
                    <span className="text-[9px] text-zinc-400">Zoom 19 (Zero Key)</span>
                  </button>

                  <button
                    onClick={() => onUpdateConfig({ satelliteSource: "maptiler" })}
                    className={`rounded border p-2 text-center transition ${
                      config.satelliteSource === "maptiler"
                        ? "border-emerald-400 bg-emerald-950/40 text-emerald-300"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold block">MapTiler Sat</span>
                    <span className="text-[9px] text-zinc-400">Auto Key Auth</span>
                  </button>
                </div>
              </div>

              {/* Mapbox Token Input */}
              <div className="space-y-1.5 rounded-lg border border-white/10 bg-black/40 p-3">
                <label className="text-zinc-300 font-semibold block text-[11px]">
                  Mapbox Access Token (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    placeholder="pk.eyJ1I..."
                    value={localMapboxToken}
                    onChange={(e) => setLocalMapboxToken(e.target.value)}
                    className="flex-1 rounded border border-white/10 bg-black/60 px-2.5 py-1.5 text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveToken}
                    className="rounded bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-500 transition"
                  >
                    Save
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400">
                  If left empty, the dashboard seamlessly renders high-resolution Esri World Imagery (street-level zoom 19) with MapTiler Terrain-RGB elevation!
                </p>
              </div>

              {/* 3D Terrain Mesh Toggle & Exaggeration */}
              <div className="space-y-2 rounded-lg border border-white/10 bg-black/40 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">3D Terrain Elevation Mesh</span>
                    <p className="text-[10px] text-zinc-400">MapTiler Terrain-RGB-v2 DEM</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableTerrainMesh}
                    onChange={(e) => onUpdateConfig({ enableTerrainMesh: e.target.checked })}
                    className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </div>

                {config.enableTerrainMesh && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-300">
                      <span>Terrain Exaggeration Factor:</span>
                      <span className="font-bold text-emerald-400">{config.terrainExaggeration}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={config.terrainExaggeration}
                      onChange={(e) =>
                        onUpdateConfig({ terrainExaggeration: parseFloat(e.target.value) })
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "shaders" && (
            <>
              {/* Raster Paint Adjustments: Brightness-max, Saturation, Contrast */}
              <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
                <span className="font-bold text-white block text-[11px]">
                  Satellite Raster Paint Adjustments
                </span>

                {/* Brightness-Max */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-300">
                    <span>Brightness Max (~0.5):</span>
                    <span className="font-bold text-emerald-400">{config.rasterBrightnessMax}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={config.rasterBrightnessMax}
                    onChange={(e) =>
                      onUpdateConfig({ rasterBrightnessMax: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-300">
                    <span>Saturation (~-0.3):</span>
                    <span className="font-bold text-emerald-400">{config.rasterSaturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="0.5"
                    step="0.05"
                    value={config.rasterSaturation}
                    onChange={(e) =>
                      onUpdateConfig({ rasterSaturation: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-300">
                    <span>Contrast (~0.25):</span>
                    <span className="font-bold text-emerald-400">{config.rasterContrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="1.0"
                    step="0.05"
                    value={config.rasterContrast}
                    onChange={(e) =>
                      onUpdateConfig({ rasterContrast: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Hillshade Exaggeration & Vignette */}
              <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
                <span className="font-bold text-white block text-[11px]">
                  Moody Hillshade & Vignette Overlays
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-300">
                    <span>Hillshade Shadow Exaggeration:</span>
                    <span className="font-bold text-emerald-400">
                      {config.hillshadeExaggeration}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.05"
                    value={config.hillshadeExaggeration}
                    onChange={(e) =>
                      onUpdateConfig({ hillshadeExaggeration: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-300">
                    <span>Radial Vignette Depth:</span>
                    <span className="font-bold text-emerald-400">{config.vignetteOpacity}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.9"
                    step="0.05"
                    value={config.vignetteOpacity}
                    onChange={(e) =>
                      onUpdateConfig({ vignetteOpacity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
              <span className="font-bold text-white block text-[11px]">
                Tactical Overlays
              </span>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-300">Subtle White Ridge/Contour Lines</span>
                <input
                  type="checkbox"
                  checked={config.showContourLines}
                  onChange={(e) => onUpdateConfig({ showContourLines: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-300">RTK Base Station Telemetry</span>
                <span className="text-emerald-400 font-bold">L1/L2 DGPS LOCKED</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/10 px-5 py-3 bg-black/40 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded bg-emerald-600 px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-emerald-500 transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
