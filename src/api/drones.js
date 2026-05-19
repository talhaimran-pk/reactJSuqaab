import api from './axios';

export const dronesApi = {
  getAll: async (propertyId) => {
    const response = await api.get(`/settings/${propertyId}/drones`);
    return response.data;
  },

  create: async (propertyId, data) => {
    const response = await api.post(`/settings/${propertyId}/drones`, data);
    return response.data;
  },

  update: async (droneId, data) => {
    const response = await api.put(`/settings/drones/${droneId}`, data);
    return response.data;
  },

  delete: async (droneId) => {
    const response = await api.delete(`/settings/drones/${droneId}`);
    return response.data;
  },
};