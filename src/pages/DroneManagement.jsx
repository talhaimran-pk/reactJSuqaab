// // // src/pages/DroneManagement.jsx
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { ThumbsUp,ArrowLeft, Plus, Edit2, Trash2, Navigation, Battery, Wifi, Loader2 } from 'lucide-react'
// // import { useDrones, useDeleteDrone } from '../hooks/useDrones'
// // import { useProperty } from '../hooks/useProperties'
// // import HamburgerMenu from '../components/HamburgerMenu'
// // import { theme } from '../theme'
// // import { useState } from 'react'

// // const DroneManagement = () => {
// //   const { id } = useParams()
// //   const navigate = useNavigate()

// //   const { data: drones = [], isLoading, error } = useDrones(id)
// //   const { data: property } = useProperty(id)
// //   const deleteMutation = useDeleteDrone()

// //   const handleDelete = async (droneId) => {
// //     if (!confirm('Are you sure you want to delete this drone?')) return
// //     try {
// //       await deleteMutation.mutateAsync({ droneId, propertyId: id })
// //     } catch {
// //       alert('Failed to delete drone')
// //     } 
// //   }

// //   const getStatusStyle = (status) => {
// //     switch (status) {
// //       case 'Ready':
// //       case 'Docked':       return 'text-emerald-600 bg-emerald-50 border border-emerald-200'
// //       case 'Flying':       return 'text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30'
// //       case 'Charging':     return 'text-amber-600 bg-amber-50 border border-amber-200'
// //       case 'Offline':      return 'text-red-500 bg-red-50 border border-red-200'
// //       case 'Maintenance':  return 'text-orange-600 bg-orange-50 border border-orange-200'
// //       default:             return 'text-gray-500 bg-[#faf9f6] border border-[#e6e3db]'
// //     }
// //   }

// //   if (isLoading) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={theme.ui.spinner} />
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// //           <p className={`${theme.type.error} mb-3`}>Failed to load drones</p>
// //           <button onClick={() => window.location.reload()} className={theme.type.link}>
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className={`${theme.page.wrapper} pb-24`}>

// //       {/* Header */}
// //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
// //                       flex items-center gap-3 shadow-sm">
// //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //           <ArrowLeft className="h-5 w-5" />
// //         </button>
// //         <h2 className={`${theme.type.h3} flex-1`}>
// //           Manage Drones ({drones.length})
// //         </h2>
// //         <HamburgerMenu propertyId={id} />
// //       </div>

// //       <div className="p-5 space-y-3">
// //         {drones.length === 0 ? (

// //           /* Empty state */
// //           <div className={`${theme.card.lg} flex flex-col items-center text-center gap-5`}>
// //             <div className={theme.ui.iconBox}>
// //               <Navigation className="h-6 w-6 text-[#c5a880]" />
// //             </div>
// //             <div>
// //               <h3 className={`${theme.type.h3} mb-2`}>No drones added yet</h3>
// //               <p className={theme.type.bodySm}>Add drones</p>
// //             </div>
// //             <button
// //               onClick={() => navigate(`/property/${id}/drone/add`)}
// //               className={theme.button.primary}
// //             >
// //               Add First Drone
// //             </button>
// //           </div>

// //         ) : (
// //           drones.map((drone) => (
// //             <div key={drone.id} className={theme.card.base}>
// //               <div className="flex justify-between items-start">
// //                 <div className="flex-1 min-w-0">

// //                   {/* Name + status */}
// //                   <div className="flex items-center gap-2 flex-wrap mb-1">
// //                     <h3 className={theme.type.h4}>{drone.name}</h3>
// //                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full
// //                                       uppercase tracking-widest
// //                                       ${getStatusStyle(drone.status)}`}>
// //                       {drone.status}
// //                     </span>
// //                   </div>

// //                   {/* Connection string */}
// //                   <p className="font-mono text-xs text-gray-400 truncate">
// //                     {drone.connection_string}
// //                   </p>

// //                   {/* Telemetry pills */}
// //                   <div className="flex items-center gap-3 mt-2">
// //                     <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
// //                       <Battery className="w-3.5 h-3.5" />
// //                       {drone.status === 'Offline' ? '--' : '100%'}
// //                     </span>
// //                     <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
// //                       <Wifi className="w-3.5 h-3.5" />
// //                       {drone.status === 'Offline' ? 'Offline' : 'Online'}
// //                     </span>
// //                   </div>

// //                   {/* Home cell */}
// //                   {drone.home_cell && (
// //                     <p className={`${theme.type.labelSm} mt-2`}>
// //                       🏠 Home: Row {drone.home_cell.row}, Col {drone.home_cell.col}
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Actions */}
// //                 <div className="flex gap-1 ml-3">

