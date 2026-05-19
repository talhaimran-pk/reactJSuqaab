// // // src/pages/EditCamera.jsx
// // import { useState, useEffect } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { ArrowLeft, Loader2, Grid3X3, Shield, DoorOpen, Eye } from 'lucide-react'
// // import { useProperty } from '../hooks/useProperties'
// // import { useCameras, useUpdateCamera } from '../hooks/useCameras'
// // import { theme } from '../theme'

// // const EditCamera = () => {
// //   const { id: propertyId, cameraId } = useParams()
// //   const navigate = useNavigate()

// //   const { data: propertyData, isLoading: propertyLoading } = useProperty(propertyId)
// //   const { data: cameras = [], isLoading: camerasLoading }  = useCameras(propertyId)
// //   const updateMutation = useUpdateCamera()

// //   const [formData, setFormData] = useState({
// //     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
// //   })
// //   const [error,        setError]        = useState('')
// //   const [originalType, setOriginalType] = useState('entrance')

// //   useEffect(() => {
// //     if (cameras.length > 0) {
// //       const camera = cameras.find(c => String(c.id) === String(cameraId))
// //       if (camera) {
// //         setFormData({
// //           name:        camera.name        || '',
// //           rtsp_url:    camera.rtsp_url    || '',
// //           grid_row:    camera.grid_cell?.row ?? 0,
// //           grid_col:    camera.grid_cell?.col ?? 0,
// //           camera_type: camera.camera_type || 'entrance',
// //         })
// //         setOriginalType(camera.camera_type || 'entrance')
// //       }
// //     }
// //   }, [cameras, cameraId])

// //   const property  = propertyData?.property || propertyData || {}
// //   const laserGrid = property.laser_grid || {}
// //   const xLasers   = laserGrid.x_lasers ?? property.x_lasers ?? 3
// //   const yLasers   = laserGrid.y_lasers ?? property.y_lasers ?? 8
// //   const maxRows   = Math.max(0, yLasers - 1)
// //   const maxCols   = Math.max(0, xLasers - 1)
// //   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
// //   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setError('')
// //     try {
// //       await updateMutation.mutateAsync({
// //         cameraId,
// //         propertyId,
// //         data: {
// //           name:      formData.name.trim(),
// //           rtsp_url:  formData.rtsp_url.trim(),
// //           grid_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) },
// //           camera_type: formData.camera_type,
// //         },
// //       })
// //       const changedToFence = formData.camera_type === 'fence' && originalType !== 'fence'
// //       if (changedToFence) {
// //         navigate(`/property/${propertyId}/camera/${cameraId}/calibrate`)
// //       } else {
// //         navigate(`/property/${propertyId}/cameras`)
// //       }
// //     } catch (err) {
// //       setError(err?.response?.data?.detail || 'Failed to update camera')
// //     }
// //   }

// //   if (propertyLoading || camerasLoading) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={theme.ui.spinner} />
// //       </div>
// //     )
// //   }

// //   const cameraTypes = [
// //     {
// //       value: 'entrance', label: 'Entrance',
// //       description: 'Entry/Exit monitoring', icon: DoorOpen,
// //       active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
// //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
// //     },
// //     {
// //       value: 'insider', label: 'Insider',
// //       description: 'Internal surveillance', icon: Eye,
// //       active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
// //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
// //     },
// //     {
// //       value: 'fence', label: 'Fence',
// //       description: 'Perimeter/climbing detection', icon: Shield,
// //       active: 'border-amber-500 bg-amber-50 text-amber-600',
// //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
// //     },
// //   ]

// //   const inp = theme.input.base
// //   const lbl = theme.input.label
// //   const busy = updateMutation.isPending

// //   return (
// //     <div className={theme.page.wrapper}>

// //       {/* Header */}
// //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
// //                       flex items-center gap-3 shadow-sm">
// //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //           <ArrowLeft className="h-5 w-5" />
// //         </button>
// //         <h2 className={theme.type.h3}>Edit Camera</h2>
// //       </div>

// //       <form onSubmit={handleSubmit} className="p-5 space-y-5">

// //         {error && <div className={theme.alert.error}>{error}</div>}

