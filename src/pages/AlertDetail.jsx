// // // // src/pages/AlertDetail.jsx
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import {
// // //   ArrowLeft, Play, Navigation, Shield, Clock, AlertTriangle, Loader2,
// // //   Video, Image, Camera, ChevronRight, XCircle, CheckCircle,
// // // } from 'lucide-react';
// // // import {
// // //   useAlert, useResolveAlert, useMarkFalsePositive,
// // // } from '../hooks/useAlerts';
// // // import { API_BASE_URL } from '../config/api';
// // // import { useState, useRef } from 'react';
// // // import { theme } from '../theme';

// // // const AlertDetail = () => {
// // //   const { id, alertId } = useParams();
// // //   const navigate = useNavigate();

// // //   const { data: alert, isLoading } = useAlert(alertId);
// // //   const resolveMutation = useResolveAlert();
// // //   const falsePositiveMutation = useMarkFalsePositive();

// // //   const [showVideo, setShowVideo] = useState(false);
// // //   const [videoError, setVideoError] = useState(false);
// // //   const videoRef = useRef(null);

// // //   const getFullUrl = (path) => {
// // //     if (!path) return null;
// // //     if (path.startsWith('http')) return path;
// // //     return `${API_BASE_URL}${path}`;
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={theme.ui.spinner} />
// // //       </div>
// // //     );
// // //   }

// // //   if (!alert) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// // //           <p className={`${theme.type.error} mb-3`}>Alert not found</p>
// // //           <button onClick={() => navigate(-1)} className={theme.type.link}>Go Back</button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const isCritical = alert.severity === 'critical';
// // //   const isWeapon = alert.type?.toLowerCase().includes('weapon');
// // //   const hasVideo = !!alert.clip_url;
// // //   const hasImage = !!alert.image_url;
// // //   const imageUrl = getFullUrl(alert.image_url);
// // //   const videoUrl = getFullUrl(alert.clip_url);

// // //   const isMultiCamera = alert.camera_name?.includes('→');
// // //   const cameraPath = isMultiCamera
// // //     ? alert.camera_name.split('→').map((c) => c.trim())
// // //     : [alert.camera_name];

// // //   return (
// // //     <div className={theme.page.wrapper}>
      
// // //       {/* Header */}
// // //       <div className="sticky top-0 z-20 bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
// // //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // //           <ArrowLeft className="h-5 w-5" />
// // //         </button>
// // //         <div className="flex-1 min-w-0">
// // //           <h2 className={`${theme.type.h3} truncate`}>
// // //             {isWeapon ? '🚨 ' : '⚠️ '}{alert.type}
// // //           </h2>
// // //           {isMultiCamera && (
// // //             <p className="font-sans text-[10px] font-bold text-[#c5a880] uppercase tracking-widest mt-0.5">
// // //               📹 Tracked across {cameraPath.length} cameras
// // //             </p>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Multi-Camera Tracking Path */}
// // //       {isMultiCamera && (
// // //         <div className="px-5 mt-5">
// // //           <div className={theme.card.muted}>
// // //             <div className="flex items-center gap-2 mb-3">
// // //               <div className={theme.ui.iconBox}>
// // //                 <Navigation className="w-4 h-4 text-[#c5a880]" />
// // //               </div>
// // //               <div>
// // //                 <p className={theme.type.h4}>Multi-Camera Track</p>
// // //                 <p className={theme.type.labelSm}>Person moved across {cameraPath.length} zones</p>
// // //               </div>
// // //             </div>

// // //             <div className="flex items-center gap-1 flex-wrap">
// // //               {cameraPath.map((cam, i) => (
// // //                 <div key={i} className="flex items-center gap-1">
// // //                   <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
// // //                     i === 0 
// // //                       ? 'bg-red-50 text-red-600 border-red-200' 
// // //                       : i === cameraPath.length - 1 
// // //                       ? 'bg-amber-50 text-amber-600 border-amber-200' 
// // //                       : 'bg-[#faf9f6] text-[#1c1c1c] border-[#e6e3db]'
// // //                   }`}>
// // //                     <Camera className="w-3 h-3" />
// // //                     <span>{cam}</span>
// // //                   </div>
// // //                   {i < cameraPath.length - 1 && (
// // //                     <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Media Section */}
// // //       <div className="px-5 mt-5">
// // //         {hasVideo && hasImage && (
// // //           <div className="flex gap-2 mb-3">
// // //             <button
// // //               onClick={() => setShowVideo(false)}
// // //               className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
// // //                 !showVideo 
// // //                   ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.15)]' 
// // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'
// // //               }`}
// // //             >
// // //               <Image className="w-4 h-4" /> Snapshot
// // //             </button>
// // //             <button
// // //               onClick={() => setShowVideo(true)}
// // //               className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
// // //                 showVideo 
// // //                   ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.15)]' 
// // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'
// // //               }`}
// // //             >
// // //               <Video className="w-4 h-4" /> {isMultiCamera ? 'Merged Video' : 'Video Clip'}
// // //             </button>
// // //           </div>
// // //         )}

// // //         <div className={theme.media.videoWrap}>
// // //           {!showVideo && hasImage && (
// // //             <>
// // //               <img src={imageUrl} alt="Detection snapshot" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
// // //               {hasVideo && (
// // //                 <button onClick={() => setShowVideo(true)} className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition group">
// // //                   <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition">
// // //                     <Play className="w-8 h-8 text-white ml-1" />
// // //                   </div>
// // //                 </button>
// // //               )}
// // //             </>
// // //           )}

// // //           {showVideo && hasVideo && !videoError && (
// // //             <video ref={videoRef} src={videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" onError={() => setVideoError(true)}>
// // //               Your browser does not support video playback.
// // //             </video>
// // //           )}

// // //           {showVideo && videoError && (
// // //             <div className={theme.media.overlay}>
// // //               <Video className="w-12 h-12 text-gray-400 mb-3" />
// // //               <p className="text-white font-bold mb-1">Video not available yet</p>
// // //               <button onClick={() => { setVideoError(false); setShowVideo(false); }} className="mt-2 text-[#c5a880] text-sm font-bold underline underline-offset-2">
// // //                 View Snapshot Instead
// // //               </button>
// // //             </div>
// // //           )}

// // //           {!showVideo && !hasImage && (
// // //             <div className={theme.media.overlay}>
// // //               <Shield className="h-12 w-12 text-gray-400 mb-3" />
// // //               <p className="text-gray-400 text-sm font-bold">No image captured</p>
// // //             </div>
// // //           )}

// // //           {/* Overlays */}
// // //           <div className="absolute top-3 right-3 z-10">
// // //             {isCritical && <span className={theme.badge.danger}>CRITICAL</span>}
// // //             {!isCritical && alert.severity === 'high' && <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">HIGH</span>}
// // //             {!isCritical && alert.severity !== 'high' && <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest">MEDIUM</span>}
// // //           </div>
          
// // //           <div className="absolute top-3 left-3 z-10">
// // //             <span className="inline-flex items-center px-3 py-1 bg-[#1c1c1c] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
// // //               {alert.type}
// // //             </span>
// // //           </div>

// // //           {isMultiCamera && (
// // //             <div className="absolute bottom-3 left-3 z-10">
// // //               <span className={theme.badge.live}>
// // //                 <Camera className="w-3 h-3" /> {cameraPath.length} Cameras
// // //               </span>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {hasVideo && (
// // //           <div className="flex items-center justify-between mt-3 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
// // //             <span className="flex items-center gap-1">
// // //               <Video className="w-3 h-3" />
// // //               {isMultiCamera ? `Merged clip from ${cameraPath.length} cameras` : 'Video clip available'}
// // //             </span>
// // //             <span className="flex items-center gap-1">
// // //               <Clock className="w-3 h-3" /> {alert.timestamp}
// // //             </span>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Alert Info Card */}
// // //       <div className="px-5 mt-5">
// // //         <div className={theme.card.base}>
// // //           <div className="flex items-center gap-2 mb-4">
// // //             <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
// // //             <h3 className={theme.type.h3}>{alert.type}</h3>
// // //           </div>

// // //           <div className="space-y-3">
// // //             {[
// // //               { label: isMultiCamera ? 'Camera Path' : 'Camera', value: isMultiCamera ? cameraPath.join(' → ') : alert.camera_name },
// // //               { label: 'Time', value: alert.timestamp },
// // //               { label: 'Confidence', value: `${alert.confidence}%`, valueColor: alert.confidence > 80 ? 'text-emerald-500' : 'text-amber-500' },
// // //               { label: 'Grid Location', value: `Row ${alert.camera_cell?.row}, Col ${alert.camera_cell?.col}` },
// // //               { label: 'Status', value: alert.status?.replace('_', ' ').toUpperCase(), valueColor: alert.status === 'active' ? 'text-red-500' : 'text-emerald-500' },
// // //             ].map(({ label, value, valueColor }) => (
// // //               <div key={label} className="flex justify-between items-center py-2 border-b border-[#e6e3db] last:border-0">
// // //                 <span className={theme.type.labelSm}>{label}</span>
// // //                 <span className={`font-sans text-sm font-bold ${valueColor || 'text-[#1c1c1c]'}`}>{value}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Action Buttons */}
// // //       <div className="p-5 space-y-3 pb-10">
// // //         {isCritical && alert.status === 'active' && (
// // //           <button onClick={() => navigate(`/property/${id}/drone-control`)} className={`${theme.button.danger} ${theme.button.full} animate-pulse`}>
// // //             <Navigation className="w-4 h-4" /> Emergency Dispatch Drone
// // //           </button>
// // //         )}

// // //         <button onClick={() => navigate(`/property/${id}/cameras`)} className={`${theme.button.dark} ${theme.button.full}`}>
// // //           <Play className="w-4 h-4" /> View Live Cameras
// // //         </button>

// // //         {alert.status === 'active' && (
// // //           <div className="grid grid-cols-2 gap-3">
// // //             <button
// // //               onClick={() => { if (confirm('Mark as false positive?')) { falsePositiveMutation.mutate(alertId); navigate(-1); } }}
// // //               disabled={falsePositiveMutation.isPending}
// // //               className={`${theme.button.secondary} text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300`}
// // //             >
// // //               <XCircle className="w-4 h-4" /> False +
// // //             </button>
// // //             <button
// // //               onClick={() => { if (confirm('Mark as resolved?')) { resolveMutation.mutate(alertId); navigate(-1); } }}
// // //               disabled={resolveMutation.isPending}
// // //               className={`${theme.button.secondary} text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300`}
// // //             >
// // //               <CheckCircle className="w-4 h-4" /> Resolved
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AlertDetail;

// // // // src/pages/AlertDetail.jsx
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import {
// // //   ArrowLeft, Play, Navigation, Shield, Clock, AlertTriangle,
// // //   Video, Image, Camera, ChevronRight, XCircle, CheckCircle,
// // //   MapPin, Loader2,
// // // } from 'lucide-react';
// // // import {
// // //   useAlert, useResolveAlert, useMarkFalsePositive,
// // // } from '../hooks/useAlerts';
// // // import { API_BASE_URL } from '../config/api';
// // // import { useState, useRef } from 'react';
// // // import { theme } from '../theme';

// // // const AlertDetail = () => {
// // //   const { id, alertId } = useParams();
// // //   const navigate        = useNavigate();

// // //   const { data: alert, isLoading } = useAlert(alertId);
// // //   const resolveMutation            = useResolveAlert();
// // //   const falsePositiveMutation      = useMarkFalsePositive();

// // //   const [showVideo,   setShowVideo]   = useState(false);
// // //   const [videoError,  setVideoError]  = useState(false);
// // //   const videoRef = useRef(null);

// // //   const getFullUrl = (path) => {
// // //     if (!path) return null;
// // //     if (path.startsWith('http')) return path;
// // //     return `${API_BASE_URL}${path}`;
// // //   };

// // //   // ── Loading ────────────────────────────────────────────────────────────────

// // //   if (isLoading) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={theme.ui.spinner} />
// // //       </div>
// // //     );
// // //   }

// // //   // ── Not found ──────────────────────────────────────────────────────────────

// // //   if (!alert) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// // //           <p className={`${theme.type.error} mb-3`}>Alert not found</p>
// // //           <button
// // //             onClick={() => navigate(-1)}
// // //             className={theme.type.link}
// // //           >
// // //             Go Back
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Derived values ─────────────────────────────────────────────────────────

// // //   const isCritical    = alert.severity === 'critical';
// // //   const isWeapon      = alert.type?.toLowerCase().includes('weapon');
// // //   const hasVideo      = !!alert.clip_url;
// // //   const hasImage      = !!alert.image_url;
// // //   const imageUrl      = getFullUrl(alert.image_url);
// // //   const videoUrl      = getFullUrl(alert.clip_url);
// // //   const hasDetectedCell = !!alert.detected_cell;

// // //   const isMultiCamera = alert.camera_name?.includes('→');
// // //   const cameraPath    = isMultiCamera
// // //     ? alert.camera_name.split('→').map(c => c.trim())
// // //     : [alert.camera_name];

// // //   // ── Severity badge helper ──────────────────────────────────────────────────

// // //   const getSeverityBadge = () => {
// // //     switch (alert.severity) {
// // //       case 'critical':
// // //         return (
// // //           <span className={theme.badge.danger}>CRITICAL</span>
// // //         );
// // //       case 'high':
// // //         return (
// // //           <span className="inline-flex items-center px-3 py-1 bg-amber-500
// // //                            text-white text-[10px] font-bold rounded-full
// // //                            uppercase tracking-widest">
// // //             HIGH
// // //           </span>
// // //         );
// // //       default:
// // //         return (
// // //           <span className="inline-flex items-center px-3 py-1 bg-amber-100
// // //                            text-amber-700 text-[10px] font-bold rounded-full
// // //                            uppercase tracking-widest">
// // //             MEDIUM
// // //           </span>
// // //         );
// // //     }
// // //   };

// // //   // ── Render ─────────────────────────────────────────────────────────────────

// // //   return (
// // //     <div className={theme.page.wrapper}>

// // //       {/* ── Header ── */}
// // //       <div className="sticky top-0 z-20 bg-white border-b border-[#e6e3db]
// // //                       px-4 py-4 flex items-center gap-3 shadow-sm">
// // //         <button
// // //           onClick={() => navigate(-1)}
// // //           className={theme.ui.backBtn}
// // //         >
// // //           <ArrowLeft className="h-5 w-5" />
// // //         </button>

// // //         <div className="flex-1 min-w-0">
// // //           <h2 className={`${theme.type.h3} truncate`}>
// // //             {isWeapon ? '🚨 ' : '⚠️ '}{alert.type}
// // //           </h2>
// // //           {isMultiCamera && (
// // //             <p className="font-sans text-[10px] font-bold text-[#c5a880]
// // //                           uppercase tracking-widest mt-0.5">
// // //               📹 Tracked across {cameraPath.length} cameras
// // //             </p>
// // //           )}
// // //         </div>

// // //         {/* Status pill */}
// // //         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
// // //                          tracking-widest ${
// // //           alert.status === 'active'
// // //             ? 'bg-red-100 text-red-600'
// // //             : alert.status === 'resolved'
// // //             ? 'bg-emerald-100 text-emerald-600'
// // //             : 'bg-gray-100 text-gray-500'
// // //         }`}>
// // //           {alert.status?.replace('_', ' ')}
// // //         </div>
// // //       </div>

// // //       {/* ── Detected Cell Banner ── */}
// // //       {hasDetectedCell && (
// // //         <div className="mx-5 mt-4 bg-red-500/10 border border-red-300
// // //                         rounded-[1.5rem] px-4 py-3 flex items-center gap-3">
// // //           <div className="w-10 h-10 bg-red-500 rounded-full flex items-center
// // //                           justify-center flex-shrink-0 shadow-md">
// // //             <MapPin className="w-5 h-5 text-white" />
// // //           </div>
// // //           <div className="flex-1 min-w-0">
// // //             <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
// // //               Breach Location
// // //             </p>
// // //             <p className="text-lg font-bold text-[#1c1c1c] leading-tight">
// // //               Fence Cell — {alert.detected_cell}
// // //             </p>
// // //           </div>
// // //           {isCritical && (
// // //             <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse
// // //                              flex-shrink-0" />
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ── Multi-Camera Tracking Path ── */}
// // //       {isMultiCamera && (
// // //         <div className="px-5 mt-4">
// // //           <div className={theme.card.muted}>
// // //             <div className="flex items-center gap-2 mb-3">
// // //               <div className={theme.ui.iconBox}>
// // //                 <Navigation className="w-4 h-4 text-[#c5a880]" />
// // //               </div>
// // //               <div>
// // //                 <p className={theme.type.h4}>Multi-Camera Track</p>
// // //                 <p className={theme.type.labelSm}>
// // //                   Person moved across {cameraPath.length} zones
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="flex items-center gap-1 flex-wrap">
// // //               {cameraPath.map((cam, i) => (
// // //                 <div key={i} className="flex items-center gap-1">
// // //                   <div className={`flex items-center gap-1.5 px-3 py-1.5
// // //                                    rounded-full text-[10px] font-bold uppercase
// // //                                    tracking-wide border ${
// // //                     i === 0
// // //                       ? 'bg-red-50 text-red-600 border-red-200'
// // //                       : i === cameraPath.length - 1
// // //                       ? 'bg-amber-50 text-amber-600 border-amber-200'
// // //                       : 'bg-[#faf9f6] text-[#1c1c1c] border-[#e6e3db]'
// // //                   }`}>
// // //                     <Camera className="w-3 h-3" />
// // //                     <span>{cam}</span>
// // //                   </div>
// // //                   {i < cameraPath.length - 1 && (
// // //                     <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ── Media Section ── */}
// // //       <div className="px-5 mt-4">

// // //         {/* Toggle tabs when both media types exist */}
// // //         {hasVideo && hasImage && (
// // //           <div className="flex gap-2 mb-3">
// // //             <button
// // //               onClick={() => setShowVideo(false)}
// // //               className={`flex-1 py-2 px-4 rounded-full text-sm font-bold
// // //                           transition-all flex items-center justify-center gap-2 ${
// // //                 !showVideo
// // //                   ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.15)]'
// // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'
// // //               }`}
// // //             >
// // //               <Image className="w-4 h-4" /> Snapshot
// // //             </button>
// // //             <button
// // //               onClick={() => setShowVideo(true)}
// // //               className={`flex-1 py-2 px-4 rounded-full text-sm font-bold
// // //                           transition-all flex items-center justify-center gap-2 ${
// // //                 showVideo
// // //                   ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.15)]'
// // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'
// // //               }`}
// // //             >
// // //               <Video className="w-4 h-4" />
// // //               {isMultiCamera ? 'Merged Video' : 'Video Clip'}
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Media frame */}
// // //         <div className={theme.media.videoWrap}>

