// // // // // src/pages/EditClimbingCalibration.jsx
// // // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// // // //   Loader2, Crosshair, MousePointer, Info
// // // // } from 'lucide-react'
// // // // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // // // import { theme } from '../theme'

// // // // const EditClimbingCalibration = () => {
// // // //   const { id: propertyId, cameraId } = useParams()
// // // //   const navigate = useNavigate()

// // // //   const canvasRef      = useRef(null)
// // // //   const containerRef   = useRef(null)
// // // //   const baseImageRef   = useRef(null)

// // // //   const [points,      setPoints]      = useState([])
// // // //   const [frameLoaded, setFrameLoaded] = useState(false)
// // // //   const [frameError,  setFrameError]  = useState(null)
// // // //   const [isCapturing, setIsCapturing] = useState(true)
// // // //   const [imageSize,   setImageSize]   = useState({ width: 0, height: 0 })
// // // //   const [showHelp,    setShowHelp]    = useState(true)
// // // //   const [cameraName,  setCameraName]  = useState(`Camera ${cameraId}`)

// // // //   const saveMutation = useSaveFenceConfig()
// // // //   const { data: existingConfig, isLoading: configLoading } = useFenceConfig(cameraId)

// // // //   const MAX_POINTS   = 4
// // // //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// // // //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// // // //   // ── Draw helpers ─────────────────────────────
// // // //   const drawBaseImage = useCallback((img, canvas) => {
// // // //     const ctx       = canvas.getContext('2d')
// // // //     const container = containerRef.current
// // // //     if (!container) return
// // // //     const containerWidth = container.clientWidth
// // // //     const scale          = containerWidth / img.naturalWidth
// // // //     const height         = img.naturalHeight * scale
// // // //     canvas.width  = containerWidth
// // // //     canvas.height = height
// // // //     ctx.drawImage(img, 0, 0, containerWidth, height)
// // // //     return { width: containerWidth, height }
// // // //   }, [])

// // // //   const drawPlaceholderOnCanvas = useCallback((canvas) => {
// // // //     const ctx       = canvas.getContext('2d')
// // // //     const container = containerRef.current
// // // //     if (!container) return
// // // //     const w = container.clientWidth
// // // //     const h = w * 0.5625
// // // //     canvas.width  = w
// // // //     canvas.height = h
// // // //     ctx.fillStyle = '#1c1c1c'
// // // //     ctx.fillRect(0, 0, w, h)
// // // //     ctx.strokeStyle = '#2a2a2a'
// // // //     ctx.lineWidth = 1
// // // //     const gridSize = 40
// // // //     for (let x = 0; x < w; x += gridSize) {
// // // //       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// // // //     }
// // // //     for (let y = 0; y < h; y += gridSize) {
// // // //       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// // // //     }
// // // //     ctx.fillStyle = '#c5a880'
// // // //     ctx.font      = 'bold 18px sans-serif'
// // // //     ctx.textAlign = 'center'
// // // //     ctx.fillText('📷 Camera Frame Placeholder', w / 2, h / 2 - 20)
// // // //     ctx.fillStyle = '#6b7280'
// // // //     ctx.font      = '14px sans-serif'
// // // //     ctx.fillText('Click anywhere to redefine polygon points', w / 2, h / 2 + 10)
// // // //     return { width: w, height: h }
// // // //   }, [])

// // // //   const redrawAll = useCallback((currentPoints) => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas || !frameLoaded) return
// // // //     const ctx = canvas.getContext('2d')
// // // //     if (baseImageRef.current) {
// // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // //     }
// // // //     if (currentPoints.length > 1) {
// // // //       ctx.strokeStyle = '#c5a880'
// // // //       ctx.lineWidth   = 3
// // // //       ctx.setLineDash([8, 4])
// // // //       ctx.beginPath()
// // // //       ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
// // // //       for (let i = 1; i < currentPoints.length; i++) {
// // // //         ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
// // // //       }
// // // //       if (currentPoints.length === MAX_POINTS) {
// // // //         ctx.closePath()
// // // //         ctx.fillStyle = 'rgba(197,168,128,0.15)'
// // // //         ctx.fill()
// // // //       }
// // // //       ctx.stroke()
// // // //       ctx.setLineDash([])
// // // //     }
// // // //     currentPoints.forEach((p, i) => {
// // // //       ctx.shadowColor = POINT_COLORS[i]
// // // //       ctx.shadowBlur  = 10
// // // //       ctx.beginPath()
// // // //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// // // //       ctx.fillStyle = POINT_COLORS[i]
// // // //       ctx.fill()
// // // //       ctx.shadowBlur = 0
// // // //       ctx.beginPath()
// // // //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// // // //       ctx.fillStyle = 'white'
// // // //       ctx.fill()
// // // //       ctx.fillStyle       = POINT_COLORS[i]
// // // //       ctx.font            = 'bold 11px sans-serif'
// // // //       ctx.textAlign       = 'center'
// // // //       ctx.textBaseline    = 'middle'
// // // //       ctx.fillText((i + 1).toString(), p.x, p.y)
// // // //       const label      = POINT_LABELS[i]
// // // //       ctx.font         = 'bold 12px sans-serif'
// // // //       const labelWidth = ctx.measureText(label).width + 10
// // // //       const labelX     = p.x - labelWidth / 2
// // // //       const labelY     = p.y - 30
// // // //       ctx.fillStyle    = 'rgba(0,0,0,0.8)'
// // // //       ctx.beginPath()
// // // //       ctx.roundRect(labelX, labelY - 10, labelWidth, 20, 4)
// // // //       ctx.fill()
// // // //       ctx.fillStyle = POINT_COLORS[i]
// // // //       ctx.fillText(label, p.x, labelY)
// // // //     })
// // // //   }, [frameLoaded])

// // // //   // ── Load existing points ──────────────────────
// // // //   useEffect(() => {
// // // //     if (!frameLoaded || configLoading) return
// // // //     if (!existingConfig?.polygon_points?.length) return
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return
// // // //     const existingPoints = existingConfig.polygon_points.map(p => ({
// // // //       x: p.x * canvas.width,
// // // //       y: p.y * canvas.height,
// // // //     }))
// // // //     setPoints(existingPoints)
// // // //   }, [frameLoaded, configLoading, existingConfig])

// // // //   // ── Load placeholder ──────────────────────────
// // // //   const loadPlaceholder = useCallback(() => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return
// // // //     drawPlaceholderOnCanvas(canvas)
// // // //     const size = { width: canvas.width, height: canvas.height }
// // // //     setImageSize(size)
// // // //     setFrameLoaded(true)
// // // //     const img = new Image()
// // // //     img.src    = canvas.toDataURL()
// // // //     img.onload = () => { baseImageRef.current = img }
// // // //   }, [drawPlaceholderOnCanvas])

// // // //   // ── Load frame ────────────────────────────────
// // // //   const loadFrame = useCallback(async () => {
// // // //     setIsCapturing(true)
// // // //     setFrameError(null)
// // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // //     const token  = localStorage.getItem('token')
// // // //     try {
// // // //       const response = await fetch(
// // // //         `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       )
// // // //       if (!response.ok) throw new Error(`Camera error: ${response.status}`)
// // // //       const blob    = await response.blob()
// // // //       const blobUrl = URL.createObjectURL(blob)
// // // //       const img     = new Image()
// // // //       img.onload = () => {
// // // //         baseImageRef.current = img
// // // //         const canvas = canvasRef.current
// // // //         if (!canvas) return
// // // //         const size = drawBaseImage(img, canvas)
// // // //         if (size) setImageSize(size)
// // // //         setFrameLoaded(true)
// // // //         setIsCapturing(false)
// // // //         URL.revokeObjectURL(blobUrl)
// // // //       }
// // // //       img.onerror = () => {
// // // //         setFrameError('Failed to load camera frame image')
// // // //         setIsCapturing(false)
// // // //         loadPlaceholder()
// // // //         URL.revokeObjectURL(blobUrl)
// // // //       }
// // // //       img.src = blobUrl
// // // //       try {
// // // //         const camRes = await fetch(
// // // //           `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         )
// // // //         if (camRes.ok) {
// // // //           const camData = await camRes.json()
// // // //           setCameraName(camData.name || `Camera ${cameraId}`)
// // // //         }
// // // //       } catch { /* ignore */ }
// // // //     } catch (err) {
// // // //       setFrameError(err.message || 'Cannot connect to camera')
// // // //       setIsCapturing(false)
// // // //       loadPlaceholder()
// // // //     }
// // // //   }, [cameraId, drawBaseImage, loadPlaceholder])

// // // //   useEffect(() => { loadFrame() }, [loadFrame])

// // // //   useEffect(() => {
// // // //     if (frameLoaded) redrawAll(points)
// // // //   }, [points, frameLoaded, redrawAll])

// // // //   // ── Canvas click ──────────────────────────────
// // // //   const handleCanvasClick = (e) => {
// // // //     if (points.length >= MAX_POINTS) return
// // // //     const canvas = canvasRef.current
// // // //     const rect   = canvas.getBoundingClientRect()
// // // //     const scaleX = canvas.width  / rect.width
// // // //     const scaleY = canvas.height / rect.height
// // // //     const x = (e.clientX - rect.left) * scaleX
// // // //     const y = (e.clientY - rect.top)  * scaleY
// // // //     setPoints(prev => [...prev, { x, y }])
// // // //   }

// // // //   // ── Actions ───────────────────────────────────
// // // //   const handleReset = () => {
// // // //     setPoints([])
// // // //     const canvas = canvasRef.current
// // // //     if (canvas && baseImageRef.current) {
// // // //       const ctx = canvas.getContext('2d')
// // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // //     }
// // // //   }

// // // //   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

