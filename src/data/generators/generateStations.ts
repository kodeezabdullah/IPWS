// Generate realistic IoT monitoring stations along Indus River
// 200 sensors distributed across entire Indus River basin

import type { Station } from '../../types/station';
import { generateId } from '../../lib/utils';
import { RISK_THRESHOLDS } from '../../lib/constants';

// Comprehensive list of cities and towns along Indus River (north to south)
// 200 sensors distributed based on population density and flood risk
const INDUS_CITIES = [
  // ===== UPPER INDUS: Gilgit-Baltistan (Headwaters) =====
  { name: 'Skardu', lat: 35.2971, lon: 75.6333, province: 'Gilgit-Baltistan', district: 'Skardu', devices: 4 },
  { name: 'Shigar', lat: 35.4277, lon: 75.7348, province: 'Gilgit-Baltistan', district: 'Shigar', devices: 2 },
  { name: 'Khaplu', lat: 35.1434, lon: 76.3373, province: 'Gilgit-Baltistan', district: 'Ghanche', devices: 2 },
  { name: 'Gilgit', lat: 35.9208, lon: 74.3144, province: 'Gilgit-Baltistan', district: 'Gilgit', devices: 4 },
  { name: 'Bunji', lat: 35.6658, lon: 74.6358, province: 'Gilgit-Baltistan', district: 'Astore', devices: 2 },
  { name: 'Chilas', lat: 35.4207, lon: 74.0960, province: 'Gilgit-Baltistan', district: 'Diamer', devices: 4 },
  { name: 'Dasu', lat: 35.5180, lon: 73.3380, province: 'Khyber Pakhtunkhwa', district: 'Upper Kohistan', devices: 3 },
  
  // ===== UPPER KPK (High Flood Risk Zone) =====
  { name: 'Pattan', lat: 34.8833, lon: 72.8833, province: 'Khyber Pakhtunkhwa', district: 'Kohistan', devices: 2 },
  { name: 'Besham', lat: 34.9260, lon: 72.8828, province: 'Khyber Pakhtunkhwa', district: 'Shangla', devices: 3 },
  { name: 'Thakot', lat: 34.5667, lon: 72.9167, province: 'Khyber Pakhtunkhwa', district: 'Battagram', devices: 2 },
  { name: 'Tarbela Dam', lat: 34.0894, lon: 72.7014, province: 'Khyber Pakhtunkhwa', district: 'Haripur', devices: 6 },
  { name: 'Ghazi', lat: 34.0500, lon: 72.4500, province: 'Khyber Pakhtunkhwa', district: 'Haripur', devices: 2 },
  { name: 'Haripur', lat: 33.9944, lon: 72.9347, province: 'Khyber Pakhtunkhwa', district: 'Haripur', devices: 2 },
  
  // ===== POTHOHAR & ATTOCK REGION =====
  { name: 'Attock City', lat: 33.7681, lon: 72.3600, province: 'Punjab', district: 'Attock', devices: 4 },
  { name: 'Attock Khurd', lat: 33.8833, lon: 72.3667, province: 'Punjab', district: 'Attock', devices: 2 },
  { name: 'Kamra', lat: 33.8456, lon: 72.4011, province: 'Punjab', district: 'Attock', devices: 2 },
  
  // ===== MIANWALI & SURROUNDING =====
  { name: 'Mianwali City', lat: 32.5853, lon: 71.5436, province: 'Punjab', district: 'Mianwali', devices: 4 },
  { name: 'Kundian', lat: 32.4583, lon: 71.4789, province: 'Punjab', district: 'Mianwali', devices: 2 },
  { name: 'Kalabagh', lat: 32.9622, lon: 71.5447, province: 'Punjab', district: 'Mianwali', devices: 3 },
  { name: 'Chashma', lat: 32.4333, lon: 71.4667, province: 'Punjab', district: 'Mianwali', devices: 3 },
  { name: 'Isakhel', lat: 32.6833, lon: 71.2667, province: 'Punjab', district: 'Mianwali', devices: 2 },
  
  // ===== DERA ISMAIL KHAN REGION (KPK Side) =====
  { name: 'Dera Ismail Khan', lat: 31.8314, lon: 70.9020, province: 'Khyber Pakhtunkhwa', district: 'Dera Ismail Khan', devices: 5 },
  { name: 'Paharpur', lat: 31.9333, lon: 70.9667, province: 'Khyber Pakhtunkhwa', district: 'Dera Ismail Khan', devices: 2 },
  { name: 'Darya Khan', lat: 31.7833, lon: 71.1000, province: 'Punjab', district: 'Bhakkar', devices: 2 },
  { name: 'Bhakkar', lat: 31.6333, lon: 71.0667, province: 'Punjab', district: 'Bhakkar', devices: 3 },
  
  // ===== DERA GHAZI KHAN DIVISION (High Risk) =====
  { name: 'Dera Ghazi Khan', lat: 30.0561, lon: 70.6345, province: 'Punjab', district: 'Dera Ghazi Khan', devices: 7 },
  { name: 'Taunsa', lat: 30.7035, lon: 70.6528, province: 'Punjab', district: 'Dera Ghazi Khan', devices: 3 },
  { name: 'Rajanpur', lat: 29.1044, lon: 70.3301, province: 'Punjab', district: 'Rajanpur', devices: 6 },
  { name: 'Rojhan', lat: 28.6975, lon: 69.9500, province: 'Punjab', district: 'Rajanpur', devices: 4 },
  { name: 'Jampur', lat: 29.6417, lon: 70.5897, province: 'Punjab', district: 'Rajanpur', devices: 3 },
  
  // ===== KASHMORE & UPPER SINDH =====
  { name: 'Kashmore', lat: 28.4323, lon: 69.5843, province: 'Sindh', district: 'Kashmore', devices: 4 },
  { name: 'Kandhkot', lat: 28.2500, lon: 69.1833, province: 'Sindh', district: 'Kashmore', devices: 3 },
  { name: 'Guddu', lat: 28.4333, lon: 69.7333, province: 'Sindh', district: 'Kashmore', devices: 3 },
  { name: 'Ghotki', lat: 28.0097, lon: 69.3153, province: 'Sindh', district: 'Ghotki', devices: 5 },
  { name: 'Mirpur Mathelo', lat: 28.0208, lon: 69.5564, province: 'Sindh', district: 'Ghotki', devices: 3 },
  
  // ===== SUKKUR REGION (Critical Barrage Area) =====
  { name: 'Sukkur', lat: 27.7052, lon: 68.8574, province: 'Sindh', district: 'Sukkur', devices: 7 },
  { name: 'Rohri', lat: 27.6917, lon: 68.8950, province: 'Sindh', district: 'Sukkur', devices: 4 },
  { name: 'Pano Aqil', lat: 27.8556, lon: 69.1103, province: 'Sindh', district: 'Sukkur', devices: 3 },
  { name: 'New Sukkur', lat: 27.7333, lon: 68.8333, province: 'Sindh', district: 'Sukkur', devices: 2 },
  
  // ===== KHAIRPUR & SURROUNDING =====
  { name: 'Khairpur', lat: 27.5295, lon: 68.7590, province: 'Sindh', district: 'Khairpur', devices: 4 },
  { name: 'Kot Diji', lat: 27.3417, lon: 68.7078, province: 'Sindh', district: 'Khairpur', devices: 2 },
  { name: 'Gambat', lat: 27.3500, lon: 68.5333, province: 'Sindh', district: 'Khairpur', devices: 2 },
  { name: 'Ranipur', lat: 27.2833, lon: 68.5167, province: 'Sindh', district: 'Khairpur', devices: 2 },
  
  // ===== LARKANA & WEST SINDH =====
  { name: 'Larkana', lat: 27.5600, lon: 68.2140, province: 'Sindh', district: 'Larkana', devices: 3 },
  { name: 'Mehar', lat: 27.1833, lon: 67.8167, province: 'Sindh', district: 'Dadu', devices: 2 },
  { name: 'Dadu', lat: 26.7310, lon: 67.7760, province: 'Sindh', district: 'Dadu', devices: 3 },
  
  // ===== NAUSHAHRO FEROZE & CENTRAL SINDH =====
  { name: 'Naushahro Feroze', lat: 26.8417, lon: 68.1253, province: 'Sindh', district: 'Naushahro Feroze', devices: 2 },
  { name: 'Moro', lat: 26.6633, lon: 68.0028, province: 'Sindh', district: 'Naushahro Feroze', devices: 2 },
  { name: 'Kandiaro', lat: 27.0597, lon: 68.2108, province: 'Sindh', district: 'Naushahro Feroze', devices: 2 },
  
  // ===== HYDERABAD REGION (Dense Population) =====
  { name: 'Hyderabad', lat: 25.3960, lon: 68.3578, province: 'Sindh', district: 'Hyderabad', devices: 10 },
  { name: 'Latifabad', lat: 25.3803, lon: 68.3369, province: 'Sindh', district: 'Hyderabad', devices: 3 },
  { name: 'Kotri', lat: 25.3650, lon: 68.3089, province: 'Sindh', district: 'Jamshoro', devices: 4 },
  { name: 'Jamshoro', lat: 25.4319, lon: 68.2808, province: 'Sindh', district: 'Jamshoro', devices: 3 },
  { name: 'Sehwan', lat: 26.4242, lon: 67.8611, province: 'Sindh', district: 'Jamshoro', devices: 2 },
  
  // ===== MATIARI & TANDO REGIONS =====
  { name: 'Matiari', lat: 25.5975, lon: 68.4467, province: 'Sindh', district: 'Matiari', devices: 2 },
  { name: 'Hala', lat: 25.8167, lon: 68.4167, province: 'Sindh', district: 'Matiari', devices: 2 },
  { name: 'Tando Allahyar', lat: 25.4603, lon: 68.7169, province: 'Sindh', district: 'Tando Allahyar', devices: 2 },
  { name: 'Tando Muhammad Khan', lat: 25.1233, lon: 68.5378, province: 'Sindh', district: 'Tando Muhammad Khan', devices: 2 },
  
  // ===== THATTA & DELTA REGION =====
  { name: 'Thatta', lat: 24.7471, lon: 67.9246, province: 'Sindh', district: 'Thatta', devices: 5 },
  { name: 'Makli', lat: 24.7667, lon: 68.0000, province: 'Sindh', district: 'Thatta', devices: 2 },
  { name: 'Keti Bandar', lat: 24.1444, lon: 67.4508, province: 'Sindh', district: 'Thatta', devices: 2 },
  { name: 'Shah Bandar', lat: 24.7167, lon: 67.7167, province: 'Sindh', district: 'Thatta', devices: 2 },
  
  // ===== KARACHI & INDUS DELTA =====
  { name: 'Karachi Port', lat: 24.8608, lon: 67.0011, province: 'Sindh', district: 'Karachi', devices: 3 },
  { name: 'Keamari', lat: 24.8056, lon: 66.9778, province: 'Sindh', district: 'Karachi', devices: 2 },
  { name: 'Bin Qasim', lat: 24.7897, lon: 67.3644, province: 'Sindh', district: 'Karachi', devices: 4 },
  { name: 'Ibrahim Hyderi', lat: 24.8342, lon: 67.1856, province: 'Sindh', district: 'Karachi', devices: 2 },
];

