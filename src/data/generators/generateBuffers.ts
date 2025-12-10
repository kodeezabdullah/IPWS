// Generate buffer zones around monitoring stations based on risk tier

import type { BufferZone } from '../../types/buffer';
import type { Station } from '../../types/station';
import { generateId } from '../../lib/utils';
import { RISK_BUFFER_ZONES } from '../../lib/constants';

/**
 * Generate dynamic buffer zones around monitoring stations
 * Buffer size depends on risk tier:
 * - Yellow: 500m
 * - Orange: 1km
 * - Dark Orange: 1.5km
 * - Red: 2km
 */
export function generateBuffers(stations: Station[]): BufferZone[] {
  const buffers: BufferZone[] = [];

  stations.forEach((station) => {
    // Get buffer radius based on risk level
    const radius = RISK_BUFFER_ZONES[station.riskLevel];

    const buffer: BufferZone = {
      id: generateId(),
      stationId: station.id,
      radius,
      type: getBufferType(station.riskLevel),
      coordinates: station.coordinates,
      affectedVillages: [], // Will be calculated by spatial join
      population: estimatePopulation(radius, station.city),
      riskLevel: station.riskLevel,
    };

    buffers.push(buffer);
  });

  return buffers;
}

/**
 * Map risk level to buffer type
 */
function getBufferType(riskLevel: string): 'inner' | 'middle' | 'outer' {
  switch (riskLevel) {
    case 'red':
    case 'darkOrange':
      return 'inner';
    case 'orange':
      return 'middle';
    default:
      return 'outer';
  }
}

/**
 * Estimate population within buffer zone
 * Based on radius and city density
 */
function estimatePopulation(radius: number, city: string): number {
  // Population density varies by region
  const densityMap: Record<string, number> = {
    'Hyderabad': 5000,
    'Sukkur': 4500,
    'Karachi Delta': 6000,
    'Dera Ghazi Khan': 3500,
    'Dera Ismail Khan': 3500,
    'Attock': 3000,
    'Kashmore': 2500,
    'Mianwali': 2000,
    'Tarbela': 2000,
    'Thatta': 2500,
    'Khairpur': 2500,
    'Rajanpur': 2000,
    'Besham': 1500,
    'Chilas': 1000,
    'Gilgit': 1200,
    'Skardu': 1000,
  };

  const density = densityMap[city] || 2000; // people per km²
  const area = Math.PI * radius * radius; // km²
  
  return Math.floor(area * density * (0.7 + Math.random() * 0.6)); // Some variation
}

/**
 * Get buffers by risk level
 */
export function getBuffersByRisk(riskLevel: string, buffers: BufferZone[]): BufferZone[] {
  return buffers.filter(b => b.riskLevel === riskLevel);
}

/**
 * Get critical buffers (red and darkOrange)
 */
export function getCriticalBuffers(buffers: BufferZone[]): BufferZone[] {
  return buffers.filter(b => b.riskLevel === 'red' || b.riskLevel === 'darkOrange');
}

/**
 * Calculate total population in buffer zones
 */
export function calculateBufferPopulation(buffers: BufferZone[]): number {
  return buffers.reduce((sum, buffer) => sum + buffer.population, 0);
}