// // //           {/* Snapshot */}
// // //           {!showVideo && hasImage && (
// // //             <>
// // //               <img
// // //                 src={imageUrl}
// // //                 alt="Detection snapshot"
// // //                 className="w-full h-full object-cover"
// // //                 onError={e => { e.target.style.display = 'none'; }}
// // //               />
// // //               {hasVideo && (
// // //                 <button
// // //                   onClick={() => setShowVideo(true)}
// // //                   className="absolute inset-0 flex items-center justify-center
// // //                              bg-black/30 hover:bg-black/50 transition group"
// // //                 >
// // //                   <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30
// // //                                   backdrop-blur-sm rounded-full flex items-center
// // //                                   justify-center transition">
// // //                     <Play className="w-8 h-8 text-white ml-1" />
// // //                   </div>
// // //                 </button>
// // //               )}
// // //             </>
// // //           )}

// // //           {/* Video */}
// // //           {showVideo && hasVideo && !videoError && (
// // //             <video
// // //               ref={videoRef}
// // //               src={videoUrl}
// // //               controls
// // //               autoPlay
// // //               className="w-full h-full object-contain bg-black"
// // //               onError={() => setVideoError(true)}
// // //             >
// // //               Your browser does not support video playback.
// // //             </video>
// // //           )}

