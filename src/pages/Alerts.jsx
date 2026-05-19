// // // // // src/pages/Alerts.jsx
// // // // import { useState } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, CheckCircle, AlertTriangle, Clock,
// // // //   Shield, XCircle, Trash2, Bell, RefreshCw,
// // // // } from 'lucide-react'
// // // // import {
// // // //   useAlerts, useMarkAlertRead, useResolveAlert,
// // // //   useMarkFalsePositive, useDeleteAlert,
// // // // } from '../hooks/useAlerts'
// // // // import HamburgerMenu from '../components/HamburgerMenu'
// // // // import { API_BASE_URL } from '../config/api'
// // // // import { theme } from '../theme'

// // // // const Alerts = () => {
// // // //   const { id }     = useParams()
// // // //   const navigate   = useNavigate()
// // // //   const [filter, setFilter] = useState('all')

// // // //   const { data: alerts = [], isLoading, refetch } = useAlerts(id, filter)

// // // //   const markRead         = useMarkAlertRead()
// // // //   const resolveAlert     = useResolveAlert()
// // // //   const markFalsePositive = useMarkFalsePositive()
// // // //   const deleteAlert      = useDeleteAlert()

// // // //   const stats = {
// // // //     total:    alerts.length,
// // // //     unread:   alerts.filter(a => !a.is_read).length,
// // // //     critical: alerts.filter(a => a.severity === 'critical').length,
// // // //     active:   alerts.filter(a => a.status === 'active').length,
// // // //   }

// // // //   const getImageUrl = (imageUrl) => {
// // // //     if (!imageUrl) return null
// // // //     if (imageUrl.startsWith('http')) return imageUrl
// // // //     return `${API_BASE_URL}${imageUrl}`
// // // //   }

// // // //   const getSeverityBadge = (severity) => {
// // // //     switch (severity) {
// // // //       case 'critical': return theme.badge.danger
// // // //       case 'high':     return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest'
// // // //       case 'medium':   return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest'
// // // //       default:         return theme.badge.accent
// // // //     }
// // // //   }

// // // //   const getStatusIcon = (status) => {
// // // //     switch (status) {
// // // //       case 'active':         return <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
// // // //       case 'resolved':       return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
// // // //       case 'false_positive': return <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
// // // //       default:               return null
// // // //     }
// // // //   }

// // // //   const handleAlertClick = (alert) => {
// // // //     if (!alert.is_read) markRead.mutate(alert.id)
// // // //     navigate(`/property/${id}/alert/${alert.id}`)
// // // //   }

// // // //   return (
// // // //     <div className={`${theme.page.wrapper} pb-24`}>

// // // //       {/* Header */}
// // // //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
// // // //                       flex items-center gap-3 shadow-sm">
// // // //         <button
// // // //           onClick={() => navigate(`/property/${id}`)}
// // // //           className={theme.ui.backBtn}
// // // //         >
// // // //           <ArrowLeft className="h-5 w-5" />
// // // //         </button>
// // // //         <div className="flex-1 min-w-0">
// // // //           <h2 className={theme.type.h3}>Alerts</h2>
// // // //           <p className={theme.type.labelSm}>{stats.unread} unread</p>
// // // //         </div>
// // // //         <button onClick={() => refetch()} className={theme.ui.refreshBtn}>
// // // //           <RefreshCw className="w-4 h-4" />
// // // //         </button>
// // // //         <HamburgerMenu propertyId={id} />
// // // //       </div>

