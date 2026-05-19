import api from './axios';

export const camerasApi = {
  getAll: async (propertyId) => {
    const response = await api.get(`/settings/${propertyId}/cameras`);
    return response.data;
  },

  // ✅ Now returns camera_id in response
  create: async (propertyId, data) => {
    const response = await api.post(`/settings/${propertyId}/cameras`, data);
    return response.data;
  },

  update: async (cameraId, data) => {
    const response = await api.put(`/settings/cameras/${cameraId}`, data);
    return response.data;
  },

  delete: async (cameraId) => {
    const response = await api.delete(`/settings/cameras/${cameraId}`);
    return response.data;
  },
};