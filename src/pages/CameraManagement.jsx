// // // // // // // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // // // // // // import {
// // // // // // // // // // // //   ArrowLeft, Plus, Edit2, Trash2, Video, Loader2,
// // // // // // // // // // // //   AlertCircle, Shield, DoorOpen, Eye, RotateCcw,
// // // // // // // // // // // // } from 'lucide-react'
// // // // // // // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // // // // // // import { useState, useEffect } from 'react'
// // // // // // // // // // // // import { theme } from '../theme'

// // // // // // // // // // // // // ── Authenticated frame thumbnail ─────────────
// // // // // // // // // // // // const CameraFrame = ({ cameraId, isOnline }) => {
// // // // // // // // // // // //   const [src,     setSrc]     = useState(null)
// // // // // // // // // // // //   const [loading, setLoading] = useState(true)
// // // // // // // // // // // //   const [error,   setError]   = useState(false)

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     if (!isOnline) { setLoading(false); setError(true); return }
// // // // // // // // // // // //     let objectUrl = null
// // // // // // // // // // // //     let cancelled = false
// // // // // // // // // // // //     const load = async () => {
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const token = localStorage.getItem('token')
// // // // // // // // // // // //         const base  = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // // // // // // // // // //         const res   = await fetch(
// // // // // // // // // // // //           `${base}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // // // // // // // // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // // // // // // // // // //         )
// // // // // // // // // // // //         if (!res.ok) throw new Error('offline')
// // // // // // // // // // // //         const blob = await res.blob()
// // // // // // // // // // // //         objectUrl  = URL.createObjectURL(blob)
// // // // // // // // // // // //         if (!cancelled) { setSrc(objectUrl); setError(false) }
// // // // // // // // // // // //       } catch {
// // // // // // // // // // // //         if (!cancelled) setError(true)
// // // // // // // // // // // //       } finally {
// // // // // // // // // // // //         if (!cancelled) setLoading(false)
// // // // // // // // // // // //       }
// // // // // // // // // // // //     }
// // // // // // // // // // // //     load()
// // // // // // // // // // // //     return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl) }
// // // // // // // // // // // //   }, [cameraId, isOnline])

// // // // // // // // // // // //   if (loading) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1c]">
// // // // // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     )
// // // // // // // // // // // //   }

// // // // // // // // // // // //   if (error || !src) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="absolute inset-0 flex flex-col items-center
// // // // // // // // // // // //                       justify-center bg-[#1c1c1c]">
// // // // // // // // // // // //         <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
// // // // // // // // // // // //         <span className="text-red-400 text-xs font-bold uppercase tracking-widest">
// // // // // // // // // // // //           Offline
// // // // // // // // // // // //         </span>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     )
// // // // // // // // // // // //   }

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <>
// // // // // // // // // // // //       <img src={src} alt="live" className="w-full h-full object-cover" />
// // // // // // // // // // // //       <div className="absolute top-2 right-2">
// // // // // // // // // // // //         <span className={theme.badge.live}>
// // // // // // // // // // // //           <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// // // // // // // // // // // //           Live
// // // // // // // // // // // //         </span>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     </>
// // // // // // // // // // // //   )
// // // // // // // // // // // // }

// // // // // // // // // // // // // ── Main component ────────────────────────────
// // // // // // // // // // // // const CameraManagement = () => {
// // // // // // // // // // // //   const { id } = useParams()
// // // // // // // // // // // //   const navigate = useNavigate()
// // // // // // // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // // // // // // //   )

