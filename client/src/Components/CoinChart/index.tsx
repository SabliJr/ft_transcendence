import "./coinchart.css";
// import { useRef, useState, useEffect } from "react";

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface CoinChartProps {
  data: ChartDataPoint[];
  loading: boolean;
  timeframe: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const CoinChart = ({ data, loading, timeframe, isFullscreen = false, onToggleFullscreen }: CoinChartProps) => {
  const formatChartValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatChartDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case "1D":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "7D":
        return date.toLocaleDateString([], { weekday: 'short' });
      case "1M":
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case "6M":
        return date.toLocaleDateString([], { month: 'short' });
      case "1Y":
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getXLabelConfig = () => {
    switch (timeframe) {
      case "1D":
        return { count: 6 }; // Every 4 hours
      case "7D":
        return { count: 7 }; // Every day
      case "1M":
        return { count: 5 }; // Keep as is
      case "6M":
        return { count: 6 }; // Every month
      case "1Y":
        return { count: 6 }; // Every 2 months
      default:
        return { count: 5 };
    }
  };

  if (loading) {
    return <div className={`chart-loading ${isFullscreen ? 'fullscreen' : ''}`}>Loading chart...</div>;
  }

  if (data.length === 0) {
    return <div className={`chart-no-data ${isFullscreen ? 'fullscreen' : ''}`}>No chart data available</div>;
  }

  const width = 800;
  const height = isFullscreen ? 500 : 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const getX = (index: number) => 
    padding.left + (index / (data.length - 1)) * chartWidth;
  
  const getY = (value: number) => 
    padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create path for line
  const linePath = data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create path for gradient fill
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  // Determine if trend is positive
  const isPositive = data.length > 1 && 
    data[data.length - 1].value >= data[0].value;
  
  const strokeColor = isPositive ? '#16c784' : '#ea3943';
  const gradientId = isPositive ? 'chartGradientGreen' : 'chartGradientRed';

  // Y-axis labels (5 labels)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + (valueRange * i) / 4;
    return { value, y: getY(value) };
  });

  // X-axis labels based on timeframe
  const { count: xLabelCount } = getXLabelConfig();
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    const index = Math.floor((i / (xLabelCount - 1)) * (data.length - 1));
    return {
      timestamp: data[index].timestamp,
      x: getX(index),
    };
  });

  return (
    <div className={`coin-chart-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {isFullscreen && (
        <button className="close-fullscreen-btn" onClick={onToggleFullscreen}>
          ✕
        </button>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="coin-chart-svg">
        <defs>
          <linearGradient id="chartGradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16c784" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#16c784" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="chartGradientRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea3943" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ea3943" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={label.y}
            x2={width - padding.right}
            y2={label.y}
            stroke="#e9ecef"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y-axis labels (left side) */}
        {yLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left - 8}
            y={label.y + 4}
            fontSize="11"
            fill="#6c757d"
            textAnchor="end"
          >
            {formatChartValue(label.value)}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - padding.bottom + 20}
            fontSize="11"
            fill="#6c757d"
            textAnchor="middle"
          >
            {formatChartDate(label.timestamp)}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default CoinChart;
