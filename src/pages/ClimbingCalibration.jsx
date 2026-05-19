// // // // // // src/pages/ClimbingCalibration.jsx
// // // // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // // import {
// // // // //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// // // // //   Loader2, Crosshair, MousePointer, Info
// // // // // } from 'lucide-react'
// // // // // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // // // // import { theme } from '../theme'

// // // // // const ClimbingCalibration = () => {
// // // // //   const { id: propertyId, cameraId } = useParams()
// // // // //   const navigate = useNavigate()

// // // // //   const canvasRef    = useRef(null)
// // // // //   const containerRef = useRef(null)
// // // // //   const baseImageRef = useRef(null)

// // // // //   const [points,      setPoints]      = useState([])
// // // // //   const [frameLoaded, setFrameLoaded] = useState(false)
// // // // //   const [frameError,  setFrameError]  = useState(null)
// // // // //   const [isCapturing, setIsCapturing] = useState(true)
// // // // //   const [imageSize,   setImageSize]   = useState({ width: 0, height: 0 })
// // // // //   const [showHelp,    setShowHelp]    = useState(true)
// // // // //   const [cameraName,  setCameraName]  = useState(`Camera ${cameraId}`)

// // // // //   const saveMutation               = useSaveFenceConfig()
// // // // //   const { data: existingConfig }   = useFenceConfig(cameraId)

// // // // //   const MAX_POINTS   = 4
// // // // //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// // // // //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// // // // //   // ── Draw helpers ─────────────────────────────
// // // // //   const drawBaseImage = useCallback((img, canvas) => {
// // // // //     const ctx       = canvas.getContext('2d')
// // // // //     const container = containerRef.current
// // // // //     if (!container) return
// // // // //     const containerWidth = container.clientWidth
// // // // //     const scale          = containerWidth / img.naturalWidth
// // // // //     const height         = img.naturalHeight * scale
// // // // //     canvas.width  = containerWidth
// // // // //     canvas.height = height
// // // // //     ctx.drawImage(img, 0, 0, containerWidth, height)
// // // // //     return { width: containerWidth, height }
// // // // //   }, [])

// // // // //   const drawPlaceholderOnCanvas = useCallback((canvas) => {
// // // // //     const ctx       = canvas.getContext('2d')
// // // // //     const container = containerRef.current
// // // // //     if (!container) return
// // // // //     const w = container.clientWidth
// // // // //     const h = w * 0.5625
// // // // //     canvas.width  = w
// // // // //     canvas.height = h
// // // // //     ctx.fillStyle = '#1c1c1c'
// // // // //     ctx.fillRect(0, 0, w, h)
// // // // //     ctx.strokeStyle = '#2a2a2a'
// // // // //     ctx.lineWidth   = 1
// // // // //     const gridSize  = 40
// // // // //     for (let x = 0; x < w; x += gridSize) {
// // // // //       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// // // // //     }
// // // // //     for (let y = 0; y < h; y += gridSize) {
// // // // //       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// // // // //     }
// // // // //     ctx.fillStyle = '#c5a880'
// // // // //     ctx.font      = 'bold 18px sans-serif'
// // // // //     ctx.textAlign = 'center'
// // // // //     ctx.fillText('📷 Camera Frame Placeholder', w / 2, h / 2 - 20)
// // // // //     ctx.fillStyle = '#6b7280'
// // // // //     ctx.font      = '14px sans-serif'
// // // // //     ctx.fillText('Click anywhere to define wall polygon points', w / 2, h / 2 + 10)
// // // // //     return { width: w, height: h }
// // // // //   }, [])

// // // // //   const redrawAll = useCallback((currentPoints) => {
// // // // //     const canvas = canvasRef.current
// // // // //     if (!canvas || !frameLoaded) return
// // // // //     const ctx = canvas.getContext('2d')
// // // // //     if (baseImageRef.current) {
// // // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // // //     }
// // // // //     if (currentPoints.length > 1) {
// // // // //       ctx.strokeStyle = '#c5a880'
// // // // //       ctx.lineWidth   = 3
// // // // //       ctx.setLineDash([8, 4])
// // // // //       ctx.beginPath()
// // // // //       ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
// // // // //       for (let i = 1; i < currentPoints.length; i++) {
// // // // //         ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
// // // // //       }
// // // // //       if (currentPoints.length === MAX_POINTS) {
// // // // //         ctx.closePath()
// // // // //         ctx.fillStyle = 'rgba(197,168,128,0.15)'
// // // // //         ctx.fill()
// // // // //       }
// // // // //       ctx.stroke()
// // // // //       ctx.setLineDash([])
// // // // //     }
// // // // //     currentPoints.forEach((p, i) => {
// // // // //       ctx.shadowColor  = POINT_COLORS[i]
// // // // //       ctx.shadowBlur   = 10
// // // // //       ctx.beginPath()
// // // // //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// // // // //       ctx.fillStyle = POINT_COLORS[i]
// // // // //       ctx.fill()
// // // // //       ctx.shadowBlur = 0
// // // // //       ctx.beginPath()
// // // // //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// // // // //       ctx.fillStyle = 'white'
// // // // //       ctx.fill()
// // // // //       ctx.fillStyle    = POINT_COLORS[i]
// // // // //       ctx.font         = 'bold 11px sans-serif'
// // // // //       ctx.textAlign    = 'center'
// // // // //       ctx.textBaseline = 'middle'
// // // // //       ctx.fillText((i + 1).toString(), p.x, p.y)
// // // // //       const label      = POINT_LABELS[i]
// // // // //       ctx.font         = 'bold 12px sans-serif'
// // // // //       const labelWidth = ctx.measureText(label).width + 10
// // // // //       const labelX     = p.x - labelWidth / 2
// // // // //       const labelY     = p.y - 30
// // // // //       ctx.fillStyle    = 'rgba(0,0,0,0.8)'
// // // // //       ctx.beginPath()
// // // // //       ctx.roundRect(labelX, labelY - 10, labelWidth, 20, 4)
// // // // //       ctx.fill()
// // // // //       ctx.fillStyle = POINT_COLORS[i]
// // // // //       ctx.fillText(label, p.x, labelY)
// // // // //     })
// // // // //   }, [frameLoaded])

// // // // //   // ── Load placeholder ──────────────────────────
// // // // //   const loadPlaceholder = useCallback(() => {
// // // // //     const canvas = canvasRef.current
// // // // //     if (!canvas) return
// // // // //     drawPlaceholderOnCanvas(canvas)
// // // // //     const size = { width: canvas.width, height: canvas.height }
// // // // //     setImageSize(size)
// // // // //     setFrameLoaded(true)
// // // // //     const img  = new Image()
// // // // //     img.src    = canvas.toDataURL()
// // // // //     img.onload = () => { baseImageRef.current = img }
// // // // //   }, [drawPlaceholderOnCanvas])

// // // // //   // ── Load frame ────────────────────────────────
// // // // //   useEffect(() => {
// // // // //     const loadFrame = async () => {
// // // // //       setIsCapturing(true)
// // // // //       setFrameError(null)
// // // // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // // //       const token  = localStorage.getItem('token')
// // // // //       try {
// // // // //         const response = await fetch(
// // // // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // // //         )
// // // // //         if (!response.ok) throw new Error(`Camera error: ${response.status}`)
// // // // //         const blob    = await response.blob()
// // // // //         const blobUrl = URL.createObjectURL(blob)
// // // // //         const img     = new Image()
// // // // //         img.onload = () => {
// // // // //           baseImageRef.current = img
// // // // //           const canvas = canvasRef.current
// // // // //           if (!canvas) return
// // // // //           const size = drawBaseImage(img, canvas)
// // // // //           if (size) setImageSize(size)
// // // // //           setFrameLoaded(true)
// // // // //           setIsCapturing(false)
// // // // //           URL.revokeObjectURL(blobUrl)
// // // // //         }
// // // // //         img.onerror = () => {
// // // // //           setFrameError('Failed to load camera frame image')
// // // // //           setIsCapturing(false)
// // // // //           loadPlaceholder()
// // // // //           URL.revokeObjectURL(blobUrl)
// // // // //         }
// // // // //         img.src = blobUrl
// // // // //         try {
// // // // //           const camRes = await fetch(
// // // // //             `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // // // //             { headers: { Authorization: `Bearer ${token}` } }
// // // // //           )
// // // // //           if (camRes.ok) {
// // // // //             const camData = await camRes.json()
// // // // //             setCameraName(camData.name || `Camera ${cameraId}`)
// // // // //           }
// // // // //         } catch { /* ignore */ }
// // // // //       } catch (err) {
// // // // //         setFrameError(err.message || 'Cannot connect to camera')
// // // // //         setIsCapturing(false)
// // // // //         loadPlaceholder()
// // // // //       }
// // // // //     }
// // // // //     loadFrame()
// // // // //   }, [cameraId, drawBaseImage, loadPlaceholder])

// // // // //   useEffect(() => {
// // // // //     if (frameLoaded) redrawAll(points)
// // // // //   }, [points, frameLoaded, redrawAll])

// // // // //   // ── Canvas click ──────────────────────────────
// // // // //   const handleCanvasClick = (e) => {
// // // // //     if (points.length >= MAX_POINTS) return
// // // // //     const canvas = canvasRef.current
// // // // //     const rect   = canvas.getBoundingClientRect()
// // // // //     const scaleX = canvas.width  / rect.width
// // // // //     const scaleY = canvas.height / rect.height
// // // // //     const x = (e.clientX - rect.left) * scaleX
// // // // //     const y = (e.clientY - rect.top)  * scaleY
// // // // //     setPoints(prev => [...prev, { x, y }])
// // // // //   }

// // // // //   // ── Actions ───────────────────────────────────
// // // // //   const handleReset = () => {
// // // // //     setPoints([])
// // // // //     const canvas = canvasRef.current
// // // // //     if (canvas && baseImageRef.current) {
// // // // //       const ctx = canvas.getContext('2d')
// // // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // // //     }
// // // // //   }

// // // // //   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

// // // // //   const handleSave = async () => {
// // // // //     if (points.length !== MAX_POINTS) return
// // // // //     const normalizedPoints = points.map(p => ({
// // // // //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // // //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // // //     }))
// // // // //     try {
// // // // //       await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
// // // // //       navigate(`/property/${propertyId}/cameras`)
// // // // //     } catch (err) {
// // // // //       alert('Failed to save: ' + (err.response?.data?.detail || err.message))
// // // // //     }
// // // // //   }

// // // // //   const handleSkip = () => navigate(`/property/${propertyId}/cameras`)