// //                   <button
// //                     onClick={() => navigate(`/property/${id}/drone/${drone.id}/edit`)}
// //                     className={theme.button.icon}
// //                     title="Edit"
// //                   >
                    
// //                     <Edit2 className="h-4 w-4" />
// //                   </button>
                 
// //                   <button
// //                     onClick={() => handleDelete(drone.id)}
// //                     disabled={deleteMutation.isPending}
// //                     className="p-2.5 rounded-full hover:bg-red-50 active:scale-95
// //                                transition-all text-red-500 disabled:opacity-40"
// //                     title="Delete"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* FAB */}
// //       {drones.length > 0 && (
// //         <button
// //           onClick={() => navigate(`/property/${id}/drone/add`)}
// //           className={theme.ui.fab}
// //         >
// //           <Plus className="h-6 w-6" />
// //         </button>
// //       )}

// //     </div>
// //   )
// // }

// // export default DroneManagement

// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Plus, Edit2, Trash2, Navigation, Battery, Wifi } from 'lucide-react'
// import { useDrones, useDeleteDrone } from '../hooks/useDrones'
// import { useProperty } from '../hooks/useProperties'
// import HamburgerMenu from '../components/HamburgerMenu'
// import { theme } from '../theme'

// const DroneManagement = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const { data: drones = [], isLoading, error } = useDrones(id)
//   const { data: property } = useProperty(id)
//   const deleteMutation = useDeleteDrone()

//   const handleDelete = async (droneId) => {
//     if (!confirm('Are you sure you want to delete this drone?')) return
//     try {
//       await deleteMutation.mutateAsync({ droneId, propertyId: id })
//     } catch {
//       alert('Failed to delete drone')
//     }
//   }

//   const getOnlineBadgeClass = (is_online) => {
//     if (is_online === null)  return 'text-gray-400 bg-gray-100 border border-gray-200'
//     if (is_online === true)  return 'text-emerald-600 bg-emerald-50 border border-emerald-200'
//     return 'text-red-500 bg-red-50 border border-red-200'
//   }

//   const getOnlineLabel = (is_online) => {
//     if (is_online === null) return 'CHECKING...'
//     return is_online ? 'ONLINE' : 'OFFLINE'
//   }

//   if (isLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
//           <p className={`${theme.type.error} mb-3`}>Failed to load drones</p>
//           <button onClick={() => window.location.reload()} className={theme.type.link}>
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`${theme.page.wrapper} pb-24`}>

//       {/* Header */}
//       <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
//         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <h2 className={`${theme.type.h3} flex-1`}>
//           Manage Drones ({drones.length})
//         </h2>
//         <HamburgerMenu propertyId={id} />
//       </div>

//       <div className="p-5 space-y-3">
//         {drones.length === 0 ? (

//           /* Empty state */
//           <div className={`${theme.card.lg} flex flex-col items-center text-center gap-5`}>
//             <div className={theme.ui.iconBox}>
//               <Navigation className="h-6 w-6 text-[#c5a880]" />
//             </div>
//             <div>
//               <h3 className={`${theme.type.h3} mb-2`}>No drones added yet</h3>
//               <p className={theme.type.bodySm}>Add drones</p>
//             </div>
//             <button
//               onClick={() => navigate(`/property/${id}/drone/add`)}
//               className={theme.button.primary}
//             >
//               Add First Drone
//             </button>
//           </div>

//         ) : (
//           drones.map((drone) => (
//             <div key={drone.id} className={theme.card.base}>
//               <div className="flex justify-between items-start">
//                 <div className="flex-1 min-w-0">

//                   {/* Name + status badge */}
//                   <div className="flex items-center gap-2 flex-wrap mb-1">
//                     <h3 className={theme.type.h4}>{drone.name}</h3>
//                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${getOnlineBadgeClass(drone.is_online)}`}>
//                       {getOnlineLabel(drone.is_online)}
//                     </span>
//                   </div>

//                   {/* Connection string */}
//                   <p className="font-mono text-xs text-gray-400 truncate">
//                     {drone.connection_string}
//                   </p>

//                   {/* Telemetry pills */}
//                   <div className="flex items-center gap-3 mt-2">
//                     <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
//                       <Battery className="w-3.5 h-3.5" />
//                       {drone.is_online ? '100%' : '--'}
//                     </span>
//                     <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
//                       <Wifi className="w-3.5 h-3.5" />
//                       {drone.is_online === null ? '...' : drone.is_online ? 'Online' : 'Offline'}
//                     </span>
//                   </div>

