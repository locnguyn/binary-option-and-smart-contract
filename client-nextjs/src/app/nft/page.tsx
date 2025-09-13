'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { Image as ImageIcon, Star, ShoppingCart, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface NFTItem {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: {
    trait_type: string;
    value: string;
  }[];
  owned: boolean;
}

export default function NFTPage() {
  const { isConnected, connectWallet } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);

  // Mock NFT data
  const nfts: NFTItem[] = [
    {
      id: '1',
      tokenId: '001',
      name: 'Mario Power-Up #1',
      description: 'A rare power-up NFT that gives you special abilities in the Mario game.',
      image: '/api/placeholder/300/300',
      price: 0.5,
      rarity: 'rare',
      attributes: [
        { trait_type: 'Power', value: 'Fire' },
        { trait_type: 'Level', value: '5' },
        { trait_type: 'Rarity', value: 'Rare' }
      ],
      owned: true
    },
    {
      id: '2',
      tokenId: '002',
      name: 'Mario Power-Up #2',
      description: 'An epic ice power-up that freezes enemies.',
      image: '/api/placeholder/300/300',
      price: 1.2,
      rarity: 'epic',
      attributes: [
        { trait_type: 'Power', value: 'Ice' },
        { trait_type: 'Level', value: '8' },
        { trait_type: 'Rarity', value: 'Epic' }
      ],
      owned: false
    },
    {
      id: '3',
      tokenId: '003',
      name: 'Mario Power-Up #3',
      description: 'A legendary star power-up with maximum abilities.',
      image: '/api/placeholder/300/300',
      price: 2.5,
      rarity: 'legendary',
      attributes: [
        { trait_type: 'Power', value: 'Star' },
        { trait_type: 'Level', value: '10' },
        { trait_type: 'Rarity', value: 'Legendary' }
      ],
      owned: false
    },
    {
      id: '4',
      tokenId: '004',
      name: 'Mario Power-Up #4',
      description: 'A common mushroom power-up for beginners.',
      image: '/api/placeholder/300/300',
      price: 0.1,
      rarity: 'common',
      attributes: [
        { trait_type: 'Power', value: 'Mushroom' },
        { trait_type: 'Level', value: '2' },
        { trait_type: 'Rarity', value: 'Common' }
      ],
      owned: true
    }
  ];

  const categories = ['all', 'owned', 'marketplace'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    if (selectedCategory === 'owned' && !nft.owned) return false;
    if (selectedCategory === 'marketplace' && nft.owned) return false;
    if (selectedRarity !== 'all' && nft.rarity !== selectedRarity) return false;
    return true;
  });

  const handleBuyNFT = async (nft: NFTItem) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Simulate NFT purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully purchased ${nft.name}!`);
    } catch (error) {
      toast.error('Failed to purchase NFT');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">NFT Gallery</h1>
              <p className="text-gray-400">
                Collect and trade Mario game power-up NFTs
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors lg:hidden"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
            {/* Category Filter */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rarity</h3>
              <div className="space-y-2">
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors capitalize ${
                      selectedRarity === rarity
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Collection Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Items</span>
                  <span className="text-white">{nfts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Owned</span>
                  <span className="text-white">{nfts.filter(n => n.owned).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Floor Price</span>
                  <span className="text-white">0.1 ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="lg:col-span-3">
            {!isConnected ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6">
                  Connect your wallet to view and purchase NFTs
                </p>
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNFTs.map((nft) => (
                  <div key={nft.id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                    {/* NFT Image */}
                    <div className="relative aspect-square bg-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={64} className="text-gray-500" />
                      </div>
                      {nft.owned && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          Owned
                        </div>
                      )}
                      <div className={`absolute top-2 left-2 border px-2 py-1 rounded-lg text-xs font-semibold ${getRarityColor(nft.rarity)}`}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>

                    {/* NFT Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{nft.description}</p>
                      
                      {/* Attributes */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {nft.attributes.slice(0, 2).map((attr, index) => (
                          <div key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                            <span className="text-gray-400">{attr.trait_type}:</span>
                            <span className="text-white ml-1">{attr.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="text-lg font-bold text-white">{nft.price} ETH</div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedNFT(nft)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {!nft.owned && (
                            <button
                              onClick={() => handleBuyNFT(nft)}
                              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                            >
                              <ShoppingCart size={16} />
                              <span>Buy</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredNFTs.length === 0 && isConnected && (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
                <p className="text-gray-400">
                  Try adjusting your filters to see more items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NFT Detail Modal */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedNFT.name}</h2>
                  <button
                    onClick={() => setSelectedNFT(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                    <ImageIcon size={96} className="text-gray-500" />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-400">{selectedNFT.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Attributes</h3>
                      <div className="space-y-2">
                        {selectedNFT.attributes.map((attr, index) => (
                          <div key={index} className="flex justify-between bg-gray-700 p-2 rounded">
                            <span className="text-gray-400">{attr.trait_type}</span>
                            <span className="text-white">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Price</h3>
                      <div className="text-2xl font-bold text-white">{selectedNFT.price} ETH</div>
                    </div>

                    {!selectedNFT.owned && (
                      <button
                        onClick={() => handleBuyNFT(selectedNFT)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      >
                        Purchase NFT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