// // // //       {/* Stats grid */}
// // // //       <div className="grid grid-cols-3 gap-3 px-5 mt-4">
// // // //         {[
// // // //           { label: 'Total',    value: stats.total,    color: 'text-[#1c1c1c]' },
// // // //           { label: 'Critical', value: stats.critical, color: 'text-red-500'   },
// // // //           { label: 'Unread',   value: stats.unread,   color: 'text-[#c5a880]' },
// // // //         ].map(({ label, value, color }) => (
// // // //           <div key={label} className={theme.stat.interactive}>
// // // //             <p className={theme.stat.label}>{label}</p>
// // // //             <p className={`${theme.stat.value} text-base ${color}`}>{value}</p>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Filter tabs */}
// // // //       <div className="flex px-5 gap-2 mt-4">
// // // //         {['all', 'new', 'active'].map((f) => (
// // // //           <button
// // // //             key={f}
// // // //             onClick={() => setFilter(f)}
// // // //             className={`flex-1 py-2 px-4 rounded-full font-sans font-bold
// // // //                         text-sm transition-all
// // // //                         ${filter === f
// // // //                           ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(28,28,28,0.20)]'
// // // //                           : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#1c1c1c]'}`}
// // // //           >
// // // //             {f.charAt(0).toUpperCase() + f.slice(1)}
// // // //           </button>
// // // //         ))}
// // // //       </div>

// // // //       {/* Alerts list */}
// // // //       <div className="p-5 space-y-3">
// // // //         {isLoading ? (
// // // //           <div className="flex flex-col items-center py-12 gap-3">
// // // //             <div className={theme.ui.spinner} />
// // // //             <p className={theme.type.bodySm}>Loading alerts...</p>
// // // //           </div>
// // // //         ) : alerts.length === 0 ? (
// // // //           <div className={`${theme.card.base} flex flex-col items-center
// // // //                            text-center py-12 gap-4`}>
// // // //             <Shield className="h-12 w-12 text-gray-200" />
// // // //             <h3 className={theme.type.h3}>No {filter} alerts</h3>
// // // //             <p className={theme.type.bodySm}>
// // // //               Alerts appear when cameras detect activity
// // // //             </p>
// // // //           </div>
// // // //         ) : (
// // // //           alerts.map((alert) => (
// // // //             <div
// // // //               key={alert.id}
// // // //               onClick={() => handleAlertClick(alert)}
// // // //               className={`bg-white rounded-[2rem] p-4 cursor-pointer
// // // //                           transition-all duration-200 hover:shadow-md
// // // //                           ${alert.is_read
// // // //                             ? 'border border-[#e6e3db] opacity-80'
// // // //                             : 'border border-[#c5a880]/40 shadow-[0_2px_12px_rgba(197,168,128,0.15)]'}`}
// // // //             >
// // // //               <div className="flex items-start gap-3">

// // // //                 {/* Thumbnail */}
// // // //                 {alert.image_url ? (
// // // //                   <img
// // // //                     src={getImageUrl(alert.image_url)}
// // // //                     alt="Alert"
// // // //                     className="w-16 h-16 rounded-[1rem] object-cover flex-shrink-0"
// // // //                     onError={(e) => { e.target.style.display = 'none' }}
// // // //                   />
// // // //                 ) : (
// // // //                   <div className="w-16 h-16 rounded-[1rem] bg-[#faf9f6]
// // // //                                   border border-[#e6e3db] flex items-center
// // // //                                   justify-center flex-shrink-0">
// // // //                     <Bell className="w-6 h-6 text-gray-300" />
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Content */}
// // // //                 <div className="flex-1 min-w-0">
// // // //                   <div className="flex items-center gap-2 mb-1">
// // // //                     <h3 className={`${theme.type.h4} truncate`}>{alert.type}</h3>
// // // //                     {getStatusIcon(alert.status)}
// // // //                   </div>

// // // //                   <p className={theme.type.bodySm}>
// // // //                     Camera: {alert.camera_name}
// // // //                   </p>

// // // //                   <div className="flex items-center gap-2 mt-2 flex-wrap">
// // // //                     <span className={getSeverityBadge(alert.severity)}>
// // // //                       {alert.severity}
// // // //                     </span>
// // // //                     <span className="font-sans text-[10px] font-bold text-[#c5a880]">
// // // //                       {alert.confidence}% confidence
// // // //                     </span>
// // // //                     {alert.clip_url && (
// // // //                       <span className="font-sans text-[10px] font-bold text-gray-400">
// // // //                         🎬 Video
// // // //                       </span>
// // // //                     )}
// // // //                     <span className="flex items-center gap-1 font-sans
// // // //                                      text-[10px] font-medium text-gray-400">
// // // //                       <Clock className="w-3 h-3" />
// // // //                       {alert.timestamp}
// // // //                     </span>
// // // //                   </div>
// // // //                 </div>

