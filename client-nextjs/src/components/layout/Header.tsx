'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useIsClient } from '@/hooks/useIsClient';
import { useState } from 'react';
import { Menu, X, Wallet } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const isClient = useIsClient();
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BO</span>
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">
              Binary Options
            </h1>
          </div>
        </div>

        {/* Right side - Wallet connection */}
        <div className="flex items-center space-x-4">
          {isClient && isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  {formatAddress(account!)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : isClient ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <Wallet size={18} />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="w-32 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
}
