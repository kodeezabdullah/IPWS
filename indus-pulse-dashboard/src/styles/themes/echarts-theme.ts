// ECharts custom theme for Indus Pulse Warning System
// TODO: Customize this theme to match your reference project colors

export const echartsTheme = {
  color: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  title: {
    textStyle: {
      color: '#f8fafc',
      fontWeight: 600,
    },
    subtextStyle: {
      color: '#94a3b8',
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#ccc',
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  candlestick: {
    itemStyle: {
      color: '#eb5454',
      color0: '#47b262',
      borderColor: '#eb5454',
      borderColor0: '#47b262',
      borderWidth: 1,
    },
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
    lineStyle: {
      width: 1,
      color: '#aaa',
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true,
    color: [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ],
    label: {
      color: '#eeeeee',
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#334155',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      show: true,
      color: '#94a3b8',
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#1e293b'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#334155',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      show: true,
      color: '#94a3b8',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#1e293b'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#334155',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      show: true,
      color: '#94a3b8',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#1e293b'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#334155',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#334155',
      },
    },
    axisLabel: {
      show: true,
      color: '#94a3b8',
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#1e293b'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: '#94a3b8',
    },
    emphasis: {
      iconStyle: {
        borderColor: '#f8fafc',
      },
    },
  },
  legend: {
    textStyle: {
      color: '#94a3b8',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#334155',
    borderWidth: 1,
    textStyle: {
      color: '#f8fafc',
    },
    axisPointer: {
      lineStyle: {
        color: '#334155',
        width: 1,
      },
      crossStyle: {
        color: '#334155',
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#334155',
      width: 1,
    },
    itemStyle: {
      color: '#5470c6',
      borderWidth: 1,
    },
    controlStyle: {
      color: '#94a3b8',
      borderColor: '#334155',
      borderWidth: 0.5,
    },
    checkpointStyle: {
      color: '#3b82f6',
      borderColor: 'rgba(59,130,246,0.3)',
    },
    label: {
      color: '#94a3b8',
    },
    emphasis: {
      itemStyle: {
        color: '#3b82f6',
      },
      controlStyle: {
        color: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 0.5,
      },
      label: {
        color: '#94a3b8',
      },
    },
  },
  visualMap: {
    textStyle: {
      color: '#94a3b8',
    },
  },
  dataZoom: {
    backgroundColor: 'rgba(47,69,84,0)',
    dataBackgroundColor: 'rgba(255,255,255,0.1)',
    fillerColor: 'rgba(167,183,204,0.2)',
    handleColor: '#5470c6',
    handleSize: '100%',
    textStyle: {
      color: '#94a3b8',
    },
  },
  markPoint: {
    label: {
      color: '#eeeeee',
    },
    emphasis: {
      label: {
        color: '#eeeeee',
      },
    },
  },
};

export default echartsTheme;

