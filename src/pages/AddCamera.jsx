// // // // // src/pages/AddCamera.jsx
// // // // import { useState } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import { ArrowLeft, Loader2, Grid3X3, Shield, Video, DoorOpen, Eye } from 'lucide-react'
// // // // import { useProperty } from '../hooks/useProperties'
// // // // import { useCreateCamera } from '../hooks/useCameras'
// // // // import { theme } from '../theme'

// // // // const AddCamera = () => {
// // // //   const { id } = useParams()
// // // //   const navigate = useNavigate()
// // // //   const { data: propertyData, isLoading } = useProperty(id)
// // // //   const createMutation = useCreateCamera()
  
// // // //   const [formData, setFormData] = useState({
// // // //     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
// // // //   })
// // // //   const [error, setError] = useState('')

// // // //   const property = propertyData?.property || propertyData || {}
// // // //   const laserGrid = property.laser_grid || {}
// // // //   const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3
// // // //   const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8
// // // //   const maxRows = Math.max(0, yLasers - 1)
// // // //   const maxCols = Math.max(0, xLasers - 1)
// // // //   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
// // // //   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault()
// // // //     setError('')
// // // //     try {
// // // //       const result = await createMutation.mutateAsync({
// // // //         propertyId: id,
// // // //         data: {
// // // //           name: formData.name,
// // // //           rtsp_url: formData.rtsp_url,
// // // //           grid_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) },
// // // //           camera_type: formData.camera_type,
// // // //         }
// // // //       })

// // // //       if (formData.camera_type === 'fence') {
// // // //         // ✅ result.camera_id now comes from the backend — never 'new'
// // // //         const newId = result?.camera_id
// // // //         if (!newId) {
// // // //           setError('Camera was created but ID was not returned. Please calibrate from the camera list.')
// // // //           return
// // // //         }
// // // //         navigate(`/property/${id}/camera/${newId}/calibrate/new`)
// // // //       } else {
// // // //         navigate(`/property/${id}/cameras`)
// // // //       }
// // // //     } catch (err) {
// // // //       setError(err.response?.data?.detail || 'Failed to create camera')
// // // //     }
// // // //   }
// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className={theme.page.centered}>
// // // //         <div className={theme.ui.spinner} />
// // // //       </div>
// // // //     )
// // // //   }

// // // //   const cameraTypes = [
// // // //     {
// // // //       value: 'entrance', label: 'Entrance', description: 'Entry/Exit monitoring', icon: DoorOpen,
// // // //       active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
// // // //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
// // // //     },
// // // //     {
// // // //       value: 'insider', label: 'Insider', description: 'Internal surveillance', icon: Eye,
// // // //       active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
// // // //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
// // // //     },
// // // //     {
// // // //       value: 'fence', label: 'Fence', description: 'Perimeter/climbing detection', icon: Shield,
// // // //       active: 'border-amber-500 bg-amber-50 text-amber-600',
// // // //       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
// // // //     },
// // // //   ]

// // // //   const inp = theme.input.base;
// // // //   const lbl = theme.input.label;
// // // //   const busy = createMutation.isPending;

// // // //   return (
// // // //     <div className={theme.page.wrapper}>
// // // //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
// // // //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // //           <ArrowLeft className="h-5 w-5" />
// // // //         </button>
// // // //         <h2 className={theme.type.h3}>Add New Camera</h2>
// // // //       </div>

// // // //       <form onSubmit={handleSubmit} className="p-5 space-y-5 pb-24">
// // // //         {error && <div className={theme.alert.error}>{error}</div>}

// // // //         <div className={theme.card.muted}>
// // // //           <label className={`${lbl} mb-3`}>Camera Type *</label>
// // // //           <div className="grid grid-cols-3 gap-3">
// // // //             {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
// // // //               <button
// // // //                 key={value}
// // // //                 type="button"
// // // //                 onClick={() => setFormData({ ...formData, camera_type: value })}
// // // //                 className={`p-4 rounded-[1.25rem] border transition-all duration-200 flex flex-col items-center gap-2 ${formData.camera_type === value ? active : idle}`}
// // // //               >
// // // //                 <Icon className="w-6 h-6" />
// // // //                 <span className="font-sans font-bold text-sm">{label}</span>
// // // //                 <span className="font-sans text-[10px] text-center opacity-70">{description}</span>
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>

