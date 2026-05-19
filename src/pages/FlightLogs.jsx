// src/pages/FlightLogs.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Clock, Navigation } from 'lucide-react';
import { theme } from '../theme';
import HamburgerMenu from '../components/HamburgerMenu';

const FlightLogs = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const logs     = [];

  const typeColorMap = {
    red:    'bg-red-100 text-red-600',
    blue:   'bg-[#c5a880]/10 text-[#c5a880]',
    gray:   'bg-[#faf9f6] text-gray-500',
    orange: 'bg-amber-100 text-amber-600',
    green:  'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
<div className="bg-white border-b border-[#e6e3db] px-4 py-4
                flex items-center justify-between shadow-sm">
  {/* Left group: back arrow + title */}
  <div className="flex items-center gap-3">
    <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
      <ArrowLeft className="h-5 w-5" />
    </button>
    <h2 className={theme.type.h3}>Flight Logs ({logs.length})</h2>
  </div>

  {/* Right: hamburger — direct child of header, not nested inside left group */}
  <HamburgerMenu propertyId={id} />
</div>
 
        
      <div className="p-5 space-y-3">
        {logs.length === 0 ? (
          <div className={`${theme.card.base} flex flex-col items-center
                           text-center py-16 gap-4`}>
            <Navigation className="h-16 w-16 text-gray-200" />
            <h3 className={theme.type.h3}>No flight logs yet</h3>
            <p className={theme.type.bodySm}>
              Logs will appear when drones complete flights
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={theme.card.sm}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-[#c5a880]" />
                  <span className={theme.type.h4}>{log.droneName}</span>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full
                                  uppercase tracking-widest
                                  ${typeColorMap[log.typeColor] || typeColorMap.gray}`}>
                  {log.type}
                </span>
              </div>

              <p className={theme.type.bodySm}>{log.reason}</p>

              <div className="flex justify-between mt-3 pt-3
                              border-t border-[#e6e3db]">
                <div>
                  <span className={`${theme.type.labelSm} block`}>Takeoff</span>
                  <span className={theme.type.bodySm}>{log.takeoff}</span>
                </div>
                <div className="text-center">
                  <Clock className="h-3 w-3 mx-auto mb-1 text-gray-300" />
                  <span className="font-sans text-xs font-bold text-[#c5a880]">
                    {log.duration}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`${theme.type.labelSm} block`}>Land</span>
                  <span className={theme.type.bodySm}>{log.land}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default FlightLogs;