// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

// Login hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setAuth(data.user, data.token);
        queryClient.setQueryData(['user'], data.user);
      }
    },
  });
};

// Signup hook
export const useSignup = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setAuth(data.user, data.token);
        queryClient.setQueryData(['user'], data.user);
      }
    },
  });
};

// Get current user hook
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await authApi.getMe();
      return data.user;
    },
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    localStorage.removeItem('token');
    logout();
    queryClient.clear();
    window.location.href = '/login';
  };
};