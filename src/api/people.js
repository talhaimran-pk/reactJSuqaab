// src/api/people.js
import api from './axios';
import { API_BASE_URL } from '../config/api';

export const peopleApi = {
  getAll: async (propertyId) => {
    const response = await api.get(`/settings/${propertyId}/people`);
    return response.data;
  },

  // STEP 1: Upload single image file to backend
  // Returns: { url: "/uploads/people/abc-123.jpg" }
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/settings/upload-person-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { url: "/uploads/people/filename.jpg" }
  },

  // STEP 2: Create person with uploaded file URLs (not base64)
  create: async (propertyId, data) => {
    const response = await api.post(`/settings/${propertyId}/people`, data);
    return response.data;
  },

  update: async (personId, data) => {
    const response = await api.put(`/settings/people/${personId}`, data);
    return response.data;
  },

  delete: async (personId) => {
    const response = await api.delete(`/settings/people/${personId}`);
    return response.data;
  },

  getRelationships: async () => {
    const response = await api.get('/settings/relationships');
    return response.data;
  },
};