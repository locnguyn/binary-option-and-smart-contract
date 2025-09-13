export interface Profile {
  id: string;
  email: string;
}

export interface Wallet {
  id: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  balance: string;
  address?: string;
  totalDeposit: string;
  totalWithdraw: string;
  activeDate: string;
  userId: string;
  transactionIds: any[];
}

export interface NFT {
  attributes: Attribute[];
  description: string;
  image: string;
  name: string;
  id: string;
  tokenId: string;
  attrs: {
    pump: number;
    level: number;
  };
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface FutureOrder {
  id: string;
  userId: string;
  symbol: string;
  amount: number;
  direction: 'UP' | 'DOWN';
  openPrice: number;
  closePrice?: number;
  openTime: string;
  closeTime?: string;
  status: 'PENDING' | 'WIN' | 'LOSE' | 'CANCELLED';
  profit?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
