// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_URL = `${API_BASE_URL}/api/v1`;
export const STREAM_URL = `${API_BASE_URL}/api/v1/stream`;