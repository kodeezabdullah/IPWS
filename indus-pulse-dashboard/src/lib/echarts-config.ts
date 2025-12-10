// ECharts global configuration for Indus Pulse Warning System

import type { EChartsOption } from 'echarts';
import { echartsTheme } from '../styles/themes/echarts-theme';

/**
 * Base configuration for all charts
 */
export const baseChartConfig: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#334155',
    borderWidth: 1,
    textStyle: {
      color: '#f8fafc',
    },
  },
};

/**
 * Line chart configuration
 */
export const lineChartConfig: EChartsOption = {
  ...baseChartConfig,
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      color: '#94a3b8',
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
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
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        opacity: 0.3,
      },
    },
  ],
};

/**
 * Bar chart configuration
 */
export const barChartConfig: EChartsOption = {
  ...baseChartConfig,
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      color: '#94a3b8',
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
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
      type: 'bar',
      barWidth: '60%',
    },
  ],
};

/**
 * Gauge chart configuration
 */
export const gaugeChartConfig: EChartsOption = {
  ...baseChartConfig,
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
            [0.6, '#10b981'],
            [0.8, '#f59e0b'],
            [0.95, '#f97316'],
            [1, '#ef4444'],
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
        fontSize: 20,
      },
    },
  ],
};

/**
 * Heatmap chart configuration
 */
export const heatmapChartConfig: EChartsOption = {
  ...baseChartConfig,
  tooltip: {
    position: 'top',
  },
  grid: {
    left: '10%',
    right: '10%',
    top: '5%',
    bottom: '10%',
  },
  xAxis: {
    type: 'category',
    splitArea: {
      show: true,
    },
    axisLabel: {
      color: '#94a3b8',
    },
  },
  yAxis: {
    type: 'category',
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
  },
  series: [
    {
      type: 'heatmap',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

/**
 * Get responsive chart options based on container size
 */
export function getResponsiveOptions(width: number): Partial<EChartsOption> {
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  
  return {
    grid: {
      left: isMobile ? '5%' : '3%',
      right: isMobile ? '5%' : '4%',
      bottom: isMobile ? '5%' : '3%',
    },
    textStyle: {
      fontSize: isMobile ? 10 : isTablet ? 11 : 12,
    },
  };
}

export { echartsTheme };