// //         {/* Camera type */}
// //         <div className={theme.card.muted}>
// //           <label className={`${lbl} mb-3`}>Camera Type *</label>
// //           <div className="grid grid-cols-3 gap-3">
// //             {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
// //               <button
// //                 key={value}
// //                 type="button"
// //                 onClick={() => setFormData({ ...formData, camera_type: value })}
// //                 className={`p-4 rounded-[1.25rem] border transition-all duration-200
// //                             flex flex-col items-center gap-2
// //                             ${formData.camera_type === value ? active : idle}`}
// //               >
// //                 <Icon className="w-6 h-6" />
// //                 <span className="font-sans font-bold text-sm">{label}</span>
// //                 <span className="font-sans text-[10px] text-center opacity-70">
// //                   {description}
// //                 </span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Fence warning — changing TO fence */}
// //         {formData.camera_type === 'fence' && originalType !== 'fence' && (
// //           <div className={theme.alert.warning}>
// //             ⚠️ Changing to <strong>Fence</strong> type will take you to polygon
// //             calibration after saving.
// //           </div>
// //         )}

// //         {/* Already fence — offer recalibrate info */}
// //         {formData.camera_type === 'fence' && originalType === 'fence' && (
// //           <div className={theme.alert.info}>
// //             🛡️ This is a Fence camera. To update polygon points, use the
// //             Recalibrate button on the camera list.
// //           </div>
// //         )}

// //         {/* Camera name */}
// //         <div className={theme.form.group}>
// //           <label className={lbl}>Camera Name *</label>
// //           <input
// //             type="text"
// //             placeholder={
// //               formData.camera_type === 'entrance' ? 'e.g., Main Gate Camera'
// //               : formData.camera_type === 'insider' ? 'e.g., Lobby Camera'
// //               : 'e.g., North Fence Camera'
// //             }
// //             className={inp}
// //             value={formData.name}
// //             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //             required
// //             disabled={busy}
// //           />
// //         </div>

// //         {/* RTSP URL */}
// //         <div className={theme.form.group}>
// //           <label className={lbl}>RTSP Stream URL *</label>
// //           <input
// //             type="text"
// //             placeholder="rtsp://192.168.1.50/stream"
// //             className={`${inp} font-mono`}
// //             value={formData.rtsp_url}
// //             onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
// //             required
// //             disabled={busy}
// //           />
// //         </div>

// //         {/* Grid location */}
// //         <div className={theme.card.muted}>
// //           <h3 className="font-sans text-sm font-black text-[#1c1c1c]
// //                          mb-4 flex items-center gap-2">
// //             <Grid3X3 className="w-4 h-4 text-[#c5a880]" />
// //             Grid Location
// //           </h3>
// //           <div className={theme.form.row}>
// //             <div className={theme.form.group}>
// //               <label className={lbl}>Row (0–{maxRows})</label>
// //               <select className={inp}
// //                 value={formData.grid_row}
// //                 onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
// //                 disabled={busy}>
// //                 {rowOptions.map(r => (
// //                   <option key={r} value={r}>Row {r}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className={theme.form.group}>
// //               <label className={lbl}>Column (0–{maxCols})</label>
// //               <select className={inp}
// //                 value={formData.grid_col}
// //                 onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
// //                 disabled={busy}>
// //                 {colOptions.map(c => (
// //                   <option key={c} value={c}>Col {c}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Submit */}
// //         <button
// //           type="submit"
// //           disabled={!formData.name || !formData.rtsp_url || busy}
// //           className={`${theme.button.primary} ${theme.button.full}`}
// //         >
// //           {busy
// //             ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
// //             : `Update ${formData.camera_type.charAt(0).toUpperCase() + formData.camera_type.slice(1)} Camera`}
// //         </button>

// //       </form>
// //     </div>
// //   )
// // }

// // export default EditCamera

// // src/pages/EditCamera.jsx
// import { useState, useEffect, useRef } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Loader2, Grid3X3, Shield, DoorOpen, Eye } from 'lucide-react'
// import { useProperty } from '../hooks/useProperties'
// import { useCameras, useUpdateCamera } from '../hooks/useCameras'
// import { theme } from '../theme'

