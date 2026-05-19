// // src/pages/AddProperty.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
// import MapPicker from '../components/MapPicker';
// import { useCreateProperty } from '../hooks/useProperties';
// import { theme } from '../theme';

// const AddProperty = () => {
//   const navigate = useNavigate();
//   const createMutation = useCreateProperty();
  
//   const [formData, setFormData] = useState({
//     name: '', address: '', laserX: 3, laserY: 8, boxWidth: 2.0, boxLength: 0.6, gridHeight: 2.4,
//   });
//   const [position, setPosition] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!position) { setError('Please select a location on the map'); return; }

//     try {
//       await createMutation.mutateAsync({
//         name: formData.name,
//         address: formData.address,
//         latitude: position.lat,
//         longitude: position.lng,
//         laser_grid: {
//           x_lasers: Number(formData.laserX),
//           y_lasers: Number(formData.laserY),
//           box_width: Number(formData.boxWidth),
//           box_length: Number(formData.boxLength),
//           grid_height: Number(formData.gridHeight),
//         }
//       });
//       navigate('/properties');
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to create property');
//     }
//   };

//   const inp = theme.input.base;
//   const lbl = theme.input.label;
//   const busy = createMutation.isPending;

//   return (
//     <div className={theme.page.wrapper}>
//       <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
//         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <h2 className={theme.type.h3}>Add New Property</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="p-5 space-y-5 pb-24">
//         {error && <div className={theme.alert.error}>{error}</div>}

//         <div className={theme.form.group}>
//           <label className={lbl}>Property Name *</label>
//           <input type="text" placeholder="e.g., Ali's Warehouse" className={inp} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required disabled={busy} />
//         </div>

//         <div className={theme.form.group}>
//           <label className={lbl}>Address</label>
//           <input type="text" placeholder="e.g., 123 Main St, Anytown" className={inp} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} disabled={busy} />
//         </div>

//         <div className={theme.card.muted}>
//           <h3 className={`${theme.type.h4} mb-4`}>Laser Grid Setup</h3>
          
//           <div className={`${theme.form.row} mb-4`}>
//             <div className={theme.form.group}>
//               <label className={lbl}>X (Lasers)</label>
//               <input type="number" min="2" className={inp} value={formData.laserX} onChange={(e) => setFormData({...formData, laserX: e.target.value})} required disabled={busy} />
//             </div>
//             <div className={theme.form.group}>
//               <label className={lbl}>Y (Lasers)</label>
//               <input type="number" min="2" className={inp} value={formData.laserY} onChange={(e) => setFormData({...formData, laserY: e.target.value})} required disabled={busy} />
//             </div>
//           </div>

//           <div className={`${theme.form.row} mb-4`}>
//             <div className={theme.form.group}>
//               <label className={lbl}>Box Width (m)</label>
//               <input type="number" min="1" step="0.1" className={inp} value={formData.boxWidth} onChange={(e) => setFormData({...formData, boxWidth: e.target.value})} required disabled={busy} />
//             </div>
//             <div className={theme.form.group}>
//               <label className={lbl}>Box Length (m)</label>
//               <input type="number" min="1" step="0.1" className={inp} value={formData.boxLength} onChange={(e) => setFormData({...formData, boxLength: e.target.value})} required disabled={busy} />
//             </div>
//           </div>

//           <div className={theme.form.group}>
//             <label className={lbl}>Grid Height (m)</label>
//             <input type="number" min="0.5" step="0.1" className={inp} value={formData.gridHeight} onChange={(e) => setFormData({...formData, gridHeight: e.target.value})} required disabled={busy} />
//           </div>
//         </div>

//         <div className={theme.form.group}>
//           <label className={`${lbl} flex items-center gap-2`}>
//             <MapPin className="w-4 h-4 text-[#c5a880]" /> Location *
//           </label>
//           <MapPicker position={position} setPosition={setPosition} />
//           {!position && <p className={theme.type.error}>Please select a location on the map</p>}
//         </div>

//         <button type="submit" disabled={!formData.name || !position || busy} className={`${theme.button.primary} ${theme.button.full}`}>
//           {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Property'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProperty;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Building2, LayoutGrid } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import { useCreateProperty } from '../hooks/useProperties';
import { theme } from '../theme';

const AddProperty = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProperty();
  
  const [formData, setFormData] = useState({
    name: '', address: '', laserX: 3, laserY: 8, boxWidth: 2.0, boxLength: 0.6, gridHeight: 2.4,
  });
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!position) { setError('Please select a location on the map'); return; }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        latitude: position.lat,
        longitude: position.lng,
        laser_grid: {
          x_lasers: Number(formData.laserX),
          y_lasers: Number(formData.laserY),
          box_width: Number(formData.boxWidth),
          box_length: Number(formData.boxLength),
          grid_height: Number(formData.gridHeight),
        }
      });
      navigate('/properties');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create property');
    }
  };

  const inp = theme.input.base;
  const lbl = theme.input.label;
  const busy = createMutation.isPending;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header section matches image_3c1b96.png styling */}
      <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className={theme.header.title}>Add New Property</h2>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className={theme.alert.error}>{error}</div>}

          {/* Core Info Card - Light Beige Card Style */}
          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">General Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={theme.form.group}>
                <label className={lbl}>Property Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Ali's Warehouse" 
                  className={inp} 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  disabled={busy} 
                />
              </div>

              <div className={theme.form.group}>
                <label className={lbl}>Address</label>
                <input 
                  type="text" 
                  placeholder="e.g., 123 Main St, Anytown" 
                  className={inp} 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  disabled={busy} 
                />
              </div>
            </div>
          </section>

          {/* Laser Grid Setup - Two Column Desktop Layout */}
          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
              <LayoutGrid className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Laser Grid Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className={theme.form.group}>
                <label className={lbl}>X (Lasers)</label>
                <input type="number" min="2" className={inp} value={formData.laserX} onChange={(e) => setFormData({...formData, laserX: e.target.value})} required disabled={busy} />
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Y (Lasers)</label>
                <input type="number" min="2" className={inp} value={formData.laserY} onChange={(e) => setFormData({...formData, laserY: e.target.value})} required disabled={busy} />
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Box Width (m)</label>
                <input type="number" min="1" step="0.1" className={inp} value={formData.boxWidth} onChange={(e) => setFormData({...formData, boxWidth: e.target.value})} required disabled={busy} />
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Box Length (m)</label>
                <input type="number" min="1" step="0.1" className={inp} value={formData.boxLength} onChange={(e) => setFormData({...formData, boxLength: e.target.value})} required disabled={busy} />
              </div>
              <div className={theme.form.group}>
                <label className={lbl}>Grid Height (m)</label>
                <input type="number" min="0.5" step="0.1" className={inp} value={formData.gridHeight} onChange={(e) => setFormData({...formData, gridHeight: e.target.value})} required disabled={busy} />
              </div>
            </div>
          </section>

          {/* Location Card */}
          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-4 text-[#c5a880]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-xs">Geographical Location</h3>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-[#e6e3db]">
              <MapPicker position={position} setPosition={setPosition} />
            </div>
            {!position && <p className={`${theme.type.error} mt-2`}>Please select a location on the map to continue</p>}
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className={theme.button.secondary}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!formData.name || !position || busy} 
              className={`${theme.button.primary} px-12`}
            >
              {busy ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</> : 'Create Property'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProperty;