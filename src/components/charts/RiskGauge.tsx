// Risk level gauge chart

import React from 'react';
import { BaseChart } from './BaseChart';
import type { EChartsOption } from 'echarts';

interface RiskGaugeProps {
  value: number; // 0-100
  title?: string;
  className?: string;
  height?: string | number;
}

/**
 * Gauge chart for displaying risk level
 * TODO: Customize colors based on reference project risk tiers
 */
export const RiskGauge: React.FC<RiskGaugeProps> = ({
  value,
  title = 'Risk Level',
  className,
  height = '300px',
}) => {
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.6, '#10b981'], // Low - Green
              [0.8, '#f59e0b'], // Medium - Yellow
              [0.95, '#f97316'], // High - Orange
              [1, '#ef4444'], // Critical - Red
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -20,
          length: 5,
          lineStyle: {
            color: '#fff',
            width: 1,
          },
        },
        splitLine: {
          distance: -20,
          length: 20,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        axisLabel: {
          color: '#94a3b8',
          distance: 25,
          fontSize: 10,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#f8fafc',
          fontSize: 24,
          offsetCenter: [0, '70%'],
        },
        title: {
          show: true,
          offsetCenter: [0, '90%'],
          color: '#94a3b8',
        },
        data: [
          {
            value: value,
            name: title,
          },
        ],
      },
    ],
  };

  return <BaseChart option={option} className={className} height={height} />;
};

