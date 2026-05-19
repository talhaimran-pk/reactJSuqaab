


// // // // // //   useEffect(() => {
// // // // // //     let cancelled = false;

// // // // // //     const load = async () => {
// // // // // //       setIsCapturing(true);
// // // // // //       setFrameError(null);
// // // // // //       setUsingFallback(false);
// // // // // //       baseImageRef.current = null;

// // // // // //       await new Promise(r => setTimeout(r, 50));
// // // // // //       if (cancelled) return;

// // // // // //       try {
// // // // // //         let blob;

// // // // // //         if (isNew) {
// // // // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // // //           if (!pending.rtsp_url)
// // // // // //             throw new Error('No RTSP URL found — please go back and re-enter camera details.');
// // // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url });

// // // // // //         } else if (isEditing) {
// // // // // //           // Use the updated RTSP URL from the pending edit
// // // // // //           blob = await fetchFrameBlob(
// // // // // //             '/api/v1/stream/preview-frame',
// // // // // //             { rtsp_url: pendingEdit.data.rtsp_url }
// // // // // //           );

// // // // // //         } else {
// // // // // //           // Recalibrate: load live frame + fetch real camera type from API
// // // // // //           blob = await fetchFrameBlob(`/api/v1/stream/${cameraId}/frame`);

// // // // // //           if (!cancelled) {
// // // // // //             try {
// // // // // //               const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // // //               const token  = localStorage.getItem('token');
// // // // // //               const camRes = await fetch(
// // // // // //                 `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // // // // //                 { headers: { Authorization: `Bearer ${token}` } }
// // // // // //               );
// // // // // //               if (camRes.ok) {
// // // // // //                 const camData = await camRes.json();
// // // // // //                 setCameraName(camData.name || `Camera ${cameraId}`);
// // // // // //                 setCameraType(camData.camera_type || 'fence');
// // // // // //               }
// // // // // //             } catch { /* non-critical */ }
// // // // // //           }
// // // // // //         }

// // // // // //         if (cancelled) return;
// // // // // //         await paintBlob(blob);

// // // // // //       } catch (err) {
// // // // // //         if (cancelled) return;
// // // // // //         console.warn('[FenceCellEditor] Frame load failed:', err.message);
// // // // // //         setFrameError(err.message);
// // // // // //         applyPlaceholder();
// // // // // //       }
// // // // // //     };

// // // // // //     load();
// // // // // //     return () => { cancelled = true; };
// // // // // //   }, [cameraId, isNew, isEditing]);

// // // // // //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// // // // // //     const canvas = canvasRef.current;
// // // // // //     if (!canvas || !frameLoaded) return;
// // // // // //     const ctx = canvas.getContext('2d');

// // // // // //     if (baseImageRef.current) {
// // // // // //       ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
// // // // // //     } else {
// // // // // //       const w = canvas.width, h = canvas.height;
// // // // // //       ctx.fillStyle = '#1c1c1c';
// // // // // //       ctx.fillRect(0, 0, w, h);
// // // // // //       ctx.strokeStyle = '#2a2a2a';
// // // // // //       ctx.lineWidth = 1;
// // // // // //       for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
// // // // // //       for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
// // // // // //       ctx.fillStyle    = '#c5a880';
// // // // // //       ctx.font         = 'bold 15px sans-serif';
// // // // // //       ctx.textAlign    = 'center';
// // // // // //       ctx.textBaseline = 'middle';
// // // // // //       ctx.fillText('📷 Stream unavailable — using placeholder', w/2, h/2 - 16);
// // // // // //       ctx.fillStyle = '#6b7280';
// // // // // //       ctx.font      = '13px sans-serif';
// // // // // //       ctx.fillText('Click to draw 4-point cells', w/2, h/2 + 16);
// // // // // //     }

// // // // // //     // ✅ FIX: only draw fence overlay when camera type is confirmed as 'fence'
// // // // // //     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
// // // // // //       ctx.save();
// // // // // //       ctx.fillStyle = 'rgba(0,0,0,0.4)';
// // // // // //       ctx.fillRect(0, 0, canvas.width, canvas.height);
// // // // // //       ctx.beginPath();
// // // // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y);
// // // // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y));
// // // // // //       ctx.closePath();
// // // // // //       ctx.globalCompositeOperation = 'destination-out';
// // // // // //       ctx.fill();
// // // // // //       ctx.globalCompositeOperation = 'source-over';
// // // // // //       ctx.restore();
// // // // // //       ctx.strokeStyle = '#c5a880';
// // // // // //       ctx.lineWidth   = 2;
// // // // // //       ctx.setLineDash([6, 3]);
// // // // // //       ctx.beginPath();
// // // // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y);
// // // // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y));
// // // // // //       ctx.closePath();
// // // // // //       ctx.stroke();
// // // // // //       ctx.setLineDash([]);
// // // // // //     }

// // // // // //     currentCells.forEach((cell, idx) => {
// // // // // //       const color = CELL_COLORS[idx % CELL_COLORS.length];
// // // // // //       const cPts  = cell.canvasPoints;
// // // // // //       const isSel = selIdx === idx;
// // // // // //       ctx.beginPath();
// // // // // //       ctx.moveTo(cPts[0].x, cPts[0].y);
// // // // // //       cPts.forEach(p => ctx.lineTo(p.x, p.y));
// // // // // //       ctx.closePath();
// // // // // //       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`;
// // // // // //       ctx.fill();
// // // // // //       ctx.strokeStyle = color;
// // // // // //       ctx.lineWidth   = isSel ? 3 : 2;
// // // // // //       ctx.stroke();
// // // // // //       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length;
// // // // // //       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length;
// // // // // //       ctx.font = `bold ${isSel ? 14 : 12}px sans-serif`;
// // // // // //       const tw = ctx.measureText(cell.cell_name).width + 14;
// // // // // //       ctx.fillStyle = 'rgba(0,0,0,0.75)';
// // // // // //       ctx.beginPath();
// // // // // //       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5);
// // // // // //       ctx.fill();
// // // // // //       ctx.fillStyle    = 'white';
// // // // // //       ctx.textAlign    = 'center';
// // // // // //       ctx.textBaseline = 'middle';
// // // // // //       ctx.fillText(cell.cell_name, cx, cy);
// // // // // //     });

// // // // // //     if (drawingMode && pts.length > 0) {
// // // // // //       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length];
// // // // // //       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts;
// // // // // //       if (previewPts.length >= 3) {
// // // // // //         ctx.beginPath();
// // // // // //         ctx.moveTo(previewPts[0].x, previewPts[0].y);
// // // // // //         previewPts.forEach(p => ctx.lineTo(p.x, p.y));
// // // // // //         ctx.closePath();
// // // // // //         ctx.fillStyle = 'rgba(255,255,255,0.10)';
// // // // // //         ctx.fill();
// // // // // //       }
// // // // // //       ctx.strokeStyle = color;
// // // // // //       ctx.lineWidth   = 2;
// // // // // //       ctx.setLineDash([6, 3]);
// // // // // //       ctx.beginPath();
// // // // // //       ctx.moveTo(pts[0].x, pts[0].y);
// // // // // //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
// // // // // //       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y);
// // // // // //       ctx.stroke();
// // // // // //       ctx.setLineDash([]);
// // // // // //       pts.forEach((p, i) => {
// // // // // //         const ptColor = CELL_COLORS[i % CELL_COLORS.length];
// // // // // //         ctx.shadowColor = ptColor; ctx.shadowBlur = 8;
// // // // // //         ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
// // // // // //         ctx.fillStyle = ptColor; ctx.fill(); ctx.shadowBlur = 0;
// // // // // //         ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
// // // // // //         ctx.fillStyle = 'white'; ctx.fill();
// // // // // //         ctx.fillStyle = ptColor; ctx.font = 'bold 10px sans-serif';
// // // // // //         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
// // // // // //         ctx.fillText((i + 1).toString(), p.x, p.y);
// // // // // //         const label = POINT_LABELS[i];
// // // // // //         ctx.font = 'bold 11px sans-serif';
// // // // // //         const lw = ctx.measureText(label).width + 10;
// // // // // //         const lx = p.x - lw / 2, ly = p.y - 28;
// // // // // //         ctx.fillStyle = 'rgba(0,0,0,0.8)';
// // // // // //         ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill();
// // // // // //         ctx.fillStyle = ptColor; ctx.textBaseline = 'middle';
// // // // // //         ctx.fillText(label, p.x, ly);
// // // // // //       });
// // // // // //     }
// // // // // //   }, [frameLoaded, fencePolygon, drawingMode, isInsider, cameraType]);

// // // // // //   useEffect(() => {
// // // // // //     if (frameLoaded) redrawAll(cells, currentPoints, mousePos, selectedCell);
// // // // // //   }, [cells, currentPoints, mousePos, frameLoaded, redrawAll, selectedCell]);

// // // // // //   // Load existing cells for recalibrate flow only
// // // // // //   useEffect(() => {
// // // // // //     if (isNew || isEditing || !frameLoaded || !existingCells?.length) return;
// // // // // //     const canvas = canvasRef.current;
// // // // // //     if (!canvas) return;
// // // // // //     setCells(existingCells.map(cell => ({
// // // // // //       cell_name:    cell.cell_name,
// // // // // //       row:          cell.row,
// // // // // //       col:          cell.col,
// // // // // //       canvasPoints: cell.polygon_points.map(p => ({
// // // // // //         x: p.x * canvas.width,
// // // // // //         y: p.y * canvas.height,
// // // // // //       })),
// // // // // //     })));
// // // // // //   }, [isNew, isEditing, frameLoaded, existingCells]);

// // // // // //   // Load fence polygon
// // // // // //   useEffect(() => {
// // // // // //     if (isInsider || cameraType === null || !frameLoaded) return;
// // // // // //     const canvas = canvasRef.current;
// // // // // //     if (!canvas) return;

// // // // // //     if (isNew) {
// // // // // //       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // // //       if (pending.polygonPoints?.length === 4) {
// // // // // //         setFencePolygon(pending.polygonPoints.map(p => ({
// // // // // //           x: p.x * canvas.width, y: p.y * canvas.height,
// // // // // //         })));
// // // // // //       }
// // // // // //     } else if (isEditing) {
// // // // // //       // pendingCameraEdit carries polygonPoints set by ClimbingCalibration
// // // // // //       const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}');
// // // // // //       if (edit.polygonPoints?.length === 4) {
// // // // // //         setFencePolygon(edit.polygonPoints.map(p => ({
// // // // // //           x: p.x * canvas.width, y: p.y * canvas.height,
// // // // // //         })));
// // // // // //       }
// // // // // //     } else if (existingConfig?.polygon_points?.length) {
// // // // // //       setFencePolygon(existingConfig.polygon_points.map(p => ({
// // // // // //         x: p.x * canvas.width, y: p.y * canvas.height,
// // // // // //       })));
// // // // // //     }
// // // // // //   }, [isNew, isEditing, isInsider, cameraType, frameLoaded, existingConfig]);

// // // // // //   const handleRetry = () => {
// // // // // //     setFrameLoaded(false); setFrameError(null);
// // // // // //     setUsingFallback(false); baseImageRef.current = null;
// // // // // //     const load = async () => {
// // // // // //       setIsCapturing(true);
// // // // // //       await new Promise(r => setTimeout(r, 50));
// // // // // //       try {
// // // // // //         let blob;
// // // // // //         if (isNew) {
// // // // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url });
// // // // // //         } else if (isEditing) {
// // // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pendingEdit.data.rtsp_url });
// // // // // //         } else {
// // // // // //           blob = await fetchFrameBlob(`/api/v1/stream/${cameraId}/frame`);
// // // // // //         }
// // // // // //         await paintBlob(blob);
// // // // // //         setFrameError(null); setUsingFallback(false);
// // // // // //       } catch (err) {
// // // // // //         setFrameError(err.message); applyPlaceholder();
// // // // // //       }
// // // // // //     };
// // // // // //     load();
// // // // // //   };

// // // // // //   const getCanvasPoint = (e) => {
// // // // // //     const canvas = canvasRef.current;
// // // // // //     const rect   = canvas.getBoundingClientRect();
// // // // // //     return {
// // // // // //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// // // // // //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// // // // // //     };
// // // // // //   };

// // // // // //   const handleMouseMove = (e) => {
// // // // // //     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return;
// // // // // //     setMousePos(getCanvasPoint(e));
// // // // // //   };

// // // // // //   const handleCanvasClick = (e) => {
// // // // // //     if (isNaming) return;
// // // // // //     const point = getCanvasPoint(e);
// // // // // //     if (!drawingMode) {
// // // // // //       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints));
// // // // // //       setSelectedCell(idx >= 0 ? idx : null);
// // // // // //       return;
// // // // // //     }
// // // // // //     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return;
// // // // // //     const newPoints = [...currentPoints, point];
// // // // // //     if (newPoints.length < MAX_CELL_POINTS) {
// // // // // //       setCurrentPoints(newPoints); setMousePos(point);
// // // // // //     } else {
// // // // // //       setPendingCell(newPoints); setCurrentPoints([]);
// // // // // //       setMousePos(null); setIsNaming(true);
// // // // // //       setCellName(''); setNameError('');
// // // // // //     }
// // // // // //   };

// // // // // //   const handleConfirmName = () => {
// // // // // //     const trimmed = cellName.trim();
// // // // // //     if (!trimmed) { setNameError('Please enter a name'); return; }
// // // // // //     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
// // // // // //       setNameError('Name already used'); return;
// // // // // //     }
// // // // // //     setCells(prev => [...prev, { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell }]);
// // // // // //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('');
// // // // // //   };

// // // // // //   const handleCancelName = () => {
// // // // // //     setPendingCell(null); setIsNaming(false); setCellName(''); setNameError('');
// // // // // //   };

// // // // // //   const handleDeleteSelected = () => {
// // // // // //     if (selectedCell === null) return;
// // // // // //     setCells(prev => prev.filter((_, i) => i !== selectedCell));
// // // // // //     setSelectedCell(null);
// // // // // //   };

// // // // // //   // ── Save ────────────────────────────────────────────────────────────────────
// // // // // //   const handleSave = async () => {
// // // // // //     if (cells.length === 0) return;
// // // // // //     setSaveError('');

// // // // // //     try {
// // // // // //       let finalCameraId = cameraId;

// // // // // //       if (isNew) {
// // // // // //         // ── ADD flow: create camera, save polygon (fence only), save cells ──
// // // // // //         const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // // //         if (!pending.name || !pending.rtsp_url || !pending.propertyId) {
// // // // // //           setSaveError('Camera data was lost. Please start over.'); return;
// // // // // //         }
// // // // // //         if (!isInsider && !pending.polygonPoints?.length) {
// // // // // //           setSaveError('Polygon data was lost. Please go back and redraw.'); return;
// // // // // //         }

// // // // // //         const created = await createCamera.mutateAsync({
// // // // // //           propertyId: pending.propertyId,
// // // // // //           data: {
// // // // // //             name:        pending.name,
// // // // // //             rtsp_url:    pending.rtsp_url,
// // // // // //             grid_cell:   pending.grid_cell,
// // // // // //             camera_type: pending.camera_type,
// // // // // //           },
// // // // // //         });
// // // // // //         finalCameraId = created?.camera_id;
// // // // // //         if (!finalCameraId) throw new Error('Camera created but ID was not returned.');

// // // // // //         if (!isInsider) {
// // // // // //           const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // // //           const token  = localStorage.getItem('token');
// // // // // //           const polyRes = await fetch(
// // // // // //             `${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`,
// // // // // //             {
// // // // // //               method: 'POST',
// // // // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // // // //               body: JSON.stringify(pending.polygonPoints),
// // // // // //             }
// // // // // //           );
// // // // // //           if (!polyRes.ok) {
// // // // // //             const err = await polyRes.json().catch(() => ({}));
// // // // // //             throw new Error(err.detail || 'Failed to save polygon');
// // // // // //           }
// // // // // //         }
// // // // // //         sessionStorage.removeItem('pendingCamera');

// // // // // //       } else if (isEditing) {
// // // // // //         // ── EDIT flow: update camera (triggers backend cleanup), save polygon
// // // // // //         //              (fence only), then save cells ──────────────────────────
// // // // // //         const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}');
// // // // // //         if (!edit.data) { setSaveError('Edit data was lost. Please start over.'); return; }

// // // // // //         // ✅ This update call triggers settings_crud cleanup of old cells/polygon
// // // // // //         await updateCamera.mutateAsync({
// // // // // //           cameraId:   edit.cameraId,
// // // // // //           propertyId: edit.propertyId,
// // // // // //           data:       edit.data,
// // // // // //         });

// // // // // //         if (!isInsider) {
// // // // // //           // Save new fence polygon
// // // // // //           const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // // //           const token  = localStorage.getItem('token');

// // // // // //           if (!edit.polygonPoints?.length) {
// // // // // //             setSaveError('Polygon data was lost. Please go back and redraw.'); return;
// // // // // //           }