// // //           {/* Video error */}
// // //           {showVideo && videoError && (
// // //             <div className={theme.media.overlay}>
// // //               <Video className="w-12 h-12 text-gray-400 mb-3" />
// // //               <p className="text-white font-bold mb-1">Video not available yet</p>
// // //               <button
// // //                 onClick={() => { setVideoError(false); setShowVideo(false); }}
// // //                 className="mt-2 text-[#c5a880] text-sm font-bold
// // //                            underline underline-offset-2"
// // //               >
// // //                 View Snapshot Instead
// // //               </button>
// // //             </div>
// // //           )}

// // //           {/* No image placeholder */}
// // //           {!showVideo && !hasImage && (
// // //             <div className={theme.media.overlay}>
// // //               <Shield className="h-12 w-12 text-gray-400 mb-3" />
// // //               <p className="text-gray-400 text-sm font-bold">No image captured</p>
// // //             </div>
// // //           )}

// // //           {/* Top-right severity badge */}
// // //           <div className="absolute top-3 right-3 z-10">
// // //             {getSeverityBadge()}
// // //           </div>

// // //           {/* Top-left alert type badge */}
// // //           <div className="absolute top-3 left-3 z-10">
// // //             <span className="inline-flex items-center px-3 py-1 bg-[#1c1c1c]
// // //                              text-white text-[10px] font-bold rounded-full
// // //                              uppercase tracking-widest shadow-md">
// // //               {alert.type}
// // //             </span>
// // //           </div>

// // //           {/* Bottom-left: detected cell overlay on media */}
// // //           {hasDetectedCell && (
// // //             <div className="absolute bottom-3 left-3 z-10">
// // //               <span className="inline-flex items-center gap-1.5 px-3 py-1.5
// // //                                bg-red-500 text-white text-[10px] font-bold
// // //                                rounded-full uppercase tracking-widest shadow-md">
// // //                 <MapPin className="w-3 h-3" />
// // //                 Cell {alert.detected_cell}
// // //               </span>
// // //             </div>
// // //           )}

// // //           {/* Bottom-right: multi-camera badge */}
// // //           {isMultiCamera && (
// // //             <div className="absolute bottom-3 right-3 z-10">
// // //               <span className={theme.badge.live}>
// // //                 <Camera className="w-3 h-3" /> {cameraPath.length} Cameras
// // //               </span>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Media footer */}
// // //         {hasVideo && (
// // //           <div className="flex items-center justify-between mt-3 px-1
// // //                           text-[10px] font-bold uppercase tracking-widest
// // //                           text-gray-400">
// // //             <span className="flex items-center gap-1">
// // //               <Video className="w-3 h-3" />
// // //               {isMultiCamera
// // //                 ? `Merged clip from ${cameraPath.length} cameras`
// // //                 : 'Video clip available'}
// // //             </span>
// // //             <span className="flex items-center gap-1">
// // //               <Clock className="w-3 h-3" /> {alert.timestamp}
// // //             </span>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ── Alert Info Card ── */}
// // //       <div className="px-5 mt-5">
// // //         <div className={theme.card.base}>
// // //           <div className="flex items-center gap-2 mb-4">
// // //             <AlertTriangle
// // //               className={`h-5 w-5 ${
// // //                 isCritical ? 'text-red-500' : 'text-amber-500'
// // //               }`}
// // //             />
// // //             <h3 className={theme.type.h3}>{alert.type}</h3>
// // //           </div>

// // //           <div className="space-y-0">

// // //             {/* Camera */}
// // //             <InfoRow
// // //               label={isMultiCamera ? 'Camera Path' : 'Camera'}
// // //               value={isMultiCamera ? cameraPath.join(' → ') : alert.camera_name}
// // //             />

// // //             {/* Time */}
// // //             <InfoRow label="Time" value={alert.timestamp} />

// // //             {/* Confidence */}
// // //             <InfoRow
// // //               label="Confidence"
// // //               value={`${alert.confidence}%`}
// // //               valueColor={
// // //                 alert.confidence > 80 ? 'text-emerald-500' : 'text-amber-500'
// // //               }
// // //             />

// // //             {/* Grid location */}
// // //             <InfoRow
// // //               label="Camera Grid"
// // //               value={`Row ${alert.camera_cell?.row ?? '—'}, Col ${alert.camera_cell?.col ?? '—'}`}
// // //             />

// // //             {/* ── Detected Fence Cell (NEW) ── */}
// // //             {hasDetectedCell && (
// // //               <div className="flex justify-between items-center py-3
// // //                               border-b border-[#e6e3db] bg-red-50
// // //                               -mx-4 px-4 rounded-xl">
// // //                 <div className="flex items-center gap-1.5">
// // //                   <MapPin className="w-4 h-4 text-red-500" />
// // //                   <span className="font-sans text-xs font-bold text-gray-500
// // //                                    uppercase tracking-wider">
// // //                     Breach Cell
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex items-center gap-2">
// // //                   <span className="font-sans text-sm font-bold text-red-500">
// // //                     {alert.detected_cell}
// // //                   </span>
// // //                   <span className="w-2 h-2 bg-red-500 rounded-full
// // //                                    animate-pulse" />
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Status */}
// // //             <InfoRow
// // //               label="Status"
// // //               value={alert.status?.replace('_', ' ').toUpperCase()}
// // //               valueColor={
// // //                 alert.status === 'active'
// // //                   ? 'text-red-500'
// // //                   : 'text-emerald-500'
// // //               }
// // //             />

// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ── Action Buttons ── */}
// // //       <div className="p-5 space-y-3 pb-10">

