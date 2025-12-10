// TypeScript interfaces for buffer zones

export interface BufferZone {
  id: string;
  stationId: string;
  radius: number; // in km
  type: BufferZoneType;
  coordinates: [number, number]; // center coordinates [longitude, latitude]
  affectedVillages: string[]; // village IDs
  population: number;
  riskLevel: RiskLevel;
}

export type BufferZoneType = 'inner' | 'middle' | 'outer';

export type RiskLevel = 'yellow' | 'orange' | 'darkOrange' | 'red';

export interface BufferZoneGeometry {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON polygon coordinates
  };
  properties: {
    bufferId: string;
    radius: number;
    type: BufferZoneType;
    riskLevel: RiskLevel;
  };
}