// // // // // //           const polyRes = await fetch(
// // // // // //             `${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`,
// // // // // //             {
// // // // // //               method: 'POST',
// // // // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // // // //               body: JSON.stringify(edit.polygonPoints),
// // // // // //             }
// // // // // //           );
// // // // // //           if (!polyRes.ok) {
// // // // // //             const err = await polyRes.json().catch(() => ({}));
// // // // // //             throw new Error(err.detail || 'Failed to save polygon');
// // // // // //           }
// // // // // //         }
// // // // // //         sessionStorage.removeItem('pendingCameraEdit');
// // // // // //       }

// // // // // //       // ── Save cells (all flows) ─────────────────────────────────────────────
// // // // // //       const payload = cells.map((cell, idx) => ({
// // // // // //         cell_name:      cell.cell_name,
// // // // // //         row:            idx,
// // // // // //         col:            0,
// // // // // //         polygon_points: cell.canvasPoints.map(p => ({
// // // // // //           x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // // // //           y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // // // //         })),
// // // // // //       }));

// // // // // //       await saveMutation.mutateAsync({ cameraId: finalCameraId, cells: payload });
// // // // // //       navigate(`/property/${propertyId}/cameras`);

// // // // // //     } catch (err) {
// // // // // //       setSaveError(
// // // // // //         err?.response?.data?.detail || err.message || 'Failed to save. Please try again.'
// // // // // //       );
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ FIX: show spinner while waiting for camera type to resolve (recalibrate flow)
// // // // // //   if (!isNew && !isEditing && cameraType === null) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
// // // // // //         <div className={theme.ui.spinner} />
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   const pointsLeft = MAX_CELL_POINTS - currentPoints.length;

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // // // //       {/* Header */}
// // // // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // // // //           <ArrowLeft className="h-6 w-6" />
// // // // // //         </button>
// // // // // //         <div className="ml-3 flex-1 min-w-0">
// // // // // //           <h2 className="text-white font-bold text-lg">
// // // // // //             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
// // // // // //           </h2>
// // // // // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // // // // //         </div>
// // // // // //         <div className="flex items-center gap-2">
// // // // // //           <button
// // // // // //             onClick={() => {
// // // // // //               setDrawingMode(m => !m);
// // // // // //               setCurrentPoints([]); setMousePos(null); setSelectedCell(null);
// // // // // //             }}
// // // // // //             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
// // // // // //               drawingMode ? 'bg-[#c5a880] text-[#1c1c1c]' : 'bg-white/10 text-white hover:bg-white/20'
// // // // // //             }`}
// // // // // //           >
// // // // // //             {drawingMode ? '✏️ Drawing' : '👆 Select'}
// // // // // //           </button>
// // // // // //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// // // // // //             <Info className="h-5 w-5" />
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Step indicator */}
// // // // // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // // // // //         <div className="flex items-center gap-2">
// // // // // //           {!isInsider && (
// // // // // //             <>
// // // // // //               <div className="flex items-center gap-1.5">
// // // // // //                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
// // // // // //                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
// // // // // //               </div>
// // // // // //               <div className="flex-1 h-px bg-[#c5a880]/40" />
// // // // // //             </>
// // // // // //           )}
// // // // // //           <div className="flex items-center gap-1.5">
// // // // // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
// // // // // //               {isInsider ? '1' : '2'}
// // // // // //             </div>
// // // // // //             <span className="text-[#c5a880] text-xs font-bold">
// // // // // //               {isInsider ? 'Define Zones' : 'Define Cells'}
// // // // // //             </span>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Help */}
// // // // // //       {showHelp && (
// // // // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // // // //           <div className="flex items-start gap-3">
// // // // // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // // // // //               <p className="font-bold mb-1">
// // // // // //                 {isInsider ? 'How to define interior surveillance zones:' : 'How to define 4-point fence cells:'}
// // // // // //               </p>
// // // // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// // // // // //                 <li>Switch to <strong>Drawing</strong> mode</li>
// // // // // //                 <li>Click <strong>Top-Left</strong> corner of the {isInsider ? 'zone' : 'cell'}</li>
// // // // // //                 <li>Click <strong>Top-Right</strong> corner</li>
// // // // // //                 <li>Click <strong>Bottom-Right</strong> corner</li>
// // // // // //                 <li>Click <strong>Bottom-Left</strong> — polygon closes and you name it</li>
// // // // // //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// // // // // //               </ol>
// // // // // //               {(isNew || isEditing) && (
// // // // // //                 <p className="text-amber-400/80 text-xs mt-2 font-medium">
// // // // // //                   ⚠️ Camera will only be saved to the database when you click "Save".
// // // // // //                 </p>
// // // // // //               )}
// // // // // //             </div>
// // // // // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Fallback warning */}
// // // // // //       {usingFallback && !isCapturing && (
// // // // // //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// // // // // //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// // // // // //           <p className="text-amber-300 text-xs flex-1">
// // // // // //             Could not connect to camera stream. You can still draw on the placeholder,
// // // // // //             or <button onClick={handleRetry} className="underline font-bold">retry</button>.
// // // // // //           </p>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Canvas */}
// // // // // //       <div className="flex-1 relative bg-black" ref={containerRef}>
// // // // // //         {isCapturing && (
// // // // // //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1c1c] z-10">
// // // // // //             <div className={theme.ui.spinner} />
// // // // // //             <p className="text-gray-400 mt-4">
// // // // // //               {isNew || isEditing ? 'Connecting to camera stream...' : 'Loading camera frame...'}
// // // // // //             </p>
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {frameError && !usingFallback && (
// // // // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // // // //             <div className={theme.alert.error}>
// // // // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // // // //               <span className="flex-1 text-sm">{frameError}</span>
// // // // // //               <button onClick={handleRetry}
// // // // // //                 className="text-xs border border-red-300 px-2 py-1 rounded-full hover:bg-red-100 ml-auto">
// // // // // //                 Retry
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         )}

// // // // // //         <canvas
// // // // // //           ref={canvasRef}
// // // // // //           onClick={handleCanvasClick}
// // // // // //           onMouseMove={handleMouseMove}
// // // // // //           className={`w-full transition-opacity duration-300
// // // // // //             ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}
// // // // // //             ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // // // // //           style={{ display: 'block' }}
// // // // // //         />

// // // // // //         {frameLoaded && (
// // // // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur rounded-2xl px-3 py-2 text-center">
// // // // // //             <p className="text-white font-mono text-sm font-bold">
// // // // // //               {cells.length} {isInsider ? 'zone' : 'cell'}{cells.length !== 1 ? 's' : ''}
// // // // // //             </p>
// // // // // //             {drawingMode && currentPoints.length > 0 && (
// // // // // //               <>
// // // // // //                 <div className="flex gap-1 mt-1 justify-center">
// // // // // //                   {[0,1,2,3].map(i => (
// // // // // //                     <div key={i}
// // // // // //                       style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // // // //                       className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
// // // // // //                     />
// // // // // //                   ))}
// // // // // //                 </div>
// // // // // //                 <p className="text-[#c5a880] text-xs mt-1">
// // // // // //                   {pointsLeft} point{pointsLeft !== 1 ? 's' : ''} left
// // // // // //                 </p>
// // // // // //               </>
// // // // // //             )}
// // // // // //             {drawingMode && currentPoints.length === 0 && (
// // // // // //               <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {selectedCell !== null && !drawingMode && (
// // // // // //           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
// // // // // //             <div className="text-sm font-bold text-[#1c1c1c]">{cells[selectedCell]?.cell_name}</div>
// // // // // //             <button onClick={handleDeleteSelected}
// // // // // //               className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full">
// // // // // //               <Trash2 className="w-4 h-4" /> Delete
// // // // // //             </button>
// // // // // //             <button onClick={() => setSelectedCell(null)}
// // // // // //               className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">✕</button>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Name modal */}
// // // // // //       {isNaming && (
// // // // // //         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
// // // // // //           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // // // //             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">
// // // // // //               Name This {isInsider ? 'Zone' : 'Cell'}
// // // // // //             </h3>
// // // // // //             <p className="text-gray-500 text-sm mb-4">
// // // // // //               {isInsider ? 'e.g. "Reception", "Office A", "Server Room"' : 'e.g. "A1", "B2", "Gate A"'}
// // // // // //             </p>
// // // // // //             <input
// // // // // //               type="text"
// // // // // //               value={cellName}
// // // // // //               onChange={e => { setCellName(e.target.value); setNameError(''); }}
// // // // // //               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
// // // // // //               placeholder={isInsider ? 'Reception, Office A...' : 'A1, B2, Gate A...'}
// // // // // //               autoFocus
// // // // // //               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors
// // // // // //                 ${nameError ? 'border-red-400 bg-red-50' : 'border-[#e6e3db] focus:border-[#c5a880]'}`}
// // // // // //             />
// // // // // //             {nameError && <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>}
// // // // // //             {cells.length > 0 && (
// // // // // //               <div className="mt-3 flex flex-wrap gap-1">
// // // // // //                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
// // // // // //                 {cells.map(c => (
// // // // // //                   <span key={c.cell_name}
// // // // // //                     className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium">
// // // // // //                     {c.cell_name}
// // // // // //                   </span>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             )}
// // // // // //             <div className="flex gap-3 mt-5">
// // // // // //               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
// // // // // //               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
// // // // // //                 <CheckCircle className="w-4 h-4" /> Confirm
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Bottom bar */}
// // // // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4 space-y-3 rounded-t-[2rem]">
// // // // // //         {saveError && (
// // // // // //           <div className={`${theme.alert.error} text-sm`}>
// // // // // //             <AlertTriangle className="w-4 h-4 shrink-0" />{saveError}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {cells.length > 0 && (
// // // // // //           <div className="flex gap-2 overflow-x-auto pb-1">
// // // // // //             {cells.map((cell, idx) => (
// // // // // //               <button key={cell.cell_name}
// // // // // //                 onClick={() => { setDrawingMode(false); setSelectedCell(idx); }}
// // // // // //                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
// // // // // //                   selectedCell === idx
// // // // // //                     ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
// // // // // //                     : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
// // // // // //                 }`}>
// // // // // //                 {cell.cell_name}
// // // // // //               </button>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         <div className="flex items-center justify-between">
// // // // // //           <span className="text-sm text-gray-500">
// // // // // //             {cells.length === 0 && currentPoints.length === 0 && `Switch to Drawing — click 4 corners of each ${isInsider ? 'zone' : 'cell'}`}
// // // // // //             {drawingMode && currentPoints.length === 0 && cells.length > 0 && `Click Top-Left corner to start a new ${isInsider ? 'zone' : 'cell'}`}
// // // // // //             {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
// // // // // //             {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
// // // // // //             {drawingMode && currentPoints.length === 3 && `Click Bottom-Left to close the ${isInsider ? 'zone' : 'cell'}`}
// // // // // //             {!drawingMode && cells.length > 0 && `${cells.length} ${isInsider ? 'zone' : 'cell'}${cells.length !== 1 ? 's' : ''} defined`}
// // // // // //           </span>
// // // // // //         </div>

// // // // // //         {drawingMode && (
// // // // // //           <div className="flex items-center gap-2">
// // // // // //             {[0,1,2,3].map(i => (
// // // // // //               <div key={i} className="flex items-center gap-1.5 flex-1">
// // // // // //                 <div
// // // // // //                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // // // //                   className={`w-3 h-3 rounded-full border-2 transition-all ${
// // // // // //                     i < currentPoints.length ? 'border-transparent scale-110'
// // // // // //                     : i === currentPoints.length ? 'border-white/60 bg-white/20 animate-pulse'
// // // // // //                     : 'border-white/20 bg-transparent'
// // // // // //                   }`}
// // // // // //                 />
// // // // // //                 <span className={`text-xs ${
// // // // // //                   i < currentPoints.length ? 'text-white/80'
// // // // // //                   : i === currentPoints.length ? 'text-white/50'
// // // // // //                   : 'text-white/20'
// // // // // //                 }`}>{POINT_LABELS[i]}</span>
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         <div className="flex gap-3">
// // // // // //           <button
// // // // // //             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null); }}
// // // // // //             className={theme.button.secondary}
// // // // // //             disabled={currentPoints.length === 0}
// // // // // //             title="Undo last point"
// // // // // //           >
// // // // // //             <RotateCcw className="w-4 h-4" />
// // // // // //           </button>
// // // // // //           <button
// // // // // //             onClick={() => { setDrawingMode(true); setSelectedCell(null); setCurrentPoints([]); setMousePos(null); }}
// // // // // //             className={theme.button.secondary}
// // // // // //           >
// // // // // //             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
// // // // // //           </button>
// // // // // //           <button
// // // // // //             onClick={handleSave}
// // // // // //             disabled={cells.length === 0 || saveMutation.isPending || createCamera.isPending || updateCamera.isPending}
// // // // // //             className={`${theme.button.primary} flex-1`}
// // // // // //           >
// // // // // //             {(saveMutation.isPending || createCamera.isPending || updateCamera.isPending)
// // // // // //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
// // // // // //               : <><Save className="w-4 h-4" /> Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
// // // // // //             }
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default FenceCellEditor;

// // // // // // src/pages/FenceCellEditor.jsx
// // // // // //
// // // // // // FINAL STEP for all camera configuration flows.
// // // // // // This is the ONLY place that writes to the database.
// // // // // //
// // // // // // ── Three flows ──────────────────────────────────────────────────────────────
// // // // // //
// // // // // //  A) ADD NEW CAMERA (isNew = cameraId === 'new')
// // // // // //     sessionStorage: pendingCamera = { name, rtsp_url, grid_cell,
// // // // // //                                       camera_type, propertyId,
// // // // // //                                       polygonPoints? (fence only) }
// // // // // //     handleSave:
// // // // // //       1. createCamera      → camera now exists in DB with correct type
// // // // // //       2. save polygon      → fence only; type is already correct
// // // // // //       3. save cells
// // // // // //       4. clear sessionStorage
// // // // // //
// // // // // //  B) EDIT EXISTING CAMERA → FENCE (isEditing, camera_type becomes "fence")
// // // // // //     sessionStorage: pendingCameraEdit = { cameraId, propertyId,
// // // // // //                                           data: { name, rtsp_url,
// // // // // //                                                   grid_cell, camera_type },
// // // // // //                                           polygonPoints }
// // // // // //     handleSave:
// // // // // //       1. updateCamera      → sets camera_type = "fence" in DB  ← CRITICAL
// // // // // //       2. save polygon      → NOW accepted (type is "fence")
// // // // // //       3. save cells
// // // // // //       4. clear sessionStorage
// // // // // //
// // // // // //  C) EDIT EXISTING CAMERA → INSIDER (isEditing, camera_type = "insider")
// // // // // //     Same as B but no polygon step.
// // // // // //
// // // // // //  D) RECALIBRATE (existing fence/insider camera, no pending edit)
// // // // // //     handleSave:
// // // // // //       1. save cells only  (camera & polygon already exist in DB)
// // // // // //
// // // // // // ── Why all writes happen here, not in EditClimbingCalibration ───────────────
// // // // // // POST /fence-config requires camera.camera_type === "fence" in the DB.
// // // // // // We can only guarantee that after step 1 (updateCamera) is complete.
// // // // // // EditClimbingCalibration only stores the polygon in sessionStorage and
// // // // // // navigates here — it never calls the API.

// // // // // import { useState, useRef, useEffect, useCallback } from 'react';
// // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // import {
// // // // //   ArrowLeft, Save, RotateCcw, CheckCircle,
// // // // //   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// // // // // } from 'lucide-react';
// // // // // import { useFenceConfig } from '../hooks/useFenceConfig';
// // // // // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells';
// // // // // import { useCreateCamera, useUpdateCamera } from '../hooks/useCameras';
// // // // // import { theme } from '../theme';

// // // // // // ── Constants ─────────────────────────────────────────────────────────────────

// // // // // const CELL_COLORS = [
// // // // //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// // // // //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// // // // //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // // // // ];

// // // // // const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left'];

// // // // // // ── Geometry helper ───────────────────────────────────────────────────────────

// // // // // const pointInPolygon = (point, polygon) => {
// // // // //   let inside = false;
// // // // //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
// // // // //     const xi = polygon[i].x, yi = polygon[i].y;
// // // // //     const xj = polygon[j].x, yj = polygon[j].y;
// // // // //     if (
// // // // //       (yi > point.y) !== (yj > point.y) &&
// // // // //       point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
// // // // //     ) inside = !inside;
// // // // //   }
// // // // //   return inside;
// // // // // };

// // // // // // ── Component ─────────────────────────────────────────────────────────────────

// // // // // const FenceCellEditor = () => {
// // // // //   const { id: propertyId, cameraId } = useParams();
// // // // //   const navigate = useNavigate();

// // // // //   // ── Flow detection ──────────────────────────────────────────────────────────
// // // // //   // isNew     → adding a brand new camera (cameraId param is the string 'new')
// // // // //   // isEditing → editing an existing camera that is changing type
// // // // //   //             (pendingCameraEdit is present in sessionStorage)
// // // // //   // otherwise → recalibrating cells on an already-saved camera (no pending)
// // // // //   const isNew = cameraId === 'new';

// // // // //   const pendingCamera = isNew
// // // // //     ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // // // //     : null;

// // // // //   const pendingEdit = !isNew
// // // // //     ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
// // // // //     : null;

// // // // //   // isEditing: pendingCameraEdit exists AND its cameraId matches the route param
// // // // //   const isEditing = !isNew
// // // // //     && pendingEdit !== null
// // // // //     && String(pendingEdit.cameraId) === String(cameraId);

// // // // //   // ── Camera type resolution ──────────────────────────────────────────────────
// // // // //   // For new/edit flows the type is already known from sessionStorage.
// // // // //   // For recalibrate, we start as null and fetch the real type from the API.
// // // // //   const [cameraType, setCameraType] = useState(() => {
// // // // //     if (isNew)     return pendingCamera?.camera_type || 'fence';
// // // // //     if (isEditing) return pendingEdit.data.camera_type;
// // // // //     return null;   // recalibrate: resolved by API fetch inside frame load
// // // // //   });
// // // // //   const isInsider = cameraType === 'insider';

// // // // //   // ── Canvas refs ─────────────────────────────────────────────────────────────
// // // // //   const canvasRef    = useRef(null);
// // // // //   const containerRef = useRef(null);
// // // // //   const baseImageRef = useRef(null);

// // // // //   // ── State ───────────────────────────────────────────────────────────────────
// // // // //   const [cells,         setCells]         = useState([]);
// // // // //   const [currentPoints, setCurrentPoints] = useState([]);
// // // // //   const [mousePos,      setMousePos]      = useState(null);
// // // // //   const [isNaming,      setIsNaming]      = useState(false);
// // // // //   const [pendingCell,   setPendingCell]   = useState(null);
// // // // //   const [cellName,      setCellName]      = useState('');
// // // // //   const [nameError,     setNameError]     = useState('');
// // // // //   const [frameLoaded,   setFrameLoaded]   = useState(false);
// // // // //   const [frameError,    setFrameError]    = useState(null);
// // // // //   const [isCapturing,   setIsCapturing]   = useState(true);
// // // // //   const [imageSize,     setImageSize]     = useState({ width: 0, height: 0 });
// // // // //   const [showHelp,      setShowHelp]      = useState(true);
// // // // //   const [usingFallback, setUsingFallback] = useState(false);
// // // // //   const [fencePolygon,  setFencePolygon]  = useState([]);
// // // // //   const [drawingMode,   setDrawingMode]   = useState(false);
// // // // //   const [selectedCell,  setSelectedCell]  = useState(null);
// // // // //   const [saveError,     setSaveError]     = useState('');

// // // // //   const [cameraName, setCameraName] = useState(() => {
// // // // //     if (isNew)     return pendingCamera?.name || 'New Camera';
// // // // //     if (isEditing) return pendingEdit.data.name;
// // // // //     return `Camera ${cameraId}`;
// // // // //   });

// // // // //   // ── API hooks ───────────────────────────────────────────────────────────────
// // // // //   // useFenceConfig: only relevant for recalibrate (fence, not insider)
// // // // //   const { data: existingConfig } = useFenceConfig(
// // // // //     isNew || isEditing || cameraType === null || isInsider ? null : cameraId
// // // // //   );
// // // // //   // useFenceCells: only pre-populate for recalibrate
// // // // //   const { data: existingCells } = useFenceCells(
// // // // //     isNew || isEditing ? null : cameraId
// // // // //   );
// // // // //   const saveCells   = useSaveFenceCells();
// // // // //   const createCamera = useCreateCamera();
// // // // //   const updateCamera = useUpdateCamera();

// // // // //   const MAX_CELL_POINTS = 4;

// // // // //   // ── Frame helpers ─────────────────────────────────────────────────────────

// // // // //   const applyImageToCanvas = (img) => {
// // // // //     const canvas    = canvasRef.current;
// // // // //     const container = containerRef.current;
// // // // //     if (!canvas || !container) return null;
// // // // //     const w = container.clientWidth;
// // // // //     const h = img.naturalHeight * (w / img.naturalWidth);
// // // // //     canvas.width  = w;
// // // // //     canvas.height = h;
// // // // //     canvas.getContext('2d').drawImage(img, 0, 0, w, h);
// // // // //     baseImageRef.current = img;
// // // // //     const size = { width: w, height: h };
// // // // //     setImageSize(size);
// // // // //     setFrameLoaded(true);
// // // // //     setIsCapturing(false);
// // // // //     return size;
// // // // //   };

// // // // //   const applyPlaceholder = () => {
// // // // //     const canvas    = canvasRef.current;
// // // // //     const container = containerRef.current;
// // // // //     if (!canvas || !container) return null;
// // // // //     const w = container.clientWidth;
// // // // //     const h = w * 0.5625;
// // // // //     canvas.width  = w;
// // // // //     canvas.height = h;
// // // // //     baseImageRef.current = null;
// // // // //     const size = { width: w, height: h };
// // // // //     setImageSize(size);
// // // // //     setUsingFallback(true);
// // // // //     setFrameLoaded(true);
// // // // //     setIsCapturing(false);
// // // // //     return size;
// // // // //   };

// // // // //   const fetchFrameBlob = async (url, body = null) => {
// // // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // //     const token  = localStorage.getItem('token');
// // // // //     const res = body
// // // // //       ? await fetch(`${apiUrl}${url}`, {
// // // // //           method:  'POST',
// // // // //           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // // //           body:    JSON.stringify(body),
// // // // //         })
// // // // //       : await fetch(`${apiUrl}${url}?t=${Date.now()}`, {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         });
// // // // //     if (!res.ok) {
// // // // //       const err = await res.json().catch(() => ({}));
// // // // //       throw new Error(err.detail || `HTTP ${res.status}`);
// // // // //     }
// // // // //     return res.blob();
// // // // //   };

// // // // //   const paintBlob = (blob) =>
// // // // //     new Promise((resolve, reject) => {
// // // // //       const blobUrl = URL.createObjectURL(blob);
// // // // //       const img     = new Image();
// // // // //       img.onload = () => {
// // // // //         URL.revokeObjectURL(blobUrl);
// // // // //         const size = applyImageToCanvas(img);
// // // // //         if (size) resolve(size);
// // // // //         else reject(new Error('Canvas not ready'));
// // // // //       };
// // // // //       img.onerror = () => {
// // // // //         URL.revokeObjectURL(blobUrl);
// // // // //         reject(new Error('Failed to decode image'));
// // // // //       };
// // // // //       img.src = blobUrl;
// // // // //     });

// // // // //   // ── Frame load effect ────────────────────────────────────────────────────

// // // // //   useEffect(() => {
// // // // //     let cancelled = false;

// // // // //     const load = async () => {
// // // // //       setIsCapturing(true);
// // // // //       setFrameError(null);
// // // // //       setUsingFallback(false);
// // // // //       baseImageRef.current = null;

// // // // //       await new Promise(r => setTimeout(r, 50));  // wait for container layout
// // // // //       if (cancelled) return;

// // // // //       try {
// // // // //         let blob;

// // // // //         if (isNew) {
// // // // //           // New camera: use RTSP from pendingCamera
// // // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // //           if (!pending.rtsp_url)
// // // // //             throw new Error('No RTSP URL — please go back and re-enter camera details.');
// // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url });

// // // // //         } else if (isEditing) {
// // // // //           // Edit flow: use the new RTSP URL from pendingCameraEdit
// // // // //           blob = await fetchFrameBlob(
// // // // //             '/api/v1/stream/preview-frame',
// // // // //             { rtsp_url: pendingEdit.data.rtsp_url }
// // // // //           );

// // // // //         } else {
// // // // //           // Recalibrate: load live frame from existing camera
// // // // //           blob = await fetchFrameBlob(`/api/v1/stream/${cameraId}/frame`);

// // // // //           // Also fetch real camera type and name for recalibrate flow
// // // // //           if (!cancelled) {
// // // // //             try {
// // // // //               const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // //               const token  = localStorage.getItem('token');
// // // // //               const camRes = await fetch(
// // // // //                 `${apiUrl}/api/v1/settings/cameras/${cameraId}`,
// // // // //                 { headers: { Authorization: `Bearer ${token}` } }
// // // // //               );
// // // // //               if (camRes.ok) {
// // // // //                 const camData = await camRes.json();
// // // // //                 if (!cancelled) {
// // // // //                   setCameraName(camData.name || `Camera ${cameraId}`);
// // // // //                   setCameraType(camData.camera_type || 'fence');
// // // // //                 }
// // // // //               }
// // // // //             } catch { /* non-critical — we'll use defaults */ }
// // // // //           }
// // // // //         }

// // // // //         if (cancelled) return;
// // // // //         await paintBlob(blob);

// // // // //       } catch (err) {
// // // // //         if (cancelled) return;
// // // // //         console.warn('[FenceCellEditor] Frame load failed:', err.message);
// // // // //         setFrameError(err.message);
// // // // //         applyPlaceholder();
// // // // //       }
// // // // //     };

// // // // //     load();
// // // // //     return () => { cancelled = true; };
// // // // //   }, [cameraId, isNew, isEditing]);  // eslint-disable-line react-hooks/exhaustive-deps

// // // // //   // ── Redraw canvas ────────────────────────────────────────────────────────

// // // // //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// // // // //     const canvas = canvasRef.current;
// // // // //     if (!canvas || !frameLoaded) return;
// // // // //     const ctx = canvas.getContext('2d');
// // // // //     const w   = canvas.width;
// // // // //     const h   = canvas.height;

// // // // //     // Background: real frame or placeholder grid
// // // // //     if (baseImageRef.current) {
// // // // //       ctx.drawImage(baseImageRef.current, 0, 0, w, h);
// // // // //     } else {
// // // // //       ctx.fillStyle = '#1c1c1c';
// // // // //       ctx.fillRect(0, 0, w, h);
// // // // //       ctx.strokeStyle = '#2a2a2a';
// // // // //       ctx.lineWidth   = 1;
// // // // //       for (let x = 0; x < w; x += 40) {
// // // // //         ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
// // // // //       }
// // // // //       for (let y = 0; y < h; y += 40) {
// // // // //         ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
// // // // //       }
// // // // //       ctx.fillStyle    = '#c5a880';
// // // // //       ctx.font         = 'bold 15px sans-serif';
// // // // //       ctx.textAlign    = 'center';
// // // // //       ctx.textBaseline = 'middle';
// // // // //       ctx.fillText('📷 Stream unavailable — using placeholder', w / 2, h / 2 - 16);
// // // // //       ctx.fillStyle = '#6b7280';
// // // // //       ctx.font      = '13px sans-serif';
// // // // //       ctx.fillText('Click to draw 4-point cells', w / 2, h / 2 + 16);
// // // // //     }

// // // // //     // Fence polygon "cutout" overlay (fence cameras only)
// // // // //     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
// // // // //       ctx.save();
// // // // //       ctx.fillStyle = 'rgba(0,0,0,0.4)';
// // // // //       ctx.fillRect(0, 0, w, h);
// // // // //       ctx.beginPath();
// // // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y);
// // // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y));
// // // // //       ctx.closePath();
// // // // //       ctx.globalCompositeOperation = 'destination-out';
// // // // //       ctx.fill();
// // // // //       ctx.globalCompositeOperation = 'source-over';
// // // // //       ctx.restore();
// // // // //       ctx.strokeStyle = '#c5a880';
// // // // //       ctx.lineWidth   = 2;
// // // // //       ctx.setLineDash([6, 3]);
// // // // //       ctx.beginPath();
// // // // //       ctx.moveTo(fencePolygon[0].x, fencePolygon[0].y);
// // // // //       fencePolygon.forEach(p => ctx.lineTo(p.x, p.y));
// // // // //       ctx.closePath();
// // // // //       ctx.stroke();
// // // // //       ctx.setLineDash([]);
// // // // //     }

// // // // //     // Draw existing cells
// // // // //     currentCells.forEach((cell, idx) => {
// // // // //       const color = CELL_COLORS[idx % CELL_COLORS.length];
// // // // //       const cPts  = cell.canvasPoints;
// // // // //       const isSel = selIdx === idx;

// // // // //       ctx.beginPath();
// // // // //       ctx.moveTo(cPts[0].x, cPts[0].y);
// // // // //       cPts.forEach(p => ctx.lineTo(p.x, p.y));
// // // // //       ctx.closePath();
// // // // //       ctx.fillStyle   = isSel ? `${color}66` : `${color}33`;
// // // // //       ctx.fill();
// // // // //       ctx.strokeStyle = color;
// // // // //       ctx.lineWidth   = isSel ? 3 : 2;
// // // // //       ctx.stroke();

// // // // //       const cx = cPts.reduce((s, p) => s + p.x, 0) / cPts.length;
// // // // //       const cy = cPts.reduce((s, p) => s + p.y, 0) / cPts.length;
// // // // //       ctx.font = `bold ${isSel ? 14 : 12}px sans-serif`;
// // // // //       const tw = ctx.measureText(cell.cell_name).width + 14;
// // // // //       ctx.fillStyle = 'rgba(0,0,0,0.75)';
// // // // //       ctx.beginPath();
// // // // //       ctx.roundRect(cx - tw / 2, cy - 12, tw, 22, 5);
// // // // //       ctx.fill();
// // // // //       ctx.fillStyle    = 'white';
// // // // //       ctx.textAlign    = 'center';
// // // // //       ctx.textBaseline = 'middle';
// // // // //       ctx.fillText(cell.cell_name, cx, cy);
// // // // //     });

// // // // //     // Draw in-progress cell being placed
// // // // //     if (drawingMode && pts.length > 0) {
// // // // //       const color      = CELL_COLORS[currentCells.length % CELL_COLORS.length];
// // // // //       const previewPts = mouse && pts.length < MAX_CELL_POINTS ? [...pts, mouse] : pts;

// // // // //       if (previewPts.length >= 3) {
// // // // //         ctx.beginPath();
// // // // //         ctx.moveTo(previewPts[0].x, previewPts[0].y);
// // // // //         previewPts.forEach(p => ctx.lineTo(p.x, p.y));
// // // // //         ctx.closePath();
// // // // //         ctx.fillStyle = 'rgba(255,255,255,0.10)';
// // // // //         ctx.fill();
// // // // //       }

// // // // //       ctx.strokeStyle = color;
// // // // //       ctx.lineWidth   = 2;
// // // // //       ctx.setLineDash([6, 3]);
// // // // //       ctx.beginPath();
// // // // //       ctx.moveTo(pts[0].x, pts[0].y);
// // // // //       for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
// // // // //       if (mouse && pts.length < MAX_CELL_POINTS) ctx.lineTo(mouse.x, mouse.y);
// // // // //       ctx.stroke();
// // // // //       ctx.setLineDash([]);

// // // // //       pts.forEach((p, i) => {
// // // // //         const ptColor = CELL_COLORS[i % CELL_COLORS.length];
// // // // //         ctx.shadowColor = ptColor;
// // // // //         ctx.shadowBlur  = 8;
// // // // //         ctx.beginPath();
// // // // //         ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
// // // // //         ctx.fillStyle = ptColor;
// // // // //         ctx.fill();
// // // // //         ctx.shadowBlur = 0;
// // // // //         ctx.beginPath();
// // // // //         ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
// // // // //         ctx.fillStyle = 'white';
// // // // //         ctx.fill();
// // // // //         ctx.fillStyle    = ptColor;
// // // // //         ctx.font         = 'bold 10px sans-serif';
// // // // //         ctx.textAlign    = 'center';
// // // // //         ctx.textBaseline = 'middle';
// // // // //         ctx.fillText((i + 1).toString(), p.x, p.y);

// // // // //         const label = POINT_LABELS[i];
// // // // //         ctx.font    = 'bold 11px sans-serif';
// // // // //         const lw    = ctx.measureText(label).width + 10;
// // // // //         const lx    = p.x - lw / 2;
// // // // //         const ly    = p.y - 28;
// // // // //         ctx.fillStyle = 'rgba(0,0,0,0.8)';
// // // // //         ctx.beginPath();
// // // // //         ctx.roundRect(lx, ly - 10, lw, 20, 4);
// // // // //         ctx.fill();
// // // // //         ctx.fillStyle    = ptColor;
// // // // //         ctx.textBaseline = 'middle';
// // // // //         ctx.fillText(label, p.x, ly);
// // // // //       });
// // // // //     }
// // // // //   }, [frameLoaded, fencePolygon, drawingMode, isInsider, cameraType]);

// // // // //   useEffect(() => {
// // // // //     if (frameLoaded) redrawAll(cells, currentPoints, mousePos, selectedCell);
// // // // //   }, [cells, currentPoints, mousePos, frameLoaded, redrawAll, selectedCell]);

