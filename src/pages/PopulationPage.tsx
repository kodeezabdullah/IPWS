// Population Page - Shows population data and impact analysis

import React, { useState, useMemo } from 'react';
import { Users, Home, Heart, Dog, Wheat, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { mockStations, mockPopulationData } from '../data/mockData';
import { AreaSelector } from '../components/map/controls/AreaSelector';
import { BaseChart } from '../components/charts/BaseChart';

/**
 * Population Page - Comprehensive population and impact analysis
 */
export const PopulationPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Get unique areas
  const availableAreas = useMemo(() => {
    const cities = new Set(mockStations.map(s => s.city));
    return Array.from(cities).sort();
  }, []);

  // Filter population data by area
  const filteredPopulationData = useMemo(() => {
    if (!selectedArea) return mockPopulationData;
    const areaStations = mockStations.filter(s => s.city === selectedArea);
    const stationIds = new Set(areaStations.map(s => s.id));
    return mockPopulationData.filter(p => stationIds.has(p.stationId));
  }, [selectedArea]);

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const total = filteredPopulationData.reduce((acc, data) => {
      // Only count as "at risk" if the station has red or darkOrange risk level
      const isAtRisk = data.riskLevel === 'red' || data.riskLevel === 'darkOrange';
      const affectedPop = isAtRisk ? data.demographics.totalPopulation : 0;
      
      return {
        totalPopulation: acc.totalPopulation + data.demographics.totalPopulation,
        affectedPopulation: acc.affectedPopulation + affectedPop,
        households: acc.households + data.totalHouseholds,
        vulnerableGroups: {
          children: acc.vulnerableGroups.children + data.demographics.children,
          elderly: acc.vulnerableGroups.elderly + data.demographics.elderly,
          disabled: acc.vulnerableGroups.disabled + data.demographics.disabled,
          pregnant: acc.vulnerableGroups.pregnant + Math.round(data.demographics.totalPopulation * 0.002), // Estimate 0.2% pregnant women
        },
        economicLoss: acc.economicLoss + data.economicData.estimatedEconomicLoss,
        livestock: {
          total: acc.livestock.total + data.economicData.livestockCount,
          cattle: acc.livestock.cattle + Math.round(data.economicData.livestockCount * 0.2), // Estimate 20% cattle
          goats: acc.livestock.goats + Math.round(data.economicData.livestockCount * 0.3), // Estimate 30% goats/sheep
          poultry: acc.livestock.poultry + Math.round(data.economicData.livestockCount * 0.5), // Estimate 50% poultry
        },
        agriculture: acc.agriculture + data.economicData.agriculturalLand,
      };
    }, {
      totalPopulation: 0,
      affectedPopulation: 0,
      households: 0,
      vulnerableGroups: { children: 0, elderly: 0, disabled: 0, pregnant: 0 },
      economicLoss: 0,
      livestock: { total: 0, cattle: 0, goats: 0, poultry: 0 },
      agriculture: 0,
    });

    return total;
  }, [filteredPopulationData]);

  // Calculate risk percentage
  const riskPercentage = stats.totalPopulation > 0 
    ? ((stats.affectedPopulation / stats.totalPopulation) * 100).toFixed(1)
    : '0.0';

  // Prepare chart data for demographics
  const demographicsData = useMemo(() => {
    return {
      title: {
        text: 'Vulnerable Groups Distribution',
        left: 'center',
        textStyle: { color: '#e5e7eb' }
      },
      tooltip: {
        trigger: 'item' as const,
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie' as const,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1f2937',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside' as const,
          formatter: '{b}: {c} ({d}%)',
          color: '#e5e7eb'
        },
        data: [
          { value: stats.vulnerableGroups.children, name: 'Children (<12)', itemStyle: { color: '#3b82f6' } },
          { value: stats.vulnerableGroups.elderly, name: 'Elderly (>65)', itemStyle: { color: '#f59e0b' } },
          { value: stats.vulnerableGroups.disabled, name: 'Disabled', itemStyle: { color: '#ef4444' } },
          { value: stats.vulnerableGroups.pregnant, name: 'Pregnant Women', itemStyle: { color: '#ec4899' } },
        ]
      }]
    };
  }, [stats]);

  // Prepare chart data for livestock
  const livestockData = useMemo(() => ({
    title: {
      text: 'Livestock at Risk',
      left: 'center',
      textStyle: { color: '#e5e7eb' }
    },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const }
      },
      xAxis: {
        type: 'category' as const,
        data: ['Cattle', 'Goats/Sheep', 'Poultry'],
        axisLabel: { color: '#9ca3af' }
      },
      yAxis: {
        type: 'value' as const,
      axisLabel: { color: '#9ca3af' }
    },
      series: [{
        data: [
          { value: stats.livestock.cattle, itemStyle: { color: '#8b5cf6' } },
          { value: stats.livestock.goats, itemStyle: { color: '#06b6d4' } },
          { value: stats.livestock.poultry, itemStyle: { color: '#10b981' } },
        ],
        type: 'bar' as const,
      barWidth: '60%',
        label: {
          show: true,
          position: 'top' as const,
          color: '#e5e7eb',
          formatter: '{c}'
        }
    }]
  }), [stats]);

  // Area comparison data
  const areaComparisonData = useMemo(() => {
    // Group by city
    const cityStats = new Map<string, { population: number; affected: number; economic: number }>();
    
    mockPopulationData.forEach(data => {
      const city = data.city;
      const current = cityStats.get(city) || { population: 0, affected: 0, economic: 0 };
      cityStats.set(city, {
        population: current.population + data.demographics.totalPopulation,
        affected: current.affected + data.totalAffectedPopulation,
        economic: current.economic + data.economicData.estimatedEconomicLoss,
      });
    });

    // Sort by affected population and take top 10
    const topCities = Array.from(cityStats.entries())
      .sort((a, b) => b[1].affected - a[1].affected)
      .slice(0, 10);

    return {
      title: {
        text: 'Top 10 Areas by Affected Population',
        left: 'center',
        textStyle: { color: '#e5e7eb' }
      },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const }
      },
      legend: {
        data: ['Total Population', 'Affected Population'],
        bottom: 0,
        textStyle: { color: '#9ca3af' }
      },
      xAxis: {
        type: 'category' as const,
        data: topCities.map(([city]) => city),
        axisLabel: { 
          color: '#9ca3af',
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value' as const,
        axisLabel: { color: '#9ca3af' },
        name: 'Population',
        nameTextStyle: { color: '#9ca3af' }
      },
      series: [
        {
          name: 'Total Population',
          data: topCities.map(([, stats]) => stats.population),
          type: 'bar' as const,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'Affected Population',
          data: topCities.map(([, stats]) => stats.affected),
          type: 'bar' as const,
          itemStyle: { color: '#ef4444' }
        }
      ]
    };
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="p-6 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Area Selector */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Population Impact Analysis</h1>
              <p className="text-gray-400">
                Comprehensive analysis of population at risk
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

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Population */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-xs text-blue-300 font-semibold uppercase">Total</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.totalPopulation.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total Population</p>
            </div>

            {/* Affected Population */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <span className="text-xs text-red-300 font-semibold uppercase">{riskPercentage}%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.affectedPopulation.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Population at Risk</p>
            </div>

            {/* Households */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Home className="w-8 h-8 text-purple-400" />
                <span className="text-xs text-purple-300 font-semibold uppercase">Homes</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stats.households.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Households Affected</p>
            </div>

            {/* Economic Loss */}
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-orange-400" />
                <span className="text-xs text-orange-300 font-semibold uppercase">PKR</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {(stats.economicLoss / 1_000_000_000).toFixed(2)}B
              </p>
              <p className="text-sm text-gray-400">Economic Loss Estimate</p>
            </div>
          </div>

          {/* Vulnerable Groups */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-400" />
              Vulnerable Groups
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Children (&lt;12)</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.vulnerableGroups.children.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalPopulation > 0 
                    ? `${((stats.vulnerableGroups.children / stats.totalPopulation) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Elderly (&gt;65)</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.vulnerableGroups.elderly.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalPopulation > 0 
                    ? `${((stats.vulnerableGroups.elderly / stats.totalPopulation) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Disabled</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.vulnerableGroups.disabled.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalPopulation > 0 
                    ? `${((stats.vulnerableGroups.disabled / stats.totalPopulation) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <div className="bg-pink-900/20 border border-pink-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Pregnant Women</p>
                <p className="text-2xl font-bold text-pink-400">
                  {stats.vulnerableGroups.pregnant.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalPopulation > 0 
                    ? `${((stats.vulnerableGroups.pregnant / stats.totalPopulation) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics Pie Chart */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <BaseChart
                option={demographicsData}
                height="400px"
              />
            </div>

            {/* Livestock Bar Chart */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <BaseChart
                option={livestockData}
                height="400px"
              />
            </div>
          </div>

          {/* Livestock & Agriculture Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Livestock */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Dog className="w-6 h-6 text-purple-400" />
                Livestock at Risk
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                  <span className="text-gray-300">Cattle</span>
                  <span className="text-xl font-bold text-purple-400">
                    {stats.livestock.cattle.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
                  <span className="text-gray-300">Goats & Sheep</span>
                  <span className="text-xl font-bold text-cyan-400">
                    {stats.livestock.goats.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <span className="text-gray-300">Poultry</span>
                  <span className="text-xl font-bold text-green-400">
                    {stats.livestock.poultry.toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Livestock</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.livestock.cattle + stats.livestock.goats + stats.livestock.poultry).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Agriculture */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Wheat className="w-6 h-6 text-yellow-400" />
                Agricultural Impact
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Agricultural Land at Risk</p>
                  <p className="text-4xl font-bold text-yellow-400 mb-1">
                    {stats.agriculture.toLocaleString()}
                  </p>
                  <p className="text-lg text-gray-300">hectares</p>
                </div>
                <div className="p-4 bg-orange-900/20 border border-orange-700/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Estimated Crop Loss</p>
                  <p className="text-3xl font-bold text-orange-400 mb-1">
                    PKR {((stats.economicLoss * 0.3) / 1_000_000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500">~30% of total economic loss</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Livelihoods Affected</p>
                  <p className="text-3xl font-bold text-green-400">
                    {Math.round(stats.households * 0.6).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">farming households</p>
                </div>
              </div>
            </div>
          </div>

          {/* Area Comparison Chart */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <BaseChart
              option={areaComparisonData}
              height="500px"
            />
          </div>

          {/* Summary Info */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Population Impact Summary</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedArea ? `In ${selectedArea}, there are ` : 'Across all monitored areas, there are '}
                  <span className="text-blue-400 font-semibold">{stats.totalPopulation.toLocaleString()} people</span> living near flood-prone zones, 
                  with <span className="text-red-400 font-semibold">{stats.affectedPopulation.toLocaleString()} ({riskPercentage}%)</span> currently at risk. 
                  This includes <span className="text-pink-400 font-semibold">{stats.vulnerableGroups.children.toLocaleString()} children</span> and{' '}
                  <span className="text-orange-400 font-semibold">{stats.vulnerableGroups.elderly.toLocaleString()} elderly</span> who require special attention during evacuation. 
                  The estimated economic impact is <span className="text-yellow-400 font-semibold">PKR {(stats.economicLoss / 1_000_000_000).toFixed(2)} Billion</span>, 
                  affecting {stats.households.toLocaleString()} households across the region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

