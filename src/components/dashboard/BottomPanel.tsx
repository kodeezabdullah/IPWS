// Bottom panel component for charts and additional info

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Gauge } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomPanelProps {
  children?: React.ReactNode;
  defaultTab?: string;
  className?: string;
}

/**
 * Bottom panel with tabs for different chart views
 * TODO: Customize styling based on reference project
 */
export const BottomPanel: React.FC<BottomPanelProps> = ({
  children,
  defaultTab = 'comparison',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'metrics', label: 'Metrics', icon: Gauge },
  ];

  return (
    <div
      className={cn(
        'bg-gray-900 border-t border-gray-800 rounded-t-xl',
        className
      )}
    >
      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-4 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors',
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

