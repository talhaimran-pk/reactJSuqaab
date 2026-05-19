// // src/pages/AddDrone.jsx
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Grid3X3, Loader2 } from 'lucide-react';
// import { useProperty } from '../hooks/useProperties';
// import { useCreateDrone } from '../hooks/useDrones';
// import { theme } from '../theme';

// const AddDrone = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data: propertyData, isLoading: propertyLoading } = useProperty(id);
//   const createMutation = useCreateDrone();
  
//   const [formData, setFormData] = useState({ name: '', connection_string: '', grid_row: 0, grid_col: 0 });
//   const [error, setError] = useState('');

//   const property = propertyData?.property || propertyData || {};
//   const laserGrid = property.laser_grid || {};
//   const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3;
//   const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8;
//   const maxRows = Math.max(0, yLasers - 1);
//   const maxCols = Math.max(0, xLasers - 1);

//   const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i);
//   const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await createMutation.mutateAsync({
//         propertyId: id,
//         data: {
//           name: formData.name,
//           connection_string: formData.connection_string,
//           home_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) }
//         }
//       });
//       navigate(`/property/${id}/drones`);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to create drone');
//     }
//   };

//   if (propertyLoading) {
//     return (
//       <div className={theme.page.centered}>
//         <div className={theme.ui.spinner} />
//       </div>
//     );
//   }

//   const inp = theme.input.base;
//   const lbl = theme.input.label;
//   const busy = createMutation.isPending;

//   return (
//     <div className={theme.page.wrapper}>
//       <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
//         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <h2 className={theme.type.h3}>Add New Drone</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="p-5 space-y-5 pb-24">
//         {error && <div className={theme.alert.error}>{error}</div>}

//         <div className={theme.card.muted}>
//           <p className={theme.type.bodySm}>
//             Property Grid: <span className="font-bold text-[#1c1c1c]">{xLasers}</span> × <span className="font-bold text-[#1c1c1c]">{yLasers}</span> lasers
//             <span className="text-gray-400 ml-2">({maxCols + 1} × {maxRows + 1} cells)</span>
//           </p>
//         </div>

//         <div className={theme.form.group}>
//           <label className={lbl}>Drone Name *</label>
//           <input type="text" placeholder="e.g., Eagle 1" className={inp} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required disabled={busy} />
//         </div>

//         <div className={theme.form.group}>
//           <label className={lbl}>MAVLink Connection String *</label>
//           <input type="text" placeholder="e.g., udp://:14540 or tcp:192.168.1.10:5760" className={`${inp} font-mono`} value={formData.connection_string} onChange={(e) => setFormData({...formData, connection_string: e.target.value})} required disabled={busy} />
//           <p className={`${theme.type.labelSm} mt-2`}>Common: udp://:14540, tcp:192.168.1.10:5760</p>
//         </div>

//         <div className={theme.card.muted}>
//           <h3 className="font-sans text-sm font-black text-[#1c1c1c] mb-4 flex items-center gap-2">
//             <Grid3X3 className="w-4 h-4 text-[#c5a880]" /> Home Location
//           </h3>
//           <div className={theme.form.row}>
//             <div className={theme.form.group}>
//               <label className={lbl}>Row (0–{maxRows})</label>
//               <select className={inp} value={formData.grid_row} onChange={(e) => setFormData({...formData, grid_row: Number(e.target.value)})} disabled={busy}>
//                 {rowOptions.map(row => <option key={row} value={row}>Row {row}</option>)}
//               </select>
//             </div>
//             <div className={theme.form.group}>
//               <label className={lbl}>Column (0–{maxCols})</label>
//               <select className={inp} value={formData.grid_col} onChange={(e) => setFormData({...formData, grid_col: Number(e.target.value)})} disabled={busy}>
//                 {colOptions.map(col => <option key={col} value={col}>Col {col}</option>)}
//               </select>
//             </div>
//           </div>
//         </div>

