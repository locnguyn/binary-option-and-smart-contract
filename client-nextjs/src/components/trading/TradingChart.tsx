'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface TradingChartProps {
  symbol: string;
  className?: string;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function TradingChart({ symbol, className = '' }: TradingChartProps) {
  const isClient = useIsClient();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock candlestick data
  const generateMockData = (): CandleData[] => {
    const data: CandleData[] = [];
    const basePrice = symbol === 'BTCUSDT' ? 45000 : symbol === 'ETHUSDT' ? 3000 : 1;
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = 100; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000); // 1 minute intervals
      const open = currentPrice;
      const volatility = basePrice * 0.002; // 0.2% volatility

      const change = (Math.random() - 0.5) * volatility;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;

      data.push({
        time: Math.floor(time.getTime() / 1000),
        open,
        high,
        low,
        close,
      });

      currentPrice = close;
    }

    return data;
  };

  // Update chart with new data
  const updateChart = () => {
    if (!candlestickSeriesRef.current) return;

    // Get the last data point from the series
    const data = candlestickSeriesRef.current.data();
    if (!data || data.length === 0) return;

    const lastData = data[data.length - 1];
    const now = Math.floor(Date.now() / 1000);
    const volatility = lastData.close * 0.001;
    const change = (Math.random() - 0.5) * volatility;
    const newClose = lastData.close + change;

    const newCandle: CandleData = {
      time: now,
      open: lastData.close,
      high: Math.max(lastData.close, newClose) + Math.random() * volatility * 0.3,
      low: Math.min(lastData.close, newClose) - Math.random() * volatility * 0.3,
      close: newClose,
    };

    candlestickSeriesRef.current.update(newCandle);
  };

  useEffect(() => {
    if (!isClient || !chartContainerRef.current) return;

    // Dynamically import lightweight-charts
    const initChart = async () => {
      const { createChart } = await import('lightweight-charts');

      // Create chart
      const chart = createChart(chartContainerRef.current!, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#4b5563',
      },
      timeScale: {
        borderColor: '#4b5563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // Generate and set initial data
    const initialData = generateMockData();
    candlestickSeries.setData(initialData);

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

      // Update chart every 2 seconds with new data
      const interval = setInterval(updateChart, 2000);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(interval);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    };

    initChart();
  }, [isClient, symbol]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300">Loading chart...</span>
          </div>
        </div>
      )}

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{symbol} Price Chart</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-400">Up</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-400">Down</span>
            </div>
          </div>
        </div>

        <div
          ref={chartContainerRef}
          className="w-full h-96 rounded"
          style={{ minHeight: '400px' }}
        />

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>Real-time data simulation</span>
          <span>1m intervals</span>
        </div>
      </div>
    </div>
  );
}
