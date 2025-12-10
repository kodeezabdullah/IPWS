// Stations list component

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Station } from '../../types/station';
import { cn, getRiskColor } from '../../lib/utils';

interface StationsListProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  className?: string;
}

/**
 * List of monitoring stations with their status
 * TODO: Customize styling based on reference project
 */
export const StationsList: React.FC<StationsListProps> = ({
  stations,
  onStationClick,
  className,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-lg font-semibold mb-4">Monitoring Stations</h3>
      <div className="space-y-2">
        {stations.map((station) => (
          <div
            key={station.id}
            onClick={() => onStationClick?.(station)}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{station.name}</h4>
                <p className="text-sm text-gray-400">{station.district}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(station.trend)}
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${getRiskColor(station.riskLevel)}20`,
                    color: getRiskColor(station.riskLevel),
                  }}
                >
                  {station.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Level</span>
              <span className="font-medium">{station.currentLevel} m</span>
            </div>
            <div className="mt-1 w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(station.currentLevel / station.dangerLevel) * 100}%`,
                  backgroundColor: getRiskColor(station.riskLevel),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