// Device name suffixes
const DEVICE_POSITIONS = ['North', 'South', 'East', 'West', 'Central', 'Upstream', 'Downstream'];

/**
 * Calculate risk level based on current water level vs danger level
 */
function calculateRiskLevel(currentLevel: number, dangerLevel: number): 'yellow' | 'orange' | 'darkOrange' | 'red' {
  const percentage = (currentLevel / dangerLevel) * 100;
  
  if (percentage >= RISK_THRESHOLDS.red) return 'red';           // >95%
  if (percentage >= RISK_THRESHOLDS.darkOrange) return 'darkOrange'; // 90-95%
  if (percentage >= RISK_THRESHOLDS.orange) return 'orange';     // 80-90%
  if (percentage >= RISK_THRESHOLDS.yellow) return 'yellow';     // 60-80%
  
  return 'yellow'; // <60% still shows as yellow (low alert)
}

/**
 * Generate realistic monitoring stations along Indus River
 * ~200 sensors distributed across entire river from source to delta
 */
export function generateStations(): Station[] {
  const stations: Station[] = [];

  INDUS_CITIES.forEach((city) => {
    // Generate sensors for each city
    for (let i = 0; i < city.devices; i++) {
      const normalLevel = 50 + Math.random() * 30; // 50-80m baseline
      const dangerLevel = normalLevel + 40 + Math.random() * 20; // 40-60m above normal
      const warningLevel = dangerLevel * 0.8; // 80% of danger level
      
      // Current level varies - some at risk, some safe
      const riskVariation = Math.random();
      let currentLevel: number;
      
      if (riskVariation < 0.1) {
        // 10% chance: Critical (red zone)
        currentLevel = dangerLevel * (0.96 + Math.random() * 0.08);
      } else if (riskVariation < 0.25) {
        // 15% chance: Dark Orange zone
        currentLevel = dangerLevel * (0.90 + Math.random() * 0.05);
      } else if (riskVariation < 0.45) {
        // 20% chance: Orange zone
        currentLevel = dangerLevel * (0.80 + Math.random() * 0.10);
      } else {
        // 55% chance: Yellow zone (safe to mild)
        currentLevel = dangerLevel * (0.50 + Math.random() * 0.30);
      }

      const riskLevel = calculateRiskLevel(currentLevel, dangerLevel);
      
      // Add slight random offset to coordinates for multiple devices in same city
      const latOffset = (Math.random() - 0.5) * 0.05; // ~5km variation
      const lonOffset = (Math.random() - 0.5) * 0.05;

      const devicePosition = DEVICE_POSITIONS[i % DEVICE_POSITIONS.length];
      const deviceNumber = Math.floor(i / DEVICE_POSITIONS.length) + 1;
      const stationName = `${city.name}-${devicePosition}${deviceNumber > 1 ? `-${deviceNumber}` : ''}`;

      const station: Station = {
        id: generateId(),
        name: stationName,
        deviceId: `ESP32-${city.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        coordinates: [
          city.lon + lonOffset,
          city.lat + latOffset,
        ],
        city: city.name,
        district: city.district,
        province: city.province,
        currentLevel: parseFloat(currentLevel.toFixed(2)),
        dangerLevel: parseFloat(dangerLevel.toFixed(2)),
        warningLevel: parseFloat(warningLevel.toFixed(2)),
        normalLevel: parseFloat(normalLevel.toFixed(2)),
        status: Math.random() > 0.95 ? 'maintenance' : 'active', // 5% in maintenance
        riskLevel,
        lastUpdated: new Date(Date.now() - Math.random() * 3600000), // within last hour
        trend: riskLevel === 'red' || riskLevel === 'darkOrange' 
          ? (Math.random() > 0.3 ? 'rising' : 'stable')
          : (Math.random() > 0.5 ? 'falling' : 'stable'),
        flowRate: parseFloat((2000 + Math.random() * 8000).toFixed(2)), // m³/s
        temperature: parseFloat((15 + Math.random() * 20).toFixed(1)), // 15-35°C
        rainfall: parseFloat((Math.random() * 50).toFixed(1)), // 0-50mm
        batteryLevel: Math.floor(60 + Math.random() * 40), // 60-100%
        imageUrl: `/api/images/${generateId()}.jpg`, // Placeholder for scale bar image
      };

      stations.push(station);
    }
  });

  return stations;
}

/**
 * Get stations by city
 */
export function getStationsByCity(city: string, allStations: Station[]): Station[] {
  return allStations.filter(s => s.city === city);
}

/**
 * Get stations by risk level
 */
export function getStationsByRisk(riskLevel: string, allStations: Station[]): Station[] {
  return allStations.filter(s => s.riskLevel === riskLevel);
}

/**
 * Get critical stations (dark orange + red)
 */
export function getCriticalStations(allStations: Station[]): Station[] {
  return allStations.filter(s => s.riskLevel === 'darkOrange' || s.riskLevel === 'red');
}

/**
 * Get total sensor count
 */
export function getTotalSensorCount(): number {
  return INDUS_CITIES.reduce((sum, city) => sum + city.devices, 0);
}

// Log sensor distribution on module load
const totalSensors = INDUS_CITIES.reduce((sum, city) => sum + city.devices, 0);
console.log(`📡 IPWS IoT Network: ${totalSensors} sensors deployed across ${INDUS_CITIES.length} cities/towns along Indus River`);
console.log(`   🌊 Coverage: From Skardu (Gilgit-Baltistan) to Karachi Delta (Arabian Sea)`);