// // // //                 <span className="text-gray-300 font-sans text-lg">›</span>
// // // //               </div>

// // // //               {/* Quick actions */}
// // // //               {alert.status === 'active' && (
// // // //                 <div className="flex gap-2 mt-3 pt-3 border-t border-[#e6e3db]">
// // // //                   <button
// // // //                     onClick={(e) => { e.stopPropagation(); resolveAlert.mutate(alert.id) }}
// // // //                     className="flex-1 bg-emerald-50 text-emerald-600 py-2
// // // //                                rounded-full font-sans text-xs font-bold
// // // //                                hover:bg-emerald-100 transition-colors
// // // //                                border border-emerald-200"
// // // //                   >
// // // //                     Resolve
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={(e) => { e.stopPropagation(); markFalsePositive.mutate(alert.id) }}
// // // //                     className="flex-1 bg-[#faf9f6] text-gray-500 py-2
// // // //                                rounded-full font-sans text-xs font-bold
// // // //                                hover:bg-[#e6e3db] transition-colors
// // // //                                border border-[#e6e3db]"
// // // //                   >
// // // //                     False Positive
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation()
// // // //                       if (confirm('Delete this alert?')) deleteAlert.mutate(alert.id)
// // // //                     }}
// // // //                     className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
// // // //                   >
// // // //                     <Trash2 className="w-4 h-4" />
// // // //                   </button>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ))
// // // //         )}
// // // //       </div>

// // // //     </div>
// // // //   )
// // // // }

// // // // export default Alerts

// // // // src/pages/Alerts.jsx
// // // import { useState } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, CheckCircle, AlertTriangle, Clock,
// // //   Shield, XCircle, Trash2, Bell, RefreshCw,
// // // } from 'lucide-react'
// // // import {
// // //   useAlerts, useMarkAlertRead, useResolveAlert,
// // //   useMarkFalsePositive, useDeleteAlert,
// // // } from '../hooks/useAlerts'
// // // import HamburgerMenu from '../components/HamburgerMenu'
// // // import { API_BASE_URL } from '../config/api'
// // // import { theme } from '../theme'

// // // const Alerts = () => {
// // //   const { id }     = useParams()
// // //   const navigate   = useNavigate()
// // //   const [filter, setFilter] = useState('all')

// // //   const { data: alerts = [], isLoading, refetch } = useAlerts(id, filter)

// // //   const markRead          = useMarkAlertRead()
// // //   const resolveAlert      = useResolveAlert()
// // //   const markFalsePositive = useMarkFalsePositive()
// // //   const deleteAlert       = useDeleteAlert()

// // //   const stats = {
// // //     total:    alerts.length,
// // //     unread:   alerts.filter(a => !a.is_read).length,
// // //     critical: alerts.filter(a => a.severity === 'critical').length,
// // //     active:   alerts.filter(a => a.status === 'active').length,
// // //   }

// // //   const getImageUrl = (imageUrl) => {
// // //     if (!imageUrl) return null
// // //     if (imageUrl.startsWith('http')) return imageUrl
// // //     return `${API_BASE_URL}${imageUrl}`
// // //   }

// // //   const getSeverityBadge = (severity) => {
// // //     switch (severity) {
// // //       case 'critical': return theme.badge.danger
// // //       case 'high':     return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest'
// // //       case 'medium':   return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest'
// // //       default:         return theme.badge.accent
// // //     }
// // //   }

// // //   const getStatusIcon = (status) => {
// // //     switch (status) {
// // //       case 'active':         return <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
// // //       case 'resolved':       return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
// // //       case 'false_positive': return <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
// // //       default:               return null
// // //     }
// // //   }

// // //   const handleAlertClick = (alert) => {
// // //     if (!alert.is_read) markRead.mutate(alert.id)
// // //     navigate(`/property/${id}/alert/${alert.id}`)
// // //   }

