// // // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // // import { camerasApi } from '../api/cameras';

// // // // export const useCameras = (propertyId) => {
// // // //   return useQuery({
// // // //     queryKey: ['cameras', propertyId],
// // // //     queryFn: async () => {
// // // //       const data = await camerasApi.getAll(propertyId);
// // // //       // Ensure is_online is boolean
// // // //       return (data.cameras || []).map(cam => ({
// // // //         ...cam,
// // // //         is_online: Boolean(cam.is_online || cam.rtsp_url?.startsWith('http') || cam.rtsp_url?.startsWith('rtsp'))
// // // //       }));
// // // //     },
// // // //     enabled: !!propertyId,
// // // //     refetchInterval: 5000, // Refetch every 5 seconds
// // // //   });
// // // // };

// // // // export const useCreateCamera = () => {
// // // //   const queryClient = useQueryClient()
  
// // // //   return useMutation({
// // // //     mutationFn: async ({ propertyId, data }) => {
// // // //       const response = await camerasApi.create(propertyId, data)
// // // //       return response  // ✅ Make sure full response is returned
// // // //     },
// // // //     onSuccess: (_, variables) => {
// // // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] })
// // // //     }
// // // //   })
// // // // }

// // // // export const useUpdateCamera = () => {
// // // //   const queryClient = useQueryClient();

// // // //   return useMutation({
// // // //     mutationFn: ({ cameraId, data, propertyId }) => camerasApi.update(cameraId, data),
// // // //     onSuccess: (_, variables) => {
// // // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] });
// // // //     },
// // // //   });
// // // // };

// // // // export const useDeleteCamera = () => {
// // // //   const queryClient = useQueryClient();

// // // //   return useMutation({
// // // //     mutationFn: ({ cameraId, propertyId }) => camerasApi.delete(cameraId),
// // // //     onSuccess: (_, variables) => {
// // // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] });
// // // //     },
// // // //   });
// // // // };


// // // import { useState, useEffect, useRef } from 'react';
// // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { camerasApi } from '../api/cameras';

// // // // Checks if an HTTP stream URL is reachable
// // // // Uses fetch with no-cors so CORS headers don't matter
// // // // If server responds (any response) = online, if network error/timeout = offline
// // // const checkStreamOnline = async (url) => {
// // //   try {
// // //     const controller = new AbortController();
// // //     const timer = setTimeout(() => controller.abort(), 5000); // 5s timeout

// // //     await fetch(url, {
// // //       method: 'GET',
// // //       signal: controller.signal,
// // //       mode: 'no-cors', // opaque response is fine — we just need to know server is up
// // //       cache: 'no-store',
// // //     });

// // //     clearTimeout(timer);
// // //     return true; // server responded = online
// // //   } catch {
// // //     return false; // timeout or network error = offline
// // //   }
// // // };

// // // // Checks all cameras in parallel, returns { [camera_id]: boolean }
// // // const checkAllStreams = async (cameras) => {
// // //   const results = await Promise.all(
// // //     cameras.map(async (cam) => {
// // //       const isOnline = await checkStreamOnline(cam.rtsp_url);
// // //       return [String(cam.id), isOnline];
// // //     })
// // //   );
// // //   return Object.fromEntries(results);
// // // };

// // // export const useCameras = (propertyId) => {
// // //   // { [camera_id]: true | false | null }
// // //   // null = still checking (shows "checking" badge instead of wrong offline)
// // //   const [streamStatus, setStreamStatus] = useState({});
// // //   const intervalRef = useRef(null);

// // //   // Fetch camera list — no fake is_online logic here
// // //   const query = useQuery({
// // //     queryKey: ['cameras', propertyId],
// // //     queryFn: async () => {
// // //       const data = await camerasApi.getAll(propertyId);
// // //       return data.cameras || [];
// // //     },
// // //     enabled: !!propertyId,
// // //   });

// // //   // Whenever camera list loads/changes, check streams immediately
// // //   // then re-check every 15 seconds
// // //   useEffect(() => {
// // //     const cameras = query.data;
// // //     if (!cameras || cameras.length === 0) return;

// // //     // Reset to null (checking) for any new cameras
// // //     setStreamStatus((prev) => {
// // //       const next = { ...prev };
// // //       cameras.forEach((cam) => {
// // //         if (!(String(cam.id) in next)) {
// // //           next[String(cam.id)] = null; // null = checking
// // //         }
// // //       });
// // //       return next;
// // //     });