// // // // // // // // // // // //   if (isLoading) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     )
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const filterOptions = [
// // // // // // // // // // // //     { value: 'all',      label: 'All' },
// // // // // // // // // // // //     { value: 'entrance', label: 'Entrance' },
// // // // // // // // // // // //     { value: 'insider',  label: 'Insider' },
// // // // // // // // // // // //     { value: 'fence',    label: 'Fence' },
// // // // // // // // // // // //   ]

// // // // // // // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // // // // // // //     switch (type) {
// // // // // // // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // // // // // // //       case 'insider':  return { icon: Eye,      label: 'Insider',  badge: theme.badge.success }
// // // // // // // // // // // //       case 'fence':    return { icon: Shield,   label: 'Fence',    badge: theme.badge.dark }
// // // // // // // // // // // //       default:         return { icon: Video,    label: 'Unknown',  badge: theme.badge.outline }
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div className={`${theme.page.wrapper} pb-24`}>

// // // // // // // // // // // //       {/* Header */}
// // // // // // // // // // // //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
// // // // // // // // // // // //                       flex items-center gap-3 shadow-sm">
// // // // // // // // // // // //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // // // // // // //           <ArrowLeft className="h-5 w-5" />
// // // // // // // // // // // //         </button>
// // // // // // // // // // // //         <h2 className={`${theme.type.h3} flex-1`}>
// // // // // // // // // // // //           Cameras ({cameras.length})
// // // // // // // // // // // //         </h2>
// // // // // // // // // // // //         <HamburgerMenu propertyId={id} />
// // // // // // // // // // // //       </div>

// // // // // // // // // // // //       {/* Filter tabs */}
// // // // // // // // // // // //       <div className="flex px-5 gap-2 mt-4 overflow-x-auto">
// // // // // // // // // // // //         {filterOptions.map((f) => (
// // // // // // // // // // // //           <button
// // // // // // // // // // // //             key={f.value}
// // // // // // // // // // // //             onClick={() => setFilter(f.value)}
// // // // // // // // // // // //             className={`flex-1 py-2 px-4 rounded-full font-sans font-bold
// // // // // // // // // // // //                         text-sm transition-all whitespace-nowrap
// // // // // // // // // // // //                         ${filter === f.value
// // // // // // // // // // // //                           ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.20)]'
// // // // // // // // // // // //                           : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // // // // // // //           >
// // // // // // // // // // // //             {f.label}
// // // // // // // // // // // //           </button>
// // // // // // // // // // // //         ))}
// // // // // // // // // // // //       </div>

// // // // // // // // // // // //       {/* Camera cards */}
// // // // // // // // // // // //       <div className="p-5 space-y-4">
// // // // // // // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // // // // // // //           <div className={`${theme.card.base} flex flex-col items-center
// // // // // // // // // // // //                            text-center py-12 gap-4`}>
// // // // // // // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // // // // // // //             <p className={theme.type.bodySm}>
// // // // // // // // // // // //               No {filter === 'all' ? '' : filter} cameras found
// // // // // // // // // // // //             </p>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         ) : (
// // // // // // // // // // // //           filteredCameras.map((camera) => {
// // // // // // // // // // // //             const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // // // // // // //             const TypeIcon   = typeConfig.icon

// // // // // // // // // // // //             return (
// // // // // // // // // // // //               <div key={camera.id}
// // // // // // // // // // // //                    className="bg-white border border-[#e6e3db] rounded-[2rem]
// // // // // // // // // // // //                                overflow-hidden shadow-sm">

// // // // // // // // // // // //                 {/* Thumbnail */}
// // // // // // // // // // // //                 <div
// // // // // // // // // // // //                   className="relative h-36 bg-[#1c1c1c] cursor-pointer
// // // // // // // // // // // //                               hover:opacity-90 transition-opacity"
// // // // // // // // // // // //                   onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // // // // // // // // // // //                 >
// // // // // // // // // // // //                   <CameraFrame cameraId={camera.id} isOnline={camera.is_online} />

// // // // // // // // // // // //                   {/* Type badge */}
// // // // // // // // // // // //                   <div className="absolute top-3 left-3">
// // // // // // // // // // // //                     <span className={typeConfig.badge}>
// // // // // // // // // // // //                       <TypeIcon className="w-3 h-3" />
// // // // // // // // // // // //                       {typeConfig.label}
// // // // // // // // // // // //                     </span>
// // // // // // // // // // // //                   </div>

// // // // // // // // // // // //                   {/* Name overlay */}
// // // // // // // // // // // //                   <div className="absolute bottom-0 left-0 right-0
// // // // // // // // // // // //                                   bg-gradient-to-t from-black/80 to-transparent
// // // // // // // // // // // //                                   px-4 py-3">
// // // // // // // // // // // //                     <h3 className="text-white font-sans font-black text-sm truncate">
// // // // // // // // // // // //                       {camera.name}
// // // // // // // // // // // //                     </h3>
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 </div>

// // // // // // // // // // // //                 {/* Info & actions */}
// // // // // // // // // // // //                 <div className="px-4 py-3">
// // // // // // // // // // // //                   <p className="font-mono text-xs text-gray-400 truncate mb-3">
// // // // // // // // // // // //                     {camera.rtsp_url}
// // // // // // // // // // // //                   </p>

// // // // // // // // // // // //                   <div className="flex items-center justify-between">
// // // // // // // // // // // //                     <div className="flex items-center gap-3">
// // // // // // // // // // // //                       <span className={theme.type.labelSm}>
// // // // // // // // // // // //                         📍 ({camera.grid_cell?.row}, {camera.grid_cell?.col})
// // // // // // // // // // // //                       </span>
// // // // // // // // // // // //                       <span className={`${theme.type.labelSm}
// // // // // // // // // // // //                                         ${camera.is_online
// // // // // // // // // // // //                                           ? 'text-emerald-500'
// // // // // // // // // // // //                                           : 'text-red-500'}`}>
// // // // // // // // // // // //                         {camera.is_online ? '● Online' : '● Offline'}
// // // // // // // // // // // //                       </span>
// // // // // // // // // // // //                     </div>

// // // // // // // // // // // //                     <div className="flex items-center gap-1">
// // // // // // // // // // // //                       {camera.camera_type === 'fence' && (
// // // // // // // // // // // //                         <button
// // // // // // // // // // // //                           onClick={(e) => {
// // // // // // // // // // // //                             e.stopPropagation()
// // // // // // // // // // // //                             navigate(`/property/${id}/camera/${camera.id}/calibrate`)
// // // // // // // // // // // //                           }}
// // // // // // // // // // // //                           className="p-2 rounded-full hover:bg-[#faf9f6] text-[#c5a880]
// // // // // // // // // // // //                                      transition-all active:scale-95"
// // // // // // // // // // // //                           title="Edit Polygon Calibration"
// // // // // // // // // // // //                         >
// // // // // // // // // // // //                           <RotateCcw className="h-4 w-4" />
// // // // // // // // // // // //                         </button>
// // // // // // // // // // // //                       )}
// // // // // // // // // // // //                       <button
// // // // // // // // // // // //                         onClick={(e) => {
// // // // // // // // // // // //                           e.stopPropagation()
// // // // // // // // // // // //                           navigate(`/property/${id}/camera/${camera.id}/edit`)
// // // // // // // // // // // //                         }}
// // // // // // // // // // // //                         className={theme.button.icon}
// // // // // // // // // // // //                         title="Edit Camera"
// // // // // // // // // // // //                       >
// // // // // // // // // // // //                         <Edit2 className="h-4 w-4" />
// // // // // // // // // // // //                       </button>
// // // // // // // // // // // //                       <button
// // // // // // // // // // // //                         onClick={(e) => {
// // // // // // // // // // // //                           e.stopPropagation()
// // // // // // // // // // // //                           handleDelete(camera.id)
// // // // // // // // // // // //                         }}
// // // // // // // // // // // //                         className="p-2.5 rounded-full hover:bg-red-50 text-red-500
// // // // // // // // // // // //                                    active:scale-95 transition-all"
// // // // // // // // // // // //                         title="Delete Camera"
// // // // // // // // // // // //                       >
// // // // // // // // // // // //                         <Trash2 className="h-4 w-4" />
// // // // // // // // // // // //                       </button>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 </div>

// // // // // // // // // // // //               </div>
// // // // // // // // // // // //             )
// // // // // // // // // // // //           })
// // // // // // // // // // // //         )}
// // // // // // // // // // // //       </div>

// // // // // // // // // // // //       {/* FAB */}
// // // // // // // // // // // //       <button
// // // // // // // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // // // // //         className={theme.ui.fab}
// // // // // // // // // // // //       >
// // // // // // // // // // // //         <Plus className="h-6 w-6" />
// // // // // // // // // // // //       </button>

// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   )
// // // // // // // // // // // // }

// // // // // // // // // // // // export default CameraManagement

// // // // // // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // // // // // import {
// // // // // // // // // // //   ArrowLeft, Plus, Edit2, Trash2, Video, Loader2,
// // // // // // // // // // //   AlertCircle, Shield, DoorOpen, Eye, RotateCcw,
// // // // // // // // // // // } from 'lucide-react'
// // // // // // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // // // // // import { useState, useEffect } from 'react'
// // // // // // // // // // // import { theme } from '../theme'

// // // // // // // // // // // // ── Authenticated frame thumbnail ─────────────
// // // // // // // // // // // const CameraFrame = ({ cameraId, isOnline }) => {
// // // // // // // // // // //   const [src, setSrc] = useState(null)
// // // // // // // // // // //   const [loading, setLoading] = useState(true)
// // // // // // // // // // //   const [error, setError] = useState(false)

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     if (!isOnline) { setLoading(false); setError(true); return }
// // // // // // // // // // //     let objectUrl = null
// // // // // // // // // // //     let cancelled = false
// // // // // // // // // // //     const load = async () => {
// // // // // // // // // // //       try {
// // // // // // // // // // //         const token = localStorage.getItem('token')
// // // // // // // // // // //         const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // // // // // // // // //         const res = await fetch(
// // // // // // // // // // //           `${base}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // // // // // // // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // // // // // // // // //         )
// // // // // // // // // // //         if (!res.ok) throw new Error('offline')
// // // // // // // // // // //         const blob = await res.blob()
// // // // // // // // // // //         objectUrl = URL.createObjectURL(blob)
// // // // // // // // // // //         if (!cancelled) { setSrc(objectUrl); setError(false) }
// // // // // // // // // // //       } catch {
// // // // // // // // // // //         if (!cancelled) setError(true)
// // // // // // // // // // //       } finally {
// // // // // // // // // // //         if (!cancelled) setLoading(false)
// // // // // // // // // // //       }
// // // // // // // // // // //     }
// // // // // // // // // // //     load()
// // // // // // // // // // //     return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl) }
// // // // // // // // // // //   }, [cameraId, isOnline])

// // // // // // // // // // //   if (loading) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1c]">
// // // // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // // // //       </div>
// // // // // // // // // // //     )
// // // // // // // // // // //   }

// // // // // // // // // // //   if (error || !src) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c]">
// // // // // // // // // // //         <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
// // // // // // // // // // //         <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Offline</span>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     )
// // // // // // // // // // //   }

// // // // // // // // // // //   return (
// // // // // // // // // // //     <>
// // // // // // // // // // //       <img src={src} alt="live" className="w-full h-full object-cover" />
// // // // // // // // // // //       <div className="absolute top-2 right-2">
// // // // // // // // // // //         <span className={theme.badge.live}>
// // // // // // // // // // //           <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
// // // // // // // // // // //           Live
// // // // // // // // // // //         </span>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </>
// // // // // // // // // // //   )
// // // // // // // // // // // }

// // // // // // // // // // // // ── Main component ────────────────────────────
// // // // // // // // // // // const CameraManagement = () => {
// // // // // // // // // // //   const { id } = useParams()
// // // // // // // // // // //   const navigate = useNavigate()
// // // // // // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // // // // // //     try {
// // // // // // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // // // // // //   )

// // // // // // // // // // //   if (isLoading) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // // // //       </div>
// // // // // // // // // // //     )
// // // // // // // // // // //   }

// // // // // // // // // // //   const filterOptions = [
// // // // // // // // // // //     { value: 'all', label: 'All' },
// // // // // // // // // // //     { value: 'entrance', label: 'Entrance' },
// // // // // // // // // // //     { value: 'insider', label: 'Insider' },
// // // // // // // // // // //     { value: 'fence', label: 'Fence' },
// // // // // // // // // // //   ]

// // // // // // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // // // // // //     switch (type) {
// // // // // // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // // // // // //       case 'insider': return { icon: Eye, label: 'Insider', badge: theme.badge.success }
// // // // // // // // // // //       case 'fence': return { icon: Shield, label: 'Fence', badge: theme.badge.dark }
// // // // // // // // // // //       default: return { icon: Video, label: 'Unknown', badge: theme.badge.outline }
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // // // // // // //       {/* Desktop Optimized Header */}
// // // // // // // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // // // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // // // // // // //             </button>
// // // // // // // // // // //             <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // // // // // // // //           </div>
// // // // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // // // //               className={`${theme.button.dark} h-10 px-6 text-xs uppercase tracking-widest font-black hidden md:flex items-center gap-2`}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Plus className="w-4 h-4" /> Add Camera
// // // // // // // // // // //             </button>
// // // // // // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </header>

// // // // // // // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // // // // // // //         {/* Filter Selection */}
// // // // // // // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
// // // // // // // // // // //           {filterOptions.map((f) => (
// // // // // // // // // // //             <button
// // // // // // // // // // //               key={f.value}
// // // // // // // // // // //               onClick={() => setFilter(f.value)}
// // // // // // // // // // //               className={`py-2 px-6 rounded-full font-sans font-bold text-xs transition-all whitespace-nowrap
// // // // // // // // // // //                 ${filter === f.value
// // // // // // // // // // //                   ? 'bg-[#1c1c1c] text-white shadow-lg'
// // // // // // // // // // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // // // // // //             >
// // // // // // // // // // //               {f.label}
// // // // // // // // // // //             </button>
// // // // // // // // // // //           ))}
// // // // // // // // // // //         </div>

// // // // // // // // // // //         {/* Camera Desktop Grid */}
// // // // // // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // // // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-24 gap-4`}>
// // // // // // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // // // // // //             <p className={theme.type.bodySm}>No {filter === 'all' ? '' : filter} cameras found</p>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         ) : (
// // // // // // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // // // // // // // //             {filteredCameras.map((camera) => {
// // // // // // // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // // // // // //               const TypeIcon = typeConfig.icon

// // // // // // // // // // //               return (
// // // // // // // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
// // // // // // // // // // //                   {/* Thumbnail Area */}
// // // // // // // // // // //                   <div
// // // // // // // // // // //                     className="relative h-48 bg-[#1c1c1c] cursor-pointer hover:opacity-95 transition-opacity"
// // // // // // // // // // //                     onClick={() => navigate(`/property/${id}/camera/${camera.id}`)}
// // // // // // // // // // //                   >
// // // // // // // // // // //                     <CameraFrame cameraId={camera.id} isOnline={camera.is_online} />
// // // // // // // // // // //                     <div className="absolute top-4 left-4">
// // // // // // // // // // //                       <span className={typeConfig.badge}>
// // // // // // // // // // //                         <TypeIcon className="w-3 h-3" />
// // // // // // // // // // //                         {typeConfig.label}
// // // // // // // // // // //                       </span>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
// // // // // // // // // // //                       <h3 className="text-white font-sans font-black text-sm truncate">{camera.name}</h3>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                   </div>

// // // // // // // // // // //                   {/* Info & Footer Actions */}
// // // // // // // // // // //                   <div className="p-5 flex flex-col flex-1">
// // // // // // // // // // //                     <p className="font-mono text-[10px] text-gray-400 truncate mb-4 bg-[#faf9f6] p-2 rounded-lg">
// // // // // // // // // // //                       {camera.rtsp_url}
// // // // // // // // // // //                     </p>

// // // // // // // // // // //                     <div className="mt-auto flex items-center justify-between">
// // // // // // // // // // //                       <span className={`${theme.type.labelSm} font-black ${camera.is_online ? 'text-emerald-500' : 'text-red-500'}`}>
// // // // // // // // // // //                         {camera.is_online ? '● ONLINE' : '● OFFLINE'}
// // // // // // // // // // //                       </span>

// // // // // // // // // // //                       <div className="flex items-center gap-1">
// // // // // // // // // // //                         {camera.camera_type === 'fence' && (
// // // // // // // // // // //                           <button
// // // // // // // // // // //                             onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/calibrate`) }}
// // // // // // // // // // //                             className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-[#c5a880] transition-all"
// // // // // // // // // // //                             title="Calibrate"
// // // // // // // // // // //                           >
// // // // // // // // // // //                             <RotateCcw className="h-4 w-4" />
// // // // // // // // // // //                           </button>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                         <button
// // // // // // // // // // //                           onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/edit`) }}
// // // // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-all"
// // // // // // // // // // //                           title="Edit"
// // // // // // // // // // //                         >
// // // // // // // // // // //                           <Edit2 className="h-4 w-4" />
// // // // // // // // // // //                         </button>
// // // // // // // // // // //                         <button
// // // // // // // // // // //                           onClick={(e) => { e.stopPropagation(); handleDelete(camera.id) }}
// // // // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
// // // // // // // // // // //                           title="Delete"
// // // // // // // // // // //                         >
// // // // // // // // // // //                           <Trash2 className="h-4 w-4" />
// // // // // // // // // // //                         </button>
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 </div>
// // // // // // // // // // //               )
// // // // // // // // // // //             })}
// // // // // // // // // // //           </div>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </main>

// // // // // // // // // // //       {/* Floating Action Button for Mobile, but also keeping the top button for Desktop */}
// // // // // // // // // // //       <button
// // // // // // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // // // // // // // //       >
// // // // // // // // // // //         <Plus className="h-6 w-6" />
// // // // // // // // // // //       </button>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   )
// // // // // // // // // // // }

// // // // // // // // // // // export default CameraManagement

// // // // // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // // // // import {
// // // // // // // // // //   ArrowLeft, Plus, Edit2, Trash2, Video,
// // // // // // // // // //   Shield, DoorOpen, Eye, RotateCcw,
// // // // // // // // // // } from 'lucide-react'
// // // // // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // // // // import { useState } from 'react'
// // // // // // // // // // import { theme } from '../theme'

// // // // // // // // // // // ── Main component ────────────────────────────
// // // // // // // // // // const CameraManagement = () => {
// // // // // // // // // //   const { id } = useParams()
// // // // // // // // // //   const navigate = useNavigate()
// // // // // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // // // // //     try {
// // // // // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // // // // //   )

// // // // // // // // // //   if (isLoading) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // // //       </div>
// // // // // // // // // //     )
// // // // // // // // // //   }

// // // // // // // // // //   const filterOptions = [
// // // // // // // // // //     { value: 'all', label: 'All' },
// // // // // // // // // //     { value: 'entrance', label: 'Entrance' },
// // // // // // // // // //     { value: 'insider', label: 'Insider' },
// // // // // // // // // //     { value: 'fence', label: 'Fence' },
// // // // // // // // // //   ]

// // // // // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // // // // //     switch (type) {
// // // // // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // // // // //       case 'insider': return { icon: Eye, label: 'Insider', badge: theme.badge.success }
// // // // // // // // // //       case 'fence': return { icon: Shield, label: 'Fence', badge: theme.badge.dark }
// // // // // // // // // //       default: return { icon: Video, label: 'Unknown', badge: theme.badge.outline }
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // // // // // //       {/* Header */}
// // // // // // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // // // // // //             </button>
// // // // // // // // // //             <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // // // // // // //           </div>
// // // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // // //               className={`${theme.button.dark} h-10 px-6 text-xs uppercase tracking-widest font-black hidden md:flex items-center gap-2`}
// // // // // // // // // //             >
// // // // // // // // // //               <Plus className="w-4 h-4" /> Add Camera
// // // // // // // // // //             </button>
// // // // // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </header>

// // // // // // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // // // // // //         {/* Filter Selection */}
// // // // // // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
// // // // // // // // // //           {filterOptions.map((f) => (
// // // // // // // // // //             <button
// // // // // // // // // //               key={f.value}
// // // // // // // // // //               onClick={() => setFilter(f.value)}
// // // // // // // // // //               className={`py-2 px-6 rounded-full font-sans font-bold text-xs transition-all whitespace-nowrap
// // // // // // // // // //                 ${filter === f.value
// // // // // // // // // //                   ? 'bg-[#1c1c1c] text-white shadow-lg'
// // // // // // // // // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // // // // //             >
// // // // // // // // // //               {f.label}
// // // // // // // // // //             </button>
// // // // // // // // // //           ))}
// // // // // // // // // //         </div>

// // // // // // // // // //         {/* Camera Desktop Grid */}
// // // // // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-24 gap-4`}>
// // // // // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // // // // //             <p className={theme.type.bodySm}>No {filter === 'all' ? '' : filter} cameras found</p>
// // // // // // // // // //           </div>
// // // // // // // // // //         ) : (
// // // // // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // // // // // // //             {filteredCameras.map((camera) => {
// // // // // // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // // // // //               const TypeIcon = typeConfig.icon

// // // // // // // // // //               return (
// // // // // // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
// // // // // // // // // //                   {/* Static Placeholder (Replaces Stream) */}
// // // // // // // // // //                   <div
// // // // // // // // // //                     className="relative h-48 bg-[#1c1c1c] flex items-center justify-center"
// // // // // // // // // //                   >
// // // // // // // // // //                     <Video className="h-12 w-12 text-white/20" />
                    
// // // // // // // // // //                     <div className="absolute top-4 left-4">
// // // // // // // // // //                       <span className={typeConfig.badge}>
// // // // // // // // // //                         <TypeIcon className="w-3 h-3" />
// // // // // // // // // //                         {typeConfig.label}
// // // // // // // // // //                       </span>
// // // // // // // // // //                     </div>
                    
// // // // // // // // // //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
// // // // // // // // // //                       <h3 className="text-white font-sans font-black text-sm truncate">{camera.name}</h3>
// // // // // // // // // //                     </div>
// // // // // // // // // //                   </div>

// // // // // // // // // //                   {/* Info & Footer Actions */}
// // // // // // // // // //                   <div className="p-5 flex flex-col flex-1">
// // // // // // // // // //                     <p className="font-mono text-[10px] text-gray-400 truncate mb-4 bg-[#faf9f6] p-2 rounded-lg">
// // // // // // // // // //                       {camera.rtsp_url}
// // // // // // // // // //                     </p>

// // // // // // // // // //                     <div className="mt-auto flex items-center justify-between">
// // // // // // // // // //                       <span className={`${theme.type.labelSm} font-black ${camera.is_online ? 'text-emerald-500' : 'text-red-500'}`}>
// // // // // // // // // //                         {camera.is_online ? '● CONFIGURED' : '● OFFLINE'}
// // // // // // // // // //                       </span>

// // // // // // // // // //                       <div className="flex items-center gap-1">
// // // // // // // // // //                         {camera.camera_type === 'fence' && (
// // // // // // // // // //                           <button
// // // // // // // // // //                             onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/calibrate`) }}
// // // // // // // // // //                             className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-[#c5a880] transition-all"
// // // // // // // // // //                             title="Calibrate"
// // // // // // // // // //                           >
// // // // // // // // // //                             <RotateCcw className="h-4 w-4" />
// // // // // // // // // //                           </button>
// // // // // // // // // //                         )}
// // // // // // // // // //                         <button
// // // // // // // // // //                           onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/edit`) }}
// // // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-all"
// // // // // // // // // //                           title="Edit"
// // // // // // // // // //                         >
// // // // // // // // // //                           <Edit2 className="h-4 w-4" />
// // // // // // // // // //                         </button>
// // // // // // // // // //                         <button
// // // // // // // // // //                           onClick={(e) => { e.stopPropagation(); handleDelete(camera.id) }}
// // // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
// // // // // // // // // //                           title="Delete"
// // // // // // // // // //                         >
// // // // // // // // // //                           <Trash2 className="h-4 w-4" />
// // // // // // // // // //                         </button>
// // // // // // // // // //                       </div>
// // // // // // // // // //                     </div>
// // // // // // // // // //                   </div>
// // // // // // // // // //                 </div>
// // // // // // // // // //               )
// // // // // // // // // //             })}
// // // // // // // // // //           </div>
// // // // // // // // // //         )}
// // // // // // // // // //       </main>

// // // // // // // // // //       {/* FAB for Mobile Only */}
// // // // // // // // // //       <button
// // // // // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // // // // // // //       >
// // // // // // // // // //         <Plus className="h-6 w-6" />
// // // // // // // // // //       </button>
// // // // // // // // // //     </div>
// // // // // // // // // //   )
// // // // // // // // // // }

// // // // // // // // // // export default CameraManagement

// // // // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // // // import {
// // // // // // // // //   ArrowLeft, Plus, Edit2, Trash2, Video,
// // // // // // // // //   Shield, DoorOpen, Eye, RotateCcw,
// // // // // // // // // } from 'lucide-react'
// // // // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // // // import { useState } from 'react'
// // // // // // // // // import { theme } from '../theme'

// // // // // // // // // // ── Main component ────────────────────────────
// // // // // // // // // const CameraManagement = () => {
// // // // // // // // //   const { id } = useParams()
// // // // // // // // //   const navigate = useNavigate()
// // // // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // // // //     try {
// // // // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // // // //     } catch (err) {
// // // // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // // // //   )

// // // // // // // // //   if (isLoading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className={theme.page.centered}>
// // // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // // //       </div>
// // // // // // // // //     )
// // // // // // // // //   }

// // // // // // // // //   const filterOptions = [
// // // // // // // // //     { value: 'all', label: 'All' },
// // // // // // // // //     { value: 'entrance', label: 'Entrance' },
// // // // // // // // //     { value: 'insider', label: 'Insider' },
// // // // // // // // //     { value: 'fence', label: 'Fence' },
// // // // // // // // //   ]

// // // // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // // // //     switch (type) {
// // // // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // // // //       case 'insider': return { icon: Eye, label: 'Insider', badge: theme.badge.success }
// // // // // // // // //       case 'fence': return { icon: Shield, label: 'Fence', badge: theme.badge.dark }
// // // // // // // // //       default: return { icon: Video, label: 'Unknown', badge: theme.badge.outline }
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // // // // //       {/* Header */}
// // // // // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // // // // //             </button>
// // // // // // // // //             <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // // // // // //           </div>
// // // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // //               className={`${theme.button.dark} h-10 px-6 text-xs uppercase tracking-widest font-black hidden md:flex items-center gap-2`}
// // // // // // // // //             >
// // // // // // // // //               <Plus className="w-4 h-4" /> Add Camera
// // // // // // // // //             </button>
// // // // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </header>

// // // // // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // // // // //         {/* Filter Selection */}
// // // // // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
// // // // // // // // //           {filterOptions.map((f) => (
// // // // // // // // //             <button
// // // // // // // // //               key={f.value}
// // // // // // // // //               onClick={() => setFilter(f.value)}
// // // // // // // // //               className={`py-2 px-6 rounded-full font-sans font-bold text-xs transition-all whitespace-nowrap
// // // // // // // // //                 ${filter === f.value
// // // // // // // // //                   ? 'bg-[#1c1c1c] text-white shadow-lg'
// // // // // // // // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // // // //             >
// // // // // // // // //               {f.label}
// // // // // // // // //             </button>
// // // // // // // // //           ))}
// // // // // // // // //         </div>

// // // // // // // // //         {/* Camera Grid */}
// // // // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-24 gap-4`}>
// // // // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // // // //             <p className={theme.type.bodySm}>No {filter === 'all' ? '' : filter} cameras found</p>
// // // // // // // // //           </div>
// // // // // // // // //         ) : (
// // // // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // // // // // //             {filteredCameras.map((camera) => {
// // // // // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // // // //               const TypeIcon = typeConfig.icon

// // // // // // // // //               return (
// // // // // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
// // // // // // // // //                   {/* Static Placeholder (Replaces CameraFrame stream) */}
// // // // // // // // //                   <div className="relative h-48 bg-[#1c1c1c] flex items-center justify-center">
// // // // // // // // //                     <Video className="h-12 w-12 text-white/10" />
                    
// // // // // // // // //                     <div className="absolute top-4 left-4">
// // // // // // // // //                       <span className={typeConfig.badge}>
// // // // // // // // //                         <TypeIcon className="w-3 h-3" />
// // // // // // // // //                         {typeConfig.label}
// // // // // // // // //                       </span>
// // // // // // // // //                     </div>
                    
// // // // // // // // //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
// // // // // // // // //                       <h3 className="text-white font-sans font-black text-sm truncate">{camera.name}</h3>
// // // // // // // // //                     </div>
// // // // // // // // //                   </div>

// // // // // // // // //                   {/* Info & Footer Actions */}
// // // // // // // // //                   <div className="p-5 flex flex-col flex-1">
// // // // // // // // //                     <p className="font-mono text-[10px] text-gray-400 truncate mb-4 bg-[#faf9f6] p-2 rounded-lg">
// // // // // // // // //                       {camera.rtsp_url}
// // // // // // // // //                     </p>

// // // // // // // // //                     <div className="mt-auto flex items-center justify-between">
// // // // // // // // //                       <span className={`${theme.type.labelSm} font-black ${camera.is_online ? 'text-emerald-500' : 'text-red-500'}`}>
// // // // // // // // //                         {camera.is_online ? '● ONLINE' : '● OFFLINE'}
// // // // // // // // //                       </span>

// // // // // // // // //                       <div className="flex items-center gap-1">
// // // // // // // // //                         {camera.camera_type === 'fence' && (
// // // // // // // // //                           <button
// // // // // // // // //                             onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/calibrate`) }}
// // // // // // // // //                             className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-[#c5a880] transition-all"
// // // // // // // // //                             title="Calibrate"
// // // // // // // // //                           >
// // // // // // // // //                             <RotateCcw className="h-4 w-4" />
// // // // // // // // //                           </button>
// // // // // // // // //                         )}
// // // // // // // // //                         <button
// // // // // // // // //                           onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/edit`) }}
// // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-all"
// // // // // // // // //                           title="Edit"
// // // // // // // // //                         >
// // // // // // // // //                           <Edit2 className="h-4 w-4" />
// // // // // // // // //                         </button>
// // // // // // // // //                         <button
// // // // // // // // //                           onClick={(e) => { e.stopPropagation(); handleDelete(camera.id) }}
// // // // // // // // //                           className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
// // // // // // // // //                           title="Delete"
// // // // // // // // //                         >
// // // // // // // // //                           <Trash2 className="h-4 w-4" />
// // // // // // // // //                         </button>
// // // // // // // // //                       </div>
// // // // // // // // //                     </div>
// // // // // // // // //                   </div>
// // // // // // // // //                 </div>
// // // // // // // // //               )
// // // // // // // // //             })}
// // // // // // // // //           </div>
// // // // // // // // //         )}
// // // // // // // // //       </main>

// // // // // // // // //       {/* FAB for Mobile */}
// // // // // // // // //       <button
// // // // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // // // // // //       >
// // // // // // // // //         <Plus className="h-6 w-6" />
// // // // // // // // //       </button>
// // // // // // // // //     </div>
// // // // // // // // //   )
// // // // // // // // // }

// // // // // // // // // export default CameraManagement

// // // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // // import {
// // // // // // // //   ArrowLeft, Plus, Edit2, Trash2, Video,
// // // // // // // //   Shield, DoorOpen, Eye, RotateCcw,
// // // // // // // // } from 'lucide-react'
// // // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // // import { useState } from 'react'
// // // // // // // // import { theme } from '../theme'

// // // // // // // // // ── Main component ────────────────────────────
// // // // // // // // const CameraManagement = () => {
// // // // // // // //   const { id } = useParams()
// // // // // // // //   const navigate = useNavigate()
// // // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // // //     try {
// // // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // // //     } catch (err) {
// // // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // // //   )

// // // // // // // //   if (isLoading) {
// // // // // // // //     return (
// // // // // // // //       <div className={theme.page.centered}>
// // // // // // // //         <div className={theme.ui.spinner} />
// // // // // // // //       </div>
// // // // // // // //     )
// // // // // // // //   }

// // // // // // // //   const filterOptions = [
// // // // // // // //     { value: 'all', label: 'All' },
// // // // // // // //     { value: 'entrance', label: 'Entrance' },
// // // // // // // //     { value: 'insider', label: 'Insider' },
// // // // // // // //     { value: 'fence', label: 'Fence' },
// // // // // // // //   ]

// // // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // // //     switch (type) {
// // // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // // //       case 'insider': return { icon: Eye, label: 'Insider', badge: theme.badge.success }
// // // // // // // //       case 'fence': return { icon: Shield, label: 'Fence', badge: theme.badge.dark }
// // // // // // // //       default: return { icon: Video, label: 'Unknown', badge: theme.badge.outline }
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // // // //       {/* Header */}
// // // // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // // // //             </button>
// // // // // // // //             <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // // // // //           </div>
// // // // // // // //           <div className="flex items-center gap-4">
// // // // // // // //             <button
// // // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // //               className={`${theme.button.dark} h-10 px-6 text-xs uppercase tracking-widest font-black hidden md:flex items-center gap-2`}
// // // // // // // //             >
// // // // // // // //               <Plus className="w-4 h-4" /> Add Camera
// // // // // // // //             </button>
// // // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </header>

// // // // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // // // //         {/* Filter Selection */}
// // // // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
// // // // // // // //           {filterOptions.map((f) => (
// // // // // // // //             <button
// // // // // // // //               key={f.value}
// // // // // // // //               onClick={() => setFilter(f.value)}
// // // // // // // //               className={`py-2 px-6 rounded-full font-sans font-bold text-xs transition-all whitespace-nowrap
// // // // // // // //                 ${filter === f.value
// // // // // // // //                   ? 'bg-[#1c1c1c] text-white shadow-lg'
// // // // // // // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // // //             >
// // // // // // // //               {f.label}
// // // // // // // //             </button>
// // // // // // // //           ))}
// // // // // // // //         </div>

// // // // // // // //         {/* Camera Grid */}
// // // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-24 gap-4`}>
// // // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // // //             <p className={theme.type.bodySm}>No {filter === 'all' ? '' : filter} cameras found</p>
// // // // // // // //           </div>
// // // // // // // //         ) : (
// // // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // // // // //             {filteredCameras.map((camera) => {
// // // // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // // //               const TypeIcon = typeConfig.icon

// // // // // // // //               return (
// // // // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
// // // // // // // //                   {/* Static Placeholder (Replaces CameraFrame stream) */}
// // // // // // // //                   <div className="relative h-48 bg-[#1c1c1c] flex items-center justify-center">
// // // // // // // //                     <Video className="h-12 w-12 text-white/10" />
                    
// // // // // // // //                     <div className="absolute top-4 left-4">
// // // // // // // //                       <span className={typeConfig.badge}>
// // // // // // // //                         <TypeIcon className="w-3 h-3" />
// // // // // // // //                         {typeConfig.label}
// // // // // // // //                       </span>
// // // // // // // //                     </div>
                    
// // // // // // // //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
// // // // // // // //                       <h3 className="text-white font-sans font-black text-sm truncate">{camera.name}</h3>
// // // // // // // //                     </div>
// // // // // // // //                   </div>

// // // // // // // //                   {/* Info & Footer Actions */}
// // // // // // // //                   <div className="p-5 flex flex-col flex-1">
// // // // // // // //                     <p className="font-mono text-[10px] text-gray-400 truncate mb-4 bg-[#faf9f6] p-2 rounded-lg">
// // // // // // // //                       {camera.rtsp_url}
// // // // // // // //                     </p>

// // // // // // // //                     <div className="mt-auto flex items-center justify-between">
// // // // // // // //                       <span className={`${theme.type.labelSm} font-black ${camera.is_online ? 'text-emerald-500' : 'text-red-500'}`}>
// // // // // // // //                         {camera.is_online ? '● ONLINE' : '● OFFLINE'}
// // // // // // // //                       </span>

// // // // // // // //                       <div className="flex items-center gap-1">
// // // // // // // //                         {camera.camera_type === 'fence' && (
// // // // // // // //                           <button
// // // // // // // //                             onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/calibrate`) }}
// // // // // // // //                             className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-[#c5a880] transition-all"
// // // // // // // //                             title="Calibrate"
// // // // // // // //                           >
// // // // // // // //                             <RotateCcw className="h-4 w-4" />
// // // // // // // //                           </button>
// // // // // // // //                         )}
// // // // // // // //                         <button
// // // // // // // //                           onClick={(e) => { e.stopPropagation(); navigate(`/property/${id}/camera/${camera.id}/edit`) }}
// // // // // // // //                           className="p-2.5 rounded-xl hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-all"
// // // // // // // //                           title="Edit"
// // // // // // // //                         >
// // // // // // // //                           <Edit2 className="h-4 w-4" />
// // // // // // // //                         </button>
// // // // // // // //                         <button
// // // // // // // //                           onClick={(e) => { e.stopPropagation(); handleDelete(camera.id) }}
// // // // // // // //                           className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
// // // // // // // //                           title="Delete"
// // // // // // // //                         >
// // // // // // // //                           <Trash2 className="h-4 w-4" />
// // // // // // // //                         </button>
// // // // // // // //                       </div>
// // // // // // // //                     </div>
// // // // // // // //                   </div>
// // // // // // // //                 </div>
// // // // // // // //               )
// // // // // // // //             })}
// // // // // // // //           </div>
// // // // // // // //         )}
// // // // // // // //       </main>

// // // // // // // //       {/* FAB for Mobile */}
// // // // // // // //       <button
// // // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // // // // //       >
// // // // // // // //         <Plus className="h-6 w-6" />
// // // // // // // //       </button>
// // // // // // // //     </div>
// // // // // // // //   )
// // // // // // // // }

// // // // // // // // export default CameraManagement

// // // // // // // // src/pages/CameraManagement.jsx
// // // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // // import {
// // // // // // //   ArrowLeft, Plus, Edit2, Trash2, 
// // // // // // //   Shield, DoorOpen, Eye, RotateCcw, Video
// // // // // // // } from 'lucide-react'
// // // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // // import { useState } from 'react'
// // // // // // // import { theme } from '../theme'

// // // // // // // const CameraManagement = () => {
// // // // // // //   const { id } = useParams()
// // // // // // //   const navigate = useNavigate()
// // // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // // //   const deleteMutation = useDeleteCamera()
// // // // // // //   const [filter, setFilter] = useState('all')

// // // // // // //   const handleDelete = async (cameraId) => {
// // // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // // //     try {
// // // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // // //     } catch (err) {
// // // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // // //     }
// // // // // // //   }

// // // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // // //   )

// // // // // // //   if (isLoading) {
// // // // // // //     return (
// // // // // // //       <div className={theme.page.centered}>
// // // // // // //         <div className={theme.ui.spinner} />
// // // // // // //       </div>
// // // // // // //     )
// // // // // // //   }

// // // // // // //   const getCameraTypeConfig = (type) => {
// // // // // // //     switch (type) {
// // // // // // //       case 'entrance': return { icon: DoorOpen, label: 'Entrance', badge: theme.badge.accent }
// // // // // // //       case 'insider': return { icon: Eye, label: 'Insider', badge: theme.badge.success }
// // // // // // //       case 'fence': return { icon: Shield, label: 'Fence', badge: theme.badge.dark }
// // // // // // //       default: return { icon: Video, label: 'Camera', badge: theme.badge.outline }
// // // // // // //     }
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // // //       {/* Header */}
// // // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // // //           <div className="flex items-center gap-4">
// // // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // // //             </button>
// // // // // // //             <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // // // //           </div>
// // // // // // //           <div className="flex items-center gap-4">
// // // // // // //             <button
// // // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // //               className={`${theme.button.dark} h-10 px-6 text-xs uppercase tracking-widest font-black hidden md:flex items-center gap-2`}
// // // // // // //             >
// // // // // // //               <Plus className="w-4 h-4" /> Add Camera
// // // // // // //             </button>
// // // // // // //             <HamburgerMenu propertyId={id} />
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </header>

// // // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // // //         {/* Filters */}
// // // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
// // // // // // //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// // // // // // //             <button
// // // // // // //               key={f}
// // // // // // //               onClick={() => setFilter(f)}
// // // // // // //               className={`py-2 px-6 rounded-full font-sans font-bold text-xs transition-all uppercase tracking-widest
// // // // // // //                 ${filter === f
// // // // // // //                   ? 'bg-[#1c1c1c] text-white shadow-lg'
// // // // // // //                   : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // // //             >
// // // // // // //               {f}
// // // // // // //             </button>
// // // // // // //           ))}
// // // // // // //         </div>

// // // // // // //         {/* Camera List - Stream Removed */}
// // // // // // //         {filteredCameras.length === 0 ? (
// // // // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-24 gap-4`}>
// // // // // // //             <Video className="h-12 w-12 text-gray-200" />
// // // // // // //             <p className={theme.type.bodySm}>No cameras found</p>
// // // // // // //           </div>
// // // // // // //         ) : (
// // // // // // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // // // // //             {filteredCameras.map((camera) => {
// // // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // // //               const TypeIcon = typeConfig.icon

// // // // // // //               return (
// // // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
// // // // // // //                   <div className="flex justify-between items-start mb-4">
// // // // // // //                     <div>
// // // // // // //                       <h3 className="font-sans font-black text-lg text-[#1c1c1c] mb-1">{camera.name}</h3>
// // // // // // //                       <span className={typeConfig.badge}>
// // // // // // //                         <TypeIcon className="w-3 h-3" />
// // // // // // //                         {typeConfig.label}
// // // // // // //                       </span>
// // // // // // //                     </div>
// // // // // // //                     <span className={`text-[10px] font-black px-2 py-1 rounded-md ${camera.is_online ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
// // // // // // //                       {camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // // // // // //                     </span>
// // // // // // //                   </div>

// // // // // // //                   <div className="bg-[#faf9f6] p-3 rounded-xl mb-5">
// // // // // // //                     <p className="font-mono text-[10px] text-gray-400 break-all">
// // // // // // //                       {camera.rtsp_url}
// // // // // // //                     </p>
// // // // // // //                   </div>

// // // // // // //                   <div className="flex items-center justify-end gap-2 border-t border-[#e6e3db] pt-4">
// // // // // // //                     {camera.camera_type === 'fence' && (
// // // // // // //                       <button
// // // // // // //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// // // // // // //                         className="p-2 rounded-lg hover:bg-[#faf9f6] text-[#c5a880] transition-colors"
// // // // // // //                         title="Calibrate"
// // // // // // //                       >
// // // // // // //                         <RotateCcw className="h-5 w-5" />
// // // // // // //                       </button>
// // // // // // //                     )}
// // // // // // //                     <button
// // // // // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// // // // // // //                       className="p-2 rounded-lg hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-colors"
// // // // // // //                       title="Edit"
// // // // // // //                     >
// // // // // // //                       <Edit2 className="h-5 w-5" />
// // // // // // //                     </button>
// // // // // // //                     <button
// // // // // // //                       onClick={() => handleDelete(camera.id)}
// // // // // // //                       className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
// // // // // // //                       title="Delete"
// // // // // // //                     >
// // // // // // //                       <Trash2 className="h-5 w-5" />
// // // // // // //                     </button>
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               )
// // // // // // //             })}
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </main>