// // // // //   const handleRetry = () => {
// // // // //     setPoints([])
// // // // //     setFrameLoaded(false)
// // // // //     setFrameError(null)
// // // // //     setIsCapturing(true)
// // // // //     baseImageRef.current = null
// // // // //     const loadFrame = async () => {
// // // // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // // //       const token  = localStorage.getItem('token')
// // // // //       try {
// // // // //         const response = await fetch(
// // // // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // // //         )
// // // // //         if (!response.ok) throw new Error(`${response.status}`)
// // // // //         const blob    = await response.blob()
// // // // //         const blobUrl = URL.createObjectURL(blob)
// // // // //         const img     = new Image()
// // // // //         img.onload = () => {
// // // // //           baseImageRef.current = img
// // // // //           const canvas = canvasRef.current
// // // // //           if (!canvas) return
// // // // //           const size = drawBaseImage(img, canvas)
// // // // //           if (size) setImageSize(size)
// // // // //           setFrameLoaded(true)
// // // // //           setIsCapturing(false)
// // // // //           URL.revokeObjectURL(blobUrl)
// // // // //         }
// // // // //         img.src = blobUrl
// // // // //       } catch (err) {
// // // // //         setFrameError(err.message)
// // // // //         setIsCapturing(false)
// // // // //         loadPlaceholder()
// // // // //       }
// // // // //     }
// // // // //     loadFrame()
// // // // //   }

// // // // //   const isComplete = points.length === MAX_POINTS

// // // // //   // ── Render ────────────────────────────────────
// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // // //       {/* Header */}
// // // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // // //           <ArrowLeft className="h-6 w-6" />
// // // // //         </button>
// // // // //         <div className="ml-3">
// // // // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// // // // //             Wall Calibration
// // // // //           </h2>
// // // // //           <p className={theme.type.whiteMuted}>{cameraName}</p>
// // // // //         </div>
// // // // //         <div className="ml-auto flex items-center gap-2">
// // // // //           {points.length > 0 && (
// // // // //             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo">
// // // // //               <RotateCcw className="h-5 w-5" />
// // // // //             </button>
// // // // //           )}
// // // // //           <button onClick={() => setShowHelp(!showHelp)} className={theme.button.iconDark}>
// // // // //             <Info className="h-5 w-5" />
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Help banner */}
// // // // //       {showHelp && (
// // // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // // //           <div className="flex items-start gap-3">
// // // // //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// // // // //             <div className="text-sm text-[#c5a880]/90">
// // // // //               <p className="font-bold mb-1">
// // // // //                 Click 4 points to define the wall boundary:
// // // // //               </p>
// // // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// // // // //                 <li>Top-Left corner of wall</li>
// // // // //                 <li>Top-Right corner of wall</li>
// // // // //                 <li>Bottom-Right corner of wall</li>
// // // // //                 <li>Bottom-Left corner of wall</li>
// // // // //               </ol>
// // // // //             </div>
// // // // //             <button
// // // // //               onClick={() => setShowHelp(false)}
// // // // //               className="ml-auto text-[#c5a880] hover:text-white transition-colors"
// // // // //             >
// // // // //               ✕
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Canvas area */}
// // // // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // // // //         {/* Loading */}
// // // // //         {isCapturing && (
// // // // //           <div className="absolute inset-0 flex flex-col items-center
// // // // //                           justify-center bg-[#1c1c1c] z-10">
// // // // //             <div className={theme.ui.spinner} />
// // // // //             <p className={`${theme.type.whiteMuted} mt-4`}>
// // // // //               Connecting to camera...
// // // // //             </p>
// // // // //             <p className="text-gray-600 text-xs mt-1">
// // // // //               Capturing first frame from stream
// // // // //             </p>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Error */}
// // // // //         {frameError && (
// // // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // // //             <div className={theme.alert.error}>
// // // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // // //               <span className="flex-1">{frameError}</span>
// // // // //               <button
// // // // //                 onClick={handleRetry}
// // // // //                 className="text-xs border border-red-300 px-2 py-1
// // // // //                            rounded-full hover:bg-red-100 transition-colors ml-auto"
// // // // //               >
// // // // //                 Retry
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Canvas */}
// // // // //         <canvas
// // // // //           ref={canvasRef}
// // // // //           onClick={handleCanvasClick}
// // // // //           className={`w-full cursor-crosshair transition-opacity duration-300
// // // // //                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // // // //           style={{ display: 'block' }}
// // // // //         />

// // // // //         {/* Point counter */}
// // // // //         {frameLoaded && (
// // // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // // // //                           rounded-[1rem] px-3 py-2">
// // // // //             <div className="flex items-center gap-2">
// // // // //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// // // // //               <span className="text-white font-mono text-sm">
// // // // //                 {points.length}/{MAX_POINTS}
// // // // //               </span>
// // // // //             </div>
// // // // //             <div className="flex gap-1 mt-1">
// // // // //               {[0, 1, 2, 3].map(i => (
// // // // //                 <div
// // // // //                   key={i}
// // // // //                   className={`w-2 h-2 rounded-full
// // // // //                               ${i < points.length
// // // // //                                 ? 'bg-[#c5a880]'
// // // // //                                 : 'bg-white/20'}`}
// // // // //                 />
// // // // //               ))}
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Completion overlay */}
// // // // //         {isComplete && (
// // // // //           <div className="absolute inset-0 bg-black/60 flex items-center
// // // // //                           justify-center z-20">
// // // // //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4
// // // // //                             text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // // //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// // // // //               <h3 className={`${theme.type.h3} mb-2`}>Polygon Complete!</h3>
// // // // //               <p className={`${theme.type.bodySm} mb-5`}>
// // // // //                 Wall boundary defined. Save to enable fence detection.
// // // // //               </p>
// // // // //               <div className="flex gap-3">
// // // // //                 <button onClick={handleReset} className={theme.button.secondary}>
// // // // //                   Redo
// // // // //                 </button>
// // // // //                 <button
// // // // //                   onClick={handleSave}
// // // // //                   disabled={saveMutation.isPending}
// // // // //                   className={`${theme.button.primary} flex-1`}
// // // // //                 >
// // // // //                   {saveMutation.isPending
// // // // //                     ? <Loader2 className="w-4 h-4 animate-spin" />
// // // // //                     : <Save className="w-4 h-4" />}
// // // // //                   Save
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Bottom bar */}
// // // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

// // // // //         <div className="flex items-center justify-between text-sm">
// // // // //           <span className={theme.type.bodySm}>
// // // // //             {points.length === 0 && 'Click on the camera frame to place first point'}
// // // // //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// // // // //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// // // // //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// // // // //             {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
// // // // //           </span>
// // // // //           <span className="font-sans text-sm font-bold text-[#c5a880]">
// // // // //             {Math.round((points.length / MAX_POINTS) * 100)}%
// // // // //           </span>
// // // // //         </div>

// // // // //         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
// // // // //           <div
// // // // //             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
// // // // //             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
// // // // //           />
// // // // //         </div>

// // // // //         <div className="flex gap-3">
// // // // //           <button onClick={handleReset} className={theme.button.secondary}>
// // // // //             Reset
// // // // //           </button>
// // // // //           {existingConfig && (
// // // // //             <button onClick={handleSkip} className={theme.button.secondary}>
// // // // //               Skip
// // // // //             </button>
// // // // //           )}
// // // // //           <button
// // // // //             onClick={handleSave}
// // // // //             disabled={!isComplete || saveMutation.isPending}
// // // // //             className={`${theme.button.primary} flex-1`}
// // // // //           >
// // // // //             {saveMutation.isPending
// // // // //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
// // // // //               : <><Save className="w-5 h-5" /> Save & Enable Detection</>}
// // // // //           </button>
// // // // //         </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default ClimbingCalibration

// // // // // src/pages/ClimbingCalibration.jsx
// // // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// // // //   Loader2, Crosshair, MousePointer, Info
// // // // } from 'lucide-react'
// // // // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // // // import { theme } from '../theme'

// // // // const ClimbingCalibration = () => {
// // // //   const { id: propertyId, cameraId } = useParams()
// // // //   const navigate = useNavigate()

// // // //   const canvasRef    = useRef(null)
// // // //   const containerRef = useRef(null)
// // // //   const baseImageRef = useRef(null)

// // // //   const [points,      setPoints]      = useState([])
// // // //   const [frameLoaded, setFrameLoaded] = useState(false)
// // // //   const [frameError,  setFrameError]  = useState(null)
// // // //   const [isCapturing, setIsCapturing] = useState(true)
// // // //   const [imageSize,   setImageSize]   = useState({ width: 0, height: 0 })
// // // //   const [showHelp,    setShowHelp]    = useState(true)
// // // //   const [cameraName,  setCameraName]  = useState(`Camera ${cameraId}`)

// // // //   const saveMutation             = useSaveFenceConfig()
// // // //   const { data: existingConfig } = useFenceConfig(cameraId)

// // // //   const MAX_POINTS   = 4
// // // //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// // // //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// // // //   // ── Draw helpers ─────────────────────────────────────────────────────────

// // // //   const drawBaseImage = useCallback((img, canvas) => {
// // // //     const ctx            = canvas.getContext('2d')
// // // //     const container      = containerRef.current
// // // //     if (!container) return
// // // //     const containerWidth = container.clientWidth
// // // //     const scale          = containerWidth / img.naturalWidth
// // // //     const height         = img.naturalHeight * scale
// // // //     canvas.width         = containerWidth
// // // //     canvas.height        = height
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
// // // //     ctx.lineWidth   = 1
// // // //     const gridSize  = 40
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
// // // //     ctx.fillText('Click anywhere to define wall polygon points', w / 2, h / 2 + 10)
// // // //     return { width: w, height: h }
// // // //   }, [])

// // // //   const redrawAll = useCallback((currentPoints) => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas || !frameLoaded) return
// // // //     const ctx = canvas.getContext('2d')

// // // //     // Redraw base image
// // // //     if (baseImageRef.current) {
// // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // //     }

// // // //     // Draw polygon lines
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

// // // //     // Draw points
// // // //     currentPoints.forEach((p, i) => {
// // // //       ctx.shadowColor  = POINT_COLORS[i]
// // // //       ctx.shadowBlur   = 10
// // // //       ctx.beginPath()
// // // //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// // // //       ctx.fillStyle = POINT_COLORS[i]
// // // //       ctx.fill()
// // // //       ctx.shadowBlur = 0

// // // //       ctx.beginPath()
// // // //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// // // //       ctx.fillStyle = 'white'
// // // //       ctx.fill()

// // // //       ctx.fillStyle    = POINT_COLORS[i]
// // // //       ctx.font         = 'bold 11px sans-serif'
// // // //       ctx.textAlign    = 'center'
// // // //       ctx.textBaseline = 'middle'
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
// // // //       ctx.fillStyle    = POINT_COLORS[i]
// // // //       ctx.textBaseline = 'middle'
// // // //       ctx.fillText(label, p.x, labelY)
// // // //     })
// // // //   }, [frameLoaded])

// // // //   // ── Load placeholder ──────────────────────────────────────────────────────

// // // //   const loadPlaceholder = useCallback(() => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return
// // // //     const size = drawPlaceholderOnCanvas(canvas)
// // // //     if (size) setImageSize(size)
// // // //     setFrameLoaded(true)
// // // //     const img  = new Image()
// // // //     img.src    = canvas.toDataURL()
// // // //     img.onload = () => { baseImageRef.current = img }
// // // //   }, [drawPlaceholderOnCanvas])

