"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Map } from "maplibre-gl";
import {
  DashboardTab,
  DroneUnit,
  RouteSchedule,
  OperationalAlert,
} from "./types/dashboard";
import {
  INITIAL_FLEET,
  FLEET_SUMMARY,
  ACTIVE_ALERTS,
  SCHEDULE_OFFSETS,
  VOLUME_METRICS,
} from "./data/mockDroneData";

import Navbar from "./components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import BottomPanels from "./components/BottomPanels";
import PayloadCard from "./components/PayloadCard";
import MapControls from "./components/MapControls";
import MapView from "./components/MapView";
import SettingsModal, { MapSettingsConfig } from "./components/SettingsModal";
import SearchModal from "./components/SearchModal";

// Sub-views
import FleetView from "./components/views/FleetView";
import RoutesView from "./components/views/RoutesView";
import AnalyticsView from "./components/views/AnalyticsView";
import MaintenanceView from "./components/views/MaintenanceView";
import IncidentsView from "./components/views/IncidentsView";
import CrewView from "./components/views/CrewView";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<DashboardTab>("live-map");
  const [fleet, setFleet] = useState<DroneUnit[]>(INITIAL_FLEET);
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>("AP-804");
  const [alerts, setAlerts] = useState<OperationalAlert[]>(ACTIVE_ALERTS);
  const [scheduleOffsets] = useState<RouteSchedule[]>(SCHEDULE_OFFSETS);
  const [volumeMetrics] = useState(VOLUME_METRICS);

  // Map settings config with lazy token loader
  const [mapConfig, setMapConfig] = useState<MapSettingsConfig>(() => {
    let savedToken = "";
    if (typeof window !== "undefined") {
      savedToken = localStorage.getItem("aeropulse_mapbox_token") || "";
    }
    return {
      satelliteSource: "maptiler",
      mapboxToken: savedToken,
      maptilerKey: process.env.NEXT_PUBLIC_MAPTILER_KEY || "31yGrjiKQQNKL2uQrAmH",
      enableTerrainMesh: true,
      terrainExaggeration: 1.2,
      enableHillshade: true,
      hillshadeExaggeration: 0.88,
      rasterBrightnessMax: 0.5,
      rasterSaturation: -0.3,
      rasterContrast: 0.25,
      vignetteOpacity: 0.65,
      showContourLines: true,
    };
  });

  // Layer toggles
  const [show3DTerrain, setShow3DTerrain] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [is3DPitched, setIs3DPitched] = useState<boolean>(true);

  // Sidebars collapse state
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(false);
  const [rightCollapsed, setRightCollapsed] = useState<boolean>(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mapInstanceRef = useRef<Map | null>(null);

  // Keyboard shortcut for command search palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live telemetry simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setFleet((prevFleet) =>
        prevFleet.map((drone) => {
          if (drone.status !== "airborne") return drone;

          // Subtle position drift along flight vector
          const headingRad = (drone.headingDeg * Math.PI) / 180;
          const speedFactor = 0.00004; // smooth simulated step
          const dLng = Math.sin(headingRad) * speedFactor;
          const dLat = Math.cos(headingRad) * speedFactor;

          const newLng = drone.lng + dLng;
          const newLat = drone.lat + dLat;

          // Slightly oscillate altitude and speed for live realism
          const altitudeNoise = Math.round((Math.random() - 0.5) * 4);
          const speedNoise = Math.round((Math.random() - 0.5) * 3);

          return {
            ...drone,
            lat: newLat,
            lng: newLng,
            altitudeAgl: Math.max(80, drone.altitudeAgl + altitudeNoise),
            speedKmh: Math.max(40, drone.speedKmh + speedNoise),
            etaSeconds: Math.max(10, drone.etaSeconds - 1),
            lastActive: "Just now",
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Map Controls Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetBearing = () => {
    mapInstanceRef.current?.easeTo({
      bearing: 0,
      pitch: 53,
      duration: 1000,
    });
  };

  const handleTogglePitch = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (is3DPitched) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3DPitched(false);
    } else {
      map.easeTo({ pitch: 55, bearing: -26, duration: 800 });
      setIs3DPitched(true);
    }
  };

  const handleSelectDrone = (id: string) => {
    setSelectedDroneId(id);
    if (currentTab !== "live-map") {
      setCurrentTab("live-map");
    }
  };

  const handleSelectRoute = (routeCode: string) => {
    showToast(`Visualizing airspace corridor: ${routeCode}`);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    showToast(`Alert ${alertId} acknowledged.`);
  };

  const handleDroneRth = (droneId: string) => {
    setFleet((prev) =>
      prev.map((d) =>
        d.id === droneId
          ? {
            ...d,
            routeName: "EMERGENCY RTH ➔ Central Base Nest",
            speedKmh: Math.round(d.speedKmh * 1.15),
            headingDeg: 180,
          }
          : d
      )
    );
    showToast(`RTH protocol engaged for ${droneId}. Vector recalculated.`);
  };

  const handleDroneHold = (droneId: string) => {
    setFleet((prev) =>
      prev.map((d) =>
        d.id === droneId ? { ...d, speedKmh: 0, altitudeAgl: d.altitudeAgl } : d
      )
    );
    showToast(`${droneId} holding position in hover loiter mode.`);
  };

  const handleDroneDivert = (droneId: string) => {
    setFleet((prev) =>
      prev.map((d) =>
        d.id === droneId
          ? {
            ...d,
            headingDeg: (d.headingDeg + 45) % 360,
            routeName: "Diverted Corridor B-Secondary",
          }
          : d
      )
    );
    showToast(`${droneId} flight corridor diverted. New vector 45° offset.`);
  };

  const activeDrone = fleet.find((d) => d.id === selectedDroneId) || null;

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a] text-zinc-100 selection:bg-emerald-500/30">
      {/* 1. Tactical Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        alerts={alerts}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectDrone={handleSelectDrone}
        show3DTerrain={show3DTerrain}
        onToggle3DTerrain={() => {
          setShow3DTerrain(!show3DTerrain);
          setMapConfig((prev) => ({ ...prev, enableTerrainMesh: !show3DTerrain }));
        }}
        showCorridors={showCorridors}
        onToggleCorridors={() => setShowCorridors(!showCorridors)}
        showGeofences={showGeofences}
        onToggleGeofences={() => setShowGeofences(!showGeofences)}
      />

      {/* 2. Main Center Body View */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* If currentTab is "live-map", render 3D Map canvas with overlays */}
        <div
          className={`relative h-full w-full ${currentTab === "live-map" ? "block" : "hidden"
            }`}
        >
          {/* Full-bleed 3D Satellite Map with Hillshade, DEM & Vignette */}
          <MapView
            fleet={fleet}
            routes={scheduleOffsets}
            selectedDroneId={selectedDroneId}
            onSelectDrone={handleSelectDrone}
            config={mapConfig}
            showCorridors={showCorridors}
            showGeofences={showGeofences}
            mapInstanceRef={mapInstanceRef}
          />

          {/* Floating Passenger / Payload Load Tactical Card */}
          {selectedDroneId && (
            <PayloadCard
              drone={activeDrone}
              onClose={() => setSelectedDroneId(null)}
              onRth={handleDroneRth}
              onHold={handleDroneHold}
              onDivert={handleDroneDivert}
            />
          )}

          {/* Map Controls (+ / - / 3D / Bearing / Settings) Bottom-Left */}
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetBearing={handleResetBearing}
            onTogglePitch={handleTogglePitch}
            is3DPitched={is3DPitched}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Bottom Panels: Schedule Offset Table + Live Volume Widget */}
          <BottomPanels
            scheduleOffsets={scheduleOffsets}
            volumeMetrics={volumeMetrics}
            onSelectDrone={handleSelectDrone}
            onSelectRoute={handleSelectRoute}
          />
        </div>

        {/* Dedicated Views for top navigation tabs */}
        {currentTab === "fleet" && (
          <FleetView
            fleet={fleet}
            fleetSummary={FLEET_SUMMARY}
            onSelectDroneAndMap={handleSelectDrone}
          />
        )}

        {currentTab === "routes" && (
          <RoutesView
            routes={scheduleOffsets}
            onSelectRouteAndMap={(code, droneId) => {
              handleSelectDrone(droneId);
              setCurrentTab("live-map");
            }}
          />
        )}

        {currentTab === "analytics" && (
          <AnalyticsView volumeMetrics={volumeMetrics} />
        )}

        {currentTab === "maintenance" && <MaintenanceView />}

        {currentTab === "incidents" && <IncidentsView />}

        {currentTab === "crew" && <CrewView />}

        {/* Left Sidebar: Fleet types, Operational Efficiency chart, unit cards */}
        {currentTab === "live-map" && (
          <div className="absolute top-0 bottom-0 left-0 pointer-events-auto z-20">
            <LeftSidebar
              fleet={fleet}
              fleetSummary={FLEET_SUMMARY}
              selectedDroneId={selectedDroneId}
              onSelectDrone={handleSelectDrone}
              collapsed={leftCollapsed}
              onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
            />
          </div>
        )}

        {/* Right Sidebar: Active Warnings panel with severity & affected locations */}
        {currentTab === "live-map" && (
          <div className="absolute top-0 bottom-0 right-0 pointer-events-auto z-20">
            <RightSidebar
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onSelectDrone={handleSelectDrone}
              collapsed={rightCollapsed}
              onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
            />
          </div>
        )}
      </div>

      {/* Settings Modal (Mapbox token, Hillshade, 3D Elevation, Shaders) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={mapConfig}
        onUpdateConfig={(newConfig) =>
          setMapConfig((prev) => ({ ...prev, ...newConfig }))
        }
      />

      {/* Quick Command Palette Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        drones={fleet}
        routes={scheduleOffsets}
        alerts={alerts}
        onSelectDrone={handleSelectDrone}
        onSelectRoute={handleSelectRoute}
      />

      {/* Tactical Toast Alert Notifications */}
      {toastMessage && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 rounded-lg border border-emerald-500/40 bg-[#0c1017]/95 px-4 py-2 font-mono text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}