// // //     const runCheck = async () => {
// // //       const status = await checkAllStreams(cameras);
// // //       setStreamStatus(status);
// // //     };

// // //     // Check immediately
// // //     runCheck();

// // //     // Then every 15s
// // //     clearInterval(intervalRef.current);
// // //     intervalRef.current = setInterval(runCheck, 15000);

// // //     return () => clearInterval(intervalRef.current);
// // //   }, [query.data]);

// // //   // Merge stream status into camera objects
// // //   const data = (query.data || []).map((cam) => ({
// // //     ...cam,
// // //     is_online: streamStatus[String(cam.id)] ?? null, // null = checking
// // //   }));

// // //   return {
// // //     ...query,
// // //     data,
// // //   };
// // // };

// // // export const useCreateCamera = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: async ({ propertyId, data }) => {
// // //       const response = await camerasApi.create(propertyId, data);
// // //       return response;
// // //     },
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // // export const useUpdateCamera = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: ({ cameraId, data }) => camerasApi.update(cameraId, data),
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // // export const useDeleteCamera = () => {
// // //   const queryClient = useQueryClient();

// // //   return useMutation({
// // //     mutationFn: ({ cameraId }) => camerasApi.delete(cameraId),
// // //     onSuccess: (_, variables) => {
// // //       queryClient.invalidateQueries({ queryKey: ['cameras', variables.propertyId] });
// // //     },
// // //   });
// // // };

// // import { useState, useEffect, useRef } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { camerasApi } from '../api/cameras';

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

// // const checkAllStreams = async (cameras) => {
// //   const results = await Promise.all(
// //     cameras.map(async (cam) => {
// //       const isOnline = await checkStreamOnline(cam.rtsp_url);
// //       return [String(cam.id), isOnline];
// //     })
// //   );
// //   return Object.fromEntries(results);
// // };

// // export const useCameras = (propertyId) => {
// //   const [streamStatus, setStreamStatus] = useState({});
// //   const intervalRef = useRef(null);

// //   const query = useQuery({
// //     queryKey: ['cameras', propertyId],
// //     queryFn: async () => {
// //       const data = await camerasApi.getAll(propertyId);
// //       return data.cameras || [];
// //     },
// //     enabled: !!propertyId,
// //   });

// //   useEffect(() => {
// //     const cameras = query.data;
// //     if (!cameras || cameras.length === 0) return;

// //     setStreamStatus((prev) => {
// //       const next = { ...prev };
// //       cameras.forEach((cam) => {
// //         if (!(String(cam.id) in next)) next[String(cam.id)] = null;
// //       });
// //       return next;
// //     });

// //     const runCheck = async () => {
// //       const status = await checkAllStreams(cameras);
// //       setStreamStatus(status);
// //     };

// //     runCheck();

// //     clearInterval(intervalRef.current);
// //     intervalRef.current = setInterval(runCheck, 15000);

// //     return () => clearInterval(intervalRef.current);
// //   }, [query.data]);

// //   const data = (query.data || []).map((cam) => ({
// //     ...cam,
// //     is_online: streamStatus[String(cam.id)] ?? null,
// //   }));

// //   return { ...query, data };
// // };

// // export const useCreateCamera = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async ({ propertyId, data }) => {
// //       const response = await camerasApi.create(propertyId, data);
// //       return response;
// //     },
// //     onSuccess: async (_, variables) => {
// //       await queryClient.invalidateQueries({
// //         queryKey: ['cameras', variables.propertyId],
// //       });
// //     },
// //   });
// // };

// // export const useUpdateCamera = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ cameraId, data }) => camerasApi.update(cameraId, data),
// //     onSuccess: async (_, variables) => {
// //       await queryClient.invalidateQueries({
// //         queryKey: ['cameras', variables.propertyId],
// //       });
// //     },
// //   });
// // };

// // export const useDeleteCamera = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: ({ cameraId }) => camerasApi.delete(cameraId),
// //     onSuccess: async (_, variables) => {
// //       await queryClient.invalidateQueries({
// //         queryKey: ['cameras', variables.propertyId],
// //       });
// //     },
// //   });
// // };

// import { useState, useEffect, useRef } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { camerasApi } from '../api/cameras';

// const checkStreamOnline = async (url) => {
//   if (!url || !url.startsWith('http')) return false;

