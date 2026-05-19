// // // // // src/pages/EditFenceCells.jsx
// // // // //
// // // // // RECALIBRATE FLOW — redefine cells/zones on an EXISTING camera.
// // // // //
// // // // // ── Why this page exists ────────────────────────────────────────────────────
// // // // // FenceCellEditor tries to resolve camera type via an API call when in
// // // // // recalibrate mode. If the stream endpoint is unavailable the fetch hangs,
// // // // // cameraType stays null, and the full-screen spinner never clears (Image 2).
// // // // //
// // // // // This page avoids that by reading everything it needs from sessionStorage
// // // // // (written by CameraManagement.handleRecalibrate) — so it renders instantly
// // // // // even when the camera stream is offline.
// // // // //
// // // // // ── Flow ────────────────────────────────────────────────────────────────────
// // // // //   CameraManagement clicks ↺
// // // // //     → sessionStorage.setItem('recalibrateCamera', { cameraId, propertyId,
// // // // //                                                      cameraType, cameraName,
// // // // //                                                      rtspUrl })
// // // // //     → fence  : navigate /property/:id/camera/:cameraId/calibrate
// // // // //       (EditClimbingCalibration redraws polygon → then /cells)
// // // // //     → insider: navigate /property/:id/camera/:cameraId/edit-cells  ← HERE
// // // // //
// // // // // ── What this page does ─────────────────────────────────────────────────────
// // // // //   1. Reads camera meta from sessionStorage (NO API call needed for type)
// // // // //   2. Loads a preview frame (falls back to placeholder if stream is down)
// // // // //   3. For fence cameras: overlays existing polygon from useFenceConfig
// // // // //   4. Pre-populates existing cells from useFenceCells
// // // // //   5. On Save: ONLY writes cells to DB (camera & polygon already exist)
// // // // //   6. Clears sessionStorage and navigates back to camera list
// // // // //
// // // // // ── DB writes ───────────────────────────────────────────────────────────────
// // // // //   saveCells.mutateAsync({ cameraId, cells })   ← the ONLY write
// // // // //   Camera row and fence-config polygon are left untouched.

// // // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, Save, RotateCcw, CheckCircle,
// // // //   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// // // // } from 'lucide-react'
// // // // import { useFenceConfig } from '../hooks/useFenceConfig'
// // // // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // // // import { theme } from '../theme'

// // // // // ── Constants ──────────────────────────────────────────────────────────────

// // // // const CELL_COLORS = [
// // // //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// // // //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// // // //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // // // ]

// // // // const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
// // // // const MAX_CELL_POINTS = 4

// // // // // ── Geometry ───────────────────────────────────────────────────────────────

// // // // const pointInPolygon = (point, polygon) => {
// // // //   let inside = false
// // // //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// // // //     const xi = polygon[i].x, yi = polygon[i].y
// // // //     const xj = polygon[j].x, yj = polygon[j].y
// // // //     if (
// // // //       (yi > point.y) !== (yj > point.y) &&
// // // //       point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
// // // //     ) inside = !inside
// // // //   }
// // // //   return inside
// // // // }

// // // // // ── Component ──────────────────────────────────────────────────────────────

// // // // const EditFenceCells = () => {
// // // //   const { id: propertyId, cameraId } = useParams()
// // // //   const navigate = useNavigate()

// // // //   // ── Read camera meta from sessionStorage (written by handleRecalibrate) ──
// // // //   // This is the KEY difference from FenceCellEditor: we never need an API
// // // //   // call to know the camera type, so cameraType is NEVER null on mount.
// // // //   const recalibMeta = (() => {
// // // //     try {
// // // //       return JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}')
// // // //     } catch {
// // // //       return {}
// // // //     }
// // // //   })()

// // // //   // Validate the sessionStorage payload matches the current route
// // // //   const metaValid =
// // // //     recalibMeta &&
// // // //     String(recalibMeta.cameraId) === String(cameraId)

// // // //   const cameraType = metaValid ? (recalibMeta.cameraType || 'fence') : 'fence'
// // // //   const isInsider  = cameraType === 'insider'
// // // //   const rtspUrl    = metaValid ? recalibMeta.rtspUrl : null

// // // //   const [cameraName] = useState(
// // // //     metaValid ? (recalibMeta.cameraName || `Camera ${cameraId}`) : `Camera ${cameraId}`
// // // //   )

// // // //   // ── Canvas refs ────────────────────────────────────────────────────────
// // // //   const canvasRef    = useRef(null)
// // // //   const containerRef = useRef(null)
// // // //   const baseImageRef = useRef(null)

// // // //   // ── State ──────────────────────────────────────────────────────────────
// // // //   const [cells,         setCells]         = useState([])
// // // //   const [currentPoints, setCurrentPoints] = useState([])
// // // //   const [mousePos,      setMousePos]      = useState(null)
// // // //   const [isNaming,      setIsNaming]      = useState(false)
// // // //   const [pendingCell,   setPendingCell]   = useState(null)
// // // //   const [cellName,      setCellName]      = useState('')
// // // //   const [nameError,     setNameError]     = useState('')
// // // //   const [frameLoaded,   setFrameLoaded]   = useState(false)
// // // //   const [frameError,    setFrameError]    = useState(null)
// // // //   const [isCapturing,   setIsCapturing]   = useState(true)
// // // //   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 })
// // // //   const [showHelp,      setShowHelp]      = useState(true)
// // // //   const [usingFallback, setUsingFallback] = useState(false)
// // // //   const [fencePolygon,  setFencePolygon]  = useState([])
// // // //   const [drawingMode,   setDrawingMode]   = useState(false)
// // // //   const [selectedCell,  setSelectedCell]  = useState(null)
// // // //   const [saveError,     setSaveError]     = useState('')

// // // //   // ── API hooks ──────────────────────────────────────────────────────────
// // // //   // Only fetch fence polygon for fence-type cameras
// // // //   const { data: existingConfig } = useFenceConfig(
// // // //     isInsider ? null : cameraId
// // // //   )
// // // //   // Pre-populate existing cells
// // // //   const { data: existingCells } = useFenceCells(cameraId)
// // // //   const saveCells = useSaveFenceCells()

// // // //   const entityLabel = isInsider ? 'zone' : 'cell'

// // // //   // ── Frame helpers ──────────────────────────────────────────────────────

// // // //   const applyImageToCanvas = (img) => {
// // // //     const canvas    = canvasRef.current
// // // //     const container = containerRef.current
// // // //     if (!canvas || !container) return null
// // // //     const w = container.clientWidth
// // // //     const h = img.naturalHeight * (w / img.naturalWidth)
// // // //     canvas.width  = w
// // // //     canvas.height = h
// // // //     canvas.getContext('2d').drawImage(img, 0, 0, w, h)
// // // //     baseImageRef.current = img
// // // //     const size = { width: w, height: h }
// // // //     setImageSize(size)
// // // //     setFrameLoaded(true)
// // // //     setIsCapturing(false)
// // // //     return size
// // // //   }

// // // //   const applyPlaceholder = () => {
// // // //     const canvas    = canvasRef.current
// // // //     const container = containerRef.current
// // // //     if (!canvas || !container) return null
// // // //     const w = container.clientWidth
// // // //     const h = w * 0.5625
// // // //     canvas.width  = w
// // // //     canvas.height = h
// // // //     baseImageRef.current = null
// // // //     const size = { width: w, height: h }
// // // //     setImageSize(size)
// // // //     setUsingFallback(true)
// // // //     setFrameLoaded(true)
// // // //     setIsCapturing(false)
// // // //     return size
// // // //   }

// // // //   const fetchFrameBlob = async () => {
// // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
// // // //     const token  = localStorage.getItem('token')

// // // //     if (rtspUrl) {
// // // //       // Prefer preview-frame with RTSP URL (doesn't need stream to be up)
// // // //       const res = await fetch(`${apiUrl}/api/v1/stream/preview-frame`, {
// // // //         method:  'POST',
// // // //         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // //         body:    JSON.stringify({ rtsp_url: rtspUrl }),
// // // //       })
// // // //       if (!res.ok) throw new Error(`Stream error ${res.status}`)
// // // //       return res.blob()
// // // //     }

// // // //     // Fallback: live frame endpoint
// // // //     const res = await fetch(`${apiUrl}/api/v1/stream/${cameraId}/frame?t=${Date.now()}`, {
// // // //       headers: { Authorization: `Bearer ${token}` },
// // // //     })
// // // //     if (!res.ok) throw new Error(`Stream error ${res.status}`)
// // // //     return res.blob()
// // // //   }

// // // //   const paintBlob = (blob) =>
// // // //     new Promise((resolve, reject) => {
// // // //       const blobUrl = URL.createObjectURL(blob)
// // // //       const img     = new Image()
// // // //       img.onload = () => {
// // // //         URL.revokeObjectURL(blobUrl)
// // // //         const size = applyImageToCanvas(img)
// // // //         if (size) resolve(size)
// // // //         else reject(new Error('Canvas not ready'))
// // // //       }
// // // //       img.onerror = () => {
// // // //         URL.revokeObjectURL(blobUrl)
// // // //         reject(new Error('Failed to decode image'))
// // // //       }
// // // //       img.src = blobUrl
// // // //     })

// // // //   // ── Frame load effect ──────────────────────────────────────────────────

// // // //   useEffect(() => {
// // // //     let cancelled = false

// // // //     const load = async () => {
// // // //       setIsCapturing(true)
// // // //       setFrameError(null)
// // // //       setUsingFallback(false)
// // // //       baseImageRef.current = null

// // // //       await new Promise(r => setTimeout(r, 50))
// // // //       if (cancelled) return

// // // //       try {
// // // //         const blob = await fetchFrameBlob()
// // // //         if (cancelled) return
// // // //         await paintBlob(blob)
// // // //       } catch (err) {
// // // //         if (cancelled) return
// // // //         console.warn('[EditFenceCells] Frame load failed:', err.message)
// // // //         setFrameError(err.message)
// // // //         applyPlaceholder()
// // // //       }
// // // //     }

// // // //     load()
// // // //     return () => { cancelled = true }
// // // //   }, [cameraId])  // eslint-disable-line react-hooks/exhaustive-deps

// // // //   // ── Pre-populate existing cells ────────────────────────────────────────

// // // //   useEffect(() => {
// // // //     if (!frameLoaded || !existingCells?.length) return
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return
// // // //     setCells(existingCells.map(cell => ({
// // // //       cell_name:    cell.cell_name,
// // // //       row:          cell.row,
// // // //       col:          cell.col,
// // // //       canvasPoints: cell.polygon_points.map(p => ({
// // // //         x: p.x * canvas.width,
// // // //         y: p.y * canvas.height,
// // // //       })),
// // // //     })))
// // // //   }, [frameLoaded, existingCells])

// // // //   // ── Load fence polygon overlay ─────────────────────────────────────────

// // // //   useEffect(() => {
// // // //     if (isInsider || !frameLoaded || !existingConfig?.polygon_points?.length) return
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return
// // // //     setFencePolygon(existingConfig.polygon_points.map(p => ({
// // // //       x: p.x * canvas.width,
// // // //       y: p.y * canvas.height,
// // // //     })))
// // // //   }, [isInsider, frameLoaded, existingConfig])

// // // //   // ── Redraw canvas ──────────────────────────────────────────────────────

// // // //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas || !frameLoaded) return
// // // //     const ctx = canvas.getContext('2d')
// // // //     const w   = canvas.width
// // // //     const h   = canvas.height

// // // //     // Background
// // // //     if (baseImageRef.current) {
// // // //       ctx.drawImage(baseImageRef.current, 0, 0, w, h)
// // // //     } else {
// // // //       ctx.fillStyle = '#1c1c1c'
// // // //       ctx.fillRect(0, 0, w, h)
// // // //       ctx.strokeStyle = '#2a2a2a'
// // // //       ctx.lineWidth   = 1
// // // //       for (let x = 0; x < w; x += 40) {
// // // //         ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// // // //       }
// // // //       for (let y = 0; y < h; y += 40) {
// // // //         ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// // // //       }
// // // //       ctx.fillStyle    = '#c5a880'
// // // //       ctx.font         = 'bold 15px sans-serif'
// // // //       ctx.textAlign    = 'center'
// // // //       ctx.textBaseline = 'middle'
// // // //       ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
// // // //       ctx.fillStyle = '#6b7280'
// // // //       ctx.font      = '13px sans-serif'
// // // //       ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16)
// // // //     }

// // // //     // Fence polygon overlay
// // // //     if (!isInsider && fencePolygon.length === 4) {
// // // //       ctx.save()
// // // //       ctx.fillStyle = 'rgba(0,0,0,0.4)'
// // // //       ctx.fillRect(0, 0, w, h)
// // // //       ctx.beginPath()
// // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// // // //       ctx.closePath()
// // // //       ctx.globalCompositeOperation = 'destination-out'
// // // //       ctx.fill()
// // // //       ctx.globalCompositeOperation = 'source-over'
// // // //       ctx.restore()
// // // //       ctx.strokeStyle = '#c5a880'
// // // //       ctx.lineWidth   = 2
// // // //       ctx.setLineDash([6, 3])
// // // //       ctx.beginPath()
// // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// // // //       ctx.closePath()
// // // //       ctx.stroke()
// // // //       ctx.setLineDash([])
// // // //     }

// // // //     // Draw existing cells
// // // //     currentCells.forEach((cell, idx) => {
// // // //       const color = CELL_COLORS[idx % CELL_COLORS.length]
// // // //       const cPts  = cell.canvasPoints
// // // //       const isSel = selIdx === idx

// // // //       ctx.beginPath()
// // // //       ctx.moveTo(cPts[0].x, cPts[0].y)
// // // //       cPts.forEach(p => ctx.lineTo(p.x, p.y))
// // // //       ctx.closePath()
// // // //       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`
// // // //       ctx.fill()
// // // //       ctx.strokeStyle = color
// // // //       ctx.lineWidth   = isSel ? 3 : 2
// // // //       ctx.stroke()

// // // //       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length
// // // //       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length
// // // //       ctx.font = `bold ${isSel ? 14 : 12}px sans-serif`
// // // //       const tw = ctx.measureText(cell.cell_name).width + 14
// // // //       ctx.fillStyle = 'rgba(0,0,0,0.75)'
// // // //       ctx.beginPath()
// // // //       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5)
// // // //       ctx.fill()
// // // //       ctx.fillStyle    = 'white'
// // // //       ctx.textAlign    = 'center'
// // // //       ctx.textBaseline = 'middle'
// // // //       ctx.fillText(cell.cell_name, cx, cy)
// // // //     })

