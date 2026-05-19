// // // // // // // // // // src/pages/PropertyDashboard.jsx
// // // // // // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // // // // // import {
// // // // // // // // //   AlertTriangle, Play, Video, Navigation,
// // // // // // // // //   Users, Grid3X3, Loader2, RefreshCw,
// // // // // // // // // } from 'lucide-react';
// // // // // // // // // import { useProperty } from '../hooks/useProperties';
// // // // // // // // // import { useCameras } from '../hooks/useCameras';
// // // // // // // // // import { useAlerts } from '../hooks/useAlerts';
// // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // import HamburgerMenu from '../components/HamburgerMenu';
// // // // // // // // // import CameraFeed from '../components/CameraFeed';
// // // // // // // // // import { theme } from '../theme';

// // // // // // // // // const PropertyDashboard = () => {
// // // // // // // // //   const { id } = useParams();
// // // // // // // // //   const navigate = useNavigate();

// // // // // // // // //   const {
// // // // // // // // //     data: propertyData, isLoading: propertyLoading,
// // // // // // // // //     error: propertyError, refetch: refetchProperty,
// // // // // // // // //   } = useProperty(id);
// // // // // // // // //   const { data: cameras = [], isLoading: camerasLoading, refetch: refetchCameras } = useCameras(id);
// // // // // // // // //   const { data: alertsData = [] } = useAlerts(id);
// // // // // // // // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const interval = setInterval(() => refetchCameras(), 10000);
// // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // //   }, [refetchCameras]);

// // // // // // // // //   const handleRefresh = async () => {
// // // // // // // // //     setIsRefreshing(true);
// // // // // // // // //     await Promise.all([refetchProperty(), refetchCameras()]);
// // // // // // // // //     setTimeout(() => setIsRefreshing(false), 500);
// // // // // // // // //   };

// // // // // // // // //   // ── Loading ───────────────────────────────
// // // // // // // // //   if (propertyLoading || camerasLoading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   // ── Error ─────────────────────────────────
// // // // // // // // //   if (propertyError || !propertyData) {
// // // // // // // // //     return (
// // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// // // // // // // // //           <p className={`${theme.type.error} mb-3`}>Failed to load property</p>
// // // // // // // // //           <button onClick={() => navigate('/properties')} className={theme.type.link}>
// // // // // // // // //             Back to Properties
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   // ── Data ──────────────────────────────────
// // // // // // // // //   const property       = propertyData?.property || propertyData || {};
// // // // // // // // //   const camerasList    = cameras || property.cameras || [];
// // // // // // // // //   const onlineCameras  = camerasList.filter(c => c.is_online).length;

// // // // // // // // //   const activeAlertCount =
// // // // // // // // //     property.active_alerts ||
// // // // // // // // //     property.new_alerts_count ||
// // // // // // // // //     (Array.isArray(alertsData)
// // // // // // // // //       ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
// // // // // // // // //       : 0) || 0;
// // // // // // // // //   const totalAlertCount = Array.isArray(alertsData) ? alertsData.length : 0;
// // // // // // // // //   const hasActiveAlert  = activeAlertCount > 0;

// // // // // // // // //   const droneStatus = property.drone_status || 'None';
// // // // // // // // //   const droneCount  = property.drones_total || property.drones?.length || 0;
// // // // // // // // //   const peopleCount = property.people?.length || property.authorized_people_count || 0;

// // // // // // // // //   const laserGrid  = property.laser_grid || {};
// // // // // // // // //   const laserX     = laserGrid.x_lasers ?? property.x_lasers ?? 3;
// // // // // // // // //   const laserY     = laserGrid.y_lasers ?? property.y_lasers ?? 8;
// // // // // // // // //   const boxWidth   = laserGrid.box_width ?? property.box_width ?? 2.0;
// // // // // // // // //   const boxLength  = laserGrid.box_length ?? property.box_length ?? 0.6;

// // // // // // // // //   const verticalLines   = Array.from({ length: laserX }, (_, i) => i);
// // // // // // // // //   const horizontalLines = Array.from({ length: laserY }, (_, i) => i);

// // // // // // // // //   return (
// // // // // // // // //     <div className={theme.page.wrapper}>

// // // // // // // // //       {/* ── Header ── */}
// // // // // // // // //       <div className="bg-white border-b border-[#e6e3db] px-5 py-4
// // // // // // // // //                       flex justify-between items-center shadow-sm">
// // // // // // // // //         <div className="min-w-0 pr-4">
// // // // // // // // //           <h2 className={`${theme.type.h2} truncate`}>{property.name}</h2>
// // // // // // // // //           <p className={`${theme.type.labelSm} truncate mt-0.5`}>
// // // // // // // // //             {property.address || 'No address'}
// // // // // // // // //           </p>
// // // // // // // // //         </div>
// // // // // // // // //         <div className="flex items-center gap-2">
// // // // // // // // //           <button
// // // // // // // // //             onClick={handleRefresh}
// // // // // // // // //             className={`${theme.ui.refreshBtn} ${isRefreshing ? 'animate-spin' : ''}`}
// // // // // // // // //           >
// // // // // // // // //             <RefreshCw className="w-5 h-5" />
// // // // // // // // //           </button>
          
// // // // // // // // //           <HamburgerMenu propertyId={id} />
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //       {/* ── Alert banner ── */}
// // // // // // // // //       {hasActiveAlert && (
// // // // // // // // //         <div
// // // // // // // // //           onClick={() => navigate(`/property/${id}/alerts`)}
// // // // // // // // //           className="mx-5 mt-4 bg-red-500 text-white px-5 py-3 rounded-full
// // // // // // // // //                      flex items-center gap-3 cursor-pointer animate-pulse
// // // // // // // // //                      shadow-[0_4px_14px_rgba(239,68,68,0.30)] hover:bg-red-600 transition-all"
// // // // // // // // //         >
// // // // // // // // //           <AlertTriangle className="h-5 w-5 flex-shrink-0" />
// // // // // // // // //           <span className="font-sans text-sm font-bold">
// // // // // // // // //             {activeAlertCount} Active Alert{activeAlertCount > 1 ? 's' : ''} — Tap to view
// // // // // // // // //           </span>
// // // // // // // // //         </div>
// // // // // // // // //       )}

// // // // // // // // //       {/* ── Stats grid ── */}
// // // // // // // // //       <div className="grid grid-cols-3 gap-3 px-5 mt-4">

// // // // // // // // //         {/* Drones */}
// // // // // // // // //         <div
// // // // // // // // //           onClick={() => navigate(`/property/${id}/drones`)}
// // // // // // // // //           className={theme.stat.interactive}
// // // // // // // // //         >
// // // // // // // // //           <p className={theme.stat.label}>Drones</p>
// // // // // // // // //           <p className={`${theme.stat.value} text-base ${
// // // // // // // // //             droneStatus === 'Active' || droneStatus === 'Flying'
// // // // // // // // //               ? 'text-emerald-500'
// // // // // // // // //               : droneStatus === 'Docked'
// // // // // // // // //               ? 'text-amber-500'
// // // // // // // // //               : 'text-gray-400'
// // // // // // // // //           }`}>
// // // // // // // // //             {droneStatus}
// // // // // // // // //           </p>
// // // // // // // // //           <p className={theme.stat.sub}>
// // // // // // // // //             {droneCount > 0 ? `${droneCount} total` : ''}
// // // // // // // // //           </p>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Cameras */}
// // // // // // // // //         <div
// // // // // // // // //           onClick={() => navigate(`/property/${id}/cameras`)}
// // // // // // // // //           className={theme.stat.interactive}
// // // // // // // // //         >
// // // // // // // // //           <p className={theme.stat.label}>Cameras</p>
// // // // // // // // //           <p className={`${theme.stat.value} text-base ${
// // // // // // // // //             camerasList.length > 0 ? 'text-emerald-500' : 'text-gray-400'
// // // // // // // // //           }`}>
// // // // // // // // //             {camerasList.length > 0
// // // // // // // // //               ? `${onlineCameras}/${camerasList.length}`
// // // // // // // // //               : 'None'}
// // // // // // // // //           </p>
// // // // // // // // //           <p className={theme.stat.sub}>
// // // // // // // // //             {camerasList.length > 0
// // // // // // // // //               ? `${Math.round((onlineCameras / camerasList.length) * 100)}% online`
// // // // // // // // //               : 'Add cameras'}
// // // // // // // // //           </p>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Alerts */}
// // // // // // // // //         <div
// // // // // // // // //           onClick={() => navigate(`/property/${id}/alerts`)}
// // // // // // // // //           className={theme.stat.interactive}
// // // // // // // // //         >
// // // // // // // // //           <p className={theme.stat.label}>Alerts</p>
// // // // // // // // //           <p className={`${theme.stat.value} text-base ${
// // // // // // // // //             activeAlertCount > 0 ? 'text-red-500' : 'text-gray-400'
// // // // // // // // //           }`}>
// // // // // // // // //             {activeAlertCount} New
// // // // // // // // //           </p>
// // // // // // // // //           <p className={theme.stat.sub}>
// // // // // // // // //             {totalAlertCount > 0 ? `${totalAlertCount} total` : 'No alerts'}
// // // // // // // // //           </p>
// // // // // // // // //         </div>

// // // // // // // // //       </div>

// // // // // // // // //       {/* ── Laser grid ── */}
// // // // // // // // //       <div className="px-5 mt-5">
// // // // // // // // //         <div className="flex justify-between items-center mb-3">
// // // // // // // // //           <h3 className="font-sans text-lg font-black tracking-tight
// // // // // // // // //                          text-[#1c1c1c] flex items-center gap-2">
// // // // // // // // //             <Grid3X3 className="w-5 h-5 text-[#c5a880]" />
// // // // // // // // //             Laser Grid
// // // // // // // // //           </h3>
// // // // // // // // //           <span className={theme.type.labelSm}>
// // // // // // // // //             {laserX}×{laserY} lasers
// // // // // // // // //           </span>
// // // // // // // // //         </div>

// // // // // // // // //         <div
// // // // // // // // //           onClick={() => navigate(`/property/${id}/grid`)}
// // // // // // // // //           className={theme.card.interactive}
// // // // // // // // //         >
// // // // // // // // //           <div className="relative mx-auto" style={{ width: '200px', height: '160px' }}>
// // // // // // // // //             <div
// // // // // // // // //               className="relative w-full h-full bg-[#faf9f6] rounded-[1rem]
// // // // // // // // //                           border border-[#e6e3db] overflow-hidden"
// // // // // // // // //               style={{
// // // // // // // // //                 aspectRatio: `${(laserX - 1) * boxWidth}/${(laserY - 1) * boxLength}`,
// // // // // // // // //               }}
// // // // // // // // //             >
// // // // // // // // //               <div className="absolute inset-2">
// // // // // // // // //                 {verticalLines.map((i) => (
// // // // // // // // //                   <div
// // // // // // // // //                     key={`v-${i}`}
// // // // // // // // //                     className="absolute top-0 bottom-0 w-0.5 bg-red-500/70
// // // // // // // // //                                shadow-[0_0_4px_rgba(239,68,68,0.5)]"
// // // // // // // // //                     style={{ left: `${(i / Math.max(1, laserX - 1)) * 100}%` }}
// // // // // // // // //                   >
// // // // // // // // //                     <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5
// // // // // // // // //                                     bg-red-500 rounded-full" />
// // // // // // // // //                     <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5
// // // // // // // // //                                     bg-red-500 rounded-full" />
// // // // // // // // //                   </div>
// // // // // // // // //                 ))}

// // // // // // // // //                 {horizontalLines.map((i) => (
// // // // // // // // //                   <div
// // // // // // // // //                     key={`h-${i}`}
// // // // // // // // //                     className="absolute left-0 right-0 h-0.5 bg-emerald-500/70
// // // // // // // // //                                shadow-[0_0_4px_rgba(34,197,94,0.5)]"
// // // // // // // // //                     style={{ top: `${(i / Math.max(1, laserY - 1)) * 100}%` }}
// // // // // // // // //                   >
// // // // // // // // //                     <div className="absolute -left-0.5 -top-0.5 w-1.5 h-1.5
// // // // // // // // //                                     bg-emerald-500 rounded-full" />
// // // // // // // // //                     <div className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5
// // // // // // // // //                                     bg-emerald-500 rounded-full" />
// // // // // // // // //                   </div>
// // // // // // // // //                 ))}

// // // // // // // // //                 {camerasList.map((cam) => {
// // // // // // // // //                   const col    = cam.grid_cell?.col ?? 0;
// // // // // // // // //                   const row    = cam.grid_cell?.row ?? 0;
// // // // // // // // //                   const maxCol = Math.max(0, laserX - 1);
// // // // // // // // //                   const maxRow = Math.max(0, laserY - 1);
// // // // // // // // //                   const sCol   = Math.min(Math.max(col, 0), maxCol);
// // // // // // // // //                   const sRow   = Math.min(Math.max(row, 0), maxRow);
// // // // // // // // //                   return (
// // // // // // // // //                     <div
// // // // // // // // //                       key={cam.id}
// // // // // // // // //                       className={`absolute w-3 h-3 rounded-full border-2
// // // // // // // // //                                   border-white shadow-lg z-10
// // // // // // // // //                                   hover:scale-125 transition-transform
// // // // // // // // //                                   ${cam.is_online ? 'bg-[#c5a880]' : 'bg-red-500'}`}
// // // // // // // // //                       style={{
// // // // // // // // //                         left: `${maxCol > 0 ? (sCol / maxCol) * 100 : 50}%`,
// // // // // // // // //                         top:  `${maxRow > 0 ? (sRow / maxRow) * 100 : 50}%`,
// // // // // // // // //                         transform: 'translate(-50%, -50%)',
// // // // // // // // //                       }}
// // // // // // // // //                       title={`${cam.name} (${cam.is_online ? 'Online' : 'Offline'})`}
// // // // // // // // //                     />
// // // // // // // // //                   );
// // // // // // // // //                 })}
// // // // // // // // //               </div>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Legend */}
// // // // // // // // //           <div className="flex justify-center gap-4 mt-3">
// // // // // // // // //             {[
// // // // // // // // //               { color: 'bg-red-500',      label: `X (${laserX})` },
// // // // // // // // //               { color: 'bg-emerald-500',  label: `Y (${laserY})` },
// // // // // // // // //               { color: 'bg-[#c5a880]',    label: `Cam (${camerasList.length})` },
// // // // // // // // //             ].map(({ color, label }) => (
// // // // // // // // //               <div key={label} className="flex items-center gap-1.5">
// // // // // // // // //                 <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
// // // // // // // // //                 <span className={theme.type.labelSm}>{label}</span>
// // // // // // // // //               </div>
// // // // // // // // //             ))}
// // // // // // // // //           </div>

// // // // // // // // //           <p className={`${theme.type.labelSm} text-center mt-2`}>
// // // // // // // // //             Tap to expand grid view
// // // // // // // // //           </p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //       {/* ── Live feeds ── */}
// // // // // // // // //       <div className="px-5 mt-6">
// // // // // // // // //         <div className="flex justify-between items-center mb-3">
// // // // // // // // //           <h3 className="font-sans text-lg font-black tracking-tight
// // // // // // // // //                          text-[#1c1c1c] flex items-center gap-2">
// // // // // // // // //             <span className="relative flex h-2 w-2">
// // // // // // // // //               <span className="animate-ping absolute inline-flex h-2 w-2
// // // // // // // // //                                rounded-full bg-red-400 opacity-75" />
// // // // // // // // //               <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
// // // // // // // // //             </span>
// // // // // // // // //             Live Feeds ({onlineCameras}/{camerasList.length})
// // // // // // // // //           </h3>
// // // // // // // // //           <button
// // // // // // // // //             onClick={() => navigate(`/property/${id}/cameras`)}
// // // // // // // // //             className="font-sans text-xs font-bold uppercase tracking-widest
// // // // // // // // //                        text-[#c5a880] hover:text-[#1c1c1c] transition-colors
// // // // // // // // //                        flex items-center gap-1"
// // // // // // // // //           >
// // // // // // // // //             Manage <Play className="w-3 h-3" />
// // // // // // // // //           </button>
// // // // // // // // //         </div>

// // // // // // // // //         {camerasList.length === 0 ? (
// // // // // // // // //           <div className={`${theme.card.base} text-center`}>
// // // // // // // // //             <Video className="h-12 w-12 mx-auto mb-3 text-gray-300" />
// // // // // // // // //             <p className={`${theme.type.bodySm} mb-1`}>No cameras added</p>
// // // // // // // // //             <p className={theme.type.labelSm}>
// // // // // // // // //               Add cameras to monitor your property
// // // // // // // // //             </p>
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // //               className={`${theme.button.dark} ${theme.button.sm} mt-4 mx-auto`}
// // // // // // // // //             >
// // // // // // // // //               Add Camera
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //         ) : (
// // // // // // // // //           <div className="grid grid-cols-2 gap-3">
// // // // // // // // //             {camerasList.map((camera) => (
// // // // // // // // //               <CameraFeed
// // // // // // // // //                 key={camera.id}
// // // // // // // // //                 camera={camera}
// // // // // // // // //                 onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // // // // // // // //               />
// // // // // // // // //             ))}
// // // // // // // // //           </div>
// // // // // // // // //         )}
// // // // // // // // //       </div>

// // // // // // // // //       {/* ── Quick actions ── */}
// // // // // // // // //       <div className="px-5 mt-6 pb-8">
// // // // // // // // //         <div className="grid grid-cols-2 gap-3">
// // // // // // // // //           <button
// // // // // // // // //             onClick={() => navigate(`/property/${id}/drone-control`)}
// // // // // // // // //             disabled={droneCount === 0}
// // // // // // // // //             className={theme.button.dark}
// // // // // // // // //           >
// // // // // // // // //             <Navigation className="w-4 h-4" />
// // // // // // // // //             Launch Drone
// // // // // // // // //           </button>
// // // // // // // // //           <button
// // // // // // // // //             onClick={() => navigate(`/property/${id}/people`)}
// // // // // // // // //             className={theme.button.secondary}
// // // // // // // // //           >
// // // // // // // // //             <Users className="w-4 h-4" />
// // // // // // // // //             People ({peopleCount})
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default PropertyDashboard;


// // // // // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // // // // import {
// // // // // // // //   AlertTriangle, Play, Video, Navigation,
// // // // // // // //   Users, Grid3X3, Loader2, RefreshCw,
// // // // // // // //   LayoutDashboard, Shield, Settings, Bell
// // // // // // // // } from 'lucide-react';
// // // // // // // // import { useProperty } from '../hooks/useProperties';
// // // // // // // // import { useCameras } from '../hooks/useCameras';
// // // // // // // // import { useAlerts } from '../hooks/useAlerts';
// // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // import CameraFeed from '../components/CameraFeed';
// // // // // // // // import { theme } from '../theme';

// // // // // // // // const PropertyDashboard = () => {
// // // // // // // //   const { id } = useParams();
// // // // // // // //   const navigate = useNavigate();
// // // // // // // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // // // // // // //   const { data: propertyData, isLoading: propertyLoading, refetch: refetchProperty } = useProperty(id);
// // // // // // // //   const { data: cameras = [], isLoading: camerasLoading, refetch: refetchCameras } = useCameras(id);
// // // // // // // //   const { data: alertsData = [] } = useAlerts(id);

// // // // // // // //   // Stats Logic (reused from your code)
// // // // // // // //   const property = propertyData?.property || propertyData || {};
// // // // // // // //   const camerasList = cameras || property.cameras || [];
// // // // // // // //   const onlineCameras = camerasList.filter(c => c.is_online).length;
// // // // // // // //   const activeAlertCount = Array.isArray(alertsData) ? alertsData.filter(a => a.status === 'active' && !a.is_read).length : 0;

// // // // // // // //   return (
// // // // // // // //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      
// // // // // // // //       {/* ── LEFT SIDEBAR (Desktop Only) ── */}
// // // // // // // //       <aside className="w-64 bg-[#1c1c1c] text-white flex flex-col">
// // // // // // // //         <div className="p-6">
// // // // // // // //           <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
// // // // // // // //             <Shield className="text-[#c5a880]" /> VIGIL OS
// // // // // // // //           </h1>
// // // // // // // //         </div>
        
// // // // // // // //         <nav className="flex-1 px-4 space-y-2 mt-4">
// // // // // // // //           <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
// // // // // // // //           <NavItem icon={<Video size={20}/>} label="Cameras" onClick={() => navigate(`/property/${id}/cameras`)} />
// // // // // // // //           <NavItem icon={<Bell size={20}/>} label="Alerts" count={activeAlertCount} onClick={() => navigate(`/property/${id}/alerts`)} />
// // // // // // // //           <NavItem icon={<Users size={20}/>} label="Personnel" onClick={() => navigate(`/property/${id}/people`)} />
// // // // // // // //           <NavItem icon={<Settings size={20}/>} label="Settings" />
// // // // // // // //         </nav>

// // // // // // // //         <div className="p-4 border-t border-white/10">
// // // // // // // //           <div className="bg-white/5 rounded-xl p-3">
// // // // // // // //             <p className="text-[10px] uppercase font-bold text-gray-500">System Status</p>
// // // // // // // //             <p className="text-xs font-bold text-emerald-500">All Systems Nominal</p>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </aside>

// // // // // // // //       {/* ── MAIN CONTENT AREA ── */}
// // // // // // // //       <main className="flex-1 flex flex-col overflow-hidden">
        
// // // // // // // //         {/* Top Header */}
// // // // // // // //         <header className="h-20 bg-white border-b border-[#e6e3db] flex items-center justify-between px-8 shrink-0">
// // // // // // // //           <div>
// // // // // // // //             <h2 className="text-2xl font-black text-[#1c1c1c]">{property.name}</h2>
// // // // // // // //             <p className="text-sm text-gray-400">{property.address}</p>
// // // // // // // //           </div>
          
// // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // //             <button onClick={() => refetchCameras()} className={theme.ui.refreshBtn}>
// // // // // // // //               <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
// // // // // // // //             </button>
// // // // // // // //             <div className="h-10 w-[1px] bg-gray-200 mx-2" />
// // // // // // // //             <button className={`${theme.button.dark} flex items-center gap-2`}>
// // // // // // // //               <Navigation size={16} /> Launch Drone
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //         </header>

// // // // // // // //         {/* Scrollable Workspace */}
// // // // // // // //         <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
// // // // // // // //           {/* STATS STRIP */}
// // // // // // // //           <section className="grid grid-cols-4 gap-6">
// // // // // // // //             <StatCard label="Live Cameras" value={`${onlineCameras}/${camerasList.length}`} sub={`${Math.round((onlineCameras/camerasList.length)*100)}% online`} color="text-emerald-500" />
// // // // // // // //             <StatCard label="Active Alerts" value={activeAlertCount} sub="Priority response required" color={activeAlertCount > 0 ? "text-red-500" : "text-gray-400"} />
// // // // // // // //             <StatCard label="Drones" value={property.drone_status || 'Docked'} sub={`${property.drones_total || 0} units online`} color="text-[#c5a880]" />
// // // // // // // //             <StatCard label="Personnel" value={property.authorized_people_count || 0} sub="Authorized on site" color="text-blue-500" />
// // // // // // // //           </section>

// // // // // // // //           {/* MAIN GRID: Video Feeds & System Sidebar */}
// // // // // // // //           <div className="grid grid-cols-12 gap-8">
            
// // // // // // // //             {/* Live Feeds (Left 8/12 columns) */}
// // // // // // // //             <section className="col-span-8">
// // // // // // // //               <div className="flex items-center justify-between mb-6">
// // // // // // // //                 <h3 className="text-lg font-black flex items-center gap-2">
// // // // // // // //                   <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
// // // // // // // //                   COMMAND CENTER FEED
// // // // // // // //                 </h3>
// // // // // // // //                 <button className="text-xs font-bold text-[#c5a880] uppercase tracking-widest hover:underline">
// // // // // // // //                   Expanded View
// // // // // // // //                 </button>
// // // // // // // //               </div>

// // // // // // // //               <div className="grid grid-cols-2 gap-4">
// // // // // // // //                 {camerasList.slice(0, 4).map((camera) => (
// // // // // // // //                   <div key={camera.id} className="aspect-video bg-black rounded-2xl overflow-hidden border border-[#e6e3db] shadow-sm">
// // // // // // // //                     <CameraFeed camera={camera} onClick={() => navigate(`/property/${id}/camera/${camera.id}`)} />
// // // // // // // //                   </div>
// // // // // // // //                 ))}
// // // // // // // //               </div>
// // // // // // // //             </section>

