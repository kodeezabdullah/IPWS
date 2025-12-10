// Analytics Page - Shows charts and trends

import React, { useState, useMemo } from 'react';
import { TrendChart } from '../components/charts/TrendChart';
import { ComparisonChart } from '../components/charts/ComparisonChart';
import { RiskGauge } from '../components/charts/RiskGauge';
import { HeatmapChart } from '../components/charts/HeatmapChart';
import { 
  mockStations, 
  mockVillages, 
  mockTimeSeries,
  mockPopulationData
} from '../data/mockData';
import { AreaSelector } from '../components/map/controls/AreaSelector';
import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react';

/**
 * Analytics Page - Data visualization and trends
 */
export const AnalyticsPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Get unique areas (cities) for dropdown
  const availableAreas = useMemo(() => {
    const cities = new Set(mockStations.map(s => s.city));
    return Array.from(cities).sort();
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

  const filteredPopulationData = useMemo(() => {
    if (!selectedArea) return mockPopulationData;
    return mockPopulationData.filter(p => p.city === selectedArea || p.district === selectedArea);
  }, [selectedArea]);

  // Calculate statistics
  const stats = useMemo(() => {
    const redCount = filteredStations.filter(s => s.riskLevel === 'red').length;
    const darkOrangeCount = filteredStations.filter(s => s.riskLevel === 'darkOrange').length;
    const orangeCount = filteredStations.filter(s => s.riskLevel === 'orange').length;
    const yellowCount = filteredStations.filter(s => s.riskLevel === 'yellow').length;

    const totalPopulation = filteredPopulationData.reduce((sum, p) => sum + p.totalAffectedPopulation, 0);
    const criticalPopulation = filteredPopulationData
      .filter(p => p.riskLevel === 'red' || p.riskLevel === 'darkOrange')
      .reduce((sum, p) => sum + p.totalAffectedPopulation, 0);

    const economicLoss = filteredPopulationData.reduce((sum, p) => sum + p.economicData.estimatedEconomicLoss, 0);
    const livestock = filteredPopulationData.reduce((sum, p) => sum + p.economicData.livestockCount, 0);

    return {
      redCount,
      darkOrangeCount,
      orangeCount,
      yellowCount,
      totalPopulation,
      criticalPopulation,
      economicLoss,
      livestock,
      totalStations: filteredStations.length,
      highRiskVillages: filteredVillages.filter(v => v.riskLevel === 'red' || v.riskLevel === 'darkOrange').length,
    };
  }, [filteredStations, filteredVillages, filteredPopulationData]);

  // Calculate overall risk percentage
  const overallRisk = useMemo(() => {
    if (filteredStations.length === 0) return 0;
    const riskScore = (stats.redCount * 100 + stats.darkOrangeCount * 75 + stats.orangeCount * 50 + stats.yellowCount * 25) / filteredStations.length;
    return Math.round(riskScore);
  }, [stats, filteredStations]);

  // Trend data - Last 24 hours for top 5 critical stations
  const trendData = useMemo(() => {
    const criticalStations = filteredStations
      .filter(s => s.riskLevel === 'red' || s.riskLevel === 'darkOrange')
      .slice(0, 5);

    return criticalStations.map(station => {
      const timeSeries = mockTimeSeries[station.id];
      if (!timeSeries) return null;

      // Get last 24 hours (every 4 hours)
      const last24Hours = timeSeries.data.slice(-24).filter((_, i) => i % 4 === 0);

      return {
        name: station.name,
        data: last24Hours.map(d => d.waterLevel),
      };
    }).filter(Boolean);
  }, [filteredStations]);

  const timestamps = useMemo(() => {
    if (trendData.length === 0) return [];
    const criticalStation = filteredStations.find(s => s.riskLevel === 'red' || s.riskLevel === 'darkOrange');
    if (!criticalStation) return [];
    
    const timeSeries = mockTimeSeries[criticalStation.id];
    if (!timeSeries) return [];

    return timeSeries.data.slice(-24).filter((_, i) => i % 4 === 0).map(d => {
      const date = new Date(d.timestamp);
      return `${date.getHours()}:00`;
    });
  }, [filteredStations, trendData]);

  // Comparison data - Top 10 stations by current level
  const comparisonData = useMemo(() => {
    const topStations = [...filteredStations]
      .sort((a, b) => (b.currentLevel / b.dangerLevel) - (a.currentLevel / a.dangerLevel))
      .slice(0, 10);

    return {
      stations: topStations.map(s => s.name),
      currentLevels: topStations.map(s => s.currentLevel),
      dangerLevels: topStations.map(s => s.dangerLevel),
    };
  }, [filteredStations]);

  // Heatmap data - Risk levels by day of week
  const heatmapData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const topStations = filteredStations.slice(0, 8);
    
    const data: [number, number, number][] = [];
    days.forEach((_, dayIndex) => {
      topStations.forEach((station, stationIndex) => {
        const riskValue = (station.currentLevel / station.dangerLevel) * 100;
        data.push([dayIndex, stationIndex, Math.round(riskValue)]);
      });
    });

    return {
      xAxis: days,
      yAxis: topStations.map(s => s.name),
      data,
    };
  }, [filteredStations]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="p-6 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Area Selector */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              {selectedArea 
                ? `Comprehensive analysis for ${selectedArea}` 
                : 'Comprehensive data analysis and trend visualization for entire Indus River'}
            </p>
          </div>
          <div className="w-64">
            <AreaSelector
              areas={availableAreas}
              selectedArea={selectedArea}
              onAreaChange={setSelectedArea}
            />
          </div>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Sensors */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Sensors</p>
                <p className="text-2xl font-bold text-white">{stats.totalStations}</p>
              </div>
            </div>
          </div>

          {/* Critical Stations */}
          <div className="bg-gray-900 rounded-xl p-4 border border-red-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-400">{stats.redCount + stats.darkOrangeCount}</p>
              </div>
            </div>
          </div>

          {/* Population at Risk */}
          <div className="bg-gray-900 rounded-xl p-4 border border-orange-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Population at Risk</p>
                <p className="text-xl font-bold text-white">{(stats.criticalPopulation / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>

          {/* Economic Loss */}
          <div className="bg-gray-900 rounded-xl p-4 border border-yellow-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Economic Loss</p>
                <p className="text-lg font-bold text-white">PKR {(stats.economicLoss / 1_000_000_000).toFixed(1)}B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <RiskGauge 
              value={overallRisk} 
              title={selectedArea ? `${selectedArea} Risk Level` : "Overall Risk Level"} 
              height="250px" 
            />
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Risk Distribution</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-400">🔴 Critical (Red)</span>
                  <span className="text-white font-semibold">{stats.redCount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.redCount / stats.totalStations) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-600">🟠 Very Dangerous</span>
                  <span className="text-white font-semibold">{stats.darkOrangeCount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.darkOrangeCount / stats.totalStations) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-400">🟡 Moderate</span>
                  <span className="text-white font-semibold">{stats.orangeCount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.orangeCount / stats.totalStations) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-yellow-400">🟢 Low Alert</span>
                  <span className="text-white font-semibold">{stats.yellowCount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.yellowCount / stats.totalStations) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Impact Summary</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Population:</span>
                <span className="text-white font-semibold">{stats.totalPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">At Critical Risk:</span>
                <span className="text-red-400 font-semibold">{stats.criticalPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High-Risk Villages:</span>
                <span className="text-orange-400 font-semibold">{stats.highRiskVillages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Livestock at Risk:</span>
                <span className="text-yellow-400 font-semibold">{stats.livestock.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Economic Loss:</span>
                  <span className="text-white font-bold">PKR {(stats.economicLoss / 1_000_000_000).toFixed(2)}B</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis - Last 24 Hours */}
        {trendData.length > 0 && timestamps.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Water Level Trends - Last 24 Hours (Critical Stations)
            </h3>
            <TrendChart
              stations={trendData as { name: string; data: number[] }[]}
              timestamps={timestamps}
              height="400px"
            />
          </div>
        )}

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Top 10 Stations by Risk Level
            </h3>
            <ComparisonChart
              stations={comparisonData.stations}
              currentLevels={comparisonData.currentLevels}
              dangerLevels={comparisonData.dangerLevels}
              height="400px"
            />
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Risk Heatmap - Weekly Pattern
            </h3>
            <HeatmapChart
              xAxis={heatmapData.xAxis}
              yAxis={heatmapData.yAxis}
              data={heatmapData.data}
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