// // //   return (
// // //     <div className={`${theme.page.wrapper} pb-24`}>

// // //       {/* Header */}
// // //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
// // //                       flex items-center gap-3 shadow-sm">
// // //         <button
// // //           onClick={() => navigate(`/property/${id}`)}
// // //           className={theme.ui.backBtn}
// // //         >
// // //           <ArrowLeft className="h-5 w-5" />
// // //         </button>
// // //         <div className="flex-1 min-w-0">
// // //           <h2 className={theme.type.h3}>Alerts</h2>
// // //           <p className={theme.type.labelSm}>{stats.unread} unread</p>
// // //         </div>
// // //         <button onClick={() => refetch()} className={theme.ui.refreshBtn}>
// // //           <RefreshCw className="w-4 h-4" />
// // //         </button>
// // //         <HamburgerMenu propertyId={id} />
// // //       </div>

// // //       {/* Stats grid */}
// // //       <div className="grid grid-cols-3 gap-3 px-5 mt-4">
// // //         {[
// // //           { label: 'Total',    value: stats.total,    color: 'text-[#1c1c1c]' },
// // //           { label: 'Critical', value: stats.critical, color: 'text-red-500'   },
// // //           { label: 'Unread',   value: stats.unread,   color: 'text-[#c5a880]' },
// // //         ].map(({ label, value, color }) => (
// // //           <div key={label} className={theme.stat.interactive}>
// // //             <p className={theme.stat.label}>{label}</p>
// // //             <p className={`${theme.stat.value} text-base ${color}`}>{value}</p>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Filter tabs — active state is now beige instead of black */}
// // //       <div className="flex px-5 gap-2 mt-4">
// // //         {['all', 'new', 'active'].map((f) => (
// // //           <button
// // //             key={f}
// // //             onClick={() => setFilter(f)}
// // //             className={`flex-1 py-2 px-4 rounded-full font-sans font-bold
// // //                         text-sm transition-all
// // //                         ${filter === f
// // //                           ? 'bg-[#c5a880] text-white shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
// // //                           : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'}`}
// // //           >
// // //             {f.charAt(0).toUpperCase() + f.slice(1)}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Alerts list */}
// // //       <div className="p-5 space-y-3">
// // //         {isLoading ? (
// // //           <div className="flex flex-col items-center py-12 gap-3">
// // //             <div className={theme.ui.spinner} />
// // //             <p className={theme.type.bodySm}>Loading alerts...</p>
// // //           </div>
// // //         ) : alerts.length === 0 ? (
// // //           <div className={`${theme.card.base} flex flex-col items-center
// // //                            text-center py-12 gap-4`}>
// // //             <Shield className="h-12 w-12 text-gray-200" />
// // //             <h3 className={theme.type.h3}>No {filter} alerts</h3>
// // //             <p className={theme.type.bodySm}>
// // //               Alerts appear when cameras detect activity
// // //             </p>
// // //           </div>
// // //         ) : (
// // //           alerts.map((alert) => (
// // //             <div
// // //               key={alert.id}
// // //               onClick={() => handleAlertClick(alert)}
// // //               className={`bg-white rounded-[2rem] p-4 cursor-pointer
// // //                           transition-all duration-200 hover:shadow-md
// // //                           ${alert.is_read
// // //                             ? 'border border-[#e6e3db] opacity-80'
// // //                             : 'border border-[#c5a880]/40 shadow-[0_2px_12px_rgba(197,168,128,0.15)]'}`}
// // //             >
// // //               <div className="flex items-start gap-3">

// // //                 {/* Thumbnail */}
// // //                 {alert.image_url ? (
// // //                   <img
// // //                     src={getImageUrl(alert.image_url)}
// // //                     alt="Alert"
// // //                     className="w-16 h-16 rounded-[1rem] object-cover flex-shrink-0"
// // //                     onError={(e) => { e.target.style.display = 'none' }}
// // //                   />
// // //                 ) : (
// // //                   <div className="w-16 h-16 rounded-[1rem] bg-[#faf9f6]
// // //                                   border border-[#e6e3db] flex items-center
// // //                                   justify-center flex-shrink-0">
// // //                     <Bell className="w-6 h-6 text-gray-300" />
// // //                   </div>
// // //                 )}

