import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fenceCellsApi } from '../api/fenceCells';

export const useFenceCells = (cameraId) => {
  return useQuery({
    queryKey: ['fenceCells', cameraId],
    queryFn: async () => {
      if (!cameraId) return [];
      const { data } = await fenceCellsApi.getCells(cameraId);
      return data.cells || [];
    },
    enabled: !!cameraId,
    retry: false,
  });
};

export const useSaveFenceCells = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cameraId, cells }) => {
      const { data } = await fenceCellsApi.saveCells(cameraId, cells);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['fenceCells', variables.cameraId],
      });
    },
  });
};

export const useDeleteFenceCells = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cameraId) => {
      const { data } = await fenceCellsApi.deleteCells(cameraId);
      return data;
    },
    onSuccess: (_, cameraId) => {
      queryClient.invalidateQueries({
        queryKey: ['fenceCells', cameraId],
      });
    },
  });
};