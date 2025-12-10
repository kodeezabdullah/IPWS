// TypeScript interfaces for villages and populated areas

export interface Village {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  population: number;
  district: string;
  province: string;
  riskLevel: RiskLevel;
  nearestStationId: string;
  distanceToRiver: number; // in km
  elevation: number; // meters above sea level
  evacuationPlan: boolean;
  shelterCapacity?: number;
}

export type RiskLevel = 'yellow' | 'orange' | 'darkOrange' | 'red';

export interface VillageRiskAssessment {
  villageId: string;
  villageName: string;
  currentRisk: RiskLevel;
  affectedPopulation: number;
  evacuationRequired: boolean;
  estimatedFloodArrival?: Date | string;
  recommendedActions: string[];
  nearestShelter?: string;
  lastAssessed: Date | string;
}

export interface PopulationAtRisk {
  total: number;
  byRiskLevel: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byDistrict: Record<string, number>;
  villages: Village[];
}