// // //         {/* Emergency drone dispatch */}
// // //         {isCritical && alert.status === 'active' && (
// // //           <button
// // //             onClick={() => navigate(`/property/${id}/drone-control`)}
// // //             className={`${theme.button.danger} ${theme.button.full} animate-pulse`}
// // //           >
// // //             <Navigation className="w-4 h-4" /> Emergency Dispatch Drone
// // //           </button>
// // //         )}

// // //         {/* View live cameras */}
// // //         <button
// // //           onClick={() => navigate(`/property/${id}/cameras`)}
// // //           className={`${theme.button.dark} ${theme.button.full}`}
// // //         >
// // //           <Play className="w-4 h-4" /> View Live Cameras
// // //         </button>

// // //         {/* Active alert actions */}
// // //         {alert.status === 'active' && (
// // //           <div className="grid grid-cols-2 gap-3">
// // //             <button
// // //               onClick={() => {
// // //                 if (confirm('Mark this alert as a false positive?')) {
// // //                   falsePositiveMutation.mutate(alertId);
// // //                   navigate(-1);
// // //                 }
// // //               }}
// // //               disabled={falsePositiveMutation.isPending}
// // //               className={`${theme.button.secondary} text-red-500
// // //                           border-red-200 hover:bg-red-50 hover:border-red-300
// // //                           flex items-center justify-center gap-2`}
// // //             >
// // //               {falsePositiveMutation.isPending
// // //                 ? <Loader2 className="w-4 h-4 animate-spin" />
// // //                 : <XCircle className="w-4 h-4" />}
// // //               False +
// // //             </button>

// // //             <button
// // //               onClick={() => {
// // //                 if (confirm('Mark this alert as resolved?')) {
// // //                   resolveMutation.mutate(alertId);
// // //                   navigate(-1);
// // //                 }
// // //               }}
// // //               disabled={resolveMutation.isPending}
// // //               className={`${theme.button.secondary} text-emerald-600
// // //                           border-emerald-200 hover:bg-emerald-50
// // //                           hover:border-emerald-300 flex items-center
// // //                           justify-center gap-2`}
// // //             >
// // //               {resolveMutation.isPending
// // //                 ? <Loader2 className="w-4 h-4 animate-spin" />
// // //                 : <CheckCircle className="w-4 h-4" />}
// // //               Resolved
// // //             </button>
// // //           </div>
// // //         )}

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // ── Reusable info row ──────────────────────────────────────────────────────────

// // // const InfoRow = ({ label, value, valueColor }) => (
// // //   <div className="flex justify-between items-center py-3
// // //                   border-b border-[#e6e3db] last:border-0">
// // //     <span className={theme.type.labelSm}>{label}</span>
// // //     <span className={`font-sans text-sm font-bold ${valueColor || 'text-[#1c1c1c]'}`}>
// // //       {value}
// // //     </span>
// // //   </div>
// // // );

// // // export default AlertDetail;

// // // src/pages/AlertDetail.jsx
// // import { useParams, useNavigate } from 'react-router-dom';
// // import {
// //   ArrowLeft, Play, Navigation, Shield, Clock, AlertTriangle,
// //   Video, Image, Camera, ChevronRight, XCircle, CheckCircle,
// //   MapPin, Loader2,
// // } from 'lucide-react';
// // import {
// //   useAlert, useResolveAlert, useMarkFalsePositive,
// // } from '../hooks/useAlerts';
// // import { API_BASE_URL } from '../config/api';
// // import { useState, useRef } from 'react';
// // import { theme } from '../theme';

// // const AlertDetail = () => {
// //   const { id, alertId } = useParams();
// //   const navigate        = useNavigate();

// //   const { data: alert, isLoading } = useAlert(alertId);
// //   const resolveMutation            = useResolveAlert();
// //   const falsePositiveMutation      = useMarkFalsePositive();

// //   const [showVideo,  setShowVideo]  = useState(false);
// //   const [videoError, setVideoError] = useState(false);
// //   const videoRef = useRef(null);

// //   const getFullUrl = (path) => {
// //     if (!path) return null;
// //     if (path.startsWith('http')) return path;
// //     return `${API_BASE_URL}${path}`;
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={theme.ui.spinner} />
// //       </div>
// //     );
// //   }

// //   if (!alert) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// //           <p className={`${theme.type.error} mb-3`}>Alert not found</p>
// //           <button onClick={() => navigate(-1)} className={theme.type.link}>Go Back</button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const isCritical      = alert.severity === 'critical';
// //   const isWeapon        = alert.type?.toLowerCase().includes('weapon');
// //   const hasVideo        = !!alert.clip_url;
// //   const hasImage        = !!alert.image_url;
// //   const imageUrl        = getFullUrl(alert.image_url);
// //   const videoUrl        = getFullUrl(alert.clip_url);
// //   const hasDetectedCell = !!alert.detected_cell;

// //   const isMultiCamera = alert.camera_name?.includes('→');
// //   const cameraPath    = isMultiCamera
// //     ? alert.camera_name.split('→').map(c => c.trim())
// //     : [alert.camera_name];

// //   const getSeverityBadge = () => {
// //     switch (alert.severity) {
// //       case 'critical':
// //         return <span className={theme.badge.danger}>CRITICAL</span>;
// //       case 'high':
// //         return (
// //           <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
// //             HIGH
// //           </span>
// //         );
// //       default:
// //         return (
// //           <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
// //             MEDIUM
// //           </span>
// //         );
// //     }
// //   };

// //   return (
// //     <div className={theme.page.wrapper}>

// //       {/* ── Header ── */}
// //       <div className={theme.header.wrapper}>
// //         <div className="flex items-center gap-3">
// //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //             <ArrowLeft className="h-5 w-5" />
// //           </button>
// //           <div>
// //             <h2 className={theme.header.title}>
// //               {isWeapon ? '🚨 ' : '⚠️ '}{alert.type}
// //             </h2>
// //             {isMultiCamera && (
// //               <p className="font-sans text-[10px] font-bold text-[#c5a880] uppercase tracking-widest">
// //                 📹 Tracked across {cameraPath.length} cameras
// //               </p>
// //             )}
// //           </div>
// //         </div>

// //         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
// //           alert.status === 'active'
// //             ? 'bg-red-100 text-red-600'
// //             : alert.status === 'resolved'
// //             ? 'bg-emerald-100 text-emerald-600'
// //             : 'bg-[#e6e3db] text-gray-500'
// //         }`}>
// //           {alert.status?.replace('_', ' ')}
// //         </div>
// //       </div>

// //       {/* ── Main two-column layout ── */}
// //       <div className="flex-1 overflow-y-auto">
// //         <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

// //           {/* ── LEFT: Media (compact) ── */}
// //           <div className="space-y-4">

// //             {/* Media toggle tabs */}
// //             {hasVideo && hasImage && (
// //               <div className="flex gap-2">
// //                 <button
// //                   onClick={() => setShowVideo(false)}
// //                   className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
// //                     !showVideo
// //                       ? 'bg-[#1c1c1c] text-white'
// //                       : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
// //                   }`}
// //                 >
// //                   <Image className="w-3.5 h-3.5" /> Snapshot
// //                 </button>
// //                 <button
// //                   onClick={() => setShowVideo(true)}
// //                   className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
// //                     showVideo
// //                       ? 'bg-[#1c1c1c] text-white'
// //                       : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
// //                   }`}
// //                 >
// //                   <Video className="w-3.5 h-3.5" />
// //                   {isMultiCamera ? 'Merged Video' : 'Video Clip'}
// //                 </button>
// //               </div>
// //             )}

// //             {/* Media frame — compact 16:9 */}
// //             <div className="relative w-full aspect-video bg-[#1c1c1c] rounded-[1.5rem] overflow-hidden shadow-md">

// //               {!showVideo && hasImage && (
// //                 <>
// //                   <img
// //                     src={imageUrl}
// //                     alt="Detection snapshot"
// //                     className="w-full h-full object-cover"
// //                     onError={e => { e.target.style.display = 'none'; }}
// //                   />
// //                   {hasVideo && (
// //                     <button
// //                       onClick={() => setShowVideo(true)}
// //                       className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition group"
// //                     >
// //                       <div className="w-12 h-12 bg-[#ffffff1a] group-hover:bg-[#ffffff30] backdrop-blur-sm rounded-full flex items-center justify-center">
// //                         <Play className="w-6 h-6 text-white ml-0.5" />
// //                       </div>
// //                     </button>
// //                   )}
// //                 </>
// //               )}