// // // //         {formData.camera_type === 'fence' && (
// // // //           <div className={theme.alert.warning}>
// // // //             ⚠️ Fence cameras require polygon calibration. You'll configure this next.
// // // //           </div>
// // // //         )}

// // // //         <div className={theme.form.group}>
// // // //           <label className={lbl}>Camera Name *</label>
// // // //           <input
// // // //             type="text"
// // // //             placeholder={
// // // //               formData.camera_type === 'entrance' ? 'e.g., Main Gate Camera' :
// // // //               formData.camera_type === 'insider' ? 'e.g., Lobby Camera' :
// // // //               'e.g., North Fence Camera'
// // // //             }
// // // //             className={inp}
// // // //             value={formData.name}
// // // //             onChange={(e) => setFormData({...formData, name: e.target.value})}
// // // //             required
// // // //             disabled={busy}
// // // //           />
// // // //         </div>

// // // //         <div className={theme.form.group}>
// // // //           <label className={lbl}>RTSP Stream URL *</label>
// // // //           <input
// // // //             type="text"
// // // //             placeholder="rtsp://192.168.1.50/stream"
// // // //             className={`${inp} font-mono`}
// // // //             value={formData.rtsp_url}
// // // //             onChange={(e) => setFormData({...formData, rtsp_url: e.target.value})}
// // // //             required
// // // //             disabled={busy}
// // // //           />
// // // //         </div>

// // // //         <div className={theme.card.muted}>
// // // //           <h3 className="font-sans text-sm font-black text-[#1c1c1c] mb-4 flex items-center gap-2">
// // // //             <Grid3X3 className="w-4 h-4 text-[#c5a880]" /> Grid Location
// // // //           </h3>
// // // //           <div className={theme.form.row}>
// // // //             <div className={theme.form.group}>
// // // //               <label className={lbl}>Row (0–{maxRows})</label>
// // // //               <select className={inp} value={formData.grid_row} onChange={(e) => setFormData({...formData, grid_row: Number(e.target.value)})} disabled={busy}>
// // // //                 {rowOptions.map(row => <option key={row} value={row}>Row {row}</option>)}
// // // //               </select>
// // // //             </div>
// // // //             <div className={theme.form.group}>
// // // //               <label className={lbl}>Column (0–{maxCols})</label>
// // // //               <select className={inp} value={formData.grid_col} onChange={(e) => setFormData({...formData, grid_col: Number(e.target.value)})} disabled={busy}>
// // // //                 {colOptions.map(col => <option key={col} value={col}>Col {col}</option>)}
// // // //               </select>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         <button type="submit" disabled={!formData.name || !formData.rtsp_url || busy} className={`${theme.button.primary} ${theme.button.full}`}>
// // // //           {busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Add ${formData.camera_type.charAt(0).toUpperCase() + formData.camera_type.slice(1)} Camera`}
// // // //         </button>
// // // //       </form>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default AddCamera

// // // import { useState } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import { ArrowLeft, Loader2, Grid3X3, Shield, Video, DoorOpen, Eye, Info } from 'lucide-react'
// // // import { useProperty } from '../hooks/useProperties'
// // // import { useCreateCamera } from '../hooks/useCameras'
// // // import { theme } from '../theme'

// // // const AddCamera = () => {
// // //   const { id } = useParams()
// // //   const navigate = useNavigate()
// // //   const { data: propertyData, isLoading } = useProperty(id)
// // //   const createMutation = useCreateCamera()
  
// // //   const [formData, setFormData] = useState({
// // //     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
// // //   })
// // //   const [error, setError] = useState('')

