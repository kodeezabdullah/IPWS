// Base chart component wrapping echarts-for-react

import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { echartsTheme } from '../../lib/echarts-config';
import { cn } from '../../lib/utils';

interface BaseChartProps {
  option: EChartsOption;
  loading?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
  onChartReady?: (chart: any) => void;
}

/**
 * Reusable base chart component using echarts-for-react
 */
export const BaseChart: React.FC<BaseChartProps> = ({
  option,
  loading = false,
  className,
  height = '400px',
  width = '100%',
  onChartReady,
}) => {
  return (
    <div className={cn('relative', className)}>
      <ReactECharts
        option={option}
        theme={echartsTheme}
        showLoading={loading}
        style={{ height, width }}
        opts={{ renderer: 'canvas' }}
        onChartReady={onChartReady}
      />
    </div>
  );
};

