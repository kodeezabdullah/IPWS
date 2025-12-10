// Custom hook for ECharts integration

import { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, ECharts } from 'echarts';
import { echartsTheme } from '../lib/echarts-config';

interface UseEChartsOptions {
  option: EChartsOption;
  theme?: string | object;
  loading?: boolean;
  autoResize?: boolean;
}

/**
 * Hook for managing ECharts instances
 */
export function useECharts({
  option,
  theme = echartsTheme,
  loading = false,
  autoResize = true,
}: UseEChartsOptions) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Register custom theme if it's an object
    if (typeof theme === 'object') {
      echarts.registerTheme('custom', theme);
      chartInstanceRef.current = echarts.init(chartRef.current, 'custom');
    } else {
      chartInstanceRef.current = echarts.init(chartRef.current, theme);
    }

    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, [theme]);

  // Update chart options
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    chartInstanceRef.current.setOption(option, true);
  }, [option]);

  // Handle loading state
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    if (loading) {
      chartInstanceRef.current.showLoading();
    } else {
      chartInstanceRef.current.hideLoading();
    }
  }, [loading]);

  // Handle auto resize
  useEffect(() => {
    if (!autoResize || !chartInstanceRef.current) return;

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [autoResize]);

  const resize = useCallback(() => {
    chartInstanceRef.current?.resize();
  }, []);

  return {
    chartRef,
    chartInstance: chartInstanceRef.current,
    resize,
  };
}

