// Script to generate population JSON file for all sensors

import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateStations } from '../src/data/generators/generateStations';
import { generateAllPopulationData, calculatePopulationStatistics } from '../src/data/generators/generatePopulationData';

console.log('🌊 Generating population data for IPWS sensors...\n');

// Generate all stations
const stations = generateStations();
console.log(`📍 Generated ${stations.length} monitoring stations`);

// Generate population data for each station
const populationData = generateAllPopulationData(stations);
console.log(`👥 Generated population data for ${populationData.length} stations`);

// Calculate statistics
const stats = calculatePopulationStatistics(populationData);

console.log('\n📊 Population Statistics:');
console.log(`   Total Affected Population: ${stats.totalPopulation.toLocaleString()}`);
console.log(`   Total Households: ${stats.totalHouseholds.toLocaleString()}`);
console.log(`   Vulnerable Groups:`);
console.log(`     - Children (under 15): ${stats.totalChildren.toLocaleString()}`);
console.log(`     - Elderly (over 65): ${stats.totalElderly.toLocaleString()}`);
console.log(`     - Disabled: ${stats.totalDisabled.toLocaleString()}`);
console.log(`   Economic Impact: PKR ${(stats.totalEconomicLoss / 1_000_000_000).toFixed(2)} Billion`);
console.log(`   Livestock at Risk: ${stats.totalLivestock.toLocaleString()} animals`);
console.log(`   Agricultural Land: ${stats.totalAgriculturalLand.toLocaleString()} hectares`);

console.log('\n🎯 By Risk Level:');
console.log(`   🔴 Red: ${stats.byRiskLevel.red.toLocaleString()} people`);
console.log(`   🟠 Dark Orange: ${stats.byRiskLevel.darkOrange.toLocaleString()} people`);
console.log(`   🟡 Orange: ${stats.byRiskLevel.orange.toLocaleString()} people`);
console.log(`   🟢 Yellow: ${stats.byRiskLevel.yellow.toLocaleString()} people`);

console.log('\n🗺️  By Province:');
console.log(`   Gilgit-Baltistan: ${stats.byProvince['Gilgit-Baltistan'].toLocaleString()}`);
console.log(`   Khyber Pakhtunkhwa: ${stats.byProvince['Khyber Pakhtunkhwa'].toLocaleString()}`);
console.log(`   Punjab: ${stats.byProvince['Punjab'].toLocaleString()}`);
console.log(`   Sindh: ${stats.byProvince['Sindh'].toLocaleString()}`);

// Create output object
const output = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalSensors: stations.length,
    dataVersion: '1.0',
    description: 'Population data near each IoT sensor station along Indus River',
  },
  statistics: stats,
  populationData,
};

// Write to JSON file
const outputPath = join(process.cwd(), 'public', 'data', 'population-data.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`\n✅ Population data saved to: ${outputPath}`);
console.log(`📦 File size: ${(JSON.stringify(output).length / 1024).toFixed(2)} KB`);

