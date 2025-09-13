'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface RealTimeCandleChartProps {
  symbol: string;
  className?: string;
}

export default function RealTimeCandleChart({ symbol, className = '' }: RealTimeCandleChartProps) {
  const isClient = useIsClient();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState(30);
  const [isNewRound, setIsNewRound] = useState(false);

  // Fetch real Bitcoin price and generate initial data
  const generateInitialData = async (): Promise<CandleData[]> => {
    let basePrice = 43000; // Fallback price

    try {
      // Fetch current Bitcoin price from Binance API
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const data = await response.json();
      basePrice = parseFloat(data.price);
    } catch (error) {
      console.warn('Failed to fetch real Bitcoin price, using fallback:', error);
    }

    const data: CandleData[] = [];
    const now = Math.floor(Date.now() / 1000);

    // Generate 50 candles of historical data
    for (let i = 49; i >= 0; i--) {
      const time = now - (i * 30); // 30-second intervals
      const volatility = basePrice * 0.001; // Reduced volatility for more realistic movement
      const change = (Math.random() - 0.5) * volatility;
      const open = i === 49 ? basePrice : data[data.length - 1]?.close || basePrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.2;
      const low = Math.min(open, close) - Math.random() * volatility * 0.2;

      data.push({
        time,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000 + 500,
      });
    }

    return data;
  };

  // Update current candle in real-time
  const updateCurrentCandle = () => {
    if (!candlestickSeriesRef.current) return;

    const data = candlestickSeriesRef.current.data();
    if (!data || data.length === 0) return;

    const lastCandle = data[data.length - 1];
    const volatility = lastCandle.close * 0.001;
    const change = (Math.random() - 0.5) * volatility;
    const newClose = lastCandle.close + change;

    // Update the current candle's high, low, and close
    const updatedCandle: CandleData = {
      time: lastCandle.time,
      open: lastCandle.open,
      high: Math.max(lastCandle.high, newClose, lastCandle.open),
      low: Math.min(lastCandle.low, newClose, lastCandle.open),
      close: newClose,
    };

    setCurrentPrice(newClose);
    candlestickSeriesRef.current.update(updatedCandle as any);
  };

  // Add new candle every 30 seconds
  const addNewCandle = () => {
    if (!candlestickSeriesRef.current) return;

    const data = candlestickSeriesRef.current.data();
    if (!data || data.length === 0) return;

    const lastCandle = data[data.length - 1];
    const now = Math.floor(Date.now() / 1000);

    const newCandle: CandleData = {
      time: now,
      open: lastCandle.close,
      high: lastCandle.close,
      low: lastCandle.close,
      close: lastCandle.close,
    };

    candlestickSeriesRef.current.update(newCandle as any);
    setIsNewRound(true);
    setTimeout(() => setIsNewRound(false), 1000);
  };

  // Round countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRoundTimeLeft(prev => {
        if (prev <= 1) {
          addNewCandle();
          return 30; // Reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Real-time candle updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentCandle();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isClient || !chartContainerRef.current) return;

    const initChart = async () => {
      const { createChart } = await import('lightweight-charts');

      const chart = createChart(chartContainerRef.current!, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
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

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });

      const initialData = await generateInitialData();
      candlestickSeries.setData(initialData as any);
      setCurrentPrice(initialData[initialData.length - 1].close);

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
      setIsLoading(false);

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    };

    initChart();
  }, [isClient, symbol]);

  if (!isClient) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-96 bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">{symbol} Real-Time Chart</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Price:</span>
            <span className="text-lg font-bold text-white">
              ${currentPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
            isNewRound ? 'bg-blue-600 animate-pulse' : 'bg-gray-600'
          }`}>
            <span className="text-sm text-white">Next Round:</span>
            <span className="text-lg font-bold text-white">{roundTimeLeft}s</span>
          </div>

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
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-96 rounded"
        style={{ minHeight: '500px' }}
      />

      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>30-second rounds • Real-time updates</span>
        <span>Live Bitcoin data simulation</span>
      </div>
    </div>
  );
}
