// src/components/AlertBadge.jsx
import { Bell } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const AlertBadge = ({ propertyId }) => {
  const navigate = useNavigate();
  const { data: alerts = [] } = useAlerts(propertyId);

  const unreadCount = alerts.filter(a => !a.is_read).length;
  const hasCritical = alerts.some(a => a.severity === 'critical' && !a.is_read);

  if (unreadCount === 0) return null;

  return (
    <button
      onClick={() => navigate(`/property/${propertyId}/alerts`)}
      className="relative p-2 text-gray-400 hover:text-[#1c1c1c] transition-colors"
    >
      <Bell className="h-5 w-5" />
      
      <span className={`absolute -top-0.5 -right-0.5 flex items-center justify-center 
                        text-[10px] font-black w-5 h-5 rounded-full shadow-sm
                        ${hasCritical ? theme.badge.danger : theme.badge.accent}`}>
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </button>
  );
};

export default AlertBadge;