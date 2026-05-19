// src/pages/PropertySettings.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Wifi, Users, FileText, Home, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useProperty } from '../hooks/useProperties';
import { useLogout } from '../hooks/useAuth';
import { theme } from '../theme';

const PropertySettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: property, isLoading } = useProperty(id);

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  const menuItems = [
    { icon: Video,    label: 'Manage Cameras',            target: `/property/${id}/cameras` },
    { icon: Wifi,     label: 'Manage Drones',             target: `/property/${id}/drones` },
    { icon: Users,    label: 'Manage Authorized People',  target: `/property/${id}/people` },
    { icon: FileText, label: 'Drone Flight Logs',         target: `/property/${id}/logs` },
    { icon: Home,     label: 'Manage Property Details',   target: `/property/${id}/edit` },
  ];

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h2 className={theme.type.h3}>Settings</h2>
          <p className={theme.type.labelSm}>{property?.name || 'Property'}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="p-5 space-y-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.target)}
            className="w-full flex justify-between items-center
                       bg-white border border-[#e6e3db] p-4 rounded-[1.5rem]
                       hover:shadow-md hover:border-[#c5a880]/40
                       transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={theme.ui.iconBox}>
                <item.icon className="h-5 w-5 text-[#c5a880]" />
              </div>
              <span className={theme.type.h4}>{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex justify-between items-center
                     bg-red-50 border border-red-100 p-4 rounded-[1.5rem]
                     hover:bg-red-100 transition-all mt-6 cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className={theme.ui.iconBoxDanger}>
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <span className="font-sans text-sm font-bold text-red-500">Logout</span>
          </div>
        </button>
      </div>

    </div>
  );
};

export default PropertySettings;