// // // // //   // ── Pre-populate existing cells (recalibrate flow only) ──────────────────

// // // // //   useEffect(() => {
// // // // //     if (isNew || isEditing || !frameLoaded || !existingCells?.length) return;
// // // // //     const canvas = canvasRef.current;
// // // // //     if (!canvas) return;
// // // // //     setCells(existingCells.map(cell => ({
// // // // //       cell_name:    cell.cell_name,
// // // // //       row:          cell.row,
// // // // //       col:          cell.col,
// // // // //       canvasPoints: cell.polygon_points.map(p => ({
// // // // //         x: p.x * canvas.width,
// // // // //         y: p.y * canvas.height,
// // // // //       })),
// // // // //     })));
// // // // //   }, [isNew, isEditing, frameLoaded, existingCells]);

// // // // //   // ── Load fence polygon for canvas overlay ────────────────────────────────

// // // // //   useEffect(() => {
// // // // //     // Only fence cameras need the polygon overlay
// // // // //     if (isInsider || cameraType === null || !frameLoaded) return;
// // // // //     const canvas = canvasRef.current;
// // // // //     if (!canvas) return;

// // // // //     if (isNew) {
// // // // //       // Polygon was stored by ClimbingCalibration in pendingCamera
// // // // //       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // //       if (pending.polygonPoints?.length === 4) {
// // // // //         setFencePolygon(pending.polygonPoints.map(p => ({
// // // // //           x: p.x * canvas.width,
// // // // //           y: p.y * canvas.height,
// // // // //         })));
// // // // //       }
// // // // //     } else if (isEditing) {
// // // // //       // Polygon was stored by EditClimbingCalibration in pendingCameraEdit
// // // // //       const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}');
// // // // //       if (edit.polygonPoints?.length === 4) {
// // // // //         setFencePolygon(edit.polygonPoints.map(p => ({
// // // // //           x: p.x * canvas.width,
// // // // //           y: p.y * canvas.height,
// // // // //         })));
// // // // //       }
// // // // //     } else if (existingConfig?.polygon_points?.length) {
// // // // //       // Recalibrate: use existing polygon from DB
// // // // //       setFencePolygon(existingConfig.polygon_points.map(p => ({
// // // // //         x: p.x * canvas.width,
// // // // //         y: p.y * canvas.height,
// // // // //       })));
// // // // //     }
// // // // //   }, [isNew, isEditing, isInsider, cameraType, frameLoaded, existingConfig]);

// // // // //   // ── Retry ────────────────────────────────────────────────────────────────

// // // // //   const handleRetry = () => {
// // // // //     setFrameLoaded(false);
// // // // //     setFrameError(null);
// // // // //     setUsingFallback(false);
// // // // //     baseImageRef.current = null;

// // // // //     const load = async () => {
// // // // //       setIsCapturing(true);
// // // // //       await new Promise(r => setTimeout(r, 50));
// // // // //       try {
// // // // //         let blob;
// // // // //         if (isNew) {
// // // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');
// // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url });
// // // // //         } else if (isEditing) {
// // // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pendingEdit.data.rtsp_url });
// // // // //         } else {
// // // // //           blob = await fetchFrameBlob(`/api/v1/stream/${cameraId}/frame`);
// // // // //         }
// // // // //         await paintBlob(blob);
// // // // //         setFrameError(null);
// // // // //         setUsingFallback(false);
// // // // //       } catch (err) {
// // // // //         setFrameError(err.message);
// // // // //         applyPlaceholder();
// // // // //       }
// // // // //     };
// // // // //     load();
// // // // //   };

// // // // //   // ── Canvas event handlers ────────────────────────────────────────────────

// // // // //   const getCanvasPoint = (e) => {
// // // // //     const canvas = canvasRef.current;
// // // // //     const rect   = canvas.getBoundingClientRect();
// // // // //     return {
// // // // //       x: (e.clientX - rect.left) * (canvas.width  / rect.width),
// // // // //       y: (e.clientY - rect.top)  * (canvas.height / rect.height),
// // // // //     };
// // // // //   };

// // // // //   const handleMouseMove = (e) => {
// // // // //     if (!drawingMode || currentPoints.length === 0 || currentPoints.length >= MAX_CELL_POINTS) return;
// // // // //     setMousePos(getCanvasPoint(e));
// // // // //   };

// // // // //   const handleCanvasClick = (e) => {
// // // // //     if (isNaming) return;
// // // // //     const point = getCanvasPoint(e);

// // // // //     if (!drawingMode) {
// // // // //       // Select mode: tap an existing cell to highlight / delete it
// // // // //       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints));
// // // // //       setSelectedCell(idx >= 0 ? idx : null);
// // // // //       return;
// // // // //     }

// // // // //     // Drawing mode: only allow clicks inside the fence polygon (fence cameras)
// // // // //     if (!isInsider && fencePolygon.length === 4 && !pointInPolygon(point, fencePolygon)) return;

// // // // //     const newPoints = [...currentPoints, point];
// // // // //     if (newPoints.length < MAX_CELL_POINTS) {
// // // // //       setCurrentPoints(newPoints);
// // // // //       setMousePos(point);
// // // // //     } else {
// // // // //       // 4th point placed → open name input
// // // // //       setPendingCell(newPoints);
// // // // //       setCurrentPoints([]);
// // // // //       setMousePos(null);
// // // // //       setIsNaming(true);
// // // // //       setCellName('');
// // // // //       setNameError('');
// // // // //     }
// // // // //   };

// // // // //   const handleConfirmName = () => {
// // // // //     const trimmed = cellName.trim();
// // // // //     if (!trimmed) { setNameError('Please enter a name'); return; }
// // // // //     if (cells.some(c => c.cell_name.toLowerCase() === trimmed.toLowerCase())) {
// // // // //       setNameError('Name already used'); return;
// // // // //     }
// // // // //     setCells(prev => [...prev, {
// // // // //       cell_name:    trimmed,
// // // // //       row:          prev.length,
// // // // //       col:          0,
// // // // //       canvasPoints: pendingCell,
// // // // //     }]);
// // // // //     setPendingCell(null);
// // // // //     setIsNaming(false);
// // // // //     setCellName('');
// // // // //     setNameError('');
// // // // //   };

// // // // //   const handleCancelName = () => {
// // // // //     setPendingCell(null);
// // // // //     setIsNaming(false);
// // // // //     setCellName('');
// // // // //     setNameError('');
// // // // //   };

// // // // //   const handleDeleteSelected = () => {
// // // // //     if (selectedCell === null) return;
// // // // //     setCells(prev => prev.filter((_, i) => i !== selectedCell));
// // // // //     setSelectedCell(null);
// // // // //   };

// // // // //   // ── normalise cell polygon points to 0–1 ─────────────────────────────────
// // // // //   const normaliseCells = () =>
// // // // //     cells.map((cell, idx) => ({
// // // // //       cell_name:      cell.cell_name,
// // // // //       row:            idx,
// // // // //       col:            0,
// // // // //       polygon_points: cell.canvasPoints.map(p => ({
// // // // //         x: parseFloat((p.x / imageSize.width).toFixed(6)),
// // // // //         y: parseFloat((p.y / imageSize.height).toFixed(6)),
// // // // //       })),
// // // // //     }));

// // // // //   // ── handleSave — THE ONLY PLACE THAT WRITES TO THE DATABASE ──────────────
// // // // //   //
// // // // //   // For isNew and isEditing, the camera does NOT exist in the DB yet (or
// // // // //   // its type hasn't been updated yet).  We execute all three steps here
// // // // //   // in strict order so the backend guards are satisfied.
// // // // //   const handleSave = async () => {
// // // // //     if (cells.length === 0) return;
// // // // //     setSaveError('');

// // // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // // //     const token  = localStorage.getItem('token');

// // // // //     try {
// // // // //       let finalCameraId = cameraId;

// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       // FLOW A — NEW CAMERA
// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       if (isNew) {
// // // // //         const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}');

// // // // //         if (!pending.name || !pending.rtsp_url || !pending.propertyId) {
// // // // //           setSaveError('Camera data was lost — please start over.'); return;
// // // // //         }
// // // // //         if (cameraType === 'fence' && !pending.polygonPoints?.length) {
// // // // //           setSaveError('Polygon data was lost — please go back and redraw.'); return;
// // // // //         }

// // // // //         // ── Step 1: Create camera ─────────────────────────────────────────
// // // // //         // Camera is created with the correct type from the start so the
// // // // //         // polygon save in step 2 is accepted immediately.
// // // // //         const created = await createCamera.mutateAsync({
// // // // //           propertyId: pending.propertyId,
// // // // //           data: {
// // // // //             name:        pending.name,
// // // // //             rtsp_url:    pending.rtsp_url,
// // // // //             grid_cell:   pending.grid_cell,
// // // // //             camera_type: pending.camera_type,
// // // // //           },
// // // // //         });

// // // // //         finalCameraId = created?.camera_id;
// // // // //         if (!finalCameraId) throw new Error('Camera created but ID was not returned.');

// // // // //         // ── Step 2: Save polygon (fence only) ────────────────────────────
// // // // //         if (cameraType === 'fence') {
// // // // //           const polyRes = await fetch(
// // // // //             `${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`,
// // // // //             {
// // // // //               method:  'POST',
// // // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // // //               body:    JSON.stringify(pending.polygonPoints),
// // // // //             }
// // // // //           );
// // // // //           if (!polyRes.ok) {
// // // // //             const err = await polyRes.json().catch(() => ({}));
// // // // //             throw new Error(err.detail || 'Failed to save polygon');
// // // // //           }
// // // // //         }

// // // // //         sessionStorage.removeItem('pendingCamera');
// // // // //       }

// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       // FLOW B/C — EDITING EXISTING CAMERA (type change)
// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       else if (isEditing) {
// // // // //         const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}');
// // // // //         if (!edit.data) { setSaveError('Edit data was lost — please start over.'); return; }

// // // // //         if (cameraType === 'fence' && !edit.polygonPoints?.length) {
// // // // //           setSaveError('Polygon data was lost — please go back and redraw.'); return;
// // // // //         }

// // // // //         // ── Step 1: Update camera type in DB ─────────────────────────────
// // // // //         // This is the critical step that must happen BEFORE the polygon is
// // // // //         // saved.  The backend guard "camera.camera_type !== 'fence'" will
// // // // //         // block the polygon save until this update is committed.
// // // // //         await updateCamera.mutateAsync({
// // // // //           cameraId:   edit.cameraId,
// // // // //           propertyId: edit.propertyId,
// // // // //           data:       edit.data,            // includes camera_type: "fence"
// // // // //         });

// // // // //         // ── Step 2: Save polygon (fence only) ────────────────────────────
// // // // //         // Now safe: camera_type is "fence" in the DB.
// // // // //         if (cameraType === 'fence') {
// // // // //           const polyRes = await fetch(
// // // // //             `${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`,
// // // // //             {
// // // // //               method:  'POST',
// // // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // // //               body:    JSON.stringify(edit.polygonPoints),
// // // // //             }
// // // // //           );
// // // // //           if (!polyRes.ok) {
// // // // //             const err = await polyRes.json().catch(() => ({}));
// // // // //             throw new Error(err.detail || 'Failed to save polygon');
// // // // //           }
// // // // //         }

// // // // //         sessionStorage.removeItem('pendingCameraEdit');
// // // // //       }

// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       // STEP 3 (ALL FLOWS) — Save cells
// // // // //       // ════════════════════════════════════════════════════════════════════
// // // // //       await saveCells.mutateAsync({
// // // // //         cameraId: finalCameraId,
// // // // //         cells:    normaliseCells(),
// // // // //       });

// // // // //       // ── Done ─────────────────────────────────────────────────────────────
// // // // //       navigate(`/property/${propertyId}/cameras`);

// // // // //     } catch (err) {
// // // // //       setSaveError(
// // // // //         err?.response?.data?.detail
// // // // //         || err?.message
// // // // //         || 'Failed to save. Please try again.'
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   // ── Show spinner while camera type resolves (recalibrate flow) ───────────
// // // // //   if (!isNew && !isEditing && cameraType === null) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
// // // // //         <div className={theme.ui.spinner} />
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   const isSaving    = saveCells.isPending || createCamera.isPending || updateCamera.isPending;
// // // // //   const pointsLeft  = MAX_CELL_POINTS - currentPoints.length;
// // // // //   const entityLabel = isInsider ? 'zone' : 'cell';

// // // // //   // ── Render ────────────────────────────────────────────────────────────────

// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // // //       {/* ── Header ── */}
// // // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // // //           <ArrowLeft className="h-6 w-6" />
// // // // //         </button>
// // // // //         <div className="ml-3 flex-1 min-w-0">
// // // // //           <h2 className="text-white font-bold text-lg">
// // // // //             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
// // // // //           </h2>
// // // // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // // // //         </div>
// // // // //         <div className="flex items-center gap-2">
// // // // //           <button
// // // // //             onClick={() => {
// // // // //               setDrawingMode(m => !m);
// // // // //               setCurrentPoints([]);
// // // // //               setMousePos(null);
// // // // //               setSelectedCell(null);
// // // // //             }}
// // // // //             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
// // // // //               drawingMode
// // // // //                 ? 'bg-[#c5a880] text-[#1c1c1c]'
// // // // //                 : 'bg-white/10 text-white hover:bg-white/20'
// // // // //             }`}
// // // // //           >
// // // // //             {drawingMode ? '✏️ Drawing' : '👆 Select'}
// // // // //           </button>
// // // // //           <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// // // // //             <Info className="h-5 w-5" />
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ── Step indicator ── */}
// // // // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // // // //         <div className="flex items-center gap-2">
// // // // //           {!isInsider && (isNew || isEditing) && (
// // // // //             <>
// // // // //               <div className="flex items-center gap-1.5">
// // // // //                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center
// // // // //                                 justify-center text-white text-xs font-bold">✓</div>
// // // // //                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
// // // // //               </div>
// // // // //               <div className="flex-1 h-px bg-[#c5a880]/40" />
// // // // //             </>
// // // // //           )}
// // // // //           <div className="flex items-center gap-1.5">
// // // // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// // // // //                             justify-center text-[#1c1c1c] text-xs font-bold">
// // // // //               {isInsider || (!isNew && !isEditing) ? '1' : '2'}
// // // // //             </div>
// // // // //             <span className="text-[#c5a880] text-xs font-bold">
// // // // //               {isInsider ? 'Define Zones' : 'Define Cells'}
// // // // //             </span>
// // // // //           </div>
// // // // //           <div className="flex-1 h-px bg-white/10" />
// // // // //           <div className="flex items-center gap-1.5">
// // // // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// // // // //                             justify-center text-white/40 text-xs font-bold">
// // // // //               {isInsider || (!isNew && !isEditing) ? '2' : '3'}
// // // // //             </div>
// // // // //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ── Help banner ── */}
// // // // //       {showHelp && (
// // // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // // //           <div className="flex items-start gap-3">
// // // // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // // // //               <p className="font-bold mb-1">
// // // // //                 {isInsider ? 'How to define interior surveillance zones:' : 'How to define fence cells:'}
// // // // //               </p>
// // // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// // // // //                 <li>Switch to <strong>Drawing</strong> mode</li>
// // // // //                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
// // // // //                 <li>Name the {entityLabel} when prompted</li>
// // // // //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// // // // //               </ol>
// // // // //               {(isNew || isEditing) && (
// // // // //                 <p className="text-amber-400/80 text-xs mt-2 font-medium">
// // // // //                   ⚠️ Camera is only saved to the database when you click "Save".
// // // // //                 </p>
// // // // //               )}
// // // // //             </div>
// // // // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ── Fallback warning ── */}
// // // // //       {usingFallback && !isCapturing && (
// // // // //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// // // // //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// // // // //           <p className="text-amber-300 text-xs flex-1">
// // // // //             Stream unavailable — drawing on placeholder.{' '}
// // // // //             <button onClick={handleRetry} className="underline font-bold">Retry</button>
// // // // //           </p>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ── Canvas ── */}
// // // // //       <div className="flex-1 relative bg-black" ref={containerRef}>

// // // // //         {isCapturing && (
// // // // //           <div className="absolute inset-0 flex flex-col items-center
// // // // //                           justify-center bg-[#1c1c1c] z-10">
// // // // //             <div className={theme.ui.spinner} />
// // // // //             <p className="text-gray-400 mt-4">
// // // // //               {isNew || isEditing ? 'Connecting to camera stream…' : 'Loading camera frame…'}
// // // // //             </p>
// // // // //           </div>
// // // // //         )}

