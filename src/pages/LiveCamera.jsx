// // // // src/pages/LiveCamera.jsx
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import {
// // //   ArrowLeft, Radio, Camera, Circle, Square,
// // //   AlertCircle, Settings, RefreshCw, WifiOff,
// // // } from 'lucide-react';
// // // import { useState } from 'react';
// // // import { useCameras } from '../hooks/useCameras';
// // // import { theme } from '../theme';

// // // const LiveCamera = () => {
// // //   const { id, cameraId } = useParams();
// // //   const navigate = useNavigate();
// // //   const { data: cameras = [] } = useCameras(id);

// // //   const [isRecording, setIsRecording] = useState(false);
// // //   const [isLoading,   setIsLoading]   = useState(true);
// // //   const [error,       setError]       = useState(null);
// // //   const [refreshKey,  setRefreshKey]  = useState(0);

// // //   const camera = cameras.find(c => String(c.id) === String(cameraId));

// // //   const getStreamInfo = () => {
// // //     if (!camera) return { type: 'unknown', url: null };
// // //     const url = camera.stream_url || camera.rtsp_url || '';
// // //     if (url.toLowerCase().startsWith('http'))  return { type: 'http',  url };
// // //     if (url.toLowerCase().startsWith('rtsp'))  return { type: 'rtsp',  url: null };
// // //     return { type: 'unknown', url: null };
// // //   };
// // //   const streamInfo = getStreamInfo();

// // //   const handleRefresh = () => {
// // //     setIsLoading(true);
// // //     setError(null);
// // //     setRefreshKey(prev => prev + 1);
// // //   };

// // //   // Not found
// // //   if (!camera && cameras.length > 0) {
// // //     return (
// // //       <div className={theme.page.dark + ' flex items-center justify-center'}>
// // //         <div className="text-center">
// // //           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
// // //           <p className={theme.type.whiteMuted}>Camera not found</p>
// // //           <button onClick={() => navigate(-1)} className="mt-4 text-[#c5a880] text-sm font-bold">
// // //             Go Back
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Loading cameras list
// // //   if (!camera) {
// // //     return (
// // //       <div className={theme.page.dark + ' flex items-center justify-center'}>
// // //         <div className={theme.ui.spinner} />
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className={theme.page.dark}>

// // //       {/* ── Header ── */}
// // //       <div className="flex items-center p-4 border-b border-white/10">
// // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // //           <ArrowLeft className="h-6 w-6" />
// // //         </button>
// // //         <div className="ml-2 flex-1 min-w-0">
// // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg') + ' truncate'}>
// // //             {camera.name}
// // //           </h2>
// // //           <p className={`${theme.type.whiteMuted} truncate`}>{camera.rtsp_url}</p>
// // //         </div>
// // //         <div className="flex items-center gap-2">
// // //           <button onClick={handleRefresh} className={theme.button.iconDark}>
// // //             <RefreshCw className="h-5 w-5" />
// // //           </button>
// // //           {streamInfo.type === 'http' ? (
// // //             <span className={theme.badge.live}>
// // //               <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// // //               LIVE
// // //             </span>
// // //           ) : (
// // //             <span className="flex items-center gap-1 text-xs text-amber-400
// // //                              bg-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
// // //               <AlertCircle className="w-3 h-3" />
// // //               RTSP
// // //             </span>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ── Video ── */}
// // //       <div className={theme.media.videoWrap}>
// // //         {streamInfo.type === 'http' && streamInfo.url ? (
// // //           <>
// // //             {isLoading && (
// // //               <div className="absolute inset-0 flex items-center justify-center z-10">
// // //                 <div className={theme.ui.spinner} />
// // //               </div>
// // //             )}
// // //             {error ? (
// // //               <div className={theme.media.overlay}>
// // //                 <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
// // //                 <p className={theme.type.whiteMuted}>{error}</p>
// // //                 <button onClick={handleRefresh}
// // //                         className="mt-4 text-[#c5a880] text-sm font-bold">
// // //                   Retry Connection
// // //                 </button>
// // //               </div>
// // //             ) : (
// // //               <img
// // //                 key={refreshKey}
// // //                 src={streamInfo.url}
// // //                 alt="Live stream"
// // //                 className="w-full h-full object-contain"
// // //                 onLoad={() => { setIsLoading(false); setError(null); }}
// // //                 onError={() => { setIsLoading(false); setError('Cannot connect to camera stream'); }}
// // //                 style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
// // //               />
// // //             )}
// // //             {isRecording && !error && (
// // //               <div className="absolute top-4 right-4 bg-red-500 text-white
// // //                               px-3 py-1 rounded-full flex items-center gap-2
// // //                               animate-pulse z-20 text-xs font-bold">
// // //                 <div className="w-2 h-2 bg-white rounded-full" />
// // //                 REC
// // //               </div>
// // //             )}
// // //             {!error && !isLoading && (
// // //               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur
// // //                               px-3 py-2 rounded-xl text-xs text-white z-20">
// // //                 <p>Cell: ({camera.grid_cell?.row}, {camera.grid_cell?.col})</p>
// // //                 <p>{new Date().toLocaleTimeString()}</p>
// // //               </div>
// // //             )}
// // //           </>
// // //         ) : streamInfo.type === 'rtsp' ? (
// // //           <div className={theme.media.overlay}>
// // //             <AlertCircle className="h-16 w-16 mb-4 text-amber-500" />
// // //             <p className="text-lg font-black text-white mb-2">RTSP Stream</p>
// // //             <p className={`${theme.type.whiteMuted} text-center px-6 mb-4`}>
// // //               Browser cannot play RTSP directly. Backend proxy coming soon.
// // //             </p>
// // //             <div className="bg-white/10 rounded-full px-4 py-2 font-mono text-xs text-gray-300">
// // //               {camera.rtsp_url}
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <div className={theme.media.overlay}>
// // //             <WifiOff className="h-16 w-16 mb-4 text-red-500" />
// // //             <p className={theme.type.whiteMuted}>No stream URL configured</p>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ── Controls ── */}
// // //       {/* <div className="p-4 space-y-3 bg-[#faf9f6] rounded-t-[2.5rem] -mt-6 relative z-10">

// // //         <button
// // //           onClick={() => navigate(`/property/${id}/drone-control`)}
// // //           disabled={streamInfo.type !== 'http'}
// // //           className={`${theme.button.dark} ${theme.button.full}`}
// // //         >
// // //           <Radio className="w-5 h-5" />
// // //           Dispatch Drone to This Location
// // //         </button>

// // //         <div className="grid grid-cols-3 gap-3">
// // //           <button
// // //             onClick={() => setIsRecording(!isRecording)}
// // //             disabled={streamInfo.type !== 'http'}
// // //             className={isRecording ? theme.button.danger : theme.button.secondary}
// // //           >
// // //             {isRecording
// // //               ? <><Square className="w-4 h-4 fill-current" /> Stop</>
// // //               : <><Circle className="w-4 h-4" /> Record</>}
// // //           </button>

// // //           <button
// // //             onClick={() => {
// // //               if (streamInfo.url) {
// // //                 window.open(streamInfo.url.replace('/video', '/shot.jpg'), '_blank');
// // //               }
// // //             }}
// // //             disabled={streamInfo.type !== 'http'}
// // //             className={theme.button.secondary}
// // //           >
// // //             <Camera className="w-4 h-4" />
// // //             Snapshot
// // //           </button>

// // //           <button
// // //             onClick={() => navigate(`/property/${id}/camera/${cameraId}/edit`)}
// // //             className={theme.button.secondary}
// // //           >
// // //             <Settings className="w-4 h-4" />
// // //             Settings
// // //           </button>
// // //         </div>
// // //       </div>  */}

// // //       {/* ── Camera info ── */}
// // //       <div className="px-4 pb-8 bg-[#faf9f6]">
// // //         <div className={theme.card.base}>
// // //           <h3 className={`${theme.type.h4} mb-4`}>Camera Details</h3>
// // //           {[
// // //             { label: 'Name',          value: camera.name },
// // //             { label: 'Stream URL',    value: camera.rtsp_url,
// // //               mono: true },
// // //             { label: 'Stream Type',   value:
// // //                 streamInfo.type === 'http' ? 'HTTP (IP Webcam)'
// // //               : streamInfo.type === 'rtsp' ? 'RTSP (CCTV)'
// // //               : 'Unknown',
// // //               colored: streamInfo.type === 'http' ? 'text-emerald-500' : 'text-amber-500',
// // //             },
// // //             { label: 'Grid Position', value:
// // //                 `Row ${camera.grid_cell?.row}, Col ${camera.grid_cell?.col}` },
// // //           ].map(({ label, value, mono, colored }) => (
// // //             <div key={label}
// // //                  className="flex justify-between items-center py-2.5
// // //                             border-b border-[#e6e3db] last:border-0">
// // //               <span className={theme.type.labelSm}>{label}</span>
// // //               <span className={`font-sans text-sm font-semibold
// // //                                ${colored || 'text-[#1c1c1c]'}
// // //                                ${mono ? 'font-mono text-xs truncate max-w-[180px]' : ''}`}>
// // //                 {value}
// // //               </span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //     </div>
// // //   );
// // // };

// // // export default LiveCamera;

// // // src/pages/LiveCamera.jsx
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { ArrowLeft, Radio, Camera, Circle, Square, AlertCircle, Settings, RefreshCw, WifiOff } from 'lucide-react';
// // import { useState } from 'react';
// // import { useCameras } from '../hooks/useCameras';
// // import { theme } from '../theme';

// // const LiveCamera = () => {
// //   const { id, cameraId } = useParams();
// //   const navigate = useNavigate();
// //   const { data: cameras = [] } = useCameras(id);

// //   const [isRecording, setIsRecording] = useState(false);
// //   const [isLoading,   setIsLoading]   = useState(true);
// //   const [error,       setError]       = useState(null);
// //   const [refreshKey,  setRefreshKey]  = useState(0);

// //   const camera = cameras.find(c => String(c.id) === String(cameraId));

// //   const getStreamInfo = () => {
// //     if (!camera) return { type: 'unknown', url: null };
// //     const url = camera.stream_url || camera.rtsp_url || '';
// //     if (url.toLowerCase().startsWith('http')) return { type: 'http', url };
// //     if (url.toLowerCase().startsWith('rtsp')) return { type: 'rtsp', url: null };
// //     return { type: 'unknown', url: null };
// //   };
// //   const streamInfo = getStreamInfo();

// //   const handleRefresh = () => { setIsLoading(true); setError(null); setRefreshKey(k => k + 1); };

// //   if (!camera && cameras.length > 0) return (
// //     <div className="h-screen bg-[#0f172a] flex items-center justify-center">
// //       <div className="text-center">
// //         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
// //         <p className="text-gray-400">Camera not found</p>
// //         <button onClick={() => navigate(-1)} className="mt-4 text-[#c5a880] text-sm font-bold">Go Back</button>
// //       </div>
// //     </div>
// //   );

// //   if (!camera) return (
// //     <div className="h-screen bg-[#0f172a] flex items-center justify-center">
// //       <div className={theme.ui.spinner} />
// //     </div>
// //   );

// //   return (
// //     // Full viewport, flex column, NO overflow/scroll
// //     <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden">

// //       {/* ── Header — fixed height ── */}
// //       <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/10">
// //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// //           <ArrowLeft className="h-5 w-5" />
// //         </button>
// //         <div className="flex-1 min-w-0">
// //           <p className="text-white font-bold text-sm truncate">{camera.name}</p>
// //           <p className="text-gray-500 text-xs truncate">{camera.rtsp_url}</p>
// //         </div>
// //         <button onClick={handleRefresh} className={theme.button.iconDark}>
// //           <RefreshCw className="h-4 w-4" />
// //         </button>
// //         {streamInfo.type === 'http' ? (
// //           <span className={theme.badge.live}>
// //             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
// //           </span>
// //         ) : (
// //           <span className="text-xs text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full font-bold uppercase">
// //             RTSP
// //           </span>
// //         )}
// //       </div>

// //       {/* ── Video — flex-1 fills ALL remaining space ── */}
// //       <div className="flex-1 relative overflow-hidden bg-black">
// //         {streamInfo.type === 'http' && streamInfo.url ? (
// //           <>
// //             {isLoading && (
// //               <div className="absolute inset-0 flex items-center justify-center z-10">
// //                 <div className={theme.ui.spinner} />
// //               </div>
// //             )}
// //             {error ? (
// //               <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
// //                 <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
// //                 <p className="text-gray-400 mb-4">{error}</p>
// //                 <button onClick={handleRefresh} className="text-[#c5a880] text-sm font-bold">Retry Connection</button>
// //               </div>
// //             ) : (
// //               <img
// //                 key={refreshKey}
// //                 src={streamInfo.url}
// //                 alt="Live stream"
// //                 className="w-full h-full object-contain"
// //                 onLoad={() => { setIsLoading(false); setError(null); }}
// //                 onError={() => { setIsLoading(false); setError('Cannot connect to camera stream'); }}
// //                 style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
// //               />
// //             )}
// //             {isRecording && !error && (
// //               <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full
// //                               flex items-center gap-2 animate-pulse z-20 text-xs font-bold">
// //                 <div className="w-2 h-2 bg-white rounded-full" /> REC
// //               </div>
// //             )}
// //             {!error && !isLoading && (
// //               <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white z-20">
// //                 <p>{new Date().toLocaleTimeString()}</p>
// //               </div>
// //             )}
// //           </>
// //         ) : streamInfo.type === 'rtsp' ? (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center">
// //             <AlertCircle className="h-16 w-16 mb-4 text-amber-500" />
// //             <p className="text-lg font-black text-white mb-2">RTSP Stream</p>
// //             <p className="text-gray-400 text-center px-6 mb-4">Browser cannot play RTSP directly.</p>
// //             <div className="bg-white/10 rounded-full px-4 py-2 font-mono text-xs text-gray-300">{camera.rtsp_url}</div>
// //           </div>
// //         ) : (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center">
// //             <WifiOff className="h-16 w-16 mb-4 text-red-500" />
// //             <p className="text-gray-400">No stream URL configured</p>
// //           </div>
// //         )}
// //       </div>

// //       {/* ── Controls — fixed height at bottom ── */}
// //       {/* <div className="flex-shrink-0 bg-[#faf9f6] px-4 py-4 space-y-3 rounded-t-3xl">
// //         <button
// //           onClick={() => navigate(`/property/${id}/drone-control`)}
// //           disabled={streamInfo.type !== 'http'}
// //           className={`${theme.button.dark} ${theme.button.full}`}
// //         >
// //           <Radio className="w-5 h-5" /> Dispatch Drone to This Location
// //         </button>
// //         <div className="grid grid-cols-3 gap-3">
// //           <button
// //             onClick={() => setIsRecording(!isRecording)}
// //             disabled={streamInfo.type !== 'http'}
// //             className={isRecording ? theme.button.danger : theme.button.secondary}
// //           >
// //             {isRecording ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Circle className="w-4 h-4" /> Record</>}
// //           </button>
// //           <button
// //             onClick={() => { if (streamInfo.url) window.open(streamInfo.url.replace('/video', '/shot.jpg'), '_blank'); }}
// //             disabled={streamInfo.type !== 'http'}
// //             className={theme.button.secondary}
// //           >
// //             <Camera className="w-4 h-4" /> Snapshot
// //           </button>
// //           <button
// //             onClick={() => navigate(`/property/${id}/camera/${cameraId}/edit`)}
// //             className={theme.button.secondary}
// //           >
// //             <Settings className="w-4 h-4" /> Settings
// //           </button>
// //         </div>
// //       </div> */}

// //     </div>
// //   );
// // };

// // export default LiveCamera;

// // src/pages/LiveCamera.jsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Radio, Camera, Circle, Square, AlertCircle, Settings, RefreshCw, WifiOff } from 'lucide-react';
// import { useState } from 'react';
// import { useCameras } from '../hooks/useCameras';
// import { theme } from '../theme';

// const LiveCamera = () => {
//   const { id, cameraId } = useParams();
//   const navigate = useNavigate();
//   const { data: cameras = [] } = useCameras(id);

//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading,   setIsLoading]   = useState(true);
//   const [error,       setError]       = useState(null);
//   const [refreshKey,  setRefreshKey]  = useState(0);

//   const camera = cameras.find(c => String(c.id) === String(cameraId));

//   const getStreamInfo = () => {
//     if (!camera) return { type: 'unknown', url: null };
//     const url = camera.stream_url || camera.rtsp_url || '';
//     if (url.toLowerCase().startsWith('http')) return { type: 'http', url };
//     if (url.toLowerCase().startsWith('rtsp')) return { type: 'rtsp', url: null };
//     return { type: 'unknown', url: null };
//   };
//   const streamInfo = getStreamInfo();

//   const handleRefresh = () => { setIsLoading(true); setError(null); setRefreshKey(k => k + 1); };

//   if (!camera && cameras.length > 0) return (
//     <div className="h-screen bg-[#0f172a] flex items-center justify-center">
//       <div className="text-center">
//         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//         <p className="text-gray-400">Camera not found</p>
//         <button onClick={() => navigate(-1)} className="mt-4 text-[#c5a880] text-sm font-bold">Go Back</button>
//       </div>
//     </div>
//   );

//   if (!camera) return (
//     <div className="h-screen bg-[#0f172a] flex items-center justify-center">
//       <div className={theme.ui.spinner} />
//     </div>
//   );

//   return (
//     // Full viewport, flex column, NO overflow/scroll
//     <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden">

//       {/* ── Header — fixed height ── */}
//       <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/10">
//         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <div className="flex-1 min-w-0">
//           <p className="text-white font-bold text-sm truncate">{camera.name}</p>
//           <p className="text-gray-500 text-xs truncate">{camera.rtsp_url}</p>
//         </div>
//         <button onClick={handleRefresh} className={theme.button.iconDark}>
//           <RefreshCw className="h-4 w-4" />
//         </button>
//         {streamInfo.type === 'http' && !isLoading && !error ? (
//           <span className={theme.badge.live}>
//             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
//           </span>
//         ) : streamInfo.type === 'rtsp' ? (
//           <span className="text-xs text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full font-bold uppercase">
//             RTSP
//           </span>
//         ) : null}
//       </div>

//       {/* ── Video — flex-1 fills ALL remaining space ── */}
//       <div className="flex-1 relative overflow-hidden bg-black">
//         {streamInfo.type === 'http' && streamInfo.url ? (
//           <>
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <div className={theme.ui.spinner} />
//               </div>
//             )}
//             {error ? (
//               <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
//                 <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
//                 <p className="text-gray-400 mb-4">{error}</p>
//                 <button onClick={handleRefresh} className="text-[#c5a880] text-sm font-bold">Retry Connection</button>
//               </div>
//             ) : (
//               <img
//                 key={refreshKey}
//                 src={streamInfo.url}
//                 alt="Live stream"
//                 className="w-full h-full object-contain"
//                 onLoad={() => { setIsLoading(false); setError(null); }}
//                 onError={() => { setIsLoading(false); setError('Cannot connect to camera stream'); }}
//                 style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
//               />
//             )}
//             {isRecording && !error && (
//               <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full
//                               flex items-center gap-2 animate-pulse z-20 text-xs font-bold">
//                 <div className="w-2 h-2 bg-white rounded-full" /> REC
//               </div>
//             )}
//             {!error && !isLoading && (
//               <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white z-20">
//                 <p>{new Date().toLocaleTimeString()}</p>
//               </div>
//             )}
//           </>
//         ) : streamInfo.type === 'rtsp' ? (
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <AlertCircle className="h-16 w-16 mb-4 text-amber-500" />
//             <p className="text-lg font-black text-white mb-2">RTSP Stream</p>
//             <p className="text-gray-400 text-center px-6 mb-4">Browser cannot play RTSP directly.</p>
//             <div className="bg-white/10 rounded-full px-4 py-2 font-mono text-xs text-gray-300">{camera.rtsp_url}</div>
//           </div>
//         ) : (
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <WifiOff className="h-16 w-16 mb-4 text-red-500" />
//             <p className="text-gray-400">No stream URL configured</p>
//           </div>
//         )}
//       </div>

//       {/* ── Controls — fixed height at bottom ── */}
//       <div className="flex-shrink-0 bg-[#faf9f6] px-4 py-4 space-y-3 rounded-t-3xl">
//         <button
//           onClick={() => navigate(`/property/${id}/drone-control`)}
//           disabled={streamInfo.type !== 'http'}
//           className={`${theme.button.dark} ${theme.button.full}`}
//         >
//           <Radio className="w-5 h-5" /> Dispatch Drone to This Location
//         </button>
//         <div className="grid grid-cols-3 gap-3">
//           <button
//             onClick={() => setIsRecording(!isRecording)}
//             disabled={streamInfo.type !== 'http'}
//             className={isRecording ? theme.button.danger : theme.button.secondary}
//           >
//             {isRecording ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Circle className="w-4 h-4" /> Record</>}
//           </button>
//           <button
//             onClick={() => { if (streamInfo.url) window.open(streamInfo.url.replace('/video', '/shot.jpg'), '_blank'); }}
//             disabled={streamInfo.type !== 'http'}
//             className={theme.button.secondary}
//           >
//             <Camera className="w-4 h-4" /> Snapshot
//           </button>
//           <button
//             onClick={() => navigate(`/property/${id}/camera/${cameraId}/edit`)}
//             className={theme.button.secondary}
//           >
//             <Settings className="w-4 h-4" /> Settings
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default LiveCamera;

// src/pages/LiveCamera.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Camera, Circle, Square, AlertCircle, Settings, RefreshCw, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { useCameras } from '../hooks/useCameras';
import { theme } from '../theme';

const LiveCamera = () => {
  const { id, cameraId } = useParams();
  const navigate = useNavigate();
  const { data: cameras = [] } = useCameras(id);

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [refreshKey,  setRefreshKey]  = useState(0);

  const camera = cameras.find(c => String(c.id) === String(cameraId));

  const getStreamInfo = () => {
    if (!camera) return { type: 'unknown', url: null };
    const url = camera.stream_url || camera.rtsp_url || '';
    if (url.toLowerCase().startsWith('http')) return { type: 'http', url };
    if (url.toLowerCase().startsWith('rtsp')) return { type: 'rtsp', url: null };
    return { type: 'unknown', url: null };
  };
  const streamInfo = getStreamInfo();

  const handleRefresh = () => { setIsLoading(true); setError(null); setRefreshKey(k => k + 1); };

  if (!camera && cameras.length > 0) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-400">Camera not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#c5a880] text-sm font-bold">Go Back</button>
      </div>
    </div>
  );

  if (!camera) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className={theme.ui.spinner} />
    </div>
  );

  return (
    // Full viewport, flex column, NO overflow/scroll
    <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden">

      {/* ── Header — fixed height ── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#d4c4b0] bg-[#faf9f6]">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-[#1c1c1c] hover:bg-[#e8ddd0] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[#1c1c1c] font-bold text-sm truncate">{camera.name}</p>
          <p className="text-[#8a7560] text-xs truncate">{camera.rtsp_url}</p>
        </div>
        <button onClick={handleRefresh} className="p-2 rounded-xl text-[#1c1c1c] hover:bg-[#e8ddd0] transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
        {streamInfo.type === 'http' && !isLoading && !error ? (
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        ) : streamInfo.type === 'rtsp' ? (
          <span className="text-xs text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full font-bold uppercase">
            RTSP
          </span>
        ) : null}
      </div>

      {/* ── Video — flex-1 fills ALL remaining space ── */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {streamInfo.type === 'http' && streamInfo.url ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className={theme.ui.spinner} />
              </div>
            )}
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
                <p className="text-gray-400 mb-4">{error}</p>
                <button onClick={handleRefresh} className="text-[#c5a880] text-sm font-bold">Retry Connection</button>
              </div>
            ) : (
              <img
                key={refreshKey}
                src={streamInfo.url}
                alt="Live stream"
                className="w-full h-full object-contain"
                onLoad={() => { setIsLoading(false); setError(null); }}
                onError={() => { setIsLoading(false); setError('Cannot connect to camera stream'); }}
                style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
              />
            )}
            {isRecording && !error && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full
                              flex items-center gap-2 animate-pulse z-20 text-xs font-bold">
                <div className="w-2 h-2 bg-white rounded-full" /> REC
              </div>
            )}
            {!error && !isLoading && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white z-20">
                <p>{new Date().toLocaleTimeString()}</p>
              </div>
            )}
          </>
        ) : streamInfo.type === 'rtsp' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AlertCircle className="h-16 w-16 mb-4 text-amber-500" />
            <p className="text-lg font-black text-white mb-2">RTSP Stream</p>
            <p className="text-gray-400 text-center px-6 mb-4">Browser cannot play RTSP directly.</p>
            <div className="bg-white/10 rounded-full px-4 py-2 font-mono text-xs text-gray-300">{camera.rtsp_url}</div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <WifiOff className="h-16 w-16 mb-4 text-red-500" />
            <p className="text-gray-400">No stream URL configured</p>
          </div>
        )}
      </div>

      {/* ── Controls — fixed height at bottom ──
      <div className="flex-shrink-0 bg-[#faf9f6] px-4 py-4 space-y-3 rounded-t-3xl">
        <button
          onClick={() => navigate(`/property/${id}/drone-control`)}
          disabled={streamInfo.type !== 'http'}
          className={`${theme.button.dark} ${theme.button.full}`}
        >
          <Radio className="w-5 h-5" /> Dispatch Drone to This Location
        </button>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={streamInfo.type !== 'http'}
            className={isRecording ? theme.button.danger : theme.button.secondary}
          >
            {isRecording ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Circle className="w-4 h-4" /> Record</>}
          </button>
          <button
            onClick={() => { if (streamInfo.url) window.open(streamInfo.url.replace('/video', '/shot.jpg'), '_blank'); }}
            disabled={streamInfo.type !== 'http'}
            className={theme.button.secondary}
          >
            <Camera className="w-4 h-4" /> Snapshot
          </button>
          <button
            onClick={() => navigate(`/property/${id}/camera/${cameraId}/edit`)}
            className={theme.button.secondary}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div> */}
      {/* </div> */}

    </div>
  );
};

export default LiveCamera;