// Risk heatmap over time

import React from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsOption } from 'echarts';

interface HeatmapChartProps {
  xAxis: string[]; // Time labels
  yAxis: string[]; // Station names
  data: [number, number, number][]; // [xIndex, yIndex, value]
  className?: string;
  height?: string | number;
}

/**
 * Heatmap chart for risk over time/space
 * TODO: Customize colors based on reference project
 */
export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  xAxis,
  yAxis,
  data,
  className,
  height = '400px',
}) => {
  const option: EChartsOption = {
    title: {
      text: 'Risk Heatmap Over Time',
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
      },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${yAxis[params.value[1]]}<br/>${xAxis[params.value[0]]}<br/>Risk: ${params.value[2]}%`;
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitArea: {
        show: true,
      },
      axisLabel: {
        color: '#94a3b8',
      },
    },
    yAxis: {
      type: 'category',
      data: yAxis,
      splitArea: {
        show: true,
      },
      axisLabel: {
        color: '#94a3b8',
      },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: {
        color: '#94a3b8',
      },
      inRange: {
        color: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <BaseChart option={option} className={className} height={height} />;
};

