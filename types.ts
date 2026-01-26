
export enum ZoneStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export type ElevationTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface WaterNode {
  id: string;
  nameKey: string; // Key for translations
  lat: number;
  lng: number;
  flowRate: number; // L/min
  pressure: number; // PSI
  status: ZoneStatus;
  anomalyScore: number; // 0-100
  valveOpen: boolean;
  elevation: ElevationTier;
  isTailEnd: boolean;
  infraAge: number; // years
}

export interface TelemetryData {
  totalFlow: number;
  activeLeaks: number;
  avgPressure: number;
  mqttRate: number;
  timestamp: string;
  equitabilityScore: number; // 0-100
  nrwLoss: number; // percentage
}

export interface Complaint {
  id: string;
  type: string;
  ward: string;
  status: 'Open' | 'Assigned' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
}
