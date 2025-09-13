const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api`;

export const API = {
  login: `${API_BASE}/signin`,
  register: `${API_BASE}/signup`,
  profile: `${API_BASE}/profile`,
  order: `${API_BASE}/orders`,
  wallet: `${API_BASE}/wallets`,
  nft: `${API_BASE}/nfts`,
};

export const WALLET_CONNECT_STATUS = 'connectorIdv2';
