// // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { dronesApi } from '../api/drones';

// // // export const useDrones = (propertyId) => {
// // //   return useQuery({
// // //     queryKey: ['drones', propertyId],
// // //     queryFn: async () => {
// // //       const data = await dronesApi.getAll(propertyId);
// // //       return data.drones || [];
// // //     },
// // //     enabled: !!propertyId,
// // //   });
// // // };

// // // export const useCreateDrone = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: ({ propertyId, data }) => dronesApi.create(propertyId, data),
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// // //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // // export const useUpdateDrone = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: ({ droneId, data, propertyId }) => dronesApi.update(droneId, data),
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// // //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // // export const useDeleteDrone = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: ({ droneId, propertyId }) => dronesApi.delete(droneId),
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// // //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // import { useState, useEffect, useRef } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { dronesApi } from '../api/drones';

// // const checkStreamOnline = async (url) => {
// //   try {
// //     const controller = new AbortController();
// //     const timer = setTimeout(() => controller.abort(), 5000);

// //     await fetch(url, {
// //       method: 'GET',
// //       signal: controller.signal,
// //       mode: 'no-cors',
// //       cache: 'no-store',
// //     });

// //     clearTimeout(timer);
// //     return true;
// //   } catch {
// //     return false;
// //   }
// // };

// // const checkAllStreams = async (items) => {
// //   const results = await Promise.all(
// //     items.map(async (item) => {
// //       const isOnline = await checkStreamOnline(item.connection_string);
// //       return [String(item.id), isOnline];
// //     })
// //   );
// //   return Object.fromEntries(results);
// // };

// // export const useDrones = (propertyId) => {
// //   const [streamStatus, setStreamStatus] = useState({});
// //   const intervalRef = useRef(null);

// //   const query = useQuery({
// //     queryKey: ['drones', propertyId],
// //     queryFn: async () => {
// //       const data = await dronesApi.getAll(propertyId);
// //       return data.drones || [];
// //     },
// //     enabled: !!propertyId,
// //   });

// //   useEffect(() => {
// //     const drones = query.data;
// //     if (!drones || drones.length === 0) return;

// //     // Mark new drones as null (checking) 
// //     setStreamStatus((prev) => {
// //       const next = { ...prev };
// //       drones.forEach((d) => {
// //         if (!(String(d.id) in next)) next[String(d.id)] = null;
// //       });
// //       return next;
// //     });

// //     const runCheck = async () => {
// //       const status = await checkAllStreams(drones);
// //       setStreamStatus(status);
// //     };

// //     runCheck();

// //     clearInterval(intervalRef.current);
// //     intervalRef.current = setInterval(runCheck, 15000);

// //     return () => clearInterval(intervalRef.current);
// //   }, [query.data]);

// //   const data = (query.data || []).map((drone) => ({
// //     ...drone,
// //     is_online: streamStatus[String(drone.id)] ?? null, // null = checking
// //   }));

// //   return { ...query, data };
// // };

// // export const useCreateDrone = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ propertyId, data }) => dronesApi.create(propertyId, data),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// //     },
// //   });
// // };

// // export const useUpdateDrone = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ droneId, data, propertyId }) => dronesApi.update(droneId, data),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// //     },
// //   });
// // };

// // export const useDeleteDrone = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ droneId, propertyId }) => dronesApi.delete(droneId),
// //     onSuccess: (_, variables) => {
// //       queryClient.invalidateQueries({ queryKey: ['drones', variables.propertyId] });
// //       queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] });
// //     },
// //   });
// // };

// import { useState, useEffect, useRef } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { dronesApi } from '../api/drones';

// const checkStreamOnline = async (url) => {
//   try {
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), 5000);

//     await fetch(url, {
//       method: 'GET',
//       signal: controller.signal,
//       mode: 'no-cors',
//       cache: 'no-store',
//     });

//     clearTimeout(timer);
//     return true;
//   } catch {
//     return false;
//   }
// };

// const checkAllStreams = async (items) => {
//   const results = await Promise.all(
//     items.map(async (item) => {
//       const isOnline = await checkStreamOnline(item.connection_string);
//       return [String(item.id), isOnline];
//     })
//   );
//   return Object.fromEntries(results);
// };

// export const useDrones = (propertyId) => {
//   const [streamStatus, setStreamStatus] = useState({});
//   const intervalRef = useRef(null);

//   const query = useQuery({
//     queryKey: ['drones', propertyId],
//     queryFn: async () => {
//       const data = await dronesApi.getAll(propertyId);
//       return data.drones || [];
//     },
//     enabled: !!propertyId,
//   });

//   useEffect(() => {
//     const drones = query.data;
//     if (!drones || drones.length === 0) return;

//     setStreamStatus((prev) => {
//       const next = { ...prev };
//       drones.forEach((d) => {
//         if (!(String(d.id) in next)) next[String(d.id)] = null;
//       });
//       return next;
//     });

//     const runCheck = async () => {
//       const status = await checkAllStreams(drones);
//       setStreamStatus(status);
//     };

//     runCheck();

//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(runCheck, 15000);

//     return () => clearInterval(intervalRef.current);
//   }, [query.data]);

//   const data = (query.data || []).map((drone) => ({
//     ...drone,
//     is_online: streamStatus[String(drone.id)] ?? null,
//   }));

//   return { ...query, data };
// };

// export const useCreateDrone = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ propertyId, data }) => dronesApi.create(propertyId, data),
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['drones', variables.propertyId],
//       });
//       await queryClient.invalidateQueries({
//         queryKey: ['property', variables.propertyId],
//       });
//     },
//   });
// };

// export const useUpdateDrone = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ droneId, data }) => dronesApi.update(droneId, data),
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['drones', variables.propertyId],
//       });
//       await queryClient.invalidateQueries({
//         queryKey: ['property', variables.propertyId],
//       });
//     },
//   });
// };

// export const useDeleteDrone = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ droneId }) => dronesApi.delete(droneId),
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['drones', variables.propertyId],
//       });
//       await queryClient.invalidateQueries({
//         queryKey: ['property', variables.propertyId],
//       });
//     },
//   });
// };

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dronesApi } from '../api/drones';

const checkStreamOnline = async (url) => {
  if (!url || !url.startsWith('http')) return false;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timer);
    return res.status < 600;
  } catch {
    return false;
  }
};

const checkAllStreams = async (items) => {
  const results = await Promise.all(
    items.map(async (item) => {
      const isOnline = await checkStreamOnline(item.connection_string);
      return [String(item.id), isOnline];
    })
  );
  return Object.fromEntries(results);
};

export const useDrones = (propertyId) => {
  const [streamStatus, setStreamStatus] = useState({});
  const intervalRef = useRef(null);

  const query = useQuery({
    queryKey: ['drones', propertyId],
    queryFn: async () => {
      const data = await dronesApi.getAll(propertyId);
      return data.drones || [];
    },
    enabled: !!propertyId,
  });

  useEffect(() => {
    const drones = query.data;
    if (!drones || drones.length === 0) return;

    setStreamStatus((prev) => {
      const next = { ...prev };
      drones.forEach((d) => {
        if (!(String(d.id) in next)) next[String(d.id)] = null;
      });
      return next;
    });

    const runCheck = async () => {
      const status = await checkAllStreams(drones);
      setStreamStatus(status);
    };

    runCheck();

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(runCheck, 15000);

    return () => clearInterval(intervalRef.current);
  }, [query.data]);

  const data = (query.data || []).map((drone) => ({
    ...drone,
    is_online: streamStatus[String(drone.id)] ?? null,
  }));

  return { ...query, data };
};

export const useCreateDrone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, data }) => dronesApi.create(propertyId, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['drones', variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['property', variables.propertyId],
      });
    },
  });
};

export const useUpdateDrone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ droneId, data }) => dronesApi.update(droneId, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['drones', variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['property', variables.propertyId],
      });
    },
  });
};

export const useDeleteDrone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ droneId }) => dronesApi.delete(droneId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['drones', variables.propertyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['property', variables.propertyId],
      });
    },
  });
};