// src/pages/EditDrone.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Loader2 } from 'lucide-react';
import { useProperty } from '../hooks/useProperties';
import { useDrones, useUpdateDrone } from '../hooks/useDrones';
import { theme } from '../theme';

const EditDrone = () => {
  const { id, droneId } = useParams();
  const navigate = useNavigate();

  const { data: propertyData, isLoading: propertyLoading } = useProperty(id);
  const { data: drones = [], isLoading: dronesLoading }    = useDrones(id);
  const updateMutation = useUpdateDrone();

  const [formData, setFormData] = useState({
    name: '', connection_string: '', grid_row: 0, grid_col: 0,
  });
  const [error,    setError]    = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const property  = propertyData?.property || propertyData || {};
  const laserGrid = property.laser_grid || {};
  const xLasers   = laserGrid.x_lasers ?? property.x_lasers ?? 3;
  const yLasers   = laserGrid.y_lasers ?? property.y_lasers ?? 8;
  const maxRows   = Math.max(0, yLasers - 1);
  const maxCols   = Math.max(0, xLasers - 1);
  const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i);
  const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i);

  useEffect(() => {
    if (drones.length > 0 && droneId && !isLoaded) {
      const drone = drones.find(d => String(d.id) === String(droneId));
      if (drone) {
        setFormData({
          name:              drone.name || '',
          connection_string: drone.connection_string || '',
          grid_row:          drone.home_cell?.row ?? 0,
          grid_col:          drone.home_cell?.col ?? 0,
        });
        setIsLoaded(true);
      }
    }
  }, [drones, droneId, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateMutation.mutateAsync({
        droneId,
        propertyId: id,
        data: {
          name:              formData.name,
          connection_string: formData.connection_string,
          home_cell: {
            row: Number(formData.grid_row),
            col: Number(formData.grid_col),
          },
        },
      });
      navigate(`/property/${id}/drones`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update drone');
    }
  };

  if (propertyLoading || dronesLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  if (!property) {
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

  if (isLoaded && !drones.some(d => String(d.id) === String(droneId))) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Drone not found</p>
          <button onClick={() => navigate(`/property/${id}/drones`)} className={theme.type.link}>
            Back to Drones
          </button>
        </div>
      </div>
    );
  }

  const busy = updateMutation.isPending;
  const inp  = theme.input.base;
  const lbl  = theme.input.label;

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={theme.type.h3}>Edit Drone</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">

        {error && <div className={theme.alert.error}>{error}</div>}

        {/* Grid info pill */}
        <div className={theme.card.muted}>
          <p className={theme.type.bodySm}>
            Property Grid:{' '}
            <span className="font-bold text-[#1c1c1c]">{xLasers}</span>
            {' '}×{' '}
            <span className="font-bold text-[#1c1c1c]">{yLasers}</span>
            {' '}lasers
            <span className="text-gray-400 ml-2">
              ({maxCols + 1} × {maxRows + 1} cells)
            </span>
          </p>
        </div>

        {/* Drone name */}
        <div className={theme.form.group}>
          <label className={lbl}>Drone Name *</label>
          <input
            type="text" placeholder="e.g., Eagle 1"
            className={inp}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required disabled={busy}
          />
        </div>

        {/* Connection string */}
        <div className={theme.form.group}>
          <label className={lbl}>MAVLink Connection String *</label>
          <input
            type="text" placeholder="e.g., udp://:14540"
            className={inp}
            value={formData.connection_string}
            onChange={(e) => setFormData({ ...formData, connection_string: e.target.value })}
            required disabled={busy}
          />
        </div>

        {/* Grid location */}
        <div className={theme.card.muted}>
          <h3 className="font-sans text-sm font-black text-[#1c1c1c]
                         mb-4 flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-[#c5a880]" />
            Home Location
          </h3>

          <div className={theme.form.row}>
            <div className={theme.form.group}>
              <label className={lbl}>Row (0–{maxRows})</label>
              <select className={inp}
                value={formData.grid_row}
                onChange={(e) => setFormData({ ...formData, grid_row: Number(e.target.value) })}
                disabled={busy}>
                {rowOptions.map(r => (
                  <option key={r} value={r}>Row {r}</option>
                ))}
              </select>
            </div>
            <div className={theme.form.group}>
              <label className={lbl}>Column (0–{maxCols})</label>
              <select className={inp}
                value={formData.grid_col}
                onChange={(e) => setFormData({ ...formData, grid_col: Number(e.target.value) })}
                disabled={busy}>
                {colOptions.map(c => (
                  <option key={c} value={c}>Col {c}</option>
                ))}
              </select>
            </div>
          </div>

          <p className={`${theme.type.labelSm} mt-3`}>
            Current: Row {formData.grid_row}, Col {formData.grid_col}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
                  disabled={busy} className={theme.button.secondary}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.name || !formData.connection_string || busy}
            className={`${theme.button.primary} flex-1`}
          >
            {busy
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              : 'Update Drone'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditDrone;