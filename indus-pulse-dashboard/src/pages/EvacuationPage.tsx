// Evacuation Page - Shows evacuation routes, shelters, and planning

import React, { useState, useMemo } from 'react';
import { Navigation, Home, Users, CheckCircle, AlertCircle, MapPin, Activity, Calendar, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockStations, mockShelters, mockEvacuationRoutes } from '../data/mockData';
import { AreaSelector } from '../components/map/controls/AreaSelector';
import { BaseChart } from '../components/charts/BaseChart';
import type { EvacuationRoute } from '../types/route';

/**
 * Evacuation Page - Comprehensive evacuation planning and management
 */
export const EvacuationPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Get unique areas
  const availableAreas = useMemo(() => {
    const cities = new Set(mockStations.map(s => s.city));
    return Array.from(cities).sort();
  }, []);

  // Filter shelters by area
  const filteredShelters = useMemo(() => {
    if (!selectedArea) return mockShelters;
    return mockShelters.filter(s => s.district === selectedArea || s.province === selectedArea);
  }, [selectedArea]);

  // Filter routes by area (routes don't have city, so we keep all routes for now)
  const filteredRoutes = useMemo(() => {
    if (!selectedArea) return mockEvacuationRoutes;
    // Filter by checking if the route connects to shelters in the selected area
    return mockEvacuationRoutes.filter((r: EvacuationRoute) => {
      const shelter = mockShelters.find(s => s.id === r.destinationShelter);
      return shelter && (shelter.district === selectedArea || shelter.province === selectedArea);
    });
  }, [selectedArea]);

  // Calculate shelter statistics
  const shelterStats = useMemo(() => {
    const total = filteredShelters.length;
    const available = filteredShelters.filter(s => s.status === 'available').length;
    const partial = filteredShelters.filter(s => s.status === 'partial').length;
    const full = filteredShelters.filter(s => s.status === 'full').length;
    const closed = filteredShelters.filter(s => s.status === 'closed').length;
    const totalCapacity = filteredShelters.reduce((sum, s) => sum + s.capacity, 0);
    const currentOccupancy = filteredShelters.reduce((sum, s) => sum + s.currentOccupancy, 0);

    return {
      total,
      available,
      partial,
      full,
      closed,
      operational: available + partial, // available + partial are operational
      totalCapacity,
      currentOccupancy,
      availableCapacity: totalCapacity - currentOccupancy,
      occupancyRate: totalCapacity > 0 ? ((currentOccupancy / totalCapacity) * 100).toFixed(1) : '0',
    };
  }, [filteredShelters]);

  // Calculate route statistics
  const routeStats = useMemo(() => {
    const total = filteredRoutes.length;
    const clear = filteredRoutes.filter((r: EvacuationRoute) => r.status === 'open').length;
    const congested = filteredRoutes.filter((r: EvacuationRoute) => r.status === 'congested').length;
    const blocked = filteredRoutes.filter((r: EvacuationRoute) => r.status === 'blocked').length;
    const unsafe = filteredRoutes.filter((r: EvacuationRoute) => r.status === 'unsafe').length;

    return { total, clear, congested, blocked, unsafe };
  }, [filteredRoutes]);

  // Prepare shelter capacity chart
  const shelterCapacityData = useMemo(() => ({
    title: {
      text: 'Shelter Capacity Overview',
      left: 'center',
      textStyle: { color: '#e5e7eb' }
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c} people ({d}%)'
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#9ca3af' }
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
        formatter: '{b}: {c}',
        color: '#e5e7eb'
      },
      data: [
        { value: shelterStats.currentOccupancy, name: 'Occupied', itemStyle: { color: '#ef4444' } },
        { value: shelterStats.availableCapacity, name: 'Available', itemStyle: { color: '#10b981' } },
      ]
    }]
  }), [shelterStats]);

  // Prepare route status chart
  const routeStatusData = useMemo(() => ({
    title: {
      text: 'Evacuation Route Status',
      left: 'center',
      textStyle: { color: '#e5e7eb' }
    },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const }
    },
    xAxis: {
      type: 'category' as const,
      data: ['Open', 'Congested', 'Blocked', 'Unsafe'],
      axisLabel: { color: '#9ca3af' }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#9ca3af' },
      name: 'Routes',
      nameTextStyle: { color: '#9ca3af' }
    },
    series: [{
      data: [
        { value: routeStats.clear, itemStyle: { color: '#10b981' } },
        { value: routeStats.congested, itemStyle: { color: '#f59e0b' } },
        { value: routeStats.blocked, itemStyle: { color: '#ef4444' } },
        { value: routeStats.unsafe, itemStyle: { color: '#dc2626' } },
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
  }), [routeStats]);

  // Prepare shelter types chart
  const shelterTypesData = useMemo(() => {
    const typeCounts = filteredShelters.reduce((acc, shelter) => {
      acc[shelter.type] = (acc[shelter.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      title: {
        text: 'Shelter Types Distribution',
        left: 'center',
        textStyle: { color: '#e5e7eb' }
      },
      tooltip: {
        trigger: 'item' as const
      },
      series: [{
        type: 'pie' as const,
        radius: '70%',
        data: Object.entries(typeCounts).map(([type, count]) => ({
          value: count,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          itemStyle: {
            color: type === 'school' ? '#3b82f6' :
                   type === 'community_center' ? '#8b5cf6' :
                   type === 'mosque' ? '#06b6d4' :
                   type === 'government_building' ? '#f59e0b' : '#10b981'
          }
        })),
        label: {
          show: true,
          formatter: '{b}: {c}',
          color: '#e5e7eb'
        }
      }]
    };
  }, [filteredShelters]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="p-6 min-h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Area Selector */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Evacuation Planning</h1>
              <p className="text-gray-400">
                Comprehensive evacuation routes and shelter management
                {selectedArea && ` for ${selectedArea}`}
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
            {/* Total Shelters */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Home className="w-8 h-8 text-blue-400" />
                <span className="text-xs text-blue-300 font-semibold uppercase">Total</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{shelterStats.total}</p>
              <p className="text-sm text-gray-400">Active Shelters</p>
            </div>

            {/* Total Capacity */}
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-green-400" />
                <span className="text-xs text-green-300 font-semibold uppercase">{shelterStats.occupancyRate}%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {shelterStats.availableCapacity.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Available Capacity</p>
            </div>

            {/* Evacuation Routes */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Navigation className="w-8 h-8 text-purple-400" />
                <span className="text-xs text-purple-300 font-semibold uppercase">Routes</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{routeStats.clear}</p>
              <p className="text-sm text-gray-400">Clear Routes</p>
            </div>

            {/* Operational Status */}
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-8 h-8 text-orange-400" />
                <span className="text-xs text-orange-300 font-semibold uppercase">Ready</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{shelterStats.operational}</p>
              <p className="text-sm text-gray-400">Operational Shelters</p>
            </div>
          </div>

          {/* Shelter Status Overview */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              Shelter Status Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-gray-400">Available</p>
                </div>
                <p className="text-2xl font-bold text-green-400">{shelterStats.available}</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm text-gray-400">Partial</p>
                </div>
                <p className="text-2xl font-bold text-yellow-400">{shelterStats.partial}</p>
              </div>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-gray-400">Full</p>
                </div>
                <p className="text-2xl font-bold text-red-400">{shelterStats.full}</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <p className="text-sm text-gray-400">Current Occupancy</p>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {shelterStats.currentOccupancy.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <BaseChart option={shelterCapacityData} height="350px" />
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <BaseChart option={routeStatusData} height="350px" />
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <BaseChart option={shelterTypesData} height="350px" />
            </div>
          </div>

          {/* Shelters List */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-400" />
              Shelter Details ({filteredShelters.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredShelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className={cn(
                    'border rounded-lg p-4 transition-all',
                    shelter.status === 'available' ? 'bg-green-900/10 border-green-700/30' :
                    shelter.status === 'partial' ? 'bg-yellow-900/10 border-yellow-700/30' :
                    shelter.status === 'full' ? 'bg-red-900/10 border-red-700/30' :
                    'bg-gray-900/10 border-gray-700/30'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{shelter.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {shelter.district}, {shelter.province}
                        </div>
                        <div className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          {shelter.type.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold uppercase',
                        shelter.status === 'available' ? 'bg-green-600 text-white' :
                        shelter.status === 'partial' ? 'bg-yellow-600 text-white' :
                        shelter.status === 'full' ? 'bg-red-600 text-white' :
                        'bg-gray-600 text-white'
                      )}
                    >
                      {shelter.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Capacity</p>
                      <p className="text-lg font-bold text-white">{shelter.capacity}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Current</p>
                      <p className="text-lg font-bold text-blue-400">{shelter.currentOccupancy}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Available</p>
                      <p className="text-lg font-bold text-green-400">
                        {shelter.capacity - shelter.currentOccupancy}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Occupancy</p>
                      <p className="text-lg font-bold text-orange-400">
                        {((shelter.currentOccupancy / shelter.capacity) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Facilities Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {shelter.facilities.map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-900/30 border border-blue-700/30 rounded text-xs text-blue-300"
                        >
                          {facility === 'medical' && '🏥 Medical'}
                          {facility === 'food' && '🍽️ Food'}
                          {facility === 'water' && '💧 Water'}
                          {facility === 'sanitation' && '🚿 Sanitation'}
                          {facility === 'electricity' && '⚡ Power'}
                          {facility === 'communication' && '📡 Communication'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="text-sm">
                    <span className="text-gray-500">Contact: </span>
                    <span className="text-white font-mono">{shelter.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evacuation Routes */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-purple-400" />
              Evacuation Routes ({filteredRoutes.length})
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredRoutes.map((route: EvacuationRoute) => {
                const shelter = mockShelters.find(s => s.id === route.destinationShelter);
                return (
                  <div
                    key={route.id}
                    className={cn(
                      'border rounded-lg p-4 transition-all',
                      route.status === 'open' ? 'bg-green-900/10 border-green-700/30' :
                      route.status === 'congested' ? 'bg-orange-900/10 border-orange-700/30' :
                      route.status === 'blocked' ? 'bg-red-900/10 border-red-700/30' :
                      'bg-red-900/20 border-red-800/40'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{route.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-300">Origin</span>
                          </div>
                          <span className="text-gray-600">→</span>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-300">{shelter?.name || 'Shelter'}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold uppercase',
                          route.status === 'open' ? 'bg-green-600 text-white' :
                          route.status === 'congested' ? 'bg-orange-600 text-white' :
                          route.status === 'blocked' ? 'bg-red-600 text-white' :
                          'bg-red-700 text-white'
                        )}
                      >
                        {route.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-800/50 rounded p-3">
                        <p className="text-xs text-gray-500 mb-1">Distance</p>
                        <p className="text-lg font-bold text-white">{route.distance.toFixed(1)} km</p>
                      </div>
                      <div className="bg-gray-800/50 rounded p-3">
                        <p className="text-xs text-gray-500 mb-1">Est. Time</p>
                        <p className="text-lg font-bold text-blue-400">
                          {route.estimatedTime} min
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded p-3">
                        <p className="text-xs text-gray-500 mb-1">Road Type</p>
                        <p className="text-sm text-white capitalize">{route.roadType}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded p-3">
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="text-lg font-bold text-green-400">{route.capacity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Info */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Calendar className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Evacuation Readiness Summary</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedArea ? `In ${selectedArea}, there are ` : 'Across all monitored areas, there are '}
                  <span className="text-blue-400 font-semibold">{shelterStats.total} shelters</span> with a total capacity of{' '}
                  <span className="text-green-400 font-semibold">{shelterStats.totalCapacity.toLocaleString()} people</span>.
                  Currently, <span className="text-blue-400 font-semibold">{shelterStats.currentOccupancy.toLocaleString()} people</span> are
                  sheltered ({shelterStats.occupancyRate}% occupancy), leaving{' '}
                  <span className="text-green-400 font-semibold">{shelterStats.availableCapacity.toLocaleString()} spaces</span> available.
                  We have <span className="text-purple-400 font-semibold">{routeStats.total} evacuation routes</span> with{' '}
                  <span className="text-green-400 font-semibold">{routeStats.clear} routes clear</span> for immediate use.
                  <span className="text-green-400 font-semibold"> {shelterStats.operational} shelters</span> are fully operational and ready
                  to receive evacuees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