// // // //   const handleSave = async () => {
// // // //     if (points.length !== MAX_POINTS) return
// // // //     const normalizedPoints = points.map(p => ({
// // // //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // //     }))
// // // //     try {
// // // //       await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
// // // //       navigate(`/property/${propertyId}/cameras`)
// // // //     } catch (err) {
// // // //       alert('Failed to save: ' + (err?.response?.data?.detail || err.message))
// // // //     }
// // // //   }

// // // //   const handleRetry = () => {
// // // //     setPoints([])
// // // //     setFrameLoaded(false)
// // // //     setFrameError(null)
// // // //     setIsCapturing(true)
// // // //     baseImageRef.current = null
// // // //     loadFrame()
// // // //   }

// // // //   const isComplete = points.length === MAX_POINTS

// // // //   // ── Render ────────────────────────────────────
// // // //   return (
// // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // //       {/* Header */}
// // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // //           <ArrowLeft className="h-6 w-6" />
// // // //         </button>
// // // //         <div className="ml-3">
// // // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// // // //             Update Polygon Points
// // // //           </h2>
// // // //           <p className={theme.type.whiteMuted}>{cameraName}</p>
// // // //         </div>
// // // //         <div className="ml-auto flex items-center gap-2">
// // // //           {points.length > 0 && (
// // // //             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo">
// // // //               <RotateCcw className="h-5 w-5" />
// // // //             </button>
// // // //           )}
// // // //           <button onClick={() => setShowHelp(!showHelp)} className={theme.button.iconDark}>
// // // //             <Info className="h-5 w-5" />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Existing config banner */}
// // // //       {existingConfig && !configLoading && (
// // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-2">
// // // //           <p className="text-[#c5a880] text-xs font-semibold">
// // // //             ✏️ Existing polygon loaded. Click Reset to redraw from scratch,
// // // //             or adjust individual points by clicking Undo.
// // // //           </p>
// // // //         </div>
// // // //       )}

// // // //       {/* Help banner */}
// // // //       {showHelp && (
// // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // //           <div className="flex items-start gap-3">
// // // //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// // // //             <div className="text-sm text-[#c5a880]/90">
// // // //               <p className="font-bold mb-1">
// // // //                 Click 4 points to redefine the wall boundary:
// // // //               </p>
// // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// // // //                 <li>Top-Left corner of wall</li>
// // // //                 <li>Top-Right corner of wall</li>
// // // //                 <li>Bottom-Right corner of wall</li>
// // // //                 <li>Bottom-Left corner of wall</li>
// // // //               </ol>
// // // //             </div>
// // // //             <button
// // // //               onClick={() => setShowHelp(false)}
// // // //               className="ml-auto text-[#c5a880] hover:text-white transition-colors"
// // // //             >
// // // //               ✕
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Canvas area */}
// // // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // // //         {/* Loading */}
// // // //         {isCapturing && (
// // // //           <div className="absolute inset-0 flex flex-col items-center
// // // //                           justify-center bg-[#1c1c1c] z-10">
// // // //             <div className={theme.ui.spinner} />
// // // //             <p className={`${theme.type.whiteMuted} mt-4`}>
// // // //               Connecting to camera...
// // // //             </p>
// // // //             <p className="text-gray-600 text-xs mt-1">
// // // //               Loading existing polygon configuration
// // // //             </p>
// // // //           </div>
// // // //         )}

// // // //         {/* Error */}
// // // //         {frameError && (
// // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // //             <div className={theme.alert.error}>
// // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // //               <span className="flex-1">{frameError}</span>
// // // //               <button
// // // //                 onClick={handleRetry}
// // // //                 className="text-xs border border-red-300 px-2 py-1
// // // //                            rounded-full hover:bg-red-100 transition-colors ml-auto"
// // // //               >
// // // //                 Retry
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Canvas */}
// // // //         <canvas
// // // //           ref={canvasRef}
// // // //           onClick={handleCanvasClick}
// // // //           className={`w-full cursor-crosshair transition-opacity duration-300
// // // //                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // // //           style={{ display: 'block' }}
// // // //         />

// // // //         {/* Point counter */}
// // // //         {frameLoaded && (
// // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // // //                           rounded-[1rem] px-3 py-2">
// // // //             <div className="flex items-center gap-2">
// // // //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// // // //               <span className="text-white font-mono text-sm">
// // // //                 {points.length}/{MAX_POINTS}
// // // //               </span>
// // // //             </div>
// // // //             <div className="flex gap-1 mt-1">
// // // //               {[0, 1, 2, 3].map(i => (
// // // //                 <div
// // // //                   key={i}
// // // //                   className={`w-2 h-2 rounded-full
// // // //                               ${i < points.length
// // // //                                 ? 'bg-[#c5a880]'
// // // //                                 : 'bg-white/20'}`}
// // // //                 />
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Completion overlay */}
// // // //         {isComplete && (
// // // //           <div className="absolute inset-0 bg-black/60 flex items-center
// // // //                           justify-center z-20">
// // // //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4 text-center
// // // //                             shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// // // //               <h3 className={`${theme.type.h3} mb-2`}>Polygon Updated!</h3>
// // // //               <p className={`${theme.type.bodySm} mb-5`}>
// // // //                 New wall boundary defined. Save to apply changes.
// // // //               </p>
// // // //               <div className="flex gap-3">
// // // //                 <button onClick={handleReset} className={theme.button.secondary}>
// // // //                   Redo
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={handleSave}
// // // //                   disabled={saveMutation.isPending}
// // // //                   className={`${theme.button.primary} flex-1`}
// // // //                 >
// // // //                   {saveMutation.isPending
// // // //                     ? <Loader2 className="w-4 h-4 animate-spin" />
// // // //                     : <Save className="w-4 h-4" />}
// // // //                   Update
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Bottom bar */}
// // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3
// // // //                       rounded-t-[2rem]">

// // // //         {/* Progress text */}
// // // //         <div className="flex items-center justify-between text-sm">
// // // //           <span className={theme.type.bodySm}>
// // // //             {points.length === 0 && 'Click Reset then place new points on the frame'}
// // // //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// // // //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// // // //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// // // //             {points.length === 4 && '🎉 All 4 points placed! Ready to update.'}
// // // //           </span>
// // // //           <span className="font-sans text-sm font-bold text-[#c5a880]">
// // // //             {Math.round((points.length / MAX_POINTS) * 100)}%
// // // //           </span>
// // // //         </div>

// // // //         {/* Progress bar */}
// // // //         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
// // // //           <div
// // // //             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
// // // //             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
// // // //           />
// // // //         </div>

// // // //         {/* Buttons */}
// // // //         <div className="flex gap-3">
// // // //           <button onClick={handleReset} className={theme.button.secondary}>
// // // //             Reset
// // // //           </button>
// // // //           <button
// // // //             onClick={() => navigate(`/property/${propertyId}/cameras`)}
// // // //             className={theme.button.secondary}
// // // //           >
// // // //             Cancel
// // // //           </button>
// // // //           <button
// // // //             onClick={handleSave}
// // // //             disabled={!isComplete || saveMutation.isPending}
// // // //             className={`${theme.button.primary} flex-1`}
// // // //           >
// // // //             {saveMutation.isPending
// // // //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
// // // //               : <><Save className="w-5 h-5" /> Update Polygon</>}
// // // //           </button>
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default EditClimbingCalibration

// // // // src/pages/EditClimbingCalibration.jsx
// // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// // //   Loader2, Crosshair, MousePointer, Info
// // // } from 'lucide-react'
// // // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // // import { theme } from '../theme'

// // // const EditClimbingCalibration = () => {
// // //   const { id: propertyId, cameraId } = useParams()
// // //   const navigate = useNavigate()

// // //   const canvasRef    = useRef(null)
// // //   const containerRef = useRef(null)
// // //   const baseImageRef = useRef(null)

// // //   const [points,      setPoints]      = useState([])
// // //   const [frameLoaded, setFrameLoaded] = useState(false)
// // //   const [frameError,  setFrameError]  = useState(null)
// // //   const [isCapturing, setIsCapturing] = useState(true)
// // //   const [imageSize,   setImageSize]   = useState({ width: 0, height: 0 })
// // //   const [showHelp,    setShowHelp]    = useState(true)
// // //   const [cameraName,  setCameraName]  = useState(`Camera ${cameraId}`)

// // //   const saveMutation = useSaveFenceConfig()
// // //   const { data: existingConfig, isLoading: configLoading } = useFenceConfig(cameraId)

// // //   const MAX_POINTS   = 4
// // //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// // //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// // //   // ── Draw helpers ──────────────────────────────────────────────────────────

// // //   const drawBaseImage = useCallback((img, canvas) => {
// // //     const ctx            = canvas.getContext('2d')
// // //     const container      = containerRef.current
// // //     if (!container) return
// // //     const containerWidth = container.clientWidth
// // //     const scale          = containerWidth / img.naturalWidth
// // //     const height         = img.naturalHeight * scale
// // //     canvas.width         = containerWidth
// // //     canvas.height        = height
// // //     ctx.drawImage(img, 0, 0, containerWidth, height)
// // //     return { width: containerWidth, height }
// // //   }, [])

// // //   const drawPlaceholderOnCanvas = useCallback((canvas) => {
// // //     const ctx       = canvas.getContext('2d')
// // //     const container = containerRef.current
// // //     if (!container) return
// // //     const w = container.clientWidth
// // //     const h = w * 0.5625
// // //     canvas.width  = w
// // //     canvas.height = h
// // //     ctx.fillStyle = '#1c1c1c'
// // //     ctx.fillRect(0, 0, w, h)
// // //     ctx.strokeStyle = '#2a2a2a'
// // //     ctx.lineWidth   = 1
// // //     const gridSize  = 40
// // //     for (let x = 0; x < w; x += gridSize) {
// // //       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// // //     }
// // //     for (let y = 0; y < h; y += gridSize) {
// // //       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// // //     }
// // //     ctx.fillStyle = '#c5a880'
// // //     ctx.font      = 'bold 18px sans-serif'
// // //     ctx.textAlign = 'center'
// // //     ctx.fillText('📷 Camera Frame Placeholder', w / 2, h / 2 - 20)
// // //     ctx.fillStyle = '#6b7280'
// // //     ctx.font      = '14px sans-serif'
// // //     ctx.fillText('Click anywhere to redefine polygon points', w / 2, h / 2 + 10)
// // //     return { width: w, height: h }
// // //   }, [])