// // // // // // // //             {/* Right Sidebar (Right 4/12 columns) */}
// // // // // // // //             <section className="col-span-4 space-y-6">
              
// // // // // // // //               {/* Alert Notifications */}
// // // // // // // //               {activeAlertCount > 0 && (
// // // // // // // //                 <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
// // // // // // // //                   <div className="flex items-center gap-3 text-red-600 mb-2">
// // // // // // // //                     <AlertTriangle size={18} />
// // // // // // // //                     <span className="font-bold text-sm uppercase">Priority Alerts</span>
// // // // // // // //                   </div>
// // // // // // // //                   <p className="text-xs text-red-500 font-medium">There are {activeAlertCount} unresolved security breaches. Immediate action required.</p>
// // // // // // // //                   <button 
// // // // // // // //                     onClick={() => navigate(`/property/${id}/alerts`)}
// // // // // // // //                     className="w-full mt-4 bg-red-600 text-white py-2 rounded-xl text-xs font-bold"
// // // // // // // //                   >
// // // // // // // //                     Review All Alerts
// // // // // // // //                   </button>
// // // // // // // //                 </div>
// // // // // // // //               )}

// // // // // // // //               {/* Laser Grid Mini-Map */}
// // // // // // // //               <div className="bg-white border border-[#e6e3db] rounded-2xl p-6 shadow-sm">
// // // // // // // //                 <div className="flex items-center justify-between mb-6">
// // // // // // // //                    <h4 className="font-bold text-sm flex items-center gap-2">
// // // // // // // //                     <Grid3X3 size={16} className="text-[#c5a880]" /> LASER MAPPING
// // // // // // // //                   </h4>
// // // // // // // //                   <span className="text-[10px] font-bold text-gray-400 uppercase">{property.x_lasers}x{property.y_lasers}</span>
// // // // // // // //                 </div>
// // // // // // // //                 <div className="aspect-[4/3] bg-[#faf9f6] rounded-xl border border-dashed border-[#e6e3db] flex items-center justify-center">
// // // // // // // //                   <p className="text-[10px] font-bold text-gray-400">GRID VISUALIZATION ACTIVE</p>
// // // // // // // //                 </div>
// // // // // // // //                 <button 
// // // // // // // //                   onClick={() => navigate(`/property/${id}/grid`)}
// // // // // // // //                   className="w-full mt-4 border border-[#e6e3db] text-[#1c1c1c] py-2 rounded-xl text-xs font-bold hover:bg-gray-50"
// // // // // // // //                 >
// // // // // // // //                   Manage Grid
// // // // // // // //                 </button>
// // // // // // // //               </div>

// // // // // // // //             </section>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </main>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // // ── UI Sub-components ──

// // // // // // // // const NavItem = ({ icon, label, active = false, count, onClick }) => (
// // // // // // // //   <button 
// // // // // // // //     onClick={onClick}
// // // // // // // //     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
// // // // // // // //       active ? 'bg-[#c5a880] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
// // // // // // // //     }`}
// // // // // // // //   >
// // // // // // // //     <div className="flex items-center gap-3 font-bold text-sm">
// // // // // // // //       {icon} {label}
// // // // // // // //     </div>
// // // // // // // //     {count > 0 && (
// // // // // // // //       <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
// // // // // // // //         {count}
// // // // // // // //       </span>
// // // // // // // //     )}
// // // // // // // //   </button>
// // // // // // // // );

// // // // // // // // const StatCard = ({ label, value, sub, color }) => (
// // // // // // // //   <div className="bg-white border border-[#e6e3db] p-6 rounded-2xl shadow-sm">
// // // // // // // //     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{label}</p>
// // // // // // // //     <p className={`text-2xl font-black ${color}`}>{value}</p>
// // // // // // // //     <p className="text-xs font-medium text-gray-400 mt-1">{sub}</p>
// // // // // // // //   </div>
// // // // // // // // );

// // // // // // // // export default PropertyDashboard;

// // // // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // // // import {
// // // // // // //   AlertTriangle, Play, Video, Navigation,
// // // // // // //   Users, Grid3X3, RefreshCw, Shield, LayoutDashboard, Settings, Bell
// // // // // // // } from 'lucide-react';
// // // // // // // import { useProperty } from '../hooks/useProperties';
// // // // // // // import { useCameras } from '../hooks/useCameras';
// // // // // // // import { useAlerts } from '../hooks/useAlerts';
// // // // // // // import { useEffect, useState } from 'react';
// // // // // // // import HamburgerMenu from '../components/HamburgerMenu';
// // // // // // // import CameraFeed from '../components/CameraFeed';
// // // // // // // import { theme } from '../theme';

// // // // // // // const PropertyDashboard = () => {
// // // // // // //   const { id } = useParams();
// // // // // // //   const navigate = useNavigate();

// // // // // // //   const {
// // // // // // //     data: propertyData, isLoading: propertyLoading,
// // // // // // //     error: propertyError, refetch: refetchProperty,
// // // // // // //   } = useProperty(id);
// // // // // // //   const { data: cameras = [], isLoading: camerasLoading, refetch: refetchCameras } = useCameras(id);
// // // // // // //   const { data: alertsData = [] } = useAlerts(id);
// // // // // // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     const interval = setInterval(() => refetchCameras(), 10000);
// // // // // // //     return () => clearInterval(interval);
// // // // // // //   }, [refetchCameras]);

// // // // // // //   const handleRefresh = async () => {
// // // // // // //     setIsRefreshing(true);
// // // // // // //     await Promise.all([refetchProperty(), refetchCameras()]);
// // // // // // //     setTimeout(() => setIsRefreshing(false), 500);
// // // // // // //   };

// // // // // // //   if (propertyLoading || camerasLoading) {
// // // // // // //     return (
// // // // // // //       <div className={theme.page.centered}>
// // // // // // //         <div className={theme.ui.spinner} />
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const property = propertyData?.property || propertyData || {};
// // // // // // //   const camerasList = cameras || property.cameras || [];
// // // // // // //   const onlineCameras = camerasList.filter(c => c.is_online).length;
// // // // // // //   const activeAlertCount = Array.isArray(alertsData) ? alertsData.filter(a => a.status === 'active' && !a.is_read).length : 0;
// // // // // // //   const totalAlertCount = Array.isArray(alertsData) ? alertsData.length : 0;

// // // // // // //   return (
// // // // // // //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      
     

// // // // // // //       {/* ── MAIN CONTENT AREA ── */}
// // // // // // //       <main className="flex-1 flex flex-col overflow-hidden">
        
// // // // // // //         {/* Desktop Header */}
// // // // // // //         <header className="h-20 bg-white border-b border-[#e6e3db] flex items-center justify-between px-8 shrink-0">
// // // // // // //           <div className="min-w-0">
// // // // // // //             <h2 className="text-2xl font-black text-[#1c1c1c] truncate">{property.name}</h2>
// // // // // // //             <p className="text-sm text-gray-400 truncate">{property.address || 'No address set'}</p>
// // // // // // //           </div>
          
// // // // // // //           <div className="flex items-center gap-4">
// // // // // // //             <button
// // // // // // //               onClick={handleRefresh}
// // // // // // //               className={`${theme.ui.refreshBtn} ${isRefreshing ? 'animate-spin' : ''}`}
// // // // // // //             >
// // // // // // //               <RefreshCw className="w-5 h-5" />
// // // // // // //             </button>
// // // // // // //             <div className="h-8 w-[1px] bg-gray-200 mx-2" />
// // // // // // //             {/* Kept your HamburgerMenu here */}
// // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // //           </div>
// // // // // // //         </header>

// // // // // // //         {/* Workspace Scroll Area */}
// // // // // // //         <div className="flex-1 overflow-y-auto p-8">
          
// // // // // // //           {/* Active Alert Banner (Full Width on Desktop) */}
// // // // // // //           {activeAlertCount > 0 && (
// // // // // // //             <div
// // // // // // //               onClick={() => navigate(`/property/${id}/alerts`)}
// // // // // // //               className="mb-8 bg-red-500 text-white px-6 py-4 rounded-2xl flex items-center justify-between cursor-pointer animate-pulse shadow-lg hover:bg-red-600 transition-all"
// // // // // // //             >
// // // // // // //               <div className="flex items-center gap-3">
// // // // // // //                 <AlertTriangle className="h-6 w-6" />
// // // // // // //                 <span className="font-bold text-lg">
// // // // // // //                   {activeAlertCount} CRITICAL SECURITY BREACHES DETECTED
// // // // // // //                 </span>
// // // // // // //               </div>
// // // // // // //               <span className="text-xs font-black uppercase tracking-widest border border-white/30 px-3 py-1 rounded-lg">View Intelligence</span>
// // // // // // //             </div>
// // // // // // //           )}

// // // // // // //           {/* Top Stats Row */}
// // // // // // //           <div className="grid grid-cols-4 gap-6 mb-8">
// // // // // // //             <StatCard label="Drones" value={property.drone_status || 'None'} sub={`${property.drones_total || 0} Connected`} color="text-[#c5a880]" />
// // // // // // //             <StatCard label="Cameras" value={`${onlineCameras}/${camerasList.length}`} sub="Systems Online" color="text-emerald-500" />
// // // // // // //             <StatCard label="New Alerts" value={activeAlertCount} sub={`Out of ${totalAlertCount} total`} color={activeAlertCount > 0 ? "text-red-500" : "text-gray-400"} />
// // // // // // //              </div>

// // // // // // //           {/* Desktop Content Grid (2 columns) */}
// // // // // // //           <div className="grid grid-cols-12 gap-8">
            
// // // // // // //             {/* Left: Video Feeds (8 cols) */}
// // // // // // //             <div className="col-span-8">
// // // // // // //               <div className="flex items-center justify-between mb-4">
// // // // // // //                 <h3 className="text-lg font-black flex items-center gap-2">
// // // // // // //                   <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
// // // // // // //                   LIVE OPERATIONAL FEEDS
// // // // // // //                 </h3>
// // // // // // //               </div>
// // // // // // //               <div className="grid grid-cols-2 gap-4">
// // // // // // //                 {camerasList.map((camera) => (
// // // // // // //                   <div key={camera.id} className="aspect-video bg-black rounded-2xl overflow-hidden border border-[#e6e3db] shadow-sm">
// // // // // // //                     <CameraFeed
// // // // // // //                       camera={camera}
// // // // // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             </div>

            
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </main>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // Sub-component for Stats
// // // // // // // const StatCard = ({ label, value, sub, color }) => (
// // // // // // //   <div className="bg-white border border-[#e6e3db] p-6 rounded-2xl shadow-sm">
// // // // // // //     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{label}</p>
// // // // // // //     <p className={`text-2xl font-black ${color}`}>{value}</p>
// // // // // // //     <p className="text-xs font-medium text-gray-400 mt-1">{sub}</p>
// // // // // // //   </div>
// // // // // // // );

// // // // // // // export default PropertyDashboard;

// // // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // // import {
// // // // // //   AlertTriangle,
// // // // // //   RefreshCw,
// // // // // // } from 'lucide-react';

// // // // // // import { useProperty } from '../hooks/useProperties';
// // // // // // import { useCameras } from '../hooks/useCameras';
// // // // // // import { useAlerts } from '../hooks/useAlerts';

// // // // // // import { useEffect, useState } from 'react';

// // // // // // import HamburgerMenu from '../components/HamburgerMenu';
// // // // // // import CameraFeed from '../components/CameraFeed';

// // // // // // import { theme } from '../theme';

// // // // // // const PropertyDashboard = () => {
// // // // // //   const { id } = useParams();
// // // // // //   const navigate = useNavigate();

// // // // // //   const {
// // // // // //     data: propertyData,
// // // // // //     isLoading: propertyLoading,
// // // // // //     error: propertyError,
// // // // // //     refetch: refetchProperty,
// // // // // //   } = useProperty(id);

// // // // // //   const {
// // // // // //     data: cameras = [],
// // // // // //     isLoading: camerasLoading,
// // // // // //     refetch: refetchCameras,
// // // // // //   } = useCameras(id);

// // // // // //   const { data: alertsData = [] } = useAlerts(id);

// // // // // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // // // // //   // Auto refresh cameras every 10 seconds
// // // // // //   useEffect(() => {
// // // // // //     const interval = setInterval(() => {
// // // // // //       refetchCameras();
// // // // // //     }, 10000);

// // // // // //     return () => clearInterval(interval);
// // // // // //   }, [refetchCameras]);

