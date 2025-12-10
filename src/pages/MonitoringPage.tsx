// Monitoring Page - Shows stations, alerts, and real-time data

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_VIEW_STATE } from '../lib/constants';
import { DeckGLMap } from '../components/map/DeckGLMap';
import { AlertSummary } from '../components/dashboard/AlertSummary';
import { RiskMetrics } from '../components/dashboard/RiskMetrics';
import { StationsList } from '../components/dashboard/StationsList';
import { WaterLevelChart } from '../components/charts/WaterLevelChart';
import { 
  mockStations, 
  mockVillages, 
  mockTimeSeries, 
  mockPopulationData,
  summaryStats
} from '../data/mockData';
import { createStationsLayer } from '../components/map/layers/StationsLayer';
import { createVillagesLayer } from '../components/map/layers/VillagesLayer';
import { createAnimatedRiverLayer } from '../components/map/layers/AnimatedRiverLayer';
import { createPakistanLayer } from '../components/map/layers/PakistanLayer';
import { createBufferZoneLayer } from '../components/map/layers/BufferZoneLayer';
import { createAlertRippleLayer } from '../components/map/layers/AlertRippleLayer';
import { AreaSelector } from '../components/map/controls/AreaSelector';
import type { Station } from '../types/station';

/**
 * Monitoring Page - Real-time station monitoring
 */