// // //   const redrawAll = useCallback((currentPoints) => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas || !frameLoaded) return
// // //     const ctx = canvas.getContext('2d')

// // //     // Redraw base image
// // //     if (baseImageRef.current) {
// // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // //     }

// // //     // Draw polygon lines
// // //     if (currentPoints.length > 1) {
// // //       ctx.strokeStyle = '#c5a880'
// // //       ctx.lineWidth   = 3
// // //       ctx.setLineDash([8, 4])
// // //       ctx.beginPath()
// // //       ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
// // //       for (let i = 1; i < currentPoints.length; i++) {
// // //         ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
// // //       }
// // //       if (currentPoints.length === MAX_POINTS) {
// // //         ctx.closePath()
// // //         ctx.fillStyle = 'rgba(197,168,128,0.15)'
// // //         ctx.fill()
// // //       }
// // //       ctx.stroke()
// // //       ctx.setLineDash([])
// // //     }

// // //     // Draw points
// // //     currentPoints.forEach((p, i) => {
// // //       ctx.shadowColor  = POINT_COLORS[i]
// // //       ctx.shadowBlur   = 10
// // //       ctx.beginPath()
// // //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// // //       ctx.fillStyle = POINT_COLORS[i]
// // //       ctx.fill()
// // //       ctx.shadowBlur = 0

// // //       ctx.beginPath()
// // //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// // //       ctx.fillStyle = 'white'
// // //       ctx.fill()

// // //       ctx.fillStyle    = POINT_COLORS[i]
// // //       ctx.font         = 'bold 11px sans-serif'
// // //       ctx.textAlign    = 'center'
// // //       ctx.textBaseline = 'middle'
// // //       ctx.fillText((i + 1).toString(), p.x, p.y)

// // //       const label      = POINT_LABELS[i]
// // //       ctx.font         = 'bold 12px sans-serif'
// // //       const labelWidth = ctx.measureText(label).width + 10
// // //       const labelX     = p.x - labelWidth / 2
// // //       const labelY     = p.y - 30
// // //       ctx.fillStyle    = 'rgba(0,0,0,0.8)'
// // //       ctx.beginPath()
// // //       ctx.roundRect(labelX, labelY - 10, labelWidth, 20, 4)
// // //       ctx.fill()
// // //       ctx.fillStyle    = POINT_COLORS[i]
// // //       ctx.textBaseline = 'middle'
// // //       ctx.fillText(label, p.x, labelY)
// // //     })
// // //   }, [frameLoaded])

// // //   // ── Load existing points onto canvas ──────────────────────────────────────

// // //   useEffect(() => {
// // //     if (!frameLoaded || configLoading) return
// // //     if (!existingConfig?.polygon_points?.length) return
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const existingPoints = existingConfig.polygon_points.map(p => ({
// // //       x: p.x * canvas.width,
// // //       y: p.y * canvas.height,
// // //     }))
// // //     setPoints(existingPoints)
// // //   }, [frameLoaded, configLoading, existingConfig])

// // //   // ── Load placeholder ──────────────────────────────────────────────────────

// // //   const loadPlaceholder = useCallback(() => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const size = drawPlaceholderOnCanvas(canvas)
// // //     if (size) setImageSize(size)
// // //     setFrameLoaded(true)
// // //     const img  = new Image()
// // //     img.src    = canvas.toDataURL()
// // //     img.onload = () => { baseImageRef.current = img }
// // //   }, [drawPlaceholderOnCanvas])

// // //   // ── Load camera frame ─────────────────────────────────────────────────────

// // //   const loadFrame = useCallback(async () => {
// // //     setIsCapturing(true)
// // //     setFrameError(null)
// // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // //     const token  = localStorage.getItem('token')

// // //     try {
// // //       const response = await fetch(
// // //         `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       )
// // //       if (!response.ok) throw new Error(`Camera error: ${response.status}`)

// // //       const blob    = await response.blob()
// // //       const blobUrl = URL.createObjectURL(blob)
// // //       const img     = new Image()

// // //       img.onload = () => {
// // //         baseImageRef.current = img
// // //         const canvas = canvasRef.current
// // //         if (!canvas) return
// // //         const size = drawBaseImage(img, canvas)
// // //         if (size) setImageSize(size)
// // //         setFrameLoaded(true)
// // //         setIsCapturing(false)
// // //         URL.revokeObjectURL(blobUrl)
// // //       }

// // //       img.onerror = () => {
// // //         setFrameError('Failed to load camera frame image')
// // //         setIsCapturing(false)
// // //         loadPlaceholder()
// // //         URL.revokeObjectURL(blobUrl)
// // //       }

// // //       img.src = blobUrl

// // //       // Fetch camera name
// // //       try {
// // //         const camRes = await fetch(
// // //           `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // //           { headers: { Authorization: `Bearer ${token}` } }
// // //         )
// // //         if (camRes.ok) {
// // //           const camData = await camRes.json()
// // //           setCameraName(camData.name || `Camera ${cameraId}`)
// // //         }
// // //       } catch { /* ignore */ }

// // //     } catch (err) {
// // //       setFrameError(err.message || 'Cannot connect to camera')
// // //       setIsCapturing(false)
// // //       loadPlaceholder()
// // //     }
// // //   }, [cameraId, drawBaseImage, loadPlaceholder])

// // //   useEffect(() => { loadFrame() }, [loadFrame])

// // //   // Redraw whenever points change
// // //   useEffect(() => {
// // //     if (frameLoaded) redrawAll(points)
// // //   }, [points, frameLoaded, redrawAll])

// // //   // ── Canvas click ──────────────────────────────────────────────────────────

// // //   const handleCanvasClick = (e) => {
// // //     if (points.length >= MAX_POINTS) return
// // //     const canvas = canvasRef.current
// // //     const rect   = canvas.getBoundingClientRect()
// // //     const scaleX = canvas.width  / rect.width
// // //     const scaleY = canvas.height / rect.height
// // //     const x      = (e.clientX - rect.left) * scaleX
// // //     const y      = (e.clientY - rect.top)  * scaleY
// // //     setPoints(prev => [...prev, { x, y }])
// // //   }

// // //   // ── Actions ───────────────────────────────────────────────────────────────

// // //   const handleReset = () => {
// // //     setPoints([])
// // //     const canvas = canvasRef.current
// // //     if (canvas && baseImageRef.current) {
// // //       const ctx = canvas.getContext('2d')
// // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // //     }
// // //   }

// // //   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

// // //   // ── UPDATED: Navigate to cell editor after update ─────────────────────────

// // //   const handleSave = async () => {
// // //     if (points.length !== MAX_POINTS) return

// // //     const normalizedPoints = points.map(p => ({
// // //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // //     }))

// // //     try {
// // //       await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })

// // //       // Navigate to cell editor so user can redefine named fence cells
// // //       navigate(`/property/${propertyId}/camera/${cameraId}/cells`)

// // //     } catch (err) {
// // //       alert('Failed to save: ' + (err?.response?.data?.detail || err.message))
// // //     }
// // //   }

// // //   const handleRetry = () => {
// // //     setPoints([])
// // //     setFrameLoaded(false)
// // //     setFrameError(null)
// // //     setIsCapturing(true)
// // //     baseImageRef.current = null
// // //     loadFrame()
// // //   }

// // //   const isComplete = points.length === MAX_POINTS

// // //   // ── Render ────────────────────────────────────────────────────────────────

// // //   return (
// // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // //       {/* ── Header ── */}
// // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // //         <button
// // //           onClick={() => navigate(-1)}
// // //           className={theme.button.iconDark}
// // //         >
// // //           <ArrowLeft className="h-6 w-6" />
// // //         </button>

// // //         <div className="ml-3 flex-1 min-w-0">
// // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// // //             Update Polygon Points
// // //           </h2>
// // //           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
// // //         </div>

// // //         <div className="ml-auto flex items-center gap-2">
// // //           {points.length > 0 && (
// // //             <button
// // //               onClick={handleUndo}
// // //               className={theme.button.iconDark}
// // //               title="Undo last point"
// // //             >
// // //               <RotateCcw className="h-5 w-5" />
// // //             </button>
// // //           )}
// // //           <button
// // //             onClick={() => setShowHelp(!showHelp)}
// // //             className={theme.button.iconDark}
// // //           >
// // //             <Info className="h-5 w-5" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ── Step indicator ── */}
// // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // //         <div className="flex items-center gap-2">
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// // //                             justify-center text-[#1c1c1c] text-xs font-bold">
// // //               1
// // //             </div>
// // //             <span className="text-[#c5a880] text-xs font-bold">
// // //               Update Polygon
// // //             </span>
// // //           </div>
// // //           <div className="flex-1 h-px bg-white/10" />
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// // //                             justify-center text-white/40 text-xs font-bold">
// // //               2
// // //             </div>
// // //             <span className="text-white/40 text-xs font-bold">
// // //               Redefine Cells
// // //             </span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ── Existing config notice ── */}
// // //       {existingConfig && !configLoading && (
// // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-2">
// // //           <p className="text-[#c5a880] text-xs font-semibold">
// // //             ✏️ Existing polygon loaded. Click Reset to redraw from scratch,
// // //             or use Undo to remove the last point.
// // //           </p>
// // //         </div>
// // //       )}

// // //       {/* ── Help banner ──
// // //       {showHelp && (
// // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // //           <div className="flex items-start gap-3">
// // //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // //               <p className="font-bold mb-1">
// // //                 Step 1 — Click 4 points to redefine the fence boundary:
// // //               </p>
// // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// // //                 <li>Top-Left corner of fence</li>
// // //                 <li>Top-Right corner of fence</li>
// // //                 <li>Bottom-Right corner of fence</li>
// // //                 <li>Bottom-Left corner of fence</li>
// // //               </ol>
// // //               <p className="text-[#c5a880]/50 text-xs mt-2">
// // //                 After updating, you'll redefine named cells inside the fence.
// // //               </p>
// // //             </div>
// // //             <button
// // //               onClick={() => setShowHelp(false)}
// // //               className="text-[#c5a880] hover:text-white transition-colors"
// // //             >
// // //               ✕
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )} */}