//   try {
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), 5000);

//     const res = await fetch(url, {
//       method: 'HEAD',
//       signal: controller.signal,
//       cache: 'no-store',
//     });

//     clearTimeout(timer);
//     return res.status < 600;
//   } catch {
//     return false;
//   }
// };

// const checkAllStreams = async (cameras) => {
//   const results = await Promise.all(
//     cameras.map(async (cam) => {
//       const isOnline = await checkStreamOnline(cam.rtsp_url);
//       return [String(cam.id), isOnline];
//     })
//   );
//   return Object.fromEntries(results);
// };

// export const useCameras = (propertyId) => {
//   const [streamStatus, setStreamStatus] = useState({});
//   const intervalRef = useRef(null);

//   const query = useQuery({
//     queryKey: ['cameras', propertyId],
//     queryFn: async () => {
//       const data = await camerasApi.getAll(propertyId);
//       return data.cameras || [];
//     },
//     enabled: !!propertyId,
//   });

//   useEffect(() => {
//     const cameras = query.data;
//     if (!cameras || cameras.length === 0) return;

//     setStreamStatus((prev) => {
//       const next = { ...prev };
//       cameras.forEach((cam) => {
//         if (!(String(cam.id) in next)) next[String(cam.id)] = null;
//       });
//       return next;
//     });

//     const runCheck = async () => {
//       const status = await checkAllStreams(cameras);
//       setStreamStatus(status);
//     };

//     runCheck();

//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(runCheck, 15000);

//     return () => clearInterval(intervalRef.current);
//   }, [query.data]);

//   const data = (query.data || []).map((cam) => ({
//     ...cam,
//     is_online: streamStatus[String(cam.id)] ?? null,
//   }));

//   return { ...query, data };
// };

// export const useCreateCamera = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ propertyId, data }) => {
//       const response = await camerasApi.create(propertyId, data);
//       return response;
//     },
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['cameras', variables.propertyId],
//       });
//     },
//   });
// };

// export const useUpdateCamera = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cameraId, data }) => camerasApi.update(cameraId, data),
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['cameras', variables.propertyId],
//       });
//     },
//   });
// };

// export const useDeleteCamera = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cameraId }) => camerasApi.delete(cameraId),
//     onSuccess: async (_, variables) => {
//       await queryClient.invalidateQueries({
//         queryKey: ['cameras', variables.propertyId],
//       });
//     },
//   });
// };

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { camerasApi } from '../api/cameras';

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

const checkAllStreams = async (cameras) => {
  const results = await Promise.all(
    cameras.map(async (cam) => {
      const isOnline = await checkStreamOnline(cam.rtsp_url);
      return [String(cam.id), isOnline];
    })
  );
  return Object.fromEntries(results);
};

export const useCameras = (propertyId) => {
  const [streamStatus, setStreamStatus] = useState({});
  const intervalRef = useRef(null);

  const query = useQuery({
    queryKey: ['cameras', propertyId],
    queryFn: async () => {
      const data = await camerasApi.getAll(propertyId);
      return data.cameras || [];
    },
    enabled: !!propertyId,
  });

  useEffect(() => {
    const cameras = query.data;
    if (!cameras || cameras.length === 0) return;

    setStreamStatus((prev) => {
      const next = { ...prev };
      cameras.forEach((cam) => {
        if (!(String(cam.id) in next)) next[String(cam.id)] = null;
      });
      return next;
    });

    const runCheck = async () => {
      const status = await checkAllStreams(cameras);
      setStreamStatus(status);
    };

    runCheck();

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(runCheck, 15000);

    return () => clearInterval(intervalRef.current);
  }, [query.data]);

  const data = (query.data || []).map((cam) => ({
    ...cam,
    is_online: streamStatus[String(cam.id)] ?? null,
  }));

  return { ...query, data };
};

export const useCreateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, data }) => {
      const response = await camerasApi.create(propertyId, data);
      return response;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['cameras', variables.propertyId],
      });
    },
  });
};

export const useUpdateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✅ FIX: destructure propertyId so onSuccess cache invalidation works
    mutationFn: ({ cameraId, propertyId, data }) => camerasApi.update(cameraId, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['cameras', variables.propertyId],
      });
    },
  });
};

export const useDeleteCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId }) => camerasApi.delete(cameraId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['cameras', variables.propertyId],
      });
    },
  });
};