// const EditCamera = () => {
//   const { id: propertyId, cameraId } = useParams()
//   const navigate = useNavigate()

//   const { data: propertyData, isLoading: propertyLoading } = useProperty(propertyId)
//   const { data: cameras = [], isLoading: camerasLoading }  = useCameras(propertyId)
//   const updateMutation = useUpdateCamera()

//   const [formData, setFormData] = useState({
//     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
//   })
//   const [error,        setError]        = useState('')
//   const [originalType, setOriginalType] = useState('entrance')

//   // ✅ FIX: prevent useEffect from resetting form on every 15s stream-status poll
//   const initialized = useRef(false)

//   useEffect(() => {
//     if (initialized.current) return          // skip if already pre-filled
//     if (cameras.length > 0) {
//       const camera = cameras.find(c => String(c.id) === String(cameraId))
//       if (camera) {
//         setFormData({
//           name:        camera.name        || '',
//           rtsp_url:    camera.rtsp_url    || '',
//           grid_row:    camera.grid_cell?.row ?? 0,
//           grid_col:    camera.grid_cell?.col ?? 0,
//           camera_type: camera.camera_type || 'entrance',
//         })
//         setOriginalType(camera.camera_type || 'entrance')
//         initialized.current = true           // mark done — never reset again
//       }
//     }
//   }, [cameras, cameraId])

//   const property  = propertyData?.property || propertyData || {}
//   const laserGrid = property.laser_grid || {}
//   const xLasers   = laserGrid.x_lasers ?? property.x_lasers ?? 3
//   const yLasers   = laserGrid.y_lasers ?? property.y_lasers ?? 8
//   const maxRows   = Math.max(0, yLasers - 1)
//   const maxCols   = Math.max(0, xLasers - 1)
//   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
//   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     try {
//       await updateMutation.mutateAsync({
//         cameraId,
//         propertyId,           // ✅ FIX: now passed so cache invalidation works
//         data: {
//           name:        formData.name.trim(),
//           rtsp_url:    formData.rtsp_url.trim(),
//           grid_cell:   { row: Number(formData.grid_row), col: Number(formData.grid_col) },
//           camera_type: formData.camera_type,
//         },
//       })

//       // ✅ FIX: handle all type-change redirects, not just fence
//       if (formData.camera_type === 'fence' && originalType !== 'fence') {
//         navigate(`/property/${propertyId}/camera/${cameraId}/calibrate`)
//       } else if (formData.camera_type === 'insider' && originalType !== 'insider') {
//         navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
//       } else {
//         navigate(`/property/${propertyId}/cameras`)
//       }
//     } catch (err) {
//       setError(err?.response?.data?.detail || 'Failed to update camera')
//     }
//   }

//   if (propertyLoading || camerasLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     )
//   }

//   const cameraTypes = [
//     {
//       value: 'entrance', label: 'Entrance',
//       description: 'Entry/Exit monitoring', icon: DoorOpen,
//       active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
//     },
//     {
//       value: 'insider', label: 'Insider',
//       description: 'Internal surveillance', icon: Eye,
//       active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
//     },
//     {
//       value: 'fence', label: 'Fence',
//       description: 'Perimeter/climbing detection', icon: Shield,
//       active: 'border-amber-500 bg-amber-50 text-amber-600',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
//     },
//   ]

//   const inp  = theme.input.base
//   const lbl  = theme.input.label
//   const busy = updateMutation.isPending

//   return (
//     <div className={theme.page.wrapper}>

//       {/* Header */}
//       <div className="bg-white border-b border-[#e6e3db] px-4 py-4
//                       flex items-center gap-3 shadow-sm">
//         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <h2 className={theme.type.h3}>Edit Camera</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="p-5 space-y-5">

//         {error && <div className={theme.alert.error}>{error}</div>}

