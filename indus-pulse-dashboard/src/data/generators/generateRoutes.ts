// Generate evacuation routes for IPWS

import type { EvacuationRoute, RouteStatus } from '../../types/route';
import type { Village } from '../../types/village';
import type { Shelter } from '../../types/route';
import { generateId } from '../../lib/utils';

/**
 * Generate evacuation routes from villages to shelters
 */
export function generateEvacuationRoutes(
  villages: Village[],
  shelters: Shelter[]
): EvacuationRoute[] {
  const routes: EvacuationRoute[] = [];

  // Only create routes for high-risk villages (orange, darkOrange, red)
  const highRiskVillages = villages.filter(
    v => v.riskLevel === 'orange' || v.riskLevel === 'darkOrange' || v.riskLevel === 'red'
  );

  highRiskVillages.forEach((village) => {
    // Find nearest shelter
    const nearestShelter = findNearestShelter(village.coordinates, shelters);
    
    if (!nearestShelter) return;

    // Calculate route
    const distance = calculateDistance(
      village.coordinates[1],
      village.coordinates[0],
      nearestShelter.coordinates[1],
      nearestShelter.coordinates[0]
    );

    // Generate waypoints (simple 2-3 point route)
    const waypoints = generateWaypoints(
      village.coordinates,
      nearestShelter.coordinates,
      2 // number of waypoints
    );

    // Determine road type based on distance
    const roadType = distance < 10 ? 'paved' : distance < 30 ? 'highway' : 'unpaved';
    
    // Estimate time (km/h average speed)
    const avgSpeed = roadType === 'highway' ? 60 : roadType === 'paved' ? 40 : 25;
    const estimatedTime = Math.ceil((distance / avgSpeed) * 60); // in minutes

    // Determine status based on risk level
    let status: RouteStatus;
    if (village.riskLevel === 'red') {
      status = Math.random() > 0.7 ? 'congested' : Math.random() > 0.5 ? 'open' : 'unsafe';
    } else if (village.riskLevel === 'darkOrange') {
      status = Math.random() > 0.8 ? 'congested' : 'open';
    } else {
      status = 'open';
    }

    const route: EvacuationRoute = {
      id: generateId(),
      name: `${village.name} → ${nearestShelter.name}`,
      startPoint: village.coordinates,
      endPoint: nearestShelter.coordinates,
      waypoints,
      distance: parseFloat(distance.toFixed(2)),
      estimatedTime,
      capacity: Math.floor(village.population * 1.2), // 120% of village population
      roadType,
      status,
      affectedVillages: [village.id],
      destinationShelter: nearestShelter.id,
    };

    routes.push(route);
  });

  return routes;
}

/**
 * Generate waypoints between two coordinates
 */
function generateWaypoints(
  start: [number, number],
  end: [number, number],
  count: number
): [number, number][] {
  const waypoints: [number, number][] = [];
  
  for (let i = 1; i <= count; i++) {
    const ratio = i / (count + 1);
    // Add slight random deviation for more realistic routes
    const deviation = (Math.random() - 0.5) * 0.02;
    
    const lon = start[0] + (end[0] - start[0]) * ratio + deviation;
    const lat = start[1] + (end[1] - start[1]) * ratio + deviation;
    
    waypoints.push([lon, lat]);
  }
  
  return waypoints;
}

/**
 * Find nearest available shelter
 */
function findNearestShelter(
  coordinates: [number, number],
  shelters: Shelter[]
): Shelter | null {
  if (shelters.length === 0) return null;

  const availableShelters = shelters.filter(s => s.status !== 'full' && s.status !== 'closed');
  if (availableShelters.length === 0) return shelters[0]; // Fallback

  let nearest = availableShelters[0];
  let minDistance = calculateDistance(
    coordinates[1],
    coordinates[0],
    nearest.coordinates[1],
    nearest.coordinates[0]
  );

  availableShelters.forEach(shelter => {
    const distance = calculateDistance(
      coordinates[1],
      coordinates[0],
      shelter.coordinates[1],
      shelter.coordinates[0]
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = shelter;
    }
  });

  return nearest;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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

/**
 * Get routes by status
 */
export function getRoutesByStatus(status: RouteStatus, routes: EvacuationRoute[]): EvacuationRoute[] {
  return routes.filter(r => r.status === status);
}

/**
 * Get critical routes (blocked or unsafe)
 */
export function getCriticalRoutes(routes: EvacuationRoute[]): EvacuationRoute[] {
  return routes.filter(r => r.status === 'blocked' || r.status === 'unsafe');
}