// // // //     // In-progress cell
// // // //     if (drawingMode && pts.length > 0) {
// // // //       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length]
// // // //       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts

// // // //       if (previewPts.length >= 3) {
// // // //         ctx.beginPath()
// // // //         ctx.moveTo(previewPts[0].x, previewPts[0].y)
// // // //         previewPts.forEach(p => ctx.lineTo(p.x, p.y))
// // // //         ctx.closePath()
// // // //         ctx.fillStyle = 'rgba(255,255,255,0.10)'
// // // //         ctx.fill()
// // // //       }

// // // //       ctx.strokeStyle = color
// // // //       ctx.lineWidth   = 2
// // // //       ctx.setLineDash([6, 3])
// // // //       ctx.beginPath()
// // // //       ctx.moveTo(pts[0].x, pts[0].y)
// // // //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
// // // //       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y)
// // // //       ctx.stroke()
// // // //       ctx.setLineDash([])

// // // //       pts.forEach((p, i) => {
// // // //         const ptColor = CELL_COLORS[i % CELL_COLORS.length]
// // // //         ctx.shadowColor = ptColor
// // // //         ctx.shadowBlur  = 8
// // // //         ctx.beginPath()
// // // //         ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
// // // //         ctx.fillStyle = ptColor
// // // //         ctx.fill()
// // // //         ctx.shadowBlur = 0
// // // //         ctx.beginPath()
// // // //         ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
// // // //         ctx.fillStyle = 'white'
// // // //         ctx.fill()
// // // //         ctx.fillStyle    = ptColor
// // // //         ctx.font         = 'bold 10px sans-serif'
// // // //         ctx.textAlign    = 'center'
// // // //         ctx.textBaseline = 'middle'
// // // //         ctx.fillText((i + 1).toString(), p.x, p.y)

// // // //         const label = POINT_LABELS[i]
// // // //         ctx.font    = 'bold 11px sans-serif'
// // // //         const lw    = ctx.measureText(label).width + 10
// // // //         const lx    = p.x - lw / 2
// // // //         const ly    = p.y - 28
// // // //         ctx.fillStyle = 'rgba(0,0,0,0.8)'
// // // //         ctx.beginPath()
// // // //         ctx.roundRect(lx, ly - 10, lw, 20, 4)
// // // //         ctx.fill()
// // // //         ctx.fillStyle    = ptColor
// // // //         ctx.textBaseline = 'middle'
// // // //         ctx.fillText(label, p.x, ly)
// // // //       })
// // // //     }
// // // //   }, [frameLoaded, fencePolygon, drawingMode, isInsider])

// // // //   useEffect(() => {
// // // //     if (frameLoaded) redrawAll(cells, currentPoints, mousePos, selectedCell)
// // // //   }, [cells, currentPoints, mousePos, frameLoaded, redrawAll, selectedCell])

// // // //   // ── Canvas event handlers ──────────────────────────────────────────────

// // // //   const getCanvasPoint = (e) => {
// // // //     const canvas = canvasRef.current
// // // //     const rect   = canvas.getBoundingClientRect()
// // // //     return {
// // // //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// // // //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// // // //     }
// // // //   }

// // // //   const handleMouseMove = (e) => {
// // // //     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return
// // // //     setMousePos(getCanvasPoint(e))
// // // //   }

// // // //   const handleCanvasClick = (e) => {
// // // //     if (isNaming) return
// // // //     const point = getCanvasPoint(e)

// // // //     if (!drawingMode) {
// // // //       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
// // // //       setSelectedCell(idx >= 0 ? idx : null)
// // // //       return
// // // //     }

// // // //     // Fence cameras: only allow clicks inside the polygon
// // // //     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return

// // // //     const newPoints = [...currentPoints, point]
// // // //     if (newPoints.length < MAX_CELL_POINTS) {
// // // //       setCurrentPoints(newPoints)
// // // //       setMousePos(point)
// // // //     } else {
// // // //       setPendingCell(newPoints)
// // // //       setCurrentPoints([])
// // // //       setMousePos(null)
// // // //       setIsNaming(true)
// // // //       setCellName('')
// // // //       setNameError('')
// // // //     }
// // // //   }

// // // //   const handleConfirmName = () => {
// // // //     const trimmed = cellName.trim()
// // // //     if (!trimmed) { setNameError('Please enter a name'); return }
// // // //     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
// // // //       setNameError('Name already used'); return
// // // //     }
// // // //     setCells(prev => [...prev, {
// // // //       cell_name:    trimmed,
// // // //       row:          prev.length,
// // // //       col:          0,
// // // //       canvasPoints: pendingCell,
// // // //     }])
// // // //     setPendingCell(null)
// // // //     setIsNaming(false)
// // // //     setCellName('')
// // // //     setNameError('')
// // // //   }

// // // //   const handleCancelName = () => {
// // // //     setPendingCell(null)
// // // //     setIsNaming(false)
// // // //     setCellName('')
// // // //     setNameError('')
// // // //   }

// // // //   const handleDeleteSelected = () => {
// // // //     if (selectedCell === null) return
// // // //     setCells(prev => prev.filter((_, i) => i !== selectedCell))
// // // //     setSelectedCell(null)
// // // //   }

// // // //   const handleRetry = () => {
// // // //     setFrameLoaded(false)
// // // //     setFrameError(null)
// // // //     setUsingFallback(false)
// // // //     baseImageRef.current = null
// // // //     setIsCapturing(true)

// // // //     const load = async () => {
// // // //       await new Promise(r => setTimeout(r, 50))
// // // //       try {
// // // //         const blob = await fetchFrameBlob()
// // // //         await paintBlob(blob)
// // // //         setFrameError(null)
// // // //         setUsingFallback(false)
// // // //       } catch (err) {
// // // //         setFrameError(err.message)
// // // //         applyPlaceholder()
// // // //       }
// // // //     }
// // // //     load()
// // // //   }

// // // //   // ── Normalise cell polygon points to 0–1 ──────────────────────────────

// // // //   const normaliseCells = () =>
// // // //     cells.map((cell, idx) => ({
// // // //       cell_name:      cell.cell_name,
// // // //       row:            idx,
// // // //       col:            0,
// // // //       polygon_points: cell.canvasPoints.map(p => ({
// // // //         x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // //         y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // //       })),
// // // //     }))

// // // //   // ── handleSave — ONLY writes cells, camera & polygon already in DB ────

// // // //   const handleSave = async () => {
// // // //     if (cells.length === 0) return
// // // //     setSaveError('')

// // // //     try {
// // // //       await saveCells.mutateAsync({
// // // //         cameraId,
// // // //         cells: normaliseCells(),
// // // //       })

// // // //       // Clean up sessionStorage after successful save
// // // //       sessionStorage.removeItem('recalibrateCamera')

// // // //       navigate(`/property/${propertyId}/cameras`)
// // // //     } catch (err) {
// // // //       setSaveError(
// // // //         err?.response?.data?.detail
// // // //         || err?.message
// // // //         || 'Failed to save. Please try again.'
// // // //       )
// // // //     }
// // // //   }

// // // //   const isSaving     = saveCells.isPending
// // // //   const pointsLeft   = MAX_CELL_POINTS - currentPoints.length

// // // //   // ── Render ─────────────────────────────────────────────────────────────

// // // //   return (
// // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // //       {/* ── Header ── */}
// // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // //           <ArrowLeft className="h-6 w-6" />
// // // //         </button>
// // // //         <div className="ml-3 flex-1 min-w-0">
// // // //           <h2 className="text-white font-bold text-lg">
// // // //             {isInsider ? 'Redefine Insider Zones' : 'Redefine Fence Cells'}
// // // //           </h2>
// // // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // // //         </div>
// // // //         <div className="flex items-center gap-2">
// // // //           <button
// // // //             onClick={() => {
// // // //               setDrawingMode(m => !m)
// // // //               setCurrentPoints([])
// // // //               setMousePos(null)
// // // //               setSelectedCell(null)
// // // //             }}
// // // //             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
// // // //               drawingMode
// // // //                 ? 'bg-[#c5a880] text-[#1c1c1c]'
// // // //                 : 'bg-white/10 text-white hover:bg-white/20'
// // // //             }`}
// // // //           >
// // // //             {drawingMode ? '✏️ Drawing' : '👆 Select'}
// // // //           </button>
// // // //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// // // //             <Info className="h-5 w-5" />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Step indicator (recalibrate is a single step) ── */}
// // // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // // //         <div className="flex items-center gap-2">
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// // // //                             justify-center text-[#1c1c1c] text-xs font-bold">1</div>
// // // //             <span className="text-[#c5a880] text-xs font-bold">
// // // //               {isInsider ? 'Redefine Zones' : 'Redefine Cells'}
// // // //             </span>
// // // //           </div>
// // // //           <div className="flex-1 h-px bg-white/10" />
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// // // //                             justify-center text-white/40 text-xs font-bold">2</div>
// // // //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Help banner ── */}
// // // //       {showHelp && (
// // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // //           <div className="flex items-start gap-3">
// // // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // // //               <p className="font-bold mb-1">
// // // //                 {isInsider
// // // //                   ? 'Redefine interior surveillance zones:'
// // // //                   : 'Redefine fence cells:'}
// // // //               </p>
// // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// // // //                 <li>Switch to <strong>Drawing</strong> mode</li>
// // // //                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
// // // //                 <li>Name the {entityLabel} when prompted</li>
// // // //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// // // //               </ol>
// // // //               <p className="text-emerald-400/80 text-xs mt-2 font-medium">
// // // //                 ✅ Camera and polygon are already saved — only cells will be updated.
// // // //               </p>
// // // //             </div>
// // // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ── Fallback warning ── */}
// // // //       {usingFallback && !isCapturing && (
// // // //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// // // //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// // // //           <p className="text-amber-300 text-xs flex-1">
// // // //             Stream unavailable — drawing on placeholder.{' '}
// // // //             <button onClick={handleRetry} className="underline font-bold">Retry</button>
// // // //           </p>
// // // //         </div>
// // // //       )}

// // // //       {/* ── Canvas ── */}
// // // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // // //         {isCapturing && (
// // // //           <div className="absolute inset-0 flex flex-col items-center
// // // //                           justify-center bg-[#1c1c1c] z-10">
// // // //             <div className={theme.ui.spinner} />
// // // //             <p className="text-gray-400 mt-4">Loading camera frame…</p>
// // // //           </div>
// // // //         )}

// // // //         {frameError && !usingFallback && (
// // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // //             <div className={theme.alert.error}>
// // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // //               <span className="flex-1 text-sm">{frameError}</span>
// // // //               <button
// // // //                 onClick={handleRetry}
// // // //                 className="text-xs border border-red-300 px-2 py-1 rounded-full ml-auto hover:bg-red-100"
// // // //               >
// // // //                 Retry
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         <canvas
// // // //           ref={canvasRef}
// // // //           onClick={handleCanvasClick}
// // // //           onMouseMove={handleMouseMove}
// // // //           className={`w-full transition-opacity duration-300
// // // //             ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}
// // // //             ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // // //           style={{ display: 'block' }}
// // // //         />

// // // //         {/* Cell counter badge */}
// // // //         {frameLoaded && (
// // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // // //                           rounded-2xl px-3 py-2 text-center">
// // // //             <p className="text-white font-mono text-sm font-bold">
// // // //               {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
// // // //             </p>
// // // //             {drawingMode && currentPoints.length > 0 && (
// // // //               <>
// // // //                 <div className="flex gap-1 mt-1 justify-center">
// // // //                   {[0, 1, 2, 3].map(i => (
// // // //                     <div
// // // //                       key={i}
// // // //                       style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // //                       className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
// // // //                     />
// // // //                   ))}
// // // //                 </div>
// // // //                 <p className="text-[#c5a880] text-xs mt-1">
// // // //                   {pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left
// // // //                 </p>
// // // //               </>
// // // //             )}
// // // //             {drawingMode && currentPoints.length === 0 && (
// // // //               <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* Selected cell action bar */}
// // // //         {selectedCell !== null && !drawingMode && (
// // // //           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white
// // // //                           rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
// // // //             <div className="text-sm font-bold text-[#1c1c1c]">
// // // //               {cells[selectedCell]?.cell_name}
// // // //             </div>
// // // //             <button
// // // //               onClick={handleDeleteSelected}
// // // //               className="flex items-center gap-1 text-red-500 text-sm font-bold
// // // //                          hover:bg-red-50 px-2 py-1 rounded-full"
// // // //             >
// // // //               <Trash2 className="w-4 h-4" /> Delete
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setSelectedCell(null)}
// // // //               className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100"
// // // //             >
// // // //               ✕
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ── Cell name modal ── */}
// // // //       {isNaming && (
// // // //         <div className="absolute inset-0 bg-black/70 flex items-center
// // // //                         justify-center z-50 p-6">
// // // //           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm
// // // //                           shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // //             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">
// // // //               Name This {isInsider ? 'Zone' : 'Cell'}
// // // //             </h3>
// // // //             <p className="text-gray-500 text-sm mb-4">
// // // //               {isInsider
// // // //                 ? 'e.g. "Reception", "Office A", "Server Room"'
// // // //                 : 'e.g. "A1", "B2", "Gate A"'}
// // // //             </p>
// // // //             <input
// // // //               type="text"
// // // //               value={cellName}
// // // //               onChange={e => { setCellName(e.target.value); setNameError('') }}
// // // //               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
// // // //               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
// // // //               autoFocus
// // // //               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium
// // // //                           outline-none transition-colors
// // // //                           ${nameError
// // // //                             ? 'border-red-400 bg-red-50'
// // // //                             : 'border-[#e6e3db] focus:border-[#c5a880]'}`}
// // // //             />
// // // //             {nameError && (
// // // //               <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>
// // // //             )}
// // // //             {cells.length > 0 && (
// // // //               <div className="mt-3 flex flex-wrap gap-1">
// // // //                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
// // // //                 {cells.map(c => (
// // // //                   <span
// // // //                     key={c.cell_name}
// // // //                     className="text-xs bg-[#faf9f6] border border-[#e6e3db]
// // // //                                px-2 py-0.5 rounded-full text-gray-600 font-medium"
// // // //                   >
// // // //                     {c.cell_name}
// // // //                   </span>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //             <div className="flex gap-3 mt-5">
// // // //               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
// // // //               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
// // // //                 <CheckCircle className="w-4 h-4" /> Confirm
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ── Bottom bar ── */}
// // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4
// // // //                       space-y-3 rounded-t-[2rem]">

// // // //         {/* Save error */}
// // // //         {saveError && (
// // // //           <div className={`${theme.alert.error} text-sm`}>
// // // //             <AlertTriangle className="w-4 h-4 shrink-0" />
// // // //             <span>{saveError}</span>
// // // //           </div>
// // // //         )}

// // // //         {/* Cell chips */}
// // // //         {cells.length > 0 && (
// // // //           <div className="flex gap-2 overflow-x-auto pb-1">
// // // //             {cells.map((cell, idx) => (
// // // //               <button
// // // //                 key={cell.cell_name}
// // // //                 onClick={() => { setDrawingMode(false); setSelectedCell(idx) }}
// // // //                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs
// // // //                              font-bold border transition-all ${
// // // //                   selectedCell === idx
// // // //                     ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
// // // //                     : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
// // // //                 }`}
// // // //               >
// // // //                 {cell.cell_name}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         {/* Status hint */}
// // // //         <div className="text-sm text-gray-500">
// // // //           {cells.length === 0 && currentPoints.length === 0 &&
// // // //             `Switch to Drawing — click 4 corners of each ${entityLabel}`}
// // // //           {drawingMode && currentPoints.length === 0 && cells.length > 0 &&
// // // //             `Click Top-Left corner to start a new ${entityLabel}`}
// // // //           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
// // // //           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
// // // //           {drawingMode && currentPoints.length === 3 &&
// // // //             `Click Bottom-Left to close the ${entityLabel}`}
// // // //           {!drawingMode && cells.length > 0 &&
// // // //             `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
// // // //         </div>

// // // //         {/* Point progress dots */}
// // // //         {drawingMode && (
// // // //           <div className="flex items-center gap-2">
// // // //             {[0, 1, 2, 3].map(i => (
// // // //               <div key={i} className="flex items-center gap-1.5 flex-1">
// // // //                 <div
// // // //                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // //                   className={`w-3 h-3 rounded-full border-2 transition-all ${
// // // //                     i < currentPoints.length
// // // //                       ? 'border-transparent scale-110'
// // // //                       : i === currentPoints.length
// // // //                         ? 'border-white/60 bg-white/20 animate-pulse'
// // // //                         : 'border-white/20 bg-transparent'
// // // //                   }`}
// // // //                 />
// // // //                 <span className={`text-xs ${
// // // //                   i < currentPoints.length ? 'text-white/80'
// // // //                   : i === currentPoints.length ? 'text-white/50'
// // // //                   : 'text-white/20'
// // // //                 }`}>{POINT_LABELS[i]}</span>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         {/* Action buttons */}
// // // //         <div className="flex gap-3">
// // // //           <button
// // // //             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null) }}
// // // //             className={theme.button.secondary}
// // // //             disabled={currentPoints.length === 0}
// // // //             title="Undo last point"
// // // //           >
// // // //             <RotateCcw className="w-4 h-4" />
// // // //           </button>
// // // //           <button
// // // //             onClick={() => {
// // // //               setDrawingMode(true)
// // // //               setSelectedCell(null)
// // // //               setCurrentPoints([])
// // // //               setMousePos(null)
// // // //             }}
// // // //             className={theme.button.secondary}
// // // //           >
// // // //             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
// // // //           </button>
// // // //           <button
// // // //             onClick={handleSave}
// // // //             disabled={cells.length === 0 || isSaving}
// // // //             className={`${theme.button.primary} flex-1`}
// // // //           >
// // // //             {isSaving
// // // //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
// // // //               : <><Save className="w-4 h-4" />
// // // //                   Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}
// // // //                 </>
// // // //             }
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default EditFenceCells
// // // // src/pages/EditFenceCells.jsx
// // // //
// // // // RECALIBRATE FLOW — redefine cells/zones on an EXISTING camera.
// // // //
// // // // Frame strategy — no backend fetch needed:
// // // //   - Stream URL derived from recalibrateCamera.rtspUrl in sessionStorage
// // // //   - <img> displays MJPEG stream behind a transparent <canvas>
// // // //   - If stream errors → canvas draws placeholder grid
// // // //
// // // // DB writes: ONLY saveCells — camera & polygon already exist in DB.

// // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, Save, RotateCcw, CheckCircle,
// // //   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// // // } from 'lucide-react'
// // // import { useFenceConfig } from '../hooks/useFenceConfig'
// // // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // // import { theme } from '../theme'

// // // // ── Constants ──────────────────────────────────────────────────────────────

// // // const CELL_COLORS = [
// // //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// // //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// // //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // // ]
// // // const POINT_LABELS   = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
// // // const MAX_CELL_POINTS = 4

// // // // ── Derive MJPEG stream URL ────────────────────────────────────────────────

// // // const deriveStreamUrl = (rtspUrl) => {
// // //   if (!rtspUrl) return null
// // //   try {
// // //     const u = new URL(rtspUrl.replace(/^rtsp:\/\//i, 'http://'))
// // //     return `${u.protocol}//${u.hostname}:8080/video`
// // //   } catch {
// // //     return null
// // //   }
// // // }

// // // // ── Geometry ───────────────────────────────────────────────────────────────

// // // const pointInPolygon = (point, polygon) => {
// // //   let inside = false
// // //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// // //     const xi = polygon[i].x, yi = polygon[i].y
// // //     const xj = polygon[j].x, yj = polygon[j].y
// // //     if (
// // //       (yi > point.y) !== (yj > point.y) &&
// // //       point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
// // //     ) inside = !inside
// // //   }
// // //   return inside
// // // }

// // // // ── Component ──────────────────────────────────────────────────────────────

// // // const EditFenceCells = () => {
// // //   const { id: propertyId, cameraId } = useParams()
// // //   const navigate = useNavigate()

// // //   // Read camera meta from sessionStorage — no API call needed for type
// // //   const recalibMeta = (() => {
// // //     try { return JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}') }
// // //     catch { return {} }
// // //   })()

// // //   const metaValid  = recalibMeta && String(recalibMeta.cameraId) === String(cameraId)
// // //   const cameraType = metaValid ? (recalibMeta.cameraType || 'fence') : 'fence'
// // //   const isInsider  = cameraType === 'insider'
// // //   const rtspUrl    = metaValid ? recalibMeta.rtspUrl : null
// // //   const streamUrl  = deriveStreamUrl(rtspUrl)

// // //   const [cameraName] = useState(
// // //     metaValid ? (recalibMeta.cameraName || `Camera ${cameraId}`) : `Camera ${cameraId}`
// // //   )

// // //   // ── Refs ───────────────────────────────────────────────────────────────
// // //   const canvasRef    = useRef(null)
// // //   const containerRef = useRef(null)
// // //   const imgRef       = useRef(null)

// // //   // ── State ──────────────────────────────────────────────────────────────
// // //   const [cells,         setCells]         = useState([])
// // //   const [currentPoints, setCurrentPoints] = useState([])
// // //   const [mousePos,      setMousePos]      = useState(null)
// // //   const [isNaming,      setIsNaming]      = useState(false)
// // //   const [pendingCell,   setPendingCell]   = useState(null)
// // //   const [cellName,      setCellName]      = useState('')
// // //   const [nameError,     setNameError]     = useState('')
// // //   const [canvasSize,    setCanvasSize]    = useState({ width: 0, height: 0 })
// // //   const [streamOk,      setStreamOk]      = useState(null)
// // //   const [showHelp,      setShowHelp]      = useState(true)
// // //   const [fencePolygon,  setFencePolygon]  = useState([])
// // //   const [drawingMode,   setDrawingMode]   = useState(false)
// // //   const [selectedCell,  setSelectedCell]  = useState(null)
// // //   const [saveError,     setSaveError]     = useState('')

// // //   // ── API hooks ──────────────────────────────────────────────────────────
// // //   const { data: existingConfig } = useFenceConfig(isInsider ? null : cameraId)
// // //   const { data: existingCells }  = useFenceCells(cameraId)
// // //   const saveCells = useSaveFenceCells()

// // //   const entityLabel = isInsider ? 'zone' : 'cell'

// // //   // ── Canvas size sync ───────────────────────────────────────────────────

// // //   const syncCanvasSize = useCallback(() => {
// // //     const canvas    = canvasRef.current
// // //     const container = containerRef.current
// // //     if (!canvas || !container) return
// // //     const img = imgRef.current
// // //     const w   = container.clientWidth
// // //     const h   = img?.naturalHeight
// // //       ? img.naturalHeight * (w / img.naturalWidth)
// // //       : w * 0.5625
// // //     canvas.width  = w
// // //     canvas.height = h
// // //     setCanvasSize({ width: w, height: h })
// // //   }, [])

// // //   useEffect(() => {
// // //     syncCanvasSize()
// // //     const ro = new ResizeObserver(syncCanvasSize)
// // //     if (containerRef.current) ro.observe(containerRef.current)
// // //     return () => ro.disconnect()
// // //   }, [syncCanvasSize])

// // //   // No stream URL → placeholder immediately
// // //   useEffect(() => {
// // //     if (!streamUrl && streamOk === null) setStreamOk(false)
// // //   }, [streamUrl, streamOk])

// // //   // ── Pre-populate existing cells ────────────────────────────────────────