// //               {showVideo && hasVideo && !videoError && (
// //                 <video
// //                   ref={videoRef}
// //                   src={videoUrl}
// //                   controls
// //                   autoPlay
// //                   className="w-full h-full object-contain bg-black"
// //                   onError={() => setVideoError(true)}
// //                 >
// //                   Your browser does not support video playback.
// //                 </video>
// //               )}

// //               {showVideo && videoError && (
// //                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
// //                   <Video className="w-10 h-10 text-gray-400 mb-2" />
// //                   <p className="text-white font-bold text-sm mb-1">Video not available yet</p>
// //                   <button
// //                     onClick={() => { setVideoError(false); setShowVideo(false); }}
// //                     className="text-[#c5a880] text-xs font-bold underline underline-offset-2"
// //                   >
// //                     View Snapshot Instead
// //                   </button>
// //                 </div>
// //               )}

// //               {!showVideo && !hasImage && (
// //                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
// //                   <Shield className="h-10 w-10 text-gray-400 mb-2" />
// //                   <p className="text-gray-400 text-sm font-bold">No image captured</p>
// //                 </div>
// //               )}

// //               {/* Overlay badges */}
// //               <div className="absolute top-2.5 right-2.5 z-10">{getSeverityBadge()}</div>
// //               <div className="absolute top-2.5 left-2.5 z-10">
// //                 <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
// //                   {alert.type}
// //                 </span>
// //               </div>
// //               {hasDetectedCell && (
// //                 <div className="absolute bottom-2.5 left-2.5 z-10">
// //                   <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
// //                     <MapPin className="w-3 h-3" /> Cell {alert.detected_cell}
// //                   </span>
// //                 </div>
// //               )}
// //               {isMultiCamera && (
// //                 <div className="absolute bottom-2.5 right-2.5 z-10">
// //                   <span className={theme.badge.live}>
// //                     <Camera className="w-3 h-3" /> {cameraPath.length} Cameras
// //                   </span>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Media footer */}
// //             {hasVideo && (
// //               <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
// //                 <span className="flex items-center gap-1">
// //                   <Video className="w-3 h-3" />
// //                   {isMultiCamera ? `Merged clip — ${cameraPath.length} cameras` : 'Video clip available'}
// //                 </span>
// //                 <span className="flex items-center gap-1">
// //                   <Clock className="w-3 h-3" /> {alert.timestamp}
// //                 </span>
// //               </div>
// //             )}

// //             {/* Detected cell banner */}
// //             {hasDetectedCell && (
// //               <div className="bg-red-500/10 border border-red-200 rounded-[1.25rem] px-4 py-3 flex items-center gap-3">
// //                 <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
// //                   <MapPin className="w-4 h-4 text-white" />
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Breach Location</p>
// //                   <p className="text-base font-bold text-[#1c1c1c]">Fence Cell — {alert.detected_cell}</p>
// //                 </div>
// //                 {isCritical && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />}
// //               </div>
// //             )}
// //           </div>

// //           {/* ── RIGHT: Info + Actions ── */}
// //           <div className="space-y-4">

// //             {/* Alert info card */}
// //             <div className={theme.card.base}>
// //               <div className="flex items-center gap-2 mb-4">
// //                 <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
// //                 <h3 className={theme.type.h3}>{alert.type}</h3>
// //               </div>

// //               <div className="space-y-0">
// //                 <InfoRow
// //                   label={isMultiCamera ? 'Camera Path' : 'Camera'}
// //                   value={isMultiCamera ? cameraPath.join(' → ') : alert.camera_name}
// //                 />
// //                 <InfoRow label="Time"       value={alert.timestamp} />
// //                 <InfoRow
// //                   label="Confidence"
// //                   value={`${alert.confidence}%`}
// //                   valueColor={alert.confidence > 80 ? 'text-emerald-500' : 'text-amber-500'}
// //                 />
// //                 <InfoRow
// //                   label="Camera Grid"
// //                   value={`Row ${alert.camera_cell?.row ?? '—'}, Col ${alert.camera_cell?.col ?? '—'}`}
// //                 />
// //                 {hasDetectedCell && (
// //                   <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] bg-red-50 -mx-4 px-4 rounded-xl">
// //                     <div className="flex items-center gap-1.5">
// //                       <MapPin className="w-4 h-4 text-red-500" />
// //                       <span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Breach Cell</span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <span className="font-sans text-sm font-bold text-red-500">{alert.detected_cell}</span>
// //                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
// //                     </div>
// //                   </div>
// //                 )}
// //                 <InfoRow
// //                   label="Status"
// //                   value={alert.status?.replace('_', ' ').toUpperCase()}
// //                   valueColor={alert.status === 'active' ? 'text-red-500' : 'text-emerald-500'}
// //                 />
// //               </div>
// //             </div>

// //             {/* Multi-camera tracking path */}
// //             {isMultiCamera && (
// //               <div className={theme.card.muted}>
// //                 <div className="flex items-center gap-2 mb-3">
// //                   <div className={theme.ui.iconBox}>
// //                     <Navigation className="w-4 h-4 text-[#c5a880]" />
// //                   </div>
// //                   <div>
// //                     <p className={theme.type.h4}>Multi-Camera Track</p>
// //                     <p className={theme.type.labelSm}>Person moved across {cameraPath.length} zones</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-1 flex-wrap">
// //                   {cameraPath.map((cam, i) => (
// //                     <div key={i} className="flex items-center gap-1">
// //                       <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
// //                         i === 0
// //                           ? 'bg-red-50 text-red-600 border-red-200'
// //                           : i === cameraPath.length - 1
// //                           ? 'bg-amber-50 text-amber-600 border-amber-200'
// //                           : 'bg-[#faf9f6] text-[#1c1c1c] border-[#e6e3db]'
// //                       }`}>
// //                         <Camera className="w-3 h-3" />
// //                         <span>{cam}</span>
// //                       </div>
// //                       {i < cameraPath.length - 1 && (
// //                         <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* ── Action buttons ── */}
// //             <div className="space-y-2.5">

// //               {/* {isCritical && alert.status === 'active' && (
// //                 <button
// //                   onClick={() => navigate(`/property/${id}/drone-control`)}
// //                   className={`${theme.button.danger} ${theme.button.full}`}
// //                 >
// //                   <Navigation className="w-4 h-4" /> Emergency Dispatch Drone
// //                 </button>
// //               )} */}

// //               <button
// //                 onClick={() => navigate(`/property/${id}/cameras`)}
// //                 className={`${theme.button.primary} ${theme.button.full}`}
// //               >
// //                 <Play className="w-4 h-4" /> View Live Cameras
// //               </button>

// //               {alert.status === 'active' && (
// //                 <div className="grid grid-cols-2 gap-2.5">
// //                   <button
// //                     onClick={() => {
// //                       if (confirm('Mark this alert as a false positive?')) {
// //                         falsePositiveMutation.mutate(alertId);
// //                         navigate(-1);
// //                       }
// //                     }}
// //                     disabled={falsePositiveMutation.isPending}
// //                     className={`${theme.button.secondary} text-red-500 border-red-200 hover:border-red-300 flex items-center justify-center gap-2`}
// //                   >
// //                     {falsePositiveMutation.isPending
// //                       ? <Loader2 className="w-4 h-4 animate-spin" />
// //                       : <XCircle className="w-4 h-4" />}
// //                     False +
// //                   </button>

