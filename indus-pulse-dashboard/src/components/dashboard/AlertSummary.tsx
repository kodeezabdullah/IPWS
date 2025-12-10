// Alert summary component

import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertSummaryProps {
  critical?: number;
  warning?: number;
  info?: number;
  className?: string;
}

/**
 * Summary of active alerts
 * TODO: Customize styling based on reference project
 */
export const AlertSummary: React.FC<AlertSummaryProps> = ({
  critical = 0,
  warning = 0,
  info = 0,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {/* Critical Alerts */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Critical</p>
            <p className="text-2xl font-bold text-red-500">{critical}</p>
          </div>
        </div>
      </div>

      {/* Warning Alerts */}
      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Warning</p>
            <p className="text-2xl font-bold text-orange-500">{warning}</p>
          </div>
        </div>
      </div>

      {/* Info Alerts */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Info className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Info</p>
            <p className="text-2xl font-bold text-blue-500">{info}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