// // // // // //   // Manual refresh
// // // // // //   const handleRefresh = async () => {
// // // // // //     setIsRefreshing(true);

// // // // // //     await Promise.all([
// // // // // //       refetchProperty(),
// // // // // //       refetchCameras(),
// // // // // //     ]);

// // // // // //     setTimeout(() => {
// // // // // //       setIsRefreshing(false);
// // // // // //     }, 500);
// // // // // //   };

// // // // // //   // Loading state
// // // // // //   if (propertyLoading || camerasLoading) {
// // // // // //     return (
// // // // // //       <div className={theme.page.centered}>
// // // // // //         <div className={theme.ui.spinner} />
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   // Error state
// // // // // //   if (propertyError) {
// // // // // //     return (
// // // // // //       <div className="flex items-center justify-center h-screen">
// // // // // //         <p className="text-red-500 font-semibold">
// // // // // //           Failed to load property data
// // // // // //         </p>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   // Safe data handling
// // // // // //   const property = propertyData?.property || propertyData || {};

// // // // // //   const camerasList = cameras || property.cameras || [];

// // // // // //   const onlineCameras = camerasList.filter(
// // // // // //     (camera) => camera.is_online
// // // // // //   ).length;

// // // // // //   const activeAlertCount = Array.isArray(alertsData)
// // // // // //     ? alertsData.filter(
// // // // // //         (alert) =>
// // // // // //           alert.status === 'active' && !alert.is_read
// // // // // //       ).length
// // // // // //     : 0;

// // // // // //   const totalAlertCount = Array.isArray(alertsData)
// // // // // //     ? alertsData.length
// // // // // //     : 0;

// // // // // //   return (
// // // // // //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
// // // // // //       {/* MAIN CONTENT */}
// // // // // //       <main className="flex-1 flex flex-col overflow-hidden">
        
// // // // // //         {/* HEADER */}
// // // // // //         <header className="h-20 bg-white border-b border-[#e6e3db] px-8 flex items-center justify-between shrink-0">
// // // // // //           <div className="min-w-0">
// // // // // //             <h2 className="text-2xl font-black text-[#1c1c1c] truncate">
// // // // // //               {property.name}
// // // // // //             </h2>

// // // // // //             <p className="text-sm text-gray-400 truncate">
// // // // // //               {property.address || 'No address set'}
// // // // // //             </p>
// // // // // //           </div>

// // // // // //           <div className="flex items-center gap-4">
// // // // // //             <button
// // // // // //               onClick={handleRefresh}
// // // // // //               className={`${theme.ui.refreshBtn} ${
// // // // // //                 isRefreshing ? 'animate-spin' : ''
// // // // // //               }`}
// // // // // //             >
// // // // // //               <RefreshCw className="w-5 h-5" />
// // // // // //             </button>

// // // // // //             <div className="h-8 w-[1px] bg-gray-200" />

// // // // // //             <HamburgerMenu propertyId={id} />
// // // // // //           </div>
// // // // // //         </header>

// // // // // //         {/* CONTENT */}
// // // // // //         <div className="flex-1 overflow-y-auto p-8">
          
// // // // // //           {/* ALERT BANNER */}
// // // // // //           {activeAlertCount > 0 && (
// // // // // //             <div
// // // // // //               onClick={() => navigate(`/property/${id}/alerts`)}
// // // // // //               className="mb-8 bg-red-500 text-white px-6 py-4 rounded-2xl flex items-center justify-between cursor-pointer animate-pulse shadow-lg hover:bg-red-600 transition-all"
// // // // // //             >
// // // // // //               <div className="flex items-center gap-3">
// // // // // //                 <AlertTriangle className="w-6 h-6" />

// // // // // //                 <span className="font-bold text-lg">
// // // // // //                   {activeAlertCount} CRITICAL SECURITY BREACHES DETECTED
// // // // // //                 </span>
// // // // // //               </div>

// // // // // //               <span className="text-xs font-black uppercase tracking-widest border border-white/30 px-3 py-1 rounded-lg">
// // // // // //                 View Intelligence
// // // // // //               </span>
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {/* STATS */}
// // // // // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// // // // // //             <StatCard
// // // // // //               label="Drones"
// // // // // //               value={property.drone_status || 'None'}
// // // // // //               sub={`${property.drones_total || 0} Connected`}
// // // // // //               color="text-[#c5a880]"
// // // // // //             />

// // // // // //             <StatCard
// // // // // //               label="Cameras"
// // // // // //               value={`${onlineCameras}/${camerasList.length}`}
// // // // // //               sub="Systems Online"
// // // // // //               color="text-emerald-500"
// // // // // //             />

// // // // // //             <StatCard
// // // // // //               label="New Alerts"
// // // // // //               value={activeAlertCount}
// // // // // //               sub={`Out of ${totalAlertCount} total`}
// // // // // //               color={
// // // // // //                 activeAlertCount > 0
// // // // // //                   ? 'text-red-500'
// // // // // //                   : 'text-gray-400'
// // // // // //               }
// // // // // //             />
// // // // // //           </div>

// // // // // //           {/* CAMERA SECTION */}
// // // // // //           <div>
// // // // // //             <div className="flex items-center justify-between mb-5">
// // // // // //               <h3 className="text-lg font-black flex items-center gap-2">
// // // // // //                 <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />

// // // // // //                 LIVE OPERATIONAL FEEDS
// // // // // //               </h3>
// // // // // //             </div>

// // // // // //             {camerasList.length === 0 ? (
// // // // // //               <div className="bg-white border border-[#e6e3db] rounded-2xl p-10 text-center shadow-sm">
// // // // // //                 <p className="text-gray-500 font-medium">
// // // // // //                   No cameras added yet
// // // // // //                 </p>
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
// // // // // //                 {camerasList.map((camera) => (
// // // // // //                   <div
// // // // // //                     key={camera.id}
// // // // // //                     className="aspect-video bg-black rounded-2xl overflow-hidden border border-[#e6e3db] shadow-sm"
// // // // // //                   >
// // // // // //                     <CameraFeed
// // // // // //                       camera={camera}
// // // // // //                       onClick={() =>
// // // // // //                         navigate(
// // // // // //                           `/property/${id}/camera/${camera.id}`
// // // // // //                         )
// // // // // //                       }
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </main>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // // STATS CARD
// // // // // // const StatCard = ({ label, value, sub, color }) => {
// // // // // //   return (
// // // // // //     <div className="bg-white border border-[#e6e3db] p-6 rounded-2xl shadow-sm">
// // // // // //       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
// // // // // //         {label}
// // // // // //       </p>

// // // // // //       <p className={`text-2xl font-black ${color}`}>
// // // // // //         {value}
// // // // // //       </p>

// // // // // //       <p className="text-xs font-medium text-gray-400 mt-1">
// // // // // //         {sub}
// // // // // //       </p>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default PropertyDashboard;

// // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // import { useEffect, useState } from 'react';

// // // // // import {
// // // // //   AlertTriangle,
// // // // //   RefreshCw,
// // // // //   Navigation,
// // // // //   Camera,
// // // // //   Bell,
// // // // //   Plane,
// // // // // } from 'lucide-react';

// // // // // import { useProperty } from '../hooks/useProperties';
// // // // // import { useCameras } from '../hooks/useCameras';
// // // // // import { useAlerts } from '../hooks/useAlerts';
// // // // // import { useDrones } from '../hooks/useDrones';

// // // // // import HamburgerMenu from '../components/HamburgerMenu';
// // // // // import CameraFeed from '../components/CameraFeed';

// // // // // import { theme } from '../theme';

// // // // // const PropertyDashboard = () => {
// // // // //   const { id } = useParams();
// // // // //   const navigate = useNavigate();

// // // // //   // PROPERTY
// // // // //   const {
// // // // //     data: propertyData,
// // // // //     isLoading: propertyLoading,
// // // // //     error: propertyError,
// // // // //     refetch: refetchProperty,
// // // // //   } = useProperty(id);

// // // // //   // CAMERAS
// // // // //   const {
// // // // //     data: cameras = [],
// // // // //     isLoading: camerasLoading,
// // // // //     refetch: refetchCameras,
// // // // //   } = useCameras(id);

// // // // //   // DRONES
// // // // //   const {
// // // // //     data: drones = [],
// // // // //     isLoading: dronesLoading,
// // // // //     refetch: refetchDrones,
// // // // //   } = useDrones(id);

// // // // //   // ALERTS
// // // // //   const { data: alertsData = [] } = useAlerts(id);

// // // // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // // // //   // AUTO REFRESH
// // // // //   useEffect(() => {
// // // // //     const interval = setInterval(() => {
// // // // //       refetchCameras();
// // // // //       refetchDrones();
// // // // //     }, 10000);

// // // // //     return () => clearInterval(interval);
// // // // //   }, [refetchCameras, refetchDrones]);

// // // // //   // MANUAL REFRESH
// // // // //   const handleRefresh = async () => {
// // // // //     setIsRefreshing(true);

// // // // //     await Promise.all([
// // // // //       refetchProperty(),
// // // // //       refetchCameras(),
// // // // //       refetchDrones(),
// // // // //     ]);

// // // // //     setTimeout(() => {
// // // // //       setIsRefreshing(false);
// // // // //     }, 500);
// // // // //   };

// // // // //   // LOADING
// // // // //   if (propertyLoading || camerasLoading || dronesLoading) {
// // // // //     return (
// // // // //       <div className={theme.page.centered}>
// // // // //         <div className={theme.ui.spinner} />
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // ERROR
// // // // //   if (propertyError) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center h-screen">
// // // // //         <p className="text-red-500 font-semibold">
// // // // //           Failed to load property data
// // // // //         </p>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   const property = propertyData?.property || propertyData || {};

// // // // //   // STATS
// // // // //   const onlineCameras = cameras.filter(
// // // // //     (camera) => camera.is_online
// // // // //   ).length;

// // // // //   const onlineDrones = drones.filter(
// // // // //     (drone) => drone.is_online
// // // // //   ).length;

// // // // //   const activeAlertCount = Array.isArray(alertsData)
// // // // //     ? alertsData.filter(
// // // // //         (alert) =>
// // // // //           alert.status === 'active' && !alert.is_read
// // // // //       ).length
// // // // //     : 0;

// // // // //   const totalAlertCount = Array.isArray(alertsData)
// // // // //     ? alertsData.length
// // // // //     : 0;

// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#faf9f6]">
      
// // // // //       {/* HEADER */}
// // // // //       <header className="sticky top-0 z-50 bg-[#faf9f6] px-5 py-6 flex items-center justify-between">
// // // // //         <div>
// // // // //           <h1 className="text-4xl font-black text-[#1c1c1c]">
// // // // //             {property.name || 'Property Dashboard'}
// // // // //           </h1>

// // // // //           <p className="text-sm text-gray-400 mt-1">
// // // // //             {property.address || 'Monitoring Dashboard'}
// // // // //           </p>
// // // // //         </div>

// // // // //         <div className="flex items-center gap-3">
          
// // // // //           {/* REFRESH */}
// // // // //           <button
// // // // //             onClick={handleRefresh}
// // // // //             className={`w-11 h-11 rounded-2xl bg-white border border-[#e6e3db] flex items-center justify-center shadow-sm transition ${
// // // // //               isRefreshing ? 'animate-spin' : ''
// // // // //             }`}
// // // // //           >
// // // // //             <RefreshCw className="w-5 h-5 text-[#5c5248]" />
// // // // //           </button>

// // // // //           {/* MENU */}
// // // // //           <div className="w-11 h-11 rounded-2xl bg-white border border-[#e6e3db] flex items-center justify-center shadow-sm">
// // // // //             <HamburgerMenu propertyId={id} />
// // // // //           </div>
// // // // //         </div>
// // // // //       </header>

// // // // //       {/* MAIN */}
// // // // //       <main className="px-5 pb-28">
        
// // // // //         {/* ALERT BANNER */}
// // // // //         {activeAlertCount > 0 && (
// // // // //           <div
// // // // //             onClick={() => navigate(`/property/${id}/alerts`)}
// // // // //             className="mb-6 bg-red-500 text-white px-5 py-4 rounded-3xl flex items-center justify-between cursor-pointer animate-pulse shadow-lg"
// // // // //           >
// // // // //             <div className="flex items-center gap-3">
// // // // //               <AlertTriangle className="w-6 h-6" />

// // // // //               <span className="font-bold text-base">
// // // // //                 {activeAlertCount} Critical Alerts
// // // // //               </span>
// // // // //             </div>