// // // // // // //       <button
// // // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // // // //       >
// // // // // // //         <Plus className="h-6 w-6" />
// // // // // // //       </button>
// // // // // // //     </div>
// // // // // // //   )
// // // // // // // }

// // // // // // // export default CameraManagement

// // // // // // // src/pages/CameraManagement.jsx
// // // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // // import {
// // // // // //   ArrowLeft, Plus, Edit2, Trash2, 
// // // // // //   Shield, DoorOpen, Eye, RotateCcw, Video
// // // // // // } from 'lucide-react'
// // // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // // import { useState } from 'react'
// // // // // // import { theme } from '../theme'

// // // // // // const CameraManagement = () => {
// // // // // //   const { id } = useParams()
// // // // // //   const navigate = useNavigate()
// // // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // // //   const deleteMutation = useDeleteCamera()
// // // // // //   const [filter, setFilter] = useState('all')

// // // // // //   const handleDelete = async (cameraId) => {
// // // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // // //     try {
// // // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // // //     } catch (err) {
// // // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // // //     }
// // // // // //   }

// // // // // //   const filteredCameras = cameras.filter(cam =>
// // // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // // //   )

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <div className={theme.page.centered}>
// // // // // //         <div className={theme.ui.spinner} />
// // // // // //       </div>
// // // // // //     )
// // // // // //   }