// // //   useEffect(() => {
// // //     if (!existingCells?.length || canvasSize.width === 0) return
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     setCells(existingCells.map(cell => ({
// // //       cell_name:    cell.cell_name,
// // //       row:          cell.row,
// // //       col:          cell.col,
// // //       canvasPoints: cell.polygon_points.map(p => ({
// // //         x: p.x * canvas.width,
// // //         y: p.y * canvas.height,
// // //       })),
// // //     })))
// // //   }, [existingCells, canvasSize])

// // //   // ── Load fence polygon overlay ─────────────────────────────────────────

// // //   useEffect(() => {
// // //     if (isInsider || canvasSize.width === 0 || !existingConfig?.polygon_points?.length) return
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     setFencePolygon(existingConfig.polygon_points.map(p => ({
// // //       x: p.x * canvas.width,
// // //       y: p.y * canvas.height,
// // //     })))
// // //   }, [isInsider, existingConfig, canvasSize])

// // //   // ── Draw placeholder grid ──────────────────────────────────────────────

// // //   const drawPlaceholder = useCallback(() => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const ctx = canvas.getContext('2d')
// // //     const w   = canvas.width
// // //     const h   = canvas.height
// // //     ctx.clearRect(0, 0, w, h)
// // //     ctx.fillStyle = '#1c1c1c'
// // //     ctx.fillRect(0, 0, w, h)
// // //     ctx.strokeStyle = '#2a2a2a'
// // //     ctx.lineWidth   = 1
// // //     for (let x = 0; x < w; x += 40) {
// // //       ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
// // //     }
// // //     for (let y = 0; y < h; y += 40) {
// // //       ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
// // //     }
// // //     ctx.fillStyle    = '#c5a880'
// // //     ctx.font         = 'bold 15px sans-serif'
// // //     ctx.textAlign    = 'center'
// // //     ctx.textBaseline = 'middle'
// // //     ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
// // //     ctx.fillStyle = '#6b7280'
// // //     ctx.font      = '13px sans-serif'
// // //     ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16)
// // //   }, [])

// // //   // ── Redraw canvas ──────────────────────────────────────────────────────

// // //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const ctx = canvas.getContext('2d')
// // //     const w   = canvas.width
// // //     const h   = canvas.height

// // //     if (streamOk === false) {
// // //       drawPlaceholder()
// // //     } else {
// // //       ctx.clearRect(0, 0, w, h)
// // //     }

// // //     // Fence polygon overlay
// // //     if (!isInsider && fencePolygon.length === 4) {
// // //       ctx.save()
// // //       ctx.fillStyle = 'rgba(0,0,0,0.4)'
// // //       ctx.fillRect(0, 0, w, h)
// // //       ctx.beginPath()
// // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// // //       ctx.closePath()
// // //       ctx.globalCompositeOperation = 'destination-out'
// // //       ctx.fill()
// // //       ctx.globalCompositeOperation = 'source-over'
// // //       ctx.restore()
// // //       ctx.strokeStyle = '#c5a880'
// // //       ctx.lineWidth   = 2
// // //       ctx.setLineDash([6, 3])
// // //       ctx.beginPath()
// // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// // //       ctx.closePath()
// // //       ctx.stroke()
// // //       ctx.setLineDash([])
// // //     }

// // //     // Existing cells
// // //     currentCells.forEach((cell, idx) => {
// // //       const color = CELL_COLORS[idx % CELL_COLORS.length]
// // //       const cPts  = cell.canvasPoints
// // //       const isSel = selIdx === idx

// // //       ctx.beginPath()
// // //       ctx.moveTo(cPts[0].x, cPts[0].y)
// // //       cPts.forEach(p => ctx.lineTo(p.x, p.y))
// // //       ctx.closePath()
// // //       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`
// // //       ctx.fill()
// // //       ctx.strokeStyle = color
// // //       ctx.lineWidth   = isSel ? 3 : 2
// // //       ctx.stroke()

// // //       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length
// // //       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length
// // //       ctx.font      = `bold ${isSel ? 14 : 12}px sans-serif`
// // //       const tw      = ctx.measureText(cell.cell_name).width + 14
// // //       ctx.fillStyle = 'rgba(0,0,0,0.75)'
// // //       ctx.beginPath()
// // //       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5)
// // //       ctx.fill()
// // //       ctx.fillStyle    = 'white'
// // //       ctx.textAlign    = 'center'
// // //       ctx.textBaseline = 'middle'
// // //       ctx.fillText(cell.cell_name, cx, cy)
// // //     })

// // //     // In-progress cell
// // //     if (drawingMode && pts.length > 0) {
// // //       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length]
// // //       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts

// // //       if (previewPts.length >= 3) {
// // //         ctx.beginPath()
// // //         ctx.moveTo(previewPts[0].x, previewPts[0].y)
// // //         previewPts.forEach(p => ctx.lineTo(p.x, p.y))
// // //         ctx.closePath()
// // //         ctx.fillStyle = 'rgba(255,255,255,0.10)'
// // //         ctx.fill()
// // //       }

// // //       ctx.strokeStyle = color
// // //       ctx.lineWidth   = 2
// // //       ctx.setLineDash([6, 3])
// // //       ctx.beginPath()
// // //       ctx.moveTo(pts[0].x, pts[0].y)
// // //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
// // //       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y)
// // //       ctx.stroke()
// // //       ctx.setLineDash([])

// // //       pts.forEach((p, i) => {
// // //         const ptColor = CELL_COLORS[i % CELL_COLORS.length]
// // //         ctx.shadowColor = ptColor; ctx.shadowBlur = 8
// // //         ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
// // //         ctx.fillStyle = ptColor; ctx.fill()
// // //         ctx.shadowBlur = 0
// // //         ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
// // //         ctx.fillStyle = 'white'; ctx.fill()
// // //         ctx.fillStyle = ptColor; ctx.font = 'bold 10px sans-serif'
// // //         ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
// // //         ctx.fillText((i + 1).toString(), p.x, p.y)

// // //         const label = POINT_LABELS[i]
// // //         ctx.font    = 'bold 11px sans-serif'
// // //         const lw    = ctx.measureText(label).width + 10
// // //         const lx    = p.x - lw / 2; const ly = p.y - 28
// // //         ctx.fillStyle = 'rgba(0,0,0,0.8)'
// // //         ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill()
// // //         ctx.fillStyle = ptColor; ctx.textBaseline = 'middle'
// // //         ctx.fillText(label, p.x, ly)
// // //       })
// // //     }
// // //   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider])

// // //   useEffect(() => {
// // //     redrawAll(cells, currentPoints, mousePos, selectedCell)
// // //   }, [cells, currentPoints, mousePos, canvasSize, streamOk, redrawAll, selectedCell])

// // //   // ── Canvas event handlers ──────────────────────────────────────────────

// // //   const getCanvasPoint = (e) => {
// // //     const canvas = canvasRef.current
// // //     const rect   = canvas.getBoundingClientRect()
// // //     return {
// // //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// // //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// // //     }
// // //   }

// // //   const handleMouseMove = (e) => {
// // //     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return
// // //     setMousePos(getCanvasPoint(e))
// // //   }

// // //   const handleCanvasClick = (e) => {
// // //     if (isNaming) return
// // //     const point = getCanvasPoint(e)

// // //     if (!drawingMode) {
// // //       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
// // //       setSelectedCell(idx >= 0 ? idx : null)
// // //       return
// // //     }

// // //     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return

// // //     const newPoints = [...currentPoints, point]
// // //     if (newPoints.length < MAX_CELL_POINTS) {
// // //       setCurrentPoints(newPoints)
// // //       setMousePos(point)
// // //     } else {
// // //       setPendingCell(newPoints)
// // //       setCurrentPoints([])
// // //       setMousePos(null)
// // //       setIsNaming(true)
// // //       setCellName('')
// // //       setNameError('')
// // //     }
// // //   }

// // //   const handleConfirmName = () => {
// // //     const trimmed = cellName.trim()
// // //     if (!trimmed) { setNameError('Please enter a name'); return }
// // //     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
// // //       setNameError('Name already used'); return
// // //     }
// // //     setCells(prev => [...prev, { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell }])
// // //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
// // //   }

// // //   const handleCancelName = () => {
// // //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
// // //   }

// // //   const handleDeleteSelected = () => {
// // //     if (selectedCell === null) return
// // //     setCells(prev => prev.filter((_, i) => i !== selectedCell))
// // //     setSelectedCell(null)
// // //   }

// // //   // ── Normalise ──────────────────────────────────────────────────────────

// // //   const normaliseCells = () =>
// // //     cells.map((cell, idx) => ({
// // //       cell_name:      cell.cell_name,
// // //       row:            idx,
// // //       col:            0,
// // //       polygon_points: cell.canvasPoints.map(p => ({
// // //         x: parseFloat((p.x / canvasSize.width).toFixed(6)),
// // //         y: parseFloat((p.y / canvasSize.height).toFixed(6)),
// // //       })),
// // //     }))

// // //   // ── handleSave — ONLY writes cells ────────────────────────────────────

// // //   const handleSave = async () => {
// // //     if (cells.length === 0) return
// // //     setSaveError('')
// // //     try {
// // //       await saveCells.mutateAsync({ cameraId, cells: normaliseCells() })
// // //       sessionStorage.removeItem('recalibrateCamera')
// // //       navigate(`/property/${propertyId}/cameras`)
// // //     } catch (err) {
// // //       setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
// // //     }
// // //   }

// // //   const isSaving   = saveCells.isPending
// // //   const pointsLeft = MAX_CELL_POINTS - currentPoints.length

// // //   // ── Render ─────────────────────────────────────────────────────────────

// // //   return (
// // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // //       {/* Header */}
// // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // //           <ArrowLeft className="h-6 w-6" />
// // //         </button>
// // //         <div className="ml-3 flex-1 min-w-0">
// // //           <h2 className="text-white font-bold text-lg">
// // //             {isInsider ? 'Redefine Insider Zones' : 'Redefine Fence Cells'}
// // //           </h2>
// // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // //         </div>
// // //         <div className="flex items-center gap-2">
// // //           <button
// // //             onClick={() => { setDrawingMode(m => !m); setCurrentPoints([]); setMousePos(null); setSelectedCell(null) }}
// // //             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
// // //               drawingMode ? 'bg-[#c5a880] text-[#1c1c1c]' : 'bg-white/10 text-white hover:bg-white/20'
// // //             }`}
// // //           >
// // //             {drawingMode ? '✏️ Drawing' : '👆 Select'}
// // //           </button>
// // //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// // //             <Info className="h-5 w-5" />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Step indicator */}
// // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // //         <div className="flex items-center gap-2">
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">1</div>
// // //             <span className="text-[#c5a880] text-xs font-bold">{isInsider ? 'Redefine Zones' : 'Redefine Cells'}</span>
// // //           </div>
// // //           <div className="flex-1 h-px bg-white/10" />
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">2</div>
// // //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Help banner */}
// // //       {showHelp && (
// // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // //           <div className="flex items-start gap-3">
// // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // //               <p className="font-bold mb-1">{isInsider ? 'Redefine interior zones:' : 'Redefine fence cells:'}</p>
// // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// // //                 <li>Switch to <strong>Drawing</strong> mode</li>
// // //                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
// // //                 <li>Name the {entityLabel} when prompted</li>
// // //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// // //               </ol>
// // //               <p className="text-emerald-400/80 text-xs mt-2 font-medium">
// // //                 ✅ Camera and polygon already saved — only cells will be updated.
// // //               </p>
// // //             </div>
// // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Stream unavailable banner */}
// // //       {streamOk === false && (
// // //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// // //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// // //           <p className="text-amber-300 text-xs">Stream unavailable — drawing on placeholder.</p>
// // //         </div>
// // //       )}

// // //       {/* Canvas + stream stacked */}
// // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // //         {/* MJPEG stream — behind canvas */}
// // //         {streamUrl && (
// // //           <img
// // //             ref={imgRef}
// // //             src={streamUrl}
// // //             alt="Live camera"
// // //             onLoad={() => { setStreamOk(true); syncCanvasSize() }}
// // //             onError={() => setStreamOk(false)}
// // //             className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
// // //               streamOk === true ? 'opacity-100' : 'opacity-0'
// // //             }`}
// // //           />
// // //         )}

// // //         {/* Connecting spinner */}
// // //         {streamUrl && streamOk === null && (
// // //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10 pointer-events-none">
// // //             <div className={theme.ui.spinner} />
// // //             <p className="text-gray-400 mt-4 text-sm">Connecting to camera…</p>
// // //           </div>
// // //         )}

// // //         {/* Canvas overlay */}
// // //         <canvas
// // //           ref={canvasRef}
// // //           onClick={handleCanvasClick}
// // //           onMouseMove={handleMouseMove}
// // //           className={`relative w-full transition-opacity duration-300 ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
// // //           style={{ display: 'block', background: 'transparent' }}
// // //         />

// // //         {/* Cell counter badge */}
// // //         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
// // //           <p className="text-white font-mono text-sm font-bold">
// // //             {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
// // //           </p>
// // //           {drawingMode && currentPoints.length > 0 && (
// // //             <>
// // //               <div className="flex gap-1 mt-1 justify-center">
// // //                 {[0, 1, 2, 3].map(i => (
// // //                   <div
// // //                     key={i}
// // //                     style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // //                     className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
// // //                   />
// // //                 ))}
// // //               </div>
// // //               <p className="text-[#c5a880] text-xs mt-1">{pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left</p>
// // //             </>
// // //           )}
// // //           {drawingMode && currentPoints.length === 0 && (
// // //             <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
// // //           )}
// // //         </div>

// // //         {/* Selected cell action bar */}
// // //         {selectedCell !== null && !drawingMode && (
// // //           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
// // //             <div className="text-sm font-bold text-[#1c1c1c]">{cells[selectedCell]?.cell_name}</div>
// // //             <button onClick={handleDeleteSelected} className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full">
// // //               <Trash2 className="w-4 h-4" /> Delete
// // //             </button>
// // //             <button onClick={() => setSelectedCell(null)} className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">✕</button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Cell name modal */}
// // //       {isNaming && (
// // //         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
// // //           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // //             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">Name This {isInsider ? 'Zone' : 'Cell'}</h3>
// // //             <p className="text-gray-500 text-sm mb-4">
// // //               {isInsider ? 'e.g. "Reception", "Office A", "Server Room"' : 'e.g. "A1", "B2", "Gate A"'}
// // //             </p>
// // //             <input
// // //               type="text"
// // //               value={cellName}
// // //               onChange={e => { setCellName(e.target.value); setNameError('') }}
// // //               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
// // //               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
// // //               autoFocus
// // //               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${
// // //                 nameError ? 'border-red-400 bg-red-50' : 'border-[#e6e3db] focus:border-[#c5a880]'
// // //               }`}
// // //             />
// // //             {nameError && <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>}
// // //             {cells.length > 0 && (
// // //               <div className="mt-3 flex flex-wrap gap-1">
// // //                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
// // //                 {cells.map(c => (
// // //                   <span key={c.cell_name} className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium">
// // //                     {c.cell_name}
// // //                   </span>
// // //                 ))}
// // //               </div>
// // //             )}
// // //             <div className="flex gap-3 mt-5">
// // //               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
// // //               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
// // //                 <CheckCircle className="w-4 h-4" /> Confirm
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Bottom bar */}
// // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

// // //         {saveError && (
// // //           <div className={`${theme.alert.error} text-sm`}>
// // //             <AlertTriangle className="w-4 h-4 shrink-0" />
// // //             <span>{saveError}</span>
// // //           </div>
// // //         )}

// // //         {cells.length > 0 && (
// // //           <div className="flex gap-2 overflow-x-auto pb-1">
// // //             {cells.map((cell, idx) => (
// // //               <button
// // //                 key={cell.cell_name}
// // //                 onClick={() => { setDrawingMode(false); setSelectedCell(idx) }}
// // //                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
// // //                   selectedCell === idx ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
// // //                 }`}
// // //               >
// // //                 {cell.cell_name}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         )}

// // //         <div className="text-sm text-gray-500">
// // //           {cells.length === 0 && currentPoints.length === 0 && `Switch to Drawing — click 4 corners of each ${entityLabel}`}
// // //           {drawingMode && currentPoints.length === 0 && cells.length > 0 && `Click Top-Left corner to start a new ${entityLabel}`}
// // //           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
// // //           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
// // //           {drawingMode && currentPoints.length === 3 && `Click Bottom-Left to close the ${entityLabel}`}
// // //           {!drawingMode && cells.length > 0 && `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
// // //         </div>

// // //         {drawingMode && (
// // //           <div className="flex items-center gap-2">
// // //             {[0, 1, 2, 3].map(i => (
// // //               <div key={i} className="flex items-center gap-1.5 flex-1">
// // //                 <div
// // //                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // //                   className={`w-3 h-3 rounded-full border-2 transition-all ${
// // //                     i < currentPoints.length ? 'border-transparent scale-110'
// // //                     : i === currentPoints.length ? 'border-white/60 bg-white/20 animate-pulse'
// // //                     : 'border-white/20 bg-transparent'
// // //                   }`}
// // //                 />
// // //                 <span className={`text-xs ${
// // //                   i < currentPoints.length ? 'text-white/80'
// // //                   : i === currentPoints.length ? 'text-white/50'
// // //                   : 'text-white/20'
// // //                 }`}>{POINT_LABELS[i]}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}

// // //         <div className="flex gap-3">
// // //           <button
// // //             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null) }}
// // //             className={theme.button.secondary}
// // //             disabled={currentPoints.length === 0}
// // //             title="Undo last point"
// // //           >
// // //             <RotateCcw className="w-4 h-4" />
// // //           </button>
// // //           <button
// // //             onClick={() => { setDrawingMode(true); setSelectedCell(null); setCurrentPoints([]); setMousePos(null) }}
// // //             className={theme.button.secondary}
// // //           >
// // //             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
// // //           </button>
// // //           <button
// // //             onClick={handleSave}
// // //             disabled={cells.length === 0 || isSaving}
// // //             className={`${theme.button.primary} flex-1`}
// // //           >
// // //             {isSaving
// // //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
// // //               : <><Save className="w-4 h-4" /> Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
// // //             }
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default EditFenceCells

// // // src/pages/EditFenceCells.jsx
// // //
// // // RECALIBRATE FLOW — redefine cells/zones on an EXISTING camera.
// // //
// // // Frame strategy — no backend fetch needed:
// // //   - Stream URL derived from recalibrateCamera.rtspUrl in sessionStorage
// // //   - <img> displays MJPEG stream behind a transparent <canvas>
// // //   - If stream errors → canvas draws placeholder grid
// // //
// // // DB writes: ONLY saveCells — camera & polygon already exist in DB.

// // import { useState, useRef, useEffect, useCallback } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   ArrowLeft, Save, RotateCcw, CheckCircle,
// //   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// // } from 'lucide-react'
// // import { useFenceConfig } from '../hooks/useFenceConfig'
// // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // import { theme } from '../theme'

// // // ── Constants ──────────────────────────────────────────────────────────────

// // const CELL_COLORS = [
// //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // ]
// // const POINT_LABELS   = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
// // const MAX_CELL_POINTS = 4

// // // ── Derive MJPEG stream URL ────────────────────────────────────────────────

// // const deriveStreamUrl = (rtspUrl) => {
// //   if (!rtspUrl) return null
// //   try {
// //     const u = new URL(rtspUrl.replace(/^rtsp:\/\//i, 'http://'))
// //     return `${u.protocol}//${u.hostname}:8080/video`
// //   } catch {
// //     return null
// //   }
// // }

// // // ── Geometry ───────────────────────────────────────────────────────────────

// // const pointInPolygon = (point, polygon) => {
// //   let inside = false
// //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// //     const xi = polygon[i].x, yi = polygon[i].y
// //     const xj = polygon[j].x, yj = polygon[j].y
// //     if (
// //       (yi > point.y) !== (yj > point.y) &&
// //       point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
// //     ) inside = !inside
// //   }
// //   return inside
// // }

// // // ── Component ──────────────────────────────────────────────────────────────

// // const EditFenceCells = () => {
// //   const { id: propertyId, cameraId } = useParams()
// //   const navigate = useNavigate()

// //   // Read camera meta from sessionStorage — no API call needed for type
// //   const recalibMeta = (() => {
// //     try { return JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}') }
// //     catch { return {} }
// //   })()

// //   const metaValid  = recalibMeta && String(recalibMeta.cameraId) === String(cameraId)
// //   const cameraType = metaValid ? (recalibMeta.cameraType || 'fence') : 'fence'
// //   const isInsider  = cameraType === 'insider'
// //   const rtspUrl    = metaValid ? recalibMeta.rtspUrl : null
// //   const streamUrl  = deriveStreamUrl(rtspUrl)

// //   const [cameraName] = useState(
// //     metaValid ? (recalibMeta.cameraName || `Camera ${cameraId}`) : `Camera ${cameraId}`
// //   )

// //   // ── Refs ───────────────────────────────────────────────────────────────
// //   const canvasRef    = useRef(null)
// //   const containerRef = useRef(null)
// //   const imgRef       = useRef(null)

// //   // ── State ──────────────────────────────────────────────────────────────
// //   const [cells,         setCells]         = useState([])
// //   const [currentPoints, setCurrentPoints] = useState([])
// //   const [mousePos,      setMousePos]      = useState(null)
// //   const [isNaming,      setIsNaming]      = useState(false)
// //   const [pendingCell,   setPendingCell]   = useState(null)
// //   const [cellName,      setCellName]      = useState('')
// //   const [nameError,     setNameError]     = useState('')
// //   const [canvasSize,    setCanvasSize]    = useState({ width: 0, height: 0 })
// //   const [streamOk,      setStreamOk]      = useState(null)
// //   const [showHelp,      setShowHelp]      = useState(true)
// //   const [fencePolygon,  setFencePolygon]  = useState([])
// //   const [drawingMode,   setDrawingMode]   = useState(false)
// //   const [selectedCell,  setSelectedCell]  = useState(null)
// //   const [saveError,     setSaveError]     = useState('')

// //   // ── API hooks ──────────────────────────────────────────────────────────
// //   const { data: existingConfig } = useFenceConfig(isInsider ? null : cameraId)
// //   const { data: existingCells }  = useFenceCells(cameraId)
// //   const saveCells = useSaveFenceCells()

// //   const entityLabel = isInsider ? 'zone' : 'cell'

// //   // ── Canvas size sync ───────────────────────────────────────────────────

// //   const syncCanvasSize = useCallback(() => {
// //     const canvas    = canvasRef.current
// //     const container = containerRef.current
// //     if (!canvas || !container) return
// //     const img = imgRef.current
// //     const w   = container.clientWidth
// //     const h   = img?.naturalHeight
// //       ? img.naturalHeight * (w / img.naturalWidth)
// //       : w * 0.5625
// //     canvas.width  = w
// //     canvas.height = h
// //     setCanvasSize({ width: w, height: h })
// //   }, [])

// //   useEffect(() => {
// //     syncCanvasSize()
// //     const ro = new ResizeObserver(syncCanvasSize)
// //     if (containerRef.current) ro.observe(containerRef.current)
// //     return () => ro.disconnect()
// //   }, [syncCanvasSize])

// //   // No stream URL → placeholder immediately
// //   useEffect(() => {
// //     if (!streamUrl && streamOk === null) setStreamOk(false)
// //   }, [streamUrl, streamOk])

// //   // ── Pre-populate existing cells ────────────────────────────────────────

// //   useEffect(() => {
// //     if (!existingCells?.length || canvasSize.width === 0) return
// //     const canvas = canvasRef.current
// //     if (!canvas) return
// //     setCells(existingCells.map(cell => ({
// //       cell_name:    cell.cell_name,
// //       row:          cell.row,
// //       col:          cell.col,
// //       canvasPoints: cell.polygon_points.map(p => ({
// //         x: p.x * canvas.width,
// //         y: p.y * canvas.height,
// //       })),
// //     })))
// //   }, [existingCells, canvasSize])

// //   // ── Load fence polygon overlay ─────────────────────────────────────────

// //   useEffect(() => {
// //     if (isInsider || canvasSize.width === 0 || !existingConfig?.polygon_points?.length) return
// //     const canvas = canvasRef.current
// //     if (!canvas) return
// //     setFencePolygon(existingConfig.polygon_points.map(p => ({
// //       x: p.x * canvas.width,
// //       y: p.y * canvas.height,
// //     })))
// //   }, [isInsider, existingConfig, canvasSize])

// //   // ── Draw placeholder grid ──────────────────────────────────────────────

// //   const drawPlaceholder = useCallback(() => {
// //     const canvas = canvasRef.current
// //     if (!canvas) return
// //     const ctx = canvas.getContext('2d')
// //     const w   = canvas.width
// //     const h   = canvas.height
// //     ctx.clearRect(0, 0, w, h)
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
// //     ctx.font         = 'bold 15px sans-serif'
// //     ctx.textAlign    = 'center'
// //     ctx.textBaseline = 'middle'
// //     ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
// //     ctx.fillStyle = '#6b7280'
// //     ctx.font      = '13px sans-serif'
// //     ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16)
// //   }, [])

// //   // ── Redraw canvas ──────────────────────────────────────────────────────

// //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// //     const canvas = canvasRef.current
// //     if (!canvas) return
// //     const ctx = canvas.getContext('2d')
// //     const w   = canvas.width
// //     const h   = canvas.height

// //     if (streamOk === false) {
// //       drawPlaceholder()
// //     } else {
// //       ctx.clearRect(0, 0, w, h)
// //     }

// //     // Fence polygon overlay
// //     if (!isInsider && fencePolygon.length === 4) {
// //       ctx.save()
// //       ctx.fillStyle = 'rgba(0,0,0,0.4)'
// //       ctx.fillRect(0, 0, w, h)
// //       ctx.beginPath()
// //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// //       ctx.closePath()
// //       ctx.globalCompositeOperation = 'destination-out'
// //       ctx.fill()
// //       ctx.globalCompositeOperation = 'source-over'
// //       ctx.restore()
// //       ctx.strokeStyle = '#c5a880'
// //       ctx.lineWidth   = 2
// //       ctx.setLineDash([6, 3])
// //       ctx.beginPath()
// //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
// //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
// //       ctx.closePath()
// //       ctx.stroke()
// //       ctx.setLineDash([])
// //     }

// //     // Existing cells
// //     currentCells.forEach((cell, idx) => {
// //       const color = CELL_COLORS[idx % CELL_COLORS.length]
// //       const cPts  = cell.canvasPoints
// //       const isSel = selIdx === idx

// //       ctx.beginPath()
// //       ctx.moveTo(cPts[0].x, cPts[0].y)
// //       cPts.forEach(p => ctx.lineTo(p.x, p.y))
// //       ctx.closePath()
// //       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`
// //       ctx.fill()
// //       ctx.strokeStyle = color
// //       ctx.lineWidth   = isSel ? 3 : 2
// //       ctx.stroke()

// //       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length
// //       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length
// //       ctx.font      = `bold ${isSel ? 14 : 12}px sans-serif`
// //       const tw      = ctx.measureText(cell.cell_name).width + 14
// //       ctx.fillStyle = 'rgba(0,0,0,0.75)'
// //       ctx.beginPath()
// //       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5)
// //       ctx.fill()
// //       ctx.fillStyle    = 'white'
// //       ctx.textAlign    = 'center'
// //       ctx.textBaseline = 'middle'
// //       ctx.fillText(cell.cell_name, cx, cy)
// //     })

// //     // In-progress cell
// //     if (drawingMode && pts.length > 0) {
// //       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length]
// //       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts

// //       if (previewPts.length >= 3) {
// //         ctx.beginPath()
// //         ctx.moveTo(previewPts[0].x, previewPts[0].y)
// //         previewPts.forEach(p => ctx.lineTo(p.x, p.y))
// //         ctx.closePath()
// //         ctx.fillStyle = 'rgba(255,255,255,0.10)'
// //         ctx.fill()
// //       }

// //       ctx.strokeStyle = color
// //       ctx.lineWidth   = 2
// //       ctx.setLineDash([6, 3])
// //       ctx.beginPath()
// //       ctx.moveTo(pts[0].x, pts[0].y)
// //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
// //       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y)
// //       ctx.stroke()
// //       ctx.setLineDash([])

// //       pts.forEach((p, i) => {
// //         const ptColor = CELL_COLORS[i % CELL_COLORS.length]
// //         ctx.shadowColor = ptColor; ctx.shadowBlur = 8
// //         ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
// //         ctx.fillStyle = ptColor; ctx.fill()
// //         ctx.shadowBlur = 0
// //         ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
// //         ctx.fillStyle = 'white'; ctx.fill()
// //         ctx.fillStyle = ptColor; ctx.font = 'bold 10px sans-serif'
// //         ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
// //         ctx.fillText((i + 1).toString(), p.x, p.y)

// //         const label = POINT_LABELS[i]
// //         ctx.font    = 'bold 11px sans-serif'
// //         const lw    = ctx.measureText(label).width + 10
// //         const lx    = p.x - lw / 2; const ly = p.y - 28
// //         ctx.fillStyle = 'rgba(0,0,0,0.8)'
// //         ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill()
// //         ctx.fillStyle = ptColor; ctx.textBaseline = 'middle'
// //         ctx.fillText(label, p.x, ly)
// //       })
// //     }
// //   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider])

// //   useEffect(() => {
// //     redrawAll(cells, currentPoints, mousePos, selectedCell)
// //   }, [cells, currentPoints, mousePos, canvasSize, streamOk, redrawAll, selectedCell])

// //   // ── Canvas event handlers ──────────────────────────────────────────────

// //   const getCanvasPoint = (e) => {
// //     const canvas = canvasRef.current
// //     const rect   = canvas.getBoundingClientRect()
// //     return {
// //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// //     }
// //   }

// //   const handleMouseMove = (e) => {
// //     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return
// //     setMousePos(getCanvasPoint(e))
// //   }

// //   const handleCanvasClick = (e) => {
// //     if (isNaming) return
// //     const point = getCanvasPoint(e)

// //     if (!drawingMode) {
// //       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
// //       setSelectedCell(idx >= 0 ? idx : null)
// //       return
// //     }

// //     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return

// //     const newPoints = [...currentPoints, point]
// //     if (newPoints.length < MAX_CELL_POINTS) {
// //       setCurrentPoints(newPoints)
// //       setMousePos(point)
// //     } else {
// //       setPendingCell(newPoints)
// //       setCurrentPoints([])
// //       setMousePos(null)
// //       setIsNaming(true)
// //       setCellName('')
// //       setNameError('')
// //     }
// //   }

// //   const handleConfirmName = () => {
// //     const trimmed = cellName.trim()
// //     if (!trimmed) { setNameError('Please enter a name'); return }
// //     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
// //       setNameError('Name already used'); return
// //     }
// //     setCells(prev => [...prev, { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell }])
// //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
// //   }

// //   const handleCancelName = () => {
// //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
// //   }

// //   const handleDeleteSelected = () => {
// //     if (selectedCell === null) return
// //     setCells(prev => prev.filter((_, i) => i !== selectedCell))
// //     setSelectedCell(null)
// //   }

// //   // ── Normalise ──────────────────────────────────────────────────────────

// //   const normaliseCells = () =>
// //     cells.map((cell, idx) => ({
// //       cell_name:      cell.cell_name,
// //       row:            idx,
// //       col:            0,
// //       polygon_points: cell.canvasPoints.map(p => ({
// //         x: parseFloat((p.x / canvasSize.width).toFixed(6)),
// //         y: parseFloat((p.y / canvasSize.height).toFixed(6)),
// //       })),
// //     }))

// //   // ── handleSave — ONLY writes cells ────────────────────────────────────

// //   const handleSave = async () => {
// //     if (cells.length === 0) return
// //     setSaveError('')
// //     try {
// //       await saveCells.mutateAsync({ cameraId, cells: normaliseCells() })
// //       sessionStorage.removeItem('recalibrateCamera')
// //       navigate(`/property/${propertyId}/cameras`)
// //     } catch (err) {
// //       setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
// //     }
// //   }

// //   const isSaving   = saveCells.isPending
// //   const pointsLeft = MAX_CELL_POINTS - currentPoints.length

// //   // ── Render ─────────────────────────────────────────────────────────────

// //   return (
// //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// //       {/* Header */}
// //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// //           <ArrowLeft className="h-6 w-6" />
// //         </button>
// //         <div className="ml-3 flex-1 min-w-0">
// //           <h2 className="text-white font-bold text-lg">
// //             {isInsider ? 'Redefine Insider Zones' : 'Redefine Fence Cells'}
// //           </h2>
// //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <button
// //             onClick={() => { setDrawingMode(m => !m); setCurrentPoints([]); setMousePos(null); setSelectedCell(null) }}
// //             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
// //               drawingMode ? 'bg-[#c5a880] text-[#1c1c1c]' : 'bg-white/10 text-white hover:bg-white/20'
// //             }`}
// //           >
// //             {drawingMode ? '✏️ Drawing' : '👆 Select'}
// //           </button>
// //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// //             <Info className="h-5 w-5" />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Step indicator */}
// //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// //         <div className="flex items-center gap-2">
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">1</div>
// //             <span className="text-[#c5a880] text-xs font-bold">{isInsider ? 'Redefine Zones' : 'Redefine Cells'}</span>
// //           </div>
// //           <div className="flex-1 h-px bg-white/10" />
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">2</div>
// //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Help banner */}
// //       {showHelp && (
// //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// //           <div className="flex items-start gap-3">
// //             <div className="text-sm text-[#c5a880]/90 flex-1">
// //               <p className="font-bold mb-1">{isInsider ? 'Redefine interior zones:' : 'Redefine fence cells:'}</p>
// //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// //                 <li>Switch to <strong>Drawing</strong> mode</li>
// //                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
// //                 <li>Name the {entityLabel} when prompted</li>
// //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// //               </ol>
// //               <p className="text-emerald-400/80 text-xs mt-2 font-medium">
// //                 ✅ Camera and polygon already saved — only cells will be updated.
// //               </p>
// //             </div>
// //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Stream unavailable banner */}
// //       {streamOk === false && (
// //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// //           <p className="text-amber-300 text-xs">Stream unavailable — drawing on placeholder.</p>
// //         </div>
// //       )}

// //       {/* Canvas + stream stacked */}
// //       <div className="flex-1 relative bg-black" ref={containerRef}>

// //         {/* MJPEG stream — behind canvas */}
// //         {streamUrl && (
// //           <img
// //             ref={imgRef}
// //             src={streamUrl}
// //             alt="Live camera"
// //             onLoad={() => { setStreamOk(true); syncCanvasSize() }}
// //             onError={() => setStreamOk(false)}
// //             className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
// //               streamOk === true ? 'opacity-100' : 'opacity-0'
// //             }`}
// //           />
// //         )}

// //         {/* Connecting spinner */}
// //         {streamUrl && streamOk === null && (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10 pointer-events-none">
// //             <div className={theme.ui.spinner} />
// //             <p className="text-gray-400 mt-4 text-sm">Connecting to camera…</p>
// //           </div>
// //         )}

// //         {/* Canvas overlay */}
// //         <canvas
// //           ref={canvasRef}
// //           onClick={handleCanvasClick}
// //           onMouseMove={handleMouseMove}
// //           className={`relative w-full transition-opacity duration-300 ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
// //           style={{ display: 'block', background: 'transparent' }}
// //         />

// //         {/* Cell counter badge */}
// //         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
// //           <p className="text-white font-mono text-sm font-bold">
// //             {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
// //           </p>
// //           {drawingMode && currentPoints.length > 0 && (
// //             <>
// //               <div className="flex gap-1 mt-1 justify-center">
// //                 {[0, 1, 2, 3].map(i => (
// //                   <div
// //                     key={i}
// //                     style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// //                     className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
// //                   />
// //                 ))}
// //               </div>
// //               <p className="text-[#c5a880] text-xs mt-1">{pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left</p>
// //             </>
// //           )}
// //           {drawingMode && currentPoints.length === 0 && (
// //             <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
// //           )}
// //         </div>

// //         {/* Selected cell action bar */}
// //         {selectedCell !== null && !drawingMode && (
// //           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
// //             <div className="text-sm font-bold text-[#1c1c1c]">{cells[selectedCell]?.cell_name}</div>
// //             <button onClick={handleDeleteSelected} className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full">
// //               <Trash2 className="w-4 h-4" /> Delete
// //             </button>
// //             <button onClick={() => setSelectedCell(null)} className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">✕</button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Cell name modal */}
// //       {isNaming && (
// //         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
// //           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// //             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">Name This {isInsider ? 'Zone' : 'Cell'}</h3>
// //             <p className="text-gray-500 text-sm mb-4">
// //               {isInsider ? 'e.g. "Reception", "Office A", "Server Room"' : 'e.g. "A1", "B2", "Gate A"'}
// //             </p>
// //             <input
// //               type="text"
// //               value={cellName}
// //               onChange={e => { setCellName(e.target.value); setNameError('') }}
// //               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
// //               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
// //               autoFocus
// //               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${
// //                 nameError ? 'border-red-400 bg-red-50' : 'border-[#e6e3db] focus:border-[#c5a880]'
// //               }`}
// //             />
// //             {nameError && <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>}
// //             {cells.length > 0 && (
// //               <div className="mt-3 flex flex-wrap gap-1">
// //                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
// //                 {cells.map(c => (
// //                   <span key={c.cell_name} className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium">
// //                     {c.cell_name}
// //                   </span>
// //                 ))}
// //               </div>
// //             )}
// //             <div className="flex gap-3 mt-5">
// //               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
// //               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
// //                 <CheckCircle className="w-4 h-4" /> Confirm
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Bottom bar */}
// //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

// //         {saveError && (
// //           <div className={`${theme.alert.error} text-sm`}>
// //             <AlertTriangle className="w-4 h-4 shrink-0" />
// //             <span>{saveError}</span>
// //           </div>
// //         )}

// //         {cells.length > 0 && (
// //           <div className="flex gap-2 overflow-x-auto pb-1">
// //             {cells.map((cell, idx) => (
// //               <button
// //                 key={cell.cell_name}
// //                 onClick={() => { setDrawingMode(false); setSelectedCell(idx) }}
// //                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
// //                   selectedCell === idx ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
// //                 }`}
// //               >
// //                 {cell.cell_name}
// //               </button>
// //             ))}
// //           </div>
// //         )}

// //         <div className="text-sm text-gray-500">
// //           {cells.length === 0 && currentPoints.length === 0 && `Switch to Drawing — click 4 corners of each ${entityLabel}`}
// //           {drawingMode && currentPoints.length === 0 && cells.length > 0 && `Click Top-Left corner to start a new ${entityLabel}`}
// //           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
// //           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
// //           {drawingMode && currentPoints.length === 3 && `Click Bottom-Left to close the ${entityLabel}`}
// //           {!drawingMode && cells.length > 0 && `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
// //         </div>

// //         {drawingMode && (
// //           <div className="flex items-center gap-2">
// //             {[0, 1, 2, 3].map(i => (
// //               <div key={i} className="flex items-center gap-1.5 flex-1">
// //                 <div
// //                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// //                   className={`w-3 h-3 rounded-full border-2 transition-all ${
// //                     i < currentPoints.length ? 'border-transparent scale-110'
// //                     : i === currentPoints.length ? 'border-white/60 bg-white/20 animate-pulse'
// //                     : 'border-white/20 bg-transparent'
// //                   }`}
// //                 />
// //                 <span className={`text-xs ${
// //                   i < currentPoints.length ? 'text-white/80'
// //                   : i === currentPoints.length ? 'text-white/50'
// //                   : 'text-white/20'
// //                 }`}>{POINT_LABELS[i]}</span>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         <div className="flex gap-3">
// //           <button
// //             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null) }}
// //             className={theme.button.secondary}
// //             disabled={currentPoints.length === 0}
// //             title="Undo last point"
// //           >
// //             <RotateCcw className="w-4 h-4" />
// //           </button>
// //           <button
// //             onClick={() => { setDrawingMode(true); setSelectedCell(null); setCurrentPoints([]); setMousePos(null) }}
// //             className={theme.button.secondary}
// //           >
// //             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
// //           </button>
// //           <button
// //             onClick={handleSave}
// //             disabled={cells.length === 0 || isSaving}
// //             className={`${theme.button.primary} flex-1`}
// //           >
// //             {isSaving
// //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
// //               : <><Save className="w-4 h-4" /> Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
// //             }
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default EditFenceCells


// // src/pages/EditFenceCells.jsx
// //
// // RECALIBRATE FLOW — redefine cells/zones on an EXISTING camera.
// //
// // Frame strategy — no backend fetch needed:
// //   - Stream URL derived from recalibrateCamera.rtspUrl in sessionStorage
// //   - <img> displays MJPEG stream behind a transparent <canvas>
// //   - If stream errors → canvas draws placeholder grid
// //
// // DB writes: ONLY saveCells — camera & polygon already exist in DB.

// import { useState, useRef, useEffect, useCallback } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, Save, RotateCcw, CheckCircle,
//   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// } from 'lucide-react'
// import { useFenceConfig } from '../hooks/useFenceConfig'
// import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// import { useCameras } from '../hooks/useCameras'
// import { theme } from '../theme'

// // ── Constants ──────────────────────────────────────────────────────────────

// const CELL_COLORS = [
//   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
//   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
//   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// ]
// const POINT_LABELS   = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
// const MAX_CELL_POINTS = 4

// // ── Derive MJPEG stream URL ────────────────────────────────────────────────

// const deriveStreamUrl = (rtspUrl) => {
//   if (!rtspUrl) return null
//   try {
//     const u = new URL(rtspUrl.replace(/^rtsp:\/\//i, 'http://'))
//     return `${u.protocol}//${u.hostname}:8080/video`
//   } catch {
//     return null
//   }
// }

// // ── Geometry ───────────────────────────────────────────────────────────────

// const pointInPolygon = (point, polygon) => {
//   let inside = false
//   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//     const xi = polygon[i].x, yi = polygon[i].y
//     const xj = polygon[j].x, yj = polygon[j].y
//     if (
//       (yi > point.y) !== (yj > point.y) &&
//       point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
//     ) inside = !inside
//   }
//   return inside
// }

// // ── Component ──────────────────────────────────────────────────────────────

// const EditFenceCells = () => {
//   const { id: propertyId, cameraId } = useParams()
//   const navigate = useNavigate()

//   // ── Load recalibrate meta from sessionStorage ──────────────────────────
//   const [recalibMeta] = useState(() => {
//     try {
//       const raw = sessionStorage.getItem('recalibrateCamera')
//       if (!raw || raw === 'null') return null
//       return JSON.parse(raw)
//     } catch { return null }
//   })

//   const metaValid = recalibMeta != null && String(recalibMeta.cameraId) === String(cameraId)

//   // ── Fallback: fetch camera from backend if sessionStorage missing ──────
//   const { data: fetchedCamera } = useCameras(!metaValid ? cameraId : null)

//   // Prefer sessionStorage data, fall back to fetched camera
//   const cameraType = metaValid
//     ? (recalibMeta.cameraType || 'fence')
//     : (fetchedCamera?.camera_type || 'fence')

//   const isInsider = cameraType === 'insider'

//   // Stream URL: prefer sessionStorage, fall back to fetched camera
//   const rtspUrl = metaValid
//     ? recalibMeta.rtspUrl
//     : fetchedCamera?.rtsp_url

//   const streamUrl = deriveStreamUrl(rtspUrl)

//   const cameraName = metaValid
//     ? (recalibMeta.cameraName || `Camera ${cameraId}`)
//     : (fetchedCamera?.name || `Camera ${cameraId}`)

//   // ── Refs ───────────────────────────────────────────────────────────────
//   const canvasRef    = useRef(null)
//   const containerRef = useRef(null)
//   const imgRef       = useRef(null)

//   // ── State ──────────────────────────────────────────────────────────────
//   const [cells,         setCells]         = useState([])
//   const [currentPoints, setCurrentPoints] = useState([])
//   const [mousePos,      setMousePos]      = useState(null)
//   const [isNaming,      setIsNaming]      = useState(false)
//   const [pendingCell,   setPendingCell]   = useState(null)
//   const [cellName,      setCellName]      = useState('')
//   const [nameError,     setNameError]     = useState('')
//   const [canvasSize,    setCanvasSize]    = useState({ width: 0, height: 0 })
//   const [streamOk,      setStreamOk]      = useState(null)
//   const [showHelp,      setShowHelp]      = useState(true)
//   const [fencePolygon,  setFencePolygon]  = useState([])
//   const [drawingMode,   setDrawingMode]   = useState(false)
//   const [selectedCell,  setSelectedCell]  = useState(null)
//   const [saveError,     setSaveError]     = useState('')

//   // ── API hooks ──────────────────────────────────────────────────────────
//   const { data: existingConfig } = useFenceConfig(isInsider ? null : cameraId)
//   const { data: existingCells }  = useFenceCells(cameraId)
//   const saveCells = useSaveFenceCells()

//   const entityLabel = isInsider ? 'zone' : 'cell'

//   // ── Canvas size sync ───────────────────────────────────────────────────

//   const syncCanvasSize = useCallback(() => {
//     const canvas    = canvasRef.current
//     const container = containerRef.current
//     if (!canvas || !container) return
//     const img = imgRef.current
//     const w   = container.clientWidth
//     const h   = img?.naturalHeight
//       ? img.naturalHeight * (w / img.naturalWidth)
//       : w * 0.5625
//     canvas.width  = w
//     canvas.height = h
//     setCanvasSize({ width: w, height: h })
//   }, [])

//   useEffect(() => {
//     syncCanvasSize()
//     const ro = new ResizeObserver(syncCanvasSize)
//     if (containerRef.current) ro.observe(containerRef.current)
//     return () => ro.disconnect()
//   }, [syncCanvasSize])

//   // No stream URL → placeholder immediately
//   useEffect(() => {
//     if (!streamUrl && streamOk === null) setStreamOk(false)
//   }, [streamUrl, streamOk])

//   // ── Pre-populate existing cells ────────────────────────────────────────

//   useEffect(() => {
//     if (!existingCells?.length || canvasSize.width === 0) return
//     const canvas = canvasRef.current
//     if (!canvas) return
//     setCells(existingCells.map(cell => ({
//       cell_name:    cell.cell_name,
//       row:          cell.row,
//       col:          cell.col,
//       canvasPoints: cell.polygon_points.map(p => ({
//         x: p.x * canvas.width,
//         y: p.y * canvas.height,
//       })),
//     })))
//   }, [existingCells, canvasSize])

//   // ── Load fence polygon overlay ─────────────────────────────────────────

//   useEffect(() => {
//     if (isInsider || canvasSize.width === 0 || !existingConfig?.polygon_points?.length) return
//     const canvas = canvasRef.current
//     if (!canvas) return
//     setFencePolygon(existingConfig.polygon_points.map(p => ({
//       x: p.x * canvas.width,
//       y: p.y * canvas.height,
//     })))
//   }, [isInsider, existingConfig, canvasSize])

//   // ── Draw placeholder grid ──────────────────────────────────────────────

//   const drawPlaceholder = useCallback(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     const w   = canvas.width
//     const h   = canvas.height
//     ctx.clearRect(0, 0, w, h)
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
//     ctx.font         = 'bold 15px sans-serif'
//     ctx.textAlign    = 'center'
//     ctx.textBaseline = 'middle'
//     ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
//     ctx.fillStyle = '#6b7280'
//     ctx.font      = '13px sans-serif'
//     ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16)
//   }, [])

//   // ── Redraw canvas ──────────────────────────────────────────────────────

//   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     const w   = canvas.width
//     const h   = canvas.height

//     if (streamOk === false) {
//       drawPlaceholder()
//     } else {
//       ctx.clearRect(0, 0, w, h)
//     }

//     // Fence polygon overlay
//     if (!isInsider && fencePolygon.length === 4) {
//       ctx.save()
//       ctx.fillStyle = 'rgba(0,0,0,0.4)'
//       ctx.fillRect(0, 0, w, h)
//       ctx.beginPath()
//       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
//       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
//       ctx.closePath()
//       ctx.globalCompositeOperation = 'destination-out'
//       ctx.fill()
//       ctx.globalCompositeOperation = 'source-over'
//       ctx.restore()
//       ctx.strokeStyle = '#c5a880'
//       ctx.lineWidth   = 2
//       ctx.setLineDash([6, 3])
//       ctx.beginPath()
//       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
//       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
//       ctx.closePath()
//       ctx.stroke()
//       ctx.setLineDash([])
//     }

//     // Existing cells
//     currentCells.forEach((cell, idx) => {
//       const color = CELL_COLORS[idx % CELL_COLORS.length]
//       const cPts  = cell.canvasPoints
//       const isSel = selIdx === idx

//       ctx.beginPath()
//       ctx.moveTo(cPts[0].x, cPts[0].y)
//       cPts.forEach(p => ctx.lineTo(p.x, p.y))
//       ctx.closePath()
//       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`
//       ctx.fill()
//       ctx.strokeStyle = color
//       ctx.lineWidth   = isSel ? 3 : 2
//       ctx.stroke()

//       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length
//       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length
//       ctx.font      = `bold ${isSel ? 14 : 12}px sans-serif`
//       const tw      = ctx.measureText(cell.cell_name).width + 14
//       ctx.fillStyle = 'rgba(0,0,0,0.75)'
//       ctx.beginPath()
//       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5)
//       ctx.fill()
//       ctx.fillStyle    = 'white'
//       ctx.textAlign    = 'center'
//       ctx.textBaseline = 'middle'
//       ctx.fillText(cell.cell_name, cx, cy)
//     })

//     // In-progress cell
//     if (drawingMode && pts.length > 0) {
//       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length]
//       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts

//       if (previewPts.length >= 3) {
//         ctx.beginPath()
//         ctx.moveTo(previewPts[0].x, previewPts[0].y)
//         previewPts.forEach(p => ctx.lineTo(p.x, p.y))
//         ctx.closePath()
//         ctx.fillStyle = 'rgba(255,255,255,0.10)'
//         ctx.fill()
//       }

//       ctx.strokeStyle = color
//       ctx.lineWidth   = 2
//       ctx.setLineDash([6, 3])
//       ctx.beginPath()
//       ctx.moveTo(pts[0].x, pts[0].y)
//       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
//       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y)
//       ctx.stroke()
//       ctx.setLineDash([])

//       pts.forEach((p, i) => {
//         const ptColor = CELL_COLORS[i % CELL_COLORS.length]
//         ctx.shadowColor = ptColor; ctx.shadowBlur = 8
//         ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
//         ctx.fillStyle = ptColor; ctx.fill()
//         ctx.shadowBlur = 0
//         ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
//         ctx.fillStyle = 'white'; ctx.fill()
//         ctx.fillStyle = ptColor; ctx.font = 'bold 10px sans-serif'
//         ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
//         ctx.fillText((i + 1).toString(), p.x, p.y)

//         const label = POINT_LABELS[i]
//         ctx.font    = 'bold 11px sans-serif'
//         const lw    = ctx.measureText(label).width + 10
//         const lx    = p.x - lw / 2; const ly = p.y - 28
//         ctx.fillStyle = 'rgba(0,0,0,0.8)'
//         ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill()
//         ctx.fillStyle = ptColor; ctx.textBaseline = 'middle'
//         ctx.fillText(label, p.x, ly)
//       })
//     }
//   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider])

//   useEffect(() => {
//     redrawAll(cells, currentPoints, mousePos, selectedCell)
//   }, [cells, currentPoints, mousePos, canvasSize, streamOk, redrawAll, selectedCell])

//   // ── Canvas event handlers ──────────────────────────────────────────────

//   const getCanvasPoint = (e) => {
//     const canvas = canvasRef.current
//     const rect   = canvas.getBoundingClientRect()
//     return {
//       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
//       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
//     }
//   }

//   const handleMouseMove = (e) => {
//     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return
//     setMousePos(getCanvasPoint(e))
//   }

//   const handleCanvasClick = (e) => {
//     if (isNaming) return
//     const point = getCanvasPoint(e)

//     if (!drawingMode) {
//       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
//       setSelectedCell(idx >= 0 ? idx : null)
//       return
//     }

//     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return

//     const newPoints = [...currentPoints, point]
//     if (newPoints.length < MAX_CELL_POINTS) {
//       setCurrentPoints(newPoints)
//       setMousePos(point)
//     } else {
//       setPendingCell(newPoints)
//       setCurrentPoints([])
//       setMousePos(null)
//       setIsNaming(true)
//       setCellName('')
//       setNameError('')
//     }
//   }

//   const handleConfirmName = () => {
//     const trimmed = cellName.trim()
//     if (!trimmed) { setNameError('Please enter a name'); return }
//     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
//       setNameError('Name already used'); return
//     }
//     setCells(prev => [...prev, { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell }])
//     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
//   }

//   const handleCancelName = () => {
//     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
//   }

//   const handleDeleteSelected = () => {
//     if (selectedCell === null) return
//     setCells(prev => prev.filter((_, i) => i !== selectedCell))
//     setSelectedCell(null)
//   }

//   // ── Normalise ──────────────────────────────────────────────────────────

//   const normaliseCells = () =>
//     cells.map((cell, idx) => ({
//       cell_name:      cell.cell_name,
//       row:            idx,
//       col:            0,
//       polygon_points: cell.canvasPoints.map(p => ({
//         x: parseFloat((p.x / canvasSize.width).toFixed(6)),
//         y: parseFloat((p.y / canvasSize.height).toFixed(6)),
//       })),
//     }))

//   // ── handleSave — ONLY writes cells ────────────────────────────────────

//   const handleSave = async () => {
//     if (cells.length === 0) return
//     setSaveError('')
//     try {
//       await saveCells.mutateAsync({ cameraId, cells: normaliseCells() })
//       sessionStorage.removeItem('recalibrateCamera')
//       navigate(`/property/${propertyId}/cameras`)
//     } catch (err) {
//       setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
//     }
//   }

//   const isSaving   = saveCells.isPending
//   const pointsLeft = MAX_CELL_POINTS - currentPoints.length

//   // ── Render ─────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

//       {/* Header */}
//       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
//         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
//           <ArrowLeft className="h-6 w-6" />
//         </button>
//         <div className="ml-3 flex-1 min-w-0">
//           <h2 className="text-white font-bold text-lg">
//             {isInsider ? 'Redefine Insider Zones' : 'Redefine Fence Cells'}
//           </h2>
//           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => { setDrawingMode(m => !m); setCurrentPoints([]); setMousePos(null); setSelectedCell(null) }}
//             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
//               drawingMode ? 'bg-[#c5a880] text-[#1c1c1c]' : 'bg-white/10 text-white hover:bg-white/20'
//             }`}
//           >
//             {drawingMode ? '✏️ Drawing' : '👆 Select'}
//           </button>
//           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
//             <Info className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Step indicator */}
//       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">1</div>
//             <span className="text-[#c5a880] text-xs font-bold">{isInsider ? 'Redefine Zones' : 'Redefine Cells'}</span>
//           </div>
//           <div className="flex-1 h-px bg-white/10" />
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">2</div>
//             <span className="text-white/40 text-xs font-bold">Save to DB</span>
//           </div>
//         </div>
//       </div>

//       {/* Help banner */}
//       {showHelp && (
//         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
//           <div className="flex items-start gap-3">
//             <div className="text-sm text-[#c5a880]/90 flex-1">
//               <p className="font-bold mb-1">{isInsider ? 'Redefine interior zones:' : 'Redefine fence cells:'}</p>
//               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
//                 <li>Switch to <strong>Drawing</strong> mode</li>
//                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
//                 <li>Name the {entityLabel} when prompted</li>
//                 <li>Switch to <strong>Select</strong> to tap and delete</li>
//               </ol>
//               <p className="text-emerald-400/80 text-xs mt-2 font-medium">
//                 ✅ Camera and polygon already saved — only cells will be updated.
//               </p>
//             </div>
//             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
//           </div>
//         </div>
//       )}

//       {/* Stream unavailable banner */}
//       {streamOk === false && (
//         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
//           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
//           <p className="text-amber-300 text-xs">Stream unavailable — drawing on placeholder.</p>
//         </div>
//       )}

//       {/* Canvas + stream stacked */}
//       <div className="flex-1 relative bg-black" ref={containerRef}>

//         MJPEG stream — behind canvas
//         {streamUrl && (
//           <img
//             ref={imgRef}
//             src={streamUrl}
//             alt="Live camera"
//             onLoad={() => { setStreamOk(true); syncCanvasSize() }}
//             onError={() => setStreamOk(false)}
//             className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
//               streamOk === true ? 'opacity-100' : 'opacity-0'
//             }`}
//           />
//         )}

//         {/* Connecting spinner */}
//         {streamUrl && streamOk === null && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10 pointer-events-none">
//             <div className={theme.ui.spinner} />
//             <p className="text-gray-400 mt-4 text-sm">Connecting to camera…</p>
//           </div>
//         )}

//         {/* Canvas overlay */}
//         <canvas
//           ref={canvasRef}
//           onClick={handleCanvasClick}
//           onMouseMove={handleMouseMove}
//           className={`relative w-full transition-opacity duration-300 ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
//           style={{ display: 'block', background: 'transparent' }}
//         />

//         {/* Cell counter badge */}
//         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
//           <p className="text-white font-mono text-sm font-bold">
//             {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
//           </p>
//           {drawingMode && currentPoints.length > 0 && (
//             <>
//               <div className="flex gap-1 mt-1 justify-center">
//                 {[0, 1, 2, 3].map(i => (
//                   <div
//                     key={i}
//                     style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
//                     className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
//                   />
//                 ))}
//               </div>
//               <p className="text-[#c5a880] text-xs mt-1">{pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left</p>
//             </>
//           )}
//           {drawingMode && currentPoints.length === 0 && (
//             <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
//           )}
//         </div>

//         {/* Selected cell action bar */}
//         {selectedCell !== null && !drawingMode && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
//             <div className="text-sm font-bold text-[#1c1c1c]">{cells[selectedCell]?.cell_name}</div>
//             <button onClick={handleDeleteSelected} className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full">
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//             <button onClick={() => setSelectedCell(null)} className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">✕</button>
//           </div>
//         )}
//       </div>

//       {/* Cell name modal */}
//       {isNaming && (
//         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
//             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">Name This {isInsider ? 'Zone' : 'Cell'}</h3>
//             <p className="text-gray-500 text-sm mb-4">
//               {isInsider ? 'e.g. "Reception", "Office A", "Server Room"' : 'e.g. "A1", "B2", "Gate A"'}
//             </p>
//             <input
//               type="text"
//               value={cellName}
//               onChange={e => { setCellName(e.target.value); setNameError('') }}
//               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
//               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
//               autoFocus
//               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${
//                 nameError ? 'border-red-400 bg-red-50' : 'border-[#e6e3db] focus:border-[#c5a880]'
//               }`}
//             />
//             {nameError && <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>}
//             {cells.length > 0 && (
//               <div className="mt-3 flex flex-wrap gap-1">
//                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
//                 {cells.map(c => (
//                   <span key={c.cell_name} className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium">
//                     {c.cell_name}
//                   </span>
//                 ))}
//               </div>
//             )}
//             <div className="flex gap-3 mt-5">
//               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
//               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
//                 <CheckCircle className="w-4 h-4" /> Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bottom bar */}
//       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

//         {saveError && (
//           <div className={`${theme.alert.error} text-sm`}>
//             <AlertTriangle className="w-4 h-4 shrink-0" />
//             <span>{saveError}</span>
//           </div>
//         )}

//         {cells.length > 0 && (
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {cells.map((cell, idx) => (
//               <button
//                 key={cell.cell_name}
//                 onClick={() => { setDrawingMode(false); setSelectedCell(idx) }}
//                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
//                   selectedCell === idx ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
//                 }`}
//               >
//                 {cell.cell_name}
//               </button>
//             ))}
//           </div>
//         )}

//         <div className="text-sm text-gray-500">
//           {cells.length === 0 && currentPoints.length === 0 && `Switch to Drawing — click 4 corners of each ${entityLabel}`}
//           {drawingMode && currentPoints.length === 0 && cells.length > 0 && `Click Top-Left corner to start a new ${entityLabel}`}
//           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
//           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
//           {drawingMode && currentPoints.length === 3 && `Click Bottom-Left to close the ${entityLabel}`}
//           {!drawingMode && cells.length > 0 && `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
//         </div>

//         {drawingMode && (
//           <div className="flex items-center gap-2">
//             {[0, 1, 2, 3].map(i => (
//               <div key={i} className="flex items-center gap-1.5 flex-1">
//                 <div
//                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
//                   className={`w-3 h-3 rounded-full border-2 transition-all ${
//                     i < currentPoints.length ? 'border-transparent scale-110'
//                     : i === currentPoints.length ? 'border-white/60 bg-white/20 animate-pulse'
//                     : 'border-white/20 bg-transparent'
//                   }`}
//                 />
//                 <span className={`text-xs ${
//                   i < currentPoints.length ? 'text-white/80'
//                   : i === currentPoints.length ? 'text-white/50'
//                   : 'text-white/20'
//                 }`}>{POINT_LABELS[i]}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null) }}
//             className={theme.button.secondary}
//             disabled={currentPoints.length === 0}
//             title="Undo last point"
//           >
//             <RotateCcw className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => { setDrawingMode(true); setSelectedCell(null); setCurrentPoints([]); setMousePos(null) }}
//             className={theme.button.secondary}
//           >
//             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={cells.length === 0 || isSaving}
//             className={`${theme.button.primary} flex-1`}
//           >
//             {isSaving
//               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
//               : <><Save className="w-4 h-4" /> Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
//             }
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditFenceCells

// src/pages/EditFenceCells.jsx
//
// RECALIBRATE FLOW — redefine cells/zones on an EXISTING camera.
//
// Frame strategy — no backend fetch needed:
//   - Stream URL derived from recalibrateCamera.rtspUrl in sessionStorage
//   - <img> displays MJPEG stream behind a transparent <canvas>
//   - If stream errors → canvas draws placeholder grid
//
// DB writes: ONLY saveCells — camera & polygon already exist in DB.

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Save, RotateCcw, CheckCircle,
  AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
} from 'lucide-react'
import { useFenceConfig } from '../hooks/useFenceConfig'
import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
import { theme } from '../theme'

// ── Constants ──────────────────────────────────────────────────────────────

const CELL_COLORS = [
  '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
  '#a855f7', '#f97316', '#06b6d4', '#84cc16',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
]
const POINT_LABELS   = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
const MAX_CELL_POINTS = 4

// ── Derive MJPEG stream URL ────────────────────────────────────────────────

const deriveStreamUrl = (rtspUrl) => {
  if (!rtspUrl) return null
  try {
    const u = new URL(rtspUrl.replace(/^rtsp:\/\//i, 'http://'))
    return `${u.protocol}//${u.hostname}:8080/video`
  } catch {
    return null
  }
}

// ── Geometry ───────────────────────────────────────────────────────────────

const pointInPolygon = (point, polygon) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    if (
      (yi > point.y) !== (yj > point.y) &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    ) inside = !inside
  }
  return inside
}

// ── Component ──────────────────────────────────────────────────────────────

const EditFenceCells = () => {
  const { id: propertyId, cameraId } = useParams()
  const navigate = useNavigate()

  // Read camera meta from sessionStorage — no API call needed for type
  const recalibMeta = (() => {
    try { return JSON.parse(sessionStorage.getItem('recalibrateCamera') || '{}') }
    catch { return {} }
  })()

  const metaValid  = recalibMeta && String(recalibMeta.cameraId) === String(cameraId)
  const cameraType = metaValid ? (recalibMeta.cameraType || 'fence') : 'fence'
  const isInsider  = cameraType === 'insider'
  const rtspUrl    = metaValid ? recalibMeta.rtspUrl : null
  const streamUrl  = deriveStreamUrl(rtspUrl)

  const [cameraName] = useState(
    metaValid ? (recalibMeta.cameraName || `Camera ${cameraId}`) : `Camera ${cameraId}`
  )

  // ── Refs ───────────────────────────────────────────────────────────────
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const imgRef       = useRef(null)

  // ── State ──────────────────────────────────────────────────────────────
  const [cells,         setCells]         = useState([])
  const [currentPoints, setCurrentPoints] = useState([])
  const [mousePos,      setMousePos]      = useState(null)
  const [isNaming,      setIsNaming]      = useState(false)
  const [pendingCell,   setPendingCell]   = useState(null)
  const [cellName,      setCellName]      = useState('')
  const [nameError,     setNameError]     = useState('')
  const [canvasSize,    setCanvasSize]    = useState({ width: 0, height: 0 })
  const [streamOk,      setStreamOk]      = useState(null)
  const [showHelp,      setShowHelp]      = useState(true)
  const [fencePolygon,  setFencePolygon]  = useState([])
  const [drawingMode,   setDrawingMode]   = useState(false)
  const [selectedCell,  setSelectedCell]  = useState(null)
  const [saveError,     setSaveError]     = useState('')

  // ── API hooks ──────────────────────────────────────────────────────────
  const { data: existingConfig } = useFenceConfig(isInsider ? null : cameraId)
  const { data: existingCells }  = useFenceCells(cameraId)
  const saveCells = useSaveFenceCells()

  const entityLabel = isInsider ? 'zone' : 'cell'

  // ── Canvas size sync ───────────────────────────────────────────────────

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

  // No stream URL → placeholder immediately
  useEffect(() => {
    if (!streamUrl && streamOk === null) setStreamOk(false)
  }, [streamUrl, streamOk])

  // ── Pre-populate existing cells ────────────────────────────────────────

  useEffect(() => {
    if (!existingCells?.length || canvasSize.width === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    setCells(existingCells.map(cell => ({
      cell_name:    cell.cell_name,
      row:          cell.row,
      col:          cell.col,
      canvasPoints: cell.polygon_points.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height,
      })),
    })))
  }, [existingCells, canvasSize])

  // ── Load fence polygon overlay ─────────────────────────────────────────

  useEffect(() => {
    if (isInsider || canvasSize.width === 0 || !existingConfig?.polygon_points?.length) return
    const canvas = canvasRef.current
    if (!canvas) return
    setFencePolygon(existingConfig.polygon_points.map(p => ({
      x: p.x * canvas.width,
      y: p.y * canvas.height,
    })))
  }, [isInsider, existingConfig, canvasSize])

  // ── Draw placeholder grid ──────────────────────────────────────────────

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
    ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16)
    ctx.fillStyle = '#6b7280'
    ctx.font      = '13px sans-serif'
    ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16)
  }, [])

  // ── Redraw canvas ──────────────────────────────────────────────────────

  const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w   = canvas.width
    const h   = canvas.height

    if (streamOk === false) {
      drawPlaceholder()
    } else {
      ctx.clearRect(0, 0, w, h)
    }

    // Fence polygon overlay
    if (!isInsider && fencePolygon.length === 4) {
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 0, w, h)
      ctx.beginPath()
      ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
      fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.closePath()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()
      ctx.strokeStyle = '#c5a880'
      ctx.lineWidth   = 2
      ctx.setLineDash([6, 3])
      ctx.beginPath()
      ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y)
      fencePolygon.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.closePath()
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Existing cells
    currentCells.forEach((cell, idx) => {
      const color = CELL_COLORS[idx % CELL_COLORS.length]
      const cPts  = cell.canvasPoints
      const isSel = selIdx === idx

      ctx.beginPath()
      ctx.moveTo(cPts[0].x, cPts[0].y)
      cPts.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.closePath()
      ctx.fillStyle   = isSel ? `${color}66` : `${color}33`
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth   = isSel ? 3 : 2
      ctx.stroke()

      const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length
      const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length
      ctx.font      = `bold ${isSel ? 14 : 12}px sans-serif`
      const tw      = ctx.measureText(cell.cell_name).width + 14
      ctx.fillStyle = 'rgba(0,0,0,0.75)'
      ctx.beginPath()
      ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5)
      ctx.fill()
      ctx.fillStyle    = 'white'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(cell.cell_name, cx, cy)
    })

    // In-progress cell
    if (drawingMode && pts.length > 0) {
      const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length]
      const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts

      if (previewPts.length >= 3) {
        ctx.beginPath()
        ctx.moveTo(previewPts[0].x, previewPts[0].y)
        previewPts.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.closePath()
        ctx.fillStyle = 'rgba(255,255,255,0.10)'
        ctx.fill()
      }

      ctx.strokeStyle = color
      ctx.lineWidth   = 2
      ctx.setLineDash([6, 3])
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y)
      ctx.stroke()
      ctx.setLineDash([])

      pts.forEach((p, i) => {
        const ptColor = CELL_COLORS[i % CELL_COLORS.length]
        ctx.shadowColor = ptColor; ctx.shadowBlur = 8
        ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
        ctx.fillStyle = ptColor; ctx.fill()
        ctx.shadowBlur = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = 'white'; ctx.fill()
        ctx.fillStyle = ptColor; ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText((i + 1).toString(), p.x, p.y)

        const label = POINT_LABELS[i]
        ctx.font    = 'bold 11px sans-serif'
        const lw    = ctx.measureText(label).width + 10
        const lx    = p.x - lw / 2; const ly = p.y - 28
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill()
        ctx.fillStyle = ptColor; ctx.textBaseline = 'middle'
        ctx.fillText(label, p.x, ly)
      })
    }
  }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider])

  useEffect(() => {
    redrawAll(cells, currentPoints, mousePos, selectedCell)
  }, [cells, currentPoints, mousePos, canvasSize, streamOk, redrawAll, selectedCell])

  // ── Canvas event handlers ──────────────────────────────────────────────

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    }
  }

  const handleMouseMove = (e) => {
    if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return
    setMousePos(getCanvasPoint(e))
  }

  const handleCanvasClick = (e) => {
    if (isNaming) return
    const point = getCanvasPoint(e)

    if (!drawingMode) {
      const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
      setSelectedCell(idx >= 0 ? idx : null)
      return
    }

    if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return

    const newPoints = [...currentPoints, point]
    if (newPoints.length < MAX_CELL_POINTS) {
      setCurrentPoints(newPoints)
      setMousePos(point)
    } else {
      setPendingCell(newPoints)
      setCurrentPoints([])
      setMousePos(null)
      setIsNaming(true)
      setCellName('')
      setNameError('')
    }
  }

  const handleConfirmName = () => {
    const trimmed = cellName.trim()
    if (!trimmed) { setNameError('Please enter a name'); return }
    if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
      setNameError('Name already used'); return
    }
    setCells(prev => [...prev, { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell }])
    setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
  }

  const handleCancelName = () => {
    setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('')
  }

  const handleDeleteSelected = () => {
    if (selectedCell === null) return
    setCells(prev => prev.filter((_, i) => i !== selectedCell))
    setSelectedCell(null)
  }

  // ── Normalise ──────────────────────────────────────────────────────────

  const normaliseCells = () =>
    cells.map((cell, idx) => ({
      cell_name:      cell.cell_name,
      row:            idx,
      col:            0,
      polygon_points: cell.canvasPoints.map(p => ({
        x: parseFloat((p.x / canvasSize.width).toFixed(6)),
        y: parseFloat((p.y / canvasSize.height).toFixed(6)),
      })),
    }))

  // ── handleSave — ONLY writes cells ────────────────────────────────────

  const handleSave = async () => {
    if (cells.length === 0) return
    setSaveError('')
    try {
      await saveCells.mutateAsync({ cameraId, cells: normaliseCells() })
      sessionStorage.removeItem('recalibrateCamera')
      navigate(`/property/${propertyId}/cameras`)
    } catch (err) {
      setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
    }
  }

  const isSaving   = saveCells.isPending
  const pointsLeft = MAX_CELL_POINTS - currentPoints.length

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
        <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="ml-3 flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg">
            {isInsider ? 'Redefine Insider Zones' : 'Redefine Fence Cells'}
          </h2>
          <p className="text-gray-400 text-sm truncate">{cameraName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDrawingMode(m => !m); setCurrentPoints([]); setMousePos(null); setSelectedCell(null) }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              drawingMode ? 'bg-[#c5a880] text-[#1c1c1c]' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {drawingMode ? '✏️ Drawing' : '👆 Select'}
          </button>
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
            <span className="text-[#c5a880] text-xs font-bold">{isInsider ? 'Redefine Zones' : 'Redefine Cells'}</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">2</div>
            <span className="text-white/40 text-xs font-bold">Save to DB</span>
          </div>
        </div>
      </div>

      {/* Help banner */}
      {showHelp && (
        <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="text-sm text-[#c5a880]/90 flex-1">
              <p className="font-bold mb-1">{isInsider ? 'Redefine interior zones:' : 'Redefine fence cells:'}</p>
              <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
                <li>Switch to <strong>Drawing</strong> mode</li>
                <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
                <li>Name the {entityLabel} when prompted</li>
                <li>Switch to <strong>Select</strong> to tap and delete</li>
              </ol>
              <p className="text-emerald-400/80 text-xs mt-2 font-medium">
                ✅ Camera and polygon already saved — only cells will be updated.
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
          <p className="text-amber-300 text-xs">Stream unavailable — drawing on placeholder.</p>
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
            <p className="text-gray-400 mt-4 text-sm">Connecting to camera…</p>
          </div>
        )}

        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className={`relative w-full transition-opacity duration-300 ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
          style={{ display: 'block', background: 'transparent' }}
        />

        {/* Cell counter badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
          <p className="text-white font-mono text-sm font-bold">
            {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
          </p>
          {drawingMode && currentPoints.length > 0 && (
            <>
              <div className="flex gap-1 mt-1 justify-center">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
                    className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
                  />
                ))}
              </div>
              <p className="text-[#c5a880] text-xs mt-1">{pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left</p>
            </>
          )}
          {drawingMode && currentPoints.length === 0 && (
            <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
          )}
        </div>

        {/* Selected cell action bar */}
        {selectedCell !== null && !drawingMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <div className="text-sm font-bold text-[#1c1c1c]">{cells[selectedCell]?.cell_name}</div>
            <button onClick={handleDeleteSelected} className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => setSelectedCell(null)} className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">✕</button>
          </div>
        )}
      </div>

      {/* Cell name modal */}
      {isNaming && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">Name This {isInsider ? 'Zone' : 'Cell'}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {isInsider ? 'e.g. "Reception", "Office A", "Server Room"' : 'e.g. "A1", "B2", "Gate A"'}
            </p>
            <input
              type="text"
              value={cellName}
              onChange={e => { setCellName(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
              placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
              autoFocus
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${
                nameError ? 'border-red-400 bg-red-50' : 'border-[#e6e3db] focus:border-[#c5a880]'
              }`}
            />
            {nameError && <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>}
            {cells.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-xs text-gray-400 mr-1">Existing:</span>
                {cells.map(c => (
                  <span key={c.cell_name} className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium">
                    {c.cell_name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
              <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
                <CheckCircle className="w-4 h-4" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">

        {saveError && (
          <div className={`${theme.alert.error} text-sm`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {cells.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cells.map((cell, idx) => (
              <button
                key={cell.cell_name}
                onClick={() => { setDrawingMode(false); setSelectedCell(idx) }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedCell === idx ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]' : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
                }`}
              >
                {cell.cell_name}
              </button>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500">
          {cells.length === 0 && currentPoints.length === 0 && `Switch to Drawing — click 4 corners of each ${entityLabel}`}
          {drawingMode && currentPoints.length === 0 && cells.length > 0 && `Click Top-Left corner to start a new ${entityLabel}`}
          {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
          {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
          {drawingMode && currentPoints.length === 3 && `Click Bottom-Left to close the ${entityLabel}`}
          {!drawingMode && cells.length > 0 && `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
        </div>

        {drawingMode && (
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <div
                  style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    i < currentPoints.length ? 'border-transparent scale-110'
                    : i === currentPoints.length ? 'border-white/60 bg-white/20 animate-pulse'
                    : 'border-white/20 bg-transparent'
                  }`}
                />
                <span className={`text-xs ${
                  i < currentPoints.length ? 'text-white/80'
                  : i === currentPoints.length ? 'text-white/50'
                  : 'text-white/20'
                }`}>{POINT_LABELS[i]}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null) }}
            className={theme.button.secondary}
            disabled={currentPoints.length === 0}
            title="Undo last point"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setDrawingMode(true); setSelectedCell(null); setCurrentPoints([]); setMousePos(null) }}
            className={theme.button.secondary}
          >
            <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
          </button>
          <button
            onClick={handleSave}
            disabled={cells.length === 0 || isSaving}
            className={`${theme.button.primary} flex-1`}
          >
            {isSaving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditFenceCells