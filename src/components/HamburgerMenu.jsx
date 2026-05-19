// // src/components/HamburgerMenu.jsx
// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Menu, X, Home, Video, Navigation, Bell, Grid3X3, 
//   Users, FileText, Settings, LogOut, Building2, ChevronRight 
// } from 'lucide-react';
// import { useLogout } from '../hooks/useAuth';
// import { theme } from '../theme';

// const HamburgerMenu = ({ propertyId }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const logout = useLogout();
//   const [isOpen, setIsOpen] = useState(false);

//   const isActive = (path) => location.pathname === path;

//   const mainNavItems = [
//     { icon: Home, label: 'Dashboard', path: `/property/${propertyId}`, description: 'Overview & cameras' },
//     { icon: Video, label: 'Cameras', path: `/property/${propertyId}/cameras`, description: 'Manage feeds' },
//     { icon: Navigation, label: 'Drones', path: `/property/${propertyId}/drones`, description: 'Fleet management' },
//     { icon: Bell, label: 'Alerts', path: `/property/${propertyId}/alerts`, description: 'Security events', badge: 2 },
//     { icon: Grid3X3, label: 'Grid View', path: `/property/${propertyId}/grid`, description: 'Laser grid map' },
//     { icon: Users, label: 'People', path: `/property/${propertyId}/people`, description: 'Face recognition' },
//     { icon: FileText, label: 'Logs', path: `/property/${propertyId}/logs`, description: 'Flight history' }
//   ];

//   const handleNavigate = (path) => {
//     setIsOpen(false);
//     setTimeout(() => navigate(path), 150);
//   };

//   const handleLogout = () => {
//     setIsOpen(false);
//     logout();
//   };

//   return (
//     <>
//       {/* Trigger Button */}
//       <button onClick={() => setIsOpen(true)} className={theme.button.icon} title="Menu">
//         <Menu className="w-5 h-5" />
//       </button>

//       {/* Backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-[#1c1c1c]/50 backdrop-blur-sm z-50 transition-opacity"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Slide-out Drawer */}
//       <div 
//         className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white border-l border-[#e6e3db] 
//                     shadow-[0_4px_24px_rgba(28,28,28,0.15)] z-50 transform transition-transform duration-300 ease-in-out 
//                     ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-[#e6e3db]">
//           <h2 className={theme.type.h3}>Menu</h2>
//           <button onClick={() => setIsOpen(false)} className={theme.button.icon}>
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation List */}
//         <div className="h-[calc(100vh-160px)] overflow-y-auto p-3 space-y-1">
//           <p className={`${theme.type.label} px-3 mb-2`}>Property Navigation</p>
          
//           {mainNavItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => handleNavigate(item.path)}
//               className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] transition-all duration-200 
//                           ${isActive(item.path) 
//                             ? 'bg-[#1c1c1c] text-white shadow-md' 
//                             : 'text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c]'}`}
//             >
//               <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
//                               ${isActive(item.path) ? 'bg-white/10' : 'bg-[#faf9f6]'}`}>
//                 <item.icon className="w-4 h-4" />
//               </div>
//               <div className="flex-1 text-left">
//                 <div className="flex items-center gap-2">
//                   <span className="font-sans font-bold text-sm">{item.label}</span>
//                   {item.badge && <span className={theme.ui.alertDot}>{item.badge}</span>}
//                 </div>
//                 <p className="text-[11px] font-medium text-gray-400">
//                   {item.description}
//                 </p>
//               </div>
//               <ChevronRight className="w-4 h-4 opacity-50" />
//             </button>
//           ))}

//           <div className={theme.divider.full + ' my-4'} />

//           {/* Settings & Switch */}
//           <button onClick={() => handleNavigate(`/property/${propertyId}/settings`)}
//                   className="w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all">
//             <div className="w-9 h-9 rounded-lg bg-[#faf9f6] flex items-center justify-center">
//               <Settings className="w-4 h-4" />
//             </div>
//             <span className="font-sans font-bold text-sm">Settings</span>
//           </button>

//           <button onClick={() => handleNavigate('/properties')}
//                   className="w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all">
//             <div className="w-9 h-9 rounded-lg bg-[#faf9f6] flex items-center justify-center">
//               <Building2 className="w-4 h-4" />
//             </div>
//             <span className="font-sans font-bold text-sm">Switch Property</span>
//           </button>
//         </div>

//         {/* Footer Logout */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e6e3db] bg-white">
//           <button onClick={handleLogout} className={`${theme.button.danger} ${theme.button.full} text-xs py-2.5`}>
//             <LogOut className="w-4 h-4" /> Logout Account
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HamburgerMenu;

// src/components/HamburgerMenu.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Video, Navigation, Bell, Grid3X3, 
  Users, FileText, Settings, LogOut, Building2, ChevronRight 
} from 'lucide-react';
import { useLogout } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';
import { theme } from '../theme';

const HamburgerMenu = ({ propertyId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const { data: alerts = [] } = useAlerts(propertyId);
  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { icon: Home, label: 'Dashboard', path: `/property/${propertyId}`, description: 'Overview & cameras' },
    { icon: Video, label: 'Cameras', path: `/property/${propertyId}/cameras`, description: 'Manage feeds' },
    { icon: Navigation, label: 'Drones', path: `/property/${propertyId}/drones`, description: 'Fleet management' },
    { icon: Bell, label: 'Alerts', path: `/property/${propertyId}/alerts`, description: 'Security events', badge: unreadAlerts || null },
    { icon: Grid3X3, label: 'Grid View', path: `/property/${propertyId}/grid`, description: 'Laser grid map' },
    { icon: Users, label: 'People', path: `/property/${propertyId}/people`, description: 'Face recognition' },
    { icon: FileText, label: 'Logs', path: `/property/${propertyId}/logs`, description: 'Flight history' }
  ];

  const handleNavigate = (path) => {
    setIsOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <>
      {/* Trigger Button */}
      <button onClick={() => setIsOpen(true)} className={theme.button.icon} title="Menu">
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1c1c1c]/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white border-l border-[#e6e3db] 
                    shadow-[0_4px_24px_rgba(28,28,28,0.15)] z-50 transform transition-transform duration-300 ease-in-out 
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e6e3db]">
          <h2 className={theme.type.h3}>Menu</h2>
          <button onClick={() => setIsOpen(false)} className={theme.button.icon}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="h-[calc(100vh-160px)] overflow-y-auto p-3 space-y-1">
          <p className={`${theme.type.label} px-3 mb-2`}>Property Navigation</p>
          
          {mainNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] transition-all duration-200 
                          ${isActive(item.path) 
                            ? 'bg-[#1c1c1c] text-white shadow-md' 
                            : 'text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c]'}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                              ${isActive(item.path) ? 'bg-white/10' : 'bg-[#faf9f6]'}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={theme.ui.alertDot}>{item.badge}</span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-gray-400">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className={theme.divider.full + ' my-4'} />

          {/* Settings & Switch */}
          <button
            onClick={() => handleNavigate(`/property/${propertyId}/settings`)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#faf9f6] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-sans font-bold text-sm">Settings</span>
          </button>

          <button
            onClick={() => handleNavigate('/properties')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-[1rem] text-gray-500 hover:bg-[#faf9f6] hover:text-[#1c1c1c] transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#faf9f6] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-sans font-bold text-sm">Switch Property</span>
          </button>
        </div>

        {/* Footer Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e6e3db] bg-white">
          <button
            onClick={handleLogout}
            className={`${theme.button.danger} ${theme.button.full} text-xs py-2.5`}
          >
            <LogOut className="w-4 h-4" /> Logout Account
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;