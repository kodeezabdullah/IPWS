// Risk metrics dashboard component

import React from 'react';
import { Users, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn, formatNumber } from '../../lib/utils';

interface RiskMetricsProps {
  totalAtRisk?: number;
  affectedVillages?: number;
  criticalStations?: number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

/**
 * Key risk metrics display
 * TODO: Customize styling based on reference project
 */
export const RiskMetrics: React.FC<RiskMetricsProps> = ({
  totalAtRisk = 0,
  affectedVillages = 0,
  criticalStations = 0,
  trend = 'stable',
  className,
}) => {
  const metrics = [
    {
      icon: Users,
      label: 'Population at Risk',
      value: formatNumber(totalAtRisk),
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      icon: MapPin,
      label: 'Affected Villages',
      value: affectedVillages,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: AlertTriangle,
      label: 'Critical Stations',
      value: criticalStations,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Risk Trend',
      value: trend.toUpperCase(),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-3 rounded-lg', metric.bg)}>
              <metric.icon className={cn('w-6 h-6', metric.color)} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{metric.label}</p>
              <p className={cn('text-2xl font-bold', metric.color)}>{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

