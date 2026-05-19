import api from './axios';

export const fenceCellsApi = {
  getCells: (cameraId) =>
    api.get(`/fence-config/cameras/${cameraId}/cells`),

  saveCells: (cameraId, cells) =>
    api.post(`/fence-config/cameras/${cameraId}/cells`, { cells }),

  deleteCells: (cameraId) =>
    api.delete(`/fence-config/cameras/${cameraId}/cells`),
};