// // // //   // ── Load frame ────────────────────────────────────────────────────────────

// // // //   useEffect(() => {
// // // //     const loadFrame = async () => {
// // // //       setIsCapturing(true)
// // // //       setFrameError(null)
// // // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // //       const token  = localStorage.getItem('token')

// // // //       try {
// // // //         const response = await fetch(
// // // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         )
// // // //         if (!response.ok) throw new Error(`Camera error: ${response.status}`)

// // // //         const blob    = await response.blob()
// // // //         const blobUrl = URL.createObjectURL(blob)
// // // //         const img     = new Image()

// // // //         img.onload = () => {
// // // //           baseImageRef.current = img
// // // //           const canvas = canvasRef.current
// // // //           if (!canvas) return
// // // //           const size = drawBaseImage(img, canvas)
// // // //           if (size) setImageSize(size)
// // // //           setFrameLoaded(true)
// // // //           setIsCapturing(false)
// // // //           URL.revokeObjectURL(blobUrl)
// // // //         }

// // // //         img.onerror = () => {
// // // //           setFrameError('Failed to load camera frame image')
// // // //           setIsCapturing(false)
// // // //           loadPlaceholder()
// // // //           URL.revokeObjectURL(blobUrl)
// // // //         }

// // // //         img.src = blobUrl

// // // //         // Fetch camera name
// // // //         try {
// // // //           const camRes = await fetch(
// // // //             `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // // //             { headers: { Authorization: `Bearer ${token}` } }
// // // //           )
// // // //           if (camRes.ok) {
// // // //             const camData = await camRes.json()
// // // //             setCameraName(camData.name || `Camera ${cameraId}`)
// // // //           }
// // // //         } catch { /* ignore */ }

// // // //       } catch (err) {
// // // //         setFrameError(err.message || 'Cannot connect to camera')
// // // //         setIsCapturing(false)
// // // //         loadPlaceholder()
// // // //       }
// // // //     }

// // // //     loadFrame()
// // // //   }, [cameraId, drawBaseImage, loadPlaceholder])

// // // //   // Redraw whenever points change
// // // //   useEffect(() => {
// // // //     if (frameLoaded) redrawAll(points)
// // // //   }, [points, frameLoaded, redrawAll])

// // // //   // ── Canvas click ──────────────────────────────────────────────────────────

// // // //   const handleCanvasClick = (e) => {
// // // //     if (points.length >= MAX_POINTS) return
// // // //     const canvas = canvasRef.current
// // // //     const rect   = canvas.getBoundingClientRect()
// // // //     const scaleX = canvas.width  / rect.width
// // // //     const scaleY = canvas.height / rect.height
// // // //     const x      = (e.clientX - rect.left) * scaleX
// // // //     const y      = (e.clientY - rect.top)  * scaleY
// // // //     setPoints(prev => [...prev, { x, y }])
// // // //   }

// // // //   // ── Actions ───────────────────────────────────────────────────────────────

// // // //   const handleReset = () => {
// // // //     setPoints([])
// // // //     const canvas = canvasRef.current
// // // //     if (canvas && baseImageRef.current) {
// // // //       const ctx = canvas.getContext('2d')
// // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // // //     }
// // // //   }

// // // //   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

// // // //   // ── UPDATED: Navigate to cell editor after save ───────────────────────────

// // // //   const handleSave = async () => {
// // // //     if (points.length !== MAX_POINTS) return

// // // //     const normalizedPoints = points.map(p => ({
// // // //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // //     }))

// // // //     try {
// // // //       await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })

// // // //       // Navigate to cell editor so user can define named fence cells
// // // //       navigate(`/property/${propertyId}/camera/${cameraId}/cells`)

// // // //     } catch (err) {
// // // //       alert('Failed to save: ' + (err.response?.data?.detail || err.message))
// // // //     }
// // // //   }

// // // //   const handleSkip = () => navigate(`/property/${propertyId}/cameras`)

// // // //   const handleRetry = () => {
// // // //     setPoints([])
// // // //     setFrameLoaded(false)
// // // //     setFrameError(null)
// // // //     setIsCapturing(true)
// // // //     baseImageRef.current = null

// // // //     const loadFrame = async () => {
// // // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // // //       const token  = localStorage.getItem('token')
// // // //       try {
// // // //         const response = await fetch(
// // // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         )
// // // //         if (!response.ok) throw new Error(`${response.status}`)
// // // //         const blob    = await response.blob()
// // // //         const blobUrl = URL.createObjectURL(blob)
// // // //         const img     = new Image()
// // // //         img.onload = () => {
// // // //           baseImageRef.current = img
// // // //           const canvas = canvasRef.current
// // // //           if (!canvas) return
// // // //           const size = drawBaseImage(img, canvas)
// // // //           if (size) setImageSize(size)
// // // //           setFrameLoaded(true)
// // // //           setIsCapturing(false)
// // // //           URL.revokeObjectURL(blobUrl)
// // // //         }
// // // //         img.src = blobUrl
// // // //       } catch (err) {
// // // //         setFrameError(err.message)
// // // //         setIsCapturing(false)
// // // //         loadPlaceholder()
// // // //       }
// // // //     }

// // // //     loadFrame()
// // // //   }

// // // //   const isComplete = points.length === MAX_POINTS

// // // //   // ── Render ────────────────────────────────────────────────────────────────

// // // //   return (
// // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // //       {/* ── Header ── */}
// // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // //         <button
// // // //           onClick={() => navigate(-1)}
// // // //           className={theme.button.iconDark}
// // // //         >
// // // //           <ArrowLeft className="h-6 w-6" />
// // // //         </button>

// // // //         <div className="ml-3 flex-1 min-w-0">
// // // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// // // //             Wall Calibration
// // // //           </h2>
// // // //           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
// // // //         </div>

// // // //         <div className="ml-auto flex items-center gap-2">
// // // //           {points.length > 0 && (
// // // //             <button
// // // //               onClick={handleUndo}
// // // //               className={theme.button.iconDark}
// // // //               title="Undo last point"
// // // //             >
// // // //               <RotateCcw className="h-5 w-5" />
// // // //             </button>
// // // //           )}
// // // //           <button
// // // //             onClick={() => setShowHelp(!showHelp)}
// // // //             className={theme.button.iconDark}
// // // //           >
// // // //             <Info className="h-5 w-5" />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Step indicator ── */}
// // // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // // //         <div className="flex items-center gap-2">
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// // // //                             justify-center text-[#1c1c1c] text-xs font-bold">
// // // //               1
// // // //             </div>
// // // //             <span className="text-[#c5a880] text-xs font-bold">
// // // //               Draw Polygon
// // // //             </span>
// // // //           </div>
// // // //           <div className="flex-1 h-px bg-white/10" />
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// // // //                             justify-center text-white/40 text-xs font-bold">
// // // //               2
// // // //             </div>
// // // //             <span className="text-white/40 text-xs font-bold">
// // // //               Define Cells
// // // //             </span>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Help banner ── */}
// // // //       {showHelp && (
// // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // //           <div className="flex items-start gap-3">
// // // //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// // // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // // //               <p className="font-bold mb-1">
// // // //                 Step 1 — Click 4 points to define the fence boundary:
// // // //               </p>
// // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// // // //                 <li>Top-Left corner of fence</li>
// // // //                 <li>Top-Right corner of fence</li>
// // // //                 <li>Bottom-Right corner of fence</li>
// // // //                 <li>Bottom-Left corner of fence</li>
// // // //               </ol>
// // // //               <p className="text-[#c5a880]/50 text-xs mt-2">
// // // //                 After saving, you'll define named sections (cells) inside the fence.
// // // //               </p>
// // // //             </div>
// // // //             <button
// // // //               onClick={() => setShowHelp(false)}
// // // //               className="text-[#c5a880] hover:text-white transition-colors"
// // // //             >
// // // //               ✕
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ── Canvas area ── */}
// // // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // // //         {/* Loading overlay */}
// // // //         {isCapturing && (
// // // //           <div className="absolute inset-0 flex flex-col items-center
// // // //                           justify-center bg-[#1c1c1c] z-10">
// // // //             <div className={theme.ui.spinner} />
// // // //             <p className={`${theme.type.whiteMuted} mt-4`}>
// // // //               Connecting to camera...
// // // //             </p>
// // // //             <p className="text-gray-600 text-xs mt-1">
// // // //               Capturing first frame from stream
// // // //             </p>
// // // //           </div>
// // // //         )}

// // // //         {/* Error banner */}
// // // //         {frameError && (
// // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // //             <div className={theme.alert.error}>
// // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // //               <span className="flex-1 text-sm">{frameError}</span>
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

// // // //         {/* Point counter badge */}
// // // //         {frameLoaded && (
// // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // // //                           rounded-[1rem] px-3 py-2">
// // // //             <div className="flex items-center gap-2">
// // // //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// // // //               <span className="text-white font-mono text-sm font-bold">
// // // //                 {points.length}/{MAX_POINTS}
// // // //               </span>
// // // //             </div>
// // // //             <div className="flex gap-1 mt-1">
// // // //               {[0, 1, 2, 3].map(i => (
// // // //                 <div
// // // //                   key={i}
// // // //                   style={{ backgroundColor: i < points.length ? POINT_COLORS[i] : undefined }}
// // // //                   className={`w-2 h-2 rounded-full transition-all
// // // //                               ${i < points.length ? '' : 'bg-white/20'}`}
// // // //                 />
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Completion overlay */}
// // // //         {isComplete && (
// // // //           <div className="absolute inset-0 bg-black/60 flex items-center
// // // //                           justify-center z-20">
// // // //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4
// // // //                             text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// // // //               <h3 className={`${theme.type.h3} mb-1`}>
// // // //                 Polygon Complete!
// // // //               </h3>
// // // //               <p className={`${theme.type.bodySm} mb-1`}>
// // // //                 Fence boundary defined.
// // // //               </p>
// // // //               <p className="text-xs text-[#c5a880] font-semibold mb-5">
// // // //                 Next: You'll name the sections (cells) inside this fence.
// // // //               </p>
// // // //               <div className="flex gap-3">
// // // //                 <button
// // // //                   onClick={handleReset}
// // // //                   className={theme.button.secondary}
// // // //                 >
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
// // // //                   {saveMutation.isPending ? 'Saving...' : 'Save & Define Cells'}
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ── Bottom bar ── */}
// // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4
// // // //                       space-y-3 rounded-t-[2rem]">

// // // //         {/* Status text + progress % */}
// // // //         <div className="flex items-center justify-between text-sm">
// // // //           <span className={theme.type.bodySm}>
// // // //             {points.length === 0 && 'Click on the camera frame to place first point'}
// // // //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// // // //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// // // //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// // // //             {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
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
// // // //           <button
// // // //             onClick={handleReset}
// // // //             className={theme.button.secondary}
// // // //           >
// // // //             Reset
// // // //           </button>

// // // //           {existingConfig && (
// // // //             <button
// // // //               onClick={handleSkip}
// // // //               className={theme.button.secondary}
// // // //             >
// // // //               Skip
// // // //             </button>
// // // //           )}

// // // //           <button
// // // //             onClick={handleSave}
// // // //             disabled={!isComplete || saveMutation.isPending}
// // // //             className={`${theme.button.primary} flex-1`}
// // // //           >
// // // //             {saveMutation.isPending
// // // //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
// // // //               : <><Save className="w-5 h-5" /> Save & Define Cells</>}
// // // //           </button>
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default ClimbingCalibration

// // // // src/pages/ClimbingCalibration.jsx
// // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// // //   Loader2, Crosshair, MousePointer, Info
// // // } from 'lucide-react'
// // // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // // import { theme } from '../theme'

// // // const ClimbingCalibration = () => {
// // //   const { id: propertyId, cameraId } = useParams()
// // //   const navigate = useNavigate()

// // //   // cameraId === 'new' means we came from AddCamera without saving yet
// // //   const isNew = cameraId === 'new'

// // //   const canvasRef    = useRef(null)
// // //   const containerRef = useRef(null)
// // //   const baseImageRef = useRef(null)

// // //   const [points,      setPoints]      = useState([])
// // //   const [frameLoaded, setFrameLoaded] = useState(false)
// // //   const [frameError,  setFrameError]  = useState(null)
// // //   const [isCapturing, setIsCapturing] = useState(true)
// // //   const [imageSize,   setImageSize]   = useState({ width: 0, height: 0 })
// // //   const [showHelp,    setShowHelp]    = useState(true)
// // //   const [cameraName,  setCameraName]  = useState(
// // //     isNew
// // //       ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}').name || 'New Camera'
// // //       : `Camera ${cameraId}`
// // //   )
// // //   const [isSaving,    setIsSaving]    = useState(false)

// // //   const saveMutation             = useSaveFenceConfig()
// // //   const { data: existingConfig } = useFenceConfig(isNew ? null : cameraId)

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
// // //     ctx.fillText('Click anywhere to define wall polygon points', w / 2, h / 2 + 10)
// // //     return { width: w, height: h }
// // //   }, [])

// // //   const redrawAll = useCallback((currentPoints) => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas || !frameLoaded) return
// // //     const ctx = canvas.getContext('2d')

// // //     if (baseImageRef.current) {
// // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// // //     }

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

// // //   // ── Load placeholder ──────────────────────────────────────────────────────

// // //   const loadPlaceholder = useCallback(() => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const size = drawPlaceholderOnCanvas(canvas)
// // //     if (size) setImageSize(size)
// // //     setFrameLoaded(true)
// // //     setIsCapturing(false)
// // //     const img  = new Image()
// // //     img.src    = canvas.toDataURL()
// // //     img.onload = () => { baseImageRef.current = img }
// // //   }, [drawPlaceholderOnCanvas])

// // //   // ── Load frame ────────────────────────────────────────────────────────────

// // //   useEffect(() => {
// // //     // For new cameras there's no stream yet — just show placeholder
// // //     if (isNew) {
// // //       loadPlaceholder()
// // //       return
// // //     }

// // //     const loadFrame = async () => {
// // //       setIsCapturing(true)
// // //       setFrameError(null)
// // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // //       const token  = localStorage.getItem('token')

// // //       try {
// // //         const response = await fetch(
// // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // //           { headers: { Authorization: `Bearer ${token}` } }
// // //         )
// // //         if (!response.ok) throw new Error(`Camera error: ${response.status}`)

// // //         const blob    = await response.blob()
// // //         const blobUrl = URL.createObjectURL(blob)
// // //         const img     = new Image()

// // //         img.onload = () => {
// // //           baseImageRef.current = img
// // //           const canvas = canvasRef.current
// // //           if (!canvas) return
// // //           const size = drawBaseImage(img, canvas)
// // //           if (size) setImageSize(size)
// // //           setFrameLoaded(true)
// // //           setIsCapturing(false)
// // //           URL.revokeObjectURL(blobUrl)
// // //         }

// // //         img.onerror = () => {
// // //           setFrameError('Failed to load camera frame image')
// // //           setIsCapturing(false)
// // //           loadPlaceholder()
// // //           URL.revokeObjectURL(blobUrl)
// // //         }

// // //         img.src = blobUrl

// // //         try {
// // //           const camRes = await fetch(
// // //             `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // //             { headers: { Authorization: `Bearer ${token}` } }
// // //           )
// // //           if (camRes.ok) {
// // //             const camData = await camRes.json()
// // //             setCameraName(camData.name || `Camera ${cameraId}`)
// // //           }
// // //         } catch { /* ignore */ }

// // //       } catch (err) {
// // //         setFrameError(err.message || 'Cannot connect to camera')
// // //         setIsCapturing(false)
// // //         loadPlaceholder()
// // //       }
// // //     }

// // //     loadFrame()
// // //   }, [cameraId, isNew, drawBaseImage, loadPlaceholder])

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

// // //   const handleSave = async () => {
// // //     if (points.length !== MAX_POINTS) return

// // //     const normalizedPoints = points.map(p => ({
// // //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // //     }))

// // //     if (isNew) {
// // //       // Don't hit the API — store polygon in sessionStorage and proceed
// // //       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // //       pending.polygonPoints = normalizedPoints
// // //       sessionStorage.setItem('pendingCamera', JSON.stringify(pending))
// // //       navigate(`/property/${propertyId}/camera/new/cells`)
// // //     } else {
// // //       // Existing camera — save polygon to API as before
// // //       setIsSaving(true)
// // //       try {
// // //         await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
// // //         navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
// // //       } catch (err) {
// // //         alert('Failed to save: ' + (err.response?.data?.detail || err.message))
// // //       } finally {
// // //         setIsSaving(false)
// // //       }
// // //     }
// // //   }

// // //   const handleSkip = () => navigate(`/property/${propertyId}/cameras`)

// // //   const handleRetry = () => {
// // //     setPoints([])
// // //     setFrameLoaded(false)
// // //     setFrameError(null)
// // //     setIsCapturing(true)
// // //     baseImageRef.current = null

// // //     const loadFrame = async () => {
// // //       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// // //       const token  = localStorage.getItem('token')
// // //       try {
// // //         const response = await fetch(
// // //           `${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`,
// // //           { headers: { Authorization: `Bearer ${token}` } }
// // //         )
// // //         if (!response.ok) throw new Error(`${response.status}`)
// // //         const blob    = await response.blob()
// // //         const blobUrl = URL.createObjectURL(blob)
// // //         const img     = new Image()
// // //         img.onload = () => {
// // //           baseImageRef.current = img
// // //           const canvas = canvasRef.current
// // //           if (!canvas) return
// // //           const size = drawBaseImage(img, canvas)
// // //           if (size) setImageSize(size)
// // //           setFrameLoaded(true)
// // //           setIsCapturing(false)
// // //           URL.revokeObjectURL(blobUrl)
// // //         }
// // //         img.src = blobUrl
// // //       } catch (err) {
// // //         setFrameError(err.message)
// // //         setIsCapturing(false)
// // //         loadPlaceholder()
// // //       }
// // //     }

// // //     loadFrame()
// // //   }

// // //   const isComplete  = points.length === MAX_POINTS
// // //   const savePending = isSaving || saveMutation.isPending

// // //   // ── Render ────────────────────────────────────────────────────────────────

// // //   return (
// // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // //       {/* Header */}
// // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // //           <ArrowLeft className="h-6 w-6" />
// // //         </button>
// // //         <div className="ml-3 flex-1 min-w-0">
// // //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// // //             Wall Calibration
// // //           </h2>
// // //           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
// // //         </div>
// // //         <div className="ml-auto flex items-center gap-2">
// // //           {points.length > 0 && (
// // //             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
// // //               <RotateCcw className="h-5 w-5" />
// // //             </button>
// // //           )}
// // //           <button onClick={() => setShowHelp(!showHelp)} className={theme.button.iconDark}>
// // //             <Info className="h-5 w-5" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Step indicator */}
// // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // //         <div className="flex items-center gap-2">
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
// // //               1
// // //             </div>
// // //             <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
// // //           </div>
// // //           <div className="flex-1 h-px bg-white/10" />
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
// // //               2
// // //             </div>
// // //             <span className="text-white/40 text-xs font-bold">Define Cells</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Help banner */}
// // //       {showHelp && (
// // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // //           <div className="flex items-start gap-3">
// // //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // //               <p className="font-bold mb-1">Step 1 — Click 4 points to define the fence boundary:</p>
// // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// // //                 <li>Top-Left corner of fence</li>
// // //                 <li>Top-Right corner of fence</li>
// // //                 <li>Bottom-Right corner of fence</li>
// // //                 <li>Bottom-Left corner of fence</li>
// // //               </ol>
// // //               <p className="text-[#c5a880]/50 text-xs mt-2">
// // //                 {isNew
// // //                   ? 'Camera will be saved only after you complete all steps including cell definition.'
// // //                   : "After saving, you'll define named sections (cells) inside the fence."}
// // //               </p>
// // //             </div>
// // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white transition-colors">
// // //               ✕
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Canvas area */}
// // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // //         {isCapturing && (
// // //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10">
// // //             <div className={theme.ui.spinner} />
// // //             <p className={`${theme.type.whiteMuted} mt-4`}>Connecting to camera...</p>
// // //             <p className="text-gray-600 text-xs mt-1">Capturing first frame from stream</p>
// // //           </div>
// // //         )}

// // //         {frameError && (
// // //           <div className="absolute top-4 left-4 right-4 z-10">
// // //             <div className={theme.alert.error}>
// // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // //               <span className="flex-1 text-sm">{frameError}</span>
// // //               <button
// // //                 onClick={handleRetry}
// // //                 className="text-xs border border-red-300 px-2 py-1 rounded-full hover:bg-red-100 transition-colors ml-auto"
// // //               >
// // //                 Retry
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <canvas
// // //           ref={canvasRef}
// // //           onClick={handleCanvasClick}
// // //           className={`w-full cursor-crosshair transition-opacity duration-300 ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // //           style={{ display: 'block' }}
// // //         />

// // //         {frameLoaded && (
// // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-[1rem] px-3 py-2">
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
// // //                   style={{ backgroundColor: i < points.length ? POINT_COLORS[i] : undefined }}
// // //                   className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
// // //                 />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Completion overlay */}
// // //         {isComplete && (
// // //           <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
// // //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// // //               <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
// // //               <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
// // //               <p className="text-xs text-[#c5a880] font-semibold mb-5">
// // //                 Next: You'll name the sections (cells) inside this fence.
// // //               </p>
// // //               <div className="flex gap-3">
// // //                 <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
// // //                 <button
// // //                   onClick={handleSave}
// // //                   disabled={savePending}
// // //                   className={`${theme.button.primary} flex-1`}
// // //                 >
// // //                   {savePending
// // //                     ? <Loader2 className="w-4 h-4 animate-spin" />
// // //                     : <Save className="w-4 h-4" />}
// // //                   {savePending ? 'Saving...' : 'Save & Define Cells'}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Bottom bar */}
// // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">
// // //         <div className="flex items-center justify-between text-sm">
// // //           <span className={theme.type.bodySm}>
// // //             {points.length === 0 && 'Click on the camera frame to place first point'}
// // //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// // //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// // //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// // //             {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
// // //           </span>
// // //           <span className="font-sans text-sm font-bold text-[#c5a880]">
// // //             {Math.round((points.length / MAX_POINTS) * 100)}%
// // //           </span>
// // //         </div>