// // //                 {/* Content */}
// // //                 <div className="flex-1 min-w-0">
// // //                   <div className="flex items-center gap-2 mb-1">
// // //                     <h3 className={`${theme.type.h4} truncate`}>{alert.type}</h3>
// // //                     {getStatusIcon(alert.status)}
// // //                   </div>

// // //                   <p className={theme.type.bodySm}>
// // //                     Camera: {alert.camera_name}
// // //                   </p>

// // //                   <div className="flex items-center gap-2 mt-2 flex-wrap">
// // //                     <span className={getSeverityBadge(alert.severity)}>
// // //                       {alert.severity}
// // //                     </span>
// // //                     <span className="font-sans text-[10px] font-bold text-[#c5a880]">
// // //                       {alert.confidence}% confidence
// // //                     </span>
// // //                     {alert.clip_url && (
// // //                       <span className="font-sans text-[10px] font-bold text-gray-400">
// // //                         🎬 Video
// // //                       </span>
// // //                     )}
// // //                     <span className="flex items-center gap-1 font-sans
// // //                                      text-[10px] font-medium text-gray-400">
// // //                       <Clock className="w-3 h-3" />
// // //                       {alert.timestamp}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //                 <span className="text-gray-300 font-sans text-lg">›</span>
// // //               </div>

// // //               {/* Quick actions */}
// // //               {alert.status === 'active' && (
// // //                 <div className="flex gap-2 mt-3 pt-3 border-t border-[#e6e3db]">
// // //                   <button
// // //                     onClick={(e) => { e.stopPropagation(); resolveAlert.mutate(alert.id) }}
// // //                     className="flex-1 bg-emerald-50 text-emerald-600 py-2
// // //                                rounded-full font-sans text-xs font-bold
// // //                                hover:bg-emerald-100 transition-colors
// // //                                border border-emerald-200"
// // //                   >
// // //                     Resolve
// // //                   </button>
// // //                   <button
// // //                     onClick={(e) => { e.stopPropagation(); markFalsePositive.mutate(alert.id) }}
// // //                     className="flex-1 bg-[#faf9f6] text-gray-500 py-2
// // //                                rounded-full font-sans text-xs font-bold
// // //                                hover:bg-[#e6e3db] transition-colors
// // //                                border border-[#e6e3db]"
// // //                   >
// // //                     False Positive
// // //                   </button>
// // //                   <button
// // //                     onClick={(e) => {
// // //                       e.stopPropagation()
// // //                       if (confirm('Delete this alert?')) deleteAlert.mutate(alert.id)
// // //                     }}
// // //                     className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
// // //                   >
// // //                     <Trash2 className="w-4 h-4" />
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))
// // //         )}
// // //       </div>

// // //     </div>
// // //   )
// // // }

// // // export default Alerts



// // src/pages/Alerts.jsx
// import { useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, CheckCircle, AlertTriangle, Clock,
//   Shield, XCircle, Trash2, Bell, RefreshCw,
// } from 'lucide-react'
// import {
//   useAlerts, useMarkAlertRead, useResolveAlert,
//   useMarkFalsePositive, useDeleteAlert,
// } from '../hooks/useAlerts'
// import HamburgerMenu from '../components/HamburgerMenu'
// import { API_BASE_URL } from '../config/api'
// import { theme } from '../theme'

// const Alerts = () => {
//   const { id }     = useParams()
//   const navigate   = useNavigate()
//   const [filter, setFilter] = useState('all')

//   const { data: alerts = [], isLoading, refetch } = useAlerts(id, filter)

//   const markRead          = useMarkAlertRead()
//   const resolveAlert      = useResolveAlert()
//   const markFalsePositive = useMarkFalsePositive()
//   const deleteAlert       = useDeleteAlert()

