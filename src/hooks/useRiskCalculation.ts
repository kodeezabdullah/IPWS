// Custom hook for calculating risk levels and metrics

import { useMemo } from 'react';
import type { Station } from '../types/station';
import type { Village } from '../types/village';
import { calculateRiskLevel } from '../lib/utils';

interface RiskMetrics {
  totalAtRisk: number;
  byLevel: {
    yellow: number;
    orange: number;
    darkOrange: number;
    red: number;
  };
  criticalStations: Station[];
  affectedVillages: Village[];
}

/**
 * Hook to calculate risk metrics from stations and villages data
 */
export function useRiskCalculation(
  stations: Station[],
  villages: Village[]
): RiskMetrics {
  const metrics = useMemo(() => {
    const byLevel = {
      yellow: 0,
      orange: 0,
      darkOrange: 0,
      red: 0,
    };

    // Calculate risk levels for stations
    const stationsWithRisk = stations.map((station) => {
      const risk = calculateRiskLevel(station.currentLevel, station.dangerLevel);
      byLevel[risk]++;
      return { ...station, riskLevel: risk };
    });

    // Find critical stations (darkOrange and red)
    const criticalStations = stationsWithRisk.filter(
      (s) => s.riskLevel === 'darkOrange' || s.riskLevel === 'red'
    );

    // Calculate affected villages (darkOrange and red)
    const affectedVillages = villages.filter(
      (v) => v.riskLevel === 'darkOrange' || v.riskLevel === 'red'
    );

    const totalAtRisk = affectedVillages.reduce(
      (sum, village) => sum + village.population,
      0
    );

    return {
      totalAtRisk,
      byLevel,
      criticalStations,
      affectedVillages,
    };
  }, [stations, villages]);

  return metrics;
}

