// // src/components/DroneFeed.jsx
// import { useState, useRef } from 'react';
// import { AlertCircle, Maximize2, WifiOff, Plane } from 'lucide-react';
// import { theme } from '../theme';

// const DroneFeed = ({ drone, onClick }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError]         = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const imgRef = useRef(null);

//   const getStreamUrl = () => {
//     const raw = drone.connection_string || '';
//     if (!raw) return { type: 'unknown', url: null };
//     if (raw.toLowerCase().startsWith('http')) return { type: 'http', url: raw };
//     return { type: 'unknown', url: null };
//   };

//   const streamInfo = getStreamUrl();

//   const handleRetry = (e) => {
//     e.stopPropagation();
//     setIsLoading(true);
//     setError(null);
//     setRetryCount(prev => prev + 1);
//   };

//   // ── Offline / no URL ──────────────────────────────────────────────────────
//   if (drone.status?.toLowerCase() === 'offline' && !streamInfo.url) {
//     return (
//       <div
//         onClick={onClick}
//         className={`${theme.media.feed} flex flex-col items-center justify-center cursor-pointer`}
//       >
//         <WifiOff className="h-8 w-8 text-red-500 mb-2" />
//         <span className="text-[10px] font-bold text-white text-center truncate w-full px-2">
//           {drone.name}
//         </span>
//         <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
//           Offline
//         </span>
//       </div>
//     );
//   }

//   // ── Unknown / unsupported URL ─────────────────────────────────────────────
//   if (streamInfo.type === 'unknown') {
//     return (
//       <div
//         onClick={onClick}
//         className={`${theme.media.feed} flex flex-col items-center justify-center cursor-pointer`}
//       >
//         <Plane className="h-8 w-8 text-gray-500 mb-2" />
//         <span className="text-[10px] font-bold text-white text-center truncate w-full px-2">
//           {drone.name}
//         </span>
//         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//           No Feed URL
//         </span>
//       </div>
//     );
//   }

//   // ── Live HTTP feed ────────────────────────────────────────────────────────
//   return (
//     <div onClick={onClick} className={`${theme.media.feed} cursor-pointer group`}>

//       {/* Loading */}
//       {isLoading && !error && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1c1c1c]">
//           <div className={theme.ui.spinner} />
//           <span className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
//             Connecting
//           </span>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1c1c1c]">
//           <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
//           <span className="text-xs text-gray-400 mb-3">{error}</span>
//           <button
//             onClick={handleRetry}
//             className={theme.button.secondary + ' ' + theme.button.sm}
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Feed image – uses MJPEG src so browser keeps refreshing */}
//       {!error && (
//         <img
//           ref={imgRef}
//           key={`${drone.id}-${retryCount}`}
//           src={streamInfo.url}
//           alt={drone.name}
//           className="w-full h-full object-cover"
//           onLoad={() => { setIsLoading(false); setError(null); }}
//           onError={() => { setIsLoading(false); setError('Feed unavailable'); }}
//           style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
//         />
//       )}

//       {/* Bottom name strip */}
//       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 z-10">
//         <span className="text-[11px] font-bold text-white truncate block tracking-wide">
//           {drone.name}
//         </span>
//       </div>

//       {/* Live badge + hover expand icon */}
//       {!error && !isLoading && (
//         <div className="absolute inset-0 z-10">
//           <div className="absolute top-3 right-3">
//             <span className={theme.badge.live}>
//               <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
//             </span>
//           </div>

//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors
//                           flex items-center justify-center opacity-0 group-hover:opacity-100">
//             <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
//                             flex items-center justify-center">
//               <Maximize2 className="w-5 h-5 text-white" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DroneFeed;

// src/components/DroneFeed.jsx
import { useState, useRef } from 'react';
import { AlertCircle, Maximize2, WifiOff, Plane } from 'lucide-react';
import { theme } from '../theme';

const DroneFeed = ({ drone, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef(null);

  const getStreamUrl = () => {
    const raw = drone.connection_string || '';
    if (!raw) return { type: 'unknown', url: null };
    if (raw.toLowerCase().startsWith('http')) return { type: 'http', url: raw };
    return { type: 'unknown', url: null };
  };

  const streamInfo = getStreamUrl();

  const handleRetry = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // ── Offline / no URL ──────────────────────────────────────────────────────
  if (drone.status?.toLowerCase() === 'offline' && !streamInfo.url) {
    return (
      <div
        onClick={onClick}
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-[#1e293b]"
      >
        <WifiOff className="h-8 w-8 text-red-500 mb-2" />
        <span className="text-[10px] font-bold text-white text-center truncate w-full px-2">
          {drone.name}
        </span>
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
          Offline
        </span>
      </div>
    );
  }

  // ── Unknown / unsupported URL ─────────────────────────────────────────────
  if (streamInfo.type === 'unknown') {
    return (
      <div
        onClick={onClick}
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-[#1e293b]"
      >
        <Plane className="h-8 w-8 text-gray-500 mb-2" />
        <span className="text-[10px] font-bold text-white text-center truncate w-full px-2">
          {drone.name}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          No Feed URL
        </span>
      </div>
    );
  }

  // ── Live HTTP feed ────────────────────────────────────────────────────────
  return (
    <div onClick={onClick} className="absolute inset-0 cursor-pointer group bg-[#1e293b]">

      {/* Loading */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1c1c1c]">
          <div className={theme.ui.spinner} />
          <span className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
            Connecting
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#1c1c1c]">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-xs text-gray-400 mb-3">{error}</span>
          <button
            onClick={handleRetry}
            className={theme.button.secondary + ' ' + theme.button.sm}
          >
            Retry
          </button>
        </div>
      )}

      {/* Feed — absolute so it fills the entire parent box */}
      {!error && (
        <img
          ref={imgRef}
          key={`${drone.id}-${retryCount}`}
          src={streamInfo.url}
          alt={drone.name}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => { setIsLoading(false); setError(null); }}
          onError={() => { setIsLoading(false); setError('Feed unavailable'); }}
          style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
        />
      )}

      {/* Bottom name strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 z-10">
        <span className="text-[11px] font-bold text-white truncate block tracking-wide">
          {drone.name}
        </span>
      </div>

      {/* Live badge + hover expand icon */}
      {!error && !isLoading && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-3 right-3">
            <span className={theme.badge.live}>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors
                          flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
                            flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneFeed;