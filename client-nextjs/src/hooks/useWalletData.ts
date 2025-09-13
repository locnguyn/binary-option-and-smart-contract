import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletAPI } from '@/services/api';
import toast from 'react-hot-toast';

export function useWalletData() {
  const queryClient = useQueryClient();

  // Get wallet data
  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletAPI.getMyWallet(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Get transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletAPI.getTransactions(),
    staleTime: 30 * 1000,
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: (amount: number) => walletAPI.deposit(amount),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Deposit successful');
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      } else {
        toast.error(response.message || 'Deposit failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Deposit failed');
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: (amount: number) => walletAPI.withdraw(amount),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Withdrawal initiated');
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      } else {
        toast.error(response.message || 'Withdrawal failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    },
  });

  // Refresh wallet data
  const refreshWallet = () => {
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  return {
    wallet: wallet?.data,
    transactions: transactions?.data || [],
    isLoading,
    transactionsLoading,
    error,
    deposit: depositMutation.mutate,
    withdraw: withdrawMutation.mutate,
    isDepositing: depositMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    refreshWallet,
  };
}
