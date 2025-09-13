import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingAPI } from '@/services/api';
import { useSocket } from '@/contexts/SocketContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useTrading() {
  const queryClient = useQueryClient();
  const { on, off, emit } = useSocket();
  const [priceData, setPriceData] = useState<any>({});

  // Get trading orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => tradingAPI.getMyOrders(),
    staleTime: 30 * 1000,
  });

  // Get order history
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['order-history'],
    queryFn: () => tradingAPI.getOrderHistory(),
    staleTime: 60 * 1000,
  });

  // Place bet mutation
  const placeBetMutation = useMutation({
    mutationFn: (data: {
      symbol: string;
      amount: number;
      direction: 'UP' | 'DOWN';
    }) => tradingAPI.placeBet(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Bet placed successfully');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
      } else {
        toast.error(response.message || 'Failed to place bet');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to place bet');
    },
  });

  // Socket listeners for real-time price updates
  useEffect(() => {
    const handlePriceUpdate = (data: any) => {
      setPriceData((prev: any) => ({
        ...prev,
        [data.symbol]: data,
      }));
    };

    const handleBetResult = (data: any) => {
      toast.success(`Bet result: ${data.result}`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-history'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    };

    on('price-update', handlePriceUpdate);
    on('future:bet-results', handleBetResult);

    return () => {
      off('price-update', handlePriceUpdate);
      off('future:bet-results', handleBetResult);
    };
  }, [on, off, queryClient]);

  // Subscribe to price feed
  const subscribeToPriceFeed = (symbol: string) => {
    emit('subscribe-price', { symbol });
  };

  // Unsubscribe from price feed
  const unsubscribeFromPriceFeed = (symbol: string) => {
    emit('unsubscribe-price', { symbol });
  };

  return {
    orders: orders?.data || [],
    history: history?.data || [],
    priceData,
    ordersLoading,
    historyLoading,
    placeBet: placeBetMutation.mutate,
    isPlacingBet: placeBetMutation.isPending,
    subscribeToPriceFeed,
    unsubscribeFromPriceFeed,
  };
}
