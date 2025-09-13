'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  ExternalLink,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatBalance, formatAddress } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  hash?: string;
}

export default function WalletPage() {
  const { account, isConnected, connectWallet } = useWallet();
  const [balance, setBalance] = useState({
    total: 1250.75,
    available: 1100.50,
    locked: 150.25
  });
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 500,
      status: 'completed',
      timestamp: '2024-01-20T10:30:00Z',
      hash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'trade',
      amount: -25,
      status: 'completed',
      timestamp: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      type: 'trade',
      amount: 45,
      status: 'completed',
      timestamp: '2024-01-20T08:45:00Z'
    },
    {
      id: '4',
      type: 'withdraw',
      amount: -200,
      status: 'pending',
      timestamp: '2024-01-19T16:20:00Z',
      hash: '0xabcd...efgh'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate deposit process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBalance(prev => ({
        ...prev,
        total: prev.total + parseFloat(depositAmount),
        available: prev.available + parseFloat(depositAmount)
      }));
      
      toast.success(`Deposited $${depositAmount} successfully`);
      setDepositAmount('');
      setShowDepositModal(false);
    } catch (error) {
      toast.error('Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > balance.available) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate withdraw process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBalance(prev => ({
        ...prev,
        total: prev.total - parseFloat(withdrawAmount),
        available: prev.available - parseFloat(withdrawAmount)
      }));
      
      toast.success(`Withdrawal of $${withdrawAmount} initiated`);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
    } catch (error) {
      toast.error('Withdrawal failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    setIsLoading(true);
    try {
      // Simulate balance refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Balance refreshed');
    } catch (error) {
      toast.error('Failed to refresh balance');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <WalletIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view your balance and transactions
            </p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Wallet</h1>
              <p className="text-gray-400">Manage your funds and transactions</p>
            </div>
            <button
              onClick={refreshBalance}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Address */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wallet Address</h3>
              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                <span className="text-white font-mono">{formatAddress(account!)}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(account!)}
                    className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
                    className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Total Balance</h4>
                <p className="text-2xl font-bold text-white">${formatBalance(balance.total)}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Available</h4>
                <p className="text-2xl font-bold text-green-400">${formatBalance(balance.available)}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Locked in Trades</h4>
                <p className="text-2xl font-bold text-yellow-400">${formatBalance(balance.locked)}</p>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'deposit' ? 'bg-green-600' :
                        tx.type === 'withdraw' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft size={16} className="text-white" />
                        ) : tx.type === 'withdraw' ? (
                          <ArrowUpRight size={16} className="text-white" />
                        ) : (
                          <WalletIcon size={16} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                      </div>
                      <div className={`text-sm ${
                        tx.status === 'completed' ? 'text-green-400' :
                        tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <Plus size={18} />
                  <span>Deposit</span>
                </button>
                
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <Minus size={18} />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Deposits</span>
                  <span className="text-white">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Withdrawals</span>
                  <span className="text-white">$800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trading P&L</span>
                  <span className="text-green-400">+$450.75</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Net Profit</span>
                  <span className="text-green-400">+$450.75</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Deposit Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeposit}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Deposit'}
                  </button>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Withdraw Funds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    max={balance.available}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Available: ${formatBalance(balance.available)}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleWithdraw}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Withdraw'}
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
