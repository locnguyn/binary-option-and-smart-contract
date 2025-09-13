'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useIsClient } from '@/hooks/useIsClient';

interface PriceDisplayProps {
  symbol: string;
  timeLeft: number;
}

interface PriceData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
}

export default function PriceDisplay({ symbol, timeLeft }: PriceDisplayProps) {
  const isClient = useIsClient();

  // Initialize with static values to avoid hydration mismatch
  const getInitialPrice = () => {
    return symbol === 'BTCUSDT' ? 45000 : symbol === 'ETHUSDT' ? 3000 : 1;
  };

  const [priceData, setPriceData] = useState<PriceData>(() => {
    const basePrice = getInitialPrice();
    return {
      price: basePrice,
      change: 0,
      changePercent: 0,
      volume: 1234567,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
    };
  });

  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Simulate real-time price updates
  useEffect(() => {
    if (!isClient) return;

    const basePrice = getInitialPrice();

    setPriceData(prev => ({
      ...prev,
      price: basePrice,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
    }));

    const interval = setInterval(() => {
      setPriceData(prev => {
        const volatility = prev.price * 0.001; // 0.1% volatility
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = prev.price + change;
        const newChange = newPrice - basePrice;
        const newChangePercent = (newChange / basePrice) * 100;

        // Set price direction for animation
        if (change > 0) {
          setPriceDirection('up');
        } else if (change < 0) {
          setPriceDirection('down');
        }

        // Reset direction after animation
        setTimeout(() => setPriceDirection('neutral'), 500);

        return {
          ...prev,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          volume: prev.volume + Math.random() * 1000,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isClient, symbol]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(0);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{symbol}</h2>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-lg font-mono text-white">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Price */}
      <div className="mb-6">
        <div className={`text-4xl font-bold transition-colors duration-500 ${
          priceDirection === 'up' ? 'text-green-400' :
          priceDirection === 'down' ? 'text-red-400' : 'text-white'
        }`}>
          {formatPrice(priceData.price)}
        </div>

        <div className={`flex items-center space-x-2 mt-2 ${
          priceData.change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {priceData.change >= 0 ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="font-medium">
            {priceData.change >= 0 ? '+' : ''}{formatPrice(priceData.change)}
          </span>
          <span className="font-medium">
            ({priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">24h High</div>
          <div className="text-white font-semibold">{formatPrice(priceData.high24h)}</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">24h Low</div>
          <div className="text-white font-semibold">{formatPrice(priceData.low24h)}</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-3 col-span-2">
          <div className="text-sm text-gray-400 mb-1">24h Volume</div>
          <div className="text-white font-semibold">{formatVolume(priceData.volume)} {symbol.replace('USDT', '')}</div>
        </div>
      </div>

      {/* Price Movement Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              priceDirection === 'up' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
            }`}></div>
            <span className="text-sm text-gray-400">Bullish</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              priceDirection === 'down' ? 'bg-red-400 animate-pulse' : 'bg-gray-600'
            }`}></div>
            <span className="text-sm text-gray-400">Bearish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
