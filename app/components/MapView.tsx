"use client";

import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, setWorkerUrl, GeoJSONSource } from "maplibre-gl";
import { DroneUnit, RouteSchedule } from "../types/dashboard";
import { MapSettingsConfig } from "./SettingsModal";
import { OPERATIONAL_ZONES } from "../data/mockDroneData";

// Configure MapLibre worker from self-hosted /public/maplibre/
if (typeof window !== "undefined") {
  setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
}

interface MapViewProps {
  fleet: DroneUnit[];
  routes: RouteSchedule[];
  selectedDroneId: string | null;
  onSelectDrone: (droneId: string) => void;
  config: MapSettingsConfig;
  showCorridors: boolean;
  showGeofences: boolean;
  mapInstanceRef: React.MutableRefObject<Map | null>;
}

export default function MapView({
  fleet,
  routes,
  selectedDroneId,
  onSelectDrone,
  config,
  showCorridors,
  showGeofences,
  mapInstanceRef,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [droneId: string]: Marker }>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapBearing, setMapBearing] = useState<number>(OPERATIONAL_ZONES.defaultBearing);
  const animFrameRef = useRef<number | null>(null);

  // Determine satellite tiles URL based on config and token
  const getSatelliteTilesUrl = (): string[] => {
    const token =
      config.mapboxToken ||
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      (typeof window !== "undefined" ? localStorage.getItem("aeropulse_mapbox_token") : null);

    if (config.satelliteSource === "mapbox" && token) {
      return [
        `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${token}`,
      ];
    } else if (config.satelliteSource === "maptiler" && config.maptilerKey) {
      return [
        `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${config.maptilerKey}`,
      ];
    } else {
      // High-resolution Esri World Imagery (reliable down to zoom 19-20 without token)
      return [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ];
    }
  };

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current || mapInstanceRef.current) return;

    const satelliteTiles = getSatelliteTilesUrl();
    const maptilerKey = config.maptilerKey || process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

    const map = new Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: satelliteTiles,
            tileSize: 256,
            maxzoom: 20,
            attribution: "Imagery © Mapbox / Esri / Maxar",
          },
          terrainSource: {
            type: "raster-dem",
            tiles: [
              `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${maptilerKey}`,
            ],
            tileSize: 256,
            maxzoom: 14,
          },
        },
        layers: [
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
            paint: {
              "raster-brightness-min": 0,
              "raster-brightness-max": config.rasterBrightnessMax,
              "raster-saturation": config.rasterSaturation,
              "raster-contrast": config.rasterContrast,
              "raster-opacity": 1,
            },
          },
          {
            id: "hillshade",
            type: "hillshade",
            source: "terrainSource",
            layout: {
              visibility: config.enableHillshade ? "visible" : "none",
            },
            paint: {
              "hillshade-shadow-color": "#060504",
              "hillshade-highlight-color": "#6a8070",
              "hillshade-accent-color": "#111410",
              "hillshade-exaggeration": config.hillshadeExaggeration,
            },
          },
        ],
      },
      center: OPERATIONAL_ZONES.center,
      zoom: OPERATIONAL_ZONES.defaultZoom,
      pitch: OPERATIONAL_ZONES.defaultPitch,
      bearing: OPERATIONAL_ZONES.defaultBearing,
      maxPitch: 85,
    });

    mapInstanceRef.current = map;

    // Track bearing for compass HUD
    map.on("rotate", () => setMapBearing(Math.round(map.getBearing())));

    map.on("load", () => {
      setMapLoaded(true);

      // Enable 3D Terrain mesh
      if (config.enableTerrainMesh) {
        try {
          map.setTerrain({
            source: "terrainSource",
            exaggeration: config.terrainExaggeration,
          });
        } catch {
          // Graceful fallback
        }
      }

      // ── White Ridge / Contour Lines ──────────────────────
      map.addSource("ridge-contours", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "Rohtang Crest Ridge" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.165, 32.32], [77.195, 32.335],
                  [77.228, 32.355], [77.255, 32.37],
                ],
              },
            },
            {
              type: "Feature",
              properties: { name: "Solang Valley Ridge" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.145, 32.27], [77.168, 32.295], [77.185, 32.325],
                ],
              },
            },
            {
              type: "Feature",
              properties: { name: "Kullu Gorge Line" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.155, 32.19], [77.172, 32.22],
                  [77.188, 32.245], [77.21, 32.268],
                ],
              },
            },
            {
              type: "Feature",
              properties: { name: "Beas Valley Run" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [77.19, 32.25], [77.196, 32.265],
                  [77.2, 32.28], [77.21, 32.295], [77.215, 32.31],
                ],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "ridge-contour-lines",
        type: "line",
        source: "ridge-contours",
        paint: {
          "line-color": "#ffffff",
          "line-opacity": 0.18,
          "line-width": 1,
          "line-dasharray": [3, 5],
        },
      });

      // ── Drone History / Trail Lines ──────────────────────
      const trailFeatures = fleet
        .filter((d) => d.historyPoints.length >= 2)
        .map((d) => ({
          type: "Feature" as const,
          properties: { droneId: d.id, status: d.status },
          geometry: {
            type: "LineString" as const,
            coordinates: d.historyPoints,
          },
        }));

      map.addSource("drone-trails", {
        type: "geojson",
        data: { type: "FeatureCollection", features: trailFeatures },
      });

      // Glow trail
      map.addLayer({
        id: "drone-trails-glow",
        type: "line",
        source: "drone-trails",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "status"], "warning"], "#ef4444",
            "#10b981",
          ],
          "line-width": 5,
          "line-opacity": 0.25,
          "line-blur": 4,
        },
      });

      // Core trail
      map.addLayer({
        id: "drone-trails-core",
        type: "line",
        source: "drone-trails",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "status"], "warning"], "#f87171",
            "#34d399",
          ],
          "line-width": 1.5,
          "line-opacity": 0.75,
          "line-dasharray": [2, 3],
        },
      });

      // ── Airspace Geofences ───────────────────────────────
      map.addSource("airspace-geofences", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: OPERATIONAL_ZONES.geofences.map((gf) => ({
            type: "Feature",
            properties: {
              id: gf.id,
              name: gf.name,
              type: gf.type,
              color: gf.color,
            },
            geometry: {
              type: "Polygon",
              coordinates: [gf.coordinates],
            },
          })),
        },
      });

      map.addLayer({
        id: "geofence-fill",
        type: "fill",
        source: "airspace-geofences",
        layout: { visibility: showGeofences ? "visible" : "none" },
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.12,
        },
      });

      map.addLayer({
        id: "geofence-border",
        type: "line",
        source: "airspace-geofences",
        layout: { visibility: showGeofences ? "visible" : "none" },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.5,
          "line-dasharray": [4, 2],
          "line-opacity": 0.8,
        },
      });

      // ── Flight Corridors ─────────────────────────────────
      map.addSource("flight-corridors", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: routes.map((r) => ({
            type: "Feature",
            properties: {
              id: r.id,
              routeCode: r.routeCode,
              droneId: r.droneId,
              status: r.status,
            },
            geometry: {
              type: "LineString",
              coordinates: r.coordinates,
            },
          })),
        },
      });

      // Glow outer
      map.addLayer({
        id: "corridors-glow",
        type: "line",
        source: "flight-corridors",
        layout: {
          visibility: showCorridors ? "visible" : "none",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#06b6d4",
          "line-width": 6,
          "line-opacity": 0.3,
          "line-blur": 4,
        },
      });

      // Sharp inner
      map.addLayer({
        id: "corridors-line",
        type: "line",
        source: "flight-corridors",
        layout: {
          visibility: showCorridors ? "visible" : "none",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#22d3ee",
          "line-width": 1.8,
          "line-dasharray": [3, 2],
          "line-opacity": 0.9,
        },
      });
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update Raster Paint on Config Change ─────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer("satellite")) {
      map.setPaintProperty("satellite", "raster-brightness-max", config.rasterBrightnessMax);
      map.setPaintProperty("satellite", "raster-saturation", config.rasterSaturation);
      map.setPaintProperty("satellite", "raster-contrast", config.rasterContrast);
    }
    if (map.getLayer("hillshade")) {
      map.setLayoutProperty("hillshade", "visibility", config.enableHillshade ? "visible" : "none");
      map.setPaintProperty("hillshade", "hillshade-exaggeration", config.hillshadeExaggeration);
    }
    if (map.getLayer("ridge-contour-lines")) {
      map.setLayoutProperty(
        "ridge-contour-lines",
        "visibility",
        config.showContourLines ? "visible" : "none"
      );
    }
    try {
      if (config.enableTerrainMesh) {
        map.setTerrain({ source: "terrainSource", exaggeration: config.terrainExaggeration });
      } else {
        map.setTerrain(null);
      }
    } catch {
      // Graceful ignore
    }
  }, [config, mapLoaded]);

  // ── Toggle Corridors & Geofences ─────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer("corridors-glow") && map.getLayer("corridors-line")) {
      map.setLayoutProperty("corridors-glow", "visibility", showCorridors ? "visible" : "none");
      map.setLayoutProperty("corridors-line", "visibility", showCorridors ? "visible" : "none");
    }
    if (map.getLayer("geofence-fill") && map.getLayer("geofence-border")) {
      map.setLayoutProperty("geofence-fill", "visibility", showGeofences ? "visible" : "none");
      map.setLayoutProperty("geofence-border", "visibility", showGeofences ? "visible" : "none");
    }
  }, [showCorridors, showGeofences, mapLoaded]);

  // ── Render Tactical Drone Markers ────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    fleet.forEach((drone) => {
      const isSelected = selectedDroneId === drone.id;
      const isWarning = drone.status === "warning";
      const isAirborne = drone.status === "airborne" || drone.status === "warning";
      const isDocked = drone.status === "docked";

      let marker = markersRef.current[drone.id];

      if (!marker) {
        const el = document.createElement("div");
        el.className = "tactical-drone-marker cursor-pointer";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectDrone(drone.id);
        });

        marker = new Marker({
          element: el,
          pitchAlignment: "map",
          rotationAlignment: "map",
        })
          .setLngLat([drone.lng, drone.lat])
          .addTo(map);

        markersRef.current[drone.id] = marker;
      } else {
        marker.setLngLat([drone.lng, drone.lat]);
      }

      const el = marker.getElement();
      const ringColor = isWarning
        ? "rgba(239,68,68,0.3)"
        : isSelected
        ? "rgba(16,185,129,0.35)"
        : "rgba(16,185,129,0.2)";
      const ringBorder = isWarning
        ? "border-red-500/60"
        : isSelected
        ? "border-emerald-400/80"
        : "border-emerald-500/40";

      const iconBoxClass = isSelected
        ? "border-emerald-400 bg-emerald-950 text-emerald-300 shadow-[0_0_18px_#34d399] ring-2 ring-emerald-400/50"
        : isWarning
        ? "border-red-500 bg-red-950 text-red-400 shadow-[0_0_14px_#ef4444]"
        : isDocked
        ? "border-zinc-600 bg-zinc-900 text-zinc-400"
        : "border-emerald-500/60 bg-[#0a0f16] text-emerald-400 shadow-lg hover:scale-110";

      el.innerHTML = `
        <div class="relative flex flex-col items-center select-none" style="filter: drop-shadow(0 0 6px ${isWarning ? "#ef4444" : isSelected ? "#34d399" : "transparent"})">
          ${isAirborne ? `
            <div
              class="absolute -inset-3 rounded-full border ${ringBorder} pointer-events-none animate-radar-ping"
              style="background: ${ringColor};"
            ></div>
          ` : ""}

          <!-- Drone icon with heading rotation -->
          <div
            style="transform: rotate(${drone.headingDeg}deg);"
            class="relative flex h-8 w-8 items-center justify-center rounded-full border ${iconBoxClass} transition-transform duration-200"
          >
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 2L12 22"/>
              <path d="M2 12L22 12"/>
              <circle cx="12" cy="12" r="2.8" fill="currentColor" fill-opacity="0.4"/>
              <circle cx="5" cy="5" r="1.8"/>
              <circle cx="19" cy="5" r="1.8"/>
              <circle cx="5" cy="19" r="1.8"/>
              <circle cx="19" cy="19" r="1.8"/>
            </svg>
          </div>

          <!-- Tactical label -->
          <div class="mt-1 flex items-center space-x-1 rounded bg-black/85 px-1.5 py-[2px] font-mono text-[9px] font-bold text-white border border-white/15 shadow-lg whitespace-nowrap backdrop-blur-sm">
            <span class="${isWarning ? "text-red-400" : isSelected ? "text-emerald-300" : "text-emerald-400"}">${drone.id}</span>
            <span class="text-zinc-500">·</span>
            <span class="text-zinc-300">${isDocked ? "DOCKED" : drone.altitudeAgl + "m"}</span>
          </div>
        </div>
      `;
    });
  }, [fleet, selectedDroneId, mapLoaded, onSelectDrone]);

  // ── Update Drone Trail Geometry ──────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !map.getSource("drone-trails")) return;

    const trailFeatures = fleet
      .filter((d) => d.historyPoints.length >= 2)
      .map((d) => ({
        type: "Feature" as const,
        properties: { droneId: d.id, status: d.status },
        geometry: {
          type: "LineString" as const,
          coordinates: d.historyPoints,
        },
      }));

    (map.getSource("drone-trails") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: trailFeatures,
    });
  }, [fleet, mapLoaded]);

  // ── FlyTo Selected Drone ─────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDroneId || !mapLoaded) return;

    const drone = fleet.find((d) => d.id === selectedDroneId);
    if (drone) {
      map.flyTo({
        center: [drone.lng, drone.lat],
        zoom: Math.max(map.getZoom(), 13.2),
        pitch: 55,
        bearing: drone.headingDeg - 30,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedDroneId, fleet, mapLoaded]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      {/* 3D MapLibre Canvas */}
      <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

      {/* Cinematic Radial Vignette (transparent center → dark edges) */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${
            config.vignetteOpacity * 0.65
          }) 72%, rgba(0,0,0,${config.vignetteOpacity}) 100%)`,
        }}
      />

      {/* Subtle HUD tactical grid lines */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:5rem_5rem]" />

      {/* ── Top-Right HUD: Terrain + Compass ────────────── */}
      <div className="pointer-events-none absolute top-3 right-3 z-10 flex flex-col items-end space-y-1.5">
        {/* Terrain active badge */}
        <div className="flex items-center space-x-2 rounded-lg border border-white/8 bg-black/65 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>3D TERRAIN · ACTIVE</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300 font-semibold">
            {config.enableTerrainMesh ? `${config.terrainExaggeration}x EXG` : "FLAT"}
          </span>
        </div>

        {/* Mini compass */}
        <div className="flex items-center space-x-2 rounded-lg border border-white/8 bg-black/65 px-2.5 py-1 font-mono text-[10px] text-zinc-400 backdrop-blur-md">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${-mapBearing}deg)`, transition: "transform 0.3s ease" }}
          >
            <polygon points="12 2 14.5 10 12 8 9.5 10" fill="#ef4444" />
            <polygon points="12 22 14.5 14 12 16 9.5 14" fill="#71717a" />
          </svg>
          <span>BRG {mapBearing < 0 ? 360 + mapBearing : mapBearing}°</span>
          <span className="text-zinc-600">|</span>
          <span className="text-cyan-400">HIMACHAL-01</span>
        </div>
      </div>
    </div>
  );
}