// Generate population data near each IoT sensor station

import type { Station } from '../../types/station';

export interface PopulationRing {
  distance: string; // e.g., "0-500m", "500m-1km"
  population: number;
  households: number;
  vulnerablePopulation: {
    children: number; // Under 15 years
    elderly: number; // Over 65 years
    disabled: number;
  };
}

export interface PopulationData {
  stationId: string;
  stationName: string;
  deviceId: string;
  city: string;
  district: string;
  province: string;
  coordinates: [number, number];
  riskLevel: string;
  
  // Total population within different buffer zones
  bufferZones: {
    '500m': number;
    '1km': number;
    '1.5km': number;
    '2km': number;
  };
  
  // Detailed breakdown by distance rings
  populationRings: PopulationRing[];
  
  // Total affected population (based on current risk level)
  totalAffectedPopulation: number;
  totalHouseholds: number;
  
  // Demographics
  demographics: {
    totalPopulation: number;
    children: number;
    adults: number;
    elderly: number;
    disabled: number;
    averageHouseholdSize: number;
  };
  
  // Economic data
  economicData: {
    primaryOccupation: string;
    estimatedEconomicLoss: number; // in PKR
    livestockCount: number;
    agriculturalLand: number; // in hectares
  };
}

/**
 * Calculate population density based on region
 */
function getPopulationDensity(province: string, city: string): number {
  // Population density (people per km²)
  const densityMap: Record<string, number> = {
    // High density urban areas (Sindh)
    'Hyderabad': 6000,
    'Karachi Port': 8000,
    'Keamari': 7500,
    'Bin Qasim': 7000,
    'Latifabad': 6500,
    'Sukkur': 5500,
    'Rohri': 5000,
    
    // Medium-high density (Urban Punjab/Sindh)
    'Dera Ghazi Khan': 4000,
    'Dera Ismail Khan': 4000,
    'Rajanpur': 3500,
    'Ghotki': 3500,
    'Khairpur': 3500,
    'Thatta': 3000,
    'Attock City': 3500,
    
    // Medium density (Semi-urban)
    'Mianwali City': 2500,
    'Kashmore': 2800,
    'Kotri': 3000,
    'Jamshoro': 2500,
    'Taunsa': 2200,
    'Kalabagh': 2000,
    
    // Lower density (Rural/Mountain areas)
    'Skardu': 1200,
    'Gilgit': 1500,
    'Chilas': 1000,
    'Besham': 1800,
    'Tarbela Dam': 2000,
    'Dasu': 800,
  };

  // Get specific city density or default by province
  if (densityMap[city]) {
    return densityMap[city];
  }

  // Province defaults
  if (province === 'Sindh') return 2500;
  if (province === 'Punjab') return 2000;
  if (province === 'Khyber Pakhtunkhwa') return 1500;
  if (province === 'Gilgit-Baltistan') return 800;
  
  return 1500; // Default
}

/**
 * Calculate population within circular buffer zone
 */
function calculatePopulationInBuffer(
  radiusKm: number,
  density: number
): number {
  const area = Math.PI * radiusKm * radiusKm; // km²
  return Math.floor(area * density);
}

/**
 * Generate population data for a single station
 */