//         <button type="submit" disabled={!formData.name || !formData.connection_string || busy} className={`${theme.button.primary} ${theme.button.full}`}>
//           {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Drone'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddDrone;

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Loader2, Radio, Info } from 'lucide-react';
import { useProperty } from '../hooks/useProperties';
import { useCreateDrone } from '../hooks/useDrones';
import { theme } from '../theme';

const AddDrone = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: propertyData, isLoading: propertyLoading } = useProperty(id);
  const createMutation = useCreateDrone();
  
  const [formData, setFormData] = useState({ name: '', connection_string: '', grid_row: 0, grid_col: 0 });
  const [error, setError] = useState('');

  const property = propertyData?.property || propertyData || {};
  const laserGrid = property.laser_grid || {};
  const xLasers = laserGrid.x_lasers ?? property.x_lasers ?? 3;
  const yLasers = laserGrid.y_lasers ?? property.y_lasers ?? 8;
  const maxRows = Math.max(0, yLasers - 1);
  const maxCols = Math.max(0, xLasers - 1);

  const rowOptions = Array.from({ length: maxRows + 1 }, (_, i) => i);
  const colOptions = Array.from({ length: maxCols + 1 }, (_, i) => i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        propertyId: id,
        data: {
          name: formData.name,
          connection_string: formData.connection_string,
          home_cell: { row: Number(formData.grid_row), col: Number(formData.grid_col) }
        }
      });
      navigate(`/property/${id}/drones`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create drone');
    }
  };

  if (propertyLoading) return <div className={theme.page.centered}><div className={theme.ui.spinner} /></div>;

  const inp = theme.input.base;
  const lbl = theme.input.label;
  const busy = createMutation.isPending;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}><ArrowLeft className="h-5 w-5" /></button>
          <h2 className={theme.header.title}>Add New Drone</h2>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className={theme.alert.error}>{error}</div>}

          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
              <Radio className="w-5 h-5" />
              {/* <h3 className="font-bold uppercase tracking-widest text-xs">Unit Specifications</h3> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={theme.form.group}>
                <label className={lbl}>Drone Name *</label>
                <input type="text" placeholder="e.g., Falcon-01" className={inp} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required disabled={busy} />
              </div>

              <div className={theme.form.group}>
                <label className={lbl}>MAVLink Connection String *</label>
                <input type="text" placeholder="udp://:14540" className={`${inp} font-mono`} value={formData.connection_string} onChange={(e) => setFormData({...formData, connection_string: e.target.value})} required disabled={busy} />
                {/* <p className="text-[10px] text-gray-400 mt-2 italic text-right">Supports UDP or TCP protocols</p> */}
              </div>
            </div>
          </section>

          <section className={theme.card.base}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-[#c5a880]">
                <Grid3X3 className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">Launch/Home Location</h3>
              </div>
              <div className="bg-[#faf9f6] px-3 py-1 rounded-full border border-[#e6e3db] flex items-center gap-2">
                <Info className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500 font-bold">GRID SIZE: {maxCols + 1}×{maxRows + 1}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className={theme.form.group}>
                <label className={lbl}>Home Row</label>
                <select className={inp} value={formData.grid_row} onChange={(e) => setFormData({...formData, grid_row: Number(e.target.value)})} disabled={busy}>
                  {rowOptions.map(row => <option key={row} value={row}>Row {row}</option>)}
                </select>
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Home Column</label>
                <select className={inp} value={formData.grid_col} onChange={(e) => setFormData({...formData, grid_col: Number(e.target.value)})} disabled={busy}>
                  {colOptions.map(col => <option key={col} value={col}>Column {col}</option>)}
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className={theme.button.secondary}>Discard</button>
            <button type="submit" disabled={!formData.name || !formData.connection_string || busy} className={`${theme.button.primary} px-12`}>
              {busy ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Save Drone'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddDrone;