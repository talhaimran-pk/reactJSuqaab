// // // // src/pages/PropertyList.jsx
// // // import { useNavigate } from 'react-router-dom';
// // // import { Plus, ChevronRight, MapPin, LogOut, Loader2, Home } from 'lucide-react';
// // // import { useProperties } from '../hooks/useProperties';
// // // import { useLogout } from '../hooks/useAuth';
// // // import { theme } from '../theme';

// // // const PropertyList = () => {
// // //   const navigate = useNavigate();
// // //   const logout = useLogout();
// // //   const { data: properties = [], isLoading, error } = useProperties();

// // //   // ── Loading ───────────────────────────────
// // //   if (isLoading) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={theme.ui.spinner} />
// // //       </div>
// // //     );
// // //   }

// // //   // ── Error ─────────────────────────────────
// // //   if (error) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// // //           <p className={`${theme.type.error} mb-3`}>Failed to load properties</p>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className={theme.type.link}
// // //           >
// // //             Retry
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Empty state ───────────────────────────
// // //   if (properties.length === 0) {
// // //     return (
// // //       <div className={theme.page.centered}>
// // //         <div className="w-full max-w-sm px-4">
// // //           <div className={`${theme.card.lg} flex flex-col items-center text-center gap-6`}>

// // //             <div className={theme.divider.gold} />

// // //             <div className={theme.ui.iconBox}>
// // //               <Home className="w-6 h-6 text-[#c5a880]" />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <h1 className={theme.type.h2}>Welcome!</h1>
// // //               <p className={theme.type.body}>
// // //                 You don't have any properties yet. Add your first one to get started.
// // //               </p>
// // //             </div>

// // //             <button
// // //               onClick={() => navigate('/add-property')}
// // //               className={`${theme.button.primary} ${theme.button.full}`}
// // //             >
// // //               Add Your First Property
// // //             </button>

// // //             <button
// // //               onClick={logout}
// // //               className={`${theme.type.bodySm} flex items-center gap-2
// // //                           text-gray-400 hover:text-[#1c1c1c] transition-colors`}
// // //             >
// // //               <LogOut className="w-4 h-4" />
// // //               Logout
// // //             </button>

// // //             <div className={theme.divider.gold} />

// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ── List ──────────────────────────────────
// // //   return (
// // //     <div className={`${theme.page.wrapper} pb-24`}>

// // //       {/* Header */}
// // //       <div className="sticky top-0 z-10 bg-white border-b border-[#e6e3db]
// // //                       px-6 py-4 flex justify-between items-center shadow-sm">
// // //         <div>
// // //           <h1 className={theme.type.h2}>Your Properties</h1>
          
// // //         </div>
// // //         <button
// // //           onClick={logout}
// // //           className={`${theme.ui.backBtn} flex items-center gap-2`}
// // //         >
// // //           <LogOut className="w-4 h-4" />
// // //           <span className="hidden sm:inline font-sans text-sm font-semibold">Logout</span>
// // //         </button>
// // //       </div>

// // //       {/* Cards */}
// // //       <div className="px-5 space-y-3 mt-5">
// // //         {properties.map((property) => (
// // //           <div
// // //             key={property.id}
// // //             onClick={() => navigate(`/property/${property.id}`)}
// // //             className={theme.card.interactive}
// // //           >
// // //             <div className="flex justify-between items-start">
// // //               <div className="flex-1 min-w-0">
// // //                 <h3 className={`${theme.type.h4} truncate`}>{property.name}</h3>
// // //                 <p className={`${theme.type.bodySm} truncate mt-0.5`}>
// // //                   {property.address || 'No address'}
// // //                 </p>
                
// // //               </div>

// // //               <div className="flex items-center gap-2 ml-2 flex-shrink-0">
// // //                 {property.active_alerts > 0 && (
// // //                   <span className={theme.ui.alertDot}>
// // //                     {property.active_alerts}
// // //                   </span>
// // //                 )}
// // //                 <ChevronRight className="w-5 h-5 text-gray-300" />
// // //               </div>
// // //             </div>

// // //             {/* Footer stats */}
// // //             <div className="mt-4 pt-4 border-t border-[#e6e3db]
// // //                             flex justify-between text-xs font-bold font-sans uppercase tracking-wide">
// // //               <span className="text-emerald-500">
// // //                 {property.cameras_online || 0}/{property.cameras_total || 0} Cameras Online
// // //               </span>
// // //               <span className="text-gray-400">
// // //                 Drone: {property.drone_status || 'None'}
// // //               </span>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* FAB */}
// // //       <button
// // //         onClick={() => navigate('/add-property')}
// // //         className={theme.ui.fab}
// // //       >
// // //         <Plus className="h-6 w-6" />
// // //       </button>

// // //     </div>
// // //   );
// // // };

// // // export default PropertyList;

// // // src/pages/PropertyList.jsx
// // import { useNavigate } from 'react-router-dom';
// // import { Plus, ChevronRight, LogOut, Home, Building2, MapPin, Radio } from 'lucide-react';
// // import { useProperties } from '../hooks/useProperties';
// // import { useLogout } from '../hooks/useAuth';
// // import { theme } from '../theme';

// // const PropertyList = () => {
// //   const navigate = useNavigate();
// //   const logout = useLogout();
// //   const { data: properties = [], isLoading, error } = useProperties();

// //   if (isLoading) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={theme.ui.spinner} />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
// //           <p className={`${theme.type.error} mb-3`}>Failed to load properties</p>
// //           <button onClick={() => window.location.reload()} className={theme.type.link}>
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ── Empty state ───────────────────────────
// //   if (properties.length === 0) {
// //     return (
// //       <div className={theme.page.centered}>
// //         <div className="w-full max-w-md px-4">
// //           <div className={`${theme.card.lg} flex flex-col items-center text-center gap-6`}>
// //             <div className={theme.ui.iconBox}>
// //               <Home className="w-6 h-6 text-[#c5a880]" />
// //             </div>
// //             <div className="space-y-2">
// //               <h1 className={theme.type.h2}>No Properties Yet</h1>
// //               <p className={theme.type.body}>
// //                 Get started by adding your first site to the management dashboard.
// //               </p>
// //             </div>
// //             <button
// //               onClick={() => navigate('/add-property')}
// //               className={`${theme.button.primary} ${theme.button.full}`}
// //             >
// //               <Plus className="w-4 h-4" />
// //               Add Your First Property
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ── Desktop List View ──────────────────────
// //   return (
// //     <div className={theme.page.wrapper}>
// //       {/* Header Bar */}
// //       <header className="sticky top-0 z-10 bg-white border-b border-[#e6e3db] px-8 py-5 shadow-sm">
// //         <div className="max-w-7xl mx-auto flex justify-between items-center">
// //           <div>
// //             <h1 className={`${theme.type.h2} select-none cursor-default`}>Your Properties</h1>
// //             <p className={`${theme.type.bodySm} select-none cursor-default`}>Overview of all registered locations</p>
// //           </div>
          
// //           <div className="flex items-center gap-4">
// //             <button
// //               onClick={() => navigate('/add-property')}
// //               className={theme.button.primary}
// //             >
// //               <Plus className="w-4 h-4" />
// //               <span className="hidden md:inline" >Add Property</span>
// //             </button>
            
// //             <div className={theme.divider.vertical} className="h-8 w-px bg-[#e6e3db]" />
            
// //             <button
// //               onClick={logout}
// //               className={`${theme.ui.backBtn} flex items-center gap-2 px-4`}
// //             >
// //               <LogOut className="w-4 h-4 text-gray-400" />
// //               <span className="text-sm font-bold text-gray-500">Logout</span>
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Grid Content */}
// //       <main className="max-w-7xl mx-auto px-8 py-10">
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {properties.map((property) => (
// //             <div
// //               key={property.id}
// //               onClick={() => navigate(`/property/${property.id}`)}
// //               className={`${theme.card.interactive} group flex flex-col h-full`}
// //             >
// //               {/* Card Header */}
// //               <div className="flex justify-between items-start mb-4">
// //                 <div className="bg-[#faf9f6] p-3 rounded-2xl group-hover:bg-[#c5a880]/10 transition-colors">
// //                   <Building2 className="w-6 h-6 text-[#c5a880]" />
// //                 </div>
// //                 {property.active_alerts > 0 && (
// //                   <span className={theme.ui.alertDot}>
// //                     {property.active_alerts}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Card Body */}
// //               <div className="flex-1">
// //                 <h3 className={theme.type.h4}>{property.name}</h3>
// //                 <div className="flex items-center gap-1.5 mt-1 text-gray-400">
// //                   <MapPin className="w-3.5 h-3.5" />
// //                   <p className="text-xs font-medium truncate">
// //                     {property.address || 'No address assigned'}
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Status Section */}
// //               <div className="mt-6 pt-5 border-t border-[#e6e3db] space-y-3">
// //                 <div className="flex justify-between items-center">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
// //                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
// //                       {property.cameras_online || 0}/{property.cameras_total || 0} Online
// //                     </span>
// //                   </div>
// //                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#c5a880] transition-colors" />
// //                 </div>

// //                 <div className="flex items-center gap-2">
// //                    <Radio className="w-3.5 h-3.5 text-gray-400" />
// //                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
// //                      Drone: <span className="text-gray-600">{property.drone_status || 'Offline'}</span>
// //                    </span>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </main>

// //       {/* Optional: Mobile FAB remains for smaller viewports only */}
// //       <button
// //         onClick={() => navigate('/add-property')}
// //         className={`${theme.ui.fab} md:hidden`}
// //       >
// //         <Plus className="h-6 w-6" />
// //       </button>
// //     </div>
// //   );
// // };

// // export default PropertyList;

// // src/pages/PropertyList.jsx
// import { useNavigate } from 'react-router-dom';
// import { Plus, ChevronRight, LogOut, Home, Building2, MapPin, Radio } from 'lucide-react';
// import { useProperties } from '../hooks/useProperties';
// import { useLogout } from '../hooks/useAuth';
// import { theme } from '../theme';

// const PropertyList = () => {
//   const navigate = useNavigate();
//   const logout = useLogout();
//   const { data: properties = [], isLoading, error } = useProperties();

//   if (isLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={`${theme.card.base} text-center max-w-sm w-full`}>
//           <p className={`${theme.type.error} mb-3`}>Failed to load properties</p>
//           <button onClick={() => window.location.reload()} className={theme.type.link}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (properties.length === 0) {
//     return (
//       <div className={theme.page.centered}>
//         <div className="w-full max-w-md px-4">
//           <div className={`${theme.card.lg} flex flex-col items-center text-center gap-6`}>
//             <div className={theme.ui.iconBox}>
//               <Home className="w-6 h-6 text-[#c5a880]" />
//             </div>
//             <div className="space-y-2">
//               <h1 className={theme.type.h2}>No Properties Yet</h1>
//               <p className={theme.type.body}>
//                 Get started by adding your first site to the management dashboard.
//               </p>
//             </div>
//             <button
//               onClick={() => navigate('/add-property')}
//               className={`${theme.button.primary} ${theme.button.full}`}
//             >
//               <Plus className="w-4 h-4" />
//               Add Your First Property
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={theme.page.wrapper}>
//       {/* Header Bar */}
//       <header className="sticky top-0 z-10 bg-white border-b border-[#e6e3db] px-8 py-5 shadow-sm">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className={theme.type.h2}>Your Properties</h1>
//             <p className={theme.type.bodySm}>Overview of all registered locations</p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/add-property')}
//               className={theme.button.primary}
//             >
//               <Plus className="w-4 h-4" />
//               <span className="hidden md:inline">Add Property</span>
//             </button>
            
//             <div className="h-8 w-px bg-[#e6e3db]" />
            
//             <button
//               onClick={logout}
//               className={`${theme.button.secondary} ${theme.button.sm} flex items-center gap-2`}
//             >
//               <LogOut className="w-4 h-4 text-gray-400" />
//               <span className="text-sm font-bold text-gray-500">Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Grid Content */}
//       <main className="max-w-7xl mx-auto px-8 py-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {properties.map((property) => (
//             <div
//               key={property.id}
//               onClick={() => navigate(`/property/${property.id}`)}
//               className={`${theme.card.flat} border border-[#e6e3db] group flex flex-col h-full 
//                           hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200`}
//             >
//               {/* Card Header */}
//               <div className="flex justify-between items-start mb-4">
//                 <div className="bg-white p-3 rounded-2xl group-hover:bg-[#c5a880]/10 transition-colors shadow-sm">
//                   <Building2 className="w-6 h-6 text-[#c5a880]" />
//                 </div>
//                 {property.active_alerts > 0 && (
//                   <span className={theme.ui.alertDot}>
//                     {property.active_alerts}
//                   </span>
//                 )}
//               </div>

//               {/* Card Body */}
//               <div className="flex-1 px-1">
//                 <h3 className={theme.type.h3}>{property.name}</h3>
//                 <div className="flex items-center gap-1.5 mt-1 text-gray-400">
//                   <MapPin className="w-3.5 h-3.5" />
//                   <p className="text-xs font-medium truncate">
//                     {property.address || 'No address assigned'}
//                   </p>
//                 </div>
//               </div>

//               {/* Status Section */}
//               <div className="mt-6 pt-5 border-t border-[#e6e3db] space-y-3 px-1">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
//                       {property.cameras_online || 0}/{property.cameras_total || 0} Online
//                     </span>
//                   </div>
//                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#c5a880] transition-colors" />
//                 </div>

//                 <div className="flex items-center gap-2">
//                    <Radio className="w-3.5 h-3.5 text-gray-400" />
//                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                      Drone: <span className="text-gray-600">{property.drone_status || 'Offline'}</span>
//                    </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PropertyList;

// src/pages/PropertyList.jsx
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, LogOut, Home, Building2, MapPin, Radio } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useLogout } from '../hooks/useAuth';
import { theme } from '../theme';

const PropertyList = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: properties = [], isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Failed to load properties</p>
          <button onClick={() => window.location.reload()} className={theme.type.link}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={theme.page.wrapper}>
      {/* Header Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#e6e3db] px-8 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="select-none cursor-default">
            <h1 className={theme.type.h2}>Your Properties</h1>
            {/* <p className={theme.type.bodySm}>Overview of all registered locations</p> */}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/add-property')}
              className={theme.button.primary}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Property</span>
            </button>
            
            <div className="h-8 w-px bg-[#e6e3db]" />
            
            <button
              onClick={logout}
              className={`${theme.button.secondary} ${theme.button.sm} flex items-center gap-2`}
            >
              <LogOut className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-500">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate(`/property/${property.id}`)}
              className={`${theme.card.flat} border border-[#e6e3db] group flex flex-col h-full 
                          hover:shadow-md hover:border-[#c5a880]/40 cursor-pointer transition-all duration-200 
                          rounded-[2.5rem]`} // Slightly larger radius to match image_3c9b71.png
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#e6e3db]/50">
                  <Building2 className="w-6 h-6 text-[#c5a880]" />
                </div>
                {property.active_alerts > 0 && (
                  <span className={theme.ui.alertDot}>
                    {property.active_alerts}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex-1 px-1">
                <h3 className={theme.type.h3}>{property.name}</h3>
                <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <p className="text-xs font-medium truncate">
                    {property.address || 'No address assigned'}
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="mt-8 pt-6 border-t border-[#e6e3db] space-y-4 px-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      {property.cameras_online || 0}/{property.cameras_total || 0} Online
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#c5a880] transition-colors" />
                </div>

                <div className="flex items-center gap-2">
                   <Radio className="w-3.5 h-3.5 text-gray-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                     Drone: <span className="text-gray-600">{property.drone_status || 'Offline'}</span>
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PropertyList;