// // // // // //   const getCameraTypeConfig = (type) => {
// // // // // //     switch (type) {
// // // // // //       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: 'bg-blue-50 text-blue-600' }
// // // // // //       case 'insider': return { icon: Eye, label: 'INSIDER', badge: 'bg-emerald-50 text-emerald-600' }
// // // // // //       case 'fence': return { icon: Shield, label: 'FENCE', badge: 'bg-[#1c1c1c] text-white' }
// // // // // //       default: return { icon: Video, label: 'CAMERA', badge: 'bg-gray-100 text-gray-600' }
// // // // // //     }
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // // // //       {/* Header */}
// // // // // //       <header className="bg-white border-b border-[#e6e3db] sticky top-0 z-20 shadow-sm">
// // // // // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
// // // // // //           <div className="flex items-center gap-4">
// // // // // //             <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // // //               <ArrowLeft className="h-5 w-5" />
// // // // // //             </button>
// // // // // //             <h2 className="font-sans font-black text-xl text-[#1c1c1c]">Cameras ({cameras.length})</h2>
// // // // // //           </div>
// // // // // //           <div className="flex items-center gap-4">
// // // // // //             <button
// // // // // //               onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // //               className="bg-[#1c1c1c] text-white h-9 px-4 rounded-full text-[10px] uppercase tracking-widest font-black hidden md:flex items-center gap-2 hover:bg-black transition-colors"
// // // // // //             >
// // // // // //               <Plus className="w-3.5 h-3.5" /> Add Camera
// // // // // //             </button>
// // // // // //             <HamburgerMenu propertyId={id} />
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </header>

// // // // // //       <main className="max-w-7xl mx-auto px-6 py-8">
// // // // // //         {/* Compact Filter Selection */}
// // // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
// // // // // //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// // // // // //             <button
// // // // // //               key={f}
// // // // // //               onClick={() => setFilter(f)}
// // // // // //               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px] transition-all uppercase tracking-widest border
// // // // // //                 ${filter === f
// // // // // //                   ? 'bg-[#1c1c1c] text-white border-[#1c1c1c] shadow-md'
// // // // // //                   : 'bg-white border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // // //             >
// // // // // //               {f}
// // // // // //             </button>
// // // // // //           ))}
// // // // // //         </div>

// // // // // //         {/* Camera List - Compact Cards */}
// // // // // //         {filteredCameras.length === 0 ? (
// // // // // //           <div className="bg-white border border-[#e6e3db] rounded-[2rem] flex flex-col items-center text-center py-20 gap-4">
// // // // // //             <Video className="h-10 w-10 text-gray-200" />
// // // // // //             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No cameras found</p>
// // // // // //           </div>
// // // // // //         ) : (
// // // // // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // // // // //             {filteredCameras.map((camera) => {
// // // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // // //               const TypeIcon = typeConfig.icon

// // // // // //               return (
// // // // // //                 <div key={camera.id} className="bg-white border border-[#e6e3db] rounded-[1.5rem] p-4 flex flex-col shadow-sm hover:shadow-md transition-all">
// // // // // //                   <div className="flex justify-between items-start mb-3">
// // // // // //                     <div className="min-w-0 pr-2">
// // // // // //                       <h3 className="font-sans font-black text-sm text-[#1c1c1c] truncate">{camera.name}</h3>
// // // // // //                       <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black tracking-tighter ${typeConfig.badge}`}>
// // // // // //                         <TypeIcon className="w-2.5 h-2.5" />
// // // // // //                         {typeConfig.label}
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${camera.is_online ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
// // // // // //                       {camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // // // // //                     </span>
// // // // // //                   </div>

// // // // // //                   <div className="bg-[#faf9f6] p-2 rounded-lg mb-4">
// // // // // //                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
// // // // // //                       {camera.rtsp_url}
// // // // // //                     </p>
// // // // // //                   </div>

// // // // // //                   <div className="mt-auto pt-3 border-t border-[#e6e3db] flex items-center justify-end gap-1">
// // // // // //                     {camera.camera_type === 'fence' && (
// // // // // //                       <button
// // // // // //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// // // // // //                         className="p-2 rounded-lg hover:bg-[#faf9f6] text-gray-400 hover:text-[#c5a880] transition-colors"
// // // // // //                       >
// // // // // //                         <RotateCcw className="h-4 w-4" />
// // // // // //                       </button>
// // // // // //                     )}
// // // // // //                     <button
// // // // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// // // // // //                       className="p-2 rounded-lg hover:bg-[#faf9f6] text-gray-400 hover:text-[#1c1c1c] transition-colors"
// // // // // //                     >
// // // // // //                       <Edit2 className="h-4 w-4" />
// // // // // //                     </button>
// // // // // //                     <button
// // // // // //                       onClick={() => handleDelete(camera.id)}
// // // // // //                       className="p-2 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors"
// // // // // //                     >
// // // // // //                       <Trash2 className="h-4 w-4" />
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               )
// // // // // //             })}
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </main>

// // // // // //       {/* Mobile Add Button */}
// // // // // //       <button
// // // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // // //         className="fixed bottom-6 right-6 w-12 h-12 bg-[#1c1c1c] text-white rounded-full flex items-center justify-center shadow-xl md:hidden active:scale-95 transition-transform"
// // // // // //       >
// // // // // //         <Plus className="h-6 w-6" />
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default CameraManagement

// // // // // // src/pages/CameraManagement.jsx
// // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // import {
// // // // //   ArrowLeft, Plus, Edit2, Trash2, 
// // // // //   Shield, DoorOpen, Eye, RotateCcw, Video
// // // // // } from 'lucide-react'
// // // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // // import { useState } from 'react'
// // // // // import { theme } from '../theme'

// // // // // const CameraManagement = () => {
// // // // //   const { id } = useParams()
// // // // //   const navigate = useNavigate()
// // // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // // //   const deleteMutation = useDeleteCamera()
// // // // //   const [filter, setFilter] = useState('all')

// // // // //   const handleDelete = async (cameraId) => {
// // // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // // //     try {
// // // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // // //     } catch (err) {
// // // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // // //     }
// // // // //   }

// // // // //   const filteredCameras = cameras.filter(cam =>
// // // // //     filter === 'all' ? true : cam.camera_type === filter
// // // // //   )

// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <div className={theme.page.centered}>
// // // // //         <div className={theme.ui.spinner} />
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   const getCameraTypeConfig = (type) => {
// // // // //     switch (type) {
// // // // //       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
// // // // //       case 'insider': return { icon: Eye, label: 'INSIDER', badge: theme.badge.success }
// // // // //       case 'fence': return { icon: Shield, label: 'FENCE', badge: theme.badge.dark }
// // // // //       default: return { icon: Video, label: 'CAMERA', badge: theme.badge.outline }
// // // // //     }
// // // // //   }

// // // // //   return (
// // // // //     <div className={theme.page.wrapper}>
// // // // //       {/* Header using theme.header */}
// // // // //       <header className={theme.header.wrapper}>
// // // // //         <div className="flex items-center gap-4">
// // // // //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // //             <ArrowLeft className="h-5 w-5" />
// // // // //           </button>
// // // // //           <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // // //         </div>
// // // // //         <div className="flex items-center gap-4">
// // // // //           {/* Add Camera Button using theme.button.dark + sm */}
// // // // //           <button
// // // // //             onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // //             className={`${theme.button.dark} ${theme.button.sm} hidden md:flex`}
// // // // //           >
// // // // //             <Plus className="w-4 h-4" /> Add Camera
// // // // //           </button>
// // // // //           <HamburgerMenu propertyId={id} />
// // // // //         </div>
// // // // //       </header>

// // // // //       <main className={`${theme.page.inner} px-6 py-8`}>
// // // // //         {/* Filter Tabs using button styles */}
// // // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
// // // // //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// // // // //             <button
// // // // //               key={f}
// // // // //               onClick={() => setFilter(f)}
// // // // //               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px] transition-all uppercase tracking-widest border
// // // // //                 ${filter === f
// // // // //                   ? 'bg-[#1c1c1c] text-white border-[#1c1c1c] shadow-md'
// // // // //                   : 'bg-white border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // // //             >
// // // // //               {f}
// // // // //             </button>
// // // // //           ))}
// // // // //         </div>

// // // // //         {/* Small Compact Cards using theme.card.sm (Beige variant) */}
// // // // //         {filteredCameras.length === 0 ? (
// // // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
// // // // //             <Video className="h-10 w-10 text-gray-200" />
// // // // //             <p className={theme.type.label}>No cameras found</p>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // // // //             {filteredCameras.map((camera) => {
// // // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // // //               const TypeIcon = typeConfig.icon

// // // // //               return (
// // // // //                 <div key={camera.id} className={theme.card.sm}>
// // // // //                   <div className="flex justify-between items-start mb-3">
// // // // //                     <div className="min-w-0 pr-2">
// // // // //                       <h3 className={theme.type.h4 + " truncate"}>{camera.name}</h3>
// // // // //                       <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
// // // // //                         <TypeIcon className="w-2.5 h-2.5" />
// // // // //                         {typeConfig.label}
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <span className={camera.is_online ? theme.badge.success + " scale-75" : theme.badge.danger + " scale-75"}>
// // // // //                       {camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // // // //                     </span>
// // // // //                   </div>

// // // // //                   <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
// // // // //                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
// // // // //                       {camera.rtsp_url}
// // // // //                     </p>
// // // // //                   </div>

// // // // //                   <div className={`${theme.divider.full} mb-3`} />

// // // // //                   <div className="flex items-center justify-end gap-1">
// // // // //                     {camera.camera_type === 'fence' && (
// // // // //                       <button
// // // // //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// // // // //                         className={theme.button.icon}
// // // // //                         title="Calibrate"
// // // // //                       >
// // // // //                         <RotateCcw className="h-4 w-4" />
// // // // //                       </button>
// // // // //                     )}
// // // // //                     <button
// // // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// // // // //                       className={theme.button.icon}
// // // // //                       title="Edit"
// // // // //                     >
// // // // //                       <Edit2 className="h-4 w-4" />
// // // // //                     </button>
// // // // //                     <button
// // // // //                       onClick={() => handleDelete(camera.id)}
// // // // //                       className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
// // // // //                       title="Delete"
// // // // //                     >
// // // // //                       <Trash2 className="h-4 w-4" />
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               )
// // // // //             })}
// // // // //           </div>
// // // // //         )}
// // // // //       </main>

// // // // //       {/* Mobile FAB using theme.ui.fab */}
// // // // //       <button
// // // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // // //         className={`${theme.ui.fab} md:hidden`}
// // // // //       >
// // // // //         <Plus className="h-6 w-6" />
// // // // //       </button>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default CameraManagement

// // // // // src/pages/CameraManagement.jsx
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, Plus, Edit2, Trash2, 
// // // //   Shield, DoorOpen, Eye, RotateCcw, Video
// // // // } from 'lucide-react'
// // // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // import { useState } from 'react'
// // // // import { theme } from '../theme'

// // // // const CameraManagement = () => {
// // // //   const { id } = useParams()
// // // //   const navigate = useNavigate()
// // // //   const { data: cameras = [], isLoading } = useCameras(id)
// // // //   const deleteMutation = useDeleteCamera()
// // // //   const [filter, setFilter] = useState('all')

// // // //   const handleDelete = async (cameraId) => {
// // // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // // //     try {
// // // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // // //     } catch (err) {
// // // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // // //     }
// // // //   }

// // // //   const filteredCameras = cameras.filter(cam =>
// // // //     filter === 'all' ? true : cam.camera_type === filter
// // // //   )

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className={theme.page.centered}>
// // // //         <div className={theme.ui.spinner} />
// // // //       </div>
// // // //     )
// // // //   }

// // // //   const getCameraTypeConfig = (type) => {
// // // //     switch (type) {
// // // //       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
// // // //       case 'insider': return { icon: Eye, label: 'INSIDER', badge: theme.badge.success }
// // // //       case 'fence': return { icon: Shield, label: 'FENCE', badge: theme.badge.dark }
// // // //       default: return { icon: Video, label: 'CAMERA', badge: theme.badge.outline }
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className={theme.page.wrapper}>
// // // //       {/* Header using theme.header */}
// // // //       <header className={theme.header.wrapper}>
// // // //         <div className="flex items-center gap-4">
// // // //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // //             <ArrowLeft className="h-5 w-5" />
// // // //           </button>
// // // //           <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // // //         </div>
// // // //         <div className="flex items-center gap-4">
// // // //           {/* Add Camera Button using theme.button.dark + sm */}
// // // //           <button
// // // //             onClick={() => navigate(`/property/${id}/camera/add`)}
// // // //             className={`${theme.button.dark} ${theme.button.sm} hidden md:flex`}
// // // //           >
// // // //             <Plus className="w-4 h-4" /> Add Camera
// // // //           </button>
// // // //           <HamburgerMenu propertyId={id} />
// // // //         </div>
// // // //       </header>

// // // //       <main className={`${theme.page.inner} px-6 py-8`}>
// // // //         {/* Filter Tabs using button styles */}
// // // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
// // // //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// // // //             <button
// // // //               key={f}
// // // //               onClick={() => setFilter(f)}
// // // //               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px] transition-all uppercase tracking-widest border
// // // //                 ${filter === f
// // // //                   ? 'bg-[#1c1c1c] text-white border-[#1c1c1c] shadow-md'
// // // //                   : 'bg-white border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // //             >
// // // //               {f}
// // // //             </button>
// // // //           ))}
// // // //         </div>

// // // //         {/* Small Compact Cards using theme.card.sm (Beige variant) */}
// // // //         {filteredCameras.length === 0 ? (
// // // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
// // // //             <Video className="h-10 w-10 text-gray-200" />
// // // //             <p className={theme.type.label}>No cameras found</p>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // // //             {filteredCameras.map((camera) => {
// // // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // // //               const TypeIcon = typeConfig.icon

// // // //               return (
// // // //                 <div key={camera.id} className={theme.card.sm}>
// // // //                   <div className="flex justify-between items-start mb-3">
// // // //                     <div className="min-w-0 pr-2">
// // // //                       <h3 className={theme.type.h4 + " truncate"}>{camera.name}</h3>
// // // //                       <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
// // // //                         <TypeIcon className="w-2.5 h-2.5" />
// // // //                         {typeConfig.label}
// // // //                       </div>
// // // //                     </div>
// // // //                     <span className={camera.is_online ? theme.badge.success + " scale-75" : theme.badge.danger + " scale-75"}>
// // // //                       {camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // // //                     </span>
// // // //                   </div>

// // // //                   <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
// // // //                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
// // // //                       {camera.rtsp_url}
// // // //                     </p>
// // // //                   </div>

// // // //                   <div className={`${theme.divider.full} mb-3`} />

// // // //                   <div className="flex items-center justify-end gap-1">
// // // //                     {camera.camera_type === 'fence' && (
// // // //                       <button
// // // //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// // // //                         className={theme.button.icon}
// // // //                         title="Calibrate"
// // // //                       >
// // // //                         <RotateCcw className="h-4 w-4" />
// // // //                       </button>
// // // //                     )}
// // // //                     <button
// // // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// // // //                       className={theme.button.icon}
// // // //                       title="Edit"
// // // //                     >
// // // //                       <Edit2 className="h-4 w-4" />
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={() => handleDelete(camera.id)}
// // // //                       className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
// // // //                       title="Delete"
// // // //                     >
// // // //                       <Trash2 className="h-4 w-4" />
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               )
// // // //             })}
// // // //           </div>
// // // //         )}
// // // //       </main>

// // // //       {/* Mobile FAB using theme.ui.fab */}
// // // //       <button
// // // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // // //         className={`${theme.ui.fab} md:hidden`}
// // // //       >
// // // //         <Plus className="h-6 w-6" />
// // // //       </button>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default CameraManagement

// // // // src/pages/CameraManagement.jsx
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, Plus, Edit2, Trash2, 
// // //   Shield, DoorOpen, Eye, RotateCcw, Video
// // // } from 'lucide-react'
// // // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // // import HamburgerMenu from '../components/HamburgerMenu'
// // // import { useState } from 'react'
// // // import { theme } from '../theme'

// // // const CameraManagement = () => {
// // //   const { id } = useParams()
// // //   const navigate = useNavigate()
// // //   const { data: cameras = [], isLoading } = useCameras(id)
// // //   const deleteMutation = useDeleteCamera()
// // //   const [filter, setFilter] = useState('all')

// // //   const handleDelete = async (cameraId) => {
// // //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// // //     try {
// // //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// // //     } catch (err) {
// // //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// // //     }
// // //   }

// // //   const filteredCameras = cameras.filter(cam =>
// // //     filter === 'all' ? true : cam.camera_type === filter
// // //   )

// // //   if (isLoading) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={theme.ui.spinner} />
// // //       </div>
// // //     )
// // //   }

// // //   const getCameraTypeConfig = (type) => {
// // //     switch (type) {
// // //       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
// // //       case 'insider': return { icon: Eye, label: 'INSIDER', badge: theme.badge.success }
// // //       case 'fence': return { icon: Shield, label: 'FENCE', badge: theme.badge.dark }
// // //       default: return { icon: Video, label: 'CAMERA', badge: theme.badge.outline }
// // //     }
// // //   }

