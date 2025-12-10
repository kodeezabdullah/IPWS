// Multi-station trend comparison chart

import React from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsOption } from 'echarts';

interface TrendChartProps {
  stations: Array<{
    name: string;
    data: number[];
  }>;
  timestamps: string[];
  className?: string;
  height?: string | number;
}

/**
 * Multi-station trend comparison chart
 * TODO: Customize colors based on reference project
 */
export const TrendChart: React.FC<TrendChartProps> = ({
  stations,
  timestamps,
  className,
  height = '400px',
}) => {
  const option: EChartsOption = {
    title: {
      text: 'Station Trends Comparison',
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: stations.map((s) => s.name),
      textStyle: {
        color: '#94a3b8',
      },
    },
    xAxis: {
      type: 'category',
      data: timestamps,
      axisLabel: {
        color: '#94a3b8',
      },
    },
    yAxis: {
      type: 'value',
      name: 'Water Level (m)',
      axisLabel: {
        color: '#94a3b8',
      },
      splitLine: {
        lineStyle: {
          color: '#1e293b',
        },
      },
    },
    series: stations.map((station) => ({
      name: station.name,
      type: 'line',
      data: station.data,
      smooth: true,
      lineStyle: {
        width: 2,
      },
    })),
  };

  return <BaseChart option={option} className={className} height={height} />;
};