export function generatePopulationDataForStation(station: Station): PopulationData {
  const density = getPopulationDensity(station.province, station.city);
  
  // Calculate population in different buffer zones
  const pop500m = calculatePopulationInBuffer(0.5, density);
  const pop1km = calculatePopulationInBuffer(1.0, density);
  const pop1_5km = calculatePopulationInBuffer(1.5, density);
  const pop2km = calculatePopulationInBuffer(2.0, density);
  
  // Population rings (incremental)
  const ring1 = pop500m; // 0-500m
  const ring2 = pop1km - pop500m; // 500m-1km
  const ring3 = pop1_5km - pop1km; // 1km-1.5km
  const ring4 = pop2km - pop1_5km; // 1.5km-2km
  
  // Total affected population based on risk level
  let totalAffected: number;
  switch (station.riskLevel) {
    case 'red':
      totalAffected = pop2km; // 2km evacuation zone
      break;
    case 'darkOrange':
      totalAffected = pop1_5km; // 1.5km evacuation zone
      break;
    case 'orange':
      totalAffected = pop1km; // 1km evacuation zone
      break;
    default:
      totalAffected = pop500m; // 500m alert zone
  }
  
  // Demographics breakdown (realistic percentages for Pakistan)
  const children = Math.floor(totalAffected * 0.36); // 36% under 15
  const elderly = Math.floor(totalAffected * 0.04); // 4% over 65
  const adults = totalAffected - children - elderly;
  const disabled = Math.floor(totalAffected * 0.025); // 2.5% disabled
  
  const averageHouseholdSize = 6.5; // Pakistan average
  const totalHouseholds = Math.floor(totalAffected / averageHouseholdSize);
  
  // Generate population rings with demographics
  const populationRings: PopulationRing[] = [
    {
      distance: '0-500m',
      population: ring1,
      households: Math.floor(ring1 / averageHouseholdSize),
      vulnerablePopulation: {
        children: Math.floor(ring1 * 0.36),
        elderly: Math.floor(ring1 * 0.04),
        disabled: Math.floor(ring1 * 0.025),
      },
    },
    {
      distance: '500m-1km',
      population: ring2,
      households: Math.floor(ring2 / averageHouseholdSize),
      vulnerablePopulation: {
        children: Math.floor(ring2 * 0.36),
        elderly: Math.floor(ring2 * 0.04),
        disabled: Math.floor(ring2 * 0.025),
      },
    },
    {
      distance: '1km-1.5km',
      population: ring3,
      households: Math.floor(ring3 / averageHouseholdSize),
      vulnerablePopulation: {
        children: Math.floor(ring3 * 0.36),
        elderly: Math.floor(ring3 * 0.04),
        disabled: Math.floor(ring3 * 0.025),
      },
    },
    {
      distance: '1.5km-2km',
      population: ring4,
      households: Math.floor(ring4 / averageHouseholdSize),
      vulnerablePopulation: {
        children: Math.floor(ring4 * 0.36),
        elderly: Math.floor(ring4 * 0.04),
        disabled: Math.floor(ring4 * 0.025),
      },
    },
  ];
  
  // Economic data based on region
  const primaryOccupation = station.province === 'Sindh' || station.province === 'Punjab'
    ? 'Agriculture'
    : station.city.includes('Karachi')
      ? 'Trade'
      : 'Agriculture';
  
  // Estimated economic loss per capita (PKR) - higher for urban areas
  const lossPerCapita = density > 4000 ? 150000 : density > 2000 ? 100000 : 75000;
  const estimatedEconomicLoss = totalAffected * lossPerCapita;
  
  // Livestock and agricultural land (more in rural areas)
  const livestockPerHousehold = density < 2000 ? 8 : density < 4000 ? 3 : 1;
  const livestockCount = Math.floor(totalHouseholds * livestockPerHousehold);
  
  const agriculturalLandPerHousehold = density < 2000 ? 2.5 : density < 4000 ? 1.0 : 0.2;
  const agriculturalLand = parseFloat((totalHouseholds * agriculturalLandPerHousehold).toFixed(2));
  
  const populationData: PopulationData = {
    stationId: station.id,
    stationName: station.name,
    deviceId: station.deviceId,
    city: station.city,
    district: station.district,
    province: station.province,
    coordinates: station.coordinates,
    riskLevel: station.riskLevel,
    
    bufferZones: {
      '500m': pop500m,
      '1km': pop1km,
      '1.5km': pop1_5km,
      '2km': pop2km,
    },
    
    populationRings,
    
    totalAffectedPopulation: totalAffected,
    totalHouseholds,
    
    demographics: {
      totalPopulation: totalAffected,
      children,
      adults,
      elderly,
      disabled,
      averageHouseholdSize,
    },
    
    economicData: {
      primaryOccupation,
      estimatedEconomicLoss,
      livestockCount,
      agriculturalLand,
    },
  };
  
  return populationData;
}

/**
 * Generate population data for all stations
 */
export function generateAllPopulationData(stations: Station[]): PopulationData[] {
  return stations.map(station => generatePopulationDataForStation(station));
}

/**
 * Calculate total statistics from all population data
 */
export function calculatePopulationStatistics(populationData: PopulationData[]) {
  const totalPopulation = populationData.reduce((sum, data) => sum + data.totalAffectedPopulation, 0);
  const totalHouseholds = populationData.reduce((sum, data) => sum + data.totalHouseholds, 0);
  const totalChildren = populationData.reduce((sum, data) => sum + data.demographics.children, 0);
  const totalElderly = populationData.reduce((sum, data) => sum + data.demographics.elderly, 0);
  const totalDisabled = populationData.reduce((sum, data) => sum + data.demographics.disabled, 0);
  const totalEconomicLoss = populationData.reduce((sum, data) => sum + data.economicData.estimatedEconomicLoss, 0);
  const totalLivestock = populationData.reduce((sum, data) => sum + data.economicData.livestockCount, 0);
  const totalAgriculturalLand = populationData.reduce((sum, data) => sum + data.economicData.agriculturalLand, 0);
  
  // By risk level
  const byRiskLevel = {
    red: populationData.filter(d => d.riskLevel === 'red').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    darkOrange: populationData.filter(d => d.riskLevel === 'darkOrange').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    orange: populationData.filter(d => d.riskLevel === 'orange').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    yellow: populationData.filter(d => d.riskLevel === 'yellow').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
  };
  
  // By province
  const byProvince = {
    'Gilgit-Baltistan': populationData.filter(d => d.province === 'Gilgit-Baltistan').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    'Khyber Pakhtunkhwa': populationData.filter(d => d.province === 'Khyber Pakhtunkhwa').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    'Punjab': populationData.filter(d => d.province === 'Punjab').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
    'Sindh': populationData.filter(d => d.province === 'Sindh').reduce((sum, d) => sum + d.totalAffectedPopulation, 0),
  };
  
  return {
    totalPopulation,
    totalHouseholds,
    totalChildren,
    totalElderly,
    totalDisabled,
    totalEconomicLoss,
    totalLivestock,
    totalAgriculturalLand,
    byRiskLevel,
    byProvince,
  };
}

