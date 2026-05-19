// src/hooks/useAlerts.js
//
// Fixed hooks to work with corrected API endpoints
// Removed useAlertStats since backend has no /stats endpoint

// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { alertsApi } from '../api/alerts';

// // Get alerts for a property
// export const useAlerts = (propertyId, filter = 'all') => {
//   return useQuery({
//     queryKey: ['alerts', propertyId, filter],
//     queryFn: async () => {
//       const data = await alertsApi.getAlerts(propertyId, filter);
//       return data.alerts || [];
//     },
//     enabled: !!propertyId,
//     refetchInterval: 5000, // Poll every 5 seconds for new alerts
//   });
// };

// // Get single alert
// export const useAlert = (alertId) => {
//   return useQuery({
//     queryKey: ['alert', alertId],
//     queryFn: async () => {
//       const data = await alertsApi.getAlert(alertId);
//       return data.alert;
//     },
//     enabled: !!alertId,
//   });
// };

// // Mark as read
// export const useMarkAlertRead = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: alertsApi.markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//       queryClient.invalidateQueries({ queryKey: ['alert'] });
//       queryClient.invalidateQueries({ queryKey: ['property'] });
//     },
//   });
// };

// // Resolve alert
// export const useResolveAlert = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: alertsApi.resolveAlert,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//       queryClient.invalidateQueries({ queryKey: ['property'] });
//     },
//   });
// };

// // Mark false positive
// export const useMarkFalsePositive = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: alertsApi.markFalsePositive,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//       queryClient.invalidateQueries({ queryKey: ['property'] });
//     },
//   });
// };

// // Delete alert
// export const useDeleteAlert = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: alertsApi.deleteAlert,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//       queryClient.invalidateQueries({ queryKey: ['property'] });
//     },
//   });
// };

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api/alerts';

export const useAlerts = (propertyId, filter = 'all') => {
  return useQuery({
    queryKey: ['alerts', propertyId, filter],
    queryFn: async () => {
      const data = await alertsApi.getAlerts(propertyId, filter);
      return data.alerts || [];
    },
    enabled: !!propertyId,
    // refetchInterval: 5000,
    staleTime: 30_000,
  });
};

export const useAlert = (alertId) => {
  return useQuery({
    queryKey: ['alert', alertId],
    queryFn: async () => {
      const data = await alertsApi.getAlert(alertId);
      return data.alert;
    },
    enabled: !!alertId,
  });
};

export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert'] });
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.resolveAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useMarkFalsePositive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.markFalsePositive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};