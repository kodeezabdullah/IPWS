// Generate villages along Indus River with risk assessment

import type { Village } from '../../types/village';
import { generateId } from '../../lib/utils';

// Villages clustered near major cities along Indus
const VILLAGE_CLUSTERS = [
  // Upper Indus
  { city: 'Skardu', baseLat: 35.297, baseLon: 75.633, count: 5 },
  { city: 'Gilgit', baseLat: 35.921, baseLon: 74.314, count: 6 },
  { city: 'Chilas', baseLat: 35.421, baseLon: 74.096, count: 5 },
  { city: 'Besham', baseLat: 34.926, baseLon: 72.883, count: 8 },
  { city: 'Tarbela', baseLat: 34.089, baseLon: 72.701, count: 10 },
  
  // Middle Indus
  { city: 'Attock', baseLat: 33.768, baseLon: 72.360, count: 12 },
  { city: 'Mianwali', baseLat: 32.585, baseLon: 71.544, count: 10 },
  { city: 'Dera Ismail Khan', baseLat: 31.831, baseLon: 70.902, count: 15 },
  { city: 'Dera Ghazi Khan', baseLat: 30.056, baseLon: 70.635, count: 15 },
  { city: 'Rajanpur', baseLat: 29.104, baseLon: 70.330, count: 12 },
  
  // Lower Indus
  { city: 'Kashmore', baseLat: 28.432, baseLon: 69.584, count: 14 },
  { city: 'Sukkur', baseLat: 27.705, baseLon: 68.857, count: 18 },
  { city: 'Khairpur', baseLat: 27.530, baseLon: 68.759, count: 12 },
  { city: 'Hyderabad', baseLat: 25.396, baseLon: 68.358, count: 20 },
  { city: 'Thatta', baseLat: 24.747, baseLon: 67.925, count: 15 },
  { city: 'Karachi Delta', baseLat: 24.261, baseLon: 67.285, count: 10 },
];

const VILLAGE_PREFIXES = [
  'Kot', 'Chak', 'Khanpur', 'Rahimabad', 'Sultanpur', 'Fatehpur', 
  'Islamabad', 'Mohammadpur', 'Alipur', 'Hussainabad', 'Wazirabad',
  'Nawabpur', 'Sharifabad', 'Karimabad', 'Yusufpur'
];

const VILLAGE_SUFFIXES = ['', ' Kalan', ' Khurd', ' Sharif', ' Wala', ' Colony'];

const PROVINCES = {
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

/**
 * Calculate risk level based on distance from river
 */
function calculateRiskLevel(distanceKm: number): 'yellow' | 'orange' | 'darkOrange' | 'red' {
  if (distanceKm < 2) return 'red';           // <2km: Critical
  if (distanceKm < 5) return 'darkOrange';    // 2-5km: Very dangerous
  if (distanceKm < 10) return 'orange';       // 5-10km: Moderate threat
  return 'yellow';                            // >10km: Mild alert
}

/**
 * Generate villages along Indus River
 * Villages are distributed near cities with varying distances from river
 */
export function generateVillages(): Village[] {
  const villages: Village[] = [];
  let villageIndex = 0;

  VILLAGE_CLUSTERS.forEach((cluster) => {
    for (let i = 0; i < cluster.count; i++) {
      // Spread villages around the city (within ~15km radius)
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const radius = 0.05 + Math.random() * 0.15; // 0.05-0.2 degrees (~5-20km)
      
      const lat = cluster.baseLat + radius * Math.sin(angle);
      const lon = cluster.baseLon + radius * Math.cos(angle);

      // Distance to river (realistic: 1-25km)
      const distanceToRiver = parseFloat((0.5 + Math.random() * 24.5).toFixed(2));
      const riskLevel = calculateRiskLevel(distanceToRiver);
      
      // Population varies by region (more in lower Indus)
      const isLowerIndus = cluster.city === 'Hyderabad' || cluster.city === 'Sukkur' || 
                           cluster.city === 'Thatta' || cluster.city === 'Karachi Delta';
      const populationBase = isLowerIndus ? 2000 : 800;
      const population = Math.floor(populationBase + Math.random() * (isLowerIndus ? 8000 : 4000));

      const villageName = 
        VILLAGE_PREFIXES[villageIndex % VILLAGE_PREFIXES.length] +
        VILLAGE_SUFFIXES[Math.floor(Math.random() * VILLAGE_SUFFIXES.length)];

      const village: Village = {
        id: generateId(),
        name: villageName,
        coordinates: [lon, lat],
        population,
        district: cluster.city,
        province: PROVINCES[cluster.city as keyof typeof PROVINCES],
        riskLevel,
        nearestStationId: generateId(), // Will be linked to actual stations later
        distanceToRiver,
        elevation: parseFloat((150 + Math.random() * 500).toFixed(1)),
        evacuationPlan: riskLevel === 'red' || riskLevel === 'darkOrange' 
          ? true 
          : Math.random() > 0.4,
        shelterCapacity: (riskLevel === 'red' || riskLevel === 'darkOrange')
          ? Math.floor(population * 0.9)
          : Math.random() > 0.5 
            ? Math.floor(population * 0.7) 
            : undefined,
      };

      villages.push(village);
      villageIndex++;
    }
  });

  return villages;
}

/**
 * Get villages by risk level
 */
export function getVillagesByRisk(riskLevel: string, villages: Village[]): Village[] {
  return villages.filter(v => v.riskLevel === riskLevel);
}

/**
 * Get high-risk villages (darkOrange and red)
 */
export function getHighRiskVillages(villages: Village[]): Village[] {
  return villages.filter(v => v.riskLevel === 'darkOrange' || v.riskLevel === 'red');
}

/**
 * Calculate total population at risk
 */
export function calculatePopulationAtRisk(villages: Village[]): number {
  const highRiskVillages = getHighRiskVillages(villages);
  return highRiskVillages.reduce((sum, village) => sum + village.population, 0);
}
