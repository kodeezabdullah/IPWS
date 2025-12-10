// Mock data for Indus Pulse Warning System (IPWS)
// Simulates IoT device readings from 2-5 devices per city along Indus River

import { generateStations, getCriticalStations } from './generators/generateStations';
import { generateVillages, getHighRiskVillages, calculatePopulationAtRisk } from './generators/generateVillages';
import { generateBuffers, getCriticalBuffers } from './generators/generateBuffers';
import { generateMultipleTimeSeries } from './generators/generateTimeSeries';
import { generateShelters, getAvailableShelters } from './generators/generateShelters';
import { generateEvacuationRoutes, getCriticalRoutes } from './generators/generateRoutes';
import { generateAllPopulationData, calculatePopulationStatistics } from './generators/generatePopulationData';

// Generate all mock data
export const mockStations = generateStations(); // 205 sensors across 66 cities
export const mockShelters = generateShelters(); // ~21 shelter locations
export const mockVillages = generateVillages(); // ~177 villages along river
export const mockBuffers = generateBuffers(mockStations); // Dynamic buffers per station
export const mockEvacuationRoutes = generateEvacuationRoutes(mockVillages, mockShelters);
export const mockTimeSeries = generateMultipleTimeSeries(mockStations, 48); // 48 hours of data
export const mockPopulationData = generateAllPopulationData(mockStations); // Population near each sensor

// Calculated metrics
export const criticalStations = getCriticalStations(mockStations);
export const highRiskVillages = getHighRiskVillages(mockVillages);
export const totalPopulationAtRisk = calculatePopulationAtRisk(mockVillages);
export const criticalBuffers = getCriticalBuffers(mockBuffers);
export const availableShelters = getAvailableShelters(mockShelters);
export const criticalRoutes = getCriticalRoutes(mockEvacuationRoutes);

// Export functions for external use
export { getCriticalStations } from './generators/generateStations';
export { getHighRiskVillages, calculatePopulationAtRisk } from './generators/generateVillages';

// Alert counts by tier
export const alertCounts = {
  red: mockStations.filter(s => s.riskLevel === 'red').length,
  darkOrange: mockStations.filter(s => s.riskLevel === 'darkOrange').length,
  orange: mockStations.filter(s => s.riskLevel === 'orange').length,
  yellow: mockStations.filter(s => s.riskLevel === 'yellow').length,
};

// Population by risk tier
export const populationByRisk = {
  red: mockVillages.filter(v => v.riskLevel === 'red')
    .reduce((sum, v) => sum + v.population, 0),
  darkOrange: mockVillages.filter(v => v.riskLevel === 'darkOrange')
    .reduce((sum, v) => sum + v.population, 0),
  orange: mockVillages.filter(v => v.riskLevel === 'orange')
    .reduce((sum, v) => sum + v.population, 0),
  yellow: mockVillages.filter(v => v.riskLevel === 'yellow')
    .reduce((sum, v) => sum + v.population, 0),
};

/**
 * Get station by ID
 */
export function getStationById(id: string): typeof mockStations[0] | undefined {
  return mockStations.find(s => s.id === id);
}

/**
 * Get village by ID
 */
export function getVillageById(id: string): typeof mockVillages[0] | undefined {
  return mockVillages.find(v => v.id === id);
}

/**
 * Get shelter by ID
 */
export function getShelterById(id: string): typeof mockShelters[0] | undefined {
  return mockShelters.find(s => s.id === id);
}

/**
 * Get time series for station
 */
export function getTimeSeriesForStation(stationId: string) {
  return mockTimeSeries[stationId];
}

/**
 * Get population data for station
 */
export function getPopulationDataForStation(stationId: string) {
  return mockPopulationData.find(p => p.stationId === stationId);
}

/**
 * Regenerate all mock data (useful for testing)
 */
export function regenerateMockData() {
  const newStations = generateStations();
  const newShelters = generateShelters();
  const newVillages = generateVillages();
  const newBuffers = generateBuffers(newStations);
  const newRoutes = generateEvacuationRoutes(newVillages, newShelters);
  const newTimeSeries = generateMultipleTimeSeries(newStations, 48);

  return {
    stations: newStations,
    shelters: newShelters,
    villages: newVillages,
    buffers: newBuffers,
    routes: newRoutes,
    timeSeries: newTimeSeries,
  };
}

// Calculate population statistics
const populationStats = calculatePopulationStatistics(mockPopulationData);

// Export summary statistics
export const summaryStats = {
  totalStations: mockStations.length,
  activeStations: mockStations.filter(s => s.status === 'active').length,
  criticalStations: criticalStations.length,
  totalVillages: mockVillages.length,
  highRiskVillages: highRiskVillages.length,
  totalPopulation: mockVillages.reduce((sum, v) => sum + v.population, 0),
  populationAtRisk: totalPopulationAtRisk,
  totalShelters: mockShelters.length,
  availableShelterCapacity: availableShelters.reduce((sum, s) => sum + (s.capacity - s.currentOccupancy), 0),
  totalRoutes: mockEvacuationRoutes.length,
  criticalRoutes: criticalRoutes.length,
  alertCounts,
  populationByRisk,
  
  // Population data from sensors
  sensorPopulationStats: populationStats,
};

console.log('🌊 IPWS Mock Data Generated:');
console.log(`  📍 Stations: ${summaryStats.totalStations} (${summaryStats.criticalStations} critical)`);
console.log(`  🏘️  Villages: ${summaryStats.totalVillages} (${summaryStats.highRiskVillages} high-risk)`);
console.log(`  👥 Population at Risk: ${summaryStats.populationAtRisk.toLocaleString()}`);
console.log(`  👥 Sensor-Based Population: ${populationStats.totalPopulation.toLocaleString()} (${populationStats.totalHouseholds.toLocaleString()} households)`);
console.log(`  🏕️  Shelters: ${summaryStats.totalShelters} (capacity: ${summaryStats.availableShelterCapacity.toLocaleString()})`);
console.log(`  🛣️  Evacuation Routes: ${summaryStats.totalRoutes}`);
console.log(`  ⚠️  Alerts: ${alertCounts.red} red, ${alertCounts.darkOrange} dark orange, ${alertCounts.orange} orange, ${alertCounts.yellow} yellow`);
console.log(`  💰 Economic Impact: PKR ${(populationStats.totalEconomicLoss / 1_000_000_000).toFixed(2)} Billion`);