// // // // //         {frameError && !usingFallback && (
// // // // //           <div className="absolute top-4 left-4 right-4 z-10">
// // // // //             <div className={theme.alert.error}>
// // // // //               <AlertTriangle className="w-4 h-4 shrink-0" />
// // // // //               <span className="flex-1 text-sm">{frameError}</span>
// // // // //               <button onClick={handleRetry}
// // // // //                 className="text-xs border border-red-300 px-2 py-1 rounded-full ml-auto hover:bg-red-100">
// // // // //                 Retry
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         <canvas
// // // // //           ref={canvasRef}
// // // // //           onClick={handleCanvasClick}
// // // // //           onMouseMove={handleMouseMove}
// // // // //           className={`w-full transition-opacity duration-300
// // // // //             ${drawingMode ? 'cursor-crosshair' : 'cursor-pointer'}
// // // // //             ${!frameLoaded ? 'opacity-0' : 'opacity-100'}`}
// // // // //           style={{ display: 'block' }}
// // // // //         />

// // // // //         {/* Cell counter badge */}
// // // // //         {frameLoaded && (
// // // // //           <div className="absolute top-4 right-4 bg-black/70 backdrop-blur
// // // // //                           rounded-2xl px-3 py-2 text-center">
// // // // //             <p className="text-white font-mono text-sm font-bold">
// // // // //               {cells.length} {entityLabel}{cells.length !== 1 ? 's' : ''}
// // // // //             </p>
// // // // //             {drawingMode && currentPoints.length > 0 && (
// // // // //               <>
// // // // //                 <div className="flex gap-1 mt-1 justify-center">
// // // // //                   {[0,1,2,3].map(i => (
// // // // //                     <div key={i}
// // // // //                       style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // // //                       className={`w-2 h-2 rounded-full transition-all ${i < currentPoints.length ? '' : 'bg-white/20'}`}
// // // // //                     />
// // // // //                   ))}
// // // // //                 </div>
// // // // //                 <p className="text-[#c5a880] text-xs mt-1">
// // // // //                   {pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left
// // // // //                 </p>
// // // // //               </>
// // // // //             )}
// // // // //             {drawingMode && currentPoints.length === 0 && (
// // // // //               <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
// // // // //             )}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Selected cell action bar */}
// // // // //         {selectedCell !== null && !drawingMode && (
// // // // //           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white
// // // // //                           rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
// // // // //             <div className="text-sm font-bold text-[#1c1c1c]">
// // // // //               {cells[selectedCell]?.cell_name}
// // // // //             </div>
// // // // //             <button onClick={handleDeleteSelected}
// // // // //               className="flex items-center gap-1 text-red-500 text-sm font-bold
// // // // //                          hover:bg-red-50 px-2 py-1 rounded-full">
// // // // //               <Trash2 className="w-4 h-4" /> Delete
// // // // //             </button>
// // // // //             <button onClick={() => setSelectedCell(null)}
// // // // //               className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100">
// // // // //               ✕
// // // // //             </button>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* ── Cell name modal ── */}
// // // // //       {isNaming && (
// // // // //         <div className="absolute inset-0 bg-black/70 flex items-center
// // // // //                         justify-center z-50 p-6">
// // // // //           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm
// // // // //                           shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
// // // // //             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">
// // // // //               Name This {isInsider ? 'Zone' : 'Cell'}
// // // // //             </h3>
// // // // //             <p className="text-gray-500 text-sm mb-4">
// // // // //               {isInsider
// // // // //                 ? 'e.g. "Reception", "Office A", "Server Room"'
// // // // //                 : 'e.g. "A1", "B2", "Gate A"'}
// // // // //             </p>
// // // // //             <input
// // // // //               type="text"
// // // // //               value={cellName}
// // // // //               onChange={e => { setCellName(e.target.value); setNameError(''); }}
// // // // //               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
// // // // //               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
// // // // //               autoFocus
// // // // //               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium
// // // // //                           outline-none transition-colors
// // // // //                           ${nameError
// // // // //                             ? 'border-red-400 bg-red-50'
// // // // //                             : 'border-[#e6e3db] focus:border-[#c5a880]'}`}
// // // // //             />
// // // // //             {nameError && (
// // // // //               <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>
// // // // //             )}
// // // // //             {cells.length > 0 && (
// // // // //               <div className="mt-3 flex flex-wrap gap-1">
// // // // //                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
// // // // //                 {cells.map(c => (
// // // // //                   <span key={c.cell_name}
// // // // //                     className="text-xs bg-[#faf9f6] border border-[#e6e3db]
// // // // //                                px-2 py-0.5 rounded-full text-gray-600 font-medium">
// // // // //                     {c.cell_name}
// // // // //                   </span>
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //             <div className="flex gap-3 mt-5">
// // // // //               <button onClick={handleCancelName} className={theme.button.secondary}>Cancel</button>
// // // // //               <button onClick={handleConfirmName} className={`${theme.button.primary} flex-1`}>
// // // // //                 <CheckCircle className="w-4 h-4" /> Confirm
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ── Bottom bar ── */}
// // // // //       <div className="border-t border-white/10 bg-[#faf9f6] p-4
// // // // //                       space-y-3 rounded-t-[2rem]">

// // // // //         {/* Save error */}
// // // // //         {saveError && (
// // // // //           <div className={`${theme.alert.error} text-sm`}>
// // // // //             <AlertTriangle className="w-4 h-4 shrink-0" />
// // // // //             <span>{saveError}</span>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Cell chips */}
// // // // //         {cells.length > 0 && (
// // // // //           <div className="flex gap-2 overflow-x-auto pb-1">
// // // // //             {cells.map((cell, idx) => (
// // // // //               <button key={cell.cell_name}
// // // // //                 onClick={() => { setDrawingMode(false); setSelectedCell(idx); }}
// // // // //                 className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs
// // // // //                              font-bold border transition-all ${
// // // // //                   selectedCell === idx
// // // // //                     ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
// // // // //                     : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
// // // // //                 }`}>
// // // // //                 {cell.cell_name}
// // // // //               </button>
// // // // //             ))}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Status hint */}
// // // // //         <div className="text-sm text-gray-500">
// // // // //           {cells.length === 0 && currentPoints.length === 0 &&
// // // // //             `Switch to Drawing — click 4 corners of each ${entityLabel}`}
// // // // //           {drawingMode && currentPoints.length === 0 && cells.length > 0 &&
// // // // //             `Click Top-Left corner to start a new ${entityLabel}`}
// // // // //           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
// // // // //           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
// // // // //           {drawingMode && currentPoints.length === 3 &&
// // // // //             `Click Bottom-Left to close the ${entityLabel}`}
// // // // //           {!drawingMode && cells.length > 0 &&
// // // // //             `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
// // // // //         </div>

// // // // //         {/* Point progress dots (drawing mode) */}
// // // // //         {drawingMode && (
// // // // //           <div className="flex items-center gap-2">
// // // // //             {[0,1,2,3].map(i => (
// // // // //               <div key={i} className="flex items-center gap-1.5 flex-1">
// // // // //                 <div
// // // // //                   style={{ backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined }}
// // // // //                   className={`w-3 h-3 rounded-full border-2 transition-all ${
// // // // //                     i < currentPoints.length
// // // // //                       ? 'border-transparent scale-110'
// // // // //                       : i === currentPoints.length
// // // // //                         ? 'border-white/60 bg-white/20 animate-pulse'
// // // // //                         : 'border-white/20 bg-transparent'
// // // // //                   }`}
// // // // //                 />
// // // // //                 <span className={`text-xs ${
// // // // //                   i < currentPoints.length ? 'text-white/80'
// // // // //                   : i === currentPoints.length ? 'text-white/50'
// // // // //                   : 'text-white/20'
// // // // //                 }`}>{POINT_LABELS[i]}</span>
// // // // //               </div>
// // // // //             ))}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Action buttons */}
// // // // //         <div className="flex gap-3">
// // // // //           <button
// // // // //             onClick={() => { setCurrentPoints(prev => prev.slice(0, -1)); setMousePos(null); }}
// // // // //             className={theme.button.secondary}
// // // // //             disabled={currentPoints.length === 0}
// // // // //             title="Undo last point"
// // // // //           >
// // // // //             <RotateCcw className="w-4 h-4" />
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => {
// // // // //               setDrawingMode(true);
// // // // //               setSelectedCell(null);
// // // // //               setCurrentPoints([]);
// // // // //               setMousePos(null);
// // // // //             }}
// // // // //             className={theme.button.secondary}
// // // // //           >
// // // // //             <Plus className="w-4 h-4" /> Add {isInsider ? 'Zone' : 'Cell'}
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={handleSave}
// // // // //             disabled={cells.length === 0 || isSaving}
// // // // //             className={`${theme.button.primary} flex-1`}
// // // // //           >
// // // // //             {isSaving
// // // // //               ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
// // // // //               : <><Save className="w-4 h-4" />
// // // // //                   Save {cells.length} {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}
// // // // //                 </>
// // // // //             }
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default FenceCellEditor;

// // // // // src/pages/FenceCellEditor.jsx
// // // // //
// // // // // FINAL STEP for ADD NEW and EDIT EXISTING camera configuration flows.
// // // // // This is the ONLY place that writes to the database for those two flows.
// // // // //
// // // // // ── Two flows ─────────────────────────────────────────────────────────────────
// // // // //
// // // // //  A) ADD NEW CAMERA (isNew = cameraId === 'new')
// // // // //     sessionStorage: pendingCamera = { name, rtsp_url, grid_cell,
// // // // //                                       camera_type, propertyId,
// // // // //                                       polygonPoints? (fence only) }
// // // // //     handleSave:
// // // // //       1. createCamera      → camera now exists in DB with correct type
// // // // //       2. save polygon      → fence only; type is already correct
// // // // //       3. save cells
// // // // //       4. clear sessionStorage
// // // // //
// // // // //  B) EDIT EXISTING CAMERA → FENCE or INSIDER (isEditing, type is changing)
// // // // //     sessionStorage: pendingCameraEdit = { cameraId, propertyId,
// // // // //                                           data: { name, rtsp_url,
// // // // //                                                   grid_cell, camera_type },
// // // // //                                           polygonPoints (fence only) }
// // // // //     handleSave:
// // // // //       1. updateCamera      → sets camera_type in DB  ← CRITICAL before polygon
// // // // //       2. save polygon      → fence only; NOW accepted (type is "fence" in DB)
// // // // //       3. save cells
// // // // //       4. clear sessionStorage
// // // // //
// // // // // ── Recalibrate flow is NOT handled here ─────────────────────────────────────
// // // // // Recalibrating an existing camera's cells is handled by EditFenceCells.jsx.
// // // // // That page reads from sessionStorage('recalibrateCamera') written by
// // // // // CameraManagement.handleRecalibrate and only calls saveCells — no camera or
// // // // // polygon writes. This eliminates the infinite spinner that occurred when the
// // // // // stream endpoint was unavailable (cameraType stayed null forever).
// // // // //
// // // // // ── Why all writes happen here, not in EditClimbingCalibration ───────────────
// // // // // POST /fence-config requires camera.camera_type === "fence" in the DB.
// // // // // We can only guarantee that after step 1 (updateCamera) is complete.
// // // // // EditClimbingCalibration only stores the polygon in sessionStorage and
// // // // // navigates here — it never calls the API.

// // // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // // import { useParams, useNavigate } from 'react-router-dom'
// // // // import {
// // // //   ArrowLeft, Save, RotateCcw, CheckCircle,
// // // //   AlertTriangle, Loader2, Trash2, Plus, Info, WifiOff,
// // // // } from 'lucide-react'
// // // // import { useFenceConfig } from '../hooks/useFenceConfig'
// // // // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // // // import { useCreateCamera, useUpdateCamera } from '../hooks/useCameras'
// // // // import { theme } from '../theme'

// // // // // ── Constants ──────────────────────────────────────────────────────────────────

// // // // const CELL_COLORS = [
// // // //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// // // //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// // // //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // // // ]

// // // // const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']

// // // // // ── Geometry helper ────────────────────────────────────────────────────────────

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

// // // // // ── Component ──────────────────────────────────────────────────────────────────

// // // // const FenceCellEditor = () => {
// // // //   const { id: propertyId, cameraId } = useParams()
// // // //   const navigate = useNavigate()

// // // //   // ── Flow detection ─────────────────────────────────────────────────────────
// // // //   // isNew     → adding a brand new camera (cameraId param is the string 'new')
// // // //   // isEditing → editing an existing camera that is changing type
// // // //   //             (pendingCameraEdit is present in sessionStorage)
// // // //   // Any other case should not reach this page — recalibrate goes to EditFenceCells.
// // // //   const isNew = cameraId === 'new'

// // // //   const pendingCamera = isNew
// // // //     ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // // //     : null

// // // //   const pendingEdit = !isNew
// // // //     ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
// // // //     : null

// // // //   // isEditing: pendingCameraEdit exists AND its cameraId matches the route param
// // // //   const isEditing =
// // // //     !isNew &&
// // // //     pendingEdit !== null &&
// // // //     String(pendingEdit.cameraId) === String(cameraId)

// // // //   // ── Camera type resolution ─────────────────────────────────────────────────
// // // //   // For new/edit flows the type is already known from sessionStorage — never null.
// // // //   const cameraType = isNew
// // // //     ? (pendingCamera?.camera_type || 'fence')
// // // //     : isEditing
// // // //       ? pendingEdit.data.camera_type
// // // //       : 'fence' // safety fallback; should not be reached

// // // //   const isInsider = cameraType === 'insider'

// // // //   // ── Canvas refs ────────────────────────────────────────────────────────────
// // // //   const canvasRef    = useRef(null)
// // // //   const containerRef = useRef(null)
// // // //   const baseImageRef = useRef(null)

// // // //   // ── State ──────────────────────────────────────────────────────────────────
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

// // // //   const [cameraName] = useState(() => {
// // // //     if (isNew)     return pendingCamera?.name || 'New Camera'
// // // //     if (isEditing) return pendingEdit.data.name
// // // //     return `Camera ${cameraId}`
// // // //   })

// // // //   // ── API hooks ──────────────────────────────────────────────────────────────
// // // //   const saveCells    = useSaveFenceCells()
// // // //   const createCamera = useCreateCamera()
// // // //   const updateCamera = useUpdateCamera()

// // // //   const MAX_CELL_POINTS = 4

// // // //   // ── Frame helpers ──────────────────────────────────────────────────────────

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

// // // //   const fetchFrameBlob = async (url, body = null) => {
// // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
// // // //     const token  = localStorage.getItem('token')
// // // //     const res = body
// // // //       ? await fetch(`${apiUrl}${url}`, {
// // // //           method:  'POST',
// // // //           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // //           body:    JSON.stringify(body),
// // // //         })
// // // //       : await fetch(`${apiUrl}${url}?t=${Date.now()}`, {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         })
// // // //     if (!res.ok) {
// // // //       const err = await res.json().catch(() => ({}))
// // // //       throw new Error(err.detail || `HTTP ${res.status}`)
// // // //     }
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

// // // //   // ── Frame load effect ──────────────────────────────────────────────────────

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
// // // //         let blob

// // // //         if (isNew) {
// // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // // //           if (!pending.rtsp_url)
// // // //             throw new Error('No RTSP URL — please go back and re-enter camera details.')
// // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url })
// // // //         } else {
// // // //           // isEditing: use the new RTSP URL from pendingCameraEdit
// // // //           blob = await fetchFrameBlob(
// // // //             '/api/v1/stream/preview-frame',
// // // //             { rtsp_url: pendingEdit.data.rtsp_url }
// // // //           )
// // // //         }

// // // //         if (cancelled) return
// // // //         await paintBlob(blob)

// // // //       } catch (err) {
// // // //         if (cancelled) return
// // // //         console.warn('[FenceCellEditor] Frame load failed:', err.message)
// // // //         setFrameError(err.message)
// // // //         applyPlaceholder()
// // // //       }
// // // //     }

// // // //     load()
// // // //     return () => { cancelled = true }
// // // //   }, [cameraId, isNew, isEditing]) // eslint-disable-line react-hooks/exhaustive-deps

// // // //   // ── Redraw canvas ──────────────────────────────────────────────────────────

// // // //   const redrawAll = useCallback((currentCells, pts, mouse, selIdx) => {
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas || !frameLoaded) return
// // // //     const ctx = canvas.getContext('2d')
// // // //     const w   = canvas.width
// // // //     const h   = canvas.height

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

// // // //     // Fence polygon "cutout" overlay
// // // //     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
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
// // // //   }, [frameLoaded, fencePolygon, drawingMode, isInsider, cameraType])

// // // //   useEffect(() => {
// // // //     if (frameLoaded) redrawAll(cells, currentPoints, mousePos, selectedCell)
// // // //   }, [cells, currentPoints, mousePos, frameLoaded, redrawAll, selectedCell])

// // // //   // ── Load fence polygon for canvas overlay ──────────────────────────────────

// // // //   useEffect(() => {
// // // //     if (isInsider || !frameLoaded) return
// // // //     const canvas = canvasRef.current
// // // //     if (!canvas) return