// // //   const property = propertyData?.property || propertyData || {}
// // //   const laserGrid = property.laser_grid || {}
// // //   const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3
// // //   const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8
// // //   const maxRows = Math.max(0, yLasers - 1)
// // //   const maxCols = Math.max(0, xLasers - 1)
// // //   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
// // //   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()
// // //     setError('')
// // //     try {
// // //       const result = await createMutation.mutateAsync({
// // //         propertyId: id,
// // //         data: {
// // //           name: formData.name,
// // //           rtsp_url: formData.rtsp_url,
// // //           grid_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) },
// // //           camera_type: formData.camera_type,
// // //         }
// // //       })

// // //       if (formData.camera_type === 'fence') {
// // //         const newId = result?.camera_id
// // //         if (!newId) {
// // //           setError('Camera was created but ID was not returned.')
// // //           return
// // //         }
// // //         navigate(`/property/${id}/camera/${newId}/calibrate/new`)
// // //       } else {
// // //         navigate(`/property/${id}/cameras`)
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.detail || 'Failed to create camera')
// // //     }
// // //   }

// // //   if (isLoading) return <div className={theme.page.centered}><div className={theme.ui.spinner} /></div>

// // //   const cameraTypes = [
// // //     { value: 'entrance', label: 'Entrance', description: 'Entry/Exit monitoring', icon: DoorOpen, active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40' },
// // //     { value: 'insider', label: 'Insider', description: 'Internal surveillance', icon: Eye, active: 'border-emerald-500 bg-emerald-50 text-emerald-600', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300' },
// // //     { value: 'fence', label: 'Fence', description: 'Perimeter detection', icon: Shield, active: 'border-amber-500 bg-amber-50 text-amber-600', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300' },
// // //   ]

// // //   const inp = theme.input.base;
// // //   const lbl = theme.input.label;
// // //   const busy = createMutation.isPending;

// // //   return (
// // //     <div className="min-h-screen bg-[#faf9f6]">
// // //       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
// // //         <div className="flex items-center gap-4">
// // //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}><ArrowLeft className="h-5 w-5" /></button>
// // //           <h2 className={theme.header.title}>Add New Camera</h2>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-5xl mx-auto px-6 py-10">
// // //         <form onSubmit={handleSubmit} className="space-y-8">
// // //           {error && <div className={theme.alert.error}>{error}</div>}

// // //           <section className={theme.card.base}>
// // //             <label className={`${lbl} mb-4 block`}>Select Camera Function</label>
// // //             <div className="grid grid-cols-3 gap-6">
// // //               {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
// // //                 <button
// // //                   key={value}
// // //                   type="button"
// // //                   onClick={() => setFormData({ ...formData, camera_type: value })}
// // //                   className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3 ${formData.camera_type === value ? active : idle}`}
// // //                 >
// // //                   <Icon className="w-8 h-8" />
// // //                   <div>
// // //                     <p className="font-bold text-sm">{label}</p>
// // //                     <p className="text-[11px] opacity-70 mt-1 leading-tight">{description}</p>
// // //                   </div>
// // //                 </button>
// // //               ))}
// // //             </div>
            
// // //             {formData.camera_type === 'fence' && (
// // //               <div className={`${theme.alert.warning} mt-6 flex items-center gap-3`}>
// // //                 <Info className="w-5 h-5 flex-shrink-0" />
// // //                 <p className="text-xs">Fence cameras require <strong>polygon calibration</strong>. You will be redirected to the calibration screen after saving.</p>
// // //               </div>
// // //             )}
// // //           </section>

// // //           <section className={theme.card.base}>
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // //               <div className={theme.form.group}>
// // //                 <label className={lbl}>Camera Identification Name *</label>
// // //                 <input
// // //                   type="text"
// // //                   placeholder="e.g., North Gate HD"
// // //                   className={inp}
// // //                   value={formData.name}
// // //                   onChange={(e) => setFormData({...formData, name: e.target.value})}
// // //                   required
// // //                   disabled={busy}
// // //                 />
// // //               </div>
// // //               <div className={theme.form.group}>
// // //                 <label className={lbl}>RTSP Stream URL *</label>
// // //                 <input
// // //                   type="text"
// // //                   placeholder="rtsp://admin:password@192.168.1.50:554/live"
// // //                   className={`${inp} font-mono text-xs`}
// // //                   value={formData.rtsp_url}
// // //                   onChange={(e) => setFormData({...formData, rtsp_url: e.target.value})}
// // //                   required
// // //                   disabled={busy}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </section>

