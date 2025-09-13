'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { Droplets, Clock, Gift, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FaucetPage() {
  const { account, isConnected, connectWallet } = useWallet();
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [claimAmount] = useState(100); // 100 HHD tokens
  const [cooldownHours] = useState(24); // 24 hours cooldown

  const canClaim = () => {
    if (!lastClaimTime) return true;
    const now = new Date();
    const timeDiff = now.getTime() - lastClaimTime.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff >= cooldownHours;
  };

  const getTimeUntilNextClaim = () => {
    if (!lastClaimTime) return null;
    const now = new Date();
    const nextClaimTime = new Date(lastClaimTime.getTime() + (cooldownHours * 60 * 60 * 1000));
    const timeDiff = nextClaimTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!canClaim()) {
      toast.error('You must wait before claiming again');
      return;
    }

    setIsClaiming(true);

    try {
      // Simulate faucet claim transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setLastClaimTime(new Date());
      toast.success(`Successfully claimed ${claimAmount} HHD tokens!`);
    } catch (error) {
      toast.error('Failed to claim tokens. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const timeUntilNext = getTimeUntilNextClaim();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Droplets size={32} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">HHD Token Faucet</h1>
          </div>
          <p className="text-gray-400">
            Get free HHD tokens to start trading on our platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faucet Claim */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Claim Free Tokens</h2>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Wallet Not Connected</h3>
                <p className="text-gray-400 mb-6">
                  Please connect your wallet to claim free HHD tokens
                </p>
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Claim Amount */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Claim Amount</span>
                    <div className="flex items-center space-x-2">
                      <Gift size={20} className="text-green-400" />
                      <span className="text-xl font-bold text-white">{claimAmount} HHD</span>
                    </div>
                  </div>
                </div>

                {/* Cooldown Status */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cooldown Period</span>
                    <div className="flex items-center space-x-2">
                      <Clock size={20} className="text-blue-400" />
                      <span className="text-white">{cooldownHours} hours</span>
                    </div>
                  </div>
                </div>

                {/* Next Claim Timer */}
                {timeUntilNext && (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock size={20} className="text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Next claim available in:</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {timeUntilNext.hours}h {timeUntilNext.minutes}m
                    </div>
                  </div>
                )}

                {/* Claim Button */}
                <button
                  onClick={handleClaim}
                  disabled={!canClaim() || isClaiming}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
                    canClaim() && !isClaiming
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isClaiming ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claiming...</span>
                    </div>
                  ) : canClaim() ? (
                    `Claim ${claimAmount} HHD Tokens`
                  ) : (
                    'Claim Unavailable'
                  )}
                </button>

                {/* Wallet Address */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Receiving Address</div>
                  <div className="text-white font-mono text-sm break-all">
                    {account}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How it Works</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-medium">Connect Wallet</div>
                    <div className="text-gray-400 text-sm">Connect your MetaMask or compatible wallet</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-medium">Claim Tokens</div>
                    <div className="text-gray-400 text-sm">Click the claim button to receive free HHD tokens</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-medium">Start Trading</div>
                    <div className="text-gray-400 text-sm">Use your tokens to place trades on our platform</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules & Limits */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rules & Limits</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Claim Amount</span>
                  <span className="text-white">{claimAmount} HHD</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Cooldown Period</span>
                  <span className="text-white">{cooldownHours} hours</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Claims per Day</span>
                  <span className="text-white">1</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">Ethereum</span>
                </div>
              </div>
            </div>

            {/* Recent Claims */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Recent Claims</h3>
              
              {lastClaimTime ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{claimAmount} HHD</div>
                      <div className="text-sm text-gray-400">
                        {lastClaimTime.toLocaleDateString()} at {lastClaimTime.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">Claimed</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Droplets size={32} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400">No claims yet</p>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-sm text-yellow-200">
                <li>• Faucet tokens are for testing purposes only</li>
                <li>• Each wallet can claim once every 24 hours</li>
                <li>• Tokens will be sent to your connected wallet</li>
                <li>• Make sure you're on the correct network</li>
                <li>• Gas fees may apply for the transaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
