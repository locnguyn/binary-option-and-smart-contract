export const CONTRACT_ADDRESSES = {
  HHD_TOKEN: process.env.NEXT_PUBLIC_HHD_TOKEN || '0xEDb8F07cf8Bba07DF030B1d6f085FbC1a2755d76',
  HHD_FAUCET: process.env.NEXT_PUBLIC_HHD_FAUCET || '0x75d9748772c8FE98B337FAC0a7f2205439A16a59',
  HHD_PAYMENT_PROCESSOR: process.env.NEXT_PUBLIC_HHD_PAYMENT_PROCESSOR || '0xA4830c3013d2DB45996958F89F5ee7eC71682718',
  MARIO_NFT: process.env.NEXT_PUBLIC_MARIO_NFT || '0x2f8a9dB760e9E141b38872fD8359e70b0b5C4B14',
};

export const NETWORK_CONFIG = {
  chainId: '0x1', // Mainnet
  chainName: 'Ethereum Mainnet',
  rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_KEY'],
  blockExplorerUrls: ['https://etherscan.io'],
};