// // //           <section className={theme.card.base}>
// // //             <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
// // //               <Grid3X3 className="w-5 h-5" />
// // //               <h3 className="font-bold uppercase tracking-widest text-xs">Grid Deployment Location</h3>
// // //             </div>
// // //             <div className="grid grid-cols-2 gap-8">
// // //               <div className={theme.form.group}>
// // //                 <label className={lbl}>Row (Vertical Axis)</label>
// // //                 <select className={inp} value={formData.grid_row} onChange={(e) => setFormData({...formData, grid_row: Number(e.target.value)})} disabled={busy}>
// // //                   {rowOptions.map(row => <option key={row} value={row}>Row Index {row}</option>)}
// // //                 </select>
// // //               </div>
// // //               <div className={theme.form.group}>
// // //                 <label className={lbl}>Column (Horizontal Axis)</label>
// // //                 <select className={inp} value={formData.grid_col} onChange={(e) => setFormData({...formData, grid_col: Number(e.target.value)})} disabled={busy}>
// // //                   {colOptions.map(col => <option key={col} value={col}>Column Index {col}</option>)}
// // //                 </select>
// // //               </div>
// // //             </div>
// // //           </section>

// // //           <div className="flex justify-end gap-4">
// // //             <button type="button" onClick={() => navigate(-1)} className={theme.button.secondary}>Cancel</button>
// // //             <button type="submit" disabled={!formData.name || !formData.rtsp_url || busy} className={`${theme.button.primary} px-10`}>
// // //               {busy ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : `Register Camera`}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </main>
// // //     </div>
// // //   )
// // // }

// // // export default AddCamera

// // // src/pages/AddCamera.jsx
// // import { useState } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { ArrowLeft, Loader2, Grid3X3, Shield, Video, DoorOpen, Eye, Info } from 'lucide-react'
// // import { useProperty } from '../hooks/useProperties'
// // import { theme } from '../theme'

// // const AddCamera = () => {
// //   const { id } = useParams()
// //   const navigate = useNavigate()
// //   const { data: propertyData, isLoading } = useProperty(id)

// //   const [formData, setFormData] = useState({
// //     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
// //   })
// //   const [error, setError] = useState('')

// //   const property = propertyData?.property || propertyData || {}
// //   const laserGrid = property.laser_grid || {}
// //   const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3
// //   const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8
// //   const maxRows = Math.max(0, yLasers - 1)
// //   const maxCols = Math.max(0, xLasers - 1)
// //   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
// //   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

// //   const handleSubmit = (e) => {
// //     e.preventDefault()
// //     setError('')

// //     const pendingCamera = {
// //       name: formData.name,
// //       rtsp_url: formData.rtsp_url,
// //       grid_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) },
// //       camera_type: formData.camera_type,
// //       propertyId: id,
// //     }

// //     if (formData.camera_type === 'fence') {
// //       // Store camera data in sessionStorage — don't save to DB yet
// //       sessionStorage.setItem('pendingCamera', JSON.stringify(pendingCamera))
// //       // Navigate to calibration with a "new" flag and no cameraId yet
// //       navigate(`/property/${id}/camera/new/calibrate/new`)
// //     } else {
// //       // Non-fence cameras: save immediately as before
// //       import('../api/cameras').then(({ camerasApi }) => {
// //         camerasApi.create(id, {
// //           name: pendingCamera.name,
// //           rtsp_url: pendingCamera.rtsp_url,
// //           grid_cell: pendingCamera.grid_cell,
// //           camera_type: pendingCamera.camera_type,
// //         }).then(() => {
// //           navigate(`/property/${id}/cameras`)
// //         }).catch(err => {
// //           setError(err.response?.data?.detail || 'Failed to create camera')
// //         })
// //       })
// //     }
// //   }

