// // // // // import { useEffect, useRef, useCallback, useState } from 'react';
// // // // // import { io } from 'socket.io-client';

// // // // // const SOCKET_URL =
// // // // //   import.meta.env.VITE_API_URL || 'http://192.168.0.101:8000';

// // // // // export function useAlertNotifications({ token, onNewAlert }) {
// // // // //   const socketRef = useRef(null);

// // // // //   const [isConnected, setIsConnected] = useState(false);
// // // // //   const [notifications, setNotifications] = useState([]);

// // // // //   useEffect(() => {
// // // // //     if (!token) return;

// // // // //     const socket = io(SOCKET_URL, {
// // // // //       auth: { token },

// // // // //       transports: ['websocket', 'polling'],

// // // // //       reconnection: true,
// // // // //       reconnectionAttempts: Infinity,
// // // // //       reconnectionDelay: 1000,
// // // // //       reconnectionDelayMax: 5000,
// // // // //     });

// // // // //     socketRef.current = socket;

// // // // //     socket.on('connect', () => {
// // // // //       console.log('🔌 Socket connected:', socket.id);
// // // // //       setIsConnected(true);
// // // // //     });

// // // // //     socket.on('disconnect', (reason) => {
// // // // //       console.log('❌ Socket disconnected:', reason);
// // // // //       setIsConnected(false);
// // // // //     });

// // // // //     socket.on('connection_established', (data) => {
// // // // //       console.log('✅ Server:', data.message);
// // // // //     });

// // // // //     socket.on('new_alert_notification', (payload) => {
// // // // //       console.log('🚨 New alert:', payload);

// // // // //       setNotifications((prev) => [payload, ...prev]);

// // // // //       if (onNewAlert) {
// // // // //         onNewAlert(payload);
// // // // //       }
// // // // //     });

// // // // //     socket.on('connect_error', (err) => {
// // // // //       console.error('Socket connection error:', err.message);
// // // // //     });

// // // // //     return () => {
// // // // //       socket.disconnect();
// // // // //       socketRef.current = null;
// // // // //     };
// // // // //   }, [token, onNewAlert]);

// // // // //   const clearNotifications = useCallback(() => {
// // // // //     setNotifications([]);
// // // // //   }, []);

// // // // //   return {
// // // // //     isConnected,
// // // // //     notifications,
// // // // //     clearNotifications,
// // // // //   };
// // // // // }

// // // // // src/hooks/useAlertNotifications.js
// // // // //
// // // // // Real-time alert notifications via native browser WebSocket.
// // // // //
// // // // // Why native WebSocket instead of socket.io:
// // // // //   The backend (app/core/websocket.py + api/v1/websocket.py) is a plain
// // // // //   FastAPI WebSocket endpoint — it does NOT speak the Socket.io protocol
// // // // //   (no handshake negotiation, no event namespaces, no rooms).
// // // // //   Using socket.io-client here would fail silently because the server
// // // // //   never responds to the Socket.io upgrade request.
// // // // //
// // // // // Connection URL pattern:
// // // // //   ws://host/api/v1/ws/alerts/{propertyId}?token=<jwt>
// // // // //
// // // // // Usage:
// // // // //   const { isConnected, notifications, clearNotifications } =
// // // // //     useAlertNotifications({ propertyId, token, onNewAlert });

// // // // import { useEffect, useRef, useCallback, useState } from 'react';

// // // // // ---------------------------------------------------------------------------
// // // // // Config
// // // // // ---------------------------------------------------------------------------

// // // // // Base WebSocket URL — converts http(s) → ws(s) automatically.
// // // // // Falls back to the env var or localhost.


// // // // const getWsBaseUrl = () => {
// // // //   const httpBase =
// // // //     import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // // //   // e.g. "http://192.168.1.10:8000" → "ws://192.168.1.10:8000"
// // // //   //      "https://api.example.com"  → "wss://api.example.com"
// // // //   return httpBase.replace(/^http/, 'ws');
// // // // };

// // // // // Helper to display native laptop OS notifications
// // // // const triggerDesktopNotification = (alertData) => {
// // // //   if ("Notification" in window && Notification.permission === "granted") {
    
// // // //     // Create a recognizable header using the alert category
// // // //     const title = alertData.alert_type 
// // // //       ? alertData.alert_type.replace(/_/g, ' ').toUpperCase() 
// // // //       : "🚨 SECUREWATCH ALERT";

// // // //     const options = {
// // // //       body: `Location: ${alertData.camera_name || 'Unknown Camera'}\nSeverity: ${(alertData.severity || 'high').toUpperCase()}`,
// // // //       icon: "/favicon.ico", // Path to your logo/icon asset
// // // //       silent: false,        // Leverages your laptop's default OS notification sound chime
// // // //       requireInteraction: true // Keeps the banner on screen until the owner clicks or clears it
// // // //     };

// // // //     const notification = new Notification(title, options);

// // // //     // If the owner clicks the notification window, instantly bring SecureWatch to focus
// // // //     notification.onclick = (e) => {
// // // //       e.preventDefault();
// // // //       window.focus();
// // // //     };
// // // //   }
// // // // };

// // // // // How long to wait before attempting a reconnect after a disconnect (ms).
// // // // const INITIAL_RECONNECT_DELAY_MS = 1_000;

// // // // // Maximum reconnect delay after repeated failures (ms) — caps exponential back-off.
// // // // const MAX_RECONNECT_DELAY_MS = 30_000;

// // // // // How often to send a ping to keep the connection alive (ms).
// // // // const HEARTBEAT_INTERVAL_MS = 25_000;

// // // // // ---------------------------------------------------------------------------
// // // // // Hook
// // // // // ---------------------------------------------------------------------------

// // // // /**
// // // //  * useAlertNotifications
// // // //  *
// // // //  * Maintains a persistent WebSocket connection to the backend alert stream
// // // //  * for a specific property.  Reconnects automatically on disconnect with
// // // //  * exponential back-off.  Sends periodic pings so the server doesn't close
// // // //  * idle connections.
// // // //  *
// // // //  * @param {object}   params
// // // //  * @param {number|string} params.propertyId  - Property to subscribe to.
// // // //  * @param {string}   params.token            - JWT token from login/signup.
// // // //  * @param {function} [params.onNewAlert]     - Called with the full alert
// // // //  *                                             payload whenever type === "new_alert".
// // // //  *
// // // //  * @returns {{ isConnected: boolean, notifications: object[], clearNotifications: function }}
// // // //  */
// // // // export function useAlertNotifications({ propertyId, token, onNewAlert }) {
// // // //   // ── Refs ──────────────────────────────────────────────────────────────────
// // // //   // We keep the WebSocket instance and timers in refs so they don't trigger
// // // //   // re-renders and are always current inside async callbacks.

// // // //   const wsRef              = useRef(null);   // active WebSocket instance
// // // //   const reconnectTimerRef  = useRef(null);   // setTimeout handle for reconnect
// // // //   const heartbeatTimerRef  = useRef(null);   // setInterval handle for ping
// // // //   const reconnectDelayRef  = useRef(INITIAL_RECONNECT_DELAY_MS);
// // // //   const isMountedRef       = useRef(true);   // set to false on unmount to stop reconnects
// // // //   const onNewAlertRef      = useRef(onNewAlert); // stable ref so effect doesn't re-run

// // // //   // Keep the callback ref up-to-date without re-running the effect.
// // // //   useEffect(() => {
// // // //     onNewAlertRef.current = onNewAlert;
// // // //   }, [onNewAlert]);

// // // //   // ── State ─────────────────────────────────────────────────────────────────
// // // //   const [isConnected,    setIsConnected]    = useState(false);
// // // //   const [notifications,  setNotifications]  = useState([]);

// // // //   // ── Heartbeat helpers ─────────────────────────────────────────────────────

// // // //   /** Clears any running heartbeat interval. */
// // // //   const stopHeartbeat = useCallback(() => {
// // // //     if (heartbeatTimerRef.current) {
// // // //       clearInterval(heartbeatTimerRef.current);
// // // //       heartbeatTimerRef.current = null;
// // // //     }
// // // //   }, []);
// // // //   // Inside src/hooks/useAlertNotifications.js

// // // // useEffect(() => {
// // // //   // Check if the browser supports desktop notifications
// // // //   if ("Notification" in window) {
// // // //     if (Notification.permission === "default") {
// // // //       Notification.requestPermission().then((permission) => {
// // // //         if (permission === "granted") {
// // // //           console.log("SecureWatch desktop notifications enabled! 🚨");
// // // //         }
// // // //       });
// // // //     }
// // // //   }
// // // // }, []);

// // // //   /**
// // // //    * Starts sending a ping every HEARTBEAT_INTERVAL_MS.
// // // //    * The backend responds with { type: "pong" } which we ignore;
// // // //    * the real purpose is to prevent proxy/load-balancer idle timeouts.
// // // //    */
// // // //   const startHeartbeat = useCallback((ws) => {
// // // //     stopHeartbeat();
// // // //     heartbeatTimerRef.current = setInterval(() => {
// // // //       // Only send if the socket is still in OPEN state (readyState === 1).
// // // //       if (ws.readyState === WebSocket.OPEN) {
// // // //         ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
// // // //       }
// // // //     }, HEARTBEAT_INTERVAL_MS);
// // // //   }, [stopHeartbeat]);

// // // //   // ── Connection helpers ────────────────────────────────────────────────────

// // // //   /** Cancels any pending reconnect timer. */
// // // //   const cancelReconnect = useCallback(() => {
// // // //     if (reconnectTimerRef.current) {
// // // //       clearTimeout(reconnectTimerRef.current);
// // // //       reconnectTimerRef.current = null;
// // // //     }
// // // //   }, []);

// // // //   /**
// // // //    * Schedules a reconnect attempt using exponential back-off.
// // // //    * Each failed attempt doubles the delay until MAX_RECONNECT_DELAY_MS.
// // // //    */
// // // //   const scheduleReconnect = useCallback((connectFn) => {
// // // //     cancelReconnect();
// // // //     const delay = reconnectDelayRef.current;
// // // //     console.log(`[WS] Reconnecting in ${delay}ms…`);
// // // //     reconnectTimerRef.current = setTimeout(() => {
// // // //       if (isMountedRef.current) connectFn();
// // // //     }, delay);
// // // //     // Double the delay for the next attempt, capped at the maximum.
// // // //     reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
// // // //   }, [cancelReconnect]);

// // // //   /** Closes the current WebSocket gracefully if it is open or connecting. */
// // // //   const closeSocket = useCallback(() => {
// // // //     stopHeartbeat();
// // // //     if (wsRef.current) {
// // // //       // Remove all handlers before closing so onclose doesn't trigger a reconnect.
// // // //       wsRef.current.onopen    = null;
// // // //       wsRef.current.onclose   = null;
// // // //       wsRef.current.onerror   = null;
// // // //       wsRef.current.onmessage = null;
// // // //       wsRef.current.close();
// // // //       wsRef.current = null;
// // // //     }
// // // //   }, [stopHeartbeat]);

// // // //   // ── Main connect function ─────────────────────────────────────────────────

// // // //   /**
// // // //    * Opens a new WebSocket connection to the backend alert stream.
// // // //    * This function is declared inside the effect so it can reference
// // // //    * itself for reconnect scheduling.
// // // //    */
// // // //   const connect = useCallback(() => {
// // // //     // Guard: don't attempt if unmounted or missing required params.
// // // //     if (!isMountedRef.current || !propertyId || !token) return;

// // // //     // Build the connection URL.
// // // //     // The backend validates the JWT token from the query parameter.
// // // //     const url = `${getWsBaseUrl()}/api/v1/ws/alerts/${propertyId}?token=${token}`;
// // // //     console.log(`[WS] Connecting to ${url}`);

// // // //     const ws = new WebSocket(url);
// // // //     wsRef.current = ws;

// // // //     // ── onopen ──────────────────────────────────────────────────────────────
// // // //     // Called when the connection is established.
// // // //     ws.onopen = () => {
// // // //       if (!isMountedRef.current) return;
// // // //       console.log('[WS] Connected ✅');
// // // //       setIsConnected(true);
// // // //       // Reset back-off on successful connection.
// // // //       reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS;
// // // //       // Start sending periodic pings.
// // // //       startHeartbeat(ws);
// // // //     };

// // // //     // ── onmessage ───────────────────────────────────────────────────────────
// // // //     // Called for every message the server pushes.
// // // //     ws.onmessage = (event) => {
// // // //       if (!isMountedRef.current) return;

// // // //       let payload;
// // // //       try {
// // // //         payload = JSON.parse(event.data);
// // // //       } catch (err) {
// // // //         console.warn('[WS] Received non-JSON message:', event.data);
// // // //         return;
// // // //       }

// // // //       const msgType = payload?.type;

