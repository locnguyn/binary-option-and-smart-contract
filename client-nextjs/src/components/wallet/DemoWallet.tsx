'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'bet' | 'win' | 'loss' | 'deposit';
  amount: number;
  symbol?: string;
  direction?: 'UP' | 'DOWN';
  timestamp: Date;
  result?: 'WIN' | 'LOSE';
}

export default function DemoWallet() {
  const [balance, setBalance] = useState(10000); // Start with $10,000 demo balance
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  // Initialize with some demo transactions
  useEffect(() => {
    const initialTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        amount: 10000,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: '2',
        type: 'bet',
        amount: -50,
        symbol: 'BTCUSDT',
        direction: 'UP',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        result: 'WIN',
      },
      {
        id: '3',
        type: 'win',
        amount: 40,
        symbol: 'BTCUSDT',
        direction: 'UP',
        timestamp: new Date(Date.now() - 3600000 + 60000), // 1 hour ago + 1 min
        result: 'WIN',
      },
      {
        id: '4',
        type: 'bet',
        amount: -25,
        symbol: 'ETHUSDT',
        direction: 'DOWN',
        timestamp: new Date(Date.now() - 1800000), // 30 min ago
        result: 'LOSE',
      },
    ];
    setTransactions(initialTransactions);
  }, []);

  const resetWallet = async () => {
    setIsResetting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBalance(10000);
    setTransactions([{
      id: Date.now().toString(),
      type: 'deposit',
      amount: 10000,
      timestamp: new Date(),
    }]);
    
    setIsResetting(false);
    toast.success('Demo wallet reset successfully!');
  };

  const addDemoFunds = (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      timestamp: new Date(),
    };
    
    setBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success(`Added $${amount} to demo wallet`);
  };

  // Simulate placing a bet (this would be called from the trading interface)
  const placeDemoBet = (amount: number, symbol: string, direction: 'UP' | 'DOWN') => {
    if (balance < amount) {
      toast.error('Insufficient demo balance');
      return false;
    }

    const betTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'bet',
      amount: -amount,
      symbol,
      direction,
      timestamp: new Date(),
    };

    setBalance(prev => prev - amount);
    setTransactions(prev => [betTransaction, ...prev]);
    
    // Simulate bet result after 30 seconds (for demo purposes, we'll make it random)
    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      const resultTransaction: Transaction = {
        id: (Date.now() + 1).toString(),
        type: isWin ? 'win' : 'loss',
        amount: isWin ? amount * 0.8 : 0, // 80% payout on win
        symbol,
        direction,
        timestamp: new Date(),
        result: isWin ? 'WIN' : 'LOSE',
      };

      if (isWin) {
        setBalance(prev => prev + amount * 0.8);
      }
      
      setTransactions(prev => [resultTransaction, ...prev]);
      toast.success(`Bet result: ${isWin ? 'WIN' : 'LOSE'}`);
    }, 30000);

    return true;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return <DollarSign size={16} className="text-blue-400" />;
      case 'bet':
        return transaction.direction === 'UP' ? 
          <TrendingUp size={16} className="text-orange-400" /> : 
          <TrendingDown size={16} className="text-orange-400" />;
      case 'win':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'loss':
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Wallet size={16} className="text-gray-400" />;
    }
  };

  const getTransactionColor = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
      case 'win':
        return 'text-green-400';
      case 'bet':
      case 'loss':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Demo Wallet</h1>
            <p className="text-gray-400">
              Practice trading with virtual funds
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Wallet size={24} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Current Balance</h2>
          <button
            onClick={resetWallet}
            disabled={isResetting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={isResetting ? 'animate-spin' : ''} />
            <span>Reset Wallet</span>
          </button>
        </div>
        
        <div className="text-4xl font-bold text-white mb-4">
          {formatCurrency(balance)}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => addDemoFunds(1000)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Add $1,000
          </button>
          <button
            onClick={() => addDemoFunds(5000)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Add $5,000
          </button>
          <button
            onClick={() => addDemoFunds(10000)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Add $10,000
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No transactions yet
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction)}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {transaction.type === 'deposit' && 'Deposit'}
                      {transaction.type === 'bet' && `Bet ${transaction.direction} on ${transaction.symbol}`}
                      {transaction.type === 'win' && `Win on ${transaction.symbol}`}
                      {transaction.type === 'loss' && `Loss on ${transaction.symbol}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getTransactionColor(transaction)}`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-yellow-400 font-medium">Demo Mode</span>
        </div>
        <p className="text-yellow-300 text-sm mt-2">
          This is a demo wallet with virtual funds. No real money is involved. 
          Use this to practice trading strategies before using real funds.
        </p>
      </div>
    </div>
  );
}