// // // //     if (isNew) {
// // // //       const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // // //       if (pending.polygonPoints?.length === 4) {
// // // //         setFencePolygon(pending.polygonPoints.map(p => ({
// // // //           x: p.x * canvas.width,
// // // //           y: p.y * canvas.height,
// // // //         })))
// // // //       }
// // // //     } else if (isEditing) {
// // // //       const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
// // // //       if (edit.polygonPoints?.length === 4) {
// // // //         setFencePolygon(edit.polygonPoints.map(p => ({
// // // //           x: p.x * canvas.width,
// // // //           y: p.y * canvas.height,
// // // //         })))
// // // //       }
// // // //     }
// // // //   }, [isNew, isEditing, isInsider, frameLoaded])

// // // //   // ── Retry ──────────────────────────────────────────────────────────────────

// // // //   const handleRetry = () => {
// // // //     setFrameLoaded(false)
// // // //     setFrameError(null)
// // // //     setUsingFallback(false)
// // // //     baseImageRef.current = null

// // // //     const load = async () => {
// // // //       setIsCapturing(true)
// // // //       await new Promise(r => setTimeout(r, 50))
// // // //       try {
// // // //         let blob
// // // //         if (isNew) {
// // // //           const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // // //           blob = await fetchFrameBlob('/api/v1/stream/preview-frame', { rtsp_url: pending.rtsp_url })
// // // //         } else {
// // // //           blob = await fetchFrameBlob(
// // // //             '/api/v1/stream/preview-frame',
// // // //             { rtsp_url: pendingEdit.data.rtsp_url }
// // // //           )
// // // //         }
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

// // // //   // ── Canvas event handlers ──────────────────────────────────────────────────

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

// // // //   // ── Normalise cell polygon points to 0–1 ──────────────────────────────────
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

// // // //   // ── handleSave — THE ONLY PLACE THAT WRITES TO THE DATABASE ───────────────
// // // //   const handleSave = async () => {
// // // //     if (cells.length === 0) return
// // // //     setSaveError('')

// // // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
// // // //     const token  = localStorage.getItem('token')

// // // //     try {
// // // //       let finalCameraId = cameraId

// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       // FLOW A — NEW CAMERA
// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       if (isNew) {
// // // //         const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')

// // // //         if (!pending.name || !pending.rtsp_url || !pending.propertyId) {
// // // //           setSaveError('Camera data was lost — please start over.'); return
// // // //         }
// // // //         if (cameraType === 'fence' && !pending.polygonPoints?.length) {
// // // //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// // // //         }

// // // //         // Step 1: Create camera with correct type from the start
// // // //         const created = await createCamera.mutateAsync({
// // // //           propertyId: pending.propertyId,
// // // //           data: {
// // // //             name:        pending.name,
// // // //             rtsp_url:    pending.rtsp_url,
// // // //             grid_cell:   pending.grid_cell,
// // // //             camera_type: pending.camera_type,
// // // //           },
// // // //         })

// // // //         finalCameraId = created?.camera_id
// // // //         if (!finalCameraId) throw new Error('Camera created but ID was not returned.')

// // // //         // Step 2: Save polygon (fence only)
// // // //         if (cameraType === 'fence') {
// // // //           const polyRes = await fetch(
// // // //             `${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`,
// // // //             {
// // // //               method:  'POST',
// // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // //               body:    JSON.stringify(pending.polygonPoints),
// // // //             }
// // // //           )
// // // //           if (!polyRes.ok) {
// // // //             const err = await polyRes.json().catch(() => ({}))
// // // //             throw new Error(err.detail || 'Failed to save polygon')
// // // //           }
// // // //         }

// // // //         sessionStorage.removeItem('pendingCamera')
// // // //       }

// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       // FLOW B — EDITING EXISTING CAMERA (type change)
// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       else if (isEditing) {
// // // //         const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
// // // //         if (!edit.data) { setSaveError('Edit data was lost — please start over.'); return }

// // // //         if (cameraType === 'fence' && !edit.polygonPoints?.length) {
// // // //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// // // //         }

// // // //         // Step 1: Update camera type in DB BEFORE saving polygon
// // // //         await updateCamera.mutateAsync({
// // // //           cameraId:   edit.cameraId,
// // // //           propertyId: edit.propertyId,
// // // //           data:       edit.data,
// // // //         })

// // // //         // Step 2: Save polygon (fence only) — type is now correct in DB
// // // //         if (cameraType === 'fence') {
// // // //           const polyRes = await fetch(
// // // //             `${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`,
// // // //             {
// // // //               method:  'POST',
// // // //               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // // //               body:    JSON.stringify(edit.polygonPoints),
// // // //             }
// // // //           )
// // // //           if (!polyRes.ok) {
// // // //             const err = await polyRes.json().catch(() => ({}))
// // // //             throw new Error(err.detail || 'Failed to save polygon')
// // // //           }
// // // //         }

// // // //         sessionStorage.removeItem('pendingCameraEdit')
// // // //       }

// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       // STEP 3 (ALL FLOWS) — Save cells
// // // //       // ════════════════════════════════════════════════════════════════════
// // // //       await saveCells.mutateAsync({
// // // //         cameraId: finalCameraId,
// // // //         cells:    normaliseCells(),
// // // //       })

// // // //       navigate(`/property/${propertyId}/cameras`)

// // // //     } catch (err) {
// // // //       setSaveError(
// // // //         err?.response?.data?.detail
// // // //         || err?.message
// // // //         || 'Failed to save. Please try again.'
// // // //       )
// // // //     }
// // // //   }

// // // //   const isSaving   = saveCells.isPending || createCamera.isPending || updateCamera.isPending
// // // //   const pointsLeft = MAX_CELL_POINTS - currentPoints.length
// // // //   const entityLabel = isInsider ? 'zone' : 'cell'

// // // //   // ── Render ─────────────────────────────────────────────────────────────────

// // // //   return (
// // // //     <div className="min-h-screen bg-[#1c1c1c] flex flex-col">

// // // //       {/* ── Header ── */}
// // // //       <div className="flex items-center p-4 border-b border-white/10 bg-[#1c1c1c]">
// // // //         <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// // // //           <ArrowLeft className="h-6 w-6" />
// // // //         </button>
// // // //         <div className="ml-3 flex-1 min-w-0">
// // // //           <h2 className="text-white font-bold text-lg">
// // // //             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
// // // //           </h2>
// // // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // // //         </div>
// // // //         <div className="flex items-center gap-2">
// // // //           {/* <button
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
// // // //           </button> */}
// // // //           {/* <button onClick={() => setShowHelp(h => !h)} className={theme.button.iconDark}>
// // // //             <Info className="h-5 w-5" />
// // // //           </button> */}
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Step indicator ── */}
// // // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // // //         <div className="flex items-center gap-2">
// // // //           {!isInsider && (
// // // //             <>
// // // //               <div className="flex items-center gap-1.5">
// // // //                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center
// // // //                                 justify-center text-white text-xs font-bold">✓</div>
// // // //                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
// // // //               </div>
// // // //               <div className="flex-1 h-px bg-[#c5a880]/40" />
// // // //             </>
// // // //           )}
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center
// // // //                             justify-center text-[#1c1c1c] text-xs font-bold">
// // // //               {isInsider ? '1' : '2'}
// // // //             </div>
// // // //             <span className="text-[#c5a880] text-xs font-bold">
// // // //               {isInsider ? 'Define Zones' : 'Define Cells'}
// // // //             </span>
// // // //           </div>
// // // //           <div className="flex-1 h-px bg-white/10" />
// // // //           <div className="flex items-center gap-1.5">
// // // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center
// // // //                             justify-center text-white/40 text-xs font-bold">
// // // //               {isInsider ? '2' : '3'}
// // // //             </div>
// // // //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Help banner ──
// // // //       {showHelp && (
// // // //         <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/30 px-4 py-3">
// // // //           <div className="flex items-start gap-3">
// // // //             <div className="text-sm text-[#c5a880]/90 flex-1">
// // // //               <p className="font-bold mb-1">
// // // //                 {isInsider ? 'How to define interior surveillance zones:' : 'How to define fence cells:'}
// // // //               </p>
// // // //               <ol className="list-decimal list-inside space-y-0.5 text-[#c5a880]/70 text-xs">
// // // //                 <li>Switch to <strong>Drawing</strong> mode</li>
// // // //                 <li>Click <strong>4 corners</strong> of each {entityLabel}</li>
// // // //                 <li>Name the {entityLabel} when prompted</li>
// // // //                 <li>Switch to <strong>Select</strong> to tap and delete</li>
// // // //               </ol>
// // // //               <p className="text-amber-400/80 text-xs mt-2 font-medium">
// // // //                 ⚠️ Camera is only saved to the database when you click "Save".
// // // //               </p>
// // // //             </div>
// // // //             <button onClick={() => setShowHelp(false)} className="text-[#c5a880] hover:text-white">✕</button>
// // // //           </div>
// // // //         </div>
// // // //       )} */}

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
// // // //             <p className="text-gray-400 mt-4">
// // // //               {isNew ? 'Connecting to camera stream…' : 'Loading camera frame…'}
// // // //             </p>
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

// // // // export default FenceCellEditor

// // // // src/pages/FenceCellEditor.jsx
// // // //
// // // // FINAL STEP for ADD NEW and EDIT EXISTING camera configuration flows.
// // // // This is the ONLY place that writes to the database for those two flows.
// // // //
// // // // Frame strategy — no backend fetch needed:
// // // //   - Stream URL derived from sessionStorage rtsp_url
// // // //   - <img> displays MJPEG stream behind a transparent <canvas>
// // // //   - If stream errors → canvas draws placeholder grid
// // // //   - Fence polygon overlay and cell drawing sit on the transparent canvas
// // // //
// // // // ── Two flows ──────────────────────────────────────────────────────────────
// // // //  A) ADD NEW CAMERA   (isNew = cameraId === 'new')
// // // //     handleSave: createCamera → savePolygon (fence) → saveCells
// // // //  B) EDIT EXISTING    (isEditing, pendingCameraEdit in sessionStorage)
// // // //     handleSave: updateCamera → savePolygon (fence) → saveCells

// // // import { useState, useRef, useEffect, useCallback } from 'react'
// // // import { useParams, useNavigate } from 'react-router-dom'
// // // import {
// // //   ArrowLeft, Save, RotateCcw, CheckCircle,
// // //   AlertTriangle, Loader2, Trash2, Plus, WifiOff,
// // // } from 'lucide-react'
// // // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // // import { useCreateCamera, useUpdateCamera } from '../hooks/useCameras'
// // // import { theme } from '../theme'

// // // // ── Constants ──────────────────────────────────────────────────────────────

// // // const CELL_COLORS = [
// // //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// // //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// // //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // // ]
// // // const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
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

// // // const FenceCellEditor = () => {
// // //   const { id: propertyId, cameraId } = useParams()
// // //   const navigate = useNavigate()

// // //   const isNew = cameraId === 'new'

// // //   const pendingCamera = isNew
// // //     ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // //     : null

// // //   const pendingEdit = !isNew
// // //     ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
// // //     : null

// // //   const isEditing =
// // //     !isNew &&
// // //     pendingEdit !== null &&
// // //     String(pendingEdit.cameraId) === String(cameraId)

// // //   const cameraType = isNew
// // //     ? (pendingCamera?.camera_type || 'fence')
// // //     : isEditing ? pendingEdit.data.camera_type : 'fence'

// // //   const isInsider = cameraType === 'insider'

// // //   // Stream URL from whichever flow is active
// // //   const rtspUrl = isNew
// // //     ? pendingCamera?.rtsp_url
// // //     : isEditing ? pendingEdit?.data?.rtsp_url : null
// // //   const streamUrl = deriveStreamUrl(rtspUrl)

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
// // //   const [fencePolygon,  setFencePolygon]  = useState([])
// // //   const [drawingMode,   setDrawingMode]   = useState(false)
// // //   const [selectedCell,  setSelectedCell]  = useState(null)
// // //   const [saveError,     setSaveError]     = useState('')

// // //   const [cameraName] = useState(() => {
// // //     if (isNew)     return pendingCamera?.name || 'New Camera'
// // //     if (isEditing) return pendingEdit.data.name
// // //     return `Camera ${cameraId}`
// // //   })

// // //   // ── API hooks ──────────────────────────────────────────────────────────
// // //   const saveCells    = useSaveFenceCells()
// // //   const createCamera = useCreateCamera()
// // //   const updateCamera = useUpdateCamera()

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

// // //   // ── Load fence polygon overlay from sessionStorage ─────────────────────

// // //   useEffect(() => {
// // //     if (isInsider || canvasSize.width === 0) return
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return

// // //     const polyPoints = isNew
// // //       ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}').polygonPoints
// // //       : isEditing
// // //         ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}').polygonPoints
// // //         : null

// // //     if (polyPoints?.length === 4) {
// // //       setFencePolygon(polyPoints.map(p => ({
// // //         x: p.x * canvas.width,
// // //         y: p.y * canvas.height,
// // //       })))
// // //     }
// // //   }, [isNew, isEditing, isInsider, canvasSize])

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

// // //     // Background: transparent (live stream shows through) or placeholder
// // //     if (streamOk === false) {
// // //       drawPlaceholder()
// // //     } else {
// // //       ctx.clearRect(0, 0, w, h)
// // //     }

// // //     // Fence polygon overlay (cutout effect)
// // //     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
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
// // //   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider, cameraType])

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

// // //   // ── Normalise cell points ──────────────────────────────────────────────

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

// // //   // ── handleSave — only place that writes to DB ──────────────────────────

// // //   const handleSave = async () => {
// // //     if (cells.length === 0) return
// // //     setSaveError('')

// // //     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.201:8000'
// // //     const token  = localStorage.getItem('token')

// // //     try {
// // //       let finalCameraId = cameraId

// // //       if (isNew) {
// // //         const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// // //         if (!pending.name || !pending.rtsp_url || !pending.propertyId) {
// // //           setSaveError('Camera data was lost — please start over.'); return
// // //         }
// // //         if (cameraType === 'fence' && !pending.polygonPoints?.length) {
// // //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// // //         }

// // //         const created = await createCamera.mutateAsync({
// // //           propertyId: pending.propertyId,
// // //           data: { name: pending.name, rtsp_url: pending.rtsp_url, grid_cell: pending.grid_cell, camera_type: pending.camera_type },
// // //         })
// // //         finalCameraId = created?.camera_id
// // //         if (!finalCameraId) throw new Error('Camera created but ID was not returned.')

// // //         if (cameraType === 'fence') {
// // //           const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`, {
// // //             method:  'POST',
// // //             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //             body:    JSON.stringify(pending.polygonPoints),
// // //           })
// // //           if (!polyRes.ok) {
// // //             const err = await polyRes.json().catch(() => ({}))
// // //             throw new Error(err.detail || 'Failed to save polygon')
// // //           }
// // //         }

// // //         sessionStorage.removeItem('pendingCamera')

// // //       } else if (isEditing) {
// // //         const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
// // //         if (!edit.data) { setSaveError('Edit data was lost — please start over.'); return }
// // //         if (cameraType === 'fence' && !edit.polygonPoints?.length) {
// // //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// // //         }

// // //         await updateCamera.mutateAsync({ cameraId: edit.cameraId, propertyId: edit.propertyId, data: edit.data })

// // //         if (cameraType === 'fence') {
// // //           const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`, {
// // //             method:  'POST',
// // //             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //             body:    JSON.stringify(edit.polygonPoints),
// // //           })
// // //           if (!polyRes.ok) {
// // //             const err = await polyRes.json().catch(() => ({}))
// // //             throw new Error(err.detail || 'Failed to save polygon')
// // //           }
// // //         }

// // //         sessionStorage.removeItem('pendingCameraEdit')
// // //       }

// // //       await saveCells.mutateAsync({ cameraId: finalCameraId, cells: normaliseCells() })
// // //       navigate(`/property/${propertyId}/cameras`)

// // //     } catch (err) {
// // //       setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
// // //     }
// // //   }

// // //   const isSaving   = saveCells.isPending || createCamera.isPending || updateCamera.isPending
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
// // //             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
// // //           </h2>
// // //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// // //         </div>
// // //       </div>

// // //       {/* Step indicator */}
// // //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// // //         <div className="flex items-center gap-2">
// // //           {!isInsider && (
// // //             <>
// // //               <div className="flex items-center gap-1.5">
// // //                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
// // //                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
// // //               </div>
// // //               <div className="flex-1 h-px bg-[#c5a880]/40" />
// // //             </>
// // //           )}
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
// // //               {isInsider ? '1' : '2'}
// // //             </div>
// // //             <span className="text-[#c5a880] text-xs font-bold">
// // //               {isInsider ? 'Define Zones' : 'Define Cells'}
// // //             </span>
// // //           </div>
// // //           <div className="flex-1 h-px bg-white/10" />
// // //           <div className="flex items-center gap-1.5">
// // //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
// // //               {isInsider ? '2' : '3'}
// // //             </div>
// // //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Stream unavailable banner */}
// // //       {streamOk === false && (
// // //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// // //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// // //           <p className="text-amber-300 text-xs">
// // //             Stream unavailable — drawing on placeholder.
// // //           </p>
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
// // //               {isInsider ? 'e.g. "Reception", "Office A"' : 'e.g. "A1", "B2", "Gate A"'}
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
// // //           {cells.length === 0 && currentPoints.length === 0 && `Tap "Add ${isInsider ? 'Zone' : 'Cell'}" then click 4 corners`}
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

