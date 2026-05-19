// // // src/pages/DroneControl.jsx
// // import { useParams, useNavigate } from 'react-router-dom'
// // import { ArrowLeft, Navigation } from 'lucide-react'
// // import { useState, useEffect } from 'react'
// // import { usePropertyStore } from '../store/propertyStore'
// // import HamburgerMenu from '../components/HamburgerMenu'
// // import { theme } from '../theme'

// // const DroneControl = () => {
// //   const { id }   = useParams()
// //   const navigate = useNavigate()
// //   const property = usePropertyStore((state) => state.getProperty(Number(id)))

// //   const [selectedDrone, setSelectedDrone] = useState(null)
// //   const [isManual,      setIsManual]      = useState(false)
// //   const [telemetry,     setTelemetry]     = useState({
// //     altitude: 120, speed: 0, satellites: 14, battery: 85, signal: 98,
// //   })

// //   useEffect(() => {
// //     if (property?.drones?.length > 0) setSelectedDrone(property.drones[0])
// //   }, [property])

// //   if (!property) { navigate('/properties'); return null }

// //   // No drones state
// //   if (!property.drones?.length) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={`${theme.card.lg} flex flex-col items-center text-center gap-5 max-w-sm w-full`}>
// //           <div className={theme.ui.iconBox}>
// //             <Navigation className="h-6 w-6 text-[#c5a880]" />
// //           </div>
// //           <div>
// //             <h2 className={`${theme.type.h3} mb-2`}>No Drones Available</h2>
// //             <p className={theme.type.body}>Add a drone first to use this feature</p>
// //           </div>
// //           <button
// //             onClick={() => navigate(`/property/${id}/drones`)}
// //             className={theme.button.primary}
// //           >
// //             Add Drone
// //           </button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-black relative overflow-hidden">

// //       {/* Header overlay */}
// //       <div className="absolute top-0 left-0 w-full z-10 p-4
// //                       bg-gradient-to-b from-black/80 to-transparent
// //                       flex justify-between items-center">
// //         <div className="flex items-center gap-3">
// //           <button onClick={() => navigate(-1)} className={theme.button.iconDark}>
// //             <ArrowLeft className="h-6 w-6" />
// //           </button>
// //           <div>
// //             <h2 className="text-white font-sans font-black text-base tracking-tight">
// //               Drone Control
// //             </h2>
// //             <p className={theme.type.whiteMuted}>{property.name}</p>
// //           </div>
// //         </div>
// //         <HamburgerMenu propertyId={id} />
// //       </div>

// //       {/* FPV background */}
// //       <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c] to-black">
// //         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
// //           <div className="w-20 h-20 border-2 border-white/20 rounded-full
// //                           flex items-center justify-center">
// //             <div className="w-1 h-5 bg-white/40 absolute" />
// //             <div className="h-1 w-5 bg-white/40 absolute" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* HUD — top row */}
// //       <div className="absolute top-20 left-4 right-4
// //                       flex justify-between font-mono text-sm z-10">
// //         {[
// //           { label: 'ALT', value: `${telemetry.altitude}m`, color: 'text-white' },
// //           { label: 'GPS', value: `${telemetry.satellites} Sat`, color: 'text-emerald-400' },
// //           { label: 'SPD', value: `${telemetry.speed}m/s`, color: 'text-white' },
// //         ].map(({ label, value, color }) => (
// //           <div key={label}
// //                className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
// //             <span className="text-gray-500 text-xs">{label}: </span>
// //             <span className={`font-bold ${color}`}>{value}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* HUD — second row */}
// //       <div className="absolute top-32 left-4 right-4
// //                       flex justify-between font-mono text-sm z-10">
// //         <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
// //           <span className="text-gray-500 text-xs">BAT: </span>
// //           <span className={`font-bold ${telemetry.battery < 20 ? 'text-red-400' : 'text-emerald-400'}`}>
// //             {telemetry.battery}%
// //           </span>
// //         </div>
// //         <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
// //           <span className="text-gray-500 text-xs">LINK: </span>
// //           <span className="font-bold text-[#c5a880]">{telemetry.signal}%</span>
// //         </div>
// //       </div>

// //       {/* Emergency buttons */}
// //       <div className="absolute top-20 left-4 z-10">
// //         <button className="bg-amber-500/80 hover:bg-amber-500 text-white
// //                            font-sans font-bold py-2 px-4 rounded-full text-xs
// //                            backdrop-blur transition-all">
// //           RTH
// //         </button>
// //       </div>
// //       <div className="absolute top-20 right-16 z-10">
// //         <button className="bg-red-500/80 hover:bg-red-500 text-white
// //                            font-sans font-bold py-2 px-4 rounded-full text-xs
// //                            backdrop-blur transition-all">
// //           LAND
// //         </button>
// //       </div>

// //       {/* Virtual joysticks */}
// //       <div className="absolute bottom-28 left-6 w-28 h-28 rounded-full
// //                       border-2 border-white/20 bg-white/5 backdrop-blur
// //                       flex items-center justify-center z-10">
// //         <div className="w-10 h-10 bg-white/20 rounded-full" />
// //       </div>
// //       <div className="absolute bottom-28 right-6 w-28 h-28 rounded-full
// //                       border-2 border-white/20 bg-white/5 backdrop-blur
// //                       flex items-center justify-center z-10">
// //         <div className="w-10 h-10 bg-white/20 rounded-full" />
// //       </div>

// //       {/* Mode toggle */}
// //       <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10">
// //         <button
// //           onClick={() => setIsManual(!isManual)}
// //           className={`font-sans font-black py-3 px-6 rounded-full
// //                       backdrop-blur whitespace-nowrap transition-all text-sm
// //                       ${isManual
// //                         ? 'bg-red-500/80 text-white hover:bg-red-500'
// //                         : 'bg-[#c5a880]/80 text-white hover:bg-[#c5a880]'}`}
// //         >
// //           {isManual ? 'MANUAL CONTROL ACTIVE' : 'TAKE MANUAL CONTROL'}
// //         </button>
// //       </div>

// //       {/* Bottom status bar */}
// //       <div className="absolute bottom-4 left-4 right-4
// //                       bg-black/60 backdrop-blur rounded-[1.5rem] px-4 py-3 z-10">
// //         <div className="flex justify-between items-center text-sm">
// //           <div>
// //             <span className="text-gray-400 font-sans text-xs">Drone: </span>
// //             <span className="text-white font-sans font-bold text-xs">
// //               {selectedDrone?.name || 'None'}
// //             </span>
// //           </div>
// //           <div>
// //             <span className="text-gray-400 font-sans text-xs">Status: </span>
// //             <span className={`font-sans font-bold text-xs ${
// //               selectedDrone?.status === 'Flying'
// //                 ? 'text-[#c5a880]'
// //                 : 'text-emerald-400'
// //             }`}>
// //               {selectedDrone?.status || 'Offline'}
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //     </div>
// //   )
// // }

// // export default DroneControl

// // src/pages/DroneControl.jsx
// import { useParams, useNavigate } from 'react-router-dom'
// import { useState, useEffect, useRef, useCallback } from 'react'
// import { useProperty } from '../hooks/useProperties';
// import HamburgerMenu from '../components/HamburgerMenu'

// // ─── Theme tokens ────────────────────────────────────────────────────────────
// const C = {
//   bg:          '#0a0a0a',
//   surface:     'rgba(255,255,255,0.05)',
//   border:      'rgba(255,255,255,0.10)',
//   borderHover: 'rgba(255,255,255,0.20)',
//   primary:     '#c5a880',
//   success:     '#34d399',
//   danger:      '#f87171',
//   warning:     '#f59e0b',
//   textPrimary: '#e5e7eb',
//   textMuted:   '#9ca3af',
//   textDim:     '#6b7280',
// }

// // ─── Small helpers ────────────────────────────────────────────────────────────
// const HudPill = ({ label, value, color = C.textPrimary }) => (
//   <div style={{
//     background: 'rgba(0,0,0,0.55)',
//     border: `0.5px solid ${C.border}`,
//     borderRadius: 999,
//     padding: '4px 12px',
//     fontFamily: 'monospace',
//     fontSize: 12,
//     color: C.textMuted,
//     display: 'flex',
//     alignItems: 'center',
//     gap: 4,
//   }}>
//     {label}{' '}
//     <span style={{ fontWeight: 600, fontSize: 13, color }}>{value}</span>
//   </div>
// )

// const DpadBtn = ({ icon, onClick, label }) => (
//   <button
//     aria-label={label}
//     onClick={onClick}
//     style={{
//       width: 52, height: 52,
//       borderRadius: 10,
//       border: `0.5px solid ${C.border}`,
//       background: C.surface,
//       color: C.textPrimary,
//       fontSize: 22,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       cursor: 'pointer',
//       transition: 'all 0.15s',
//     }}
//     onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
//     onMouseLeave={e => e.currentTarget.style.background = C.surface}
//     onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
//     onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
//   >
//     {icon}
//   </button>
// )

// const CircleBtn = ({ label, onClick }) => (
//   <button
//     onClick={onClick}
//     style={{
//       width: 58, height: 58,
//       borderRadius: '50%',
//       border: `0.5px solid ${C.border}`,
//       background: C.surface,
//       color: C.textPrimary,
//       fontSize: 10,
//       fontWeight: 600,
//       letterSpacing: 1,
//       textTransform: 'uppercase',
//       cursor: 'pointer',
//       transition: 'all 0.15s',
//     }}
//     onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
//     onMouseLeave={e => e.currentTarget.style.background = C.surface}
//     onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
//     onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
//   >
//     {label}
//   </button>
// )

// // ─── Settings Modal ───────────────────────────────────────────────────────────
// const SettingsModal = ({ ip, port, onSave, onClose }) => {
//   const [localIp, setLocalIp] = useState(ip)
//   const [localPort, setLocalPort] = useState(port)

//   const inputStyle = {
//     width: '100%',
//     background: 'rgba(255,255,255,0.06)',
//     border: `0.5px solid ${C.border}`,
//     borderRadius: 8,
//     padding: '8px 12px',
//     color: C.textPrimary,
//     fontFamily: 'monospace',
//     fontSize: 13,
//     marginBottom: 10,
//     outline: 'none',
//   }

