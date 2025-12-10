// Water level time-series chart

import React from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsOption } from 'echarts';
import { format } from 'date-fns';

interface WaterLevelChartProps {
  stationName: string;
  data: Array<{ timestamp: Date | string; waterLevel: number }>;
  dangerLevel: number;
  warningLevel?: number;
  normalLevel?: number;
  className?: string;
  height?: string | number;
}

/**
 * Time-series line chart for water levels
 * TODO: Customize colors and styling based on reference project
 */
export const WaterLevelChart: React.FC<WaterLevelChartProps> = ({
  stationName,
  data,
  dangerLevel,
  className,
  height = '400px',
}) => {
  const timestamps = data.map((d) =>
    format(new Date(d.timestamp), 'HH:mm')
  );
  const values = data.map((d) => d.waterLevel);

  const option: EChartsOption = {
    title: {
      text: `${stationName} - Water Level`,
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        return `${point.name}<br/>Level: ${point.value} m`;
      },
    },
    legend: {
      data: ['Water Level', 'Danger Level'],
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
        name: 'Water Level',
        type: 'line',
        data: values,
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
      },
      {
        name: 'Danger Level',
        type: 'line',
        data: Array(timestamps.length).fill(dangerLevel),
        lineStyle: {
          type: 'dashed',
          color: '#ef4444',
        },
      },
    ],
  };

  return <BaseChart option={option} className={className} height={height} />;
};