//   const stats = {
//     total:    alerts.length,
//     unread:   alerts.filter(a => !a.is_read).length,
//     critical: alerts.filter(a => a.severity === 'critical').length,
//     active:   alerts.filter(a => a.status === 'active').length,
//   }

//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl) return null
//     if (imageUrl.startsWith('http')) return imageUrl
//     return `${API_BASE_URL}${imageUrl}`
//   }

//   const getSeverityBadge = (severity) => {
//     switch (severity) {
//       case 'critical': return theme.badge.danger
//       case 'high':     return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest'
//       case 'medium':   return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest'
//       default:         return theme.badge.accent
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'active':         return <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
//       case 'resolved':       return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//       case 'false_positive': return <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
//       default:               return null
//     }
//   }

//   const handleAlertClick = (alert) => {
//     if (!alert.is_read) markRead.mutate(alert.id)
//     navigate(`/property/${id}/alert/${alert.id}`)
//   }

//   return (
//     <div className={`${theme.page.wrapper} pb-24`}>

//       {/* Header — full width */}
//       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
//                       flex items-center gap-3 shadow-sm">
//         <button
//           onClick={() => navigate(`/property/${id}`)}
//           className={theme.ui.backBtn}
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <div className="flex-1 min-w-0">
//           <h2 className={theme.type.h3}>Alerts</h2>
//           <p className={theme.type.labelSm}>{stats.unread} unread</p>
//         </div>
//         <button onClick={() => refetch()} className={theme.ui.refreshBtn}>
//           <RefreshCw className="w-4 h-4" />
//         </button>
//         <HamburgerMenu propertyId={id} />
//       </div>

//       {/* Stats grid — full width */}
//       <div className="grid grid-cols-3 gap-3 px-5 mt-4">
//         {[
//           { label: 'Total',    value: stats.total,    color: 'text-[#1c1c1c]' },
//           { label: 'Critical', value: stats.critical, color: 'text-red-500'   },
//           { label: 'Unread',   value: stats.unread,   color: 'text-[#c5a880]' },
//         ].map(({ label, value, color }) => (
//           <div key={label} className={theme.stat.interactive}>
//             <p className={theme.stat.label}>{label}</p>
//             <p className={`${theme.stat.value} text-base ${color}`}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Filter tabs — full width */}
//       <div className="flex px-5 gap-2 mt-4">
//         {['all', 'new', 'active'].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`flex-1 py-2 px-4 rounded-full font-sans font-bold
//                         text-sm transition-all
//                         ${filter === f
//                           ? 'bg-[#c5a880] text-white shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
//                           : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'}`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Alerts list — centered with max width */}
//       <div className="max-w-2xl mx-auto w-full p-5 space-y-3">
//         {isLoading ? (
//           <div className="flex flex-col items-center py-12 gap-3">
//             <div className={theme.ui.spinner} />
//             <p className={theme.type.bodySm}>Loading alerts...</p>
//           </div>
//         ) : alerts.length === 0 ? (
//           <div className={`${theme.card.base} flex flex-col items-center
//                            text-center py-12 gap-4`}>
//             <Shield className="h-12 w-12 text-gray-200" />
//             <h3 className={theme.type.h3}>No {filter} alerts</h3>
//             <p className={theme.type.bodySm}>
//               Alerts appear when cameras detect activity
//             </p>
//           </div>
//         ) : (
//           alerts.map((alert) => (
//             <div
//               key={alert.id}
//               onClick={() => handleAlertClick(alert)}
//               className={`bg-white rounded-[2rem] p-4 cursor-pointer
//                           transition-all duration-200 hover:shadow-md
//                           ${alert.is_read
//                             ? 'border border-[#e6e3db] opacity-80'
//                             : 'border border-[#c5a880]/40 shadow-[0_2px_12px_rgba(197,168,128,0.15)]'}`}
//             >
//               <div className="flex items-start gap-3">