// // // // //             <span className="text-xs font-black uppercase tracking-widest">
// // // // //               View
// // // // //             </span>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* STATS */}
// // // // //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          
// // // // //           <StatCard
// // // // //             icon={<Plane className="w-5 h-5" />}
// // // // //             label="Drones"
// // // // //             value={`${onlineDrones} / ${drones.length}`}
// // // // //             sub="Systems Online"
// // // // //             valueColor="text-red-500"
// // // // //           />

// // // // //           <StatCard
// // // // //             icon={<Camera className="w-5 h-5" />}
// // // // //             label="Cameras"
// // // // //             value={`${onlineCameras} / ${cameras.length}`}
// // // // //             sub="Systems Online"
// // // // //             valueColor="text-green-600"
// // // // //           />

// // // // //           <StatCard
// // // // //             icon={<Bell className="w-5 h-5" />}
// // // // //             label="Alerts"
// // // // //             value={`${activeAlertCount}`}
// // // // //             sub={`${totalAlertCount} Total Alerts`}
// // // // //             valueColor={
// // // // //               activeAlertCount > 0
// // // // //                 ? 'text-red-500'
// // // // //                 : 'text-green-600'
// // // // //             }
// // // // //           />
// // // // //         </div>

// // // // //         {/* DRONE FEEDS */}
// // // // // <section className="mb-8">
// // // // //   <div className="flex items-center justify-between mb-3">
// // // // //     <h2 className="text-lg font-bold text-[#1c1c1c]">
// // // // //       Drone Feeds
// // // // //     </h2>
// // // // //   </div>

// // // // //   {drones.length === 0 ? (
// // // // //     <div className="bg-white border border-[#e6e3db] rounded-2xl p-6 text-center">
// // // // //       <p className="text-sm text-gray-500">
// // // // //         No drones available
// // // // //       </p>
// // // // //     </div>
// // // // //   ) : (
// // // // //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //       {drones.map((drone) => (
// // // // //         <div
// // // // //           key={drone.id}
// // // // //           className="relative bg-[#1d2b45] rounded-2xl h-[180px] overflow-hidden"
// // // // //         >
// // // // //           {/* STATUS */}
// // // // //           <div
// // // // //             className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-lg ${
// // // // //               drone.is_online
// // // // //                 ? 'bg-green-600'
// // // // //                 : 'bg-red-500'
// // // // //             }`}
// // // // //           >
// // // // //             {drone.is_online ? 'LIVE' : 'OFFLINE'}
// // // // //           </div>

// // // // //           {/* CONTENT */}
// // // // //           <div className="h-full flex flex-col items-center justify-center text-white">
// // // // //             <Navigation className="w-10 h-10 mb-2" />

// // // // //             <h3 className="text-xl font-bold">
// // // // //               {drone.name}
// // // // //             </h3>

// // // // //             <p className="text-sm text-gray-300">
// // // // //               {drone.type || 'Drone Feed'}
// // // // //             </p>
// // // // //           </div>
// // // // //         </div>
// // // // //       ))}
// // // // //     </div>
// // // // //   )}
// // // // // </section>

// // // // // {/* CAMERA FEEDS */}
// // // // // <section>
// // // // //   <div className="flex items-center justify-between mb-3">
// // // // //     <h2 className="text-lg font-bold text-[#1c1c1c]">
// // // // //       Camera Feeds
// // // // //     </h2>
// // // // //   </div>

// // // // //   {cameras.length === 0 ? (
// // // // //     <div className="bg-white border border-[#e6e3db] rounded-2xl p-6 text-center">
// // // // //       <p className="text-sm text-gray-500">
// // // // //         No cameras available
// // // // //       </p>
// // // // //     </div>
// // // // //   ) : (
// // // // //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //       {cameras.map((camera) => (
// // // // //         <div
// // // // //           key={camera.id}
// // // // //           className="relative bg-black rounded-2xl overflow-hidden border border-[#e6e3db]"
// // // // //         >
// // // // //           {/* STATUS */}
// // // // //           <div
// // // // //             className={`absolute top-3 right-3 z-10 text-white text-xs font-semibold px-3 py-1 rounded-lg ${
// // // // //               camera.is_online
// // // // //                 ? 'bg-green-600'
// // // // //                 : 'bg-red-500'
// // // // //             }`}
// // // // //           >
// // // // //             {camera.is_online ? 'LIVE' : 'OFFLINE'}
// // // // //           </div>

// // // // //           {/* CAMERA NAME */}
// // // // //           <div className="absolute top-3 left-3 z-10">
// // // // //             <h3 className="text-sm font-semibold text-white">
// // // // //               {camera.name}
// // // // //             </h3>
// // // // //           </div>

// // // // //           {/* CAMERA STREAM */}
// // // // //           <div className="aspect-video">
// // // // //             <CameraFeed
// // // // //               camera={camera}
// // // // //               onClick={() =>
// // // // //                 navigate(
// // // // //                   `/property/${id}/camera/${camera.id}`
// // // // //                 )
// // // // //               }
// // // // //             />
// // // // //           </div>
// // // // //         </div>
// // // // //       ))}
// // // // //     </div>
// // // // //   )}
// // // // // </section>
// // // // //       </main>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // STATS CARD
// // // // // const StatCard = ({
// // // // //   icon,
// // // // //   label,
// // // // //   value,
// // // // //   sub,
// // // // //   valueColor,
// // // // // }) => {
// // // // //   return (
// // // // //     <div className="bg-[#f4f1eb] border border-[#d8d1c7] rounded-3xl p-5 shadow-sm">
      
// // // // //       <div className="flex items-center gap-3 mb-4">
// // // // //         <div className="text-[#5c5248]">
// // // // //           {icon}
// // // // //         </div>

// // // // //         <p className="text-2xl font-medium text-[#4a433d]">
// // // // //           {label}
// // // // //         </p>
// // // // //       </div>

// // // // //       <h3 className={`text-3xl font-black ${valueColor}`}>
// // // // //         {value}
// // // // //       </h3>

// // // // //       <p className="text-sm text-gray-500 mt-2">
// // // // //         {sub}
// // // // //       </p>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default PropertyDashboard;

// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import {
// // // //   AlertTriangle,
// // // //   Video,
// // // //   Navigation,
// // // //   Users,
// // // //   RefreshCw,
// // // //   LayoutDashboard,
// // // //   Shield,
// // // //   Settings,
// // // //   Bell
// // // // } from 'lucide-react';

// // // // import { useProperty } from '../hooks/useProperties';
// // // // import { useCameras } from '../hooks/useCameras';
// // // // import { useAlerts } from '../hooks/useAlerts';
// // // // import { useState } from 'react';
// // // // import CameraFeed from '../components/CameraFeed';
// // // // import { theme } from '../theme';

// // // // const PropertyDashboard = () => {
// // // //   const { id } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const [isRefreshing] = useState(false);

// // // //   const { data: propertyData } = useProperty(id);
// // // //   const { data: cameras = [] } = useCameras(id);
// // // //   const { data: alertsData = [] } = useAlerts(id);

// // // //   const property = propertyData?.property || propertyData || {};
// // // //   const camerasList = cameras || [];
// // // //   const onlineCameras = camerasList.filter(c => c.is_online).length;

// // // //   const activeAlertCount = Array.isArray(alertsData)
// // // //     ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
// // // //     : 0;

// // // //   return (
// // // //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">

// // // //       {/* SIDEBAR */}
// // // //       <aside className="w-64 bg-[#1c1c1c] text-white flex flex-col">
// // // //         <div className="p-6">
// // // //           <h1 className="text-xl font-black flex items-center gap-2">
// // // //             <Shield className="text-[#c5a880]" /> VIGIL OS
// // // //           </h1>
// // // //         </div>

// // // //         <nav className="flex-1 px-4 space-y-2 mt-4">
// // // //           <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
// // // //           <NavItem icon={<Video size={20} />} label="Cameras" onClick={() => navigate(`/property/${id}/cameras`)} />
// // // //           <NavItem icon={<Bell size={20} />} label="Alerts" count={activeAlertCount} onClick={() => navigate(`/property/${id}/alerts`)} />
// // // //           <NavItem icon={<Users size={20} />} label="Personnel" onClick={() => navigate(`/property/${id}/people`)} />
// // // //           <NavItem icon={<Settings size={20} />} label="Settings" />
// // // //         </nav>
// // // //       </aside>

// // // //       {/* MAIN */}
// // // //       <main className="flex-1 flex flex-col overflow-hidden">

// // // //         {/* HEADER */}
// // // //         <header className="h-20 bg-white border-b flex items-center justify-between px-8">
// // // //           <div>
// // // //             <h2 className="text-2xl font-black">{property.name}</h2>
// // // //             <p className="text-sm text-gray-400">{property.address}</p>
// // // //           </div>

// // // //           <div className="flex items-center gap-4">
// // // //             <button className={theme.ui.refreshBtn}>
// // // //               <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
// // // //             </button>

// // // //             <button className={`${theme.button.dark} flex items-center gap-2`}>
// // // //               <Navigation size={16} /> Launch Drone
// // // //             </button>
// // // //           </div>
// // // //         </header>

// // // //         {/* CONTENT */}
// // // //         <div className="flex-1 overflow-y-auto p-8 space-y-8">

// // // //           {/* STATS */}
// // // //           <section className="grid grid-cols-4 gap-6">
// // // //             <StatCard
// // // //               label="Live Cameras"
// // // //               value={`${onlineCameras}/${camerasList.length}`}
// // // //               sub="Online feeds"
// // // //               color="text-emerald-500"
// // // //             />
// // // //             <StatCard
// // // //               label="Active Alerts"
// // // //               value={activeAlertCount}
// // // //               sub="Unresolved"
// // // //               color={activeAlertCount ? "text-red-500" : "text-gray-400"}
// // // //             />
// // // //             <StatCard
// // // //               label="Drones"
// // // //               value={property.drone_status || 'Docked'}
// // // //               sub="System status"
// // // //               color="text-[#c5a880]"
// // // //             />
// // // //             <StatCard
// // // //               label="Personnel"
// // // //               value={property.authorized_people_count || 0}
// // // //               sub="On site"
// // // //               color="text-blue-500"
// // // //             />
// // // //           </section>

// // // //           {/* CAMERA FEEDS */}
// // // //           <div className="grid grid-cols-12 gap-8">

// // // //             <section className="col-span-8">
// // // //               <h3 className="text-lg font-black mb-4 flex items-center gap-2">
// // // //                 <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
// // // //                 COMMAND CENTER FEED
// // // //               </h3>

// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 {camerasList.slice(0, 4).map(camera => (
// // // //                   <div key={camera.id} className="aspect-video bg-black rounded-2xl overflow-hidden">
// // // //                     <CameraFeed
// // // //                       camera={camera}
// // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // // //                     />
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             </section>

// // // //             {/* ALERT PANEL */}
// // // //             <section className="col-span-4 space-y-6">

// // // //               {activeAlertCount > 0 && (
// // // //                 <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
// // // //                   <div className="flex items-center gap-2 text-red-600 font-bold">
// // // //                     <AlertTriangle size={18} />
// // // //                     Priority Alerts
// // // //                   </div>

// // // //                   <p className="text-xs text-red-500 mt-2">
// // // //                     {activeAlertCount} unresolved alerts require attention.
// // // //                   </p>

// // // //                   <button
// // // //                     onClick={() => navigate(`/property/${id}/alerts`)}
// // // //                     className="w-full mt-4 bg-red-600 text-white py-2 rounded-xl text-xs font-bold"
// // // //                   >
// // // //                     Review Alerts
// // // //                   </button>
// // // //                 </div>
// // // //               )}

// // // //             </section>

// // // //           </div>
// // // //         </div>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // };

// // // // /* UI COMPONENTS */

// // // // const NavItem = ({ icon, label, active, count, onClick }) => (
// // // //   <button
// // // //     onClick={onClick}
// // // //     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl ${
// // // //       active ? 'bg-[#c5a880] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
// // // //     }`}
// // // //   >
// // // //     <div className="flex items-center gap-3 text-sm font-bold">
// // // //       {icon} {label}
// // // //     </div>
// // // //     {count > 0 && (
// // // //       <span className="text-[10px] bg-red-500 px-2 rounded-full">
// // // //         {count}
// // // //       </span>
// // // //     )}
// // // //   </button>
// // // // );

