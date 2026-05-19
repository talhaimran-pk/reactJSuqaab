// // // src/hooks/usePeople.js
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { peopleApi } from '../api/people';

// // // Get all people for a property
// // export const usePeople = (propertyId) => {
// //   return useQuery({
// //     queryKey: ['people', propertyId],
// //     queryFn: async () => {
// //       const data = await peopleApi.getAll(propertyId);
// //       return data.people || [];
// //     },
// //     enabled: !!propertyId,
// //   });
// // };

// // // Create person hook
// // export const useCreatePerson = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ propertyId, data }) => peopleApi.create(propertyId, data),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
// //     },
// //   });
// // };

// // // Update person hook
// // export const useUpdatePerson = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ personId, data, propertyId }) => 
// //       peopleApi.update(personId, data),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
// //     },
// //   });
// // };

// // // Delete person hook
// // export const useDeletePerson = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ personId, propertyId }) => peopleApi.delete(personId),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
// //     },
// //   });
// // };

// // // Get relationships hook
// // export const useRelationships = () => {
// //   return useQuery({
// //     queryKey: ['relationships'],
// //     queryFn: async () => {
// //       const data = await peopleApi.getRelationships();
// //       return data.relationships || [];
// //     },
// //     staleTime: Infinity, // Relationships don't change often
// //   });
// // };

// // src/hooks/usePeople.js
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { peopleApi } from '../api/people';

// // Get all people for a property
// export const usePeople = (propertyId) => {
//   return useQuery({
//     queryKey: ['people', propertyId],
//     queryFn: async () => {
//       const data = await peopleApi.getAll(propertyId);
//       return data.people || [];
//     },
//     enabled: !!propertyId,
//   });
// };

// // Create person hook
// export const useCreatePerson = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ propertyId, data }) => peopleApi.create(propertyId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
//     },
//   });
// };

// // Update person hook
// export const useUpdatePerson = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ personId, data, propertyId }) =>
//       peopleApi.update(personId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
//     },
//   });
// };

// // Delete person hook
// export const useDeletePerson = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ personId, propertyId }) => peopleApi.delete(personId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
//     },
//   });
// };

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { peopleApi } from '../api/people';

// Get all people for a property
export const usePeople = (propertyId) => {
  return useQuery({
    queryKey: ['people', propertyId],
    queryFn: async () => {
      const data = await peopleApi.getAll(propertyId);
      return data.people || [];
    },
    enabled: !!propertyId,
  });
};

// Create person hook
export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }) => peopleApi.create(propertyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
    },
  });
};

// Update person hook
export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, data, propertyId }) =>
      peopleApi.update(personId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
    },
  });
};

// Delete person hook
export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, propertyId }) => peopleApi.delete(personId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['people', variables.propertyId] });
    },
  });
};

// ✅ ADDED BACK: Get roles/relationships hook
export const useRelationships = () => {
  return useQuery({
    queryKey: ['relationships'],
    queryFn: async () => {
      const data = await peopleApi.getRelationships();
      return data.relationships || [];
    },
    staleTime: Infinity, // Roles don't change often
  });
};