//         {/* Camera type */}
//         <div className={theme.card.muted}>
//           <label className={`${lbl} mb-3`}>Camera Type *</label>
//           <div className="grid grid-cols-3 gap-3">
//             {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
//               <button
//                 key={value}
//                 type="button"
//                 onClick={() => setFormData({ ...formData, camera_type: value })}
//                 className={`p-4 rounded-[1.25rem] border transition-all duration-200
//                             flex flex-col items-center gap-2
//                             ${formData.camera_type === value ? active : idle}`}
//               >
//                 <Icon className="w-6 h-6" />
//                 <span className="font-sans font-bold text-sm">{label}</span>
//                 <span className="font-sans text-[10px] text-center opacity-70">
//                   {description}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Fence warning — changing TO fence */}
//         {formData.camera_type === 'fence' && originalType !== 'fence' && (
//           <div className={theme.alert.warning}>
//             ⚠️ Changing to <strong>Fence</strong> type will take you to polygon
//             calibration after saving.
//           </div>
//         )}

//         {/* Already fence — offer recalibrate info */}
//         {formData.camera_type === 'fence' && originalType === 'fence' && (
//           <div className={theme.alert.info}>
//             🛡️ This is a Fence camera. To update polygon points, use the
//             Recalibrate button on the camera list.
//           </div>
//         )}

//         {/* Insider warning — changing TO insider */}
//         {formData.camera_type === 'insider' && originalType !== 'insider' && (
//           <div className={theme.alert.warning}>
//             ⚠️ Changing to <strong>Insider</strong> type will take you to cell
//             definition after saving.
//           </div>
//         )}

//         {/* Already insider — offer recalibrate info */}
//         {formData.camera_type === 'insider' && originalType === 'insider' && (
//           <div className={theme.alert.info}>
//             👁️ This is an Insider camera. To update cell definitions, use the
//             Recalibrate button on the camera list.
//           </div>
//         )}

//         {/* Camera name */}
//         <div className={theme.form.group}>
//           <label className={lbl}>Camera Name *</label>
//           <input
//             type="text"
//             placeholder={
//               formData.camera_type === 'entrance' ? 'e.g., Main Gate Camera'
//               : formData.camera_type === 'insider' ? 'e.g., Lobby Camera'
//               : 'e.g., North Fence Camera'
//             }
//             className={inp}
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//             disabled={busy}
//           />
//         </div>

//         {/* RTSP URL */}
//         <div className={theme.form.group}>
//           <label className={lbl}>RTSP Stream URL *</label>
//           <input
//             type="text"
//             placeholder="rtsp://192.168.1.50/stream"
//             className={`${inp} font-mono`}
//             value={formData.rtsp_url}
//             onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
//             required
//             disabled={busy}
//           />
//         </div>

//         {/* Grid location */}
//         <div className={theme.card.muted}>
//           <h3 className="font-sans text-sm font-black text-[#1c1c1c]
//                          mb-4 flex items-center gap-2">
//             <Grid3X3 className="w-4 h-4 text-[#c5a880]" />
//             Grid Location
//           </h3>
//           <div className={theme.form.row}>
//             <div className={theme.form.group}>
//               <label className={lbl}>Row (0–{maxRows})</label>
//               <select className={inp}
//                 value={formData.grid_row}
//                 onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
//                 disabled={busy}>
//                 {rowOptions.map(r => (
//                   <option key={r} value={r}>Row {r}</option>
//                 ))}
//               </select>
//             </div>
//             <div className={theme.form.group}>
//               <label className={lbl}>Column (0–{maxCols})</label>
//               <select className={inp}
//                 value={formData.grid_col}
//                 onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
//                 disabled={busy}>
//                 {colOptions.map(c => (
//                   <option key={c} value={c}>Col {c}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={!formData.name || !formData.rtsp_url || busy}
//           className={`${theme.button.primary} ${theme.button.full}`}
//         >
//           {busy
//             ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
//             : `Update ${formData.camera_type.charAt(0).toUpperCase() + formData.camera_type.slice(1)} Camera`}
//         </button>

//       </form>
//     </div>
//   )
// }

// export default EditCamera

// src/pages/EditCamera.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Grid3X3, Shield, DoorOpen, Eye } from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import { useCameras, useUpdateCamera } from '../hooks/useCameras'
import { theme } from '../theme'

