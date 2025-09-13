import axios from 'axios';
import { API } from '@/config/api';
import { ApiResponse, AuthUser, LoginRequest, RegisterRequest, Wallet, Profile, NFT } from '@/types';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.post(API.login, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.post(API.register, data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get(API.profile);
    return response.data;
  },

  updateProfile: async (data: Partial<Profile>): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.put(API.profile, data);
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  getMyWallet: async (): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.get(`${API.wallet}/my-wallet`);
    return response.data;
  },

  deposit: async (amount: number): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API.wallet}/deposit`, { amount });
    return response.data;
  },

  withdraw: async (amount: number): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API.wallet}/withdraw`, { amount });
    return response.data;
  },

  getTransactions: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`${API.wallet}/transactions`);
    return response.data;
  },
};

// Trading API
export const tradingAPI = {
  placeBet: async (data: {
    symbol: string;
    amount: number;
    direction: 'UP' | 'DOWN';
  }): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API.order}/place-bet`, data);
    return response.data;
  },

  getMyOrders: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`${API.order}/my-orders`);
    return response.data;
  },

  getOrderHistory: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`${API.order}/history`);
    return response.data;
  },
};

// NFT API
export const nftAPI = {
  getMyNFTs: async (): Promise<ApiResponse<NFT[]>> => {
    const response = await apiClient.get(`${API.nft}/my-nfts`);
    return response.data;
  },

  getAllNFTs: async (): Promise<ApiResponse<NFT[]>> => {
    const response = await apiClient.get(`${API.nft}/all`);
    return response.data;
  },

  buyNFT: async (tokenId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API.nft}/buy`, { tokenId });
    return response.data;
  },

  mintNFT: async (data: {
    name: string;
    description: string;
    image: string;
    attributes: any[];
  }): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API.nft}/mint`, data);
    return response.data;
  },
};

export default apiClient;
