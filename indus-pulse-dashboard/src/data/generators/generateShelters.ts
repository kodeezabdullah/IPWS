// Generate shelter and relief camp locations for IPWS

import type { Shelter, ShelterType, ShelterStatus, ShelterFacility } from '../../types/route';
import { generateId } from '../../lib/utils';

// Safe zones / high ground areas near major cities
const SHELTER_LOCATIONS = [
  // Upper Indus
  { city: 'Skardu', name: 'Skardu Central School', lat: 35.3100, lon: 75.6500, type: 'school', capacity: 500 },
  { city: 'Gilgit', name: 'Gilgit Community Center', lat: 35.9300, lon: 74.3300, type: 'community-center', capacity: 800 },
  { city: 'Chilas', name: 'Chilas Government College', lat: 35.4350, lon: 74.1100, type: 'school', capacity: 400 },
  { city: 'Besham', name: 'Besham Relief Camp', lat: 34.9400, lon: 72.9000, type: 'camp', capacity: 600 },
  { city: 'Tarbela', name: 'Tarbela Relief Station', lat: 34.1000, lon: 72.7200, type: 'government-building', capacity: 1000 },
  
  // Middle Indus  
  { city: 'Attock', name: 'Attock Fort Relief Center', lat: 33.7800, lon: 72.3800, type: 'government-building', capacity: 1200 },
  { city: 'Attock', name: 'Attock City Hall', lat: 33.7650, lon: 72.3500, type: 'community-center', capacity: 800 },
  { city: 'Mianwali', name: 'Mianwali Stadium', lat: 32.5950, lon: 71.5600, type: 'other', capacity: 1500 },
  { city: 'Dera Ismail Khan', name: 'DI Khan Relief Camp 1', lat: 31.8450, lon: 70.9200, type: 'camp', capacity: 2000 },
  { city: 'Dera Ismail Khan', name: 'DI Khan Community Hall', lat: 31.8200, lon: 70.8900, type: 'community-center', capacity: 1000 },
  { city: 'Dera Ghazi Khan', name: 'DG Khan Sports Complex', lat: 30.0700, lon: 70.6500, type: 'other', capacity: 2500 },
  { city: 'Dera Ghazi Khan', name: 'DG Khan Relief Station', lat: 30.0450, lon: 70.6200, type: 'camp', capacity: 1800 },
  { city: 'Rajanpur', name: 'Rajanpur School Complex', lat: 29.1150, lon: 70.3450, type: 'school', capacity: 700 },
  
  // Lower Indus
  { city: 'Kashmore', name: 'Kashmore Relief Center', lat: 28.4450, lon: 69.6000, type: 'government-building', capacity: 1500 },
  { city: 'Sukkur', name: 'Sukkur Barrage Camp', lat: 27.7200, lon: 68.8750, type: 'camp', capacity: 3000 },
  { city: 'Sukkur', name: 'Sukkur City Stadium', lat: 27.6950, lon: 68.8450, type: 'other', capacity: 2000 },
  { city: 'Khairpur', name: 'Khairpur Relief Station', lat: 27.5400, lon: 68.7750, type: 'community-center', capacity: 1200 },
  { city: 'Hyderabad', name: 'Hyderabad Central Camp', lat: 25.4100, lon: 68.3750, type: 'camp', capacity: 4000 },
  { city: 'Hyderabad', name: 'Hyderabad Sports Complex', lat: 25.3850, lon: 68.3450, type: 'other', capacity: 2500 },
  { city: 'Thatta', name: 'Thatta Relief Center', lat: 24.7600, lon: 67.9400, type: 'government-building', capacity: 1500 },
  { city: 'Karachi Delta', name: 'Karachi Coastal Camp', lat: 24.2750, lon: 67.3000, type: 'camp', capacity: 2000 },
];

const COMMON_FACILITIES: ShelterFacility[] = ['food', 'water', 'sanitation'];
const MEDICAL_FACILITIES: ShelterFacility[] = [...COMMON_FACILITIES, 'medical'];
const FULL_FACILITIES: ShelterFacility[] = [...MEDICAL_FACILITIES, 'electricity', 'communication'];

/**
 * Generate shelter and relief camp locations
 */
export function generateShelters(): Shelter[] {
  return SHELTER_LOCATIONS.map((loc) => {
    // Larger capacity shelters get better facilities
    const facilities = loc.capacity >= 2000 
      ? FULL_FACILITIES 
      : loc.capacity >= 1000 
        ? MEDICAL_FACILITIES 
        : COMMON_FACILITIES;

    // Current occupancy varies
    const currentOccupancy = Math.floor(Math.random() * (loc.capacity * 0.4)); // 0-40% occupied
    
    let status: ShelterStatus;
    const occupancyRate = currentOccupancy / loc.capacity;
    if (occupancyRate >= 0.95) status = 'full';
    else if (occupancyRate >= 0.7) status = 'partial';
    else status = 'available';

    const shelter: Shelter = {
      id: generateId(),
      name: loc.name,
      coordinates: [loc.lon, loc.lat],
      capacity: loc.capacity,
      currentOccupancy,
      type: loc.type as ShelterType,
      facilities,
      district: loc.city,
      province: getProvince(loc.city),
      status,
      contact: generatePhoneNumber(),
      address: `${loc.name}, ${loc.city}`,
    };

    return shelter;
  });
}

/**
 * Get shelters by city
 */
export function getSheltersByCity(city: string, allShelters: Shelter[]): Shelter[] {
  return allShelters.filter(s => s.district === city);
}

/**
 * Get available shelters
 */
export function getAvailableShelters(allShelters: Shelter[]): Shelter[] {
  return allShelters.filter(s => s.status === 'available' || s.status === 'partial');
}

/**
 * Find nearest shelter to a location
 */
export function findNearestShelter(
  lat: number,
  lon: number,
  allShelters: Shelter[]
): Shelter | null {
  if (allShelters.length === 0) return null;

  let nearest = allShelters[0];
  let minDistance = calculateDistance(lat, lon, nearest.coordinates[1], nearest.coordinates[0]);

  allShelters.forEach(shelter => {
    const distance = calculateDistance(lat, lon, shelter.coordinates[1], shelter.coordinates[0]);
    if (distance < minDistance && shelter.status !== 'full') {
      minDistance = distance;
      nearest = shelter;
    }
  });

  return nearest;
}

// Helper functions
function getProvince(city: string): string {
  const provinceMap: Record<string, string> = {
    'Skardu': 'Gilgit-Baltistan',
    'Gilgit': 'Gilgit-Baltistan',
    'Chilas': 'Gilgit-Baltistan',
    'Besham': 'Khyber Pakhtunkhwa',
    'Tarbela': 'Khyber Pakhtunkhwa',
    'Dera Ismail Khan': 'Khyber Pakhtunkhwa',
    'Attock': 'Punjab',
    'Mianwali': 'Punjab',
    'Dera Ghazi Khan': 'Punjab',
    'Rajanpur': 'Punjab',
    'Kashmore': 'Sindh',
    'Sukkur': 'Sindh',
    'Khairpur': 'Sindh',
    'Hyderabad': 'Sindh',
    'Thatta': 'Sindh',
    'Karachi Delta': 'Sindh',
  };
  return provinceMap[city] || 'Punjab';
}

function generatePhoneNumber(): string {
  const codes = ['051', '042', '021', '061', '071'];
  const code = codes[Math.floor(Math.random() * codes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+92-${code}-${number}`;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