// //   if (isLoading) return <div className={theme.page.centered}><div className={theme.ui.spinner} /></div>

// //   const cameraTypes = [
// //     { value: 'entrance', label: 'Entrance', description: 'Entry/Exit monitoring', icon: DoorOpen, active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40' },
// //     { value: 'insider', label: 'Insider', description: 'Internal surveillance', icon: Eye, active: 'border-emerald-500 bg-emerald-50 text-emerald-600', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300' },
// //     { value: 'fence', label: 'Fence', description: 'Perimeter detection', icon: Shield, active: 'border-amber-500 bg-amber-50 text-amber-600', idle: 'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300' },
// //   ]

// //   const inp = theme.input.base
// //   const lbl = theme.input.label

// //   return (
// //     <div className="min-h-screen bg-[#faf9f6]">
// //       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
// //         <div className="flex items-center gap-4">
// //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}><ArrowLeft className="h-5 w-5" /></button>
// //           <h2 className={theme.header.title}>Add New Camera</h2>
// //         </div>
// //       </header>

// //       <main className="max-w-5xl mx-auto px-6 py-10">
// //         <form onSubmit={handleSubmit} className="space-y-8">
// //           {error && <div className={theme.alert.error}>{error}</div>}

// //           <section className={theme.card.base}>
// //             <label className={`${lbl} mb-4 block`}>Select Camera Function</label>
// //             <div className="grid grid-cols-3 gap-6">
// //               {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
// //                 <button
// //                   key={value}
// //                   type="button"
// //                   onClick={() => setFormData({ ...formData, camera_type: value })}
// //                   className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3 ${formData.camera_type === value ? active : idle}`}
// //                 >
// //                   <Icon className="w-8 h-8" />
// //                   <div>
// //                     <p className="font-bold text-sm">{label}</p>
// //                     <p className="text-[11px] opacity-70 mt-1 leading-tight">{description}</p>
// //                   </div>
// //                 </button>
// //               ))}
// //             </div>

// //             {formData.camera_type === 'fence' && (
// //               <div className={`${theme.alert.warning} mt-6 flex items-center gap-3`}>
// //                 <Info className="w-5 h-5 flex-shrink-0" />
// //                 <p className="text-xs">
// //                   Fence cameras require <strong>polygon calibration</strong> and <strong>cell definition</strong>.
// //                   The camera will only be saved after all steps are completed.
// //                 </p>
// //               </div>
// //             )}
// //           </section>

// //           <section className={theme.card.base}>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               <div className={theme.form.group}>
// //                 <label className={lbl}>Camera Identification Name *</label>
// //                 <input
// //                   type="text"
// //                   placeholder="e.g., North Gate HD"
// //                   className={inp}
// //                   value={formData.name}
// //                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                   required
// //                 />
// //               </div>
// //               <div className={theme.form.group}>
// //                 <label className={lbl}>RTSP Stream URL *</label>
// //                 <input
// //                   type="text"
// //                   placeholder="rtsp://admin:password@192.168.1.50:554/live"
// //                   className={`${inp} font-mono text-xs`}
// //                   value={formData.rtsp_url}
// //                   onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //           </section>

// //           <section className={theme.card.base}>
// //             <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
// //               <Grid3X3 className="w-5 h-5" />
// //               <h3 className="font-bold uppercase tracking-widest text-xs">Grid Deployment Location</h3>
// //             </div>
// //             <div className="grid grid-cols-2 gap-8">
// //               <div className={theme.form.group}>
// //                 <label className={lbl}>Row (Vertical Axis)</label>
// //                 <select className={inp} value={formData.grid_row} onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}>
// //                   {rowOptions.map(row => <option key={row} value={row}>Row Index {row}</option>)}
// //                 </select>
// //               </div>
// //               <div className={theme.form.group}>
// //                 <label className={lbl}>Column (Horizontal Axis)</label>
// //                 <select className={inp} value={formData.grid_col} onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}>
// //                   {colOptions.map(col => <option key={col} value={col}>Column Index {col}</option>)}
// //                 </select>
// //               </div>
// //             </div>
// //           </section>