//                   {/* Home cell */}
//                   {drone.home_cell && (
//                     <p className={`${theme.type.labelSm} mt-2`}>
//                       🏠 Home: Row {drone.home_cell.row}, Col {drone.home_cell.col}
//                     </p>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-1 ml-3">
//                   <button
//                     onClick={() => navigate(`/property/${id}/drone/${drone.id}/edit`)}
//                     className={theme.button.icon}
//                     title="Edit"
//                   >
//                     <Edit2 className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(drone.id)}
//                     disabled={deleteMutation.isPending}
//                     className="p-2.5 rounded-full hover:bg-red-50 active:scale-95 transition-all text-red-500 disabled:opacity-40"
//                     title="Delete"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* FAB */}
//       {drones.length > 0 && (
//         <button
//           onClick={() => navigate(`/property/${id}/drone/add`)}
//           className={theme.ui.fab}
//         >
//           <Plus className="h-6 w-6" />
//         </button>
//       )}

//     </div>
//   )
// }

// export default DroneManagement

import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, Navigation, Battery, Wifi } from 'lucide-react'
import { useDrones, useDeleteDrone } from '../hooks/useDrones'
import { useProperty } from '../hooks/useProperties'
import HamburgerMenu from '../components/HamburgerMenu'
import { theme } from '../theme'

const DroneManagement = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: drones = [], isLoading, error } = useDrones(id)
  const { data: property } = useProperty(id)
  const deleteMutation = useDeleteDrone()

  const handleDelete = async (droneId) => {
    if (!confirm('Are you sure you want to delete this drone?')) return
    try {
      await deleteMutation.mutateAsync({ droneId, propertyId: id })
    } catch {
      alert('Failed to delete drone')
    }
  }

  const getOnlineBadgeClass = (is_online) => {
    if (is_online === null)  return 'text-gray-400 bg-gray-100 border border-gray-200'
    if (is_online === true)  return 'text-emerald-600 bg-emerald-50 border border-emerald-200'
    return 'text-red-500 bg-red-50 border border-red-200'
  }

  const getOnlineLabel = (is_online) => {
    if (is_online === null) return 'CHECKING...'
    return is_online ? 'ONLINE' : 'OFFLINE'
  }

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Failed to load drones</p>
          <button onClick={() => window.location.reload()} className={theme.type.link}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme.page.wrapper} pb-24`}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={`${theme.type.h3} flex-1`}>
          Manage Drones ({drones.length})
        </h2>
        <HamburgerMenu propertyId={id} />
      </div>

      <div className="p-5">
        {drones.length === 0 ? (

          /* Empty state */
          <div className={`${theme.card.lg} flex flex-col items-center text-center gap-5`}>
            <div className={theme.ui.iconBox}>
              <Navigation className="h-6 w-6 text-[#c5a880]" />
            </div>
            <div>
              <h3 className={`${theme.type.h3} mb-2`}>No drones added yet</h3>
              <p className={theme.type.bodySm}>Add drones</p>
            </div>
            <button
              onClick={() => navigate(`/property/${id}/drone/add`)}
              className={theme.button.primary}
            >
              Add First Drone
            </button>
          </div>

        ) : (
          <div className="grid grid-cols-2 gap-3">
            {drones.map((drone) => (
              <div key={drone.id} className={theme.card.base}>

                {/* Name + actions row */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`${theme.type.h4} leading-tight`}>{drone.name}</h3>
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button
                      onClick={() => navigate(`/property/${id}/drone/${drone.id}/edit`)}
                      className={theme.button.icon}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(drone.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2.5 rounded-full hover:bg-red-50 active:scale-95 transition-all text-red-500 disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 ${getOnlineBadgeClass(drone.is_online)}`}>
                  {getOnlineLabel(drone.is_online)}
                </span>

                {/* Connection string */}
                <p className="font-mono text-xs text-gray-400 truncate mb-2">
                  {drone.connection_string}
                </p>

                {/* Telemetry pills */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                    <Battery className="w-3.5 h-3.5" />
                    {drone.is_online ? '100%' : '--'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                    <Wifi className="w-3.5 h-3.5" />
                    {drone.is_online === null ? '...' : drone.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Home cell */}
                {drone.home_cell && (
                  <p className={`${theme.type.labelSm} mt-2`}>
                    🏠 Row {drone.home_cell.row}, Col {drone.home_cell.col}
                  </p>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      {drones.length > 0 && (
        <button
          onClick={() => navigate(`/property/${id}/drone/add`)}
          className={theme.ui.fab}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

    </div>
  )
}

export default DroneManagement