const EditCamera = () => {
  const { id: propertyId, cameraId } = useParams()
  const navigate = useNavigate()

  const { data: propertyData, isLoading: propertyLoading } = useProperty(propertyId)
  const { data: cameras = [], isLoading: camerasLoading }  = useCameras(propertyId)
  const updateMutation = useUpdateCamera()

  const [formData, setFormData] = useState({
    name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
  })
  const [error,        setError]        = useState('')
  const [originalType, setOriginalType] = useState('entrance')

  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    if (cameras.length > 0) {
      const camera = cameras.find(c => String(c.id) === String(cameraId))
      if (camera) {
        setFormData({
          name:        camera.name        || '',
          rtsp_url:    camera.rtsp_url    || '',
          grid_row:    camera.grid_cell?.row ?? 0,
          grid_col:    camera.grid_cell?.col ?? 0,
          camera_type: camera.camera_type || 'entrance',
        })
        setOriginalType(camera.camera_type || 'entrance')
        initialized.current = true
      }
    }
  }, [cameras, cameraId])

  const property  = propertyData?.property || propertyData || {}
  const laserGrid = property.laser_grid || {}
  const xLasers   = laserGrid.x_lasers ?? property.x_lasers ?? 3
  const yLasers   = laserGrid.y_lasers ?? property.y_lasers ?? 8
  const maxRows   = Math.max(0, yLasers - 1)
  const maxCols   = Math.max(0, xLasers - 1)
  const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
  const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

  // Whether the chosen type needs extra config steps before the DB is updated
  const typeChangingToFence   = formData.camera_type === 'fence'   && originalType !== 'fence'
  const typeChangingToInsider = formData.camera_type === 'insider' && originalType !== 'insider'
  const needsExtraConfig      = typeChangingToFence || typeChangingToInsider

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // ✅ FIX: do NOT save to DB yet when the new type needs extra configuration.
    //         Store pending edits in sessionStorage and navigate to the config
    //         step. The config page (FenceCellEditor / ClimbingCalibration)
    //         reads pendingCameraEdit, applies the update, then saves cells —
    //         so the camera is only committed once everything is complete.
    if (needsExtraConfig) {
      const pendingEdit = {
        cameraId,
        propertyId,
        data: {
          name:        formData.name.trim(),
          rtsp_url:    formData.rtsp_url.trim(),
          grid_cell:   { row: Number(formData.grid_row), col: Number(formData.grid_col) },
          camera_type: formData.camera_type,
        },
      }
      sessionStorage.setItem('pendingCameraEdit', JSON.stringify(pendingEdit))

      if (typeChangingToFence) {
        // Step 1: draw new polygon
        navigate(`/property/${propertyId}/camera/${cameraId}/calibrate`)
      } else {
        // Insider: go straight to zone definition
        navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
      }
      return
    }

    // ✅ No extra config needed (same type, or downgrading to entrance).
    //    Save immediately — settings_crud.update_camera will wipe stale
    //    fence/cell config on the backend when the type changes.
    try {
      await updateMutation.mutateAsync({
        cameraId,
        propertyId,
        data: {
          name:        formData.name.trim(),
          rtsp_url:    formData.rtsp_url.trim(),
          grid_cell:   { row: Number(formData.grid_row), col: Number(formData.grid_col) },
          camera_type: formData.camera_type,
        },
      })
      navigate(`/property/${propertyId}/cameras`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to update camera')
    }
  }

  if (propertyLoading || camerasLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    )
  }

  const cameraTypes = [
    {
      value: 'entrance', label: 'Entrance',
      description: 'Entry/Exit monitoring', icon: DoorOpen,
      active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
    },
    {
      value: 'insider', label: 'Insider',
      description: 'Internal surveillance', icon: Eye,
      active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
    },
    {
      value: 'fence', label: 'Fence',
      description: 'Perimeter/climbing detection', icon: Shield,
      active: 'border-amber-500 bg-amber-50 text-amber-600',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
    },
  ]

  const inp  = theme.input.base
  const lbl  = theme.input.label
  const busy = updateMutation.isPending

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={theme.type.h3}>Edit Camera</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">

        {error && <div className={theme.alert.error}>{error}</div>}

        {/* Camera type */}
        <div className={theme.card.muted}>
          <label className={`${lbl} mb-3`}>Camera Type *</label>
          <div className="grid grid-cols-3 gap-3">
            {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, camera_type: value })}
                className={`p-4 rounded-[1.25rem] border transition-all duration-200
                            flex flex-col items-center gap-2
                            ${formData.camera_type === value ? active : idle}`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-sans font-bold text-sm">{label}</span>
                <span className="font-sans text-[10px] text-center opacity-70">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Changing TO fence — deferred save warning
        {typeChangingToFence && (
          <div className={theme.alert.warning}>
            ⚠️ Changing to <strong>Fence</strong> requires polygon calibration and
            cell definition. The camera will only be updated after all steps are
            completed. Existing cells will be cleared.
          </div>
        )} */}

        {/* Changing TO insider — deferred save warning
        {typeChangingToInsider && (
          <div className={theme.alert.warning}>
            ⚠️ Changing to <strong>Insider</strong> requires zone definition. The
            camera will only be updated after zones are saved. Existing cells will
            be cleared.
          </div>
        )} */}

        {/* Downgrading to entrance from fence/insider — data loss warning
        {formData.camera_type === 'entrance' &&
          (originalType === 'fence' || originalType === 'insider') && (
          <div className={theme.alert.warning}>
            ⚠️ Changing to <strong>Entrance</strong> will permanently delete all{' '}
            {originalType === 'fence' ? 'polygon and cell' : 'zone'} configuration
            for this camera.
          </div>
        )} */}

        {/* Already fence — recalibrate info
        {formData.camera_type === 'fence' && originalType === 'fence' && (
          <div className={theme.alert.info}>
            🛡️ This is a Fence camera. To update polygon points or cells, use the
            Recalibrate button on the camera list.
          </div>
        )} */}

        {/* Already insider — recalibrate info
        {formData.camera_type === 'insider' && originalType === 'insider' && (
          <div className={theme.alert.info}>
            👁️ This is an Insider camera. To update zone definitions, use the
            Recalibrate button on the camera list.
          </div>
        )} */}

        {/* Camera name */}
        <div className={theme.form.group}>
          <label className={lbl}>Camera Name *</label>
          <input
            type="text"
            placeholder={
              formData.camera_type === 'entrance' ? 'e.g., Main Gate Camera'
              : formData.camera_type === 'insider' ? 'e.g., Lobby Camera'
              : 'e.g., North Fence Camera'
            }
            className={inp}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={busy}
          />
        </div>

        {/* RTSP URL */}
        <div className={theme.form.group}>
          <label className={lbl}>RTSP Stream URL *</label>
          <input
            type="text"
            placeholder="rtsp://192.168.1.50/stream"
            className={`${inp} font-mono`}
            value={formData.rtsp_url}
            onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
            required
            disabled={busy}
          />
        </div>

        {/* Grid location */}
        <div className={theme.card.muted}>
          <h3 className="font-sans text-sm font-black text-[#1c1c1c]
                         mb-4 flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-[#c5a880]" />
            Grid Location
          </h3>
          <div className={theme.form.row}>
            <div className={theme.form.group}>
              <label className={lbl}>Row (0–{maxRows})</label>
              <select className={inp}
                value={formData.grid_row}
                onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
                disabled={busy}>
                {rowOptions.map(r => (
                  <option key={r} value={r}>Row {r}</option>
                ))}
              </select>
            </div>
            <div className={theme.form.group}>
              <label className={lbl}>Column (0–{maxCols})</label>
              <select className={inp}
                value={formData.grid_col}
                onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
                disabled={busy}>
                {colOptions.map(c => (
                  <option key={c} value={c}>Col {c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!formData.name || !formData.rtsp_url || busy}
          className={`${theme.button.primary} ${theme.button.full}`}
        >
          {busy
            ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            : needsExtraConfig
              ? `Next: ${typeChangingToFence ? 'Draw Polygon →' : 'Define Zones →'}`
              : `Update ${formData.camera_type.charAt(0).toUpperCase() + formData.camera_type.slice(1)} Camera`
          }
        </button>

      </form>
    </div>
  )
}

export default EditCamera