// // //       {/* ── Canvas area ── */}
// // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // //         {/* Loading overlay */}
// // //         {isCapturing && (
// // //           <div className="absolute inset-0 flex flex-col items-center
// // //                           justify-center bg-[#1c1c1c] z-10">
// // //             <div className={theme.ui.spinner} />
// // //             <p className={`${theme.type.whiteMuted} mt-4`}>
// // //               Connecting to camera...
// // //             </p>
// // //             <p className="text-gray-600 text-xs mt-1">
// // //               Loading existing polygon configuration
// // //             </p>
// // //           </div>
// // //         )}

// // //         {/* Error banner */}
// // //         {frameError && (
// // //           <div className="absolute top-4 left-4 right-4 z-10">
// // //             <div className={theme.alert.error}>
// // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // //               <span className="flex-1 text-sm">{frameError}</span>
// // //               <button
// // //                 onClick={handleRetry}
// // //                 className="text-xs border border-red-300 px-2 py-1
// // //                            rounded-full hover:bg-red-100 transition-colors ml-auto"
// // //               >
// // //                 Retry
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Canvas */}
// // //         <canvas
// // //           ref={canvasRef}
// // //           onClick={handleCanvasClick}
// // //           className={`w-full cursor-crosshair transition-opacity duration-300
// // //                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // //           style={{ display: 'block' }}
// // //         />

// // //         {/* Point counter badge */}
// // //         {frameLoaded && (
// // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // //                           rounded-[1rem] px-3 py-2">
// // //             <div className="flex items-center gap-2">
// // //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// // //               <span className="text-white font-mono text-sm font-bold">
// // //                 {points.length}/{MAX_POINTS}
// // //               </span>
// // //             </div>
// // //             <div className="flex gap-1 mt-1">
// // //               {[0, 1, 2, 3].map(i => (
// // //                 <div
// // //                   key={i}
// // //                   style={{
// // //                     backgroundColor: i < points.length
// // //                       ? POINT_COLORS[i]
// // //                       : undefined,
// // //                   }}
// // //                   className={`w-2 h-2 rounded-full transition-all
// // //                               ${i < points.length ? '' : 'bg-white/20'}`}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Completion overlay */}
// // //         {isComplete && (
// // //           <div className="absolute inset-0 bg-black/60 flex items-center
// // //                           justify-center z-20">
// // //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4
// // //                             text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// // //               <h3 className={`${theme.type.h3} mb-1`}>
// // //                 Polygon Updated!
// // //               </h3>
// // //               <p className={`${theme.type.bodySm} mb-1`}>
// // //                 New fence boundary defined.
// // //               </p>
// // //               <p className="text-xs text-[#c5a880] font-semibold mb-5">
// // //                 Next: You'll redefine the named cells inside this fence.
// // //               </p>
// // //               <div className="flex gap-3">
// // //                 <button
// // //                   onClick={handleReset}
// // //                   className={theme.button.secondary}
// // //                 >
// // //                   Redo
// // //                 </button>
// // //                 <button
// // //                   onClick={handleSave}
// // //                   disabled={saveMutation.isPending}
// // //                   className={`${theme.button.primary} flex-1`}
// // //                 >
// // //                   {saveMutation.isPending
// // //                     ? <Loader2 className="w-4 h-4 animate-spin" />
// // //                     : <Save className="w-4 h-4" />}
// // //                   {saveMutation.isPending
// // //                     ? 'Saving...'
// // //                     : 'Save & Redefine Cells'}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ── Bottom bar ── */}
// // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4
// // //                       space-y-3 rounded-t-[2rem]">

// // //         {/* Status text + progress % */}
// // //         <div className="flex items-center justify-between text-sm">
// // //           <span className={theme.type.bodySm}>
// // //             {points.length === 0 && 'Click Reset then place new points on the frame'}
// // //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// // //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// // //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// // //             {points.length === 4 && '🎉 All 4 points placed! Ready to update.'}
// // //           </span>
// // //           <span className="font-sans text-sm font-bold text-[#c5a880]">
// // //             {Math.round((points.length / MAX_POINTS) * 100)}%
// // //           </span>
// // //         </div>

// // //         {/* Progress bar */}
// // //         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
// // //           <div
// // //             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
// // //             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
// // //           />
// // //         </div>

// // //         {/* Buttons */}
// // //         <div className="flex gap-3">
// // //           <button
// // //             onClick={handleReset}
// // //             className={theme.button.secondary}
// // //           >
// // //             Reset
// // //           </button>

// // //           <button
// // //             onClick={() => navigate(`/property/${propertyId}/cameras`)}
// // //             className={theme.button.secondary}
// // //           >
// // //             Cancel
// // //           </button>

// // //           <button
// // //             onClick={handleSave}
// // //             disabled={!isComplete || saveMutation.isPending}
// // //             className={`${theme.button.primary} flex-1`}
// // //           >
// // //             {saveMutation.isPending
// // //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</>
// // //               : <><Save className="w-5 h-5" /> Save & Redefine Cells</>}
// // //           </button>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default EditClimbingCalibration

// // // src/pages/EditClimbingCalibration.jsx
// // //
// // // ROLE IN THE EDIT FLOW
// // // ─────────────────────
// // // Step 1 when changing an existing camera TO "fence" type.
// // // Its ONLY job: let the user draw the 4-point polygon and store
// // // the normalised points in sessionStorage under pendingCameraEdit.
// // //
// // // It does NOT touch the database at all.
// // //
// // // ALL database writes happen in FenceCellEditor.handleSave (Step 2)
// // // in this strict order:
// // //   1. updateCamera  → sets camera_type = "fence" in the DB
// // //   2. save polygon  → POST /fence-config  (now passes the backend guard)
// // //   3. save cells    → POST /fence-config/cells
// // //
// // // Why this order? The backend endpoint POST /fence-config validates
// // // camera.camera_type === "fence" before accepting the polygon.
// // // If we save the polygon before updating the type we get
// // // "Camera must be a fence camera" — the exact bug this solves.

// // import { useState, useRef, useEffect, useCallback } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   ArrowLeft, Save, RotateCcw, CheckCircle,
// //   AlertTriangle, Loader2, Crosshair, Info,
// // } from 'lucide-react'
// // import { theme } from '../theme'

// // const EditClimbingCalibration = () => {
// //   const { id: propertyId, cameraId } = useParams()
// //   const navigate = useNavigate()

// //   const canvasRef    = useRef(null)
// //   const containerRef = useRef(null)
// //   const baseImageRef = useRef(null)

// //   const [points,        setPoints]        = useState([])
// //   const [frameLoaded,   setFrameLoaded]   = useState(false)
// //   const [frameError,    setFrameError]    = useState(null)
// //   const [isCapturing,   setIsCapturing]   = useState(true)
// //   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 })
// //   const [showHelp,      setShowHelp]      = useState(true)
// //   const [cameraName,    setCameraName]    = useState(`Camera ${cameraId}`)
// //   const [usingFallback, setUsingFallback] = useState(false)

// //   // pendingCameraEdit was written by EditCamera before navigating here.
// //   // Shape: { cameraId, propertyId, data: { name, rtsp_url, grid_cell, camera_type } }
// //   const pendingEdit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')

// //   const MAX_POINTS   = 4
// //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// //   // ── Draw helpers ──────────────────────────────────────────────────────────

// //   const drawPlaceholder = useCallback((canvas) => {
// //     const ctx = canvas.getContext('2d')
// //     const w   = canvas.width
// //     const h   = canvas.height
// //     ctx.fillStyle = '#1c1c1c'
// //     ctx.fillRect(0, 0, w, h)
// //     ctx.strokeStyle = '#2a2a2a'
// //     ctx.lineWidth   = 1
// //     for (let x = 0; x < w; x += 40) {
// //       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// //     }
// //     for (let y = 0; y < h; y += 40) {
// //       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// //     }
// //     ctx.fillStyle    = '#c5a880'
// //     ctx.font         = 'bold 16px sans-serif'
// //     ctx.textAlign    = 'center'
// //     ctx.textBaseline = 'middle'
// //     ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
// //     ctx.fillStyle = '#6b7280'
// //     ctx.font      = '13px sans-serif'
// //     ctx.fillText('Click anywhere to define polygon points', w / 2, h / 2 + 16)
// //   }, [])

// //   const redrawAll = useCallback((pts) => {
// //     const canvas = canvasRef.current
// //     if (!canvas || !frameLoaded) return
// //     const ctx = canvas.getContext('2d')

// //     // Restore background
// //     if (baseImageRef.current) {
// //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// //     } else {
// //       drawPlaceholder(canvas)
// //     }

// //     // Dashed polygon outline + fill
// //     if (pts.length > 1) {
// //       ctx.strokeStyle = '#c5a880'
// //       ctx.lineWidth   = 3
// //       ctx.setLineDash([8, 4])
// //       ctx.beginPath()
// //       ctx.moveTo(pts[0].x, pts[0].y)
// //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
// //       if (pts.length === MAX_POINTS) {
// //         ctx.closePath()
// //         ctx.fillStyle = 'rgba(197,168,128,0.15)'
// //         ctx.fill()
// //       }
// //       ctx.stroke()
// //       ctx.setLineDash([])
// //     }

// //     // Corner dots + pill labels
// //     pts.forEach((p, i) => {
// //       // Glowing outer ring
// //       ctx.shadowColor = POINT_COLORS[i]
// //       ctx.shadowBlur  = 10
// //       ctx.beginPath()
// //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// //       ctx.fillStyle = POINT_COLORS[i]
// //       ctx.fill()
// //       ctx.shadowBlur = 0

// //       // White inner dot
// //       ctx.beginPath()
// //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// //       ctx.fillStyle = 'white'
// //       ctx.fill()

// //       // Index number inside dot
// //       ctx.fillStyle    = POINT_COLORS[i]
// //       ctx.font         = 'bold 11px sans-serif'
// //       ctx.textAlign    = 'center'
// //       ctx.textBaseline = 'middle'
// //       ctx.fillText((i + 1).toString(), p.x, p.y)

// //       // Corner name pill above the dot
// //       const label   = POINT_LABELS[i]
// //       ctx.font      = 'bold 12px sans-serif'
// //       const lw      = ctx.measureText(label).width + 10
// //       const lx      = p.x - lw / 2
// //       const ly      = p.y - 30
// //       ctx.fillStyle = 'rgba(0,0,0,0.8)'
// //       ctx.beginPath()
// //       ctx.roundRect(lx, ly - 10, lw, 20, 4)
// //       ctx.fill()
// //       ctx.fillStyle    = POINT_COLORS[i]
// //       ctx.textBaseline = 'middle'
// //       ctx.fillText(label, p.x, ly)
// //     })
// //   }, [frameLoaded, drawPlaceholder])

// //   // ── Canvas sizing ─────────────────────────────────────────────────────────

// //   const setupCanvas = useCallback((img = null) => {
// //     const canvas    = canvasRef.current
// //     const container = containerRef.current
// //     if (!canvas || !container) return null
// //     const w = container.clientWidth
// //     const h = img ? img.naturalHeight * (w / img.naturalWidth) : w * 0.5625
// //     canvas.width  = w
// //     canvas.height = h
// //     return { width: w, height: h }
// //   }, [])

// //   const paintBlob = useCallback((blob) => new Promise((resolve, reject) => {
// //     const url = URL.createObjectURL(blob)
// //     const img = new Image()
// //     img.onload = () => {
// //       URL.revokeObjectURL(url)
// //       const size = setupCanvas(img)
// //       if (!size) { reject(new Error('Canvas not ready')); return }
// //       canvasRef.current.getContext('2d').drawImage(img, 0, 0, size.width, size.height)
// //       baseImageRef.current = img
// //       setImageSize(size)
// //       setFrameLoaded(true)
// //       setIsCapturing(false)
// //       resolve(size)
// //     }
// //     img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Decode failed')) }
// //     img.src = url
// //   }), [setupCanvas])

// //   const loadPlaceholder = useCallback(() => {
// //     const size = setupCanvas()
// //     if (!size) return
// //     baseImageRef.current = null
// //     drawPlaceholder(canvasRef.current)
// //     setImageSize(size)
// //     setUsingFallback(true)
// //     setFrameLoaded(true)
// //     setIsCapturing(false)
// //   }, [setupCanvas, drawPlaceholder])

// //   // ── Frame load effect ─────────────────────────────────────────────────────

// //   const doLoad = useCallback(async () => {
// //     setIsCapturing(true)
// //     setFrameError(null)
// //     setUsingFallback(false)
// //     baseImageRef.current = null

// //     await new Promise(r => setTimeout(r, 50))     // wait for container to paint

// //     const apiUrl  = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// //     const token   = localStorage.getItem('token')
// //     const rtspUrl = pendingEdit?.data?.rtsp_url

// //     if (!rtspUrl) {
// //       setFrameError('No RTSP URL found — please go back and re-enter camera details.')
// //       loadPlaceholder()
// //       return
// //     }

// //     try {
// //       const res = await fetch(`${apiUrl}/api/v1/stream/preview-frame`, {
// //         method:  'POST',
// //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //         body:    JSON.stringify({ rtsp_url: rtspUrl }),
// //       })
// //       if (!res.ok) throw new Error(`Stream error ${res.status}`)
// //       await paintBlob(await res.blob())
// //       if (pendingEdit?.data?.name) setCameraName(pendingEdit.data.name)
// //     } catch (err) {
// //       setFrameError(err.message)
// //       loadPlaceholder()
// //     }
// //   }, [pendingEdit, paintBlob, loadPlaceholder])

// //   useEffect(() => {
// //     let cancelled = false
// //     doLoad().catch(() => {})
// //     return () => { cancelled = true }
// //   }, [])  // run once on mount — pendingEdit is read from sessionStorage each render

// //   // Redraw whenever points or frame change
// //   useEffect(() => {
// //     if (frameLoaded) redrawAll(points)
// //   }, [points, frameLoaded, redrawAll])

// //   // ── Canvas click ──────────────────────────────────────────────────────────

// //   const handleCanvasClick = (e) => {
// //     if (points.length >= MAX_POINTS) return
// //     const canvas = canvasRef.current
// //     const rect   = canvas.getBoundingClientRect()
// //     setPoints(prev => [...prev, {
// //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// //     }])
// //   }

// //   // ── Actions ───────────────────────────────────────────────────────────────

// //   const handleReset = () => { setPoints([]); if (frameLoaded) redrawAll([]) }
// //   const handleUndo  = () => setPoints(prev => prev.slice(0, -1))
// //   const handleRetry = () => { setPoints([]); doLoad() }

// //   // ── handleSave ────────────────────────────────────────────────────────────
// //   // ZERO database calls here.
// //   // We only normalise the pixel coords to 0–1 range (resolution-independent)
// //   // and merge them into the existing pendingCameraEdit entry in sessionStorage.
// //   // FenceCellEditor reads polygonPoints from there and handles all DB writes.
// //   const handleSave = () => {
// //     if (points.length !== MAX_POINTS) return

// //     const normalizedPoints = points.map(p => ({
// //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// //     }))

// //     // Preserve everything EditCamera stored, just add polygonPoints
// //     const existing = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
// //     sessionStorage.setItem('pendingCameraEdit', JSON.stringify({
// //       ...existing,
// //       polygonPoints: normalizedPoints,
// //     }))

// //     // Proceed to Step 2: define named cells
// //     navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
// //   }

// //   const isComplete = points.length === MAX_POINTS

// //   // ── Render ────────────────────────────────────────────────────────────────

// //   return (
// //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// //       {/* ── Header ── */}
// //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// //           <ArrowLeft className="h-6 w-6" />
// //         </button>
// //         <div className="ml-3 flex-1 min-w-0">
// //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// //             Draw Fence Polygon
// //           </h2>
// //           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
// //         </div>
// //         <div className="ml-auto flex items-center gap-2">
// //           {points.length > 0 && (
// //             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
// //               <RotateCcw className="h-5 w-5" />
// //             </button>
// //           )}
// //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// //             <Info className="h-5 w-5" />
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Step indicator: 1 Draw Polygon → 2 Define Cells → 3 Save to DB ── */}
// //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// //         <div className="flex items-center gap-2">
// //           {/* Step 1 — active */}
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// //                             justify-center text-[#1c1c1c] text-xs font-bold">1</div>
// //             <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
// //           </div>
// //           <div className="flex-1 h-px bg-white/10" />
// //           {/* Step 2 — pending */}
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// //                             justify-center text-white/40 text-xs font-bold">2</div>
// //             <span className="text-white/40 text-xs font-bold">Define Cells</span>
// //           </div>
// //           <div className="flex-1 h-px bg-white/10" />
// //           {/* Step 3 — pending */}
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// //                             justify-center text-white/40 text-xs font-bold">3</div>
// //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ── Help banner ── */}
// //       {showHelp && (
// //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// //           <div className="flex items-start gap-3">
// //             <div className="text-sm text-[#c5a880]/90 flex-1">
// //               <p className="font-bold mb-1">Click 4 corners to define the fence boundary:</p>
// //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// //                 <li>Top-Left corner of fence</li>
// //                 <li>Top-Right corner of fence</li>
// //                 <li>Bottom-Right corner of fence</li>
// //                 <li>Bottom-Left corner of fence</li>
// //               </ol>
// //               <p className="text-amber-400/80 text-xs mt-2 font-medium">
// //                 ⚠️ The camera update is only saved to the database after you define cells in Step 2.
// //               </p>
// //             </div>
// //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Fallback warning ── */}
// //       {usingFallback && !isCapturing && (
// //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// //           <span className="text-amber-300 text-xs flex-1">
// //             Stream unavailable — drawing on placeholder grid.
// //             <button onClick={handleRetry} className="underline font-bold ml-1">Retry</button>
// //           </span>
// //         </div>
// //       )}

// //       {/* ── Canvas area ── */}
// //       <div className="flex-1 relative bg-black" ref={containerRef}>

// //         {/* Loading overlay */}
// //         {isCapturing && (
// //           <div className="absolute inset-0 flex flex-col items-center
// //                           justify-center bg-[#1c1c1c] z-10">
// //             <div className={theme.ui.spinner} />
// //             <p className={`${theme.type.whiteMuted} mt-4`}>Connecting to camera…</p>
// //           </div>
// //         )}

// //         {/* Error banner (only when not already showing placeholder) */}
// //         {frameError && !usingFallback && (
// //           <div className="absolute top-4 left-4 right-4 z-10">
// //             <div className={theme.alert.error}>
// //               <AlertTriangle className="w-4 h-4 shrink-0" />
// //               <span className="flex-1 text-sm">{frameError}</span>
// //               <button onClick={handleRetry}
// //                 className="text-xs border border-red-300 px-2 py-1 rounded-full ml-auto">
// //                 Retry
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Main canvas */}
// //         <canvas
// //           ref={canvasRef}
// //           onClick={handleCanvasClick}
// //           className={`w-full cursor-crosshair transition-opacity duration-300
// //                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// //           style={{ display: 'block' }}
// //         />