// // //   return (
// // //     <div className={theme.page.wrapper}>
// // //       {/* Header */}
// // //       <header className={theme.header.wrapper}>
// // //         <div className="flex items-center gap-4">
// // //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // //             <ArrowLeft className="h-5 w-5" />
// // //           </button>
// // //           <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// // //         </div>
// // //         <div className="flex items-center gap-4">
// // //           {/* UPDATED: Add Camera Button now uses theme.button.primary (Brown) */}
// // //           <button
// // //             onClick={() => navigate(`/property/${id}/camera/add`)}
// // //             className={`${theme.button.primary} ${theme.button.sm} hidden md:flex h-9 shadow-md`}
// // //           >
// // //             <Plus className="w-4 h-4" /> Add Camera
// // //           </button>
// // //           <HamburgerMenu propertyId={id} />
// // //         </div>
// // //       </header>

// // //       <main className={`${theme.page.inner} px-6 py-8`}>
// // //         {/* Filter Tabs */}
// // //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
// // //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// // //             <button
// // //               key={f}
// // //               onClick={() => setFilter(f)}
// // //               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px] transition-all uppercase tracking-widest border
// // //                 ${filter === f
// // //                   ? 'bg-[#1c1c1c] text-white border-[#1c1c1c] shadow-md'
// // //                   : 'bg-white border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // //             >
// // //               {f}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Compact Cards */}
// // //         {filteredCameras.length === 0 ? (
// // //           <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
// // //             <Video className="h-10 w-10 text-gray-200" />
// // //             <p className={theme.type.label}>No cameras found</p>
// // //           </div>
// // //         ) : (
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // //             {filteredCameras.map((camera) => {
// // //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// // //               const TypeIcon = typeConfig.icon

// // //               return (
// // //                 <div key={camera.id} className={theme.card.sm}>
// // //                   <div className="flex justify-between items-start mb-3">
// // //                     <div className="min-w-0 pr-2">
// // //                       <h3 className={theme.type.h4 + " truncate"}>{camera.name}</h3>
// // //                       <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
// // //                         <TypeIcon className="w-2.5 h-2.5" />
// // //                         {typeConfig.label}
// // //                       </div>
// // //                     </div>
// // //                     <span className={camera.is_online ? theme.badge.success + " scale-75" : theme.badge.danger + " scale-75"}>
// // //                       {camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // //                     </span>
// // //                   </div>

// // //                   <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
// // //                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
// // //                       {camera.rtsp_url}
// // //                     </p>
// // //                   </div>

// // //                   <div className={`${theme.divider.full} mb-3`} />

// // //                   <div className="flex items-center justify-end gap-1">
// // //                     {camera.camera_type === 'fence' && (
// // //                       <button
// // //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// // //                         className={theme.button.icon}
// // //                         title="Calibrate"
// // //                       >
// // //                         <RotateCcw className="h-4 w-4 text-[#c5a880]" />
// // //                       </button>
// // //                     )}
// // //                     <button
// // //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// // //                       className={theme.button.icon}
// // //                       title="Edit"
// // //                     >
// // //                       <Edit2 className="h-4 w-4" />
// // //                     </button>
// // //                     <button
// // //                       onClick={() => handleDelete(camera.id)}
// // //                       className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
// // //                       title="Delete"
// // //                     >
// // //                       <Trash2 className="h-4 w-4" />
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               )
// // //             })}
// // //           </div>
// // //         )}
// // //       </main>

// // //       {/* Mobile FAB: Updated to use theme.button.primary (Brown) styles */}
// // //       <button
// // //         onClick={() => navigate(`/property/${id}/camera/add`)}
// // //         className="fixed bottom-6 right-6 w-14 h-14 bg-[#c5a880] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(197,168,128,0.4)] hover:bg-[#b8976e] transition-all active:scale-95 md:hidden"
// // //       >
// // //         <Plus className="h-7 w-7" />
// // //       </button>
// // //     </div>
// // //   )
// // // }

// // // export default CameraManagement


// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   ArrowLeft, Plus, Edit2, Trash2, 
// //   Shield, DoorOpen, Eye, RotateCcw, Video
// // } from 'lucide-react'
// // import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// // import HamburgerMenu from '../components/HamburgerMenu'
// // import { useState } from 'react'
// // import { theme } from '../theme'

// // const CameraManagement = () => {
// //   const { id } = useParams()
// //   const navigate = useNavigate()
// //   const { data: cameras = [], isLoading } = useCameras(id)
// //   const deleteMutation = useDeleteCamera()
// //   const [filter, setFilter] = useState('all')

// //   const handleDelete = async (cameraId) => {
// //     if (!window.confirm('Are you sure you want to delete this camera?')) return
// //     try {
// //       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
// //     } catch (err) {
// //       alert(err?.response?.data?.detail || 'Failed to delete camera')
// //     }
// //   }

// //   const filteredCameras = cameras.filter(cam =>
// //     filter === 'all' ? true : cam.camera_type === filter
// //   )

// //   if (isLoading) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={theme.ui.spinner} />
// //       </div>
// //     )
// //   }

// //   const getCameraTypeConfig = (type) => {
// //     switch (type) {
// //       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
// //       case 'insider': return { icon: Eye, label: 'INSIDER', badge: theme.badge.success }
// //       case 'fence': return { icon: Shield, label: 'FENCE', badge: theme.badge.dark }
// //       default: return { icon: Video, label: 'CAMERA', badge: theme.badge.outline }
// //     }
// //   }

// //   return (
// //     <div className={theme.page.wrapper}>
// //       {/* Header */}
// //       <header className={theme.header.wrapper}>
// //         <div className="flex items-center gap-4">
// //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //             <ArrowLeft className="h-5 w-5" />
// //           </button>
// //           <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
// //         </div>
// //         <div className="flex items-center gap-4">
// //           {/* UPDATED: Add Camera Button now uses theme.button.primary (Brown) */}
// //           <button
// //             onClick={() => navigate(`/property/${id}/camera/add`)}
// //             className={`${theme.button.primary} ${theme.button.sm} hidden md:flex h-9 shadow-md`}
// //           >
// //             <Plus className="w-4 h-4" /> Add Camera
// //           </button>
// //           <HamburgerMenu propertyId={id} />
// //         </div>
// //       </header>

// //       <main className={`${theme.page.inner} px-6 py-8`}>
// //         {/* Filter Tabs */}
// //         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
// //           {['all', 'entrance', 'insider', 'fence'].map((f) => (
// //             <button
// //               key={f}
// //               onClick={() => setFilter(f)}
// //               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px] transition-all uppercase tracking-widest border
// //                 ${filter === f
// //                   ? 'bg-[#c5a880] text-white border-[#c5a880] shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
// //                   : 'bg-[#faf9f6] border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'}`}
// //             >
// //               {f}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Compact Cards */}
// //         {filteredCameras.length === 0 ? (
// //           <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
// //             <Video className="h-10 w-10 text-gray-200" />
// //             <p className={theme.type.label}>No cameras found</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //             {filteredCameras.map((camera) => {
// //               const typeConfig = getCameraTypeConfig(camera.camera_type)
// //               const TypeIcon = typeConfig.icon

// //               return (
// //                 <div key={camera.id} className={theme.card.sm}>
// //                   <div className="flex justify-between items-start mb-3">
// //                     <div className="min-w-0 pr-2">
// //                       <h3 className={theme.type.h4 + " truncate"}>{camera.name}</h3>
// //                       <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
// //                         <TypeIcon className="w-2.5 h-2.5" />
// //                         {typeConfig.label}
// //                       </div>
// //                     </div>
// //                   <span className={
// //   camera.is_online === null
// //     ? 'scale-75 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 border border-gray-200'
// //     : camera.is_online
// //       ? theme.badge.success + ' scale-75'
// //       : theme.badge.danger + ' scale-75'
// // }>
// //   {camera.is_online === null ? 'CHECKING...' : camera.is_online ? 'ONLINE' : 'OFFLINE'}
// // </span>
// //                   </div>

// //                   <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
// //                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
// //                       {camera.rtsp_url}
// //                     </p>
// //                   </div>

// //                   <div className={`${theme.divider.full} mb-3`} />

// //                   <div className="flex items-center justify-end gap-1">
// //                     {camera.camera_type === 'fence' && (
// //                       <button
// //                         onClick={() => navigate(`/property/${id}/camera/${camera.id}/calibrate`)}
// //                         className={theme.button.icon}
// //                         title="Calibrate"
// //                       >
// //                         <RotateCcw className="h-4 w-4 text-[#c5a880]" />
// //                       </button>
// //                     )}
// //                     <button
// //                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
// //                       className={theme.button.icon}
// //                       title="Edit"
// //                     >
// //                       <Edit2 className="h-4 w-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(camera.id)}
// //                       className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
// //                       title="Delete"
// //                     >
// //                       <Trash2 className="h-4 w-4" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               )
// //             })}
// //           </div>
// //         )}
// //       </main>

// //       {/* Mobile FAB: Updated to use theme.button.primary (Brown) styles */}
// //       <button
// //         onClick={() => navigate(`/property/${id}/camera/add`)}
// //         className="fixed bottom-6 right-6 w-14 h-14 bg-[#c5a880] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(197,168,128,0.4)] hover:bg-[#b8976e] transition-all active:scale-95 md:hidden"
// //       >
// //         <Plus className="h-7 w-7" />
// //       </button>
// //     </div>
// //   )
// // }

// // export default CameraManagement

// // src/pages/CameraManagement.jsx

// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, Plus, Edit2, Trash2,
//   Shield, DoorOpen, Eye, RotateCcw, Video
// } from 'lucide-react'
// import { useCameras, useDeleteCamera } from '../hooks/useCameras'
// import HamburgerMenu from '../components/HamburgerMenu'
// import { useState } from 'react'
// import { theme } from '../theme'

// const CameraManagement = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { data: cameras = [], isLoading } = useCameras(id)
//   const deleteMutation = useDeleteCamera()
//   const [filter, setFilter] = useState('all')

//   const handleDelete = async (cameraId) => {
//     if (!window.confirm('Are you sure you want to delete this camera?')) return
//     try {
//       await deleteMutation.mutateAsync({ cameraId, propertyId: id })
//     } catch (err) {
//       alert(err?.response?.data?.detail || 'Failed to delete camera')
//     }
//   }

//   // ── Recalibrate handler ───────────────────────────────────────────────────
//   // We already have the full camera object from useCameras, so we pass the
//   // camera type + name to FenceCellEditor via sessionStorage.  This means
//   // FenceCellEditor does NOT need to fetch the camera type from the API —
//   // so the page renders immediately instead of spinning forever when the
//   // stream endpoint is unavailable.
//   //
//   // Routing:
//   //   fence   → /calibrate first (redraw polygon) → then /cells
//   //   insider → /cells directly (no polygon needed)
//   const handleRecalibrate = (camera) => {
//     // Store enough info so FenceCellEditor knows it's a recalibrate,
//     // knows the camera type without an API call, and can show the right name.
//     sessionStorage.setItem(
//       'recalibrateCamera',
//       JSON.stringify({
//         cameraId:   camera.id,
//         propertyId: id,
//         cameraType: camera.camera_type,
//         cameraName: camera.name,
//         rtspUrl:    camera.rtsp_url,
//       })
//     )