//                 {/* Thumbnail */}
//                 {alert.image_url ? (
//                   <img
//                     src={getImageUrl(alert.image_url)}
//                     alt="Alert"
//                     className="w-16 h-16 rounded-[1rem] object-cover flex-shrink-0"
//                     onError={(e) => { e.target.style.display = 'none' }}
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-[1rem] bg-[#faf9f6]
//                                   border border-[#e6e3db] flex items-center
//                                   justify-center flex-shrink-0">
//                     <Bell className="w-6 h-6 text-gray-300" />
//                   </div>
//                 )}

//                 {/* Content */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h3 className={`${theme.type.h4} truncate`}>{alert.type}</h3>
//                     {getStatusIcon(alert.status)}
//                   </div>

//                   <p className={theme.type.bodySm}>
//                     Camera: {alert.camera_name}
//                   </p>

//                   <div className="flex items-center gap-2 mt-2 flex-wrap">
//                     <span className={getSeverityBadge(alert.severity)}>
//                       {alert.severity}
//                     </span>
//                     <span className="font-sans text-[10px] font-bold text-[#c5a880]">
//                       {alert.confidence}% confidence
//                     </span>
//                     {alert.clip_url && (
//                       <span className="font-sans text-[10px] font-bold text-gray-400">
//                         🎬 Video
//                       </span>
//                     )}
//                     <span className="flex items-center gap-1 font-sans
//                                      text-[10px] font-medium text-gray-400">
//                       <Clock className="w-3 h-3" />
//                       {alert.timestamp}
//                     </span>
//                   </div>
//                 </div>

//                 <span className="text-gray-300 font-sans text-lg">›</span>
//               </div>

//               {/* Quick actions */}
//               {alert.status === 'active' && (
//                 <div className="flex gap-2 mt-3 pt-3 border-t border-[#e6e3db]">
//                   <button
//                     onClick={(e) => { e.stopPropagation(); resolveAlert.mutate(alert.id) }}
//                     className="flex-1 bg-emerald-50 text-emerald-600 py-2
//                                rounded-full font-sans text-xs font-bold
//                                hover:bg-emerald-100 transition-colors
//                                border border-emerald-200"
//                   >
//                     Resolve
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); markFalsePositive.mutate(alert.id) }}
//                     className="flex-1 bg-[#faf9f6] text-gray-500 py-2
//                                rounded-full font-sans text-xs font-bold
//                                hover:bg-[#e6e3db] transition-colors
//                                border border-[#e6e3db]"
//                   >
//                     False Positive
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       if (confirm('Delete this alert?')) deleteAlert.mutate(alert.id)
//                     }}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   )
// }

// export default Alerts

// src/pages/Alerts.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Clock,
  Shield, XCircle, Trash2, Bell, RefreshCw,
} from 'lucide-react'
import {
  useAlerts, useMarkAlertRead, useResolveAlert,
  useMarkFalsePositive, useDeleteAlert,
} from '../hooks/useAlerts'
import HamburgerMenu from '../components/HamburgerMenu'
import { API_BASE_URL } from '../config/api'
import { theme } from '../theme'