// // //         <div className="h-1.5 bg-[#e6e3db] rounded-full overflow-hidden">
// // //           <div
// // //             className="h-full bg-[#c5a880] transition-all duration-300 rounded-full"
// // //             style={{ width: `${(points.length / MAX_POINTS) * 100}%` }}
// // //           />
// // //         </div>

// // //         <div className="flex gap-3">
// // //           <button onClick={handleReset} className={theme.button.secondary}>Reset</button>

// // //           {!isNew && existingConfig && (
// // //             <button onClick={handleSkip} className={theme.button.secondary}>Skip</button>
// // //           )}

// // //           <button
// // //             onClick={handleSave}
// // //             disabled={!isComplete || savePending}
// // //             className={`${theme.button.primary} flex-1`}
// // //           >
// // //             {savePending
// // //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
// // //               : <><Save className="w-5 h-5" /> Save & Define Cells</>}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default ClimbingCalibration

// // // src/pages/ClimbingCalibration.jsx
// // import { useState, useRef, useEffect, useCallback } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
// //   Loader2, Crosshair, MousePointer, Info, WifiOff
// // } from 'lucide-react'
// // import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// // import { theme } from '../theme'

// // const ClimbingCalibration = () => {
// //   const { id: propertyId, cameraId } = useParams()
// //   const navigate = useNavigate()

// //   const isNew = cameraId === 'new'

// //   const canvasRef    = useRef(null)
// //   const containerRef = useRef(null)
// //   const baseImageRef = useRef(null)

// //   const [points,        setPoints]        = useState([])
// //   const [frameLoaded,   setFrameLoaded]   = useState(false)
// //   const [frameError,    setFrameError]    = useState(null)
// //   const [isCapturing,   setIsCapturing]   = useState(true)
// //   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 })
// //   const [showHelp,      setShowHelp]      = useState(true)
// //   const [isSaving,      setIsSaving]      = useState(false)
// //   const [usingFallback, setUsingFallback] = useState(false)

// //   const pendingCamera = isNew
// //     ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// //     : null

// //   const [cameraName] = useState(
// //     isNew
// //       ? pendingCamera?.name || 'New Camera'
// //       : `Camera ${cameraId}`
// //   )

// //   const saveMutation             = useSaveFenceConfig()
// //   const { data: existingConfig } = useFenceConfig(isNew ? null : cameraId)

// //   const MAX_POINTS   = 4
// //   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
// //   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// //   // ── Draw placeholder background (used when no real frame) ─────────────────

// //   const drawPlaceholder = useCallback((canvas, message = 'Camera Frame Placeholder') => {
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
// //     ctx.fillText(`📷 ${message}`, w / 2, h / 2 - 16)
// //     ctx.fillStyle = '#6b7280'
// //     ctx.font      = '13px sans-serif'
// //     ctx.fillText('Click anywhere to define polygon points', w / 2, h / 2 + 16)
// //   }, [])

// //   // ── Redraw everything on canvas ───────────────────────────────────────────

// //   const redrawAll = useCallback((currentPoints) => {
// //     const canvas = canvasRef.current
// //     if (!canvas || !frameLoaded) return
// //     const ctx = canvas.getContext('2d')

// //     // Base: real frame or placeholder grid
// //     if (baseImageRef.current) {
// //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
// //     } else {
// //       drawPlaceholder(canvas, usingFallback ? 'Stream unavailable — using placeholder' : 'Camera Frame Placeholder')
// //     }

// //     // Polygon lines
// //     if (currentPoints.length > 1) {
// //       ctx.strokeStyle = '#c5a880'
// //       ctx.lineWidth   = 3
// //       ctx.setLineDash([8, 4])
// //       ctx.beginPath()
// //       ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
// //       for (let i = 1; i < currentPoints.length; i++) {
// //         ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
// //       }
// //       if (currentPoints.length === MAX_POINTS) {
// //         ctx.closePath()
// //         ctx.fillStyle = 'rgba(197,168,128,0.15)'
// //         ctx.fill()
// //       }
// //       ctx.stroke()
// //       ctx.setLineDash([])
// //     }

// //     // Points
// //     currentPoints.forEach((p, i) => {
// //       ctx.shadowColor  = POINT_COLORS[i]
// //       ctx.shadowBlur   = 10
// //       ctx.beginPath()
// //       ctx.arc(p.x, p.y, 14, 0, Math.PI * 2)
// //       ctx.fillStyle = POINT_COLORS[i]
// //       ctx.fill()
// //       ctx.shadowBlur = 0

// //       ctx.beginPath()
// //       ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
// //       ctx.fillStyle = 'white'
// //       ctx.fill()

// //       ctx.fillStyle    = POINT_COLORS[i]
// //       ctx.font         = 'bold 11px sans-serif'
// //       ctx.textAlign    = 'center'
// //       ctx.textBaseline = 'middle'
// //       ctx.fillText((i + 1).toString(), p.x, p.y)

// //       const label      = POINT_LABELS[i]
// //       ctx.font         = 'bold 12px sans-serif'
// //       const labelWidth = ctx.measureText(label).width + 10
// //       const labelX     = p.x - labelWidth / 2
// //       const labelY     = p.y - 30
// //       ctx.fillStyle    = 'rgba(0,0,0,0.8)'
// //       ctx.beginPath()
// //       ctx.roundRect(labelX, labelY - 10, labelWidth, 20, 4)
// //       ctx.fill()
// //       ctx.fillStyle    = POINT_COLORS[i]
// //       ctx.textBaseline = 'middle'
// //       ctx.fillText(label, p.x, labelY)
// //     })
// //   }, [frameLoaded, drawPlaceholder, usingFallback])

// //   // ── Setup canvas size from container ──────────────────────────────────────

// //   const setupCanvas = useCallback((img = null) => {
// //     const canvas    = canvasRef.current
// //     const container = containerRef.current
// //     if (!canvas || !container) return null

// //     if (img) {
// //       const w     = container.clientWidth
// //       const scale = w / img.naturalWidth
// //       const h     = img.naturalHeight * scale
// //       canvas.width  = w
// //       canvas.height = h
// //       return { width: w, height: h }
// //     } else {
// //       const w = container.clientWidth
// //       const h = w * 0.5625           // 16:9 fallback
// //       canvas.width  = w
// //       canvas.height = h
// //       return { width: w, height: h }
// //     }
// //   }, [])

// //   // ── Load real frame from RTSP URL (Option B endpoint) ────────────────────

// //   const loadFrameFromRTSP = useCallback(async (rtspUrl) => {
// //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// //     const token  = localStorage.getItem('token')

// //     const response = await fetch(`${apiUrl}/api/v1/stream/preview-frame`, {
// //       method:  'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         Authorization:  `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({ rtsp_url: rtspUrl }),
// //     })

// //     if (!response.ok) {
// //       const err = await response.json().catch(() => ({}))
// //       throw new Error(err.detail || `Stream error: ${response.status}`)
// //     }

// //     return response.blob()
// //   }, [])

// //   // ── Load frame from existing camera ID ────────────────────────────────────

// //   const loadFrameFromCameraId = useCallback(async (id) => {
// //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// //     const token  = localStorage.getItem('token')

// //     const response = await fetch(
// //       `${apiUrl}/api/v1/stream/${id}/frame?t=${Date.now()}`,
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     )

// //     if (!response.ok) throw new Error(`Camera error: ${response.status}`)
// //     return response.blob()
// //   }, [])

// //   // ── Load placeholder as final fallback ────────────────────────────────────

// //   const loadPlaceholder = useCallback(() => {
// //     const canvas = canvasRef.current
// //     if (!canvas) return
// //     const size = setupCanvas()
// //     if (!size) return
// //     baseImageRef.current = null
// //     setUsingFallback(true)
// //     drawPlaceholder(canvas)
// //     setImageSize(size)
// //     setFrameLoaded(true)
// //     setIsCapturing(false)
// //   }, [setupCanvas, drawPlaceholder])

// //   // ── Paint a loaded blob onto the canvas ──────────────────────────────────

// //   const paintBlob = useCallback((blob) => {
// //     return new Promise((resolve, reject) => {
// //       const blobUrl = URL.createObjectURL(blob)
// //       const img     = new Image()
// //       img.onload = () => {
// //         const canvas = canvasRef.current
// //         if (!canvas) { URL.revokeObjectURL(blobUrl); reject(new Error('No canvas')); return }
// //         const size = setupCanvas(img)
// //         if (!size) { URL.revokeObjectURL(blobUrl); reject(new Error('No container')); return }
// //         const ctx = canvas.getContext('2d')
// //         ctx.drawImage(img, 0, 0, size.width, size.height)
// //         baseImageRef.current = img
// //         setImageSize(size)
// //         setFrameLoaded(true)
// //         setIsCapturing(false)
// //         URL.revokeObjectURL(blobUrl)
// //         resolve(size)
// //       }
// //       img.onerror = () => {
// //         URL.revokeObjectURL(blobUrl)
// //         reject(new Error('Failed to decode image'))
// //       }
// //       img.src = blobUrl
// //     })
// //   }, [setupCanvas])

// //   // ── Main frame loading effect ─────────────────────────────────────────────

// //   useEffect(() => {
// //     let cancelled = false

// //     const load = async () => {
// //       setIsCapturing(true)
// //       setFrameError(null)
// //       setUsingFallback(false)

// //       // Small delay so containerRef has its rendered width
// //       await new Promise(r => setTimeout(r, 50))
// //       if (cancelled) return

// //       try {
// //         let blob

// //         if (isNew) {
// //           // Option B: fetch real frame using the RTSP URL stored in sessionStorage
// //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// //           if (!pending.rtsp_url) {
// //             throw new Error('No RTSP URL found — please go back and re-enter camera details.')
// //           }
// //           blob = await loadFrameFromRTSP(pending.rtsp_url)
// //         } else {
// //           // Existing camera: fetch by camera ID as before
// //           blob = await loadFrameFromCameraId(cameraId)

// //           // Also fetch camera name
// //           try {
// //             const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// //             const token  = localStorage.getItem('token')
// //             const camRes = await fetch(
// //               `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// //               { headers: { Authorization: `Bearer ${token}` } }
// //             )
// //             // name is set in useState initializer for existing cameras
// //           } catch { /* ignore */ }
// //         }

// //         if (cancelled) return
// //         await paintBlob(blob)

// //       } catch (err) {
// //         if (cancelled) return
// //         console.warn('Frame load failed:', err.message)
// //         setFrameError(err.message)
// //         loadPlaceholder()
// //       }
// //     }

// //     load()
// //     return () => { cancelled = true }
// //   }, [cameraId, isNew, loadFrameFromRTSP, loadFrameFromCameraId, paintBlob, loadPlaceholder])

// //   // Redraw whenever points change
// //   useEffect(() => {
// //     if (frameLoaded) redrawAll(points)
// //   }, [points, frameLoaded, redrawAll])

// //   // ── Canvas click ──────────────────────────────────────────────────────────

// //   const handleCanvasClick = (e) => {
// //     if (points.length >= MAX_POINTS) return
// //     const canvas = canvasRef.current
// //     const rect   = canvas.getBoundingClientRect()
// //     const scaleX = canvas.width  / rect.width
// //     const scaleY = canvas.height / rect.height
// //     const x      = (e.clientX - rect.left) * scaleX
// //     const y      = (e.clientY - rect.top)  * scaleY
// //     setPoints(prev => [...prev, { x, y }])
// //   }

// //   // ── Actions ───────────────────────────────────────────────────────────────

// //   const handleReset = () => {
// //     setPoints([])
// //     if (frameLoaded) redrawAll([])
// //   }

// //   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

// //   const handleRetry = () => {
// //     setPoints([])
// //     setFrameLoaded(false)
// //     setFrameError(null)
// //     baseImageRef.current = null
// //     // Re-trigger the effect by toggling — easiest is a page reload of the effect
// //     // We do this by calling load directly
// //     const load = async () => {
// //       setIsCapturing(true)
// //       await new Promise(r => setTimeout(r, 50))
// //       try {
// //         let blob
// //         if (isNew) {
// //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// //           blob = await loadFrameFromRTSP(pending.rtsp_url)
// //         } else {
// //           blob = await loadFrameFromCameraId(cameraId)
// //         }
// //         await paintBlob(blob)
// //         setFrameError(null)
// //         setUsingFallback(false)
// //       } catch (err) {
// //         setFrameError(err.message)
// //         loadPlaceholder()
// //       }
// //     }
// //     load()
// //   }

// //   const handleSave = async () => {
// //     if (points.length !== MAX_POINTS) return

// //     const normalizedPoints = points.map(p => ({
// //       x: parseFloat((p.x / imageSize.width).toFixed(6)),
// //       y: parseFloat((p.y / imageSize.height).toFixed(6)),
// //     }))

// //     if (isNew) {
// //       // Store polygon in sessionStorage, navigate to cells — don't hit API yet
// //       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// //       pending.polygonPoints = normalizedPoints
// //       sessionStorage.setItem('pendingCamera', JSON.stringify(pending))
// //       navigate(`/property/${propertyId}/camera/new/cells`)
// //     } else {
// //       setIsSaving(true)
// //       try {
// //         await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
// //         navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
// //       } catch (err) {
// //         alert('Failed to save: ' + (err.response?.data?.detail || err.message))
// //       } finally {
// //         setIsSaving(false)
// //       }
// //     }
// //   }

// //   const handleSkip = () => navigate(`/property/${propertyId}/cameras`)

// //   const isComplete  = points.length === MAX_POINTS
// //   const savePending = isSaving || saveMutation.isPending

// //   // ── Render ────────────────────────────────────────────────────────────────

// //   return (
// //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// //       {/* Header */}
// //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// //           <ArrowLeft className="h-6 w-6" />
// //         </button>
// //         <div className="ml-3 flex-1 min-w-0">
// //           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
// //             Wall Calibration
// //           </h2>
// //           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
// //         </div>
// //         <div className="ml-auto flex items-center gap-2">
// //           {points.length > 0 && (
// //             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
// //               <RotateCcw className="h-5 w-5" />
// //             </button>
// //           )}
// //           <button onClick={() => setShowHelp(!showHelp)} className={theme.button.iconDark}>
// //             <Info className="h-5 w-5" />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Step indicator */}
// //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// //         <div className="flex items-center gap-2">
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
// //               1
// //             </div>
// //             <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
// //           </div>
// //           <div className="flex-1 h-px bg-white/10" />
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
// //               2
// //             </div>
// //             <span className="text-white/40 text-xs font-bold">Define Cells</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Help banner */}
// //       {showHelp && (
// //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// //           <div className="flex items-start gap-3">
// //             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
// //             <div className="text-sm text-[#c5a880]/90 flex-1">
// //               <p className="font-bold mb-1">Step 1 — Click 4 points to define the fence boundary:</p>
// //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
// //                 <li>Top-Left corner of fence</li>
// //                 <li>Top-Right corner of fence</li>
// //                 <li>Bottom-Right corner of fence</li>
// //                 <li>Bottom-Left corner of fence</li>
// //               </ol>
// //               <p className="text-[#c5a880]/50 text-xs mt-2">
// //                 {isNew
// //                   ? 'Camera is saved only after all steps are complete.'
// //                   : "After saving, you'll define named sections (cells) inside the fence."}
// //               </p>
// //             </div>
// //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Stream fallback warning */}
// //       {usingFallback && !isCapturing && (
// //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// //           <p className="text-amber-300 text-xs flex-1">
// //             Could not connect to camera stream. You can still draw the polygon on the placeholder,
// //             or <button onClick={handleRetry} className="underline font-bold">retry</button>.
// //           </p>
// //         </div>
// //       )}

// //       {/* Canvas area */}
// //       <div className="flex-1 relative bg-black" ref={containerRef}>

// //         {/* Loading overlay */}
// //         {isCapturing && (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10">
// //             <div className={theme.ui.spinner} />
// //             <p className={`${theme.type.whiteMuted} mt-4`}>
// //               {isNew ? 'Connecting to camera stream...' : 'Loading camera frame...'}
// //             </p>
// //             <p className="text-gray-600 text-xs mt-1">
// //               {isNew ? 'Fetching live frame from your RTSP URL' : 'Capturing first frame from stream'}
// //             </p>
// //           </div>
// //         )}

// //         {/* Error banner (shown alongside placeholder, not blocking) */}
// //         {frameError && !usingFallback && (
// //           <div className="absolute top-4 left-4 right-4 z-10">
// //             <div className={theme.alert.error}>
// //               <AlertTriangle className="w-4 h-4 shrink-0" />
// //               <span className="flex-1 text-sm">{frameError}</span>
// //               <button
// //                 onClick={handleRetry}
// //                 className="text-xs border border-red-300 px-2 py-1 rounded-full hover:bg-red-100 transition-colors ml-auto"
// //               >
// //                 Retry
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Canvas */}
// //         <canvas
// //           ref={canvasRef}
// //           onClick={handleCanvasClick}
// //           className={`w-full cursor-crosshair transition-opacity duration-300
// //                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// //           style={{ display: 'block' }}
// //         />

// //         {/* Point counter badge */}
// //         {frameLoaded && (
// //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-[1rem] px-3 py-2">
// //             <div className="flex items-center gap-2">
// //               <Crosshair className="w-4 h-4 text-[#c5a880]" />
// //               <span className="text-white font-mono text-sm font-bold">
// //                 {points.length}/{MAX_POINTS}
// //               </span>
// //             </div>
// //             <div className="flex gap-1 mt-1">
// //               {[0, 1, 2, 3].map(i => (
// //                 <div
// //                   key={i}
// //                   style={{ backgroundColor: i < points.length ? POINT_COLORS[i] : undefined }}
// //                   className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Completion overlay */}
// //         {isComplete && (
// //           <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
// //             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// //               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
// //               <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
// //               <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
// //               <p className="text-xs text-[#c5a880] font-semibold mb-5">
// //                 Next: You'll name the sections (cells) inside this fence.
// //               </p>
// //               <div className="flex gap-3">
// //                 <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
// //                 <button
// //                   onClick={handleSave}
// //                   disabled={savePending}
// //                   className={`${theme.button.primary} flex-1`}
// //                 >
// //                   {savePending
// //                     ? <Loader2 className="w-4 h-4 animate-spin" />
// //                     : <Save className="w-4 h-4" />}
// //                   {savePending ? 'Saving...' : 'Save & Define Cells'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Bottom bar */}
// //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">
// //         <div className="flex items-center justify-between text-sm">
// //           <span className={theme.type.bodySm}>
// //             {points.length === 0 && 'Click on the camera frame to place first point'}
// //             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
// //             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
// //             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
// //             {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
// //           </span>
// //           <span className="font-sans text-sm font-bold text-[#c5a880]">
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

// //           {!isNew && existingConfig && (
// //             <button onClick={handleSkip} className={theme.button.secondary}>Skip</button>
// //           )}

// //           <button
// //             onClick={handleSave}
// //             disabled={!isComplete || savePending}
// //             className={`${theme.button.primary} flex-1`}
// //           >
// //             {savePending
// //               ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
// //               : <><Save className="w-5 h-5" /> Save & Define Cells</>}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default ClimbingCalibration

// // src/pages/ClimbingCalibration.jsx
// import { useState, useRef, useEffect, useCallback } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, Save, RotateCcw, CheckCircle, AlertTriangle,
//   Loader2, Crosshair, MousePointer, Info, WifiOff
// } from 'lucide-react'
// import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
// import { theme } from '../theme'

// const ClimbingCalibration = () => {
//   const { id: propertyId, cameraId } = useParams()
//   const navigate = useNavigate()

//   const isNew = cameraId === 'new'

//   const canvasRef    = useRef(null)
//   const containerRef = useRef(null)
//   const baseImageRef = useRef(null)

//   const [points,        setPoints]        = useState([])
//   const [frameLoaded,   setFrameLoaded]   = useState(false)
//   const [frameError,    setFrameError]    = useState(null)
//   const [isCapturing,   setIsCapturing]   = useState(true)
//   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 })
//   const [showHelp,      setShowHelp]      = useState(true)
//   const [isSaving,      setIsSaving]      = useState(false)
//   const [usingFallback, setUsingFallback] = useState(false)

//   const pendingCamera = isNew
//     ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
//     : null

//   const [cameraName] = useState(
//     isNew
//       ? pendingCamera?.name || 'New Camera'
//       : `Camera ${cameraId}`
//   )

//   const saveMutation             = useSaveFenceConfig()
//   const { data: existingConfig } = useFenceConfig(isNew ? null : cameraId)

//   const MAX_POINTS   = 4
//   const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
//   const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

//   // ── Draw placeholder background (used when no real frame) ─────────────────

//   const drawPlaceholder = useCallback((canvas, message = 'Camera Frame Placeholder') => {
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
//     ctx.fillText(`📷 ${message}`, w / 2, h / 2 - 16)
//     ctx.fillStyle = '#6b7280'
//     ctx.font      = '13px sans-serif'
//     ctx.fillText('Click anywhere to define polygon points', w / 2, h / 2 + 16)
//   }, [])

//   // ── Redraw everything on canvas ───────────────────────────────────────────

//   const redrawAll = useCallback((currentPoints) => {
//     const canvas = canvasRef.current
//     if (!canvas || !frameLoaded) return
//     const ctx = canvas.getContext('2d')

//     // Base: real frame or placeholder grid
//     if (baseImageRef.current) {
//       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height)
//     } else {
//       drawPlaceholder(canvas, usingFallback ? 'Stream unavailable — using placeholder' : 'Camera Frame Placeholder')
//     }

//     // Polygon lines
//     if (currentPoints.length > 1) {
//       ctx.strokeStyle = '#c5a880'
//       ctx.lineWidth   = 3
//       ctx.setLineDash([8, 4])
//       ctx.beginPath()
//       ctx.moveTo(currentPoints[0].x, currentPoints[0].y)
//       for (let i = 1; i < currentPoints.length; i++) {
//         ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
//       }
//       if (currentPoints.length === MAX_POINTS) {
//         ctx.closePath()
//         ctx.fillStyle = 'rgba(197,168,128,0.15)'
//         ctx.fill()
//       }
//       ctx.stroke()
//       ctx.setLineDash([])
//     }

//     // Points
//     currentPoints.forEach((p, i) => {
//       ctx.shadowColor  = POINT_COLORS[i]
//       ctx.shadowBlur   = 10
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

//       const label      = POINT_LABELS[i]
//       ctx.font         = 'bold 12px sans-serif'
//       const labelWidth = ctx.measureText(label).width + 10
//       const labelX     = p.x - labelWidth / 2
//       const labelY     = p.y - 30
//       ctx.fillStyle    = 'rgba(0,0,0,0.8)'
//       ctx.beginPath()
//       ctx.roundRect(labelX, labelY - 10, labelWidth, 20, 4)
//       ctx.fill()
//       ctx.fillStyle    = POINT_COLORS[i]
//       ctx.textBaseline = 'middle'
//       ctx.fillText(label, p.x, labelY)
//     })
//   }, [frameLoaded, drawPlaceholder, usingFallback])

//   // ── Setup canvas size from container ──────────────────────────────────────

//   const setupCanvas = useCallback((img = null) => {
//     const canvas    = canvasRef.current
//     const container = containerRef.current
//     if (!canvas || !container) return null

//     if (img) {
//       const w     = container.clientWidth
//       const scale = w / img.naturalWidth
//       const h     = img.naturalHeight * scale
//       canvas.width  = w
//       canvas.height = h
//       return { width: w, height: h }
//     } else {
//       const w = container.clientWidth
//       const h = w * 0.5625           // 16:9 fallback
//       canvas.width  = w
//       canvas.height = h
//       return { width: w, height: h }
//     }
//   }, [])

//   // ── Load real frame from RTSP URL (Option B endpoint) ────────────────────

//   const loadFrameFromRTSP = useCallback(async (rtspUrl) => {
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
//     const token  = localStorage.getItem('token')

//     const response = await fetch(`${apiUrl}/api/v1/stream/preview-frame`, {
//       method:  'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization:  `Bearer ${token}`,
//       },
//       body: JSON.stringify({ rtsp_url: rtspUrl }),
//     })

//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}))
//       throw new Error(err.detail || `Stream error: ${response.status}`)
//     }

//     return response.blob()
//   }, [])

//   // ── Load frame from existing camera ID ────────────────────────────────────

//   const loadFrameFromCameraId = useCallback(async (id) => {
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
//     const token  = localStorage.getItem('token')

//     const response = await fetch(
//       `${apiUrl}/api/v1/stream/${id}/frame?t=${Date.now()}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     )

//     if (!response.ok) throw new Error(`Camera error: ${response.status}`)
//     return response.blob()
//   }, [])

//   // ── Load placeholder as final fallback ────────────────────────────────────

//   const loadPlaceholder = useCallback(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const size = setupCanvas()
//     if (!size) return
//     baseImageRef.current = null
//     setUsingFallback(true)
//     drawPlaceholder(canvas)
//     setImageSize(size)
//     setFrameLoaded(true)
//     setIsCapturing(false)
//   }, [setupCanvas, drawPlaceholder])

//   // ── Paint a loaded blob onto the canvas ──────────────────────────────────

//   const paintBlob = useCallback((blob) => {
//     return new Promise((resolve, reject) => {
//       const blobUrl = URL.createObjectURL(blob)
//       const img     = new Image()
//       img.onload = () => {
//         const canvas = canvasRef.current
//         if (!canvas) { URL.revokeObjectURL(blobUrl); reject(new Error('No canvas')); return }
//         const size = setupCanvas(img)
//         if (!size) { URL.revokeObjectURL(blobUrl); reject(new Error('No container')); return }
//         const ctx = canvas.getContext('2d')
//         ctx.drawImage(img, 0, 0, size.width, size.height)
//         baseImageRef.current = img
//         setImageSize(size)
//         setFrameLoaded(true)
//         setIsCapturing(false)
//         URL.revokeObjectURL(blobUrl)
//         resolve(size)
//       }
//       img.onerror = () => {
//         URL.revokeObjectURL(blobUrl)
//         reject(new Error('Failed to decode image'))
//       }
//       img.src = blobUrl
//     })
//   }, [setupCanvas])

//   // ── Main frame loading effect ─────────────────────────────────────────────

//   useEffect(() => {
//     let cancelled = false

//     const load = async () => {
//       setIsCapturing(true)
//       setFrameError(null)
//       setUsingFallback(false)

//       // Small delay so containerRef has its rendered width
//       await new Promise(r => setTimeout(r, 50))
//       if (cancelled) return

//       try {
//         let blob

//         if (isNew) {
//           // Option B: fetch real frame using the RTSP URL stored in sessionStorage
//           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
//           if (!pending.rtsp_url) {
//             throw new Error('No RTSP URL found — please go back and re-enter camera details.')
//           }
//           blob = await loadFrameFromRTSP(pending.rtsp_url)
//         } else {
//           // Existing camera: fetch by camera ID as before
//           blob = await loadFrameFromCameraId(cameraId)

//           // Also fetch camera name
//           try {
//             const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
//             const token  = localStorage.getItem('token')
//             const camRes = await fetch(
//               `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             )
//             // name is set in useState initializer for existing cameras
//           } catch { /* ignore */ }
//         }

//         if (cancelled) return
//         await paintBlob(blob)

//       } catch (err) {
//         if (cancelled) return
//         console.warn('Frame load failed:', err.message)
//         setFrameError(err.message)
//         loadPlaceholder()
//       }
//     }

//     load()
//     return () => { cancelled = true }
//   }, [cameraId, isNew, loadFrameFromRTSP, loadFrameFromCameraId, paintBlob, loadPlaceholder])

//   // Redraw whenever points change
//   useEffect(() => {
//     if (frameLoaded) redrawAll(points)
//   }, [points, frameLoaded, redrawAll])

//   // ── Canvas click ──────────────────────────────────────────────────────────

//   const handleCanvasClick = (e) => {
//     if (points.length >= MAX_POINTS) return
//     const canvas = canvasRef.current
//     const rect   = canvas.getBoundingClientRect()
//     const scaleX = canvas.width  / rect.width
//     const scaleY = canvas.height / rect.height
//     const x      = (e.clientX - rect.left) * scaleX
//     const y      = (e.clientY - rect.top)  * scaleY
//     setPoints(prev => [...prev, { x, y }])
//   }

//   // ── Actions ───────────────────────────────────────────────────────────────

//   const handleReset = () => {
//     setPoints([])
//     if (frameLoaded) redrawAll([])
//   }

//   const handleUndo = () => setPoints(prev => prev.slice(0, -1))

//   const handleRetry = () => {
//     setPoints([])
//     setFrameLoaded(false)
//     setFrameError(null)
//     baseImageRef.current = null
//     // Re-trigger the effect by toggling — easiest is a page reload of the effect
//     // We do this by calling load directly
//     const load = async () => {
//       setIsCapturing(true)
//       await new Promise(r => setTimeout(r, 50))
//       try {
//         let blob
//         if (isNew) {
//           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
//           blob = await loadFrameFromRTSP(pending.rtsp_url)
//         } else {
//           blob = await loadFrameFromCameraId(cameraId)
//         }
//         await paintBlob(blob)
//         setFrameError(null)
//         setUsingFallback(false)
//       } catch (err) {
//         setFrameError(err.message)
//         loadPlaceholder()
//       }
//     }
//     load()
//   }

//   const handleSave = async () => {
//     if (points.length !== MAX_POINTS) return

//     const normalizedPoints = points.map(p => ({
//       x: parseFloat((p.x / imageSize.width).toFixed(6)),
//       y: parseFloat((p.y / imageSize.height).toFixed(6)),
//     }))

//     if (isNew) {
//       // Store polygon in sessionStorage, navigate to cells — don't hit API yet
//       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
//       pending.polygonPoints = normalizedPoints
//       sessionStorage.setItem('pendingCamera', JSON.stringify(pending))
//       navigate(`/property/${propertyId}/camera/new/cells`)
//     } else {
//       setIsSaving(true)
//       try {
//         await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
//         navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
//       } catch (err) {
//         alert('Failed to save: ' + (err.response?.data?.detail || err.message))
//       } finally {
//         setIsSaving(false)
//       }
//     }
//   }

//   const handleSkip = () => navigate(`/property/${propertyId}/cameras`)

//   const isComplete  = points.length === MAX_POINTS
//   const savePending = isSaving || saveMutation.isPending

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

//       {/* Header */}
//       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
//         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
//           <ArrowLeft className="h-6 w-6" />
//         </button>
//         <div className="ml-3 flex-1 min-w-0">
//           <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
//             Wall Calibration
//           </h2>
//           <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           {points.length > 0 && (
//             <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
//               <RotateCcw className="h-5 w-5" />
//             </button>
//           )}
//           {/* <button onClick={() => setShowHelp(!showHelp)} className={theme.button.iconDark}>
//             <Info className="h-5 w-5" />
//           </button> */}
//         </div>
//       </div>

//       {/* Step indicator */}
//       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
//               1
//             </div>
//             <span className="text-[#c5a880] text-xs font-bold">Draw Polygon</span>
//           </div>
//           <div className="flex-1 h-px bg-white/10" />
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
//               2
//             </div>
//             <span className="text-white/40 text-xs font-bold">Define Cells</span>
//           </div>
//         </div>
//       </div>

//       {/* Help banner
//       {showHelp && (
//         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
//           <div className="flex items-start gap-3">
//             <MousePointer className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0" />
//             <div className="text-sm text-[#c5a880]/90 flex-1">
//               <p className="font-bold mb-1">Step 1 — Click 4 points to define the fence boundary:</p>
//               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70">
//                 <li>Top-Left corner of fence</li>
//                 <li>Top-Right corner of fence</li>
//                 <li>Bottom-Right corner of fence</li>
//                 <li>Bottom-Left corner of fence</li>
//               </ol>
//               <p className="text-[#c5a880]/50 text-xs mt-2">
//                 {isNew
//                   ? 'Camera is saved only after all steps are complete.'
//                   : "After saving, you'll define named sections (cells) inside the fence."}
//               </p>
//             </div>
//             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
//           </div>
//         </div>
//       )} */}