// // // //       if (msgType === 'connection_established') {
// // // //         // Server confirmation that we are subscribed to this property's alerts.
// // // //         console.log('[WS] Subscribed to property', payload.property_id);
// // // //         return;
// // // //       }

// // // //       if (msgType === 'pong') {
// // // //         // Heartbeat response — nothing to do.
// // // //         return;
// // // //       }

// // // //       if (msgType === 'new_alert') {
// // // //         // ── New alert received ─────────────────────────────────────────────
// // // //         // Shape from backend (AlertService._build_payload):
// // // //         // {
// // // //         //   type, alert_number, alert_type, camera_type, camera_name,
// // // //         //   camera_id, cell_row, cell_col, severity, confidence,
// // // //         //   timestamp, image_url, clip_url, status, is_read, message,
// // // //         //   camera_display, tracking_id, property_id, ...
// // // //         // }
// // // //         console.log('[WS] 🚨 New alert:', payload);

// // // //         // Prepend to the notifications list so newest is first.
// // // //         setNotifications((prev) => [payload, ...prev]);

// // // //         // Call the consumer-supplied callback (e.g. to show a toast).
// // // //         if (typeof onNewAlertRef.current === 'function') {
// // // //           onNewAlertRef.current(payload);
// // // //         }
// // // //         return;
// // // //       }

// // // //       if (msgType === 'alert_updated') {
// // // //         // Backend sent an update (e.g. media URLs filled in after saving).
// // // //         console.log('[WS] Alert updated:', payload.alert_number);
// // // //         // Optionally update the notification in state if you stored alert_number.
// // // //         setNotifications((prev) =>
// // // //           prev.map((n) =>
// // // //             n.alert_number === payload.alert_number
// // // //               ? { ...n, image_url: payload.image_url, clip_url: payload.clip_url }
// // // //               : n
// // // //           )
// // // //         );
// // // //         return;
// // // //       }

// // // //       // Unknown message type — log and ignore.
// // // //       console.debug('[WS] Unknown message type:', msgType, payload);
// // // //     };

// // // //     // ── onclose ─────────────────────────────────────────────────────────────
// // // //     // Called when the connection drops for any reason.
// // // //     ws.onclose = (event) => {
// // // //       if (!isMountedRef.current) return;
// // // //       console.warn(`[WS] Disconnected — code: ${event.code}, reason: "${event.reason}"`);
// // // //       setIsConnected(false);
// // // //       stopHeartbeat();

// // // //       // Code 4004 = server explicitly rejected us (property not found / no access).
// // // //       // Code 1008 = policy violation (bad token).
// // // //       // Don't retry these — retrying won't help.
// // // //       const fatalCodes = [4004, 1008, 4001];
// // // //       if (fatalCodes.includes(event.code)) {
// // // //         console.error('[WS] Fatal close — not reconnecting:', event.code);
// // // //         return;
// // // //       }

// // // //       // For all other closes (network blip, server restart, etc.) — retry.
// // // //       scheduleReconnect(connect);
// // // //     };

// // // //     // ── onerror ─────────────────────────────────────────────────────────────
// // // //     // Called when the WebSocket encounters a network-level error.
// // // //     // onclose always fires after onerror, so we don't reconnect here
// // // //     // to avoid double-scheduling.
// // // //     ws.onerror = (error) => {
// // // //       console.error('[WS] Error:', error);
// // // //       // onclose will handle the reconnect.
// // // //     };
// // // //   }, [propertyId, token, startHeartbeat, stopHeartbeat, scheduleReconnect]);

// // // //   // ── Effect: open on mount / propertyId+token change ──────────────────────
// // // //   useEffect(() => {
// // // //     isMountedRef.current = true;

// // // //     // Only connect if we have both required values.
// // // //     if (propertyId && token) {
// // // //       connect();
// // // //     }

// // // //     // Cleanup: close the socket and cancel all timers on unmount.
// // // //     return () => {
// // // //       isMountedRef.current = false;
// // // //       cancelReconnect();
// // // //       closeSocket();
// // // //     };
// // // //   }, [propertyId, token, connect, cancelReconnect, closeSocket]);

// // // //   // ── Public API ────────────────────────────────────────────────────────────

// // // //   /** Clears the in-memory notifications list (does not affect the DB). */
// // // //   const clearNotifications = useCallback(() => {
// // // //     setNotifications([]);
// // // //   }, []);

// // // //   /**
// // // //    * Manually send an acknowledgement to the server that an alert was seen.
// // // //    * This is optional — the server logs it but takes no action currently.
// // // //    */
// // // //   const acknowledgeAlert = useCallback((alertId) => {
// // // //     if (wsRef.current?.readyState === WebSocket.OPEN) {
// // // //       wsRef.current.send(
// // // //         JSON.stringify({ type: 'ack_alert', alert_id: alertId })
// // // //       );
// // // //     }
// // // //   }, []);

// // // //   return {
// // // //     isConnected,
// // // //     notifications,
// // // //     clearNotifications,
// // // //     acknowledgeAlert,
// // // //   };
// // // // }

// // // import { useEffect, useRef, useCallback, useState } from 'react';

// // // // ---------------------------------------------------------------------------
// // // // Config & Helpers
// // // // ---------------------------------------------------------------------------

// // // // Base WebSocket URL — converts http(s) → ws(s) automatically.
// // // // Falls back to the env var or localhost.
// // // const getWsBaseUrl = () => {
// // //   const httpBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// // //   // e.g. "http://192.168.1.10:8000" → "ws://192.168.1.10:8000"
// // //   //      "https://api.example.com"  → "wss://api.example.com"
// // //   return httpBase.replace(/^http/, 'ws');
// // // };

// // // /**
// // //  * Native Desktop Window/System Notification Trigger
// // //  * Converts the real-time websocket metadata structure into laptop system toasts.
// // //  */
// // // const triggerDesktopNotification = (alertData) => {
// // //   if ("Notification" in window && Notification.permission === "granted") {
    
// // //     // Create a clean readable header text by styling the alert context
// // //     const title = alertData.alert_type 
// // //       ? alertData.alert_type.replace(/_/g, ' ').toUpperCase() 
// // //       : "🚨 SECUREWATCH THREAT INTRUSION";

// // //     const options = {
// // //       body: `Camera: ${alertData.camera_name || 'Unknown Zone'}\nSeverity: ${(alertData.severity || 'high').toUpperCase()}${alertData.message ? `\nInfo: ${alertData.message}` : ''}`,
// // //       icon: "/favicon.ico",       // Path to your SecureWatch interface logo/asset
// // //       silent: false,              // Leverages the laptop operating system's default hardware chime
// // //       requireInteraction: true     // Keeps the overlay up until the owner explicitly interacts with it
// // //     };