// // // // const StatCard = ({ label, value, sub, color }) => (
// // // //   <div className="bg-white border p-6 rounded-2xl">
// // // //     <p className="text-[10px] uppercase text-gray-400">{label}</p>
// // // //     <p className={`text-2xl font-black ${color}`}>{value}</p>
// // // //     <p className="text-xs text-gray-400">{sub}</p>
// // // //   </div>
// // // // );

// // // // export default PropertyDashboard;

// // // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // // import {
// // //   AlertTriangle,
// // //   Video,
// // //   Navigation,
// // //   Users,
// // //   RefreshCw,
// // //   LayoutDashboard,
// // //   Shield,
// // //   Settings,
// // //   Bell,
// // //   Map,
// // //   Plane,
// // //   Grid3X3,
// // //   Wifi,
// // //   WifiOff,
// // //   Radio
// // // } from 'lucide-react';
// // // import { useState } from 'react';

// // // import { useProperty } from '../hooks/useProperties';
// // // import { useCameras } from '../hooks/useCameras';
// // // import { useAlerts } from '../hooks/useAlerts';
// // // import { useDrones } from '../hooks/useDrones';
// // // import CameraFeed from '../components/CameraFeed';
// // // import { theme } from '../theme';

// // // const PropertyDashboard = () => {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const [isRefreshing, setIsRefreshing] = useState(false);

// // //   const { data: propertyData } = useProperty(id);
// // //   const { data: cameras = [] } = useCameras(id);
// // //   const { data: alertsData = [] } = useAlerts(id);
// // //   const { data: drones = [] } = useDrones(id);

// // //   const property = propertyData?.property || propertyData || {};
// // //   const camerasList = cameras || [];
// // //   const onlineCameras = camerasList.filter(c => c.is_online).length;

// // //   const activeAlertCount = Array.isArray(alertsData)
// // //     ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
// // //     : 0;

// // //   const handleRefresh = () => {
// // //     setIsRefreshing(true);
// // //     setTimeout(() => setIsRefreshing(false), 1000);
// // //   };

// // //   // Bottom nav items
// // //   const navItems = [
// // //     { icon: Grid3X3, label: 'Dashboard', path: `/property/${id}` },
// // //     { icon: Bell, label: 'Alerts', path: `/property/${id}/alerts`, count: activeAlertCount },
// // //     { icon: Map, label: 'Map', path: `/property/${id}/map` },
// // //     { icon: Plane, label: 'Drone', path: `/property/${id}/drones` },
// // //   ];

// // //   const isActive = (path) => location.pathname === path;

// // //   return (
// // //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">

      
// // //       {/* MAIN */}
// // //       <main className="flex-1 flex flex-col overflow-hidden relative">

// // //         {/* HEADER */}
// // //         <header className="h-16 bg-[#faf9f6] flex items-center justify-between px-6 lg:px-8 border-b border-gray-200/50">
// // //           <div>
// // //             <h2 className="text-2xl font-black text-[#1c1c1c]">{property.name || 'Biit'}</h2>
// // //           </div>

// // //           <div className="flex items-center gap-3">
// // //             <button 
// // //               onClick={handleRefresh}
// // //               className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
// // //             >
// // //               <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
// // //             </button>

// // //             <button className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
// // //               <Settings className="w-5 h-5 text-gray-600" />
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {/* CONTENT - Scrollable */}
// // //         <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">

// // //           {/* TOP SUMMARY CARDS */}
// // //           <section className="px-6 lg:px-8 pt-6">
// // //             <div className="grid grid-cols-3 gap-4 max-w-4xl">
// // //               {/* Drone Card */}
// // //               <SummaryCard
// // //                 icon={<Plane size={20} className="text-gray-600" />}
// // //                 title="Drone"
// // //                 status={drones.some(d => d.status === 'online') ? 'Online' : 'Offline'}
// // //                 statusColor={drones.some(d => d.status === 'online') ? 'text-emerald-600' : 'text-red-500'}
// // //                 bg="bg-[#f0ede8]"
// // //               />

// // //               {/* Cameras Card */}
// // //               <SummaryCard
// // //                 icon={<Video size={20} className="text-gray-600" />}
// // //                 title="Cameras"
// // //                 status={`${onlineCameras} / ${camerasList.length} Online`}
// // //                 statusColor="text-emerald-600"
// // //                 bg="bg-[#f0ede8]"
// // //               />

// // //               {/* Alerts Card */}
// // //               <SummaryCard
// // //                 icon={<Bell size={20} className="text-gray-600" />}
// // //                 title="Alerts"
// // //                 status={`${activeAlertCount} New Alert${activeAlertCount !== 1 ? 's' : ''}`}
// // //                 statusColor={activeAlertCount > 0 ? 'text-emerald-600' : 'text-emerald-600'}
// // //                 bg="bg-[#f0ede8]"
// // //               />
// // //             </div>
// // //           </section>

// // //           {/* DRONE LIVE FEEDS */}
// // //           <section className="px-6 lg:px-8 mt-8">
// // //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Drone Live Feeds</h3>
            
// // //             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
// // //               {drones.length > 0 ? (
// // //                 drones.map((drone) => (
// // //                   <div 
// // //                     key={drone.id}
// // //                     onClick={() => navigate(`/property/${id}/drones`)}
// // //                     className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl relative overflow-hidden cursor-pointer group hover:ring-2 hover:ring-[#c5a880] transition-all"
// // //                   >
// // //                     {/* Live Badge */}
// // //                     <div className="absolute top-3 right-3 z-10">
// // //                       <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
// // //                         <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// // //                         LIVE
// // //                       </span>
// // //                     </div>

// // //                     {/* Drone Feed Content */}
// // //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// // //                       <Plane className="w-10 h-10 text-gray-400 mb-2" />
// // //                       <p className="text-white font-semibold text-sm">{drone.name || 'Drone'}</p>
// // //                       <p className="text-gray-400 text-xs mt-0.5">FPV Feed</p>
// // //                     </div>

// // //                     {/* Hover Overlay */}
// // //                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 // Empty state
// // //                 <div className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl flex flex-col items-center justify-center">
// // //                   <Plane className="w-10 h-10 text-gray-500 mb-2" />
// // //                   <p className="text-gray-400 text-sm">No drones connected</p>
// // //                 </div>
// // //               )}

// // //               {/* Add Drone Placeholder */}
// // //               <div 
// // //                 onClick={() => navigate(`/property/${id}/drones`)}
// // //                 className="flex-shrink-0 w-72 h-48 bg-[#1e293b]/50 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a880] hover:bg-[#1e293b]/70 transition-all"
// // //               >
// // //                 <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
// // //                   <Plane className="w-5 h-5 text-gray-400" />
// // //                 </div>
// // //                 <p className="text-gray-400 text-sm">Manage Drones</p>
// // //               </div>
// // //             </div>
// // //           </section>

// // //           {/* LIVE CAMERA FEEDS */}
// // //           <section className="px-6 lg:px-8 mt-8">
// // //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Live Camera Feeds</h3>
            
// // //             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // //               {camerasList.map((camera) => (
// // //                 <div 
// // //                   key={camera.id}
// // //                   onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // //                   className="aspect-square bg-[#f0ede8] rounded-2xl border border-gray-200 relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
// // //                 >
// // //                   {/* Camera Name & Status */}
// // //                   <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
// // //                     <span className="text-white text-sm font-medium drop-shadow-md">{camera.name || 'Camera'}</span>
// // //                     {camera.is_online ? (
// // //                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
// // //                         LIVE
// // //                       </span>
// // //                     ) : (
// // //                       <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
// // //                         OFFLINE
// // //                       </span>
// // //                     )}
// // //                   </div>

// // //                   {/* Feed or Offline State */}
// // //                   {camera.is_online ? (
// // //                     <div className="absolute inset-0">
// // //                       <CameraFeed camera={camera} className="w-full h-full object-cover" />
// // //                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
// // //                     </div>
// // //                   ) : (
// // //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// // //                       <WifiOff className="w-8 h-8 text-gray-400 mb-2" />
// // //                       <p className="text-gray-500 text-sm">Camera Offline</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               ))}

// // //               {/* Add Camera Placeholder */}
// // //               <div 
// // //                 onClick={() => navigate(`/property/${id}/cameras`)}
// // //                 className="aspect-square bg-[#f0ede8]/50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a880] hover:bg-[#f0ede8] transition-all"
// // //               >
// // //                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
// // //                   <Video className="w-5 h-5 text-gray-500" />
// // //                 </div>
// // //                 <p className="text-gray-500 text-sm">Add Camera</p>
// // //               </div>
// // //             </div>
// // //           </section>

          

// // //           {/* Bottom spacer for mobile nav */}
// // //           <div className="h-20 lg:hidden" />
// // //         </div>

        
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // /* UI COMPONENTS */

// // // const NavItem = ({ icon, label, active, count, onClick }) => (
// // //   <button
// // //     onClick={onClick}
// // //     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
// // //       active ? 'bg-[#c5a880] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
// // //     }`}
// // //   >
// // //     <div className="flex items-center gap-3 text-sm font-bold">
// // //       {icon} {label}
// // //     </div>
// // //     {count > 0 && (
// // //       <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
// // //         {count}
// // //       </span>
// // //     )}
// // //   </button>
// // // );

// // // const SummaryCard = ({ icon, title, status, statusColor, bg }) => (
// // //   <div className={`${bg} rounded-2xl p-5 border border-gray-200/50`}>
// // //     <div className="flex items-center gap-2 mb-3">
// // //       {icon}
// // //       <span className="text-sm font-medium text-gray-600">{title}</span>
// // //     </div>
// // //     <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
// // //   </div>
// // // );

// // // export default PropertyDashboard;

// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import {
// //   AlertTriangle,
// //   Video,
// //   Navigation,
// //   Users,
// //   RefreshCw,
// //   LayoutDashboard,
// //   Shield,
// //   Settings,
// //   Bell,
// //   Map,
// //   Plane,
// //   Grid3X3,
// //   Wifi,
// //   WifiOff,
// //   Radio,
// //   Menu // Added Menu icon
// // } from 'lucide-react';
// // import { useState } from 'react';

// // import { useProperty } from '../hooks/useProperties';
// // import { useCameras } from '../hooks/useCameras';
// // import { useAlerts } from '../hooks/useAlerts';
// // import { useDrones } from '../hooks/useDrones';
// // import CameraFeed from '../components/CameraFeed';
// // import { theme } from '../theme';

// // const PropertyDashboard = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [isRefreshing, setIsRefreshing] = useState(false);

// //   const { data: propertyData } = useProperty(id);
// //   const { data: cameras = [] } = useCameras(id);
// //   const { data: alertsData = [] } = useAlerts(id);
// //   const { data: drones = [] } = useDrones(id);

// //   const property = propertyData?.property || propertyData || {};
// //   const camerasList = cameras || [];
// //   const onlineCameras = camerasList.filter(c => c.is_online).length;

// //   const activeAlertCount = Array.isArray(alertsData)
// //     ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
// //     : 0;

// //   const handleRefresh = () => {
// //     setIsRefreshing(true);
// //     setTimeout(() => setIsRefreshing(false), 1000);
// //   };

// //   // Bottom nav items
// //   const navItems = [
// //     { icon: Grid3X3, label: 'Dashboard', path: `/property/${id}` },
// //     { icon: Bell, label: 'Alerts', path: `/property/${id}/alerts`, count: activeAlertCount },
// //     { icon: Map, label: 'Map', path: `/property/${id}/map` },
// //     { icon: Plane, label: 'Drone', path: `/property/${id}/drones` },
// //   ];

// //   const isActive = (path) => location.pathname === path;

// //   return (
// //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">

      
// //       {/* MAIN */}
// //       <main className="flex-1 flex flex-col overflow-hidden relative">

// //         {/* HEADER */}
// //         <header className="h-16 bg-[#faf9f6] flex items-center justify-between px-6 lg:px-8 border-b border-gray-200/50">
// //           <div>
// //             <h2 className="text-2xl font-black text-[#1c1c1c]">{property.name || 'Biit'}</h2>
// //           </div>

// //           <div className="flex items-center gap-3">
// //             <button 
// //               onClick={handleRefresh}
// //               className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
// //             >
// //               <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
// //             </button>

// //             {/* Replaced Settings icon with Menu (Hamburger) icon */}
// //             <button className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
// //               <Menu className="w-5 h-5 text-gray-600" />
// //             </button>
// //           </div>
// //         </header>

