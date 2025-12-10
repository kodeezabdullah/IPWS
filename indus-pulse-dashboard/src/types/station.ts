// TypeScript interfaces for monitoring stations

export interface Station {
  id: string;
  name: string;
  deviceId: string; // IoT device identifier
  coordinates: [number, number]; // [longitude, latitude]
  city: string; // Major city name
  district: string;
  province: string;
  currentLevel: number; // in meters (from ML model)
  dangerLevel: number; // in meters
  warningLevel: number; // 80% of danger level
  normalLevel: number; // baseline level
  status: StationStatus;
  riskLevel: RiskLevel; // yellow, orange, darkOrange, red
  lastUpdated: Date | string;
  trend: 'rising' | 'falling' | 'stable';
  flowRate?: number; // cubic meters per second
  temperature?: number; // in celsius
  rainfall?: number; // in mm
  batteryLevel?: number; // percentage (0-100)
  imageUrl?: string; // URL to scale bar image
}

export type StationStatus = 'active' | 'inactive' | 'maintenance';

export type RiskLevel = 'yellow' | 'orange' | 'darkOrange' | 'red';

export interface StationTimeSeries {
  stationId: string;
  data: TimeSeriesPoint[];
}

export interface TimeSeriesPoint {
  timestamp: Date | string;
  waterLevel: number;
  flowRate?: number;
  rainfall?: number;
  temperature?: number;
}

export interface StationAlert {
  id: string;
  stationId: string;
  stationName: string;
  alertType: 'warning' | 'danger' | 'critical';
  message: string;
  timestamp: Date | string;
  acknowledged: boolean;
}

export interface StationMetadata {
  elevation: number; // meters above sea level
  riverSection: string;
  operationalSince: Date | string;
  maintenanceSchedule?: string;
  contact?: string;
  description?: string;
}

