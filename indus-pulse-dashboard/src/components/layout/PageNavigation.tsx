// Page navigation component (left bottom)

import React from 'react';
import { Map, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type PageType = 'general-map' | 'monitoring' | 'analytics' | 'alerts';

interface PageNavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  className?: string;
}

const pages = [
  { id: 'general-map' as PageType, label: 'General Map', icon: Map },
  { id: 'monitoring' as PageType, label: 'Monitoring', icon: Activity },
  { id: 'analytics' as PageType, label: 'Analytics', icon: BarChart3 },
  { id: 'alerts' as PageType, label: 'Alerts', icon: AlertTriangle },
];

/**
 * Page navigation component - positioned at left bottom
 */
export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  onPageChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-8 left-8 z-50',
        'bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl',
        'p-2',
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {pages.map((page) => {
          const Icon = page.icon;
          const isActive = currentPage === page.id;
          
          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                'hover:bg-gray-800',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-gray-400 hover:text-white'
              )}
              title={page.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium whitespace-nowrap">
                {page.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

