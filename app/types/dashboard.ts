export type DroneStatus = "airborne" | "docked" | "warning" | "offline";
export type DroneType = "heavy-lift" | "vtol-recon" | "rapid-quad" | "dock-relay";
export type AlertSeverity = "critical" | "warning" | "advisory";

export interface DroneUnit {
  id: string;
  name: string;
  callsign: string;
  type: DroneType;
  typeName: string;
  status: DroneStatus;
  lastActive: string;
  batteryPct: number;
  batteryVoltage: number;
  altitudeMsl: number; // Mean Sea Level (m)
  altitudeAgl: number; // Above Ground Level (m)
  speedKmh: number;
  headingDeg: number;
  signalDbm: number;
  gpsFix: "RTK-FIX" | "3D-DGPS" | "STANDBY";
  lat: number;
  lng: number;
  targetLat: number;
  targetLng: number;
  payloadKg: number;
  maxPayloadKg: number;
  payloadType: string;
  payloadManifest: {
    item: string;
    weightKg: number;
    category: string;
  }[];
  routeId: string;
  routeName: string;
  etaSeconds: number;
  flightTimeMinutes: number;
  sparklineData: number[]; // Altitude or speed history
  historyPoints: [number, number][]; // Trail coordinates [lng, lat]
}

export interface RouteSchedule {
  id: string;
  routeCode: string;
  droneId: string;
  droneName: string;
  origin: string;
  destination: string;
  scheduledEta: string;
  estimatedEta: string;
  varianceSeconds: number; // positive = delay, negative = early
  varianceText: string;
  status: "En Route" | "Final Approach" | "Holding Pattern" | "Completed" | "Pre-flight";
  distanceKm: number;
  progressPct: number;
  coordinates: [number, number][]; // [lng, lat]
}

export interface OperationalAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: "capacity" | "schedule" | "geofence" | "hardware" | "weather";
  timestamp: string;
  timeAgo: string;
  affectedLocation: string;
  affectedSector: string;
  droneId?: string;
  acknowledged: boolean;
}

export interface FleetSummary {
  totalDrones: number;
  airborneCount: number;
  dockedCount: number;
  warningCount: number;
  byType: {
    heavyLift: number;
    vtolRecon: number;
    rapidQuad: number;
    dockRelay: number;
  };
}

export interface VolumeMetric {
  totalPayloadTodayKg: number;
  todaySortiesCount: number;
  changePct: number; // +18.4%
  sparklineHours: number[];
  activeFlightHours: number;
  carbonOffsetKg: number;
  successRatePct: number;
}

export type DashboardTab =
  | "live-map"
  | "fleet"
  | "routes"
  | "analytics"
  | "maintenance"
  | "incidents"
  | "crew";
