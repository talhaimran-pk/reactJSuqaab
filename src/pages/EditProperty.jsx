// src/pages/EditProperty.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trash2, Loader2, Video, Navigation, Users } from 'lucide-react';
import { useProperty, useUpdateProperty, useDeleteProperty } from '../hooks/useProperties';
import { useCameras } from '../hooks/useCameras';
import { useDrones } from '../hooks/useDrones';
import MapPicker from '../components/MapPicker';
import { theme } from '../theme';

const EditProperty = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const { data: propertyData, isLoading: propertyLoading } = useProperty(id);
  const { data: cameras = [] } = useCameras(id);
  const { data: drones  = [] } = useDrones(id);
  const [peopleCount, setPeopleCount] = useState(0);

  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  const [formData, setFormData] = useState({
    name: '', address: '',
    laserX: 3, laserY: 8,
    boxWidth: 2.0, boxLength: 0.6, gridHeight: 2.4,
  });
  const [position, setPosition] = useState(null);
  const [error,    setError]    = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch people
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/settings/${id}/people`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPeopleCount(data.people?.length || 0);
        }
      } catch { /* silent */ }
    };
    if (id) fetchPeople();
  }, [id]);

  // Pre-fill form
  useEffect(() => {
    if (propertyData && !isLoaded) {
      const p  = propertyData?.property || propertyData || {};
      const lg = p.laser_grid || {};
      setFormData({
        name:       p.name     || '',
        address:    p.address  || '',
        laserX:     lg.x_lasers  ?? p.x_lasers  ?? 3,
        laserY:     lg.y_lasers  ?? p.y_lasers  ?? 8,
        boxWidth:   lg.box_width ?? p.box_width ?? 2.0,
        boxLength:  lg.box_length ?? p.box_length ?? 0.6,
        gridHeight: lg.grid_height ?? p.grid_height ?? 2.4,
      });
      if (p.latitude && p.longitude) {
        setPosition({ lat: p.latitude, lng: p.longitude });
      }
      setIsLoaded(true);
    }
  }, [propertyData, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!position) { setError('Please select a location on the map'); return; }
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: formData.name,
          address: formData.address,
          latitude: position.lat,
          longitude: position.lng,
          laser_grid: {
            x_lasers:    Number(formData.laserX),
            y_lasers:    Number(formData.laserY),
            box_width:   Number(formData.boxWidth),
            box_length:  Number(formData.boxLength),
            grid_height: Number(formData.gridHeight),
          },
        },
      });
      navigate(`/property/${id}/settings`);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to update property');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    setError('');
    try {
      await deleteMutation.mutateAsync(id);
      navigate('/properties');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete property');
    }
  };

  // ── Loading / error guards ────────────────
  if (propertyLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }
  if (!propertyData) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Property not found</p>
          <button onClick={() => navigate('/properties')} className={theme.type.link}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const busy = updateMutation.isPending || deleteMutation.isPending;

  // Shared input class for this form (dark bg not needed — use theme.input.base)
  const inp = theme.input.base;
  const lbl = theme.input.label;

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={theme.type.h3}>Edit Property</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">

        {error && <div className={theme.alert.error}>{error}</div>}

        {/* Name */}
        <div className={theme.form.group}>
          <label className={lbl}>Property Name *</label>
          <input
            type="text" placeholder="e.g., Ali's Warehouse"
            className={inp}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required disabled={busy}
          />
        </div>

        {/* Address */}
        <div className={theme.form.group}>
          <label className={lbl}>Address</label>
          <input
            type="text" placeholder="e.g., 123 Main St"
            className={inp}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={busy}
          />
        </div>

        {/* Laser grid */}
        <div className={theme.card.muted}>
          <h3 className={`${theme.type.h4} mb-4`}>Laser Grid Setup</h3>

          <div className={`${theme.form.row} mb-4`}>
            <div className={theme.form.group}>
              <label className={lbl}>X Lasers</label>
              <input type="number" min="2" className={inp}
                value={formData.laserX}
                onChange={(e) => setFormData({ ...formData, laserX: e.target.value })}
                required disabled={busy} />
            </div>
            <div className={theme.form.group}>
              <label className={lbl}>Y Lasers</label>
              <input type="number" min="2" className={inp}
                value={formData.laserY}
                onChange={(e) => setFormData({ ...formData, laserY: e.target.value })}
                required disabled={busy} />
            </div>
          </div>

          <div className={`${theme.form.row} mb-4`}>
            <div className={theme.form.group}>
              <label className={lbl}>Box Width (m)</label>
              <input type="number" min="1" step="0.1" className={inp}
                value={formData.boxWidth}
                onChange={(e) => setFormData({ ...formData, boxWidth: e.target.value })}
                required disabled={busy} />
            </div>
            <div className={theme.form.group}>
              <label className={lbl}>Box Length (m)</label>
              <input type="number" min="1" step="0.1" className={inp}
                value={formData.boxLength}
                onChange={(e) => setFormData({ ...formData, boxLength: e.target.value })}
                required disabled={busy} />
            </div>
          </div>

          <div className={theme.form.group}>
            <label className={lbl}>Grid Height (m)</label>
            <input type="number" min="0.5" step="0.1" className={inp}
              value={formData.gridHeight}
              onChange={(e) => setFormData({ ...formData, gridHeight: e.target.value })}
              required disabled={busy} />
          </div>
        </div>

        {/* Location */}
        <div className={theme.form.group}>
          <label className={`${lbl} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-[#c5a880]" />
            Location *
          </label>
          <MapPicker position={position} setPosition={setPosition} />
          {!position && (
            <p className={theme.type.error}>Please select a location on the map</p>
          )}
        </div>

        {/* Stats */}
        <div className={theme.card.base}>
          <h3 className={`${theme.type.h4} mb-4`}>Property Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: cameras.length, color: 'text-[#c5a880]',   icon: Video,      label: 'Cameras' },
              { value: drones.length,  color: 'text-emerald-500', icon: Navigation, label: 'Drones'  },
              { value: peopleCount,    color: 'text-[#1c1c1c]',   icon: Users,      label: 'People'  },
            ].map(({ value, color, icon: Icon, label }) => (
              <div key={label}>
                <div className={`font-sans text-2xl font-black ${color}`}>{value}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Icon className="w-3 h-3 text-gray-400" />
                  <span className={theme.type.labelSm}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
                  disabled={busy} className={theme.button.secondary}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.name || !position || busy}
            className={`${theme.button.primary} flex-1`}
          >
            {updateMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : 'Save Changes'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="pt-6 border-t border-[#e6e3db]">
          <h3 className="font-sans text-sm font-bold text-red-500 mb-1">Danger Zone</h3>
          <p className={`${theme.type.bodySm} mb-4`}>
            Once deleted, this property and all its data cannot be recovered.
          </p>
          <button
            type="button" onClick={handleDelete}
            disabled={busy}
            className={`${theme.button.danger} ${theme.button.full}`}
          >
            {deleteMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
              : <><Trash2 className="h-4 w-4" /> Delete Property</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProperty;