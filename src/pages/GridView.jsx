// // src/pages/GridView.jsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Grid3X3, Maximize2, ArrowUpFromLine, Crosshair, Loader2 } from 'lucide-react';
// import { useProperty } from '../hooks/useProperties';
// import { theme } from '../theme';

// const GridView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data: propertyData, isLoading, error } = useProperty(id);

//   if (isLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     );
//   }

//   if (error || !propertyData) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
//           <p className={`${theme.type.error} mb-3`}>Failed to load property</p>
//           <button onClick={() => navigate('/properties')} className={theme.type.link}>
//             Back to Properties
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const property   = propertyData?.property || propertyData || {};
//   const laserGrid  = property.laser_grid || {};
//   const laserX     = laserGrid.x_lasers   ?? property.x_lasers   ?? 3;
//   const laserY     = laserGrid.y_lasers   ?? property.y_lasers   ?? 8;
//   const boxWidth   = laserGrid.box_width  ?? property.box_width  ?? 2.0;
//   const boxLength  = laserGrid.box_length ?? property.box_length ?? 0.6;
//   const gridHeight = laserGrid.grid_height ?? property.grid_height ?? 2.4;

//   const verticalLines   = Array.from({ length: laserX }, (_, i) => i);
//   const horizontalLines = Array.from({ length: laserY }, (_, i) => i);

//   const infoCards = [
//     {
//       icon: Grid3X3,     iconColor: 'text-[#c5a880]',
//       label: 'Grid Size', value: `${laserX} × ${laserY}`, unit: 'lasers',
//     },
//     {
//       icon: Maximize2,   iconColor: 'text-emerald-500',
//       label: 'Spacing',  value: `${boxWidth}×${boxLength}`, unit: 'm',
//     },
//     {
//       icon: Crosshair,   iconColor: 'text-[#1c1c1c]',
//       label: 'Waypoints', value: `${(laserX - 1) * (laserY - 1)}`, unit: 'points',
//     },
//     {
//       icon: ArrowUpFromLine, iconColor: 'text-amber-500',
//       label: 'Height',   value: `${gridHeight}`, unit: 'm',
//     },
//   ];

//   return (
//     <div className={theme.page.wrapper}>

//       {/* Header */}
// <div className="bg-white border-b border-[#e6e3db] px-4 py-4
//                 flex items-center justify-between shadow-sm">
//   {/* Left group: back arrow + title */}
//   <div className="flex items-center gap-3">
//     <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//       <ArrowLeft className="h-5 w-5" />
//     </button>
//     <h2 className={theme.type.h3}>Laser Grid View </h2>
//   </div>

//   {/* Right: hamburger — direct child of header, not nested inside left group */}
//   <HamburgerMenu propertyId={id} />
// </div>

//       <div className="p-5 space-y-4">

//         {/* ── Info cards ── */}
//         <div className="grid grid-cols-2 gap-3">
//           {infoCards.map(({ icon: Icon, iconColor, label, value, unit }) => (
//             <div key={label} className={theme.card.sm}>
//               <div className="flex items-center gap-2 mb-2">
//                 <Icon className={`h-4 w-4 ${iconColor}`} />
//                 <span className={theme.type.labelSm}>{label}</span>
//               </div>
//               <span className={theme.type.h3}>{value}</span>
//               <span className={`${theme.type.bodySm} ml-1`}>{unit}</span>
//             </div>
//           ))}
//         </div>

//         {/* ── Visualizer card ── */}
//         <div className={theme.card.base}>
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="font-sans text-sm font-black text-[#1c1c1c]
//                            flex items-center gap-2">
//               <div className="w-2 h-2 bg-[#c5a880] rounded-full animate-pulse" />
//               Grid Layout
//             </h4>
//             <span className={theme.type.bodySm}>{property.name || 'Property'}</span>
//           </div>

//           <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
//             <div
//               className="relative bg-[#faf9f6] rounded-[1rem] border
//                           border-[#e6e3db] overflow-hidden"
//               style={{
//                 aspectRatio: `${(laserX - 1) * boxWidth}/${(laserY - 1) * boxLength}`,
//                 width: '100%',
//                 maxHeight: '280px',
//               }}
//             >
//               <div className="absolute inset-3">
//                 {verticalLines.map((i) => (
//                   <div
//                     key={`v-${i}`}
//                     className="absolute top-0 bottom-0 w-0.5 bg-red-500/70
//                                shadow-[0_0_6px_rgba(239,68,68,0.8)]"
//                     style={{ left: `${(i / (laserX - 1)) * 100}%` }}
//                   >
//                     <div className="absolute -top-1 -left-1 w-2 h-2
//                                     bg-red-500 rounded-full" />
//                     <div className="absolute -bottom-1 -left-1 w-2 h-2
//                                     bg-red-500 rounded-full" />
//                   </div>
//                 ))}

//                 {horizontalLines.map((i) => (
//                   <div
//                     key={`h-${i}`}
//                     className="absolute left-0 right-0 h-0.5 bg-emerald-500/70
//                                shadow-[0_0_6px_rgba(34,197,94,0.8)]"
//                     style={{ top: `${(i / (laserY - 1)) * 100}%` }}
//                   >
//                     <div className="absolute -left-1 -top-1 w-2 h-2
//                                     bg-emerald-500 rounded-full" />
//                     <div className="absolute -right-1 -top-1 w-2 h-2
//                                     bg-emerald-500 rounded-full" />
//                   </div>
//                 ))}

//                 {verticalLines.slice(0, -1).map((x) =>
//                   horizontalLines.slice(0, -1).map((y) => (
//                     <div
//                       key={`wp-${x}-${y}`}
//                       className="absolute w-3 h-3 bg-[#c5a880] rounded-full
//                                  border-2 border-white z-10
//                                  hover:scale-125 transition-transform cursor-pointer
//                                  shadow-[0_0_8px_rgba(197,168,128,0.9)]"
//                       style={{
//                         left:      `${((x + 0.5) / (laserX - 1)) * 100}%`,
//                         top:       `${((y + 0.5) / (laserY - 1)) * 100}%`,
//                         transform: 'translate(-50%, -50%)',
//                       }}
//                       title={`Waypoint ${x + 1},${y + 1}`}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="flex justify-center gap-4 mt-5">
//             {[
//               { color: 'bg-red-500',     label: `X (${laserX})` },
//               { color: 'bg-emerald-500', label: `Y (${laserY})` },
//               { color: 'bg-[#c5a880]',   label: `WP (${(laserX - 1) * (laserY - 1)})` },
//             ].map(({ color, label }) => (
//               <div key={label} className="flex items-center gap-1.5">
//                 <div className={`w-2 h-2 rounded-full ${color}`} />
//                 <span className={theme.type.labelSm}>{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Drone info ── */}
//         <div className={theme.card.dark}>
//           <h4 className="font-sans text-sm font-black text-white mb-2
//                          flex items-center gap-2 uppercase tracking-wide">
//             <ArrowUpFromLine className="h-4 w-4 text-[#c5a880]" />
//             Drone Flight Path
//           </h4>
//           <p className="font-sans text-sm text-gray-400 leading-relaxed">
//             Drone flies at{' '}
//             <span className="font-bold text-white bg-white/10 px-2 py-0.5
//                              rounded-full text-xs">{gridHeight}m</span>
//             {' '}height through{' '}
//             <span className="font-bold text-white bg-white/10 px-2 py-0.5
//                              rounded-full text-xs">{(laserX - 1) * (laserY - 1)}</span>
//             {' '}waypoints. Spacing:{' '}
//             <span className="font-bold text-white bg-white/10 px-2 py-0.5
//                              rounded-full text-xs">{boxWidth}m × {boxLength}m</span>.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default GridView;

// src/pages/GridView.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Maximize2, ArrowUpFromLine, Crosshair } from 'lucide-react';
import { useProperty } from '../hooks/useProperties';
import { theme } from '../theme';
import HamburgerMenu from '../components/HamburgerMenu';  // ← ADD THIS

const GridView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: propertyData, isLoading, error } = useProperty(id);

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Failed to load property</p>
          <button onClick={() => navigate('/properties')} className={theme.type.link}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const property   = propertyData?.property || propertyData || {};
  const laserGrid  = property.laser_grid || {};
  
  // Guard against zero/negative values
  const laserX     = Math.max(2, laserGrid.x_lasers   ?? property.x_lasers   ?? 3);
  const laserY     = Math.max(2, laserGrid.y_lasers   ?? property.y_lasers   ?? 8);
  const boxWidth   = laserGrid.box_width  ?? property.box_width  ?? 2.0;
  const boxLength  = laserGrid.box_length ?? property.box_length ?? 0.6;
  const gridHeight = laserGrid.grid_height ?? property.grid_height ?? 2.4;

  const verticalLines   = Array.from({ length: laserX }, (_, i) => i);
  const horizontalLines = Array.from({ length: laserY }, (_, i) => i);

  const infoCards = [
    {
      icon: Grid3X3,     iconColor: 'text-[#c5a880]',
      label: 'Grid Size', value: `${laserX} × ${laserY}`, unit: 'lasers',
    },
    {
      icon: Maximize2,   iconColor: 'text-emerald-500',
      label: 'Spacing',  value: `${boxWidth}×${boxLength}`, unit: 'm',
    },
    {
      icon: Crosshair,   iconColor: 'text-[#1c1c1c]',
      label: 'Waypoints', value: `${(laserX - 1) * (laserY - 1)}`, unit: 'points',
    },
    {
      icon: ArrowUpFromLine, iconColor: 'text-amber-500',
      label: 'Height',   value: `${gridHeight}`, unit: 'm',
    },
  ];

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className={theme.type.h3}>Laser Grid View</h2>
        </div>
        <HamburgerMenu propertyId={id} />
      </div>

      <div className="p-5 space-y-4">

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          {infoCards.map(({ icon: Icon, iconColor, label, value, unit }) => (
            <div key={label} className={theme.card.sm}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${iconColor}`} />
                <span className={theme.type.labelSm}>{label}</span>
              </div>
              <span className={theme.type.h3}>{value}</span>
              <span className={`${theme.type.bodySm} ml-1`}>{unit}</span>
            </div>
          ))}
        </div>

        {/* Visualizer card */}
        <div className={theme.card.base}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-sans text-sm font-black text-[#1c1c1c]
                           flex items-center gap-2">
              <div className="w-2 h-2 bg-[#c5a880] rounded-full animate-pulse" />
              Grid Layout
            </h4>
            <span className={theme.type.bodySm}>{property.name || 'Property'}</span>
          </div>

          <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
            <div
              className="relative bg-[#faf9f6] rounded-[1rem] border
                          border-[#e6e3db] overflow-hidden"
              style={{
                aspectRatio: `${(laserX - 1) * boxWidth}/${(laserY - 1) * boxLength}`,
                width: '100%',
                maxHeight: '280px',
              }}
            >
              <div className="absolute inset-3">
                {verticalLines.map((i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500/70
                               shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                    style={{ left: `${(i / (laserX - 1)) * 100}%` }}
                  >
                    <div className="absolute -top-1 -left-1 w-2 h-2
                                    bg-red-500 rounded-full" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2
                                    bg-red-500 rounded-full" />
                  </div>
                ))}

                {horizontalLines.map((i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-0.5 bg-emerald-500/70
                               shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                    style={{ top: `${(i / (laserY - 1)) * 100}%` }}
                  >
                    <div className="absolute -left-1 -top-1 w-2 h-2
                                    bg-emerald-500 rounded-full" />
                    <div className="absolute -right-1 -top-1 w-2 h-2
                                    bg-emerald-500 rounded-full" />
                  </div>
                ))}

                {verticalLines.slice(0, -1).map((x) =>
                  horizontalLines.slice(0, -1).map((y) => (
                    <div
                      key={`wp-${x}-${y}`}
                      className="absolute w-3 h-3 bg-[#c5a880] rounded-full
                                 border-2 border-white z-10
                                 hover:scale-125 transition-transform cursor-pointer
                                 shadow-[0_0_8px_rgba(197,168,128,0.9)]"
                      style={{
                        left:      `${((x + 0.5) / (laserX - 1)) * 100}%`,
                        top:       `${((y + 0.5) / (laserY - 1)) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={`Waypoint ${x + 1},${y + 1}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-5">
            {[
              { color: 'bg-red-500',     label: `X (${laserX})` },
              { color: 'bg-emerald-500', label: `Y (${laserY})` },
              { color: 'bg-[#c5a880]',   label: `WP (${(laserX - 1) * (laserY - 1)})` },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className={theme.type.labelSm}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drone info
        <div className={theme.card.dark}>
          <h4 className="font-sans text-sm font-black text-white mb-2
                         flex items-center gap-2 uppercase tracking-wide">
            <ArrowUpFromLine className="h-4 w-4 text-[#c5a880]" />
            Drone Flight Path
          </h4>
          <p className="font-sans text-sm text-gray-400 leading-relaxed">
            Drone flies at{' '}
            <span className="font-bold text-white bg-white/10 px-2 py-0.5
                             rounded-full text-xs">{gridHeight}m</span>
            {' '}height through{' '}
            <span className="font-bold text-white bg-white/10 px-2 py-0.5
                             rounded-full text-xs">{(laserX - 1) * (laserY - 1)}</span>
            {' '}waypoints. Spacing:{' '}
            <span className="font-bold text-white bg-white/10 px-2 py-0.5
                             rounded-full text-xs">{boxWidth}m × {boxLength}m</span>.
          </p>
        </div> */}

      </div>
    </div>
  );
};

export default GridView;