// // //     const notification = new Notification(title, options);

// // //     // If the owner clicks on the floating OS notification card, refocus the application window
// // //     notification.onclick = (e) => {
// // //       e.preventDefault();
// // //       window.focus();
// // //     };
// // //   }
// // // };

// // // // How long to wait before attempting a reconnect after a disconnect (ms).
// // // const INITIAL_RECONNECT_DELAY_MS = 1_000;

// // // // Maximum reconnect delay after repeated failures (ms) — caps exponential back-off.
// // // const MAX_RECONNECT_DELAY_MS = 30_000;

// // // // How often to send a ping to keep the connection alive (ms).
// // // const HEARTBEAT_INTERVAL_MS = 25_000;

// // // // ---------------------------------------------------------------------------
// // // // Hook
// // // // ---------------------------------------------------------------------------

// // // /**
// // //  * useAlertNotifications
// // //  *
// // //  * Maintains a persistent WebSocket connection to the backend alert stream
// // //  * for a specific property. Reconnects automatically on disconnect with
// // //  * exponential back-off. Sends periodic pings so the server doesn't close
// // //  * idle connections.
// // //  *
// // //  * @param {object}   params
// // //  * @param {number|string} params.propertyId  - Property to subscribe to.
// // //  * @param {string}   params.token            - JWT token from login/signup.
// // //  * @param {function} [params.onNewAlert]     - Called with the full alert
// // //  * payload whenever type === "new_alert".
// // //  *
// // //  * @returns {{ isConnected: boolean, notifications: object[], clearNotifications: function }}
// // //  */
// // // export function useAlertNotifications({ propertyId, token, onNewAlert }) {
// // //   // ── Refs ──────────────────────────────────────────────────────────────────
// // //   const wsRef              = useRef(null);   // active WebSocket instance
// // //   const reconnectTimerRef  = useRef(null);   // setTimeout handle for reconnect
// // //   const heartbeatTimerRef  = useRef(null);   // setInterval handle for ping
// // //   const reconnectDelayRef  = useRef(INITIAL_RECONNECT_DELAY_MS);
// // //   const isMountedRef       = useRef(true);   // set to false on unmount to stop reconnects
// // //   const onNewAlertRef      = useRef(onNewAlert); // stable ref so effect doesn't re-run

// // //   // Keep the callback ref up-to-date without re-running the main core connection loops.
// // //   useEffect(() => {
// // //     onNewAlertRef.current = onNewAlert;
// // //   }, [onNewAlert]);

// // //   // ── State ─────────────────────────────────────────────────────────────────
// // //   const [isConnected,    setIsConnected]    = useState(false);
// // //   const [notifications,  setNotifications]  = useState([]);

// // //   // ── Notification Permissions Setup ────────────────────────────────────────
// // //   useEffect(() => {
// // //     // Implicitly prompt the owner for browser system level permissions when dashboard initializes
// // //     if ("Notification" in window) {
// // //       if (Notification.permission === "default") {
// // //         Notification.requestPermission().then((permission) => {
// // //           if (permission === "granted") {
// // //             console.log("[Notifications] SecureWatch desktop system alerts granted! ✅");
// // //           }
// // //         });
// // //       }
// // //     }
// // //   }, []);

// // //   // ── Heartbeat helpers ─────────────────────────────────────────────────────

// // //   /** Clears any running heartbeat interval. */
// // //   const stopHeartbeat = useCallback(() => {
// // //     if (heartbeatTimerRef.current) {
// // //       clearInterval(heartbeatTimerRef.current);
// // //       heartbeatTimerRef.current = null;
// // //     }
// // //   }, []);

// // //   /**
// // //    * Starts sending a ping every HEARTBEAT_INTERVAL_MS.
// // //    */
// // //   const startHeartbeat = useCallback((ws) => {
// // //     stopHeartbeat();
// // //     heartbeatTimerRef.current = setInterval(() => {
// // //       if (ws.readyState === WebSocket.OPEN) {
// // //         ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
// // //       }
// // //     }, HEARTBEAT_INTERVAL_MS);
// // //   }, [stopHeartbeat]);

// // //   // ── Connection helpers ────────────────────────────────────────────────────

// // //   /** Cancels any pending reconnect timer. */
// // //   const cancelReconnect = useCallback(() => {
// // //     if (reconnectTimerRef.current) {
// // //       clearTimeout(reconnectTimerRef.current);
// // //       reconnectTimerRef.current = null;
// // //     }
// // //   }, []);

// // //   /**
// // //    * Schedules a reconnect attempt using exponential back-off.
// // //    */
// // //   const scheduleReconnect = useCallback((connectFn) => {
// // //     cancelReconnect();
// // //     const delay = reconnectDelayRef.current;
// // //     console.log(`[WS] Reconnecting in ${delay}ms…`);
// // //     reconnectTimerRef.current = setTimeout(() => {
// // //       if (isMountedRef.current) connectFn();
// // //     }, delay);
// // //     reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
// // //   }, [cancelReconnect]);

// // //   /** Closes the current WebSocket gracefully if it is open or connecting. */
// // //   const closeSocket = useCallback(() => {
// // //     stopHeartbeat();
// // //     if (wsRef.current) {
// // //       wsRef.current.onopen    = null;
// // //       wsRef.current.onclose   = null;
// // //       wsRef.current.onerror   = null;
// // //       wsRef.current.onmessage = null;
// // //       wsRef.current.close();
// // //       wsRef.current = null;
// // //     }
// // //   }, [stopHeartbeat]);

// // //   // ── Main connect function ─────────────────────────────────────────────────

// // //   const connect = useCallback(() => {
// // //     if (!isMountedRef.current || !propertyId || !token) return;

// // //     const url = `${getWsBaseUrl()}/api/v1/ws/alerts/${propertyId}?token=${token}`;
// // //     console.log(`[WS] Connecting to ${url}`);

// // //     const ws = new WebSocket(url);
// // //     wsRef.current = ws;

// // //     // ── onopen ──────────────────────────────────────────────────────────────
// // //     ws.onopen = () => {
// // //       if (!isMountedRef.current) return;
// // //       console.log('[WS] Connected ✅');
// // //       setIsConnected(true);
// // //       reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS;
// // //       startHeartbeat(ws);
// // //     };

// // //     // ── onmessage ───────────────────────────────────────────────────────────
// // //     ws.onmessage = (event) => {
// // //       if (!isMountedRef.current) return;

// // //       let payload;
// // //       try {
// // //         payload = JSON.parse(event.data);
// // //       } catch (err) {
// // //         console.warn('[WS] Received non-JSON message:', event.data);
// // //         return;
// // //       }

// // //       const msgType = payload?.type;

// // //       if (msgType === 'connection_established') {
// // //         console.log('[WS] Subscribed to property', payload.property_id);
// // //         return;
// // //       }

// // //       if (msgType === 'pong') {
// // //         return;
// // //       }

// // //       if (msgType === 'new_alert') {
// // //         console.log('[WS] 🚨 New alert incoming:', payload);

// // //         // Prepend to the notifications list array
// // //         setNotifications((prev) => [payload, ...prev]);

// // //         // ── OS Pop-up Notification Engine ──
// // //         // Only wake up the laptop overlay banner if the owner is away or on another tab
// // //         if (document.hidden) {
// // //           triggerDesktopNotification(payload);
// // //         }

// // //         // Call user context setup hooks inside components
// // //         if (typeof onNewAlertRef.current === 'function') {
// // //           onNewAlertRef.current(payload);
// // //         }
// // //         return;
// // //       }

// // //       if (msgType === 'alert_updated') {
// // //         console.log('[WS] Alert updated:', payload.alert_number);
// // //         setNotifications((prev) =>
// // //           prev.map((n) =>
// // //             n.alert_number === payload.alert_number
// // //               ? { ...n, image_url: payload.image_url, clip_url: payload.clip_url }
// // //               : n
// // //           )
// // //         );
// // //         return;
// // //       }

// // //       console.debug('[WS] Unknown message type:', msgType, payload);
// // //     };

// // //     // ── onclose ─────────────────────────────────────────────────────────────
// // //     ws.onclose = (event) => {
// // //       if (!isMountedRef.current) return;
// // //       console.warn(`[WS] Disconnected — code: ${event.code}, reason: "${event.reason}"`);
// // //       setIsConnected(false);
// // //       stopHeartbeat();

// // //       const fatalCodes = [4004, 1008, 4001];
// // //       if (fatalCodes.includes(event.code)) {
// // //         console.error('[WS] Fatal close — not reconnecting:', event.code);
// // //         return;
// // //       }

// // //       scheduleReconnect(connect);
// // //     };

// // //     // ── onerror ─────────────────────────────────────────────────────────────
// // //     ws.onerror = (error) => {
// // //       console.error('[WS] Error:', error);
// // //     };
// // //   }, [propertyId, token, startHeartbeat, stopHeartbeat, scheduleReconnect]);

// // //   // ── Effect: open on mount / propertyId+token change ──────────────────────
// // //   useEffect(() => {
// // //     isMountedRef.current = true;

// // //     if (propertyId && token) {
// // //       connect();
// // //     }

// // //     return () => {
// // //       isMountedRef.current = false;
// // //       cancelReconnect();
// // //       closeSocket();
// // //     };
// // //   }, [propertyId, token, connect, cancelReconnect, closeSocket]);

// // //   // ── Public API ────────────────────────────────────────────────────────────

// // //   const clearNotifications = useCallback(() => {
// // //     setNotifications([]);
// // //   }, []);

// // //   const acknowledgeAlert = useCallback((alertId) => {
// // //     if (wsRef.current?.readyState === WebSocket.OPEN) {
// // //       wsRef.current.send(
// // //         JSON.stringify({ type: 'ack_alert', alert_id: alertId })
// // //       );
// // //     }
// // //   }, []);

// // //   return {
// // //     isConnected,
// // //     notifications,
// // //     clearNotifications,
// // //     acknowledgeAlert,
// // //   };
// // // }

// // // src/hooks/useAlertNotifications.js

// // import { useEffect, useRef, useCallback, useState } from 'react';

// // // ---------------------------------------------------------------------------
// // // Config & Helpers
// // // ---------------------------------------------------------------------------

// // /**
// //  * Converts HTTP API URL → WS URL automatically
// //  *
// //  * Example:
// //  *   http://localhost:8000   -> ws://localhost:8000
// //  *   https://api.domain.com  -> wss://api.domain.com
// //  */
// // const getWsBaseUrl = () => {
// //   const httpBase =
// //     import.meta.env.VITE_API_URL || 'http://localhost:8000';

// //   return httpBase.replace(/^http/, 'ws');
// // };

// // /**
// //  * Native Desktop Notification
// //  */
// // const triggerDesktopNotification = (alertData) => {
// //   if (!('Notification' in window)) return;

// //   if (Notification.permission !== 'granted') return;

// //   const title = alertData.alert_type
// //     ? alertData.alert_type.replace(/_/g, ' ').toUpperCase()
// //     : '🚨 SECUREWATCH ALERT';

// //   const options = {
// //     body:
// //       `Camera: ${alertData.camera_name || 'Unknown'}\n` +
// //       `Severity: ${(alertData.severity || 'high').toUpperCase()}\n` +
// //       `${alertData.message || ''}`,

// //     icon: '/favicon.ico',

// //     silent: false,

// //     requireInteraction: true,
// //   };

// //   const notification = new Notification(title, options);

// //   notification.onclick = () => {
// //     window.focus();
// //     notification.close();
// //   };
// // };

// // // ---------------------------------------------------------------------------
// // // Constants
// // // ---------------------------------------------------------------------------

// // const INITIAL_RECONNECT_DELAY_MS = 1000;

// // const MAX_RECONNECT_DELAY_MS = 30000;

// // const HEARTBEAT_INTERVAL_MS = 25000;

// // // ---------------------------------------------------------------------------
// // // Hook
// // // ---------------------------------------------------------------------------

// // export function useAlertNotifications({
// //   propertyId,
// //   token,
// //   onNewAlert,
// // }) {
// //   // -------------------------------------------------------------------------
// //   // Refs
// //   // -------------------------------------------------------------------------

// //   const wsRef = useRef(null);

// //   const reconnectTimerRef = useRef(null);

// //   const heartbeatTimerRef = useRef(null);

// //   const reconnectDelayRef = useRef(
// //     INITIAL_RECONNECT_DELAY_MS
// //   );

// //   const isMountedRef = useRef(true);

// //   const onNewAlertRef = useRef(onNewAlert);

// //   // -------------------------------------------------------------------------
// //   // State
// //   // -------------------------------------------------------------------------

// //   const [isConnected, setIsConnected] =
// //     useState(false);