//   return (
//     <div style={{
//       position: 'absolute', inset: 0, zIndex: 20,
//       background: 'rgba(0,0,0,0.72)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       borderRadius: 16,
//     }}>
//       <div style={{
//         background: '#161616',
//         border: `0.5px solid ${C.border}`,
//         borderRadius: 14,
//         padding: 22,
//         width: 290,
//       }}>
//         <p style={{ color: C.textPrimary, fontWeight: 600, fontSize: 15, marginBottom: 18 }}>
//           Pi 4 network link
//         </p>

//         <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>IP address</p>
//         <input
//           style={inputStyle}
//           value={localIp}
//           onChange={e => setLocalIp(e.target.value)}
//           placeholder="192.168.0.200"
//         />

//         <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Port</p>
//         <input
//           style={inputStyle}
//           value={localPort}
//           onChange={e => setLocalPort(e.target.value)}
//           type="number"
//           placeholder="5000"
//         />

//         <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
//           <button
//             onClick={onClose}
//             style={{
//               flex: 1, height: 36, borderRadius: 8,
//               border: `0.5px solid ${C.border}`,
//               background: 'transparent',
//               color: C.textMuted, cursor: 'pointer', fontSize: 13,
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => { onSave(localIp, localPort); onClose() }}
//             style={{
//               flex: 1, height: 36, borderRadius: 8,
//               border: 'none',
//               background: C.primary,
//               color: '#0a0a0a', fontWeight: 600, cursor: 'pointer', fontSize: 13,
//             }}
//           >
//             Save link
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// const DroneControl = () => {
//   const { id }   = useParams()
//   const navigate = useNavigate()
//  const { data: property, isLoading } = useProperty(id)

//  if (isLoading) return (
//   <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//     <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</p>
//   </div>
// )

//   // UDP / connection state
//   const [targetIp,   setTargetIp]   = useState('192.168.0.200')
//   const [targetPort, setTargetPort] = useState(5000)
//   const [isConnected, setIsConnected] = useState(false)
//   const [isArmed,     setIsArmed]     = useState(false)

//   // UI state
//   const [position,       setPosition]       = useState({ col: 0, row: 0 })
//   const [selectedDrone,  setSelectedDrone]  = useState(null)
//   const [showSettings,   setShowSettings]   = useState(false)
//   const [snackVisible,   setSnackVisible]   = useState(false)
//   const [pitchHolding,   setPitchHolding]   = useState(false)

//   // HUD telemetry (replace with real WebSocket data as needed)
//   const [telemetry, setTelemetry] = useState({
//     altitude: 120, speed: 0, satellites: 14, battery: 85, signal: 98,
//   })

//   const snackTimer = useRef(null)

//   useEffect(() => {
//     if (property?.drones?.length > 0) setSelectedDrone(property.drones[0])
//   }, [property])

//   // Load saved network settings
//   useEffect(() => {
//     const savedIp   = localStorage.getItem('targetIp')
//     const savedPort = localStorage.getItem('targetPort')
//     if (savedIp)   setTargetIp(savedIp)
//     if (savedPort) setTargetPort(Number(savedPort))
//   }, [])

//   const saveNetworkSettings = (ip, port) => {
//     localStorage.setItem('targetIp', ip)
//     localStorage.setItem('targetPort', port)
//     setTargetIp(ip)
//     setTargetPort(Number(port))
//   }

//   // ── UDP send (replace body with your actual transport) ──
//   const sendDirectPacket = useCallback((payload) => {
//     console.log(`UDP → ${targetIp}:${targetPort}`, payload)
//     // Example with a WebSocket proxy:
//     // ws.current?.send(JSON.stringify({ ...payload, ip: targetIp, port: targetPort }))
//   }, [targetIp, targetPort])

//   // ── Connection toggle ──
//   const handleConnectionToggle = (val) => {
//     setIsConnected(val)
//     if (!val && isArmed) {
//       setIsArmed(false)
//       sendDirectPacket({ command: 'disarm' })
//     }
//     sendDirectPacket({ command: val ? 'connect' : 'disconnect' })
//   }

//   // ── Arm toggle ──
//   const handleArmToggle = (val) => {
//     setIsArmed(val)
//     sendDirectPacket({ command: val ? 'arm' : 'disarm' })
//   }

//   // ── D-pad move ──
//   const move = (direction) => {
//     const macros = { up: 'pitch_front', down: 'pitch_back', left: 'roll_left', right: 'roll_right' }
//     sendDirectPacket({ macro: macros[direction] })
//     setPosition(p => ({
//       col: p.col + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
//       row: p.row + (direction === 'up'   ? -1 : direction === 'down'  ? 1 : 0),
//     }))
//   }

//   // ── Emergency kill ──
//   const fireEmergencyKill = () => {
//     for (let i = 0; i < 5; i++) sendDirectPacket({ kill: true })
//     setIsArmed(false)
//     clearTimeout(snackTimer.current)
//     setSnackVisible(true)
//     snackTimer.current = setTimeout(() => setSnackVisible(false), 2200)
//   }

//   // ── Pitch hold ──
//   const startPitchHold = () => {
//     setPitchHolding(true)
//     sendDirectPacket({ macro: 'pitch_forward_start' })
//   }
//   const stopPitchHold = () => {
//     setPitchHolding(false)
//     sendDirectPacket({ macro: 'pitch_forward_stop' })
//   }

//   // ─── No property ───────────────────────────────────────────────────────────
//   if (!property) { navigate('/properties'); return null }