// // // export default FenceCellEditor

// // // src/pages/FenceCellEditor.jsx
// // //
// // // FINAL STEP for ADD NEW and EDIT EXISTING camera configuration flows.
// // // This is the ONLY place that writes to the database for those two flows.
// // //
// // // Frame strategy — no backend fetch needed:
// // //   - Stream URL derived from sessionStorage rtsp_url
// // //   - <img> displays MJPEG stream behind a transparent <canvas>
// // //   - If stream errors → canvas draws placeholder grid
// // //   - Fence polygon overlay and cell drawing sit on the transparent canvas
// // //
// // // ── Two flows ──────────────────────────────────────────────────────────────
// // //  A) ADD NEW CAMERA   (isNew = cameraId === 'new')
// // //     handleSave: createCamera → savePolygon (fence) → saveCells
// // //  B) EDIT EXISTING    (isEditing, pendingCameraEdit in sessionStorage)
// // //     handleSave: updateCamera → savePolygon (fence) → saveCells

// // import { useState, useRef, useEffect, useCallback } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import {
// //   ArrowLeft, Save, RotateCcw, CheckCircle,
// //   AlertTriangle, Loader2, Trash2, Plus, WifiOff,
// // } from 'lucide-react'
// // import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// // import { useCreateCamera, useUpdateCamera, useCameras } from '../hooks/useCameras'
// // import { theme } from '../theme'

// // // ── Constants ──────────────────────────────────────────────────────────────

// // const CELL_COLORS = [
// //   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
// //   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
// //   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// // ]
// // const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
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

// // const FenceCellEditor = () => {
// //   const { id: propertyId, cameraId } = useParams()
// //   const navigate = useNavigate()

// //   const isNew = cameraId === 'new'

// //   // ── Load pending data from sessionStorage ──────────────────────────────
// //   const [pendingCamera] = useState(() => {
// //     if (!isNew) return null
// //     try {
// //       return JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
// //     } catch { return {} }
// //   })

// //   const [pendingEdit] = useState(() => {
// //     if (isNew) return null
// //     try {
// //       const raw = sessionStorage.getItem('pendingCameraEdit')
// //       if (!raw || raw === 'null') return null
// //       return JSON.parse(raw)
// //     } catch { return null }
// //   })

// //   const isEditing =
// //     !isNew &&
// //     pendingEdit !== null &&
// //     pendingEdit.data != null &&
// //     String(pendingEdit.cameraId) === String(cameraId)

// //   // ── Fetch existing camera data for stream when not in edit flow ────────
// //   const { data: existingCamera } = useCameras(
// //     !isNew && !isEditing ? cameraId : null
// //   )

// //   const cameraType = isNew
// //     ? (pendingCamera?.camera_type || 'fence')
// //     : isEditing
// //       ? (pendingEdit.data?.camera_type || 'fence')
// //       : (existingCamera?.camera_type || 'fence')

// //   const isInsider = cameraType === 'insider'

// //   // Stream URL: prefer pending data, fall back to fetched camera data
// //   const rtspUrl = isNew
// //     ? pendingCamera?.rtsp_url
// //     : isEditing
// //       ? pendingEdit?.data?.rtsp_url
// //       : existingCamera?.rtsp_url

// //   const streamUrl = deriveStreamUrl(rtspUrl)

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
// //   const [fencePolygon,  setFencePolygon]  = useState([])
// //   const [drawingMode,   setDrawingMode]   = useState(false)
// //   const [selectedCell,  setSelectedCell]  = useState(null)
// //   const [saveError,     setSaveError]     = useState('')

// //   const cameraName = (() => {
// //     if (isNew)     return pendingCamera?.name || 'New Camera'
// //     if (isEditing) return pendingEdit?.data?.name || `Camera ${cameraId}`
// //     return existingCamera?.name || `Camera ${cameraId}`
// //   })()

// //   // ── API hooks ──────────────────────────────────────────────────────────
// //   const saveCells    = useSaveFenceCells()
// //   const createCamera = useCreateCamera()
// //   const updateCamera = useUpdateCamera()

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

// //   // ── Load fence polygon overlay ─────────────────────────────────────────

// //   useEffect(() => {
// //     if (isInsider || canvasSize.width === 0) return
// //     const canvas = canvasRef.current
// //     if (!canvas) return

// //     const polyPoints = isNew
// //       ? pendingCamera?.polygonPoints
// //       : isEditing
// //         ? pendingEdit?.polygonPoints
// //         : null

// //     if (polyPoints?.length === 4) {
// //       setFencePolygon(polyPoints.map(p => ({
// //         x: p.x * canvas.width,
// //         y: p.y * canvas.height,
// //       })))
// //     }
// //   }, [isNew, isEditing, isInsider, canvasSize, pendingCamera, pendingEdit])

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

// //     // Background: transparent (live stream shows through) or placeholder
// //     if (streamOk === false) {
// //       drawPlaceholder()
// //     } else {
// //       ctx.clearRect(0, 0, w, h)
// //     }

// //     // Fence polygon overlay (cutout effect)
// //     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
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
// //   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider, cameraType])

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

// //   // ── Normalise cell points ──────────────────────────────────────────────

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

// //   // ── handleSave — only place that writes to DB ──────────────────────────

// //   const handleSave = async () => {
// //     if (cells.length === 0) return
// //     setSaveError('')

// //     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.129:8000'
// //     const token  = localStorage.getItem('token')

// //     try {
// //       let finalCameraId = cameraId

// //       if (isNew) {
// //         if (!pendingCamera?.name || !pendingCamera?.rtsp_url || !pendingCamera?.propertyId) {
// //           setSaveError('Camera data was lost — please start over.'); return
// //         }
// //         if (cameraType === 'fence' && !pendingCamera?.polygonPoints?.length) {
// //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// //         }

// //         const created = await createCamera.mutateAsync({
// //           propertyId: pendingCamera.propertyId,
// //           data: {
// //             name: pendingCamera.name,
// //             rtsp_url: pendingCamera.rtsp_url,
// //             grid_cell: pendingCamera.grid_cell,
// //             camera_type: pendingCamera.camera_type,
// //           },
// //         })
// //         finalCameraId = created?.camera_id
// //         if (!finalCameraId) throw new Error('Camera created but ID was not returned.')

// //         if (cameraType === 'fence') {
// //           const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`, {
// //             method:  'POST',
// //             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //             body:    JSON.stringify(pendingCamera.polygonPoints),
// //           })
// //           if (!polyRes.ok) {
// //             const err = await polyRes.json().catch(() => ({}))
// //             throw new Error(err.detail || 'Failed to save polygon')
// //           }
// //         }

// //         sessionStorage.removeItem('pendingCamera')

// //       } else if (isEditing) {
// //         if (!pendingEdit?.data) { setSaveError('Edit data was lost — please start over.'); return }
// //         if (cameraType === 'fence' && !pendingEdit?.polygonPoints?.length) {
// //           setSaveError('Polygon data was lost — please go back and redraw.'); return
// //         }

// //         await updateCamera.mutateAsync({
// //           cameraId: pendingEdit.cameraId,
// //           propertyId: pendingEdit.propertyId,
// //           data: pendingEdit.data,
// //         })

// //         if (cameraType === 'fence') {
// //           const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`, {
// //             method:  'POST',
// //             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// //             body:    JSON.stringify(pendingEdit.polygonPoints),
// //           })
// //           if (!polyRes.ok) {
// //             const err = await polyRes.json().catch(() => ({}))
// //             throw new Error(err.detail || 'Failed to save polygon')
// //           }
// //         }

// //         sessionStorage.removeItem('pendingCameraEdit')
// //       }

// //       await saveCells.mutateAsync({ cameraId: finalCameraId, cells: normaliseCells() })
// //       navigate(`/property/${propertyId}/cameras`)

// //     } catch (err) {
// //       setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
// //     }
// //   }

// //   const isSaving   = saveCells.isPending || createCamera.isPending || updateCamera.isPending
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
// //             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
// //           </h2>
// //           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
// //         </div>
// //       </div>

// //       {/* Step indicator */}
// //       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
// //         <div className="flex items-center gap-2">
// //           {!isInsider && (
// //             <>
// //               <div className="flex items-center gap-1.5">
// //                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
// //                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
// //               </div>
// //               <div className="flex-1 h-px bg-[#c5a880]/40" />
// //             </>
// //           )}
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
// //               {isInsider ? '1' : '2'}
// //             </div>
// //             <span className="text-[#c5a880] text-xs font-bold">
// //               {isInsider ? 'Define Zones' : 'Define Cells'}
// //             </span>
// //           </div>
// //           <div className="flex-1 h-px bg-white/10" />
// //           <div className="flex items-center gap-1.5">
// //             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
// //               {isInsider ? '2' : '3'}
// //             </div>
// //             <span className="text-white/40 text-xs font-bold">Save to DB</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Stream unavailable banner */}
// //       {streamOk === false && (
// //         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
// //           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
// //           <p className="text-amber-300 text-xs">
// //             Stream unavailable — drawing on placeholder.
// //           </p>
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
// //               {isInsider ? 'e.g. "Reception", "Office A"' : 'e.g. "A1", "B2", "Gate A"'}
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
// //           {cells.length === 0 && currentPoints.length === 0 && `Tap "Add ${isInsider ? 'Zone' : 'Cell'}" then click 4 corners`}
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

// // export default FenceCellEditor

// // src/pages/FenceCellEditor.jsx
// import { useState, useRef, useEffect, useCallback } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft, Save, RotateCcw, CheckCircle,
//   AlertTriangle, Loader2, Trash2, Plus, WifiOff,
// } from 'lucide-react'
// import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
// import { useCreateCamera, useUpdateCamera, useCameras } from '../hooks/useCameras'
// import { theme } from '../theme'

// // ── Constants ──────────────────────────────────────────────────────────────

// const CELL_COLORS = [
//   '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
//   '#a855f7', '#f97316', '#06b6d4', '#84cc16',
//   '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
// ]
// const POINT_LABELS    = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
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

// const FenceCellEditor = () => {
//   const { id: propertyId, cameraId } = useParams()
//   const navigate = useNavigate()

//   const isNew = cameraId === 'new'

//   // Read session data ONCE on mount — never inside render
//   const [pendingCamera] = useState(() => {
//     if (!isNew) return null
//     try { return JSON.parse(sessionStorage.getItem('pendingCamera') || '{}') }
//     catch { return {} }
//   })

//   const [pendingEdit] = useState(() => {
//     if (isNew) return null
//     try {
//       const raw = sessionStorage.getItem('pendingCameraEdit')
//       if (!raw || raw === 'null') return null
//       return JSON.parse(raw)
//     } catch { return null }
//   })

//   const isEditing =
//     !isNew &&
//     pendingEdit !== null &&
//     pendingEdit.data != null &&
//     String(pendingEdit.cameraId) === String(cameraId)

//   // Guard: if this is an existing-camera view with no pending data, redirect
//   useEffect(() => {
//     if (!isNew && !isEditing) {
//       // No valid edit session — redirect to cameras list
//       navigate(`/property/${propertyId}/cameras`, { replace: true })
//     }
//   }, [isNew, isEditing, navigate, propertyId])

//   // Validate new-camera session data on mount
//   useEffect(() => {
//     if (!isNew) return
//     const cam = pendingCamera || {}
//     if (!cam.name || !cam.rtsp_url || !cam.propertyId) {
//       navigate(`/property/${propertyId}/cameras`, { replace: true })
//     }
//   }, [isNew, pendingCamera, navigate, propertyId])

//   const cameraType = isNew
//     ? (pendingCamera?.camera_type || 'fence')
//     : (pendingEdit?.data?.camera_type || 'fence')

//   const isInsider = cameraType === 'insider'

//   const rtspUrl = isNew
//     ? pendingCamera?.rtsp_url
//     : pendingEdit?.data?.rtsp_url

//   const streamUrl = deriveStreamUrl(rtspUrl)

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
//   const [fencePolygon,  setFencePolygon]  = useState([])
//   const [drawingMode,   setDrawingMode]   = useState(false)
//   const [selectedCell,  setSelectedCell]  = useState(null)
//   const [saveError,     setSaveError]     = useState('')

//   const cameraName = isNew
//     ? (pendingCamera?.name || 'New Camera')
//     : (pendingEdit?.data?.name || `Camera ${cameraId}`)

//   // ── API hooks ──────────────────────────────────────────────────────────
//   const saveCells    = useSaveFenceCells()
//   const createCamera = useCreateCamera()
//   const updateCamera = useUpdateCamera()

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

//   // ── Load fence polygon overlay ─────────────────────────────────────────

//   useEffect(() => {
//     if (isInsider || canvasSize.width === 0 || canvasSize.height === 0) return
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const polyPoints = isNew
//       ? pendingCamera?.polygonPoints
//       : pendingEdit?.polygonPoints

//     if (polyPoints?.length === 4) {
//       setFencePolygon(polyPoints.map(p => ({
//         x: p.x * canvas.width,
//         y: p.y * canvas.height,
//       })))
//     } else if (!isInsider) {
//       // Fence camera but no polygon — something went wrong, send back
//       setSaveError('Polygon data is missing. Please go back and redraw the fence boundary.')
//     }
//   }, [isNew, isEditing, isInsider, canvasSize, pendingCamera, pendingEdit])

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
//     if (!canvas || canvas.width === 0) return
//     const ctx = canvas.getContext('2d')
//     const w   = canvas.width
//     const h   = canvas.height

//     if (streamOk === false) {
//       drawPlaceholder()
//     } else {
//       ctx.clearRect(0, 0, w, h)
//     }

//     // Fence polygon cutout overlay
//     if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
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
//         const lx    = p.x - lw / 2
//         const ly    = p.y - 28
//         ctx.fillStyle = 'rgba(0,0,0,0.8)'
//         ctx.beginPath(); ctx.roundRect(lx, ly - 10, lw, 20, 4); ctx.fill()
//         ctx.fillStyle = ptColor; ctx.textBaseline = 'middle'
//         ctx.fillText(label, p.x, ly)
//       })
//     }
//   }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider, cameraType])

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
//     if (canvasSize.width === 0 || canvasSize.height === 0) return
//     const point = getCanvasPoint(e)

//     if (!drawingMode) {
//       const idx = cells.findIndex(c => pointInPolygon(point, c.canvasPoints))
//       setSelectedCell(idx >= 0 ? idx : null)
//       return
//     }

//     // Enforce fence boundary for fence cameras only
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
//     setCells(prev => [
//       ...prev,
//       { cell_name: trimmed, row: prev.length, col: 0, canvasPoints: pendingCell },
//     ])
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

//   // ── Normalise cell points ──────────────────────────────────────────────

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

//   // ── handleSave — the ONLY place that writes to the DB ─────────────────

//   const handleSave = async () => {
//     // Hard guards — never proceed with incomplete state
//     if (cells.length === 0) {
//       setSaveError(`Please define at least one ${entityLabel} before saving.`)
//       return
//     }
//     if (canvasSize.width === 0 || canvasSize.height === 0) {
//       setSaveError('Canvas not ready — please wait a moment and try again.')
//       return
//     }
//     if (!isInsider && cameraType === 'fence') {
//       const polyPoints = isNew
//         ? pendingCamera?.polygonPoints
//         : pendingEdit?.polygonPoints
//       if (!polyPoints?.length) {
//         setSaveError('Polygon data is missing. Please go back and redraw the fence boundary.')
//         return
//       }
//     }

//     setSaveError('')

//     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.129:8000'
//     const token  = localStorage.getItem('token')

//     try {
//       let finalCameraId = cameraId

//       if (isNew) {
//         // Validate all required fields are present
//         if (!pendingCamera?.name || !pendingCamera?.rtsp_url || !pendingCamera?.propertyId) {
//           setSaveError('Camera data was lost — please start over.')
//           return
//         }

//         // 1. Create the camera
//         const created = await createCamera.mutateAsync({
//           propertyId: pendingCamera.propertyId,
//           data: {
//             name:        pendingCamera.name,
//             rtsp_url:    pendingCamera.rtsp_url,
//             grid_cell:   pendingCamera.grid_cell,
//             camera_type: pendingCamera.camera_type,
//           },
//         })
//         finalCameraId = created?.camera_id
//         if (!finalCameraId) throw new Error('Camera created but ID was not returned.')

//         // 2. Save polygon (fence cameras only)
//         if (cameraType === 'fence') {
//           const polyRes = await fetch(
//             `${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`,
//             {
//               method:  'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify(pendingCamera.polygonPoints),
//             }
//           )
//           if (!polyRes.ok) {
//             const err = await polyRes.json().catch(() => ({}))
//             throw new Error(err.detail || 'Failed to save polygon')
//           }
//         }