// //   const [notifications, setNotifications] =
// //     useState([]);

// //   // -------------------------------------------------------------------------
// //   // Keep callback fresh
// //   // -------------------------------------------------------------------------

// //   useEffect(() => {
// //     onNewAlertRef.current = onNewAlert;
// //   }, [onNewAlert]);

// //   // -------------------------------------------------------------------------
// //   // Request notification permission
// //   // -------------------------------------------------------------------------

// //   useEffect(() => {
// //     if (!('Notification' in window)) return;

// //     if (Notification.permission === 'default') {
// //       Notification.requestPermission().then(
// //         (permission) => {
// //           console.log(
// //             '[Notifications] Permission:',
// //             permission
// //           );
// //         }
// //       );
// //     }
// //   }, []);

// //   // -------------------------------------------------------------------------
// //   // Heartbeat
// //   // -------------------------------------------------------------------------

// //   const stopHeartbeat = useCallback(() => {
// //     if (heartbeatTimerRef.current) {
// //       clearInterval(heartbeatTimerRef.current);
// //       heartbeatTimerRef.current = null;
// //     }
// //   }, []);

// //   const startHeartbeat = useCallback(
// //     (ws) => {
// //       stopHeartbeat();

// //       heartbeatTimerRef.current = setInterval(() => {
// //         if (ws.readyState === WebSocket.OPEN) {
// //           ws.send(
// //             JSON.stringify({
// //               type: 'ping',
// //               timestamp: Date.now(),
// //             })
// //           );
// //         }
// //       }, HEARTBEAT_INTERVAL_MS);
// //     },
// //     [stopHeartbeat]
// //   );

// //   // -------------------------------------------------------------------------
// //   // Reconnect
// //   // -------------------------------------------------------------------------

// //   const cancelReconnect = useCallback(() => {
// //     if (reconnectTimerRef.current) {
// //       clearTimeout(reconnectTimerRef.current);
// //       reconnectTimerRef.current = null;
// //     }
// //   }, []);

// //   const scheduleReconnect = useCallback(
// //     (connectFn) => {
// //       cancelReconnect();

// //       const delay = reconnectDelayRef.current;

// //       console.warn(
// //         `[WS] Reconnecting in ${delay}ms`
// //       );

// //       reconnectTimerRef.current = setTimeout(() => {
// //         if (isMountedRef.current) {
// //           connectFn();
// //         }
// //       }, delay);

// //       reconnectDelayRef.current = Math.min(
// //         delay * 2,
// //         MAX_RECONNECT_DELAY_MS
// //       );
// //     },
// //     [cancelReconnect]
// //   );

// //   // -------------------------------------------------------------------------
// //   // Close socket
// //   // -------------------------------------------------------------------------

// //   const closeSocket = useCallback(() => {
// //     stopHeartbeat();

// //     if (wsRef.current) {
// //       wsRef.current.onopen = null;
// //       wsRef.current.onclose = null;
// //       wsRef.current.onerror = null;
// //       wsRef.current.onmessage = null;

// //       wsRef.current.close();

// //       wsRef.current = null;
// //     }
// //   }, [stopHeartbeat]);

// //   // -------------------------------------------------------------------------
// //   // Connect
// //   // -------------------------------------------------------------------------

// //   const connect = useCallback(() => {
// //     if (!propertyId || !token) return;

// //     if (!isMountedRef.current) return;

// //     try {
// //       // IMPORTANT
// //       const encodedToken = encodeURIComponent(token);

// //       const url =
// //         `${getWsBaseUrl()}` +
// //         `/api/v1/ws/alerts/${propertyId}` +
// //         `?token=${encodedToken}`;

// //       console.log('[WS] Connecting:', url);

// //       const ws = new WebSocket(url);

// //       wsRef.current = ws;

// //       // -------------------------------------------------------------------
// //       // OPEN
// //       // -------------------------------------------------------------------

// //       ws.onopen = () => {
// //         if (!isMountedRef.current) return;

// //         console.log('[WS] Connected ✅');

// //         setIsConnected(true);

// //         reconnectDelayRef.current =
// //           INITIAL_RECONNECT_DELAY_MS;

// //         startHeartbeat(ws);
// //       };

// //       // -------------------------------------------------------------------
// //       // MESSAGE
// //       // -------------------------------------------------------------------

// //       ws.onmessage = (event) => {
// //         if (!isMountedRef.current) return;

// //         let payload;

// //         try {
// //           payload = JSON.parse(event.data);
// //         } catch (error) {
// //           console.warn(
// //             '[WS] Invalid JSON:',
// //             event.data
// //           );
// //           return;
// //         }

// //         console.log('[WS MESSAGE]', payload);

// //         const msgType = payload?.type;

// //         // ---------------------------------------------------------------
// //         // Connection established
// //         // ---------------------------------------------------------------

// //         if (msgType === 'connection_established') {
// //           console.log(
// //             `[WS] Subscribed to property ${payload.property_id}`
// //           );

// //           return;
// //         }

// //         // ---------------------------------------------------------------
// //         // Pong
// //         // ---------------------------------------------------------------

// //         if (msgType === 'pong') {
// //           console.log('[WS] Pong received');

// //           return;
// //         }

// //         // ---------------------------------------------------------------
// //         // New alert
// //         // ---------------------------------------------------------------

// //         if (msgType === 'new_alert') {
// //           console.log(
// //             '[WS] 🚨 New Alert:',
// //             payload
// //           );

// //           setNotifications((prev) => [
// //             payload,
// //             ...prev,
// //           ]);

// //           // Desktop notification
// //           if (document.hidden) {
// //             triggerDesktopNotification(payload);
// //           }

// //           // External callback
// //           if (
// //             typeof onNewAlertRef.current ===
// //             'function'
// //           ) {
// //             onNewAlertRef.current(payload);
// //           }

// //           return;
// //         }

// //         // ---------------------------------------------------------------
// //         // Alert updated
// //         // ---------------------------------------------------------------

// //         if (msgType === 'alert_updated') {
// //           console.log(
// //             '[WS] Alert updated:',
// //             payload.alert_number
// //           );

// //           setNotifications((prev) =>
// //             prev.map((item) =>
// //               item.alert_number ===
// //               payload.alert_number
// //                 ? {
// //                     ...item,
// //                     image_url:
// //                       payload.image_url,
// //                     clip_url:
// //                       payload.clip_url,
// //                   }
// //                 : item
// //             )
// //           );

// //           return;
// //         }

// //         // ---------------------------------------------------------------
// //         // Error
// //         // ---------------------------------------------------------------

// //         if (msgType === 'error') {
// //           console.error(
// //             '[WS SERVER ERROR]',
// //             payload.message
// //           );

// //           return;
// //         }

// //         console.warn(
// //           '[WS] Unknown message:',
// //           payload
// //         );
// //       };

// //       // -------------------------------------------------------------------
// //       // CLOSE
// //       // -------------------------------------------------------------------

// //       ws.onclose = (event) => {
// //         if (!isMountedRef.current) return;

// //         console.warn(
// //           `[WS] Closed | Code: ${event.code} | Reason: ${event.reason}`
// //         );

// //         setIsConnected(false);

// //         stopHeartbeat();

// //         // Fatal codes
// //         const fatalCodes = [4001, 4004, 1008];

// //         if (fatalCodes.includes(event.code)) {
// //           console.error(
// //             '[WS] Fatal close — reconnect cancelled'
// //           );

// //           return;
// //         }

// //         scheduleReconnect(connect);
// //       };

// //       // -------------------------------------------------------------------
// //       // ERROR
// //       // -------------------------------------------------------------------

// //       ws.onerror = (error) => {
// //         console.error(
// //           '[WS ERROR]',
// //           error
// //         );

// //         console.log(
// //           '[WS READY STATE]',
// //           ws.readyState
// //         );

// //         /*
// //           0 = CONNECTING
// //           1 = OPEN
// //           2 = CLOSING
// //           3 = CLOSED
// //         */
// //       };
// //     } catch (error) {
// //       console.error(
// //         '[WS] Connection failed:',
// //         error
// //       );
// //     }
// //   }, [
// //     propertyId,
// //     token,
// //     startHeartbeat,
// //     stopHeartbeat,
// //     scheduleReconnect,
// //   ]);

// //   // -------------------------------------------------------------------------
// //   // Lifecycle
// //   // -------------------------------------------------------------------------

// //   useEffect(() => {
// //     isMountedRef.current = true;

// //     if (propertyId && token) {
// //       connect();
// //     }

// //     return () => {
// //       isMountedRef.current = false;

// //       cancelReconnect();

// //       closeSocket();
// //     };
// //   }, [
// //     propertyId,
// //     token,
// //     connect,
// //     cancelReconnect,
// //     closeSocket,
// //   ]);

// //   // -------------------------------------------------------------------------
// //   // Public API
// //   // -------------------------------------------------------------------------

// //   const clearNotifications = useCallback(() => {
// //     setNotifications([]);
// //   }, []);

// //   const acknowledgeAlert = useCallback(
// //     (alertId) => {
// //       if (
// //         wsRef.current &&
// //         wsRef.current.readyState ===
// //           WebSocket.OPEN
// //       ) {
// //         wsRef.current.send(
// //           JSON.stringify({
// //             type: 'ack_alert',
// //             alert_id: alertId,
// //           })
// //         );
// //       }
// //     },
// //     []
// //   );

// //   return {
// //     isConnected,

// //     notifications,

// //     clearNotifications,

// //     acknowledgeAlert,
// //   };
// // }

// // src/hooks/useAlertNotifications.js
// import { useEffect, useRef, useCallback, useState } from 'react';
// import { toast } from 'react-toastify';

// const getWsBaseUrl = () => {
//   const httpBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//   return httpBase.replace(/^http/, 'ws');
// };

// const INITIAL_RECONNECT_DELAY_MS = 1000;
// const MAX_RECONNECT_DELAY_MS = 30000;
// const HEARTBEAT_INTERVAL_MS = 25000;

// export function useAlertNotifications({ propertyId, token, onNewAlert }) {
//   const wsRef = useRef(null);
//   const reconnectTimerRef = useRef(null);
//   const heartbeatTimerRef = useRef(null);
//   const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY_MS);
//   const isMountedRef = useRef(true);
//   const onNewAlertRef = useRef(onNewAlert);

//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => { onNewAlertRef.current = onNewAlert; }, [onNewAlert]);

//   const stopHeartbeat = useCallback(() => {
//     if (heartbeatTimerRef.current) {
//       clearInterval(heartbeatTimerRef.current);
//       heartbeatTimerRef.current = null;
//     }
//   }, []);

//   const closeSocket = useCallback(() => {
//     stopHeartbeat();
//     if (wsRef.current) {
//       wsRef.current.onopen = null;
//       wsRef.current.onclose = null;
//       wsRef.current.onerror = null;
//       wsRef.current.onmessage = null;
//       wsRef.current.close();
//       wsRef.current = null;
//     }
//   }, [stopHeartbeat]);

//   const connect = useCallback(() => {
//     if (!propertyId || !token || !isMountedRef.current) return;

//     const url = `${getWsBaseUrl()}/api/v1/ws/alerts/${propertyId}?token=${encodeURIComponent(token)}`;
//     console.log('[WS] Connecting:', url);

//     const ws = new WebSocket(url);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       if (!isMountedRef.current) return;
//       console.log('[WS] Connected ✅');
//       setIsConnected(true);
//       reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS;
//       heartbeatTimerRef.current = setInterval(() => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
//         }
//       }, HEARTBEAT_INTERVAL_MS);
//     };
    
//    // ── Move triggerDesktopNotification OUTSIDE onmessage (it was defined
// //    inside onmessage before, so it was never actually called) ──────────

// const triggerDesktopNotification = (alertData) => {
//   if (!('Notification' in window)) return;
//   if (Notification.permission !== 'granted') return;

//   const title = `🚨 ${alertData.alert_type?.replace(/_/g, ' ').toUpperCase() || 'ALERT'}`;
//   const body =
//     `Camera: ${alertData.camera_name || 'Unknown'}\n` +
//     `Severity: ${(alertData.severity || 'high').toUpperCase()}\n` +
//     `${alertData.message || ''}`;

//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then((reg) => {
//       reg.showNotification(title, {
//         body,
//         icon: '/favicon.ico',
//         requireInteraction: true,   // stays until dismissed
//         vibrate: [200, 100, 200],
//       });
//     });
//   } else {
//     new Notification(title, {
//       body,
//       icon: '/favicon.ico',
//       requireInteraction: true,     // stays until dismissed
//     });
//   }
// };

// // ── Inside connect(), replace ws.onmessage ───────────────────────────────
// ws.onmessage = (event) => {
//   if (!isMountedRef.current) return;
//   let payload;
//   try { payload = JSON.parse(event.data); } catch { return; }

//   if (payload.type === 'new_alert') {
//     setNotifications((prev) => [payload, ...prev]);

//     // Toast stays until user explicitly closes it
//     toast.error(
//       `🚨 ${payload.message || 'New Alert'} — Camera: ${payload.camera_name}`,
//       {
//         autoClose: false,         // ← was 10000, now never auto-closes
//         closeOnClick: false,      // ← require deliberate X button click
//         draggable: false,
//         position: 'top-right',
//         toastId: `alert-${payload.alert_number}`,  // prevent duplicates
//       }
//     );

//     // Now actually called (was defined-but-never-called before)
//     triggerDesktopNotification(payload);

//     if (typeof onNewAlertRef.current === 'function') {
//       onNewAlertRef.current(payload);
//     }
//   }
// };
//     ws.onclose = (event) => {
//       if (!isMountedRef.current) return;
//       console.warn(`[WS] Closed | Code: ${event.code}`);
//       setIsConnected(false);
//       stopHeartbeat();
//       if ([4001, 4004, 1008].includes(event.code)) return;
//       const delay = reconnectDelayRef.current;
//       reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
//       reconnectTimerRef.current = setTimeout(() => {
//         if (isMountedRef.current) connect();
//       }, delay);
//     };

//     ws.onerror = (error) => console.error('[WS ERROR]', error);

//   }, [propertyId, token, stopHeartbeat]);

//   useEffect(() => {
//     isMountedRef.current = true;
//     if (propertyId && token) connect();
//     return () => {
//       isMountedRef.current = false;
//       if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
//       closeSocket();
//     };
//   }, [propertyId, token, connect, closeSocket]);

//   return {
//     isConnected,
//     notifications,
//     clearNotifications: useCallback(() => setNotifications([]), []),
//   };
// }

// src/hooks/useAlertNotifications.js
import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const getWsBaseUrl = () => {
  const httpBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return httpBase.replace(/^http/, 'ws');
};

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const HEARTBEAT_INTERVAL_MS = 25000;

export function useAlertNotifications({ propertyId, token, onNewAlert, onNotificationClick }) {
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const heartbeatTimerRef = useRef(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY_MS);
  const isMountedRef = useRef(true);
  const onNewAlertRef = useRef(onNewAlert);
  // Keep onNotificationClick stable in a ref so closures always use latest version
  const onNotificationClickRef = useRef(onNotificationClick);

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { onNewAlertRef.current = onNewAlert; }, [onNewAlert]);
  useEffect(() => { onNotificationClickRef.current = onNotificationClick; }, [onNotificationClick]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    stopHeartbeat();
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, [stopHeartbeat]);

  // ── Listen for Service Worker → client messages (desktop notification click) ──
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleSwMessage = (event) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        const { propertyId: pid, alertId } = event.data;
        if (typeof onNotificationClickRef.current === 'function') {
          onNotificationClickRef.current({ propertyId: pid, alertId });
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSwMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
  }, []);

  const connect = useCallback(() => {
    if (!propertyId || !token || !isMountedRef.current) return;

    const url = `${getWsBaseUrl()}/api/v1/ws/alerts/${propertyId}?token=${encodeURIComponent(token)}`;
    console.log('[WS] Connecting:', url);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMountedRef.current) return;
      console.log('[WS] Connected ✅');
      setIsConnected(true);
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS;
      heartbeatTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      }, HEARTBEAT_INTERVAL_MS);
    };

    const triggerDesktopNotification = (alertData) => {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      const title = `🚨 ${alertData.alert_type?.replace(/_/g, ' ').toUpperCase() || 'ALERT'}`;
      const body =
        `Camera: ${alertData.camera_name || 'Unknown'}\n` +
        `Severity: ${(alertData.severity || 'high').toUpperCase()}\n` +
        `${alertData.message || ''}`;

      // Data payload is sent back via SW message on notification click
      const notificationData = {
        propertyId: alertData.property_id ?? propertyId,
        alertId: alertData.alert_number ?? alertData.id,
      };

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/favicon.ico',
            requireInteraction: true,
            vibrate: [200, 100, 200],
            data: notificationData,   // ← SW reads this on click
          });
        });
      } else {
        // Fallback: plain Notification API
        const n = new Notification(title, {
          body,
          icon: '/favicon.ico',
          requireInteraction: true,
        });
        n.onclick = () => {
          window.focus();
          if (typeof onNotificationClickRef.current === 'function') {
            onNotificationClickRef.current(notificationData);
          }
          n.close();
        };
      }
    };

    ws.onmessage = (event) => {
      if (!isMountedRef.current) return;
      let payload;
      try { payload = JSON.parse(event.data); } catch { return; }

      if (payload.type === 'new_alert') {
        setNotifications((prev) => [payload, ...prev]);

        const alertPath = `/property/${payload.property_id ?? propertyId}/alert/${payload.alert_number ?? payload.id}`;

        // Toast — stays until user closes; clicking navigates to alert detail
        toast.error(
          `🚨 ${payload.message || 'New Alert'} — Camera: ${payload.camera_name}`,
          {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            position: 'top-right',
            toastId: `alert-${payload.alert_number}`,
            // Clicking anywhere on the toast body navigates to the alert
            onClick: () => {
              if (typeof onNotificationClickRef.current === 'function') {
                onNotificationClickRef.current({
                  propertyId: payload.property_id ?? propertyId,
                  alertId: payload.alert_number ?? payload.id,
                });
              }
            },
            style: { cursor: 'pointer' },
          }
        );

        triggerDesktopNotification(payload);

        if (typeof onNewAlertRef.current === 'function') {
          onNewAlertRef.current(payload);
        }
      }
    };

    ws.onclose = (event) => {
      if (!isMountedRef.current) return;
      console.warn(`[WS] Closed | Code: ${event.code}`);
      setIsConnected(false);
      stopHeartbeat();
      if ([4001, 4004, 1008].includes(event.code)) return;
      const delay = reconnectDelayRef.current;
      reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_DELAY_MS);
      reconnectTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) connect();
      }, delay);
    };

    ws.onerror = (error) => console.error('[WS ERROR]', error);

  }, [propertyId, token, stopHeartbeat]);

  useEffect(() => {
    isMountedRef.current = true;
    if (propertyId && token) connect();
    return () => {
      isMountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      closeSocket();
    };
  }, [propertyId, token, connect, closeSocket]);

  return {
    isConnected,
    notifications,
    clearNotifications: useCallback(() => setNotifications([]), []),
  };
}