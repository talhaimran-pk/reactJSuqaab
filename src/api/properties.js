import api from './axios';

export const propertiesApi = {
  getAll: async () => {
    const response = await api.get('/properties');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
},
};