//         // 3. Clean up session
//         sessionStorage.removeItem('pendingCamera')

//       } else if (isEditing) {
//         if (!pendingEdit?.data) {
//           setSaveError('Edit data was lost — please start over.')
//           return
//         }

//         // 1. Update the camera
//         await updateCamera.mutateAsync({
//           cameraId:   pendingEdit.cameraId,
//           propertyId: pendingEdit.propertyId,
//           data:       pendingEdit.data,
//         })

//         // 2. Save polygon (fence cameras only)
//         if (cameraType === 'fence') {
//           const polyRes = await fetch(
//             `${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`,
//             {
//               method:  'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify(pendingEdit.polygonPoints),
//             }
//           )
//           if (!polyRes.ok) {
//             const err = await polyRes.json().catch(() => ({}))
//             throw new Error(err.detail || 'Failed to save polygon')
//           }
//         }

//         // 3. Clean up session
//         sessionStorage.removeItem('pendingCameraEdit')
//       }

//       // Final step for both flows: save cells
//       await saveCells.mutateAsync({ cameraId: finalCameraId, cells: normaliseCells() })
//       navigate(`/property/${propertyId}/cameras`)

//     } catch (err) {
//       setSaveError(
//         err?.response?.data?.detail ||
//         err?.message ||
//         'Failed to save. Please try again.'
//       )
//     }
//   }

//   const isSaving   = saveCells.isPending || createCamera.isPending || updateCamera.isPending
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
//             {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
//           </h2>
//           <p className="text-gray-400 text-sm truncate">{cameraName}</p>
//         </div>
//         {/* Mode toggle */}
//         <button
//           onClick={() => {
//             setDrawingMode(m => !m)
//             setCurrentPoints([])
//             setMousePos(null)
//             setSelectedCell(null)
//           }}
//           className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
//             drawingMode
//               ? 'bg-[#c5a880] text-[#1c1c1c]'
//               : 'bg-white/10 text-white hover:bg-white/20'
//           }`}
//         >
//           {drawingMode ? '✏️ Drawing' : '👆 Select'}
//         </button>
//       </div>

//       {/* Step indicator */}
//       <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
//         <div className="flex items-center gap-2">
//           {!isInsider && (
//             <>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
//                   ✓
//                 </div>
//                 <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
//               </div>
//               <div className="flex-1 h-px bg-[#c5a880]/40" />
//             </>
//           )}
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
//               {isInsider ? '1' : '2'}
//             </div>
//             <span className="text-[#c5a880] text-xs font-bold">
//               {isInsider ? 'Define Zones' : 'Define Cells'}
//             </span>
//           </div>
//           <div className="flex-1 h-px bg-white/10" />
//           <div className="flex items-center gap-1.5">
//             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
//               {isInsider ? '2' : '3'}
//             </div>
//             <span className="text-white/40 text-xs font-bold">Save to DB</span>
//           </div>
//         </div>
//       </div>

//       {/* Stream unavailable banner */}
//       {streamOk === false && (
//         <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
//           <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
//           <p className="text-amber-300 text-xs">
//             Stream unavailable — drawing on placeholder.
//           </p>
//         </div>
//       )}

//       {/* Canvas + stream stacked */}
//       <div className="flex-1 relative bg-black" ref={containerRef}>

//         {/* MJPEG stream — behind canvas */}
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
//           className={`relative w-full transition-opacity duration-300 ${
//             drawingMode ? 'cursor-crosshair' : 'cursor-pointer'
//           }`}
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
//                     style={{
//                       backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined,
//                     }}
//                     className={`w-2 h-2 rounded-full transition-all ${
//                       i < currentPoints.length ? '' : 'bg-white/20'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <p className="text-[#c5a880] text-xs mt-1">
//                 {pointsLeft} pt{pointsLeft !== 1 ? 's' : ''} left
//               </p>
//             </>
//           )}
//           {drawingMode && currentPoints.length === 0 && (
//             <p className="text-[#c5a880] text-xs mt-0.5">Click Top-Left</p>
//           )}
//         </div>

//         {/* Selected cell action bar */}
//         {selectedCell !== null && !drawingMode && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
//             <div className="text-sm font-bold text-[#1c1c1c]">
//               {cells[selectedCell]?.cell_name}
//             </div>
//             <button
//               onClick={handleDeleteSelected}
//               className="flex items-center gap-1 text-red-500 text-sm font-bold hover:bg-red-50 px-2 py-1 rounded-full"
//             >
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//             <button
//               onClick={() => setSelectedCell(null)}
//               className="text-gray-400 text-sm px-2 py-1 rounded-full hover:bg-gray-100"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Cell name modal */}
//       {isNaming && (
//         <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
//             <h3 className="font-bold text-lg text-[#1c1c1c] mb-1">
//               Name This {isInsider ? 'Zone' : 'Cell'}
//             </h3>
//             <p className="text-gray-500 text-sm mb-4">
//               {isInsider
//                 ? 'e.g. "Reception", "Office A"'
//                 : 'e.g. "A1", "B2", "Gate A"'}
//             </p>
//             <input
//               type="text"
//               value={cellName}
//               onChange={e => { setCellName(e.target.value); setNameError('') }}
//               onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
//               placeholder={isInsider ? 'Reception, Office A…' : 'A1, B2, Gate A…'}
//               autoFocus
//               className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors ${
//                 nameError
//                   ? 'border-red-400 bg-red-50'
//                   : 'border-[#e6e3db] focus:border-[#c5a880]'
//               }`}
//             />
//             {nameError && (
//               <p className="text-red-500 text-xs mt-1.5 font-medium">{nameError}</p>
//             )}
//             {cells.length > 0 && (
//               <div className="mt-3 flex flex-wrap gap-1">
//                 <span className="text-xs text-gray-400 mr-1">Existing:</span>
//                 {cells.map(c => (
//                   <span
//                     key={c.cell_name}
//                     className="text-xs bg-[#faf9f6] border border-[#e6e3db] px-2 py-0.5 rounded-full text-gray-600 font-medium"
//                   >
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
//                   selectedCell === idx
//                     ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
//                     : 'bg-white text-[#1c1c1c] border-[#e6e3db]'
//                 }`}
//               >
//                 {cell.cell_name}
//               </button>
//             ))}
//           </div>
//         )}

//         <div className="text-sm text-gray-500">
//           {cells.length === 0 && currentPoints.length === 0 &&
//             `Tap "Add ${isInsider ? 'Zone' : 'Cell'}" then click 4 corners`}
//           {drawingMode && currentPoints.length === 0 && cells.length > 0 &&
//             `Click Top-Left corner to start a new ${entityLabel}`}
//           {drawingMode && currentPoints.length === 1 && 'Click Top-Right corner'}
//           {drawingMode && currentPoints.length === 2 && 'Click Bottom-Right corner'}
//           {drawingMode && currentPoints.length === 3 &&
//             `Click Bottom-Left to close the ${entityLabel}`}
//           {!drawingMode && cells.length > 0 &&
//             `${cells.length} ${entityLabel}${cells.length !== 1 ? 's' : ''} defined`}
//         </div>

//         {drawingMode && (
//           <div className="flex items-center gap-2">
//             {[0, 1, 2, 3].map(i => (
//               <div key={i} className="flex items-center gap-1.5 flex-1">
//                 <div
//                   style={{
//                     backgroundColor: i < currentPoints.length ? CELL_COLORS[i] : undefined,
//                   }}
//                   className={`w-3 h-3 rounded-full border-2 transition-all ${
//                     i < currentPoints.length
//                       ? 'border-transparent scale-110'
//                       : i === currentPoints.length
//                         ? 'border-white/60 bg-white/20 animate-pulse'
//                         : 'border-white/20 bg-transparent'
//                   }`}
//                 />
//                 <span className={`text-xs ${
//                   i < currentPoints.length
//                     ? 'text-white/80'
//                     : i === currentPoints.length
//                       ? 'text-white/50'
//                       : 'text-white/20'
//                 }`}>
//                   {POINT_LABELS[i]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={() => {
//               setCurrentPoints(prev => prev.slice(0, -1))
//               setMousePos(null)
//             }}
//             className={theme.button.secondary}
//             disabled={currentPoints.length === 0}
//             title="Undo last point"
//           >
//             <RotateCcw className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => {
//               setDrawingMode(true)
//               setSelectedCell(null)
//               setCurrentPoints([])
//               setMousePos(null)
//             }}
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
//               : <><Save className="w-4 h-4" /> Save {cells.length}{' '}
//                   {isInsider ? 'Zone' : 'Cell'}{cells.length !== 1 ? 's' : ''}</>
//             }
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default FenceCellEditor

// src/pages/FenceCellEditor.jsx
//
// FINAL STEP for ADD NEW and EDIT EXISTING camera configuration flows.
// This is the ONLY place that writes to the database for those two flows.
//
// Frame strategy — no backend fetch needed:
//   - Stream URL derived from sessionStorage rtsp_url
//   - <img> displays MJPEG stream behind a transparent <canvas>
//   - If stream errors → canvas draws placeholder grid
//   - Fence polygon overlay and cell drawing sit on the transparent canvas
//
// ── Two flows ──────────────────────────────────────────────────────────────
//  A) ADD NEW CAMERA   (isNew = cameraId === 'new')
//     handleSave: createCamera → savePolygon (fence) → saveCells
//  B) EDIT EXISTING    (isEditing, pendingCameraEdit in sessionStorage)
//     handleSave: updateCamera → savePolygon (fence) → saveCells

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Save, RotateCcw, CheckCircle,
  AlertTriangle, Loader2, Trash2, Plus, WifiOff,
} from 'lucide-react'
import { useFenceCells, useSaveFenceCells } from '../hooks/useFenceCells'
import { useCreateCamera, useUpdateCamera } from '../hooks/useCameras'
import { theme } from '../theme'

// ── Constants ──────────────────────────────────────────────────────────────

const CELL_COLORS = [
  '#ef4444', '#22c55e', '#3b82f6', '#c5a880',
  '#a855f7', '#f97316', '#06b6d4', '#84cc16',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
]
const POINT_LABELS = ['Top-Left', 'Top-Right', 'Bottom-Right', 'Bottom-Left']
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

const FenceCellEditor = () => {
  const { id: propertyId, cameraId } = useParams()
  const navigate = useNavigate()

  const isNew = cameraId === 'new'

  const pendingCamera = isNew
    ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
    : null

  const pendingEdit = !isNew
    ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || 'null')
    : null

  const isEditing =
    !isNew &&
    pendingEdit !== null &&
    String(pendingEdit.cameraId) === String(cameraId)

  const cameraType = isNew
    ? (pendingCamera?.camera_type || 'fence')
    : isEditing ? pendingEdit.data.camera_type : 'fence'

  const isInsider = cameraType === 'insider'

  // Stream URL from whichever flow is active
  const rtspUrl = isNew
    ? pendingCamera?.rtsp_url
    : isEditing ? pendingEdit?.data?.rtsp_url : null
  const streamUrl = deriveStreamUrl(rtspUrl)

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
  const [fencePolygon,  setFencePolygon]  = useState([])
  const [drawingMode,   setDrawingMode]   = useState(false)
  const [selectedCell,  setSelectedCell]  = useState(null)
  const [saveError,     setSaveError]     = useState('')

  const [cameraName] = useState(() => {
    if (isNew)     return pendingCamera?.name || 'New Camera'
    if (isEditing) return pendingEdit.data.name
    return `Camera ${cameraId}`
  })

  // ── API hooks ──────────────────────────────────────────────────────────
  const saveCells    = useSaveFenceCells()
  const createCamera = useCreateCamera()
  const updateCamera = useUpdateCamera()

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

  // ── Load fence polygon overlay from sessionStorage ─────────────────────

  useEffect(() => {
    if (isInsider || canvasSize.width === 0) return
    const canvas = canvasRef.current
    if (!canvas) return

    const polyPoints = isNew
      ? JSON.parse(sessionStorage.getItem('pendingCamera') || '{}').polygonPoints
      : isEditing
        ? JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}').polygonPoints
        : null

    if (polyPoints?.length === 4) {
      setFencePolygon(polyPoints.map(p => ({
        x: p.x * canvas.width,
        y: p.y * canvas.height,
      })))
    }
  }, [isNew, isEditing, isInsider, canvasSize])

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

    // Background: transparent (live stream shows through) or placeholder
    if (streamOk === false) {
      drawPlaceholder()
    } else {
      ctx.clearRect(0, 0, w, h)
    }

    // Fence polygon overlay (cutout effect)
    if (!isInsider && cameraType === 'fence' && fencePolygon.length === 4) {
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
  }, [streamOk, drawPlaceholder, fencePolygon, drawingMode, isInsider, cameraType])

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

  // ── Normalise cell points ──────────────────────────────────────────────

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

  // ── handleSave — only place that writes to DB ──────────────────────────

  const handleSave = async () => {
    if (cells.length === 0) return
    setSaveError('')

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const token  = localStorage.getItem('token')

    try {
      let finalCameraId = cameraId

      if (isNew) {
        const pending = JSON.parse(sessionStorage.getItem('pendingCamera') || '{}')
        if (!pending.name || !pending.rtsp_url || !pending.propertyId) {
          setSaveError('Camera data was lost — please start over.'); return
        }
        if (cameraType === 'fence' && !pending.polygonPoints?.length) {
          setSaveError('Polygon data was lost — please go back and redraw.'); return
        }

        const created = await createCamera.mutateAsync({
          propertyId: pending.propertyId,
          data: { name: pending.name, rtsp_url: pending.rtsp_url, grid_cell: pending.grid_cell, camera_type: pending.camera_type },
        })
        finalCameraId = created?.camera_id
        if (!finalCameraId) throw new Error('Camera created but ID was not returned.')

        if (cameraType === 'fence') {
          const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${finalCameraId}/fence-config`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body:    JSON.stringify(pending.polygonPoints),
          })
          if (!polyRes.ok) {
            const err = await polyRes.json().catch(() => ({}))
            throw new Error(err.detail || 'Failed to save polygon')
          }
        }

        sessionStorage.removeItem('pendingCamera')

      } else if (isEditing) {
        const edit = JSON.parse(sessionStorage.getItem('pendingCameraEdit') || '{}')
        if (!edit.data) { setSaveError('Edit data was lost — please start over.'); return }
        if (cameraType === 'fence' && !edit.polygonPoints?.length) {
          setSaveError('Polygon data was lost — please go back and redraw.'); return
        }

        await updateCamera.mutateAsync({ cameraId: edit.cameraId, propertyId: edit.propertyId, data: edit.data })

        if (cameraType === 'fence') {
          const polyRes = await fetch(`${apiUrl}/api/v1/fence-config/cameras/${cameraId}/fence-config`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body:    JSON.stringify(edit.polygonPoints),
          })
          if (!polyRes.ok) {
            const err = await polyRes.json().catch(() => ({}))
            throw new Error(err.detail || 'Failed to save polygon')
          }
        }

        sessionStorage.removeItem('pendingCameraEdit')
      }

      await saveCells.mutateAsync({ cameraId: finalCameraId, cells: normaliseCells() })
      navigate(`/property/${propertyId}/cameras`)

    } catch (err) {
      setSaveError(err?.response?.data?.detail || err?.message || 'Failed to save. Please try again.')
    }
  }

  const isSaving   = saveCells.isPending || createCamera.isPending || updateCamera.isPending
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
            {isInsider ? 'Define Insider Zones' : 'Define Fence Cells'}
          </h2>
          <p className="text-gray-400 text-sm truncate">{cameraName}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-[#c5a880]/10 border-b border-[#c5a880]/20 px-4 py-2">
        <div className="flex items-center gap-2">
          {!isInsider && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                <span className="text-white/60 text-xs font-bold">Draw Polygon</span>
              </div>
              <div className="flex-1 h-px bg-[#c5a880]/40" />
            </>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#c5a880] flex items-center justify-center text-[#1c1c1c] text-xs font-bold">
              {isInsider ? '1' : '2'}
            </div>
            <span className="text-[#c5a880] text-xs font-bold">
              {isInsider ? 'Define Zones' : 'Define Cells'}
            </span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold">
              {isInsider ? '2' : '3'}
            </div>
            <span className="text-white/40 text-xs font-bold">Save to DB</span>
          </div>
        </div>
      </div>

      {/* Stream unavailable banner */}
      {streamOk === false && (
        <div className="bg-amber-900/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-300 text-xs">
            Stream unavailable — drawing on placeholder.
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
              {isInsider ? 'e.g. "Reception", "Office A"' : 'e.g. "A1", "B2", "Gate A"'}
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
          {cells.length === 0 && currentPoints.length === 0 && `Tap "Add ${isInsider ? 'Zone' : 'Cell'}" then click 4 corners`}
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

export default FenceCellEditor