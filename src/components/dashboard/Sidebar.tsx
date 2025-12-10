// Dashboard sidebar component

import React from 'react';
import { Map, BarChart3, AlertTriangle, Users, Navigation, Home, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { PageType } from '../../App';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  className?: string;
}

/**
 * Sidebar navigation component
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  currentPage,
  onPageChange,
  className,
}) => {
  const menuItems: Array<{ icon: typeof Home; label: string; page: PageType }> = [
    { icon: Home, label: 'Overview', page: 'overview' },
    { icon: Map, label: 'Map View', page: 'map' },
    { icon: BarChart3, label: 'Analytics', page: 'analytics' },
    { icon: AlertTriangle, label: 'Alerts', page: 'alerts' },
    { icon: Users, label: 'Population', page: 'population' },
    { icon: Navigation, label: 'Evacuation', page: 'evacuation' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-64 bg-gray-900 border-r border-gray-800',
          'transform transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg',
                'hover:bg-gray-800 transition-colors',
                currentPage === item.page && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Admin Panel Button at Bottom */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => onPageChange('admin')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
              'transition-all duration-300',
              currentPage === 'admin' 
                ? 'bg-orange-600 hover:bg-orange-700 shadow-lg' 
                : 'bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30'
            )}
          >
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Admin Panel</span>
          </button>
          {currentPage !== 'admin' && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Device Management & Control
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