// //         {/* Point counter badge (top-right) */}
// //         {frameLoaded && (
// //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// //                           rounded-2xl px-3 py-2 text-center">
// //             <div className="flex items-center gap-2">
// //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// //               <span className="text-white font-mono text-sm font-bold">
// //                 {points.length}/{MAX_POINTS}
// //               </span>
// //             </div>
// //             <div className="flex gap-1 mt-1">
// //               {POINT_COLORS.map((c, i) => (
// //                 <div key={i}
// //                   style={{ backgroundColor: i < points.length ? c : undefined }}
// //                   className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Completion overlay */}
// //         {isComplete && (
// //           <div className="absolute inset-0 bg-black/60 flex items-center
// //                           justify-center z-20">
// //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4
// //                             text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// //               <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
// //               <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
// //               <p className="text-xs text-amber-600 font-semibold mb-5">
// //                 Camera is saved to the database only after Step 2.<br />
// //                 Next: define named cells inside this fence.
// //               </p>
// //               <div className="flex gap-3">
// //                 <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
// //                 <button onClick={handleSave} className={`${theme.button.primary} flex-1`}>
// //                   <Save className="w-4 h-4" /> Next: Define Cells →
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ── Bottom bar ── */}
// //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

// //         <div className="flex items-center justify-between text-sm">
// //           <span className={theme.type.bodySm}>
// //             {points.length === 0 && 'Click the Top-Left corner of the fence to start'}
// //             {points.length === 1 && '✅ Top-Left placed • Click Top-Right'}
// //             {points.length === 2 && '✅ Top edge done • Click Bottom-Right'}
// //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// //             {points.length === 4 && '🎉 All 4 points placed!'}
// //           </span>
// //           <span className="font-bold text-[#c5a880]">
// //             {Math.round((points.length / MAX_POINTS) * 100)}%
// //           </span>
// //         </div>

// //         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
// //           <div
// //             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
// //             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
// //           />
// //         </div>

// //         <div className="flex gap-3">
// //           <button onClick={handleReset} className={theme.button.secondary}>Reset</button>
// //           <button
// //             onClick={() => navigate(`/property/${propertyId}/cameras`)}
// //             className={theme.button.secondary}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleSave}
// //             disabled={!isComplete}
// //             className={`${theme.button.primary} flex-1`}
// //           >
// //             <Save className="w-5 h-5" /> Next: Define Cells →
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default EditClimbingCalibration

// // src/pages/EditClimbingCalibration.jsx
// //
// // STEP 1 of two flows that need a polygon:
// //
// //  A) EDIT EXISTING CAMERA → FENCE (type is changing to "fence")
// //     sessionStorage: pendingCameraEdit = { cameraId, propertyId,
// //                                           data: { name, rtsp_url,
// //                                                   grid_cell, camera_type },
// //                                           polygonPoints? }
// //     On Next → merges polygonPoints into pendingCameraEdit, navigates to /cells
// //     FenceCellEditor (isEditing=true) then does all DB writes.
// //
// //  B) RECALIBRATE existing fence camera (polygon needs to be redrawn)
// //     sessionStorage: recalibrateCamera = { cameraId, propertyId,
// //                                           cameraType, cameraName, rtspUrl }
// //     On Next → merges polygonPoints into recalibrateCamera, navigates to /cells
// //     FenceCellEditor (isNew=false, isEditing=false) saves only cells.
// //     NOTE: polygon is NOT re-saved in recalibrate; only cells are updated.
// //           If you also need to save the polygon on recalibrate, FenceCellEditor's
// //           handleSave must be extended. For now it matches original behaviour.
// //
// // ── Zero DB writes here ──────────────────────────────────────────────────────
// // This page ONLY normalises pixel coords → 0–1 and stores them in sessionStorage.
// // All DB writes happen in FenceCellEditor.

// import { useState, useRef, useEffect, useCallback } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, Save, RotateCcw, CheckCircle,
//   AlertTriangle, Loader2, Crosshair, Info,
// } from 'lucide-react'
// import { theme } from '../theme'

// const EditClimbingCalibration = () => {
//   const { id: propertyId, cameraId } = useParams()
//   const navigate = useNavigate()

//   const canvasRef    = useRef(null)
//   const containerRef = useRef(null)
//   const baseImageRef = useRef(null)

//   const [points,        setPoints]        = useState([])
//   const [frameLoaded,   setFrameLoaded]   = useState(false)
//   const [frameError,    setFrameError]    = useState(null)
//   const [isCapturing,   setIsCapturing]   = useState(true)
//   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 })
//   const [showHelp,      setShowHelp]      = useState(true)
//   const [usingFallback, setUsingFallback] = useState(false)

//   // ── Detect which flow we are in ────────────────────────────────────────────
//   // Edit flow: EditCamera wrote pendingCameraEdit before navigating here.
//   // Recalibrate flow: CameraManagement wrote recalibrateCamera before navigating.
//   const pendingEdit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
//   const recalibMeta = JSON.parse(sessionStorage.getItem('recalibrateCamera') || 'null')

//   // isEditFlow: pendingCameraEdit exists and its cameraId matches the route
//   const isEditFlow =
//     pendingEdit !== null &&
//     String(pendingEdit.cameraId) === String(cameraId)

//   // isRecalibFlow: recalibrateCamera exists and its cameraId matches the route
//   const isRecalibFlow =
//     !isEditFlow &&
//     recalibMeta !== null &&
//     String(recalibMeta.cameraId) === String(cameraId)

//   // Derive the RTSP URL and camera name for whichever flow is active
//   const rtspUrl = isEditFlow
//     ? pendingEdit?.data?.rtsp_url
//     : isRecalibFlow
//       ? recalibMeta?.rtspUrl
//       : null

//   const [cameraName] = useState(() => {
//     if (isEditFlow)    return pendingEdit?.data?.name    || `Camera ${cameraId}`
//     if (isRecalibFlow) return recalibMeta?.cameraName    || `Camera ${cameraId}`
//     return `Camera ${cameraId}`
//   })

//   const MAX_POINTS   = 4
//   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
//   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

//   // ── Draw helpers ────────────────────────────────────────────────────────────

//   const drawPlaceholder = useCallback((canvas) => {
//     const ctx = canvas.getContext('2d')
//     const w   = canvas.width
//     const h   = canvas.height
//     ctx.fillStyle = '#1c1c1c'
//     ctx.fillRect(0, 0, w, h)
//     ctx.strokeStyle = '#2a2a2a'
//     ctx.lineWidth   = 1
//     for (let x = 0; x < w; x += 40) {
//       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
//     }
//     for (let y = 0; y < h; y += 40) {
//       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
//     }
//     ctx.fillStyle    = '#c5a880'
//     ctx.font         = 'bold 16px sans-serif'
//     ctx.textAlign    = 'center'
//     ctx.textBaseline = 'middle'
//     ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
//     ctx.fillStyle = '#6b7280'
//     ctx.font      = '13px sans-serif'
//     ctx.fillText('Click anywhere to define polygon points', w / 2, h / 2 + 16)
//   }, [])

//   const redrawAll = useCallback((pts) => {
//     const canvas = canvasRef.current
//     if (!canvas || !frameLoaded) return
//     const ctx = canvas.getContext('2d')

//     if (baseImageRef.current) {
//       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
//     } else {
//       drawPlaceholder(canvas)
//     }

//     if (pts.length > 1) {
//       ctx.strokeStyle = '#c5a880'
//       ctx.lineWidth   = 3
//       ctx.setLineDash([8, 4])
//       ctx.beginPath()
//       ctx.moveTo(pts[0].x, pts[0].y)
//       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
//       if (pts.length === MAX_POINTS) {
//         ctx.closePath()
//         ctx.fillStyle = 'rgba(197,168,128,0.15)'
//         ctx.fill()
//       }
//       ctx.stroke()
//       ctx.setLineDash([])
//     }

//     pts.forEach((p, i) => {
//       ctx.shadowColor = POINT_COLORS[i]
//       ctx.shadowBlur  = 10
//       ctx.beginPath()
//       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
//       ctx.fillStyle = POINT_COLORS[i]
//       ctx.fill()
//       ctx.shadowBlur = 0

//       ctx.beginPath()
//       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
//       ctx.fillStyle = 'white'
//       ctx.fill()

//       ctx.fillStyle    = POINT_COLORS[i]
//       ctx.font         = 'bold 11px sans-serif'
//       ctx.textAlign    = 'center'
//       ctx.textBaseline = 'middle'
//       ctx.fillText((i + 1).toString(), p.x, p.y)

//       const label = POINT_LABELS[i]
//       ctx.font    = 'bold 12px sans-serif'
//       const lw    = ctx.measureText(label).width + 10
//       const lx    = p.x - lw / 2
//       const ly    = p.y - 30
//       ctx.fillStyle = 'rgba(0,0,0,0.8)'
//       ctx.beginPath()
//       ctx.roundRect(lx, ly - 10, lw, 20, 4)
//       ctx.fill()
//       ctx.fillStyle    = POINT_COLORS[i]
//       ctx.textBaseline = 'middle'
//       ctx.fillText(label, p.x, ly)
//     })
//   }, [frameLoaded, drawPlaceholder]) // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Canvas sizing ───────────────────────────────────────────────────────────

//   const setupCanvas = useCallback((img = null) => {
//     const canvas    = canvasRef.current
//     const container = containerRef.current
//     if (!canvas || !container) return null
//     const w = container.clientWidth
//     const h = img ? img.naturalHeight * (w / img.naturalWidth) : w * 0.5625
//     canvas.width  = w
//     canvas.height = h
//     return { width: w, height: h }
//   }, [])