// //                   <button
// //                     onClick={() => {
// //                       if (confirm('Mark this alert as resolved?')) {
// //                         resolveMutation.mutate(alertId);
// //                         navigate(-1);
// //                       }
// //                     }}
// //                     disabled={resolveMutation.isPending}
// //                     className={`${theme.button.secondary} text-emerald-600 border-emerald-200 hover:border-emerald-300 flex items-center justify-center gap-2`}
// //                   >
// //                     {resolveMutation.isPending
// //                       ? <Loader2 className="w-4 h-4 animate-spin" />
// //                       : <CheckCircle className="w-4 h-4" />}
// //                     Resolved
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const InfoRow = ({ label, value, valueColor }) => (
// //   <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] last:border-0">
// //     <span className={theme.type.labelSm}>{label}</span>
// //     <span className={`font-sans text-sm font-bold ${valueColor || 'text-[#1c1c1c]'}`}>
// //       {value}
// //     </span>
// //   </div>
// // );

// // export default AlertDetail;

// // src/pages/AlertDetail.jsx
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft, Play, Navigation, Shield, Clock, AlertTriangle,
//   Video, Image, Camera, ChevronRight, XCircle, CheckCircle,
//   MapPin, Loader2, RefreshCw,
// } from 'lucide-react';
// import {
//   useAlert, useResolveAlert, useMarkFalsePositive,
// } from '../hooks/useAlerts';
// import { API_BASE_URL } from '../config/api';
// import { useState, useRef } from 'react';
// import { theme } from '../theme';

// const AlertDetail = () => {
//   const { id, alertId } = useParams();
//   const navigate        = useNavigate();

//   const { data: alert, isLoading } = useAlert(alertId);
//   const resolveMutation            = useResolveAlert();
//   const falsePositiveMutation      = useMarkFalsePositive();

//   const [showVideo,  setShowVideo]  = useState(false);
//   const [videoError, setVideoError] = useState(false);
//   const videoRef = useRef(null);

//   const getFullUrl = (path) => {
//     if (!path) return null;
//     if (path.startsWith('http')) return path;
//     return `${API_BASE_URL}${path}`;
//   };

//   // ── Retry: clear error flag and call .load() so the browser
//   //    re-requests the same src without needing a full re-render
//   const handleVideoRetry = () => {
//     setVideoError(false);
//     // Small timeout lets React flush the state update before
//     // we call .load(), ensuring the <video> is back in the DOM
//     setTimeout(() => {
//       videoRef.current?.load();
//     }, 50);
//   };

//   if (isLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     );
//   }

//   if (!alert) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
//           <p className={`${theme.type.error} mb-3`}>Alert not found</p>
//           <button onClick={() => navigate(-1)} className={theme.type.link}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isCritical      = alert.severity === 'critical';
//   const isWeapon        = alert.type?.toLowerCase().includes('weapon');
//   const hasVideo        = !!alert.clip_url;
//   const hasImage        = !!alert.image_url;
//   const imageUrl        = getFullUrl(alert.image_url);
//   const videoUrl        = getFullUrl(alert.clip_url);
//   const hasDetectedCell = !!alert.detected_cell;

//   const isMultiCamera = alert.camera_name?.includes('→');
//   const cameraPath    = isMultiCamera
//     ? alert.camera_name.split('→').map(c => c.trim())
//     : [alert.camera_name];

//   const getSeverityBadge = () => {
//     switch (alert.severity) {
//       case 'critical':
//         return <span className={theme.badge.danger}>CRITICAL</span>;
//       case 'high':
//         return (
//           <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
//             HIGH
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
//             MEDIUM
//           </span>
//         );
//     }
//   };

//   return (
//     <div className={theme.page.wrapper}>

//       {/* ── Header ── */}
//       <div className={theme.header.wrapper}>
//         <div className="flex items-center gap-3">
//           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h2 className={theme.header.title}>
//               {isWeapon ? '🚨 ' : '⚠️ '}{alert.type}
//             </h2>
//             {isMultiCamera && (
//               <p className="font-sans text-[10px] font-bold text-[#c5a880] uppercase tracking-widest">
//                 📹 Tracked across {cameraPath.length} cameras
//               </p>
//             )}
//           </div>
//         </div>

//         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
//           alert.status === 'active'
//             ? 'bg-red-100 text-red-600'
//             : alert.status === 'resolved'
//             ? 'bg-emerald-100 text-emerald-600'
//             : 'bg-[#e6e3db] text-gray-500'
//         }`}>
//           {alert.status?.replace('_', ' ')}
//         </div>
//       </div>

//       {/* ── Main two-column layout ── */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

//           {/* ── LEFT: Media ── */}
//           <div className="space-y-4">

//             {/* Media toggle tabs */}
//             {hasVideo && hasImage && (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowVideo(false)}
//                   className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
//                     !showVideo
//                       ? 'bg-[#1c1c1c] text-white'
//                       : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
//                   }`}
//                 >
//                   <Image className="w-3.5 h-3.5" /> Snapshot
//                 </button>
//                 <button
//                   onClick={() => setShowVideo(true)}
//                   className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
//                     showVideo
//                       ? 'bg-[#1c1c1c] text-white'
//                       : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
//                   }`}
//                 >
//                   <Video className="w-3.5 h-3.5" />
//                   {isMultiCamera ? 'Merged Video' : 'Video Clip'}
//                 </button>
//               </div>
//             )}

//             {/* Media frame — 16:9 */}
//             <div className="relative w-full aspect-video bg-[#1c1c1c] rounded-[1.5rem] overflow-hidden shadow-md">

//               {/* ── Snapshot view ── */}
//               {!showVideo && hasImage && (
//                 <>
//                   <img
//                     src={imageUrl}
//                     alt="Detection snapshot"
//                     className="w-full h-full object-cover"
//                     onError={e => { e.target.style.display = 'none'; }}
//                   />
//                   {hasVideo && (
//                     <button
//                       onClick={() => setShowVideo(true)}
//                       className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition group"
//                     >
//                       <div className="w-12 h-12 bg-[#ffffff1a] group-hover:bg-[#ffffff30] backdrop-blur-sm rounded-full flex items-center justify-center">
//                         <Play className="w-6 h-6 text-white ml-0.5" />
//                       </div>
//                     </button>
//                   )}
//                 </>
//               )}

//               {/* ── Video player ── */}
//               {showVideo && hasVideo && !videoError && (
//                 <video
//                   ref={videoRef}
//                   controls
//                   autoPlay
//                   className="w-full h-full object-contain bg-black"
//                   onError={() => setVideoError(true)}
//                 >
//                   {/*
//                     Explicit <source> gives the browser a MIME hint so it
//                     doesn't reject the file before even trying to decode it.
//                     The outer src is kept as a fallback for older browsers.
//                   */}
//                   <source src={videoUrl} type="video/mp4" />
//                   Your browser does not support video playback.
//                 </video>
//               )}

//               {/* ── Video error / still processing ── */}
//               {showVideo && videoError && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
//                   <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center">
//                     <Video className="w-7 h-7 text-gray-400" />
//                   </div>

//                   <div>
//                     <p className="text-white font-bold text-sm">Clip still processing…</p>
//                     <p className="text-gray-400 text-xs mt-0.5">
//                       The video will be available shortly
//                     </p>
//                   </div>

//                   {/* Retry — reloads the same src without navigating away */}
//                   <button
//                     onClick={handleVideoRetry}
//                     className="flex items-center gap-1.5 px-4 py-2 bg-[#c5a880] hover:bg-[#b8966c] text-white text-xs font-bold rounded-full transition-colors"
//                   >
//                     <RefreshCw className="w-3.5 h-3.5" />
//                     Retry
//                   </button>

//                   <button
//                     onClick={() => { setVideoError(false); setShowVideo(false); }}
//                     className="text-gray-400 text-xs underline underline-offset-2 hover:text-gray-300 transition-colors"
//                   >
//                     View Snapshot Instead
//                   </button>
//                 </div>
//               )}

//               {/* ── No media at all ── */}
//               {!showVideo && !hasImage && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
//                   <Shield className="h-10 w-10 text-gray-400 mb-2" />
//                   <p className="text-gray-400 text-sm font-bold">No image captured</p>
//                 </div>
//               )}

//               {/* ── Overlay badges ── */}
//               <div className="absolute top-2.5 right-2.5 z-10">{getSeverityBadge()}</div>
//               <div className="absolute top-2.5 left-2.5 z-10">
//                 <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
//                   {alert.type}
//                 </span>
//               </div>
//               {hasDetectedCell && (
//                 <div className="absolute bottom-2.5 left-2.5 z-10">
//                   <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
//                     <MapPin className="w-3 h-3" /> Cell {alert.detected_cell}
//                   </span>
//                 </div>
//               )}
//               {isMultiCamera && (
//                 <div className="absolute bottom-2.5 right-2.5 z-10">
//                   <span className={theme.badge.live}>
//                     <Camera className="w-3 h-3" /> {cameraPath.length} Cameras
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Media footer */}
//             {hasVideo && (
//               <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                 <span className="flex items-center gap-1">
//                   <Video className="w-3 h-3" />
//                   {isMultiCamera
//                     ? `Merged clip — ${cameraPath.length} cameras`
//                     : 'Video clip available'}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Clock className="w-3 h-3" /> {alert.timestamp}
//                 </span>
//               </div>
//             )}

//             {/* Detected cell banner */}
//             {hasDetectedCell && (
//               <div className="bg-red-500/10 border border-red-200 rounded-[1.25rem] px-4 py-3 flex items-center gap-3">
//                 <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
//                     Breach Location
//                   </p>
//                   <p className="text-base font-bold text-[#1c1c1c]">
//                     Fence Cell — {alert.detected_cell}
//                   </p>
//                 </div>
//                 {isCritical && (
//                   <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── RIGHT: Info + Actions ── */}
//           <div className="space-y-4">

//             {/* Alert info card */}
//             <div className={theme.card.base}>
//               <div className="flex items-center gap-2 mb-4">
//                 <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
//                 <h3 className={theme.type.h3}>{alert.type}</h3>
//               </div>

