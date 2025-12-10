// Admin Dashboard Page - Complete Device Management and Control

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Battery, 
  Wifi, 
  WifiOff,
  Power,
  PowerOff,
  RefreshCw,
  Download,
  Upload,
  Server,
  HardDrive,
  Cpu,
  Database,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Zap,
  Settings
} from 'lucide-react';
import { mockStations, mockTimeSeries } from '../data/mockData';
import * as echarts from 'echarts';
import { useECharts } from '../hooks/useECharts';

export const AdminDashboardPage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle refresh all devices
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
      showNotification('All device data refreshed successfully!');
    }, 1500);
  };

  // Handle export report
  const handleExportReport = () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `IPWS-Admin-Report-${timestamp}.csv`;

    // Prepare CSV data
    const headers = [
      'Device ID',
      'Device Name',
      'Status',
      'Location (City)',
      'District',
      'Province',
      'Battery (%)',
      'Signal Strength (%)',
      'Risk Level',
      'Water Level (m)',
      'Danger Level (m)',
      'Trend',
      'Last Updated',
      'Latitude',
      'Longitude',
      'Memory Usage (%)',
      'CPU Usage (%)',
      'Data Transmitted (MB)',
      'Uptime (%)'
    ];

    const rows = devicesWithStatus.map(device => [
      device.deviceId,
      device.name,
      device.status,
      device.city,
      device.district,
      device.province,
      device.batteryLevel,
      device.signalStrength,
      device.riskLevel,
      device.currentLevel.toFixed(2),
      device.dangerLevel.toFixed(2),
      device.trend,
      new Date(device.lastUpdated).toLocaleString(),
      device.coordinates[1],
      device.coordinates[0],
      device.memoryUsage,
      device.cpuUsage,
      device.dataTransmitted,
      device.uptime
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification(`Report exported successfully: ${filename}`);
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Failed to export report. Please try again.', 'error');
    }
  };

  // Simulate device operational status (85% online, 10% warning, 5% offline)
  const devicesWithStatus = useMemo(() => {
    return mockStations.map((station, index) => {
      const random = Math.random();
      const status = random < 0.85 ? 'online' : random < 0.95 ? 'warning' : 'offline';
      const uptime = status === 'offline' ? 0 : Math.floor(Math.random() * 100);
      const lastSeen = status === 'offline' 
        ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - Math.random() * 60 * 60 * 1000);
      
      return {
        ...station,
        status,
        uptime,
        lastSeen,
        signalStrength: Math.floor(Math.random() * 100),
        dataTransmitted: Math.floor(Math.random() * 10000),
        memoryUsage: Math.floor(Math.random() * 100),
        cpuUsage: Math.floor(Math.random() * 100),
      };
    });
  }, [refreshKey]);

  // Filter devices by status
  const filteredDevices = useMemo(() => {
    if (filterStatus === 'all') return devicesWithStatus;
    return devicesWithStatus.filter(d => d.status === filterStatus);
  }, [devicesWithStatus, filterStatus]);

  // System statistics
  const systemStats = useMemo(() => {
    const online = devicesWithStatus.filter(d => d.status === 'online').length;
    const offline = devicesWithStatus.filter(d => d.status === 'offline').length;
    const warning = devicesWithStatus.filter(d => d.status === 'warning').length;
    const avgBattery = devicesWithStatus.reduce((sum, d) => sum + d.batteryLevel, 0) / devicesWithStatus.length;
    const avgSignal = devicesWithStatus.reduce((sum, d) => sum + d.signalStrength, 0) / devicesWithStatus.length;
    const totalData = devicesWithStatus.reduce((sum, d) => sum + d.dataTransmitted, 0);
    const criticalDevices = devicesWithStatus.filter(d => d.riskLevel === 'red').length;
    
    return { online, offline, warning, avgBattery, avgSignal, totalData, criticalDevices };
  }, [devicesWithStatus]);

  // Device status over time chart
  const deviceStatusChartRef = useECharts(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const onlineData = hours.map(() => systemStats.online + Math.floor(Math.random() * 20 - 10));
    const warningData = hours.map(() => systemStats.warning + Math.floor(Math.random() * 5));
    const offlineData = hours.map(() => systemStats.offline + Math.floor(Math.random() * 5));

    return {
      title: {
        text: 'Device Status - Last 24 Hours',
        textStyle: { color: '#fff', fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['Online', 'Warning', 'Offline'],
        textStyle: { color: '#9ca3af' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: hours,
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
        splitLine: { lineStyle: { color: '#374151' } },
      },
      series: [
        {
          name: 'Online',
          type: 'line',
          stack: 'Total',
          areaStyle: { color: 'rgba(34, 197, 94, 0.3)' },
          lineStyle: { color: '#22c55e' },
          itemStyle: { color: '#22c55e' },
          data: onlineData,
        },
        {
          name: 'Warning',
          type: 'line',
          stack: 'Total',
          areaStyle: { color: 'rgba(234, 179, 8, 0.3)' },
          lineStyle: { color: '#eab308' },
          itemStyle: { color: '#eab308' },
          data: warningData,
        },
        {
          name: 'Offline',
          type: 'line',
          stack: 'Total',
          areaStyle: { color: 'rgba(239, 68, 68, 0.3)' },
          lineStyle: { color: '#ef4444' },
          itemStyle: { color: '#ef4444' },
          data: offlineData,
        },
      ],
    };
  }, [systemStats]);

  // Data transmission chart
  const dataTransmissionChartRef = useECharts(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const uploadData = hours.map(() => Math.floor(Math.random() * 500 + 100));
    const downloadData = hours.map(() => Math.floor(Math.random() * 200 + 50));

    return {
      title: {
        text: 'Data Transmission (MB)',
        textStyle: { color: '#fff', fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Upload', 'Download'],
        textStyle: { color: '#9ca3af' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: hours,
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
        splitLine: { lineStyle: { color: '#374151' } },
      },
      series: [
        {
          name: 'Upload',
          type: 'bar',
          data: uploadData,
          itemStyle: { color: '#3b82f6' },
        },
        {
          name: 'Download',
          type: 'bar',
          data: downloadData,
          itemStyle: { color: '#f97316' },
        },
      ],
    };
  }, []);

  // Device distribution by location chart
  const locationChartRef = useECharts(() => {
    const cityCounts = devicesWithStatus.reduce((acc, device) => {
      acc[device.city] = (acc[device.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      title: {
        text: 'Top 10 Locations by Device Count',
        textStyle: { color: '#fff', fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
        splitLine: { lineStyle: { color: '#374151' } },
      },
      yAxis: {
        type: 'category',
        data: topCities.map(([city]) => city),
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisLabel: { color: '#9ca3af' },
      },
      series: [
        {
          type: 'bar',
          data: topCities.map(([, count]) => count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#f97316' },
              { offset: 1, color: '#3b82f6' },
            ]),
          },
        },
      ],
    };
  }, [devicesWithStatus]);

  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl border animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-green-600 border-green-500 text-white' 
            : 'bg-red-600 border-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Complete device management and system control</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh All'}
            </button>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Devices */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Server className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{devicesWithStatus.length}</p>
                <p className="text-xs text-gray-400">Total Devices</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">100%</span>
              <span className="text-gray-400">Deployed</span>
            </div>
          </div>

          {/* Online Devices */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{systemStats.online}</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{((systemStats.online / devicesWithStatus.length) * 100).toFixed(1)}%</span>
              <span className="text-gray-400">Operational</span>
            </div>
          </div>

          {/* Warning Devices */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{systemStats.warning}</p>
                <p className="text-xs text-gray-400">Warning</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Needs Attention</span>
            </div>
          </div>

          {/* Offline Devices */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{systemStats.offline}</p>
                <p className="text-xs text-gray-400">Offline</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400">Critical</span>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <Battery className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Avg Battery</p>
                <p className="text-xl font-bold text-white">{systemStats.avgBattery.toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-xs text-gray-400">Avg Signal</p>
                <p className="text-xl font-bold text-white">{systemStats.avgSignal.toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Total Data</p>
                <p className="text-xl font-bold text-white">{(systemStats.totalData / 1000).toFixed(1)} GB</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-xs text-gray-400">Critical Alerts</p>
                <p className="text-xl font-bold text-white">{systemStats.criticalDevices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div ref={deviceStatusChartRef} style={{ height: '300px' }} />
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div ref={dataTransmissionChartRef} style={{ height: '300px' }} />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div ref={locationChartRef} style={{ height: '400px' }} />
        </div>

        {/* Device List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Device Management</h2>
              <div className="flex gap-2">
                {(['all', 'online', 'warning', 'offline'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? status === 'online'
                          ? 'bg-green-600 text-white'
                          : status === 'warning'
                          ? 'bg-yellow-600 text-white'
                          : status === 'offline'
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Signal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Server className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{device.name}</p>
                          <p className="text-xs text-gray-400">{device.deviceId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {device.status === 'online' ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm text-green-400 font-medium">Online</span>
                          </>
                        ) : device.status === 'warning' ? (
                          <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-sm text-yellow-400 font-medium">Warning</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                            <span className="text-sm text-red-400 font-medium">Offline</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{device.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                device.batteryLevel > 60
                                  ? 'bg-green-400'
                                  : device.batteryLevel > 30
                                  ? 'bg-yellow-400'
                                  : 'bg-red-400'
                              }`}
                              style={{ width: `${device.batteryLevel}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{device.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {device.signalStrength > 60 ? (
                          <Wifi className="w-4 h-4 text-green-400" />
                        ) : device.signalStrength > 30 ? (
                          <Wifi className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm text-gray-300">{device.signalStrength}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          device.riskLevel === 'red'
                            ? 'bg-red-500/20 text-red-400'
                            : device.riskLevel === 'darkOrange'
                            ? 'bg-orange-600/20 text-orange-600'
                            : device.riskLevel === 'orange'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {device.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(device.lastSeen).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDevice(device.id)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        {device.status === 'offline' ? (
                          <button
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            title="Restart Device"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Power Off"
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

