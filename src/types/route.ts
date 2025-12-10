// TypeScript interfaces for evacuation routes and shelters

export interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: [number, number]; // [longitude, latitude]
  endPoint: [number, number]; // [longitude, latitude]
  waypoints: [number, number][];
  distance: number; // in km
  estimatedTime: number; // in minutes
  capacity: number; // number of people
  roadType: 'paved' | 'unpaved' | 'highway';
  status: RouteStatus;
  affectedVillages: string[]; // village IDs
  destinationShelter: string; // shelter ID
}

export type RouteStatus = 'open' | 'congested' | 'blocked' | 'unsafe';

export interface Shelter {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  capacity: number;
  currentOccupancy: number;
  type: ShelterType;
  facilities: ShelterFacility[];
  district: string;
  province: string;
  status: ShelterStatus;
  contact: string;
  address: string;
}

export type ShelterType = 'school' | 'community-center' | 'government-building' | 'camp' | 'other';

export type ShelterStatus = 'available' | 'partial' | 'full' | 'closed';

export type ShelterFacility = 
  | 'food'
  | 'water'
  | 'medical'
  | 'electricity'
  | 'sanitation'
  | 'communication';

export interface EvacuationPlan {
  id: string;
  name: string;
  district: string;
  routes: EvacuationRoute[];
  shelters: Shelter[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'inactive' | 'standby' | 'active';
  lastUpdated: Date | string;
}