//               <div className="space-y-0">
//                 <InfoRow
//                   label={isMultiCamera ? 'Camera Path' : 'Camera'}
//                   value={isMultiCamera ? cameraPath.join(' → ') : alert.camera_name}
//                 />
//                 <InfoRow label="Time"       value={alert.timestamp} />
//                 <InfoRow
//                   label="Confidence"
//                   value={`${alert.confidence}%`}
//                   valueColor={alert.confidence > 80 ? 'text-emerald-500' : 'text-amber-500'}
//                 />
//                 <InfoRow
//                   label="Camera Grid"
//                   value={`Row ${alert.camera_cell?.row ?? '—'}, Col ${alert.camera_cell?.col ?? '—'}`}
//                 />
//                 {hasDetectedCell && (
//                   <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] bg-red-50 -mx-4 px-4 rounded-xl">
//                     <div className="flex items-center gap-1.5">
//                       <MapPin className="w-4 h-4 text-red-500" />
//                       <span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">
//                         Breach Cell
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-sans text-sm font-bold text-red-500">
//                         {alert.detected_cell}
//                       </span>
//                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                     </div>
//                   </div>
//                 )}
//                 <InfoRow
//                   label="Status"
//                   value={alert.status?.replace('_', ' ').toUpperCase()}
//                   valueColor={alert.status === 'active' ? 'text-red-500' : 'text-emerald-500'}
//                 />
//               </div>
//             </div>

//             {/* Multi-camera tracking path */}
//             {isMultiCamera && (
//               <div className={theme.card.muted}>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className={theme.ui.iconBox}>
//                     <Navigation className="w-4 h-4 text-[#c5a880]" />
//                   </div>
//                   <div>
//                     <p className={theme.type.h4}>Multi-Camera Track</p>
//                     <p className={theme.type.labelSm}>
//                       Person moved across {cameraPath.length} zones
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1 flex-wrap">
//                   {cameraPath.map((cam, i) => (
//                     <div key={i} className="flex items-center gap-1">
//                       <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
//                         i === 0
//                           ? 'bg-red-50 text-red-600 border-red-200'
//                           : i === cameraPath.length - 1
//                           ? 'bg-amber-50 text-amber-600 border-amber-200'
//                           : 'bg-[#faf9f6] text-[#1c1c1c] border-[#e6e3db]'
//                       }`}>
//                         <Camera className="w-3 h-3" />
//                         <span>{cam}</span>
//                       </div>
//                       {i < cameraPath.length - 1 && (
//                         <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* ── Action buttons ── */}
//             <div className="space-y-2.5">

//               <button
//                 onClick={() => navigate(`/property/${id}/cameras`)}
//                 className={`${theme.button.primary} ${theme.button.full}`}
//               >
//                 <Play className="w-4 h-4" /> View Live Cameras
//               </button>

//               {alert.status === 'active' && (
//                 <div className="grid grid-cols-2 gap-2.5">
//                   <button
//                     onClick={() => {
//                       if (confirm('Mark this alert as a false positive?')) {
//                         falsePositiveMutation.mutate(alertId);
//                         navigate(-1);
//                       }
//                     }}
//                     disabled={falsePositiveMutation.isPending}
//                     className={`${theme.button.secondary} text-red-500 border-red-200 hover:border-red-300 flex items-center justify-center gap-2`}
//                   >
//                     {falsePositiveMutation.isPending
//                       ? <Loader2 className="w-4 h-4 animate-spin" />
//                       : <XCircle className="w-4 h-4" />}
//                     False +
//                   </button>