export const MonitoringPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [riverData, setRiverData] = useState<any>(null);
  const [pakistanData, setPakistanData] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [viewState, setViewState] = useState<any>({
    ...INITIAL_VIEW_STATE,
    zoom: 4.5, // A bit more zoomed out for Map View
  });

  // Load GeoJSON files
  useEffect(() => {
    Promise.all([
      fetch('/data/geojson/indus-river.geojson').then((res) => res.json()),
      fetch('/data/geojson/pakistan-boundaries.geojson').then((res) => res.json()),
    ])
      .then(([river, pakistan]) => {
        setRiverData(river);
        setPakistanData(pakistan);
      })
      .catch((err) => console.error('Error loading data:', err));
  }, []);

  // Filter data by selected area
  const filteredStations = useMemo(() => {
    if (!selectedArea) return mockStations;
    return mockStations.filter(s => s.city === selectedArea || s.district === selectedArea);
  }, [selectedArea]);

  const filteredVillages = useMemo(() => {
    if (!selectedArea) return mockVillages;
    return mockVillages.filter(v => v.district === selectedArea);
  }, [selectedArea]);

  // Calculate real-time metrics based on filtered data
  const criticalStationsCount = useMemo(() => 
    filteredStations.filter(s => s.riskLevel === 'red' || s.riskLevel === 'darkOrange').length,
    [filteredStations]
  );

  const alertCounts = useMemo(() => ({
    critical: filteredStations.filter(s => s.riskLevel === 'red').length,
    warning: filteredStations.filter(s => s.riskLevel === 'darkOrange' || s.riskLevel === 'orange').length,
    info: filteredStations.filter(s => s.riskLevel === 'yellow').length,
  }), [filteredStations]);

  const highRiskVillagesCount = useMemo(() => 
    filteredVillages.filter(v => v.riskLevel === 'red' || v.riskLevel === 'darkOrange').length,
    [filteredVillages]
  );

  // Calculate population at risk for selected area
  const totalPopulationAtRisk = useMemo(() => {
    if (!selectedArea) {
      return summaryStats.sensorPopulationStats?.byRiskLevel.red + 
             summaryStats.sensorPopulationStats?.byRiskLevel.darkOrange || 0;
    }
    
    // Calculate from filtered stations' population data
    const areaPopulationData = mockPopulationData.filter(
      p => p.city === selectedArea || p.district === selectedArea
    );
    
    return areaPopulationData
      .filter(p => p.riskLevel === 'red' || p.riskLevel === 'darkOrange')
      .reduce((sum, p) => sum + p.totalAffectedPopulation, 0);
  }, [selectedArea]);

  // Get aggregate time series data for selected area only (not for all stations)
  const aggregateTimeSeries = useMemo(() => {
    // Only calculate if an area is selected (to avoid heavy data processing)
    if (!selectedArea) return [];
    
    const stationsToAggregate = filteredStations;
    
    if (stationsToAggregate.length === 0) return [];
    
    // Get all time series data for the stations
    const allTimeSeries = stationsToAggregate
      .map(s => mockTimeSeries[s.id])
      .filter(Boolean);
    
    if (allTimeSeries.length === 0) return [];
    
    // Create a map of timestamp -> array of water levels
    const timeStampMap = new Map<string, number[]>();
    
    allTimeSeries.forEach(series => {
      series.data.forEach(point => {
        const key = point.timestamp;
        if (!timeStampMap.has(key)) {
          timeStampMap.set(key, []);
        }
        timeStampMap.get(key)!.push(point.waterLevel);
      });
    });
    
    // Calculate average water level for each timestamp
    const aggregateData = Array.from(timeStampMap.entries())
      .map(([timestamp, levels]) => ({
        timestamp,
        waterLevel: levels.reduce((sum, l) => sum + l, 0) / levels.length,
        minLevel: Math.min(...levels),
        maxLevel: Math.max(...levels),
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return aggregateData;
  }, [selectedArea, filteredStations]);

  // Get unique areas (cities) for dropdown
  const availableAreas = useMemo(() => {
    const cities = new Set(mockStations.map(s => s.city));
    return Array.from(cities).sort();
  }, []);

  // Auto-zoom to selected area with smooth transition
  useEffect(() => {
    if (!selectedArea) {
      // Reset to initial view when no area selected
      setViewState({
        ...INITIAL_VIEW_STATE,
        zoom: 4.5, // A bit more zoomed out for Map View
        transitionDuration: 1000,
      });
      return;
    }

    // Get all stations in the selected area
    const areaStations = mockStations.filter(
      s => s.city === selectedArea || s.district === selectedArea
    );

    if (areaStations.length === 0) return;

    // Calculate bounding box
    const lons = areaStations.map(s => s.coordinates[0]);
    const lats = areaStations.map(s => s.coordinates[1]);
    
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Calculate zoom level based on area size (more zoomed out for wider view)
    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;
    const maxRange = Math.max(lonRange, latRange);
    
    // Zoom level: much more zoomed out
    let zoom = 7;
    if (maxRange < 0.05) zoom = 8;
    else if (maxRange < 0.1) zoom = 7.5;
    else if (maxRange < 0.3) zoom = 7;
    else if (maxRange < 0.5) zoom = 6.5;
    else if (maxRange < 1) zoom = 6;
    else zoom = 5.5;

    // Set new view state with smooth transition
    setViewState({
      longitude: centerLon,
      latitude: centerLat,
      zoom: zoom,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1500, // Smooth 1.5-second transition
    });
  }, [selectedArea]);

  // Create map layers - Pakistan boundaries at bottom, then river, then data
  const layers = [
    createPakistanLayer({
      data: pakistanData,
      visible: true,
      onHover: (info: any) => setHoverInfo(info),
    }),
    createAnimatedRiverLayer({
      data: riverData,
      visible: true,
      animationSpeed: 3.0,
      particleCount: 200,
      particleSpeed: 1.75, // Reduced speed (2.5 * 0.7 = 1.75)
    }),
    // Buffer zones (shown only when area is selected)
    createBufferZoneLayer({
      data: filteredStations,
      visible: !!selectedArea,
      selectedArea,
    }),
    // Animated alert ripples for critical stations (only show when area is selected)
    createAlertRippleLayer({
      data: filteredStations,
      visible: !!selectedArea,
      selectedArea,
    }),
    createVillagesLayer({
      data: filteredVillages,
      visible: true,
      onHover: (info: any) => setHoverInfo(info),
    }),
    createStationsLayer({
      data: filteredStations,
      visible: true,
      onClick: (info: any) => {
        if (info.object) {
          setSelectedStation(info.object);
        }
      },
      onHover: (info: any) => setHoverInfo(info),
    }),
  ].filter(Boolean);

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {/* Alert Summary - Real data from sensors */}
        <div className="p-4 flex-shrink-0">
          <AlertSummary 
            critical={alertCounts.critical} 
            warning={alertCounts.warning} 
            info={alertCounts.info} 
          />
        </div>

        {/* Risk Metrics - Real data from population calculations (filtered by area) */}
        <div className="px-4 pb-4 flex-shrink-0">
          {selectedArea && (
            <div className="mb-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <p className="text-xs text-blue-300">
                📍 Showing data for: <span className="font-semibold">{selectedArea}</span>
              </p>
            </div>
          )}
          <RiskMetrics
            totalAtRisk={totalPopulationAtRisk}
            affectedVillages={highRiskVillagesCount}
            criticalStations={criticalStationsCount}
            trend={criticalStationsCount > filteredStations.length * 0.15 ? "up" : "stable"}
          />
        </div>

        {/* Map and Side Panel Container */}
        <div className="flex gap-4 px-4 pb-4 flex-shrink-0" style={{ height: '500px' }}>
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden bg-gray-900 relative h-full">
          <DeckGLMap 
            layers={layers} 
            viewState={viewState}
            onViewStateChange={setViewState}
          />
          
          {/* Area Selector - Top Left */}
          <div className="absolute top-4 left-4 z-10 w-64">
            <AreaSelector
              areas={availableAreas}
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
            />
          </div>
          
          {/* Hover Tooltip */}
          {hoverInfo?.object && (
            <div
              className="absolute z-10 pointer-events-none bg-gray-800 text-white text-xs rounded-lg p-3 shadow-2xl border border-gray-700"
              style={{ 
                left: hoverInfo.x + 10, 
                top: hoverInfo.y + 10,
                maxWidth: '250px'
              }}
            >
              {/* Station Info */}
              {hoverInfo.object.deviceId && (
                <>
                  <div className="font-semibold text-sm mb-2">{hoverInfo.object.name}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Device ID:</span>
                      <span className="font-mono">{hoverInfo.object.deviceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Water Level:</span>
                      <span className="font-medium">{hoverInfo.object.currentLevel.toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ${
                        hoverInfo.object.riskLevel === 'red' ? 'text-red-400' :
                        hoverInfo.object.riskLevel === 'darkOrange' ? 'text-orange-600' :
                        hoverInfo.object.riskLevel === 'orange' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`}>
                        {hoverInfo.object.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Village Info */}
              {hoverInfo.object.population && !hoverInfo.object.deviceId && (
                <>
                  <div className="font-semibold text-sm mb-2">{hoverInfo.object.name}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Population:</span>
                      <span className="font-medium">{hoverInfo.object.population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance to River:</span>
                      <span>{hoverInfo.object.distanceToRiver.toFixed(1)}km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level:</span>
                      <span className={`font-medium ${
                        hoverInfo.object.riskLevel === 'red' ? 'text-red-400' :
                        hoverInfo.object.riskLevel === 'darkOrange' ? 'text-orange-600' :
                        hoverInfo.object.riskLevel === 'orange' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`}>
                        {hoverInfo.object.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Side Panel - Stations List (filtered by area) */}
        <div className="w-80 bg-gray-900 rounded-xl p-4 overflow-y-auto custom-scrollbar h-full">
          <div className="mb-3 pb-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              {selectedArea ? `Stations in ${selectedArea}` : 'All Stations'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {filteredStations.length} sensor{filteredStations.length !== 1 ? 's' : ''} 
              {selectedArea && ' in selected area'}
            </p>
          </div>
          <StationsList
            stations={filteredStations}
            onStationClick={setSelectedStation}
          />
        </div>
      </div>

        {/* Bottom Panel - Charts with Real Time-Series Data */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="bg-gray-900 rounded-xl p-4">
        {selectedArea && aggregateTimeSeries.length > 0 ? (
          <div>
            <div className="mb-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Water Levels - {selectedArea}
                <span className="text-sm text-gray-400 ml-2">
                  ({filteredStations.length} sensors)
                </span>
              </h3>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Critical: </span>
                  <span className="font-medium text-red-400">{alertCounts.critical}</span>
                </div>
                <div>
                  <span className="text-gray-400">Warning: </span>
                  <span className="font-medium text-orange-400">{alertCounts.warning}</span>
                </div>
                <div>
                  <span className="text-gray-400">Normal: </span>
                  <span className="font-medium text-green-400">
                    {filteredStations.length - alertCounts.critical - alertCounts.warning}
                  </span>
                </div>
              </div>
            </div>
            <WaterLevelChart
              stationName={selectedArea}
              data={aggregateTimeSeries.map(d => ({
                timestamp: d.timestamp,
                waterLevel: d.waterLevel,
              }))}
              dangerLevel={
                filteredStations.reduce((sum, s) => sum + s.dangerLevel, 0) / filteredStations.length
              }
              warningLevel={
                filteredStations.reduce((sum, s) => sum + s.warningLevel, 0) / filteredStations.length
              }
              normalLevel={
                filteredStations.reduce((sum, s) => sum + s.normalLevel, 0) / filteredStations.length
              }
              height="300px"
            />
            <div className="mt-2 text-xs text-gray-400 text-center">
              Showing average water levels from {filteredStations.length} sensors in {selectedArea}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium mb-2">Select an Area to View Water Levels</p>
            <p className="text-sm text-gray-500">
              Use the dropdown above to select a city and view detailed water level data
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