//   const paintBlob = useCallback((blob) => new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(blob)
//     const img = new Image()
//     img.onload = () => {
//       URL.revokeObjectURL(url)
//       const size = setupCanvas(img)
//       if (!size) { reject(new Error('Canvas not ready')); return }
//       canvasRef.current.getContext('2d').drawImage(img, 0, 0, size.width, size.height)
//       baseImageRef.current = img
//       setImageSize(size)
//       setFrameLoaded(true)
//       setIsCapturing(false)
//       resolve(size)
//     }
//     img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Decode failed')) }
//     img.src = url
//   }), [setupCanvas])

//   const loadPlaceholder = useCallback(() => {
//     const size = setupCanvas()
//     if (!size) return
//     baseImageRef.current = null
//     drawPlaceholder(canvasRef.current)
//     setImageSize(size)
//     setUsingFallback(true)
//     setFrameLoaded(true)
//     setIsCapturing(false)
//   }, [setupCanvas, drawPlaceholder])

//   // ── Frame load ──────────────────────────────────────────────────────────────

//   const doLoad = useCallback(async () => {
//     setIsCapturing(true)
//     setFrameError(null)
//     setUsingFallback(false)
//     baseImageRef.current = null

//     await new Promise(r => setTimeout(r, 50))

//     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
//     const token  = localStorage.getItem('token')

//     if (!rtspUrl) {
//       setFrameError('No RTSP URL found — please go back and re-enter camera details.')
//       loadPlaceholder()
//       return
//     }

//     try {
//       const res = await fetch(`${apiUrl}/api/v1/stream/preview-frame`, {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body:    JSON.stringify({ rtsp_url: rtspUrl }),
//       })
//       if (!res.ok) throw new Error(`Stream error ${res.status}`)
//       await paintBlob(await res.blob())
//     } catch (err) {
//       setFrameError(err.message)
//       loadPlaceholder()
//     }
//   }, [rtspUrl, paintBlob, loadPlaceholder])

//   useEffect(() => {
//     doLoad().catch(() => {})
//   }, []) // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     if (frameLoaded) redrawAll(points)
//   }, [points, frameLoaded, redrawAll])

//   // ── Canvas click ────────────────────────────────────────────────────────────

//   const handleCanvasClick = (e) => {
//     if (points.length >= MAX_POINTS) return
//     const canvas = canvasRef.current
//     const rect   = canvas.getBoundingClientRect()
//     setPoints(prev => [...prev, {
//       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
//       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
//     }])
//   }

//   // ── Actions ─────────────────────────────────────────────────────────────────

//   const handleReset = () => { setPoints([]); if (frameLoaded) redrawAll([]) }
//   const handleUndo  = () => setPoints(prev => prev.slice(0, -1))
//   const handleRetry = () => { setPoints([]); doLoad() }

//   // ── handleSave — ZERO DB calls ──────────────────────────────────────────────
//   // Normalises pixel coords → 0–1 and merges them into the active sessionStorage
//   // entry, then navigates to FenceCellEditor (/cells) which does all DB writes.
//   const handleSave = () => {
//     if (points.length !== MAX_POINTS) return

//     const normalizedPoints = points.map(p => ({
//       x: parseFloat((p.x / imageSize.width).toFixed(6)),
//       y: parseFloat((p.y / imageSize.height).toFixed(6)),
//     }))

//     if (isEditFlow) {
//       // Merge into pendingCameraEdit (edit flow)
//       const existing = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
//       sessionStorage.setItem('pendingCameraEdit', JSON.stringify({
//         ...existing,
//         polygonPoints: normalizedPoints,
//       }))
//     } else if (isRecalibFlow) {
//       // Merge into recalibrateCamera (recalibrate flow)
//       const existing = JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}')
//       sessionStorage.setItem('recalibrateCamera', JSON.stringify({
//         ...existing,
//         polygonPoints: normalizedPoints,
//       }))
//     }

//     // Both flows proceed to FenceCellEditor which reads from the appropriate key
//     navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
//   }

//   const isComplete = points.length === MAX_POINTS

//   // ── Render ──────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

//       {/* ── Header ── */}
//       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
//         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
//           <ArrowLeft className="h-6 w-6" />
//         </button>
//         <div className="ml-3 flex-1 min-w-0">
//           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
//             Draw Fence Polygon
//           </h2>
//           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           {points.length > 0 && (
//             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
//               <RotateCcw className="h-5 w-5" />
//             </button>
//           )}
//           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
//             <Info className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* ── Step indicator ── */}
//       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
//         <div className="flex items-center gap-2">
//           {/* Step 1 — active */}
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
//                             justify-center text-[#1c1c1c] text-xs font-bold">1</div>
//             <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
//           </div>
//           <div className="flex-1 h-px bg-white/10" />
//           {/* Step 2 — pending */}
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
//                             justify-center text-white/40 text-xs font-bold">2</div>
//             <span className="text-white/40 text-xs font-bold">Define Cells</span>
//           </div>
//           <div className="flex-1 h-px bg-white/10" />
//           {/* Step 3 — pending */}
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
//                             justify-center text-white/40 text-xs font-bold">3</div>
//             <span className="text-white/40 text-xs font-bold">Save to DB</span>
//           </div>
//         </div>
//       </div>

//       {/* ── Help banner ── */}
//       {showHelp && (
//         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
//           <div className="flex items-start gap-3">
//             <div className="text-sm text-[#c5a880]/90 flex-1">
//               <p className="font-bold mb-1">Click 4 corners to define the fence boundary:</p>
//               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
//                 <li>Top-Left corner of fence</li>
//                 <li>Top-Right corner of fence</li>
//                 <li>Bottom-Right corner of fence</li>
//                 <li>Bottom-Left corner of fence</li>
//               </ol>
//               <p className="text-amber-400/80 text-xs mt-2 font-medium">
//                 {isRecalibFlow
//                   ? '⚠️ Only cells will be updated — camera and polygon records are kept as-is.'
//                   : '⚠️ The camera update is only saved to the database after you define cells in Step 2.'}
//               </p>
//             </div>
//             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
//           </div>
//         </div>
//       )}

//       {/* ── Fallback warning ── */}
//       {usingFallback && !isCapturing && (
//         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
//           <span className="text-amber-300 text-xs flex-1">
//             Stream unavailable — drawing on placeholder grid.
//             <button onClick={handleRetry} className="underline font-bold ml-1">Retry</button>
//           </span>
//         </div>
//       )}

//       {/* ── Canvas area ── */}
//       <div className="flex-1 relative bg-black" ref={containerRef}>

//         {isCapturing && (
//           <div className="absolute inset-0 flex flex-col items-center
//                           justify-center bg-[#1c1c1c] z-10">
//             <div className={theme.ui.spinner} />
//             <p className={`${theme.type.whiteMuted} mt-4`}>Connecting to camera…</p>
//           </div>
//         )}

//         {frameError && !usingFallback && (
//           <div className="absolute top-4 left-4 right-4 z-10">
//             <div className={theme.alert.error}>
//               <AlertTriangle className="w-4 h-4 shrink-0" />
//               <span className="flex-1 text-sm">{frameError}</span>
//               <button onClick={handleRetry}
//                 className="text-xs border border-red-300 px-2 py-1 rounded-full ml-auto">
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}

//         <canvas
//           ref={canvasRef}
//           onClick={handleCanvasClick}
//           className={`w-full cursor-crosshair transition-opacity duration-300
//                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
//           style={{ display: 'block' }}
//         />

//         {/* Point counter badge */}
//         {frameLoaded && (
//           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
//                           rounded-2xl px-3 py-2 text-center">
//             <div className="flex items-center gap-2">
//               <Crosshair className="w-4 h-4 text-[#c5a880]" />
//               <span className="text-white font-mono text-sm font-bold">
//                 {points.length}/{MAX_POINTS}
//               </span>
//             </div>
//             <div className="flex gap-1 mt-1">
//               {POINT_COLORS.map((c, i) => (
//                 <div key={i}
//                   style={{ backgroundColor: i < points.length ? c : undefined }}
//                   className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Completion overlay */}
//         {isComplete && (
//           <div className="absolute inset-0 bg-black/60 flex items-center
//                           justify-center z-20">
//             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4
//                             text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
//               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
//               <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
//               <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
//               <p className="text-xs text-amber-600 font-semibold mb-5">
//                 {isRecalibFlow
//                   ? 'Next: redefine named cells inside this fence.'
//                   : 'Camera is saved to the database only after Step 2.\nNext: define named cells inside this fence.'}
//               </p>
//               <div className="flex gap-3">
//                 <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
//                 <button onClick={handleSave} className={`${theme.button.primary} flex-1`}>
//                   <Save className="w-4 h-4" /> Next: Define Cells →
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Bottom bar ── */}
//       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

//         <div className="flex items-center justify-between text-sm">
//           <span className={theme.type.bodySm}>
//             {points.length === 0 && 'Click the Top-Left corner of the fence to start'}
//             {points.length === 1 && '✅ Top-Left placed • Click Top-Right'}
//             {points.length === 2 && '✅ Top edge done • Click Bottom-Right'}
//             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
//             {points.length === 4 && '🎉 All 4 points placed!'}
//           </span>
//           <span className="font-bold text-[#c5a880]">
//             {Math.round((points.length / MAX_POINTS) * 100)}%
//           </span>
//         </div>

//         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
//           <div
//             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
//             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
//           />
//         </div>

//         <div className="flex gap-3">
//           <button onClick={handleReset} className={theme.button.secondary}>Reset</button>
//           <button
//             onClick={() => navigate(`/property/${propertyId}/cameras`)}
//             className={theme.button.secondary}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!isComplete}
//             className={`${theme.button.primary} flex-1`}
//           >
//             <Save className="w-5 h-5" /> Next: Define Cells →
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditClimbingCalibration

// src/pages/EditClimbingCalibration.jsx
//
// Step 1 for EDIT EXISTING CAMERA and RECALIBRATE flows.
//
// Frame strategy — no backend fetch needed:
//   - Stream URL derived from pendingCameraEdit.data.rtsp_url or recalibrateCamera.rtspUrl
//   - <img> tag displays MJPEG stream behind a transparent <canvas>
//   - If stream errors → streamOk=false → canvas draws placeholder grid
//
// Zero DB writes here — polygon stored in sessionStorage only.
// All DB writes happen in FenceCellEditor (edit flow) or EditFenceCells (recalibrate flow).

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Save, RotateCcw, CheckCircle,
  Crosshair, WifiOff, Info,
} from 'lucide-react'
import { theme } from '../theme'

// ── Derive MJPEG stream URL from an rtsp_url ──────────────────────────────────
const deriveStreamUrl = (rtspUrl) => {
  if (!rtspUrl) return null
  try {
    const u = new URL(rtspUrl.replace(/^rtsp:\/\//i, 'http://'))
    return `${u.protocol}//${u.hostname}:8080/video`
  } catch {
    return null
  }
}

const EditClimbingCalibration = () => {
  const { id: propertyId, cameraId } = useParams()
  const navigate = useNavigate()

  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const imgRef       = useRef(null)

  const [points,     setPoints]     = useState([])
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [streamOk,   setStreamOk]   = useState(null)
  const [showHelp,   setShowHelp]   = useState(true)

  // ── Detect which flow we are in ────────────────────────────────────────────
  const pendingEdit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
  const recalibMeta = JSON.parse(sessionStorage.getItem('recalibrateCamera') || 'null')

  const isEditFlow =
    pendingEdit !== null && String(pendingEdit.cameraId) === String(cameraId)

  const isRecalibFlow =
    !isEditFlow &&
    recalibMeta !== null &&
    String(recalibMeta.cameraId) === String(cameraId)

  const rtspUrl = isEditFlow
    ? pendingEdit?.data?.rtsp_url
    : isRecalibFlow ? recalibMeta?.rtspUrl : null

  const streamUrl = deriveStreamUrl(rtspUrl)

  const [cameraName] = useState(() => {
    if (isEditFlow)    return pendingEdit?.data?.name    || `Camera ${cameraId}`
    if (isRecalibFlow) return recalibMeta?.cameraName    || `Camera ${cameraId}`
    return `Camera ${cameraId}`
  })

  const MAX_POINTS   = 4
  const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
  const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

  // ── Sync canvas size ───────────────────────────────────────────────────────

  const syncCanvasSize = useCallback(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const img = imgRef.current
    const w   = container.clientWidth
    const h   = img?.naturalHeight
      ? img.naturalHeight * (w / img.naturalWidth)
      : w * 0.5625
    canvas.width  = w
    canvas.height = h
    setCanvasSize({ width: w, height: h })
  }, [])

  useEffect(() => {
    syncCanvasSize()
    const ro = new ResizeObserver(syncCanvasSize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [syncCanvasSize])

  // No stream URL → go straight to placeholder
  useEffect(() => {
    if (!streamUrl && streamOk === null) setStreamOk(false)
  }, [streamUrl, streamOk])

  // ── Draw placeholder grid ──────────────────────────────────────────────────

  const drawPlaceholder = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w   = canvas.width
    const h   = canvas.height
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#1c1c1c'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth   = 1
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }
    ctx.fillStyle    = '#c5a880'
    ctx.font         = 'bold 15px sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 14)
    ctx.fillStyle = '#6b7280'
    ctx.font      = '13px sans-serif'
    ctx.fillText('Click anywhere to define polygon points', w / 2, h / 2 + 14)
  }, [])

  // ── Redraw polygon overlay ─────────────────────────────────────────────────

  const redrawAll = useCallback((pts) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (streamOk === false) {
      drawPlaceholder()
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (pts.length > 1) {
      ctx.strokeStyle = '#c5a880'
      ctx.lineWidth   = 3
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      if (pts.length === MAX_POINTS) {
        ctx.closePath()
        ctx.fillStyle = 'rgba(197,168,128,0.18)'
        ctx.fill()
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    pts.forEach((p, i) => {
      ctx.shadowColor = POINT_COLORS[i]
      ctx.shadowBlur  = 10
      ctx.beginPath()
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
      ctx.fillStyle = POINT_COLORS[i]
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()

      ctx.fillStyle    = POINT_COLORS[i]
      ctx.font         = 'bold 11px sans-serif'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((i + 1).toString(), p.x, p.y)

      const label = POINT_LABELS[i]
      ctx.font     = 'bold 12px sans-serif'
      const lw     = ctx.measureText(label).width + 10
      const lx     = p.x - lw / 2
      const ly     = p.y - 30
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.beginPath()
      ctx.roundRect(lx, ly - 10, lw, 20, 4)
      ctx.fill()
      ctx.fillStyle    = POINT_COLORS[i]
      ctx.textBaseline = 'middle'
      ctx.fillText(label, p.x, ly)
    })
  }, [streamOk, drawPlaceholder]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { redrawAll(points) }, [points, streamOk, canvasSize, redrawAll])

  // ── Canvas click ───────────────────────────────────────────────────────────

  const handleCanvasClick = (e) => {
    if (points.length >= MAX_POINTS) return
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    setPoints(prev => [...prev, {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    }])
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleReset = () => setPoints([])
  const handleUndo  = () => setPoints(prev => prev.slice(0, -1))

  const handleSave = () => {
    if (points.length !== MAX_POINTS) return

    const normalizedPoints = points.map(p => ({
      x: parseFloat((p.x / canvasSize.width).toFixed(6)),
      y: parseFloat((p.y / canvasSize.height).toFixed(6)),
    }))

    if (isEditFlow) {
      const existing = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
      sessionStorage.setItem('pendingCameraEdit', JSON.stringify({ ...existing, polygonPoints: normalizedPoints }))
    } else if (isRecalibFlow) {
      const existing = JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}')
      sessionStorage.setItem('recalibrateCamera', JSON.stringify({ ...existing, polygonPoints: normalizedPoints }))
    }

    navigate(`/property/${propertyId}/camera/${cameraId}/edit-cells`)
  }

  const isComplete = points.length === MAX_POINTS

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
        <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="ml-3 flex-1 min-w-0">
          <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
            Draw Fence Polygon
          </h2>
          <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {points.length > 0 && (
            <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
          <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">1</div>
            <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">2</div>
            <span className="text-white/40 text-xs font-bold">Define Cells</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">3</div>
            <span className="text-white/40 text-xs font-bold">Save to DB</span>
          </div>
        </div>
      </div>

      {/* Help banner */}
      {showHelp && (
        <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="text-sm text-[#c5a880]/90 flex-1">
              <p className="font-bold mb-1">Click 4 corners to define the fence boundary:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
                <li>Top-Left corner of fence</li>
                <li>Top-Right corner of fence</li>
                <li>Bottom-Right corner of fence</li>
                <li>Bottom-Left corner of fence</li>
              </ol>
              <p className="text-amber-400/80 text-xs mt-2 font-medium">
                {isRecalibFlow
                  ? '⚠️ Only cells will be updated — camera and polygon records are kept as-is.'
                  : '⚠️ The camera update is only saved to the database after you define cells in Step 2.'}
              </p>
            </div>
            <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* Stream unavailable banner */}
      {streamOk === false && (
        <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs">
            Stream unavailable — drawing on placeholder grid.
          </p>
        </div>
      )}

      {/* Canvas + stream stacked */}
      <div className="flex-1 relative bg-black" ref={containerRef}>

        {/* MJPEG stream — behind canvas */}
        {streamUrl && (
          <img
            ref={imgRef}
            src={streamUrl}
            alt="Live camera"
            onLoad={() => { setStreamOk(true); syncCanvasSize() }}
            onError={() => setStreamOk(false)}
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
              streamOk === true ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Connecting spinner */}
        {streamUrl && streamOk === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10 pointer-events-none">
            <div className={theme.ui.spinner} />
            <p className={`${theme.type.whiteMuted} mt-4 text-sm`}>Connecting to camera…</p>
          </div>
        )}

        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative w-full cursor-crosshair"
          style={{ display: 'block', background: 'transparent' }}
        />

        {/* Point counter badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#c5a880]" />
            <span className="text-white font-mono text-sm font-bold">
              {points.length}/{MAX_POINTS}
            </span>
          </div>
          <div className="flex gap-1 mt-1">
            {POINT_COLORS.map((c, i) => (
              <div
                key={i}
                style={{ backgroundColor: i < points.length ? c : undefined }}
                className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
              <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
              <p className="text-xs text-amber-600 font-semibold mb-5">
                {isRecalibFlow
                  ? 'Next: redefine named cells inside this fence.'
                  : 'Camera is saved to the database only after Step 2.\nNext: define named cells inside this fence.'}
              </p>
              <div className="flex gap-3">
                <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
                <button onClick={handleSave} className={`${theme.button.primary} flex-1`}>
                  <Save className="w-4 h-4" /> Next: Define Cells →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">
        <div className="flex items-center justify-between text-sm">
          <span className={theme.type.bodySm}>
            {points.length === 0 && 'Click the Top-Left corner of the fence to start'}
            {points.length === 1 && '✅ Top-Left placed • Click Top-Right'}
            {points.length === 2 && '✅ Top edge done • Click Bottom-Right'}
            {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
            {points.length === 4 && '🎉 All 4 points placed!'}
          </span>
          <span className="font-bold text-[#c5a880]">
            {Math.round((points.length / MAX_POINTS) * 100)}%
          </span>
        </div>

        <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
            style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className={theme.button.secondary}>Reset</button>
          <button
            onClick={() => navigate(`/property/${propertyId}/cameras`)}
            className={theme.button.secondary}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isComplete}
            className={`${theme.button.primary} flex-1`}
          >
            <Save className="w-5 h-5" /> Next: Define Cells →
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditClimbingCalibration