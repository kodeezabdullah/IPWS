// TypeScript interfaces for ECharts and data visualization

import type { EChartsOption } from 'echarts';

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp?: Date | string;
}

export interface TimeSeriesData {
  timestamps: string[];
  values: number[];
  label: string;
}

export interface MultiSeriesData {
  categories: string[];
  series: {
    name: string;
    data: number[];
    type?: 'line' | 'bar' | 'area';
  }[];
}

export interface GaugeData {
  value: number;
  name: string;
  min?: number;
  max?: number;
}

export interface HeatmapData {
  xAxis: string[];
  yAxis: string[];
  data: [number, number, number][]; // [xIndex, yIndex, value]
}

export interface ChartConfig extends EChartsOption {
  responsive?: boolean;
  autoResize?: boolean;
}

export interface ChartProps {
  data: any;
  config?: Partial<EChartsOption>;
  loading?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
}

export interface WaterLevelChartData {
  stationName: string;
  timeSeriesData: TimeSeriesData;
  dangerLevel: number;
  warningLevel: number;
  normalLevel: number;
}

export interface ComparisonChartData {
  stations: string[];
  currentLevels: number[];
  dangerLevels: number[];
  percentages: number[];
}

export interface RiskDistributionData {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