//       {/* Stream fallback warning */}
//       {usingFallback && !isCapturing && (
//         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
//           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
//           <p className="text-amber-300 text-xs flex-1">
//             Could not connect to camera stream. You can still draw the polygon on the placeholder,
//             or <button onClick={handleRetry} className="underline font-bold">retry</button>.
//           </p>
//         </div>
//       )}

//       {/* Canvas area */}
//       <div className="flex-1 relative bg-black" ref={containerRef}>

//         {/* Loading overlay */}
//         {isCapturing && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10">
//             <div className={theme.ui.spinner} />
//             <p className={`${theme.type.whiteMuted} mt-4`}>
//               {isNew ? 'Connecting to camera stream...' : 'Loading camera frame...'}
//             </p>
//             <p className="text-gray-600 text-xs mt-1">
//               {isNew ? 'Fetching live frame from your RTSP URL' : 'Capturing first frame from stream'}
//             </p>
//           </div>
//         )}

//         {/* Error banner (shown alongside placeholder, not blocking) */}
//         {frameError && !usingFallback && (
//           <div className="absolute top-4 left-4 right-4 z-10">
//             <div className={theme.alert.error}>
//               <AlertTriangle className="w-4 h-4 shrink-0" />
//               <span className="flex-1 text-sm">{frameError}</span>
//               <button
//                 onClick={handleRetry}
//                 className="text-xs border border-red-300 px-2 py-1 rounded-full hover:bg-red-100 transition-colors ml-auto"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Canvas */}
//         <canvas
//           ref={canvasRef}
//           onClick={handleCanvasClick}
//           className={`w-full cursor-crosshair transition-opacity duration-300
//                       ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
//           style={{ display: 'block' }}
//         />

//         {/* Point counter badge */}
//         {frameLoaded && (
//           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-[1rem] px-3 py-2">
//             <div className="flex items-center gap-2">
//               <Crosshair className="w-4 h-4 text-[#c5a880]" />
//               <span className="text-white font-mono text-sm font-bold">
//                 {points.length}/{MAX_POINTS}
//               </span>
//             </div>
//             <div className="flex gap-1 mt-1">
//               {[0, 1, 2, 3].map(i => (
//                 <div
//                   key={i}
//                   style={{ backgroundColor: i < points.length ? POINT_COLORS[i] : undefined }}
//                   className={`w-2 h-2 rounded-full transition-all ${i < points.length ? '' : 'bg-white/20'}`}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Completion overlay */}
//         {isComplete && (
//           <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
//             <div className="bg-white rounded-[2rem] p-6 max-w-sm mx-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
//               <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
//               <h3 className={`${theme.type.h3} mb-1`}>Polygon Complete!</h3>
//               <p className={`${theme.type.bodySm} mb-1`}>Fence boundary defined.</p>
//               <p className="text-xs text-[#c5a880] font-semibold mb-5">
//                 Next: You'll name the sections (cells) inside this fence.
//               </p>
//               <div className="flex gap-3">
//                 <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
//                 <button
//                   onClick={handleSave}
//                   disabled={savePending}
//                   className={`${theme.button.primary} flex-1`}
//                 >
//                   {savePending
//                     ? <Loader2 className="w-4 h-4 animate-spin" />
//                     : <Save className="w-4 h-4" />}
//                   {savePending ? 'Saving...' : 'Save & Define Cells'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Bottom bar */}
//       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">
//         <div className="flex items-center justify-between text-sm">
//           <span className={theme.type.bodySm}>
//             {points.length === 0 && 'Click on the camera frame to place first point'}
//             {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
//             {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
//             {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
//             {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
//           </span>
//           <span className="font-sans text-sm font-bold text-[#c5a880]">
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

//           {!isNew && existingConfig && (
//             <button onClick={handleSkip} className={theme.button.secondary}>Skip</button>
//           )}

//           <button
//             onClick={handleSave}
//             disabled={!isComplete || savePending}
//             className={`${theme.button.primary} flex-1`}
//           >
//             {savePending
//               ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
//               : <><Save className="w-5 h-5" /> Save & Define Cells</>}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ClimbingCalibration

// src/pages/ClimbingCalibration.jsx
//
// Step 1 of the ADD NEW CAMERA flow.
//
// Frame strategy — no backend fetch needed:
//   - MJPEG stream at pendingCamera.stream_url  OR derived from rtsp_url
//   - An <img> tag displays the live stream beneath a transparent <canvas>
//   - canvas draws the polygon on top (clearRect keeps it transparent when live)
//   - If <img> errors → streamOk=false → canvas draws a placeholder grid instead
//
// Save logic unchanged:
//   - Polygon normalised to 0-1 coords, stored in sessionStorage.pendingCamera
//   - No DB write here; FenceCellEditor does all writes after cells are defined

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Save, RotateCcw, CheckCircle,
  Crosshair, WifiOff, Loader2,
} from 'lucide-react'
import { useFenceConfig, useSaveFenceConfig } from '../hooks/useFenceConfig'
import { theme } from '../theme'

// ── Derive MJPEG stream URL ────────────────────────────────────────────────────
// Priority:  pendingCamera.stream_url  →  rtsp_url host + :8080/video  →  null
const deriveStreamUrl = (pending = {}) => {
  if (pending.stream_url) return pending.stream_url
  if (pending.rtsp_url) {
    try {
      const u = new URL(pending.rtsp_url.replace(/^rtsp:\/\//i, 'http://'))
      return `${u.protocol}//${u.hostname}:8080/video`
    } catch { /* fall through */ }
  }
  return null
}

const ClimbingCalibration = () => {
  const { id: propertyId, cameraId } = useParams()
  const navigate = useNavigate()

  const isNew = cameraId === 'new'

  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const imgRef       = useRef(null)

  const [points,     setPoints]     = useState([])
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  // null = stream pending/unknown, true = live, false = unavailable
  const [streamOk,   setStreamOk]   = useState(null)
  const [isSaving,   setIsSaving]   = useState(false)

  const pendingCamera = isNew
    ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
    : null

  const streamUrl = isNew
    ? deriveStreamUrl(pendingCamera)
    : null   // extend here if existing cameras also have a stream_url

  const [cameraName] = useState(
    isNew ? (pendingCamera?.name || 'New Camera') : `Camera ${cameraId}`
  )

  const saveMutation             = useSaveFenceConfig()
  const { data: existingConfig } = useFenceConfig(isNew ? null : cameraId)

  const MAX_POINTS   = 4
  const POINT_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#c5a880']
  const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

  // ── Sync canvas dimensions to the container ───────────────────────────────

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

  // If no stream URL at all, jump straight to placeholder
  useEffect(() => {
    if (!streamUrl && streamOk === null) setStreamOk(false)
  }, [streamUrl, streamOk])

  // ── Draw placeholder grid ─────────────────────────────────────────────────

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

  // ── Redraw polygon overlay ────────────────────────────────────────────────
  // Live stream → clearRect keeps canvas transparent; <img> shows through.
  // No stream   → drawPlaceholder fills the canvas first.

  const redrawAll = useCallback((pts) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (streamOk === false) {
      drawPlaceholder()
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Polygon lines + fill
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

    // Points + labels
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

  // ── Canvas click ──────────────────────────────────────────────────────────

  const handleCanvasClick = (e) => {
    if (points.length >= MAX_POINTS) return
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    setPoints(prev => [...prev, {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    }])
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleReset = () => setPoints([])
  const handleUndo  = () => setPoints(prev => prev.slice(0, -1))
  const handleSkip  = () => navigate(`/property/${propertyId}/cameras`)

  const handleSave = async () => {
    if (points.length !== MAX_POINTS) return

    const normalizedPoints = points.map(p => ({
      x: parseFloat((p.x / canvasSize.width).toFixed(6)),
      y: parseFloat((p.y / canvasSize.height).toFixed(6)),
    }))

    if (isNew) {
      const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
      pending.polygonPoints = normalizedPoints
      sessionStorage.setItem('pendingCamera', JSON.stringify(pending))
      navigate(`/property/${propertyId}/camera/new/cells`)
    } else {
      setIsSaving(true)
      try {
        await saveMutation.mutateAsync({ cameraId, points: normalizedPoints })
        navigate(`/property/${propertyId}/camera/${cameraId}/cells`)
      } catch (err) {
        alert('Failed to save: ' + (err.response?.data?.detail || err.message))
      } finally {
        setIsSaving(false)
      }
    }
  }

  const isComplete  = points.length === MAX_POINTS
  const savePending = isSaving || saveMutation.isPending

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
        <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="ml-3 flex-1 min-w-0">
          <h2 className={theme.type.whiteH1.replace('text-4xl', 'text-lg')}>
            Wall Calibration
          </h2>
          <p className={`${theme.type.whiteMuted} truncate`}>{cameraName}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {points.length > 0 && (
            <button onClick={handleUndo} className={theme.button.iconDark} title="Undo last point">
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
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
        </div>
      </div>

      {/* Stream unavailable banner */}
      {streamOk === false && (
        <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs">
            Camera stream unavailable. You can still draw the polygon on the placeholder.
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

        {/* Connecting spinner — only while stream is pending */}
        {streamUrl && streamOk === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10 pointer-events-none">
            <div className={theme.ui.spinner} />
            <p className={`${theme.type.whiteMuted} mt-4 text-sm`}>Connecting to camera…</p>
          </div>
        )}

        {/* Canvas — transparent overlay when stream is live, full placeholder when not */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative w-full cursor-crosshair"
          style={{ display: 'block', background: 'transparent' }}
        />

        {/* Point counter badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-[1rem] px-3 py-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#c5a880]" />
            <span className="text-white font-mono text-sm font-bold">
              {points.length}/{MAX_POINTS}
            </span>
          </div>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{ backgroundColor: i < points.length ? POINT_COLORS[i] : undefined }}
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
              <p className="text-xs text-[#c5a880] font-semibold mb-5">
                Next: You'll name the sections (cells) inside this fence.
              </p>
              <div className="flex gap-3">
                <button onClick={handleReset} className={theme.button.secondary}>Redo</button>
                <button onClick={handleSave} disabled={savePending} className={`${theme.button.primary} flex-1`}>
                  {savePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savePending ? 'Saving...' : 'Save & Define Cells'}
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
            {points.length === 0 && 'Click on the camera frame to place first point'}
            {points.length === 1 && '✅ Top-Left placed • Now click Top-Right'}
            {points.length === 2 && '✅ Top edge done • Now click Bottom-Right'}
            {points.length === 3 && '✅ Almost done • Click Bottom-Left to finish'}
            {points.length === 4 && '🎉 All 4 points placed! Ready to save.'}
          </span>
          <span className="font-sans text-sm font-bold text-[#c5a880]">
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
          {!isNew && existingConfig && (
            <button onClick={handleSkip} className={theme.button.secondary}>Skip</button>
          )}
          <button
            onClick={handleSave}
            disabled={!isComplete || savePending}
            className={`${theme.button.primary} flex-1`}
          >
            {savePending
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save & Define Cells</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClimbingCalibration