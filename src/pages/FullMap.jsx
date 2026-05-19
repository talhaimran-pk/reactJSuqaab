// src/pages/FullMap.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Video, Navigation } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import HamburgerMenu from '../components/HamburgerMenu';
import { theme } from '../theme';

const FullMap = () => {
  const { id }  = useParams();
  const navigate = useNavigate();
  const property = usePropertyStore((state) => state.getProperty(Number(id)));

  if (!property) {
    navigate('/properties');
    return null;
  }

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={`${theme.type.h3} flex-1 truncate`}>
          Map: {property.name}
        </h2>
        <HamburgerMenu propertyId={id} />
      </div>

      {/* Map area */}
      <div className="p-5">
        <div className={`${theme.card.base} relative overflow-hidden`}
             style={{ height: 'calc(100vh - 140px)' }}>

          <div className="absolute inset-0 bg-[#faf9f6] rounded-[2rem]" />

          {property.location && (
            <div className="absolute left-1/2 top-1/2
                            -translate-x-1/2 -translate-y-1/2 z-10">
              <MapPin className="w-10 h-10 text-[#c5a880]" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2
                              bg-[#1c1c1c] text-white text-xs px-3 py-1
                              rounded-full whitespace-nowrap font-sans font-bold">
                {property.name}
              </div>
            </div>
          )}

          {property.cameras?.map((camera, idx) => (
            <div
              key={camera.id}
              className="absolute z-10"
              style={{ left: `${30 + idx * 20}%`, top: `${30 + idx * 15}%` }}
            >
              <Video className="w-6 h-6 text-[#c5a880]" />
            </div>
          ))}

          {property.drones?.map((drone, idx) => (
            <div
              key={drone.id}
              className="absolute animate-pulse z-10"
              style={{ left: `${60 + idx * 10}%`, top: `${40 + idx * 10}%` }}
            >
              <Navigation className="w-6 h-6 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FullMap;