// //           <div className="flex justify-end gap-4">
// //             <button type="button" onClick={() => navigate(-1)} className={theme.button.secondary}>Cancel</button>
// //             <button
// //               type="submit"
// //               disabled={!formData.name || !formData.rtsp_url}
// //               className={`${theme.button.primary} px-10`}
// //             >
// //               {formData.camera_type === 'fence' ? 'Next: Draw Polygon →' : 'Register Camera'}
// //             </button>
// //           </div>
// //         </form>
// //       </main>
// //     </div>
// //   )
// // }

// // export default AddCamera

// import { useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Grid3X3, Shield, DoorOpen, Eye, Info } from 'lucide-react'
// import { useProperty } from '../hooks/useProperties'
// import { camerasApi } from '../api/cameras'
// import { theme } from '../theme'

// const AddCamera = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { data: propertyData, isLoading } = useProperty(id)

//   const [formData, setFormData] = useState({
//     name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
//   })
//   const [error, setError] = useState('')
//   const [busy, setBusy] = useState(false)

//   const property = propertyData?.property || propertyData || {}
//   const laserGrid = property.laser_grid || {}
//   const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3
//   const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8
//   const maxRows = Math.max(0, yLasers - 1)
//   const maxCols = Math.max(0, xLasers - 1)
//   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
//   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     const pendingCamera = {
//       name:      formData.name,
//       rtsp_url:  formData.rtsp_url,
//       grid_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) },
//       camera_type: formData.camera_type,
//       propertyId:  id,
//     }

//     if (formData.camera_type === 'fence') {
//       // Fence: store and go to polygon step first
//       sessionStorage.setItem('pendingCamera', JSON.stringify(pendingCamera))
//       navigate(`/property/${id}/camera/new/calibrate/new`)

//     } else if (formData.camera_type === 'insider') {
//       // Insider: store and go directly to cell editor (no polygon needed)
//       sessionStorage.setItem('pendingCamera', JSON.stringify(pendingCamera))
//       navigate(`/property/${id}/camera/new/cells`)

//     } else {
//       // Entrance and others: save immediately
//       setBusy(true)
//       try {
//         await camerasApi.create(id, {
//           name:        pendingCamera.name,
//           rtsp_url:    pendingCamera.rtsp_url,
//           grid_cell:   pendingCamera.grid_cell,
//           camera_type: pendingCamera.camera_type,
//         })
//         navigate(`/property/${id}/cameras`)
//       } catch (err) {
//         setError(err.response?.data?.detail || 'Failed to create camera')
//       } finally {
//         setBusy(false)
//       }
//     }
//   }

//   if (isLoading) return (
//     <div className={theme.page.centered}><div className={theme.ui.spinner} /></div>
//   )

//   const cameraTypes = [
//     {
//       value: 'entrance', label: 'Entrance', description: 'Entry/Exit monitoring',
//       icon: DoorOpen,
//       active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
//       info: null,
//     },
//     {
//       value: 'insider', label: 'Insider', description: 'Internal surveillance',
//       icon: Eye,
//       active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
//       info: 'Insider cameras require cell definition on the camera frame. The camera will only be saved after cells are defined.',
//     },
//     {
//       value: 'fence', label: 'Fence', description: 'Perimeter detection',
//       icon: Shield,
//       active: 'border-amber-500 bg-amber-50 text-amber-600',
//       idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
//       info: 'Fence cameras require polygon calibration and cell definition. The camera will only be saved after all steps are completed.',
//     },
//   ]

//   const inp = theme.input.base
//   const lbl = theme.input.label
//   const selectedType = cameraTypes.find(t => t.value === formData.camera_type)

//   return (
//     <div className="min-h-screen bg-[#faf9f6]">
//       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className={theme.header.title}>Add New Camera</h2>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-6 py-10">
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {error && <div className={theme.alert.error}>{error}</div>}

//           {/* Camera Type */}
//           <section className={theme.card.base}>
//             <label className={`${lbl} mb-4 block`}>Select Camera Function</label>
//             <div className="grid grid-cols-3 gap-6">
//               {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
//                 <button
//                   key={value}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, camera_type: value })}
//                   className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col
//                               items-center text-center gap-3
//                               ${formData.camera_type === value ? active : idle}`}
//                 >
//                   <Icon className="w-8 h-8" />
//                   <div>
//                     <p className="font-bold text-sm">{label}</p>
//                     <p className="text-[11px] opacity-70 mt-1 leading-tight">{description}</p>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {selectedType?.info && (
//               <div className={`${theme.alert.warning} mt-6 flex items-center gap-3`}>
//                 <Info className="w-5 h-5 flex-shrink-0" />
//                 <p className="text-xs">{selectedType.info}</p>
//               </div>
//             )}
//           </section>

//           {/* Camera Info */}
//           <section className={theme.card.base}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className={theme.form.group}>
//                 <label className={lbl}>Camera Identification Name *</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., North Gate HD"
//                   className={inp}
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                   disabled={busy}
//                 />
//               </div>
//               <div className={theme.form.group}>
//                 <label className={lbl}>RTSP Stream URL *</label>
//                 <input
//                   type="text"
//                   placeholder="rtsp://admin:password@192.168.1.50:554/live"
//                   className={`${inp} font-mono text-xs`}
//                   value={formData.rtsp_url}
//                   onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
//                   required
//                   disabled={busy}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Grid Position */}
//           <section className={theme.card.base}>
//             <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
//               <Grid3X3 className="w-5 h-5" />
//               <h3 className="font-bold uppercase tracking-widest text-xs">Grid Deployment Location</h3>
//             </div>
//             <div className="grid grid-cols-2 gap-8">
//               <div className={theme.form.group}>
//                 <label className={lbl}>Row (Vertical Axis)</label>
//                 <select
//                   className={inp}
//                   value={formData.grid_row}
//                   onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
//                   disabled={busy}
//                 >
//                   {rowOptions.map(row => (
//                     <option key={row} value={row}>Row Index {row}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className={theme.form.group}>
//                 <label className={lbl}>Column (Horizontal Axis)</label>
//                 <select
//                   className={inp}
//                   value={formData.grid_col}
//                   onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
//                   disabled={busy}
//                 >
//                   {colOptions.map(col => (
//                     <option key={col} value={col}>Column Index {col}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </section>

//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className={theme.button.secondary}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!formData.name || !formData.rtsp_url || busy}
//               className={`${theme.button.primary} px-10`}
//             >
//               {busy
//                 ? 'Saving...'
//                 : formData.camera_type === 'fence'
//                   ? 'Next: Draw Polygon →'
//                   : formData.camera_type === 'insider'
//                     ? 'Next: Define Cells →'
//                     : 'Register Camera'}
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   )
// }

// export default AddCamera

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Grid3X3, Shield, DoorOpen, Eye, Info } from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import { useCreateCamera } from '../hooks/useCameras'
import { theme } from '../theme'