//     if (camera.camera_type === 'fence') {
//       // Step 1: redraw the polygon in EditClimbingCalibration
//       // Step 2: FenceCellEditor will follow automatically
//       navigate(`/property/${id}/camera/${camera.id}/calibrate`)
//     } else {
//       // insider: go straight to cell/zone definition
//       navigate(`/property/${id}/camera/${camera.id}/cells`)
//     }
//   }

//   const filteredCameras = cameras.filter(cam =>
//     filter === 'all' ? true : cam.camera_type === filter
//   )

//   if (isLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     )
//   }

//   const getCameraTypeConfig = (type) => {
//     switch (type) {
//       case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
//       case 'insider':  return { icon: Eye,      label: 'INSIDER',  badge: theme.badge.success }
//       case 'fence':    return { icon: Shield,   label: 'FENCE',    badge: theme.badge.dark }
//       default:         return { icon: Video,    label: 'CAMERA',   badge: theme.badge.outline }
//     }
//   }

//   return (
//     <div className={theme.page.wrapper}>

//       {/* ── Header ── */}
//       <header className={theme.header.wrapper}>
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(`/property/${id}/camera/add`)}
//             className={`${theme.button.primary} ${theme.button.sm} hidden md:flex h-9 shadow-md`}
//           >
//             <Plus className="w-4 h-4" /> Add Camera
//           </button>
//           <HamburgerMenu propertyId={id} />
//         </div>
//       </header>

//       <main className={`${theme.page.inner} px-6 py-8`}>

//         {/* ── Filter tabs ── */}
//         <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
//           {['all', 'entrance', 'insider', 'fence'].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px]
//                           transition-all uppercase tracking-widest border
//                 ${filter === f
//                   ? 'bg-[#c5a880] text-white border-[#c5a880] shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
//                   : 'bg-[#faf9f6] border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'
//                 }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>

//         {/* ── Camera cards ── */}
//         {filteredCameras.length === 0 ? (
//           <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
//             <Video className="h-10 w-10 text-gray-200" />
//             <p className={theme.type.label}>No cameras found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {filteredCameras.map((camera) => {
//               const typeConfig = getCameraTypeConfig(camera.camera_type)
//               const TypeIcon   = typeConfig.icon
//               const canRecalibrate =
//                 camera.camera_type === 'fence' || camera.camera_type === 'insider'

//               return (
//                 <div key={camera.id} className={theme.card.sm}>
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="min-w-0 pr-2">
//                       <h3 className={`${theme.type.h4} truncate`}>{camera.name}</h3>
//                       <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
//                         <TypeIcon className="w-2.5 h-2.5" />
//                         {typeConfig.label}
//                       </div>
//                     </div>
//                     <span className={
//                       camera.is_online === null
//                         ? 'scale-75 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 border border-gray-200'
//                         : camera.is_online
//                           ? `${theme.badge.success} scale-75`
//                           : `${theme.badge.danger} scale-75`
//                     }>
//                       {camera.is_online === null
//                         ? 'CHECKING...'
//                         : camera.is_online ? 'ONLINE' : 'OFFLINE'}
//                     </span>
//                   </div>

//                   <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
//                     <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
//                       {camera.rtsp_url}
//                     </p>
//                   </div>

//                   <div className={`${theme.divider.full} mb-3`} />

//                   <div className="flex items-center justify-end gap-1">
//                     {/* Recalibrate — fence (polygon + cells) or insider (zones only) */}
//                     {canRecalibrate && (
//                       <button
//                         onClick={() => handleRecalibrate(camera)}
//                         className={theme.button.icon}
//                         title={
//                           camera.camera_type === 'fence'
//                             ? 'Recalibrate polygon & cells'
//                             : 'Redefine zones'
//                         }
//                       >
//                         <RotateCcw className="h-4 w-4 text-[#c5a880]" />
//                       </button>
//                     )}

//                     <button
//                       onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
//                       className={theme.button.icon}
//                       title="Edit"
//                     >
//                       <Edit2 className="h-4 w-4" />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(camera.id)}
//                       className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
//                       title="Delete"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </main>

//       {/* ── Mobile FAB ── */}
//       <button
//         onClick={() => navigate(`/property/${id}/camera/add`)}
//         className="fixed bottom-6 right-6 w-14 h-14 bg-[#c5a880] text-white rounded-full
//                    flex items-center justify-center
//                    shadow-[0_4px_20px_rgba(197,168,128,0.4)]
//                    hover:bg-[#b8976e] transition-all active:scale-95 md:hidden"
//       >
//         <Plus className="h-7 w-7" />
//       </button>
//     </div>
//   )
// }

// export default CameraManagement

import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Plus, Edit2, Trash2,
  Shield, DoorOpen, Eye, RotateCcw, Video
} from 'lucide-react'
import { useCameras, useDeleteCamera } from '../hooks/useCameras'
import HamburgerMenu from '../components/HamburgerMenu'
import { useState } from 'react'
import { theme } from '../theme'

const CameraManagement = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: cameras = [], isLoading } = useCameras(id)
  const deleteMutation = useDeleteCamera()
  const [filter, setFilter] = useState('all')

  const handleDelete = async (cameraId) => {
    if (!window.confirm('Are you sure you want to delete this camera?')) return
    try {
      await deleteMutation.mutateAsync({ cameraId, propertyId: id })
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to delete camera')
    }
  }

  // ── Recalibrate handler ───────────────────────────────────────────────────
  // Stores everything the destination page needs so it never has to make an
  // API call just to learn the camera type (which caused the infinite spinner).
  //
  // Routing:
  //   fence   → /calibrate  (EditClimbingCalibration redraws polygon)
  //             → EditClimbingCalibration then navigates to /cells
  //                (FenceCellEditor, isEditing=false, isNew=false)
  //   insider → /edit-cells (EditFenceCells — dedicated recalibrate page)
  //
  // FenceCellEditor is NO LONGER used for recalibrate. Its recalibrate path
  // had a race condition where cameraType stayed null if the stream was down.
  const handleRecalibrate = (camera) => {
    sessionStorage.setItem(
      'recalibrateCamera',
      JSON.stringify({
        cameraId:   camera.id,
        propertyId: id,
        cameraType: camera.camera_type,
        cameraName: camera.name,
        rtspUrl:    camera.rtsp_url,
      })
    )

    if (camera.camera_type === 'fence') {
      // Step 1: redraw polygon in EditClimbingCalibration
      // Step 2: FenceCellEditor follows automatically via navigate inside that page
      navigate(`/property/${id}/camera/${camera.id}/calibrate`)
    } else {
      // insider: go straight to the dedicated recalibrate cell editor
      navigate(`/property/${id}/camera/${camera.id}/edit-cells`)
    }
  }

  const filteredCameras = cameras.filter(cam =>
    filter === 'all' ? true : cam.camera_type === filter
  )

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    )
  }

  const getCameraTypeConfig = (type) => {
    switch (type) {
      case 'entrance': return { icon: DoorOpen, label: 'ENTRANCE', badge: theme.badge.accent }
      case 'insider':  return { icon: Eye,      label: 'INSIDER',  badge: theme.badge.success }
      case 'fence':    return { icon: Shield,   label: 'FENCE',    badge: theme.badge.dark }
      default:         return { icon: Video,    label: 'CAMERA',   badge: theme.badge.outline }
    }
  }

  return (
    <div className={theme.page.wrapper}>

      {/* ── Header ── */}
      <header className={theme.header.wrapper}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className={theme.header.title}>Cameras ({cameras.length})</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/property/${id}/camera/add`)}
            className={`${theme.button.primary} ${theme.button.sm} hidden md:flex h-9 shadow-md`}
          >
            <Plus className="w-4 h-4" /> Add Camera
          </button>
          <HamburgerMenu propertyId={id} />
        </div>
      </header>

      <main className={`${theme.page.inner} px-6 py-8`}>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'entrance', 'insider', 'fence'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-1.5 px-5 rounded-full font-sans font-black text-[10px]
                          transition-all uppercase tracking-widest border
                ${filter === f
                  ? 'bg-[#c5a880] text-white border-[#c5a880] shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
                  : 'bg-[#faf9f6] border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Camera cards ── */}
        {filteredCameras.length === 0 ? (
          <div className={`${theme.card.base} flex flex-col items-center text-center py-20 gap-4`}>
            <Video className="h-10 w-10 text-gray-200" />
            <p className={theme.type.label}>No cameras found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCameras.map((camera) => {
              const typeConfig = getCameraTypeConfig(camera.camera_type)
              const TypeIcon   = typeConfig.icon
              // Only fence and insider cameras have cells/zones to recalibrate
              const canRecalibrate =
                camera.camera_type === 'fence' || camera.camera_type === 'insider'

              return (
                <div key={camera.id} className={theme.card.sm}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 pr-2">
                      <h3 className={`${theme.type.h4} truncate`}>{camera.name}</h3>
                      <div className={`mt-1 ${typeConfig.badge} scale-90 origin-left`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        {typeConfig.label}
                      </div>
                    </div>
                    <span className={
                      camera.is_online === null
                        ? 'scale-75 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 border border-gray-200'
                        : camera.is_online
                          ? `${theme.badge.success} scale-75`
                          : `${theme.badge.danger} scale-75`
                    }>
                      {camera.is_online === null
                        ? 'CHECKING...'
                        : camera.is_online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>

                  <div className="bg-white/50 p-2 rounded-lg mb-4 border border-[#e6e3db]">
                    <p className="font-mono text-[9px] text-gray-400 break-all line-clamp-1">
                      {camera.rtsp_url}
                    </p>
                  </div>

                  <div className={`${theme.divider.full} mb-3`} />

                  <div className="flex items-center justify-end gap-1">
                    {/* Recalibrate button — fence goes to polygon editor first,
                        insider goes directly to the cell/zone editor */}
                    {canRecalibrate && (
                      <button
                        onClick={() => handleRecalibrate(camera)}
                        className={theme.button.icon}
                        title={
                          camera.camera_type === 'fence'
                            ? 'Recalibrate polygon & cells'
                            : 'Redefine zones'
                        }
                      >
                        <RotateCcw className="h-4 w-4 text-[#c5a880]" />
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/property/${id}/camera/${camera.id}/edit`)}
                      className={theme.button.icon}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(camera.id)}
                      className="p-2 rounded-full hover:bg-red-50 text-red-400 active:scale-95 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── Mobile FAB ── */}
      <button
        onClick={() => navigate(`/property/${id}/camera/add`)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#c5a880] text-white rounded-full
                   flex items-center justify-center
                   shadow-[0_4px_20px_rgba(197,168,128,0.4)]
                   hover:bg-[#b8976e] transition-all active:scale-95 md:hidden"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  )
}

export default CameraManagement