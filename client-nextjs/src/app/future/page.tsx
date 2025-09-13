'use client';

import MainLayout from '@/components/layout/MainLayout';
import RealTimeCandleChart from '@/components/trading/RealTimeCandleChart';
import PriceDisplay from '@/components/trading/PriceDisplay';
import ClientOnly from '@/components/ui/ClientOnly';
import { useWallet } from '@/contexts/WalletContext';
import { useSocket } from '@/contexts/SocketContext';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FuturePage() {
  const { isConnected } = useWallet();
  const { isConnected: socketConnected, emit, on, off } = useSocket();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [betAmount, setBetAmount] = useState('10');
  // Removed chartType state as we only use advanced chart now
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 60; // Reset to 60 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlaceBet = async (direction: 'UP' | 'DOWN') => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    setIsPlacingBet(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Bet placed: ${direction} $${betAmount} on ${selectedSymbol}`);

      // Reset form
      setBetAmount('10');
    } catch (error) {
      toast.error('Failed to place bet');
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Future Trading</h1>
          <p className="text-gray-400">
            Trade binary options on cryptocurrency futures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Price Chart Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Symbol Selector & Chart Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => setSelectedSymbol(symbol)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSymbol === symbol
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Real-time Advanced Chart</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <PriceDisplay symbol={selectedSymbol} timeLeft={timeLeft} />

            {/* Real-Time Advanced Chart */}
            <div className="mt-6">
              <ClientOnly fallback={
                <div className="bg-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="h-96 bg-gray-600 rounded"></div>
                </div>
              }>
                <RealTimeCandleChart symbol={selectedSymbol} />
              </ClientOnly>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-4">
            {/* Bet Amount */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Place Bet</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['10', '50', '100'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Bet Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => handlePlaceBet('UP')}
                    disabled={!isConnected || isPlacingBet}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold transition-colors"
                  >
                    <TrendingUp size={20} />
                    <span>UP</span>
                  </button>
                  <button
                    onClick={() => handlePlaceBet('DOWN')}
                    disabled={!isConnected || isPlacingBet}
                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold transition-colors"
                  >
                    <TrendingDown size={20} />
                    <span>DOWN</span>
                  </button>
                </div>

                {!isConnected && (
                  <p className="text-sm text-yellow-400 text-center mt-2">
                    Connect your wallet to start trading
                  </p>
                )}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              <div className="space-y-3">
                {[
                  { symbol: 'BTCUSDT', direction: 'UP', amount: 25, result: 'WIN', profit: 20 },
                  { symbol: 'ETHUSDT', direction: 'DOWN', amount: 50, result: 'LOSE', profit: -50 },
                  { symbol: 'BTCUSDT', direction: 'UP', amount: 10, result: 'WIN', profit: 8 },
                ].map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${
                        trade.direction === 'UP' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {trade.direction === 'UP' ? (
                          <TrendingUp size={12} className="text-white" />
                        ) : (
                          <TrendingDown size={12} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{trade.symbol}</div>
                        <div className="text-xs text-gray-400">${trade.amount}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.result === 'WIN' ? '+' : ''}${trade.profit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