const AddCamera = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: propertyData, isLoading } = useProperty(id)
  const createCamera = useCreateCamera()

  const [formData, setFormData] = useState({
    name: '', rtsp_url: '', grid_row: 0, grid_col: 0, camera_type: 'entrance',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const property = propertyData?.property || propertyData || {}
  const laserGrid = property.laser_grid || {}
  const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3
  const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8
  const maxRows = Math.max(0, yLasers - 1)
  const maxCols = Math.max(0, xLasers - 1)
  const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i)
  const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const pendingCamera = {
      name:        formData.name,
      rtsp_url:    formData.rtsp_url,
      grid_cell:   { row: Number(formData.grid_row), col: Number(formData.grid_col) },
      camera_type: formData.camera_type,
      propertyId:  id,
    }

    if (formData.camera_type === 'fence') {
      sessionStorage.setItem('pendingCamera', JSON.stringify(pendingCamera))
      navigate(`/property/${id}/camera/new/calibrate/new`)

    } else if (formData.camera_type === 'insider') {
      sessionStorage.setItem('pendingCamera', JSON.stringify(pendingCamera))
      navigate(`/property/${id}/camera/new/cells`)

    } else {
      setBusy(true)
      try {
        await createCamera.mutateAsync({
          propertyId: id,
          data: {
            name:        pendingCamera.name,
            rtsp_url:    pendingCamera.rtsp_url,
            grid_cell:   pendingCamera.grid_cell,
            camera_type: pendingCamera.camera_type,
          },
        })
        navigate(`/property/${id}/cameras`)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to create camera')
      } finally {
        setBusy(false)
      }
    }
  }

  if (isLoading) return (
    <div className={theme.page.centered}><div className={theme.ui.spinner} /></div>
  )

  const cameraTypes = [
    {
      value: 'entrance', label: 'Entrance', description: 'Entry/Exit monitoring',
      icon: DoorOpen,
      active: 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-[#c5a880]/40',
      info: null,
    },
    {
      value: 'insider', label: 'Insider', description: 'Internal surveillance',
      icon: Eye,
      active: 'border-emerald-500 bg-emerald-50 text-emerald-600',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-emerald-300',
      // info: 'Insider cameras require cell definition on the camera frame. The camera will only be saved after cells are defined.',
    },
    {
      value: 'fence', label: 'Fence', description: 'Perimeter detection',
      icon: Shield,
      active: 'border-amber-500 bg-amber-50 text-amber-600',
      idle:   'border-[#e6e3db] bg-white text-gray-400 hover:border-amber-300',
      // info: 'Fence cameras require polygon calibration and cell definition. The camera will only be saved after all steps are completed.',
    },
  ]

  const inp = theme.input.base
  const lbl = theme.input.label
  const selectedType = cameraTypes.find(t => t.value === formData.camera_type)

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className={theme.header.title}>Add New Camera</h2>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className={theme.alert.error}>{error}</div>}

          {/* Camera Type */}
          <section className={theme.card.base}>
            <label className={`${lbl} mb-4 block`}>Select Camera Function</label>
            <div className="grid grid-cols-3 gap-6">
              {cameraTypes.map(({ value, label, description, icon: Icon, active, idle }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, camera_type: value })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col
                              items-center text-center gap-3
                              ${formData.camera_type === value ? active : idle}`}
                >
                  <Icon className="w-8 h-8" />
                  <div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-[11px] opacity-70 mt-1 leading-tight">{description}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedType?.info && (
              <div className={`${theme.alert.warning} mt-6 flex items-center gap-3`}>
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs">{selectedType.info}</p>
              </div>
            )}
          </section>

          {/* Camera Info */}
          <section className={theme.card.base}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={theme.form.group}>
                <label className={lbl}>Camera Identification Name *</label>
                <input
                  type="text"
                  placeholder="e.g., North Gate HD"
                  className={inp}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={busy}
                />
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>RTSP Stream URL *</label>
                <input
                  type="text"
                  placeholder="rtsp://admin:password@192.168.1.50:554/live"
                  className={`${inp} font-mono text-xs`}
                  value={formData.rtsp_url}
                  onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
                  required
                  disabled={busy}
                />
              </div>
            </div>
          </section>

          {/* Grid Position */}
          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
              <Grid3X3 className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Grid Deployment Location</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className={theme.form.group}>
                <label className={lbl}>Row (Vertical Axis)</label>
                <select
                  className={inp}
                  value={formData.grid_row}
                  onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
                  disabled={busy}
                >
                  {rowOptions.map(row => (
                    <option key={row} value={row}>Row Index {row}</option>
                  ))}
                </select>
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Column (Horizontal Axis)</label>
                <select
                  className={inp}
                  value={formData.grid_col}
                  onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
                  disabled={busy}
                >
                  {colOptions.map(col => (
                    <option key={col} value={col}>Column Index {col}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={theme.button.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.rtsp_url || busy}
              className={`${theme.button.primary} px-10`}
            >
              {busy
                ? 'Saving...'
                : formData.camera_type === 'fence'
                  ? 'Next: Draw Polygon →'
                  : formData.camera_type === 'insider'
                    ? 'Next: Define Cells →'
                    : 'Register Camera'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddCamera