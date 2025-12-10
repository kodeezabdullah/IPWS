// Generate realistic time-series data for IoT monitoring stations

import type { StationTimeSeries, TimeSeriesPoint } from '../../types/station';
import type { Station } from '../../types/station';

/**
 * Generate hourly time-series data for a station
 * Simulates IoT device readings every hour
 */
export function generateTimeSeries(
  station: Station,
  hours: number = 48 // Last 48 hours of data
): StationTimeSeries {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();

  // Start from a historical level
  let currentLevel = station.currentLevel - (5 + Math.random() * 10);
  
  // Determine if this station is in a flooding trend
  const isFloodingTrend = station.riskLevel === 'red' || station.riskLevel === 'darkOrange';

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000); // Hourly data

    // Simulate realistic water level changes
    let change: number;
    
    if (isFloodingTrend) {
      // Flooding scenario: gradual increase with some fluctuation
      change = 0.1 + Math.random() * 0.4; // 0.1-0.5m increase per hour
    } else if (station.trend === 'rising') {
      change = (Math.random() - 0.3) * 0.5; // Slightly rising
    } else if (station.trend === 'falling') {
      change = (Math.random() - 0.7) * 0.5; // Slightly falling
    } else {
      change = (Math.random() - 0.5) * 0.3; // Stable with minor fluctuation
    }

    currentLevel = Math.max(
      station.normalLevel - 5,
      Math.min(station.dangerLevel + 3, currentLevel + change)
    );

    // Flow rate correlates with water level
    const baseFlow = 2000 + (currentLevel - station.normalLevel) * 100;
    const flowRate = Math.max(500, baseFlow + (Math.random() - 0.5) * 1000);

    // Rainfall increases during flood scenarios
    const rainfall = isFloodingTrend 
      ? parseFloat((10 + Math.random() * 40).toFixed(1))
      : parseFloat((Math.random() * 15).toFixed(1));

    // Temperature varies slightly
    const baseTemp = 25;
    const temperature = parseFloat((baseTemp + (Math.random() - 0.5) * 10).toFixed(1));

    const point: TimeSeriesPoint = {
      timestamp,
      waterLevel: parseFloat(currentLevel.toFixed(2)),
      flowRate: parseFloat(flowRate.toFixed(2)),
      rainfall,
      temperature,
    };

    data.push(point);
  }

  return {
    stationId: station.id,
    data,
  };
}

/**
 * Generate time-series data for multiple stations
 */
export function generateMultipleTimeSeries(
  stations: Station[],
  hours: number = 48
): Record<string, StationTimeSeries> {
  const result: Record<string, StationTimeSeries> = {};

  stations.forEach((station) => {
    result[station.id] = generateTimeSeries(station, hours);
  });

  return result;
}

/**
 * Generate forecast data (predictive - for future implementation)
 */
export function generateForecastData(
  station: Station,
  forecastHours: number = 24
): TimeSeriesPoint[] {
  const forecast: TimeSeriesPoint[] = [];
  const now = Date.now();
  
  let predictedLevel = station.currentLevel;
  const trendMultiplier = station.trend === 'rising' ? 1.2 : station.trend === 'falling' ? 0.8 : 1.0;

  for (let i = 1; i <= forecastHours; i++) {
    const timestamp = new Date(now + i * 3600000);
    
    // Predictive change (simplified)
    const change = ((Math.random() - 0.4) * 0.5) * trendMultiplier;
    predictedLevel = Math.max(
      station.normalLevel,
      Math.min(station.dangerLevel + 5, predictedLevel + change)
    );

    forecast.push({
      timestamp,
      waterLevel: parseFloat(predictedLevel.toFixed(2)),
      flowRate: parseFloat((2000 + Math.random() * 5000).toFixed(2)),
      rainfall: parseFloat((Math.random() * 25).toFixed(1)),
      temperature: parseFloat((20 + Math.random() * 15).toFixed(1)),
    });
  }

  return forecast;
}

/**
 * Get latest reading from time series
 */
export function getLatestReading(timeSeries: StationTimeSeries): TimeSeriesPoint | null {
  if (!timeSeries.data || timeSeries.data.length === 0) return null;
  return timeSeries.data[timeSeries.data.length - 1];
}

/**
 * Calculate average water level over period
 */
export function calculateAverageLevel(timeSeries: StationTimeSeries): number {
  if (!timeSeries.data || timeSeries.data.length === 0) return 0;
  
  const sum = timeSeries.data.reduce((acc, point) => acc + point.waterLevel, 0);
  return parseFloat((sum / timeSeries.data.length).toFixed(2));
}

/**
 * Detect if water level is accelerating (rate of change increasing)
 */
export function detectAcceleration(timeSeries: StationTimeSeries): boolean {
  if (!timeSeries.data || timeSeries.data.length < 3) return false;
  
  const recentData = timeSeries.data.slice(-6); // Last 6 hours
  const changes: number[] = [];
  
  for (let i = 1; i < recentData.length; i++) {
    changes.push(recentData[i].waterLevel - recentData[i - 1].waterLevel);
  }
  
  // Check if changes are increasing (accelerating rise)
  const avgFirstHalf = changes.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const avgSecondHalf = changes.slice(3).reduce((a, b) => a + b, 0) / changes.slice(3).length;
  
  return avgSecondHalf > avgFirstHalf && avgSecondHalf > 0.2; // Significant acceleration
}
