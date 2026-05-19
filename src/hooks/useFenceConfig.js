import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'  // ✅ Use shared axios instance

// ==================== FENCE CONFIG API ====================

const fenceConfigApi = {
  // ✅ Fixed URL to match backend route
  get: (cameraId) => api.get(`/fence-config/cameras/${cameraId}/fence-config`),
  create: (cameraId, points) => api.post(`/fence-config/cameras/${cameraId}/fence-config`, points),
  delete: (cameraId) => api.delete(`/fence-config/cameras/${cameraId}/fence-config`),
}

// ==================== HOOKS ====================

export const useFenceConfig = (cameraId) => {
  return useQuery({
    queryKey: ['fenceConfig', cameraId],
    queryFn: async () => {
      if (!cameraId) return null
      const { data } = await fenceConfigApi.get(cameraId)
      return data
    },
    enabled: !!cameraId,
    retry: false
  })
}

export const useSaveFenceConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ cameraId, points }) => {
      // ✅ points is array of {x, y} objects - matches backend List[Point]
      const { data } = await fenceConfigApi.create(cameraId, points)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fenceConfig', variables.cameraId] })
    }
  })
}

export const useDeleteFenceConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (cameraId) => {
      const { data } = await fenceConfigApi.delete(cameraId)
      return data
    },
    onSuccess: (_, cameraId) => {
      queryClient.invalidateQueries({ queryKey: ['fenceConfig', cameraId] })
    }
  })
}