//   if (!property.drones?.length) {
//     return (
//       <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{
//           background: '#161616', border: `0.5px solid ${C.border}`,
//           borderRadius: 16, padding: 32,
//           maxWidth: 340, width: '100%',
//           display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center',
//         }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: 14,
//             background: 'rgba(197,168,128,0.12)',
//             border: `0.5px solid rgba(197,168,128,0.3)`,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 24,
//           }}>✈</div>
//           <div>
//             <h2 style={{ color: C.textPrimary, fontWeight: 600, marginBottom: 6 }}>No drones available</h2>
//             <p style={{ color: C.textMuted, fontSize: 14 }}>Add a drone first to use this feature</p>
//           </div>
//           <button
//             onClick={() => navigate(`/property/${id}/drones`)}
//             style={{
//               background: C.primary, color: '#0a0a0a',
//               border: 'none', borderRadius: 10,
//               padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
//             }}
//           >
//             Add drone
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // ─── Main screen ──────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: C.bg,
//       display: 'flex', flexDirection: 'column',
//       padding: '14px 14px 20px',
//       gap: 10,
//       position: 'relative',
//       fontFamily: "'DM Sans', sans-serif",
//     }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               width: 34, height: 34,
//               borderRadius: 10,
//               border: `0.5px solid ${C.border}`,
//               background: C.surface,
//               color: C.textPrimary, fontSize: 18,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               cursor: 'pointer',
//             }}
//           >←</button>
//           <div>
//             <h2 style={{ color: C.textPrimary, fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.3px' }}>Drone control</h2>
//             <p style={{ color: C.textDim, fontSize: 12, margin: 0 }}>{property.name}</p>
//           </div>
//         </div>
//         {/* Swap HamburgerMenu in here if available */}
//         {/* <HamburgerMenu propertyId={id} /> */}
//       </div>

//       {/* ── Action Bar ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

//         {/* Connection toggle */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           <span style={{ fontSize: 16, color: isConnected ? C.success : C.textDim }}>🔗</span>
//           <ToggleSwitch
//             checked={isConnected}
//             activeColor={C.success}
//             onChange={handleConnectionToggle}
//             label={isConnected ? 'Online' : 'Offline'}
//           />
//         </div>

//         <div style={{ flex: 1 }} />

//         {/* Arm toggle */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           <span style={{ fontSize: 16, color: isArmed ? C.danger : C.textDim }}>🔓</span>
//           <ToggleSwitch
//             checked={isArmed}
//             activeColor={C.danger}
//             disabled={!isConnected}
//             onChange={handleArmToggle}
//             label={isArmed ? 'Armed' : 'Disarmed'}
//           />
//         </div>

//         <div style={{ flex: 1 }} />

//         {/* Settings */}
//         <button
//           onClick={() => setShowSettings(true)}
//           style={{
//             width: 34, height: 34, borderRadius: 10,
//             border: `0.5px solid ${C.border}`,
//             background: C.surface, color: C.textDim,
//             fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             cursor: 'pointer',
//           }}
//           aria-label="Network settings"
//         >⚙</button>
//       </div>

//       {/* ── HUD pills ── */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//         <HudPill label="ALT" value={`${telemetry.altitude}m`} />
//         <HudPill label="GPS" value={`${telemetry.satellites} sat`} color={C.success} />
//         <HudPill label="SPD" value={`${telemetry.speed} m/s`} />
//         <HudPill label="BAT" value={`${telemetry.battery}%`} color={telemetry.battery < 20 ? C.danger : C.success} />
//         <HudPill label="LINK" value={`${telemetry.signal}%`} color={C.primary} />
//       </div>

//       {/* ── Crosshair ── */}
//       <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
//         <div style={{
//           width: 64, height: 64, borderRadius: '50%',
//           border: `1.5px solid rgba(255,255,255,0.15)`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           position: 'relative',
//         }}>
//           <div style={{ position: 'absolute', width: 20, height: 1.5, background: 'rgba(255,255,255,0.3)' }} />
//           <div style={{ position: 'absolute', height: 20, width: 1.5, background: 'rgba(255,255,255,0.3)' }} />
//         </div>
//       </div>

//       {/* ── Takeoff / Land ── */}
//       <div style={{ display: 'flex', gap: 10 }}>
//         {[
//           { label: 'Takeoff', macro: 'takeoff', color: C.primary },
//           { label: 'Land',    macro: 'land',    color: C.danger  },
//         ].map(({ label, macro, color }) => (
//           <button
//             key={macro}
//             onClick={() => sendDirectPacket({ macro })}
//             style={{
//               flex: 1, height: 48, borderRadius: 10,
//               border: `1px solid ${color}80`,
//               background: 'rgba(0,0,0,0.3)',
//               color, fontWeight: 600, fontSize: 12,
//               letterSpacing: 1, textTransform: 'uppercase',
//               cursor: 'pointer', transition: 'all 0.15s',
//             }}
//             onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
//             onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* ── Pitch hold ── */}
//       <button
//         style={{
//           width: '100%', height: 52, borderRadius: 10,
//           border: `1.5px solid ${pitchHolding ? C.warning : 'rgba(234,179,8,0.35)'}`,
//           background: pitchHolding ? 'rgba(234,179,8,0.12)' : 'rgba(0,0,0,0.3)',
//           color: C.warning, fontWeight: 600, fontSize: 12,
//           letterSpacing: 1, textTransform: 'uppercase',
//           cursor: 'pointer', transition: 'all 0.15s',
//           userSelect: 'none',
//         }}
//         onMouseDown={startPitchHold}
//         onMouseUp={stopPitchHold}
//         onMouseLeave={stopPitchHold}
//         onTouchStart={startPitchHold}
//         onTouchEnd={stopPitchHold}
//       >
//         {pitchHolding ? 'Pitching forward…' : 'Hold to pitch forward'}
//       </button>

//       {/* ── Control matrix ── */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

//         {/* Yaw buttons */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//           <CircleBtn label="Yaw L" onClick={() => sendDirectPacket({ macro: 'yaw_left_90' })} />
//           <CircleBtn label="Yaw R" onClick={() => sendDirectPacket({ macro: 'yaw_right_90' })} />
//         </div>

//         {/* D-pad */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 52px)', gridTemplateRows: 'repeat(3, 52px)', gap: 3 }}>
//           <span />
//           <DpadBtn icon="▲" label="Forward" onClick={() => move('up')} />
//           <span />
//           <DpadBtn icon="◀" label="Left"    onClick={() => move('left')} />
//           {/* Coordinate indicator */}
//           <div style={{
//             width: 52, height: 52, borderRadius: 10,
//             border: `0.5px solid ${C.border}`,
//             background: C.surface,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: C.primary,
//           }}>
//             {position.col},{position.row}
//           </div>
//           <DpadBtn icon="▶" label="Right"   onClick={() => move('right')} />
//           <span />
//           <DpadBtn icon="▼" label="Back"    onClick={() => move('down')} />
//           <span />
//         </div>

//         {/* Emergency kill */}
//         <button
//           onClick={fireEmergencyKill}
//           aria-label="Emergency kill"
//           style={{
//             width: 72, height: 124,
//             borderRadius: 14,
//             border: `1.5px solid ${C.danger}`,
//             background: 'rgba(248,113,113,0.10)',
//             display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center',
//             gap: 8, cursor: 'pointer', transition: 'all 0.15s',
//             color: C.danger,
//           }}
//           onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.20)'}
//           onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.10)'}
//           onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
//           onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
//         >
//           <span style={{ fontSize: 26 }}>🛡</span>
//           <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Kill</span>
//         </button>
//       </div>

//       {/* ── Status bar ── */}
//       <div style={{
//         background: 'rgba(0,0,0,0.55)',
//         border: `0.5px solid ${C.border}`,
//         borderRadius: 14,
//         padding: '10px 16px',
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//       }}>
//         <div>
//           <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Drone</p>
//           <p style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
//             {selectedDrone?.name || 'None'}
//           </p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Status</p>
//           <p style={{
//             fontSize: 13, fontWeight: 600, margin: 0,
//             color: isArmed ? C.danger : selectedDrone?.status === 'Flying' ? C.primary : C.success,
//           }}>
//             {isArmed ? 'Armed' : selectedDrone?.status || 'Offline'}
//           </p>
//         </div>
//       </div>

//       {/* ── Emergency snackbar ── */}
//       {snackVisible && (
//         <div style={{
//           position: 'absolute', bottom: 80, left: 14, right: 14,
//           background: C.danger, borderRadius: 10,
//           padding: '10px 16px',
//           textAlign: 'center',
//           fontSize: 14, fontWeight: 700, color: '#fff',
//           letterSpacing: 1.5, textTransform: 'uppercase',
//           zIndex: 10,
//           animation: 'fadeIn 0.15s ease',
//         }}>
//           Emergency kill sent
//         </div>
//       )}

//       {/* ── Settings modal ── */}
//       {showSettings && (
//         <SettingsModal
//           ip={targetIp}
//           port={targetPort}
//           onSave={saveNetworkSettings}
//           onClose={() => setShowSettings(false)}
//         />
//       )}
//     </div>
//   )
// }

// // ─── Toggle Switch ────────────────────────────────────────────────────────────
// const ToggleSwitch = ({ checked, onChange, activeColor, disabled = false, label }) => {
//   const trackBg = checked ? `${activeColor}30` : 'rgba(255,255,255,0.06)'
//   const thumbBg = checked ? activeColor : '#6b7280'

//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: disabled ? 0.4 : 1 }}>
//       <div
//         role="switch"
//         aria-checked={checked}
//         aria-label={label}
//         onClick={() => !disabled && onChange(!checked)}
//         style={{
//           width: 40, height: 22, borderRadius: 999,
//           background: trackBg,
//           border: `0.5px solid ${checked ? activeColor + '60' : 'rgba(255,255,255,0.10)'}`,
//           position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
//           transition: 'all 0.2s',
//         }}
//       >
//         <div style={{
//           position: 'absolute',
//           top: 3, left: checked ? 20 : 3,
//           width: 16, height: 16, borderRadius: '50%',
//           background: thumbBg,
//           transition: 'all 0.2s',
//         }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 500, color: checked ? activeColor : '#6b7280', letterSpacing: 0.5 }}>
//         {label}
//       </span>
//     </div>
//   )
// }

// export default DroneControl

// src/pages/DroneControl.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useProperty } from '../hooks/useProperties'
import HamburgerMenu from '../components/HamburgerMenu'

// ─── Theme tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          '#0a0a0a',
  surface:     'rgba(255,255,255,0.05)',
  border:      'rgba(255,255,255,0.10)',
  borderHover: 'rgba(255,255,255,0.20)',
  primary:     '#c5a880',
  success:     '#34d399',
  danger:      '#f87171',
  warning:     '#f59e0b',
  textPrimary: '#e5e7eb',
  textMuted:   '#9ca3af',
  textDim:     '#6b7280',
}

// ─── Small helpers ────────────────────────────────────────────────────────────
const HudPill = ({ label, value, color = C.textPrimary }) => (
  <div style={{
    background: 'rgba(0,0,0,0.55)',
    border: `0.5px solid ${C.border}`,
    borderRadius: 999,
    padding: '4px 12px',
    fontFamily: 'monospace',
    fontSize: 12,
    color: C.textMuted,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  }}>
    {label}{' '}
    <span style={{ fontWeight: 600, fontSize: 13, color }}>{value}</span>
  </div>
)

const DpadBtn = ({ icon, onClick, label }) => (
  <button
    aria-label={label}
    onClick={onClick}
    style={{
      width: 52, height: 52,
      borderRadius: 10,
      border: `0.5px solid ${C.border}`,
      background: C.surface,
      color: C.textPrimary,
      fontSize: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
    onMouseLeave={e => e.currentTarget.style.background = C.surface}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    {icon}
  </button>
)

const CircleBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: 58, height: 58,
      borderRadius: '50%',
      border: `0.5px solid ${C.border}`,
      background: C.surface,
      color: C.textPrimary,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 1,
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
    onMouseLeave={e => e.currentTarget.style.background = C.surface}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    {label}
  </button>
)

// ─── Settings Modal ───────────────────────────────────────────────────────────
const SettingsModal = ({ ip, port, onSave, onClose }) => {
  const [localIp, setLocalIp] = useState(ip)
  const [localPort, setLocalPort] = useState(port)

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: `0.5px solid ${C.border}`,
    borderRadius: 8,
    padding: '8px 12px',
    color: C.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
    marginBottom: 10,
    outline: 'none',
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'rgba(0,0,0,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 16,
    }}>
      <div style={{
        background: '#161616',
        border: `0.5px solid ${C.border}`,
        borderRadius: 14,
        padding: 22,
        width: 290,
      }}>
        <p style={{ color: C.textPrimary, fontWeight: 600, fontSize: 15, marginBottom: 18 }}>
          Pi 4 network link
        </p>

        <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>IP address</p>
        <input
          style={inputStyle}
          value={localIp}
          onChange={e => setLocalIp(e.target.value)}
          placeholder="192.168.0.200"
        />

        <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Port</p>
        <input
          style={inputStyle}
          value={localPort}
          onChange={e => setLocalPort(e.target.value)}
          type="number"
          placeholder="5000"
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 36, borderRadius: 8,
              border: `0.5px solid ${C.border}`,
              background: 'transparent',
              color: C.textMuted, cursor: 'pointer', fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(localIp, localPort); onClose() }}
            style={{
              flex: 1, height: 36, borderRadius: 8,
              border: 'none',
              background: C.primary,
              color: '#0a0a0a', fontWeight: 600, cursor: 'pointer', fontSize: 13,
            }}
          >
            Save link
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DroneControl = () => {
  const { id }   = useParams()
  const navigate = useNavigate()

  // ── Fetch property via React Query ──
  const { data: property, isLoading } = useProperty(id)

  // ── Network settings ──
  const [targetIp,   setTargetIp]   = useState('192.168.0.200')
  const [targetPort, setTargetPort] = useState(5000)

  // ── Connection / arm state ──
  const [isConnected, setIsConnected] = useState(false)
  const [isArmed,     setIsArmed]     = useState(false)

  // ── UI state ──
  const [position,      setPosition]      = useState({ col: 0, row: 0 })
  const [selectedDrone, setSelectedDrone] = useState(null)
  const [showSettings,  setShowSettings]  = useState(false)
  const [snackVisible,  setSnackVisible]  = useState(false)
  const [pitchHolding,  setPitchHolding]  = useState(false)

  // ── Live telemetry — updated via WebSocket ──
  const [telemetry, setTelemetry] = useState({
    altitude: 0, speed: 0, satellites: 0, battery: 0, signal: 0,
  })

  // ── Refs ──
  const ws         = useRef(null)
  const snackTimer = useRef(null)

  // ── Restore saved network settings on mount ──
  useEffect(() => {
    const savedIp   = localStorage.getItem('targetIp')
    const savedPort = localStorage.getItem('targetPort')
    if (savedIp)   setTargetIp(savedIp)
    if (savedPort) setTargetPort(Number(savedPort))
  }, [])

  // ── Set default selected drone when property loads ──
  useEffect(() => {
    if (property?.drones?.length > 0) setSelectedDrone(property.drones[0])
  }, [property])

  // ── WebSocket: open when connected, close when disconnected ──
  // Pi 4 must run a WS server that forwards JSON → UDP to the drone locally.
  // It should also push telemetry back as: { type: 'telemetry', altitude, speed, satellites, battery, signal }
  useEffect(() => {
    if (!isConnected) {
      ws.current?.close()
      ws.current = null
      return
    }

    const socket = new WebSocket(`ws://${targetIp}:${targetPort}`)
    ws.current = socket

    socket.onopen = () => {
      console.log(`WS connected → ${targetIp}:${targetPort}`)
    }

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'telemetry') {
          setTelemetry(prev => ({
            altitude:   msg.altitude   ?? prev.altitude,
            speed:      msg.speed      ?? prev.speed,
            satellites: msg.satellites ?? prev.satellites,
            battery:    msg.battery    ?? prev.battery,
            signal:     msg.signal     ?? prev.signal,
          }))
        }
      } catch (e) {
        console.warn('WS message parse error:', e)
      }
    }

    socket.onerror = (e) => {
      console.error('WS error:', e)
    }

    socket.onclose = () => {
      console.log('WS closed')
      setIsConnected(false)
      setIsArmed(false)
    }

    return () => socket.close()
  }, [isConnected, targetIp, targetPort])

  const saveNetworkSettings = (ip, port) => {
    localStorage.setItem('targetIp', ip)
    localStorage.setItem('targetPort', port)
    setTargetIp(ip)
    setTargetPort(Number(port))
  }

  // ── Send JSON payload to Pi 4 over WebSocket (Pi forwards via UDP to drone) ──
  const sendDirectPacket = useCallback((payload) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload))
    } else {
      console.warn('WS not open — packet dropped:', payload)
    }
  }, [])

  // ── Connection toggle ──
  const handleConnectionToggle = (val) => {
    setIsConnected(val)
    if (!val && isArmed) {
      setIsArmed(false)
      sendDirectPacket({ command: 'disarm' })
    }
    sendDirectPacket({ command: val ? 'connect' : 'disconnect' })
  }

  // ── Arm toggle ──
  const handleArmToggle = (val) => {
    setIsArmed(val)
    sendDirectPacket({ command: val ? 'arm' : 'disarm' })
  }

  // ── D-pad move ──
  const move = (direction) => {
    const macros = { up: 'pitch_front', down: 'pitch_back', left: 'roll_left', right: 'roll_right' }
    sendDirectPacket({ macro: macros[direction] })
    setPosition(p => ({
      col: p.col + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
      row: p.row + (direction === 'up'   ? -1 : direction === 'down'  ? 1 : 0),
    }))
  }

  // ── Emergency kill ──
  const fireEmergencyKill = () => {
    for (let i = 0; i < 5; i++) sendDirectPacket({ kill: true })
    setIsArmed(false)
    clearTimeout(snackTimer.current)
    setSnackVisible(true)
    snackTimer.current = setTimeout(() => setSnackVisible(false), 2200)
  }

  // ── Pitch hold ──
  const startPitchHold = () => {
    setPitchHolding(true)
    sendDirectPacket({ macro: 'pitch_forward_start' })
  }
  const stopPitchHold = () => {
    setPitchHolding(false)
    sendDirectPacket({ macro: 'pitch_forward_stop' })
  }

  // ─── No property ───────────────────────────────────────────────────────────
  if (!property) { navigate('/properties'); return null }

  if (!property.drones?.length) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#161616', border: `0.5px solid ${C.border}`,
          borderRadius: 16, padding: 32,
          maxWidth: 340, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(197,168,128,0.12)',
            border: `0.5px solid rgba(197,168,128,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>✈</div>
          <div>
            <h2 style={{ color: C.textPrimary, fontWeight: 600, marginBottom: 6 }}>No drones available</h2>
            <p style={{ color: C.textMuted, fontSize: 14 }}>Add a drone first to use this feature</p>
          </div>
          <button
            onClick={() => navigate(`/property/${id}/drones`)}
            style={{
              background: C.primary, color: '#0a0a0a',
              border: 'none', borderRadius: 10,
              padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14,
            }}
          >
            Add drone
          </button>
        </div>
      </div>
    )
  }

  // ─── Main screen ──────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      padding: '14px 14px 20px',
      gap: 10,
      position: 'relative',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 34, height: 34,
              borderRadius: 10,
              border: `0.5px solid ${C.border}`,
              background: C.surface,
              color: C.textPrimary, fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >←</button>
          <div>
            <h2 style={{ color: C.textPrimary, fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.3px' }}>Drone control</h2>
            <p style={{ color: C.textDim, fontSize: 12, margin: 0 }}>{property.name}</p>
          </div>
        </div>
        {/* Swap HamburgerMenu in here if available */}
        {/* <HamburgerMenu propertyId={id} /> */}
      </div>

      {/* ── Action Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Connection toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16, color: isConnected ? C.success : C.textDim }}>🔗</span>
          <ToggleSwitch
            checked={isConnected}
            activeColor={C.success}
            onChange={handleConnectionToggle}
            label={isConnected ? 'Online' : 'Offline'}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Arm toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16, color: isArmed ? C.danger : C.textDim }}>🔓</span>
          <ToggleSwitch
            checked={isArmed}
            activeColor={C.danger}
            disabled={!isConnected}
            onChange={handleArmToggle}
            label={isArmed ? 'Armed' : 'Disarmed'}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: 34, height: 34, borderRadius: 10,
            border: `0.5px solid ${C.border}`,
            background: C.surface, color: C.textDim,
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Network settings"
        >⚙</button>
      </div>

      {/* ── HUD pills ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <HudPill label="ALT" value={`${telemetry.altitude}m`} />
        <HudPill label="GPS" value={`${telemetry.satellites} sat`} color={C.success} />
        <HudPill label="SPD" value={`${telemetry.speed} m/s`} />
        <HudPill label="BAT" value={`${telemetry.battery}%`} color={telemetry.battery < 20 ? C.danger : C.success} />
        <HudPill label="LINK" value={`${telemetry.signal}%`} color={C.primary} />
      </div>

      {/* ── Crosshair ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: `1.5px solid rgba(255,255,255,0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', width: 20, height: 1.5, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ position: 'absolute', height: 20, width: 1.5, background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>

      {/* ── Takeoff / Land ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Takeoff', macro: 'takeoff', color: C.primary },
          { label: 'Land',    macro: 'land',    color: C.danger  },
        ].map(({ label, macro, color }) => (
          <button
            key={macro}
            onClick={() => sendDirectPacket({ macro })}
            style={{
              flex: 1, height: 48, borderRadius: 10,
              border: `1px solid ${color}80`,
              background: 'rgba(0,0,0,0.3)',
              color, fontWeight: 600, fontSize: 12,
              letterSpacing: 1, textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Pitch hold ── */}
      <button
        style={{
          width: '100%', height: 52, borderRadius: 10,
          border: `1.5px solid ${pitchHolding ? C.warning : 'rgba(234,179,8,0.35)'}`,
          background: pitchHolding ? 'rgba(234,179,8,0.12)' : 'rgba(0,0,0,0.3)',
          color: C.warning, fontWeight: 600, fontSize: 12,
          letterSpacing: 1, textTransform: 'uppercase',
          cursor: 'pointer', transition: 'all 0.15s',
          userSelect: 'none',
        }}
        onMouseDown={startPitchHold}
        onMouseUp={stopPitchHold}
        onMouseLeave={stopPitchHold}
        onTouchStart={startPitchHold}
        onTouchEnd={stopPitchHold}
      >
        {pitchHolding ? 'Pitching forward…' : 'Hold to pitch forward'}
      </button>

      {/* ── Control matrix ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Yaw buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CircleBtn label="Yaw L" onClick={() => sendDirectPacket({ macro: 'yaw_left_90' })} />
          <CircleBtn label="Yaw R" onClick={() => sendDirectPacket({ macro: 'yaw_right_90' })} />
        </div>

        {/* D-pad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 52px)', gridTemplateRows: 'repeat(3, 52px)', gap: 3 }}>
          <span />
          <DpadBtn icon="▲" label="Forward" onClick={() => move('up')} />
          <span />
          <DpadBtn icon="◀" label="Left"    onClick={() => move('left')} />
          {/* Coordinate indicator */}
          <div style={{
            width: 52, height: 52, borderRadius: 10,
            border: `0.5px solid ${C.border}`,
            background: C.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: C.primary,
          }}>
            {position.col},{position.row}
          </div>
          <DpadBtn icon="▶" label="Right"   onClick={() => move('right')} />
          <span />
          <DpadBtn icon="▼" label="Back"    onClick={() => move('down')} />
          <span />
        </div>

        {/* Emergency kill */}
        <button
          onClick={fireEmergencyKill}
          aria-label="Emergency kill"
          style={{
            width: 72, height: 124,
            borderRadius: 14,
            border: `1.5px solid ${C.danger}`,
            background: 'rgba(248,113,113,0.10)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer', transition: 'all 0.15s',
            color: C.danger,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.20)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.10)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: 26 }}>🛡</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Kill</span>
        </button>
      </div>

      {/* ── Status bar ── */}
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        border: `0.5px solid ${C.border}`,
        borderRadius: 14,
        padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Drone</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
            {selectedDrone?.name || 'None'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Status</p>
          <p style={{
            fontSize: 13, fontWeight: 600, margin: 0,
            color: isArmed ? C.danger : selectedDrone?.status === 'Flying' ? C.primary : C.success,
          }}>
            {isArmed ? 'Armed' : selectedDrone?.status || 'Offline'}
          </p>
        </div>
      </div>

      {/* ── Emergency snackbar ── */}
      {snackVisible && (
        <div style={{
          position: 'absolute', bottom: 80, left: 14, right: 14,
          background: C.danger, borderRadius: 10,
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff',
          letterSpacing: 1.5, textTransform: 'uppercase',
          zIndex: 10,
          animation: 'fadeIn 0.15s ease',
        }}>
          Emergency kill sent
        </div>
      )}

      {/* ── Settings modal ── */}
      {showSettings && (
        <SettingsModal
          ip={targetIp}
          port={targetPort}
          onSave={saveNetworkSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange, activeColor, disabled = false, label }) => {
  const trackBg = checked ? `${activeColor}30` : 'rgba(255,255,255,0.06)'
  const thumbBg = checked ? activeColor : '#6b7280'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: disabled ? 0.4 : 1 }}>
      <div
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 999,
          background: trackBg,
          border: `0.5px solid ${checked ? activeColor + '60' : 'rgba(255,255,255,0.10)'}`,
          position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 3, left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: thumbBg,
          transition: 'all 0.2s',
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: checked ? activeColor : '#6b7280', letterSpacing: 0.5 }}>
        {label}
      </span>
    </div>
  )
}

export default DroneControl