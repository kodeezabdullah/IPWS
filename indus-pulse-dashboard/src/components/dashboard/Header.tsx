// Dashboard header component

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Menu, X, AlertTriangle, AlertCircle, Info, CheckCircle, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockStations } from '../../data/mockData';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

/**
 * Main dashboard header
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick, className }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('ipws-theme') as 'light' | 'dark' | null;
    return savedTheme || 'dark';
  });
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Apply theme to document on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ipws-theme', theme);
  }, [theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Get recent alerts from critical/warning stations
  const recentAlerts = mockStations
    .filter(s => s.riskLevel === 'red' || s.riskLevel === 'darkOrange' || s.riskLevel === 'orange')
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 10);

  const criticalCount = recentAlerts.filter(s => s.riskLevel === 'red').length;
  const warningCount = recentAlerts.filter(s => s.riskLevel === 'darkOrange' || s.riskLevel === 'orange').length;

  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 py-2 bg-gray-900 border-b border-gray-800 h-20',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <img 
          src="/logo.png" 
          alt="IPWS Logo" 
          className="h-[72px] w-[72px] object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">Indus Pulse Warning System</h1>
          <p className="text-sm text-gray-400">Real-time Flood Monitoring Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6" />
            {recentAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-semibold">
                {recentAlerts.length > 9 ? '9+' : recentAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/95 backdrop-blur">
                <div>
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {criticalCount} Critical • {warningCount} Warnings
                  </p>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1">
                {recentAlerts.length > 0 ? (
                  <div className="divide-y divide-gray-700">
                    {recentAlerts.map((station) => (
                      <div
                        key={station.id}
                        className="p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            station.riskLevel === 'red' ? 'text-red-400' :
                            station.riskLevel === 'darkOrange' ? 'text-orange-600' :
                            'text-orange-400'
                          }`}>
                            {station.riskLevel === 'red' ? (
                              <AlertTriangle className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-white text-sm">
                                {station.name}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded ${
                                station.riskLevel === 'red' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {station.riskLevel.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              Water level: <span className="font-medium text-white">{station.currentLevel.toFixed(2)}m</span>
                              {' • '}
                              {station.trend === 'rising' ? '📈 Rising' : 
                               station.trend === 'falling' ? '📉 Falling' : '➡️ Stable'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(station.lastUpdated).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="font-medium">All Clear!</p>
                    <p className="text-sm mt-1">No critical alerts at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* System Status */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Total Sensors</span>
                      <span className="font-medium text-white">{mockStations.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Active Alerts</span>
                      <span className="font-medium text-red-400">{criticalCount + warningCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">System Status</span>
                      <span className="flex items-center gap-1 font-medium text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Appearance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Moon className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-400">
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {theme === 'dark' ? (
                          <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <Moon className="w-5 h-5 text-blue-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Auto-refresh</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Sound Alerts</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">About</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Version</span>
                      <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated</span>
                      <span className="text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