//                   <button
//                     onClick={() => {
//                       if (confirm('Mark this alert as resolved?')) {
//                         resolveMutation.mutate(alertId);
//                         navigate(-1);
//                       }
//                     }}
//                     disabled={resolveMutation.isPending}
//                     className={`${theme.button.secondary} text-emerald-600 border-emerald-200 hover:border-emerald-300 flex items-center justify-center gap-2`}
//                   >
//                     {resolveMutation.isPending
//                       ? <Loader2 className="w-4 h-4 animate-spin" />
//                       : <CheckCircle className="w-4 h-4" />}
//                     Resolved
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InfoRow = ({ label, value, valueColor }) => (
//   <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] last:border-0">
//     <span className={theme.type.labelSm}>{label}</span>
//     <span className={`font-sans text-sm font-bold ${valueColor || 'text-[#1c1c1c]'}`}>
//       {value}
//     </span>
//   </div>
// );

// export default AlertDetail;

import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Navigation, Shield, Clock, AlertTriangle,
  Video, Image, Camera, ChevronRight, XCircle, CheckCircle,
  MapPin, Loader2, RefreshCw,
} from 'lucide-react';
import {
  useAlert, useResolveAlert, useMarkFalsePositive,
} from '../hooks/useAlerts';
import { API_BASE_URL } from '../config/api';
import { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../theme';
import { useQueryClient } from '@tanstack/react-query';

const CLIP_POLL_INTERVAL = 8000;  // ms between polls
const CLIP_MAX_ATTEMPTS  = 6;     // stop after ~48 s

const AlertDetail = () => {
  const { id, alertId } = useParams();
  const navigate        = useNavigate();
  const queryClient     = useQueryClient();

  const { data: alert, isLoading } = useAlert(alertId);
  const resolveMutation            = useResolveAlert();
  const falsePositiveMutation      = useMarkFalsePositive();

  const [showVideo,  setShowVideo]  = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [clipUrl,    setClipUrl]    = useState(null);

  const videoRef     = useRef(null);
  const retryTimer   = useRef(null);
  const pollAttempts = useRef(0);

  // ── Sync clipUrl from server data ────────────────────────────────────
  useEffect(() => {
    if (alert?.clip_url && !clipUrl) {
      setClipUrl(alert.clip_url);
    }
  }, [alert?.clip_url, clipUrl]);

  // ── Poll for clip URL every 8 s (max 6 attempts) ─────────────────────
  const startPolling = useCallback(() => {
    if (retryTimer.current) return;
    pollAttempts.current = 0;

    retryTimer.current = setInterval(async () => {
      pollAttempts.current += 1;
      try {
        const res = await fetch(`${API_BASE_URL}/api/alerts/${alertId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.clip_url) {
            setClipUrl(data.clip_url);
            setVideoError(false);
            queryClient.setQueryData(
              ['alert', String(alertId)],
              (old) => old ? { ...old, clip_url: data.clip_url } : old,
            );
            clearInterval(retryTimer.current);
            retryTimer.current = null;
          }
        }
      } catch (_) { /* silent */ }

      if (pollAttempts.current >= CLIP_MAX_ATTEMPTS) {
        clearInterval(retryTimer.current);
        retryTimer.current = null;
      }
    }, CLIP_POLL_INTERVAL);
  }, [alertId, queryClient]);

  // ── Start polling when video tab is open and clip not yet ready ───────
  useEffect(() => {
    if (showVideo && !clipUrl) {
      startPolling();
    }
    if (!showVideo) {
      clearInterval(retryTimer.current);
      retryTimer.current = null;
    }
  }, [showVideo, clipUrl, startPolling]);

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => clearInterval(retryTimer.current);
  }, []);

  // ── Listen for alert_updated WebSocket event ──────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === 'alert_updated' &&
          String(data.alert_number) === String(alertId) &&
          data.clip_url
        ) {
          setClipUrl(data.clip_url);
          setVideoError(false);
          queryClient.setQueryData(
            ['alert', String(alertId)],
            (old) => old ? { ...old, clip_url: data.clip_url } : old,
          );
          clearInterval(retryTimer.current);
          retryTimer.current = null;
        }
      } catch (_) { /* ignore */ }
    };

    window.__alertWs?.addEventListener('message', handleMessage);
    return () => window.__alertWs?.removeEventListener('message', handleMessage);
  }, [alertId, queryClient]);

  // ── Manual retry ──────────────────────────────────────────────────────
  const handleVideoRetry = () => {
    setVideoError(false);
    if (clipUrl) {
      setTimeout(() => videoRef.current?.load(), 50);
    } else {
      startPolling();
    }
  };

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  // ── Loading / not found ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Alert not found</p>
          <button onClick={() => navigate(-1)} className={theme.type.link}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCritical      = alert.severity === 'critical';
  const isWeapon        = alert.type?.toLowerCase().includes('weapon');
  const hasVideo        = !!clipUrl;
  const hasImage        = !!alert.image_url;
  const imageUrl        = getFullUrl(alert.image_url);
  const videoUrl        = getFullUrl(clipUrl);
  const hasDetectedCell = !!alert.detected_cell;
  const clipExpected    = !!alert.clip_url || hasVideo;

  const isMultiCamera = alert.camera_name?.includes('→');
  const cameraPath    = isMultiCamera
    ? alert.camera_name.split('→').map(c => c.trim())
    : [alert.camera_name];

  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'critical':
        return <span className={theme.badge.danger}>CRITICAL</span>;
      case 'high':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
            HIGH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
            MEDIUM
          </span>
        );
    }
  };

  return (
    <div className={theme.page.wrapper}>

      {/* ── Header ── */}
      <div className={theme.header.wrapper}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className={theme.header.title}>
              {isWeapon ? '🚨 ' : '⚠️ '}{alert.type}
            </h2>
            {isMultiCamera && (
              <p className="font-sans text-[10px] font-bold text-[#c5a880] uppercase tracking-widest">
                📹 Tracked across {cameraPath.length} cameras
              </p>
            )}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          alert.status === 'active'
            ? 'bg-red-100 text-red-600'
            : alert.status === 'resolved'
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-[#e6e3db] text-gray-500'
        }`}>
          {alert.status?.replace('_', ' ')}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT: Media ── */}
          <div className="space-y-4">

            {/* Tab bar — show if image exists AND a clip is expected or ready */}
            {hasImage && clipExpected && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVideo(false)}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    !showVideo
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
                  }`}
                >
                  <Image className="w-3.5 h-3.5" /> Snapshot
                </button>
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    showVideo
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-[#f0ede8] border border-[#e6e3db] text-gray-500 hover:border-[#c5a880]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  {isMultiCamera ? 'Merged Video' : 'Video Clip'}
                  {/* spinner while clip is still being recorded */}
                  {!hasVideo && (
                    <Loader2 className="w-3 h-3 animate-spin ml-1 text-[#c5a880]" />
                  )}
                </button>
              </div>
            )}

            {/* 16:9 media frame */}
            <div className="relative w-full aspect-video bg-[#1c1c1c] rounded-[1.5rem] overflow-hidden shadow-md">

              {/* Snapshot */}
              {!showVideo && hasImage && (
                <>
                  <img
                    src={imageUrl}
                    alt="Detection snapshot"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {clipExpected && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition group"
                    >
                      <div className="w-12 h-12 bg-[#ffffff1a] group-hover:bg-[#ffffff30] backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      </div>
                    </button>
                  )}
                </>
              )}

              {/* Video player — clip is ready */}
              {showVideo && hasVideo && !videoError && (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                  onError={() => setVideoError(true)}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              )}

              {/* Clip still recording (no URL yet) */}
              {showVideo && !hasVideo && !videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-[#c5a880] animate-spin" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Clip recording…
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Usually ready in 5–15 seconds
                    </p>
                  </div>
                  <button
                    onClick={handleVideoRetry}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#c5a880] hover:bg-[#b8966c] text-white text-xs font-bold rounded-full transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Check Now
                  </button>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="text-gray-400 text-xs underline underline-offset-2 hover:text-gray-300"
                  >
                    View Snapshot Instead
                  </button>
                </div>
              )}

              {/* Clip URL exists but browser failed to load it */}
              {showVideo && hasVideo && videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center">
                    <Video className="w-7 h-7 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Could not load video
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      The file may still be finalising
                    </p>
                  </div>
                  <button
                    onClick={handleVideoRetry}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#c5a880] hover:bg-[#b8966c] text-white text-xs font-bold rounded-full transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                  <button
                    onClick={() => { setVideoError(false); setShowVideo(false); }}
                    className="text-gray-400 text-xs underline underline-offset-2 hover:text-gray-300"
                  >
                    View Snapshot Instead
                  </button>
                </div>
              )}

              {/* No media */}
              {!showVideo && !hasImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <Shield className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm font-bold">
                    No image captured
                  </p>
                </div>
              )}

              {/* Overlay badges */}
              <div className="absolute top-2.5 right-2.5 z-10">
                {getSeverityBadge()}
              </div>
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center px-2.5 py-1 bg-[#1c1c1c] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">
                  {alert.type}
                </span>
              </div>
              {hasDetectedCell && (
                <div className="absolute bottom-2.5 left-2.5 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> Cell {alert.detected_cell}
                  </span>
                </div>
              )}
              {isMultiCamera && (
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <span className={theme.badge.live}>
                    <Camera className="w-3 h-3" /> {cameraPath.length} Cameras
                  </span>
                </div>
              )}
            </div>

            {/* Media footer */}
            <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {hasVideo
                  ? (isMultiCamera
                    ? `Merged clip — ${cameraPath.length} cameras`
                    : 'Video clip available')
                  : 'Clip processing…'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {alert.timestamp}
              </span>
            </div>

            {/* Detected cell banner */}
            {hasDetectedCell && (
              <div className="bg-red-500/10 border border-red-200 rounded-[1.25rem] px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    Breach Location
                  </p>
                  <p className="text-base font-bold text-[#1c1c1c]">
                    Fence Cell — {alert.detected_cell}
                  </p>
                </div>
                {isCritical && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info + Actions ── */}
          <div className="space-y-4">

            {/* Alert info */}
            <div className={theme.card.base}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                <h3 className={theme.type.h3}>{alert.type}</h3>
              </div>

              <div className="space-y-0">
                <InfoRow
                  label={isMultiCamera ? 'Camera Path' : 'Camera'}
                  value={isMultiCamera ? cameraPath.join(' → ') : alert.camera_name}
                />
                <InfoRow label="Time" value={alert.timestamp} />
                <InfoRow
                  label="Confidence"
                  value={`${alert.confidence}%`}
                  valueColor={
                    alert.confidence > 80 ? 'text-emerald-500' : 'text-amber-500'
                  }
                />
                <InfoRow
                  label="Camera Grid"
                  value={`Row ${alert.camera_cell?.row ?? '—'}, Col ${alert.camera_cell?.col ?? '—'}`}
                />
                {hasDetectedCell && (
                  <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] bg-red-50 -mx-4 px-4 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Breach Cell
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-bold text-red-500">
                        {alert.detected_cell}
                      </span>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
                <InfoRow
                  label="Clip Status"
                  value={hasVideo ? '✅ Ready' : '⏳ Processing…'}
                  valueColor={hasVideo ? 'text-emerald-500' : 'text-amber-500'}
                />
                <InfoRow
                  label="Status"
                  value={alert.status?.replace('_', ' ').toUpperCase()}
                  valueColor={
                    alert.status === 'active' ? 'text-red-500' : 'text-emerald-500'
                  }
                />
              </div>
            </div>

            {/* Multi-camera path */}
            {isMultiCamera && (
              <div className={theme.card.muted}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={theme.ui.iconBox}>
                    <Navigation className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <div>
                    <p className={theme.type.h4}>Multi-Camera Track</p>
                    <p className={theme.type.labelSm}>
                      Person moved across {cameraPath.length} zones
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {cameraPath.map((cam, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        i === 0
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : i === cameraPath.length - 1
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-[#faf9f6] text-[#1c1c1c] border-[#e6e3db]'
                      }`}>
                        <Camera className="w-3 h-3" />
                        <span>{cam}</span>
                      </div>
                      {i < cameraPath.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => navigate(`/property/${id}/cameras`)}
                className={`${theme.button.primary} ${theme.button.full}`}
              >
                <Play className="w-4 h-4" /> View Live Cameras
              </button>

              {alert.status === 'active' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      if (confirm('Mark this alert as a false positive?')) {
                        falsePositiveMutation.mutate(alertId);
                        navigate(-1);
                      }
                    }}
                    disabled={falsePositiveMutation.isPending}
                    className={`${theme.button.secondary} text-red-500 border-red-200 hover:border-red-300 flex items-center justify-center gap-2`}
                  >
                    {falsePositiveMutation.isPending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <XCircle className="w-4 h-4" />}
                    False +
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Mark this alert as resolved?')) {
                        resolveMutation.mutate(alertId);
                        navigate(-1);
                      }
                    }}
                    disabled={resolveMutation.isPending}
                    className={`${theme.button.secondary} text-emerald-600 border-emerald-200 hover:border-emerald-300 flex items-center justify-center gap-2`}
                  >
                    {resolveMutation.isPending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <CheckCircle className="w-4 h-4" />}
                    Resolved
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, valueColor }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#e6e3db] last:border-0">
    <span className={theme.type.labelSm}>{label}</span>
    <span className={`font-sans text-sm font-bold ${valueColor || 'text-[#1c1c1c]'}`}>
      {value}
    </span>
  </div>
);

export default AlertDetail;