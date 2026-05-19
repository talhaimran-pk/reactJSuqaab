// src/api/alerts.js
// 
// Fixed to match ACTUAL backend endpoints in dashboard.py
// 
// Backend routes (registered at /api/v1/dashboard):
//   GET    /{property_id}/alerts
//   GET    /alerts/{alert_id}
//   POST   /{property_id}/alerts
//   PUT    /alerts/{alert_id}/read
//   PUT    /alerts/{alert_id}/resolve
//   PUT    /alerts/{alert_id}/false-positive
//   DELETE /alerts/{alert_id}

// import api from './axios';

// export const alertsApi = {
//   // Get all alerts for a property
//   // Backend: GET /api/v1/dashboard/{property_id}/alerts?filter=all
//   getAlerts: async (propertyId, filter = 'all') => {
//     const response = await api.get(
//       `/dashboard/${propertyId}/alerts?filter=${filter}`
//     );
//     return response.data;
//   },

//   // Get single alert detail
//   // Backend: GET /api/v1/dashboard/alerts/{alert_id}
//   getAlert: async (alertId) => {
//     const response = await api.get(`/dashboard/alerts/${alertId}`);
//     return response.data;
//   },

//   // Mark as read
//   // Backend: PUT /api/v1/dashboard/alerts/{alert_id}/read
//   markAsRead: async (alertId) => {
//     const response = await api.put(`/dashboard/alerts/${alertId}/read`);
//     return response.data;
//   },

//   // Resolve alert
//   // Backend: PUT /api/v1/dashboard/alerts/{alert_id}/resolve
//   resolveAlert: async (alertId) => {
//     const response = await api.put(`/dashboard/alerts/${alertId}/resolve`);
//     return response.data;
//   },

//   // Mark as false positive
//   // Backend: PUT /api/v1/dashboard/alerts/{alert_id}/false-positive
//   markFalsePositive: async (alertId) => {
//     const response = await api.put(
//       `/dashboard/alerts/${alertId}/false-positive`
//     );
//     return response.data;
//   },

//   // Delete alert
//   // Backend: DELETE /api/v1/dashboard/alerts/{alert_id}
//   deleteAlert: async (alertId) => {
//     const response = await api.delete(`/dashboard/alerts/${alertId}`);
//     return response.data;
//   },
// };

import api from './axios';

export const alertsApi = {
  getAlerts: async (propertyId, filter = 'all') => {
    const response = await api.get(`/dashboard/${propertyId}/alerts?filter=${filter}`);
    return response.data;
  },

  getAlert: async (alertId) => {
    const response = await api.get(`/dashboard/alerts/${alertId}`);
    return response.data;
  },

  markAsRead: async (alertId) => {
    const response = await api.put(`/dashboard/alerts/${alertId}/read`);
    return response.data;
  },

  resolveAlert: async (alertId) => {
    const response = await api.put(`/dashboard/alerts/${alertId}/resolve`);
    return response.data;
  },

  markFalsePositive: async (alertId) => {
    const response = await api.put(`/dashboard/alerts/${alertId}/false-positive`);
    return response.data;
  },

  deleteAlert: async (alertId) => {
    const response = await api.delete(`/dashboard/alerts/${alertId}`);
    return response.data;
  },
};