const Alerts = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [filter, setFilter] = useState('all')

  const { data: alerts = [], isLoading, refetch } = useAlerts(id, filter)

  const markRead          = useMarkAlertRead()
  const resolveAlert      = useResolveAlert()
  const markFalsePositive = useMarkFalsePositive()
  const deleteAlert       = useDeleteAlert()

  const stats = {
    total:    alerts.length,
    unread:   alerts.filter(a => !a.is_read).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    active:   alerts.filter(a => a.status === 'active').length,
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_BASE_URL}${imageUrl}`
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical': return theme.badge.danger
      case 'high':     return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest'
      case 'medium':   return 'inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-widest'
      default:         return theme.badge.accent
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':         return <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
      case 'resolved':       return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
      default:               return null
    }
  }

  const handleAlertClick = (alert) => {
    if (!alert.is_read) markRead.mutate(alert.id)
    navigate(`/property/${id}/alert/${alert.id}`)
  }

  return (
    <div className={`${theme.page.wrapper} pb-24`}>

      {/* Header — full width */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(`/property/${id}`)}
          className={theme.ui.backBtn}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className={theme.type.h3}>Alerts</h2>
          <p className={theme.type.labelSm}>{stats.unread} unread</p>
        </div>
        <button onClick={() => refetch()} className={theme.ui.refreshBtn}>
          <RefreshCw className="w-4 h-4" />
        </button>
        <HamburgerMenu propertyId={id} />
      </div>

      {/* Stats grid — full width */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-4">
        {[
          { label: 'Total',    value: stats.total,    color: 'text-[#1c1c1c]' },
          { label: 'Critical', value: stats.critical, color: 'text-red-500'   },
          { label: 'Unread',   value: stats.unread,   color: 'text-[#c5a880]' },
        ].map(({ label, value, color }) => (
          <div key={label} className={theme.stat.interactive}>
            <p className={theme.stat.label}>{label}</p>
            <p className={`${theme.stat.value} text-base ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs — All and New only */}
      <div className="flex px-5 gap-2 mt-4">
        {['all', 'new'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-full font-sans font-bold
                        text-sm transition-all
                        ${filter === f
                          ? 'bg-[#c5a880] text-white shadow-[0_4px_14px_rgba(197,168,128,0.30)]'
                          : 'bg-white border border-[#e6e3db] text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880]'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts list — centered, wider */}
      <div className="max-w-3xl mx-auto w-full p-5 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className={theme.ui.spinner} />
            <p className={theme.type.bodySm}>Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className={`${theme.card.base} flex flex-col items-center
                           text-center py-12 gap-4`}>
            <Shield className="h-12 w-12 text-gray-200" />
            <h3 className={theme.type.h3}>No {filter} alerts</h3>
            <p className={theme.type.bodySm}>
              Alerts appear when cameras detect activity
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`bg-white rounded-[2rem] p-4 cursor-pointer
                          transition-all duration-200 hover:shadow-md
                          ${alert.is_read
                            ? 'border border-[#e6e3db] opacity-80'
                            : 'border border-[#c5a880]/40 shadow-[0_2px_12px_rgba(197,168,128,0.15)]'}`}
            >
              <div className="flex items-start gap-3">

                {/* Thumbnail */}
                {alert.image_url ? (
                  <img
                    src={getImageUrl(alert.image_url)}
                    alt="Alert"
                    className="w-16 h-16 rounded-[1rem] object-cover flex-shrink-0"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-[1rem] bg-[#faf9f6]
                                  border border-[#e6e3db] flex items-center
                                  justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-gray-300" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`${theme.type.h4} truncate`}>{alert.type}</h3>
                    {getStatusIcon(alert.status)}
                  </div>

                  <p className={theme.type.bodySm}>
                    Camera: {alert.camera_name}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={getSeverityBadge(alert.severity)}>
                      {alert.severity}
                    </span>
                    <span className="font-sans text-[10px] font-bold text-[#c5a880]">
                      {alert.confidence}% confidence
                    </span>
                    {alert.clip_url && (
                      <span className="font-sans text-[10px] font-bold text-gray-400">
                        🎬 Video
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-sans
                                     text-[10px] font-medium text-gray-400">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-gray-300 font-sans text-lg">›</span>
              </div>

              {/* Quick actions */}
              {alert.status === 'active' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-[#e6e3db]">
                  <button
                    onClick={(e) => { e.stopPropagation(); resolveAlert.mutate(alert.id) }}
                    className="flex-1 bg-emerald-50 text-emerald-600 py-2
                               rounded-full font-sans text-xs font-bold
                               hover:bg-emerald-100 transition-colors
                               border border-emerald-200"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); markFalsePositive.mutate(alert.id) }}
                    className="flex-1 bg-[#faf9f6] text-gray-500 py-2
                               rounded-full font-sans text-xs font-bold
                               hover:bg-[#e6e3db] transition-colors
                               border border-[#e6e3db]"
                  >
                    False Positive
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this alert?')) deleteAlert.mutate(alert.id)
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Alerts