// //         {/* CONTENT - Scrollable */}
// //         <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">

// //           {/* TOP SUMMARY CARDS */}
// //           <section className="px-6 lg:px-8 pt-6">
// //             <div className="grid grid-cols-3 gap-4 max-w-4xl">
// //               {/* Drone Card */}
// //               <SummaryCard
// //                 icon={<Plane size={20} className="text-gray-600" />}
// //                 title="Drone"
// //                 status={drones.some(d => d.status === 'online') ? 'Online' : 'Offline'}
// //                 statusColor={drones.some(d => d.status === 'online') ? 'text-emerald-600' : 'text-red-500'}
// //                 bg="bg-[#f0ede8]"
// //               />

// //               {/* Cameras Card */}
// //               <SummaryCard
// //                 icon={<Video size={20} className="text-gray-600" />}
// //                 title="Cameras"
// //                 status={`${onlineCameras} / ${camerasList.length} Online`}
// //                 statusColor="text-emerald-600"
// //                 bg="bg-[#f0ede8]"
// //               />

// //               {/* Alerts Card */}
// //               <SummaryCard
// //                 icon={<Bell size={20} className="text-gray-600" />}
// //                 title="Alerts"
// //                 status={`${activeAlertCount} New Alert${activeAlertCount !== 1 ? 's' : ''}`}
// //                 statusColor={activeAlertCount > 0 ? 'text-emerald-600' : 'text-emerald-600'}
// //                 bg="bg-[#f0ede8]"
// //               />
// //             </div>
// //           </section>

// //           {/* DRONE LIVE FEEDS */}
// //           <section className="px-6 lg:px-8 mt-8">
// //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Drone Live Feeds</h3>
            
// //             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
// //               {drones.length > 0 ? (
// //                 drones.map((drone) => (
// //                   <div 
// //                     key={drone.id}
// //                     onClick={() => navigate(`/property/${id}/drones`)}
// //                     className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl relative overflow-hidden cursor-pointer group hover:ring-2 hover:ring-[#c5a880] transition-all"
// //                   >
// //                     {/* Live Badge */}
// //                     <div className="absolute top-3 right-3 z-10">
// //                       <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
// //                         <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// //                         LIVE
// //                       </span>
// //                     </div>

// //                     {/* Drone Feed Content */}
// //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// //                       <Plane className="w-10 h-10 text-gray-400 mb-2" />
// //                       <p className="text-white font-semibold text-sm">{drone.name || 'Drone'}</p>
// //                       <p className="text-gray-400 text-xs mt-0.5">FPV Feed</p>
// //                     </div>

// //                     {/* Hover Overlay */}
// //                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
// //                   </div>
// //                 ))
// //               ) : (
// //                 // Empty state
// //                 <div className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl flex flex-col items-center justify-center">
// //                   <Plane className="w-10 h-10 text-gray-500 mb-2" />
// //                   <p className="text-gray-400 text-sm">No drones connected</p>
// //                 </div>
// //               )}

// //               {/* Add Drone Placeholder */}
// //               <div 
// //                 onClick={() => navigate(`/property/${id}/drones`)}
// //                 className="flex-shrink-0 w-72 h-48 bg-[#1e293b]/50 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a880] hover:bg-[#1e293b]/70 transition-all"
// //               >
// //                 <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
// //                   <Plane className="w-5 h-5 text-gray-400" />
// //                 </div>
// //                 <p className="text-gray-400 text-sm">Manage Drones</p>
// //               </div>
// //             </div>
// //           </section>

// //           {/* LIVE CAMERA FEEDS */}
// //           <section className="px-6 lg:px-8 mt-8">
// //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Live Camera Feeds</h3>
            
// //             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //               {camerasList.map((camera) => (
// //                 <div 
// //                   key={camera.id}
// //                   onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// //                   className="aspect-square bg-[#f0ede8] rounded-2xl border border-gray-200 relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
// //                 >
// //                   {/* Camera Name & Status */}
// //                   <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
// //                     <span className="text-white text-sm font-medium drop-shadow-md">{camera.name || 'Camera'}</span>
// //                     {camera.is_online ? (
// //                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
// //                         LIVE
// //                       </span>
// //                     ) : (
// //                       <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
// //                         OFFLINE
// //                       </span>
// //                     )}
// //                   </div>

// //                   {/* Feed or Offline State */}
// //                   {camera.is_online ? (
// //                     <div className="absolute inset-0">
// //                       <CameraFeed camera={camera} className="w-full h-full object-cover" />
// //                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
// //                     </div>
// //                   ) : (
// //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// //                       <WifiOff className="w-8 h-8 text-gray-400 mb-2" />
// //                       <p className="text-gray-500 text-sm">Camera Offline</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}

// //               {/* Add Camera Placeholder */}
// //               <div 
// //                 onClick={() => navigate(`/property/${id}/cameras`)}
// //                 className="aspect-square bg-[#f0ede8]/50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a880] hover:bg-[#f0ede8] transition-all"
// //               >
// //                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
// //                   <Video className="w-5 h-5 text-gray-500" />
// //                 </div>
// //                 <p className="text-gray-500 text-sm">Add Camera</p>
// //               </div>
// //             </div>
// //           </section>

          

// //           {/* Bottom spacer for mobile nav */}
// //           <div className="h-20 lg:hidden" />
// //         </div>

        
// //       </main>
// //     </div>
// //   );
// // };

// // /* UI COMPONENTS */

// // const NavItem = ({ icon, label, active, count, onClick }) => (
// //   <button
// //     onClick={onClick}
// //     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
// //       active ? 'bg-[#c5a880] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
// //     }`}
// //   >
// //     <div className="flex items-center gap-3 text-sm font-bold">
// //       {icon} {label}
// //     </div>
// //     {count > 0 && (
// //       <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
// //         {count}
// //       </span>
// //     )}
// //   </button>
// // );

// // const SummaryCard = ({ icon, title, status, statusColor, bg }) => (
// //   <div className={`${bg} rounded-2xl p-5 border border-gray-200/50`}>
// //     <div className="flex items-center gap-2 mb-3">
// //       {icon}
// //       <span className="text-sm font-medium text-gray-600">{title}</span>
// //     </div>
// //     <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
// //   </div>
// // );

// // export default PropertyDashboard;

// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import {
// //   AlertTriangle,
// //   Video,
// //   Navigation,
// //   Users,
// //   RefreshCw,
// //   LayoutDashboard,
// //   Shield,
// //   Bell,
// //   Map,
// //   Plane,
// //   Grid3X3,
// //   Wifi,
// //   WifiOff,
// //   Radio,
// //   ArrowLeft
// // } from 'lucide-react';
// // import { useState } from 'react';

// // import { useProperty } from '../hooks/useProperties';
// // import { useCameras } from '../hooks/useCameras';
// // import { useAlerts } from '../hooks/useAlerts';
// // import { useDrones } from '../hooks/useDrones';
// // import CameraFeed from '../components/CameraFeed';
// // import HamburgerMenu from '../components/HamburgerMenu'; // Import the specific component
// // import { theme } from '../theme';

// // const PropertyDashboard = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [isRefreshing, setIsRefreshing] = useState(false);

// //   const { data: propertyData } = useProperty(id);
// //   const { data: cameras = [] } = useCameras(id);
// //   const { data: alertsData = [] } = useAlerts(id);
// //   const { data: drones = [] } = useDrones(id);

// //   const property = propertyData?.property || propertyData || {};
// //   const camerasList = cameras || [];
// //   const onlineCameras = camerasList.filter(c => c.is_online).length;

// //   const activeAlertCount = Array.isArray(alertsData)
// //     ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
// //     : 0;

// //   const handleRefresh = () => {
// //     setIsRefreshing(true);
// //     setTimeout(() => setIsRefreshing(false), 1000);
// //   };

// //   const navItems = [
// //     { icon: Grid3X3, label: 'Dashboard', path: `/property/${id}` },
// //     { icon: Bell, label: 'Alerts', path: `/property/${id}/alerts`, count: activeAlertCount },
// //     { icon: Map, label: 'Map', path: `/property/${id}/map` },
// //     { icon: Plane, label: 'Drone', path: `/property/${id}/drones` },
// //   ];

// //   return (
// //     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
// //       <main className="flex-1 flex flex-col overflow-hidden relative">

// //         {/* Header */}
// //       <header className={theme.header.wrapper} >
// //         <div className="flex items-center gap-4">
// //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //             <ArrowLeft className="h-5 w-5" />
// //           </button>
// //           <h2 className={theme.header.title}>{property.name}</h2>
// //         </div>
// //         <div className="flex items-center gap-4">
          
// //           <HamburgerMenu propertyId={id} />
// //         </div>
// //       </header>

// //         {/* CONTENT */}
// //         <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">

// //           {/* TOP SUMMARY CARDS */}
// //           <section className="px-6 lg:px-8 pt-6">
// //             <div className="grid grid-cols-3 gap-4 max-w-4xl">
// //               <SummaryCard
// //                 icon={<Plane size={20} className="text-gray-600" />}
// //                 title="Drone"
// //                 status={drones.some(d => d.status === 'online') ? 'Online' : 'Offline'}
// //                 statusColor={drones.some(d => d.status === 'online') ? 'text-emerald-600' : 'text-red-500'}
// //                 bg="bg-[#f0ede8]"
// //               />

// //               <SummaryCard
// //                 icon={<Video size={20} className="text-gray-600" />}
// //                 title="Cameras"
// //                 status={`${onlineCameras} / ${camerasList.length} Online`}
// //                 statusColor="text-emerald-600"
// //                 bg="bg-[#f0ede8]"
// //               />

// //               <SummaryCard
// //                 icon={<Bell size={20} className="text-gray-600" />}
// //                 title="Alerts"
// //                 status={`${activeAlertCount} New Alert${activeAlertCount !== 1 ? 's' : ''}`}
// //                 statusColor="text-emerald-600"
// //                 bg="bg-[#f0ede8]"
// //               />
// //             </div>
// //           </section>

// //           {/* DRONE LIVE FEEDS */}
// //           <section className="px-6 lg:px-8 mt-8">
// //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Drone Live Feeds</h3>
// //             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
// //               {drones.length > 0 ? (
// //                 drones.map((drone) => (
// //                   <div 
// //                     key={drone.id}
// //                     onClick={() => navigate(`/property/${id}/drones`)}
// //                     className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl relative overflow-hidden cursor-pointer group hover:ring-2 hover:ring-[#c5a880] transition-all"
// //                   >
// //                     <div className="absolute top-3 right-3 z-10">
// //                       <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
// //                         <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// //                         LIVE
// //                       </span>
// //                     </div>
// //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// //                       <Plane className="w-10 h-10 text-gray-400 mb-2" />
// //                       <p className="text-white font-semibold text-sm">{drone.name || 'Drone'}</p>
// //                       <p className="text-gray-400 text-xs mt-0.5">FPV Feed</p>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl flex flex-col items-center justify-center">
// //                   <Plane className="w-10 h-10 text-gray-500 mb-2" />
// //                   <p className="text-gray-400 text-sm">No drones connected</p>
// //                 </div>
// //               )}
// //             </div>
// //           </section>

// //           {/* LIVE CAMERA FEEDS */}
// //           <section className="px-6 lg:px-8 mt-8">
// //             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Live Camera Feeds</h3>
// //             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //               {camerasList.map((camera) => (
// //                 <div 
// //                   key={camera.id}
// //                   onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// //                   className="aspect-square bg-[#f0ede8] rounded-2xl border border-gray-200 relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
// //                 >
// //                   <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
// //                     <span className="text-white text-sm font-medium drop-shadow-md">{camera.name || 'Camera'}</span>
// //                     {camera.is_online ? (
// //                       <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">LIVE</span>
// //                     ) : (
// //                       <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">OFFLINE</span>
// //                     )}
// //                   </div>
// //                   {camera.is_online ? (
// //                     <div className="absolute inset-0">
// //                       <CameraFeed camera={camera} className="w-full h-full object-cover" />
// //                     </div>
// //                   ) : (
// //                     <div className="absolute inset-0 flex flex-col items-center justify-center">
// //                       <WifiOff className="w-8 h-8 text-gray-400 mb-2" />
// //                       <p className="text-gray-500 text-sm">Camera Offline</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           <div className="h-20 lg:hidden" />
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // /* UI COMPONENTS */
// // const SummaryCard = ({ icon, title, status, statusColor, bg }) => (
// //   <div className={`${bg} rounded-2xl p-5 border border-gray-200/50`}>
// //     <div className="flex items-center gap-2 mb-3">
// //       {icon}
// //       <span className="text-sm font-medium text-gray-600">{title}</span>
// //     </div>
// //     <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
// //   </div>
// // );

// // export default PropertyDashboard;

// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//   AlertTriangle,
//   Video,
//   Navigation,
//   Users,
//   RefreshCw,
//   LayoutDashboard,
//   Shield,
//   Bell,
//   Map,
//   Plane,
//   Grid3X3,
//   Wifi,
//   WifiOff,
//   Radio,
//   ArrowLeft
// } from 'lucide-react';
// import { useState } from 'react';

// import { useProperty } from '../hooks/useProperties';
// import { useCameras } from '../hooks/useCameras';
// import { useAlerts } from '../hooks/useAlerts';
// import { useDrones } from '../hooks/useDrones';
// import CameraFeed from '../components/CameraFeed';
// import HamburgerMenu from '../components/HamburgerMenu';
// import { theme } from '../theme';

// const PropertyDashboard = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const { data: propertyData } = useProperty(id);
//   const { data: cameras = [] } = useCameras(id);
//   const { data: alertsData = [] } = useAlerts(id);
//   const { data: drones = [] } = useDrones(id);

//   const property = propertyData?.property || propertyData || {};
//   const camerasList = cameras || [];
//   const onlineCameras = camerasList.filter(c => c.is_online).length;

//   const activeAlertCount = Array.isArray(alertsData)
//     ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
//     : 0;

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setTimeout(() => setIsRefreshing(false), 1000);
//   };

//   const navItems = [
//     { icon: Grid3X3, label: 'Dashboard', path: `/property/${id}` },
//     { icon: Bell,    label: 'Alerts',    path: `/property/${id}/alerts`, count: activeAlertCount },
//     { icon: Map,     label: 'Map',       path: `/property/${id}/map` },
//     { icon: Plane,   label: 'Drone',     path: `/property/${id}/drones` },
//   ];

//   return (
//     <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
//       <main className="flex-1 flex flex-col overflow-hidden relative">

//         {/* Header */}
//         <header className={theme.header.wrapper}>
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//             <h2 className={theme.header.title}>{property.name}</h2>
//           </div>
//           <div className="flex items-center gap-4">
//             <HamburgerMenu propertyId={id} />
//           </div>
//         </header>

//         {/* CONTENT */}
//         <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">

//           {/* TOP SUMMARY CARDS */}
//           <section className="px-6 lg:px-8 pt-6">
//             <div className="grid grid-cols-3 gap-4 max-w-4xl">
//               <SummaryCard
//                 icon={<Plane size={20} className="text-[#c5a880]" />}
//                 title="Drone"
//                 status={drones.some(d => d.status === 'online') ? 'Online' : 'Offline'}
//                 statusColor={drones.some(d => d.status === 'online')
//                   ? 'text-emerald-600'
//                   : 'text-red-500'}
//               />
//               <SummaryCard
//                 icon={<Video size={20} className="text-[#c5a880]" />}
//                 title="Cameras"
//                 status={`${onlineCameras} / ${camerasList.length} Online`}
//                 statusColor="text-emerald-600"
//               />
//               <SummaryCard
//                 icon={<Bell size={20} className="text-[#c5a880]" />}
//                 title="Alerts"
//                 status={`${activeAlertCount} New Alert${activeAlertCount !== 1 ? 's' : ''}`}
//                 statusColor="text-emerald-600"
//               />
//             </div>
//           </section>

//           {/* DRONE LIVE FEEDS */}
//           <section className="px-6 lg:px-8 mt-8">
//             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Drone Live Feeds</h3>
//             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
//               {drones.length > 0 ? (
//                 drones.map((drone) => (
//                   <div
//                     key={drone.id}
//                     onClick={() => navigate(`/property/${id}/drones`)}
//                     className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl
//                                relative overflow-hidden cursor-pointer group
//                                hover:ring-2 hover:ring-[#c5a880] transition-all"
//                   >
//                     <div className="absolute top-3 right-3 z-10">
//                       <span className="bg-emerald-600 text-white text-[10px] font-bold
//                                        px-2.5 py-1 rounded-md flex items-center gap-1">
//                         <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                         LIVE
//                       </span>
//                     </div>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <Plane className="w-10 h-10 text-gray-400 mb-2" />
//                       <p className="text-white font-semibold text-sm">
//                         {drone.name || 'Drone'}
//                       </p>
//                       <p className="text-gray-400 text-xs mt-0.5">FPV Feed</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex-shrink-0 w-72 h-48 bg-[#1e293b] rounded-2xl
//                                 flex flex-col items-center justify-center">
//                   <Plane className="w-10 h-10 text-gray-500 mb-2" />
//                   <p className="text-gray-400 text-sm">No drones connected</p>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* LIVE CAMERA FEEDS */}
//           <section className="px-6 lg:px-8 mt-8">
//             <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Live Camera Feeds</h3>
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {camerasList.map((camera) => (
//                 <div
//                   key={camera.id}
//                   onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
//                   className="aspect-square bg-[#e8ddd0] rounded-2xl
//                              border border-[#d4c4b0] relative overflow-hidden
//                              cursor-pointer group hover:shadow-lg transition-all"
//                 >
//                   <div className="absolute top-3 left-3 right-3 flex items-center
//                                   justify-between z-10">
//                     <span className="text-white text-sm font-medium drop-shadow-md">
//                       {camera.name || 'Camera'}
//                     </span>
//                     {camera.is_online ? (
//                       <span className="bg-red-500 text-white text-[10px]
//                                        font-bold px-2 py-1 rounded-md">LIVE</span>
//                     ) : (
//                       <span className="bg-gray-500 text-white text-[10px]
//                                        font-bold px-2 py-1 rounded-md">OFFLINE</span>
//                     )}
//                   </div>
//                   {camera.is_online ? (
//                     <div className="absolute inset-0">
//                       <CameraFeed camera={camera} className="w-full h-full object-cover" />
//                     </div>
//                   ) : (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <WifiOff className="w-8 h-8 text-[#c5a880] mb-2" />
//                       <p className="text-[#8a7560] text-sm">Camera Offline</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           <div className="h-20 lg:hidden" />
//         </div>
//       </main>
//     </div>
//   );
// };

// /* ── UI COMPONENTS ── */
// const SummaryCard = ({ icon, title, status, statusColor }) => (
//   <div className="bg-[#e8ddd0] rounded-2xl p-5
//                   border border-[#d4c4b0]
//                   shadow-[0_2px_12px_rgba(197,168,128,0.20)]">
//     <div className="flex items-center gap-2 mb-3">
//       {icon}
//       <span className="text-sm font-medium text-[#8a7560]">{title}</span>
//     </div>
//     <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
//   </div>
// );

// export default PropertyDashboard;

import { useParams, useNavigate } from 'react-router-dom';
import {
  Video, Bell, Map, Plane, Grid3X3, WifiOff, ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

import { useProperty } from '../hooks/useProperties';
import { useCameras } from '../hooks/useCameras';
import { useAlerts } from '../hooks/useAlerts';
import { useDrones } from '../hooks/useDrones';
import CameraFeed from '../components/CameraFeed';
import DroneFeed from '../components/DroneFeed';
import HamburgerMenu from '../components/HamburgerMenu';
import { theme } from '../theme';

const PropertyDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: propertyData } = useProperty(id);
  const { data: cameras = [] } = useCameras(id);
  const { data: alertsData = [] } = useAlerts(id);
  const { data: drones = [] } = useDrones(id);

  const property     = propertyData?.property || propertyData || {};
  const camerasList  = cameras || [];
  const onlineCameras = camerasList.filter(c => c.is_online).length;

  const activeAlertCount = Array.isArray(alertsData)
    ? alertsData.filter(a => a.status === 'active' && !a.is_read).length
    : 0;

  return (
    <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* Header */}
        <header className={theme.header.wrapper}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className={theme.header.title}>{property.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <HamburgerMenu propertyId={id} />
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">

          {/* SUMMARY CARDS */}
          <section className="px-6 lg:px-8 pt-6">
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
              <SummaryCard
                icon={<Plane size={20} className="text-[#c5a880]" />}
                title="Drone"
                status={drones.some(d => d.status?.toLowerCase() === 'online') ? 'Online' : 'Offline'}
                statusColor={drones.some(d => d.status?.toLowerCase() === 'online')
                  ? 'text-emerald-600' : 'text-red-500'}
                  onClick={() => navigate(`/property/${id}/drones`)}
              />
              <SummaryCard
                icon={<Video size={20} className="text-[#c5a880]" />}
                title="Cameras"
                status={`${onlineCameras} / ${camerasList.length} Online`}
                statusColor="text-emerald-600"
                onClick={() => navigate(`/property/${id}/cameras`)}
              />
              <SummaryCard
                icon={<Bell size={20} className="text-[#c5a880]" />}
                title="Alerts"
                status={`${activeAlertCount} New Alert${activeAlertCount !== 1 ? 's' : ''}`}
                statusColor="text-emerald-600"
                onClick={() => navigate(`/property/${id}/alerts`)} 
              />
            </div>
           
          </section>

          {/* DRONE LIVE FEEDS */}
          <section className="px-6 lg:px-8 mt-8">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Drone Live Feeds</h3>

            {drones.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {drones.map((drone) => (
                  <div
                    key={drone.id}
                    className="aspect-square rounded-2xl relative overflow-hidden
                               hover:ring-2 hover:ring-[#c5a880] transition-all"
                  >
                    {/* DroneFeed uses absolute inset-0 — fills this box completely */}
                    <DroneFeed
                      drone={drone}
                      onClick={() => navigate(`/property/${id}/drone/${drone.id}/live`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-72 h-48 bg-[#1e293b] rounded-2xl
                              flex flex-col items-center justify-center">
                <Plane className="w-10 h-10 text-gray-500 mb-2" />
                <p className="text-gray-400 text-sm">No drones connected</p>
              </div>
            )}
          </section>

          {/* LIVE CAMERA FEEDS */}
          <section className="px-6 lg:px-8 mt-8">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-4">Live Camera Feeds</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {camerasList.map((camera) => (
                <div
                  key={camera.id}
                  className="aspect-square rounded-2xl relative overflow-hidden
                             cursor-pointer group hover:shadow-lg
                             hover:ring-2 hover:ring-[#c5a880] transition-all"
                >
                  {camera.is_online ? (
                    /* CameraFeed uses absolute inset-0 — fills this box completely */
                    <CameraFeed
                      camera={camera}
                      onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
                    />
                  ) : (
                    <div
                      onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
                      className="absolute inset-0 bg-[#e8ddd0] border border-[#d4c4b0]
                                 flex flex-col items-center justify-center rounded-2xl"
                    >
                      {/* camera name top-left */}
                      <span className="absolute top-3 left-3 text-[#5a4a3a] text-sm font-medium">
                        {camera.name || 'Camera'}
                      </span>
                      <span className="absolute top-3 right-3 bg-gray-500 text-white
                                       text-[10px] font-bold px-2 py-1 rounded-md">
                        OFFLINE
                      </span>
                      <WifiOff className="w-8 h-8 text-[#c5a880] mb-2" />
                      <p className="text-[#8a7560] text-sm">Camera Offline</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="h-20 lg:hidden" />
        </div>
      </main>
    </div>
  );
};

// const SummaryCard = ({ icon, title, status, statusColor }) => (
//   <div className="bg-[#e8ddd0] rounded-2xl p-5 border border-[#d4c4b0]
//                   shadow-[0_2px_12px_rgba(197,168,128,0.20)]">
//     <div className="flex items-center gap-2 mb-3">
//       {icon}
//       <span className="text-sm font-medium text-[#8a7560]">{title}</span>
//     </div>
//     <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
//   </div>
// );
const SummaryCard = ({ icon, title, status, statusColor, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#e8ddd0] rounded-2xl p-5 border border-[#d4c4b0]
                shadow-[0_2px_12px_rgba(197,168,128,0.20)]
                ${onClick ? 'cursor-pointer hover:shadow-[0_4px_20px_rgba(197,168,128,0.35)] hover:scale-[1.02]' : ''}
                transition-all duration-200`}
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="text-sm font-medium text-[#8a7560]">{title}</span>
    </div>
    <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
  </div>
);

export default PropertyDashboard;