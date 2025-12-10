// Alerts Page - Shows active alerts and warnings

import React, { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, Info, Clock, MapPin, Droplets, TrendingUp, X, Activity, Battery } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockStations, mockPopulationData } from '../data/mockData';
import { AreaSelector } from '../components/map/controls/AreaSelector';
import type { Station } from '../types/station';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  station: Station;
  timestamp: Date;
  acknowledged: boolean;
  populationAffected?: number;
  economicImpact?: number;
}

// Generate alerts from station data
const generateAlerts = (stations: Station[]): Alert[] => {
  const alerts: Alert[] = [];
  
  stations.forEach((station) => {
    if (station.riskLevel === 'red' || station.riskLevel === 'darkOrange' || station.riskLevel === 'orange') {
      const riskPercentage = ((station.currentLevel / station.dangerLevel) * 100).toFixed(1);
      
      // Get population data for this station
      const popData = mockPopulationData.find(p => p.stationId === station.id);
      
      let alertType: 'critical' | 'warning' | 'info' = 'info';
      let alertTitle = '';
      let alertMessage = '';
      
      if (station.riskLevel === 'red') {
        alertType = 'critical';
        alertTitle = '🔴 CRITICAL FLOOD ALERT';
        alertMessage = `Water level at ${station.currentLevel.toFixed(2)}m (${riskPercentage}% of danger level). IMMEDIATE EVACUATION REQUIRED.`;
      } else if (station.riskLevel === 'darkOrange') {
        alertType = 'critical';
        alertTitle = '🟠 SEVERE FLOOD WARNING';
        alertMessage = `Water level at ${station.currentLevel.toFixed(2)}m (${riskPercentage}% of danger level). Prepare for evacuation.`;
      } else {
        alertType = 'warning';
        alertTitle = '🟡 FLOOD WATCH';
        alertMessage = `Water level at ${station.currentLevel.toFixed(2)}m (${riskPercentage}% of danger level). Monitor closely.`;
      }
      
      alerts.push({
        id: `alert-${station.id}`,
        type: alertType,
        title: alertTitle,
        message: alertMessage,
        station: station,
        timestamp: new Date(station.lastUpdated),
        acknowledged: Math.random() > 0.7, // 30% acknowledged
        populationAffected: popData?.totalAffectedPopulation || 0,
        economicImpact: popData?.economicData.estimatedEconomicLoss || 0,
      });
    }
  });

  return alerts.sort((a, b) => {
    // Sort by: 1) type (critical first), 2) timestamp (newest first)
    if (a.type !== b.type) {
      return a.type === 'critical' ? -1 : 1;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
};

/**
 * Alerts Page - Active alerts and warnings
 */
export const AlertsPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Get unique areas
  const availableAreas = useMemo(() => {
    const cities = new Set(mockStations.map(s => s.city));
    return Array.from(cities).sort();
  }, []);

  // Filter stations by area
  const filteredStations = useMemo(() => {
    if (!selectedArea) return mockStations;
    return mockStations.filter(s => s.city === selectedArea || s.district === selectedArea);
  }, [selectedArea]);

  // Generate alerts from filtered stations
  const allAlerts = useMemo(() => {
    const generatedAlerts = generateAlerts(filteredStations);
    // Update acknowledged status from state
    return generatedAlerts.map(alert => ({
      ...alert,
      acknowledged: acknowledgedAlerts.has(alert.id) || alert.acknowledged
    }));
  }, [filteredStations, acknowledgedAlerts]);

  // Filter alerts by type
  const alerts = useMemo(() => {
    if (filterType === 'all') return allAlerts;
    return allAlerts.filter(a => a.type === filterType);
  }, [allAlerts, filterType]);

  // Handle acknowledge alert
  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
  };

  // Handle view station details
  const handleViewStation = (station: Station) => {
    setSelectedStation(station);
  };

  // Handle close station details modal
  const handleCloseModal = () => {
    setSelectedStation(null);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/30 bg-red-900/20';
      case 'warning':
        return 'border-orange-500/30 bg-orange-900/20';
      default:
        return 'border-blue-500/30 bg-blue-900/20';
    }
  };

  const formatTime = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="p-6 min-h-full">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Area Selector */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Active Alerts</h1>
              <p className="text-gray-400">
                {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} requiring attention
                {selectedArea && ` in ${selectedArea}`}
              </p>
            </div>
            <div className="w-64 flex-shrink-0">
              <AreaSelector
                areas={availableAreas}
                selectedArea={selectedArea}
                onAreaChange={setSelectedArea}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'px-4 py-2 rounded-lg transition-all font-medium',
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              )}
            >
              All ({allAlerts.length})
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={cn(
                'px-4 py-2 rounded-lg transition-all font-medium',
                filterType === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              )}
            >
              Critical ({allAlerts.filter(a => a.type === 'critical').length})
            </button>
            <button
              onClick={() => setFilterType('warning')}
              className={cn(
                'px-4 py-2 rounded-lg transition-all font-medium',
                filterType === 'warning'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              )}
            >
              Warning ({allAlerts.filter(a => a.type === 'warning').length})
            </button>
          </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-500">
                  {allAlerts.filter((a) => a.type === 'critical' && a.station.riskLevel === 'red').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-400">Severe</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allAlerts.filter((a) => a.station.riskLevel === 'darkOrange').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Warning</p>
                <p className="text-2xl font-bold text-orange-400">
                  {allAlerts.filter((a) => a.station.riskLevel === 'orange').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Info className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Acknowledged</p>
                <p className="text-2xl font-bold text-green-500">
                  {allAlerts.filter((a) => a.acknowledged).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-12 text-center">
              <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Alerts</h3>
              <p className="text-gray-500">
                {selectedArea 
                  ? `No active alerts in ${selectedArea}` 
                  : 'No active alerts in the system'}
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'border rounded-lg p-5 transition-all',
                  getAlertColor(alert.type),
                  alert.acknowledged && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {alert.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {alert.station.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(alert.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{alert.message}</p>
                    
                    {/* Station Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Device ID</p>
                        <p className="text-sm font-mono text-white">{alert.station.deviceId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-sm text-white">{alert.station.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Trend</p>
                        <p className={cn(
                          "text-sm font-medium flex items-center gap-1",
                          alert.station.trend === 'rising' ? 'text-red-400' :
                          alert.station.trend === 'falling' ? 'text-green-400' :
                          'text-gray-400'
                        )}>
                          <TrendingUp className={cn(
                            "w-3 h-3",
                            alert.station.trend === 'falling' && 'rotate-180'
                          )} />
                          {alert.station.trend}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Flow Rate</p>
                        <p className="text-sm text-white flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {alert.station.flowRate?.toFixed(0) || 'N/A'} m³/s
                        </p>
                      </div>
                    </div>

                    {/* Impact Data */}
                    {(alert.populationAffected || alert.economicImpact) && (
                      <div className="mb-3 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
                        <p className="text-xs text-red-300 font-semibold mb-2">ESTIMATED IMPACT</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {alert.populationAffected && (
                            <div>
                              <p className="text-gray-400 text-xs">Population Affected</p>
                              <p className="text-white font-semibold">{alert.populationAffected.toLocaleString()}</p>
                            </div>
                          )}
                          {alert.economicImpact && (
                            <div>
                              <p className="text-gray-400 text-xs">Economic Loss</p>
                              <p className="text-white font-semibold">PKR {(alert.economicImpact / 1_000_000).toFixed(1)}M</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      {!alert.acknowledged && (
                        <button 
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Acknowledge Alert
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewStation(alert.station)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                      >
                        View Station Details
                      </button>
                      {alert.acknowledged && (
                        <span className="text-sm text-green-500 font-medium">✓ Acknowledged</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Station Details Modal */}
        {selectedStation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Station Details</h2>
                  <p className="text-gray-400">{selectedStation.name}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Device ID</p>
                    <p className="text-lg font-mono text-white">{selectedStation.deviceId}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      selectedStation.status === 'active' ? 'text-green-400' : 'text-gray-400'
                    )}>
                      <Activity className="w-5 h-5" />
                      {selectedStation.status}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">City</p>
                      <p className="text-white font-medium">{selectedStation.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">District</p>
                      <p className="text-white font-medium">{selectedStation.district}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Province</p>
                      <p className="text-white font-medium">{selectedStation.province}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Coordinates</p>
                      <p className="text-white font-mono text-xs">
                        {selectedStation.coordinates[1].toFixed(4)}, {selectedStation.coordinates[0].toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Water Level Data */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Water Level Data
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Current Level</p>
                      <p className="text-2xl font-bold text-blue-400">{selectedStation.currentLevel.toFixed(2)}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Danger Level</p>
                      <p className="text-2xl font-bold text-red-400">{selectedStation.dangerLevel.toFixed(2)}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Normal Level</p>
                      <p className="text-lg font-semibold text-green-400">{selectedStation.normalLevel.toFixed(2)}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Flow Rate</p>
                      <p className="text-lg font-semibold text-cyan-400">{selectedStation.flowRate?.toFixed(0) || 'N/A'} m³/s</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={cn(
                        "font-semibold uppercase",
                        selectedStation.riskLevel === 'red' ? 'text-red-400' :
                        selectedStation.riskLevel === 'darkOrange' ? 'text-orange-600' :
                        selectedStation.riskLevel === 'orange' ? 'text-orange-400' :
                        'text-yellow-400'
                      )}>
                        {selectedStation.riskLevel}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          selectedStation.riskLevel === 'red' ? 'bg-red-500' :
                          selectedStation.riskLevel === 'darkOrange' ? 'bg-orange-600' :
                          selectedStation.riskLevel === 'orange' ? 'bg-orange-400' :
                          'bg-yellow-400'
                        )}
                        style={{ width: `${Math.min((selectedStation.currentLevel / selectedStation.dangerLevel) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Trend & Battery */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Trend</p>
                    <p className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      selectedStation.trend === 'rising' ? 'text-red-400' :
                      selectedStation.trend === 'falling' ? 'text-green-400' :
                      'text-gray-400'
                    )}>
                      <TrendingUp className={cn(
                        "w-5 h-5",
                        selectedStation.trend === 'falling' && 'rotate-180'
                      )} />
                      {selectedStation.trend}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Battery Level</p>
                    <p className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      (selectedStation.batteryLevel ?? 0) > 50 ? 'text-green-400' :
                      (selectedStation.batteryLevel ?? 0) > 20 ? 'text-yellow-400' :
                      'text-red-400'
                    )}>
                      <Battery className="w-5 h-5" />
                      {selectedStation.batteryLevel ?? 0}%
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                  <p className="text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedStation.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

