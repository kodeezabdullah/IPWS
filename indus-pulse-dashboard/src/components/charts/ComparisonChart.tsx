// Station comparison bar chart

import React from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsOption } from 'echarts';

interface ComparisonChartProps {
  stations: string[];
  currentLevels: number[];
  dangerLevels: number[];
  className?: string;
  height?: string | number;
}

/**
 * Bar chart for station comparison
 * TODO: Customize colors based on reference project
 */
export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  stations,
  currentLevels,
  dangerLevels,
  className,
  height = '400px',
}) => {
  const option: EChartsOption = {
    title: {
      text: 'Station Water Levels Comparison',
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Current Level', 'Danger Level'],
      textStyle: {
        color: '#94a3b8',
      },
    },
    xAxis: {
      type: 'category',
      data: stations,
      axisLabel: {
        color: '#94a3b8',
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Level (m)',
      axisLabel: {
        color: '#94a3b8',
      },
      splitLine: {
        lineStyle: {
          color: '#1e293b',
        },
      },
    },
    series: [
      {
        name: 'Current Level',
        type: 'bar',
        data: currentLevels,
        itemStyle: {
          color: '#3b82f6',
        },
      },
      {
        name: 'Danger Level',
        type: 'bar',
        data: dangerLevels,
        itemStyle: {
          color: '#ef4444',
        },
      },
    ],
  };

  return <BaseChart option={option} className={className} height={height} />;
};

