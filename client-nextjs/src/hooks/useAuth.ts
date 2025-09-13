import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';
import { useState, useEffect } from 'react';
import { useIsClient } from './useIsClient';
import toast from 'react-hot-toast';

export function useAuth() {
  const isClient = useIsClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is logged in on mount
  useEffect(() => {
    if (!isClient) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, [isClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        if (isClient) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Login successful');
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else {
        toast.error(response.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        if (isClient) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Registration successful');
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else {
        toast.error(response.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  // Logout function
  const logout = () => {
    if (isClient) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  // Profile query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    profile: profile?.data,
    profileLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
  };
}
