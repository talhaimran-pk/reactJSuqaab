// src/components/MapPicker.jsx
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Crosshair } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { theme } from '../theme'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) { setPosition(e.latlng) },
  })
  return position === null ? null : <Marker position={position} />
}

const MapPicker = ({ position, setPosition }) => {
  const [center] = useState([51.505, -0.09])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition({ lat: latitude, lng: longitude })
        },
        (err) => alert('Could not get location: ' + err.message)
      )
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className={theme.input.label + ' mb-0'}>Pin Location *</label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className={`${theme.button.secondary} ${theme.button.sm}`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          Use My Location
        </button>
      </div>

      <div className="h-64 bg-white rounded-[1.5rem] relative overflow-hidden border border-[#e6e3db] shadow-sm">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        {position && (
          <div className="absolute bottom-3 left-3 bg-[#1c1c1c]/90 text-white text-[10px] font-bold 
                          px-3 py-1.5 rounded-full z-[1000] tracking-wide shadow-md backdrop-blur-sm">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </div>
        )}
      </div>

      <p className={theme.type.labelSm + ' pl-1'}>
        Click anywhere on map to set location
      </p>
    </div>
  )
}

export default MapPicker