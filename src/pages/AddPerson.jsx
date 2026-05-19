// // // // // // src/pages/AddPerson.jsx
// // // // // import { useState } from 'react';
// // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle } from 'lucide-react';
// // // // // import { useCreatePerson, useRelationships } from '../hooks/usePeople';
// // // // // import { peopleApi } from '../api/people';
// // // // // import { theme } from '../theme';

// // // // // const AddPerson = () => {
// // // // //   const { id } = useParams();
// // // // //   const navigate = useNavigate();
// // // // //   const createMutation = useCreatePerson();
// // // // //   const { data: roles = [] } = useRelationships();

// // // // //   const [formData, setFormData] = useState({ name: '', role: 'Guest' });
// // // // //   const [photos, setPhotos] = useState([
// // // // //     { type: 'Front Face', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // // //     { type: 'Left Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // // //     { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // // //   ]);
// // // // //   const [error, setError] = useState('');
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // // //   const handleFileUpload = async (index, event) => {
// // // // //     const file = event.target.files[0];
// // // // //     if (!file) return;
// // // // //     const reader = new FileReader();
// // // // //     reader.onload = (e) => {
// // // // //       setPhotos(prev => prev.map((p, i) => i === index ? { ...p, file, preview: e.target.result, uploading: true, uploadedUrl: null } : p));
// // // // //     };
// // // // //     reader.readAsDataURL(file);
// // // // //     try {
// // // // //       const result = await peopleApi.uploadPhoto(file);
// // // // //       setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p));
// // // // //     } catch {
// // // // //       setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false } : p));
// // // // //       setError(`Failed to upload photo`);
// // // // //     }
// // // // //   };

// // // // //   const removePhoto = (index) => setPhotos(prev => prev.map((p, i) => i === index ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false } : p));

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     setError('');
// // // // //     const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
// // // // //     if (uploadedPhotos.length < 3) { setError('All 3 photos required.'); return; }
// // // // //     if (photos.some(p => p.uploading)) { setError('Wait for uploads to finish'); return; }

// // // // //     setIsSubmitting(true);
// // // // //     try {
// // // // //       await createMutation.mutateAsync({
// // // // //         propertyId: id,
// // // // //         data: { name: formData.name, role: formData.role, photo_urls: uploadedPhotos.map(p => p.uploadedUrl) },
// // // // //       });
// // // // //       navigate(`/property/${id}/people`);
// // // // //     } catch (err) {
// // // // //       setError(err.response?.data?.detail || 'Failed to create person');
// // // // //     } finally {
// // // // //       setIsSubmitting(false);
// // // // //     }
// // // // //   };

// // // // //   const uploadedCount = photos.filter(p => p.uploadedUrl).length;
// // // // //   const uploadingCount = photos.filter(p => p.uploading).length;
// // // // //   const busy = isSubmitting;
// // // // //   const inp = theme.input.base;
// // // // //   const lbl = theme.input.label;

// // // // //   const slotConfig = [
// // // // //     { label: 'Front Face', icon: '👤', hint: 'Look straight' },
// // // // //     { label: 'Left Profile', icon: '👈', hint: 'Turn right' },
// // // // //     { label: 'Right Profile', icon: '👉', hint: 'Turn left' },
// // // // //   ];

// // // // //   return (
// // // // //     <div className={theme.page.wrapper}>
// // // // //       <div className="bg-white border-b border-[#e6e3db] px-4 py-4 flex items-center gap-3 shadow-sm">
// // // // //         <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// // // // //           <ArrowLeft className="h-5 w-5" />
// // // // //         </button>
// // // // //         <h2 className={theme.type.h3}>Add Person</h2>
// // // // //       </div>

// // // // //       <form onSubmit={handleSubmit} className="p-5 space-y-5 pb-24">
// // // // //         {error && <div className={theme.alert.error}>{error}</div>}

// // // // //         <div className={theme.form.group}>
// // // // //           <label className={lbl}>Full Name *</label>
// // // // //           <input type="text" placeholder="e.g., Sarah Smith" className={inp} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={busy} />
// // // // //         </div>

// // // // //         <div className={theme.form.group}>
// // // // //           <label className={lbl}>Role</label>
// // // // //           <select className={inp} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={busy}>
// // // // //             {roles.map((r) => <option key={r} value={r}>{r}</option>)}
// // // // //           </select>
// // // // //         </div>

// // // // //         <div>
// // // // //           <label className={`${lbl} mb-3`}>Face Photos ({uploadedCount}/3)</label>
// // // // //           <div className="grid grid-cols-3 gap-3">
// // // // //             {photos.map((photo, idx) => (
// // // // //               <div key={idx} className="flex flex-col gap-2">
// // // // //                 <div className="text-center">
// // // // //                   <span className="text-lg">{slotConfig[idx].icon}</span>
// // // // //                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a880] mt-1">{slotConfig[idx].label}</p>
// // // // //                 </div>

// // // // //                 <div className={`relative ${theme.card.muted} h-36 flex items-center justify-center overflow-hidden group p-0`}>
// // // // //                   {photo.preview ? (
// // // // //                     <>
// // // // //                       <img src={photo.preview} alt={photo.type} className="w-full h-full object-cover rounded-[1.5rem]" />
// // // // //                       {photo.uploading && (
// // // // //                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-[1.5rem]">
// // // // //                           <div className={theme.ui.spinner} />
// // // // //                         </div>
// // // // //                       )}
// // // // //                       {photo.uploadedUrl && !photo.uploading && (
// // // // //                         <div className="absolute top-2 left-2 bg-emerald-500 rounded-full p-0.5">
// // // // //                           <CheckCircle className="w-3 h-3 text-white" />
// // // // //                         </div>
// // // // //                       )}
// // // // //                       <button type="button" onClick={() => removePhoto(idx)} disabled={busy} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors">
// // // // //                         <X className="w-3 h-3" />
// // // // //                       </button>
// // // // //                       <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-[1.5rem] flex items-center justify-center cursor-pointer">
// // // // //                         <div className={`${theme.button.primary} ${theme.button.sm}`}>
// // // // //                           <Upload className="w-4 h-4" />
// // // // //                         </div>
// // // // //                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(idx, e)} disabled={busy} />
// // // // //                       </label>
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-[#e6e3db] transition rounded-[1.5rem]">
// // // // //                       <Upload className="h-6 w-6 text-gray-300 mb-1" />
// // // // //                       <span className={theme.type.labelSm}>{slotConfig[idx].hint}</span>
// // // // //                       <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(idx, e)} disabled={busy} />
// // // // //                     </label>
// // // // //                   )}
// // // // //                 </div>
// // // // //               </div>
// // // // //             ))}
// // // // //           </div>

// // // // //           <div className={`${theme.card.muted} mt-4 flex items-center gap-2`}>
// // // // //             <Camera className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
// // // // //             <p className={theme.type.labelSm}>All 3 angles are required for accurate recognition.</p>
// // // // //           </div>
// // // // //         </div>

// // // // //         <button type="submit" disabled={uploadedCount < 3 || !formData.name || busy || uploadingCount > 0} className={`${theme.button.primary} ${theme.button.full}`}>
// // // // //           {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : `Save Person (${uploadedCount}/3)`}
// // // // //         </button>
// // // // //       </form>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AddPerson;

// // // // import { useState } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle, UserPlus } from 'lucide-react';
// // // // import { useCreatePerson, useRelationships } from '../hooks/usePeople';
// // // // import { peopleApi } from '../api/people';
// // // // import { theme } from '../theme';

// // // // const AddPerson = () => {
// // // //   const { id } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const createMutation = useCreatePerson();
// // // //   const { data: roles = [] } = useRelationships();

// // // //   const [formData, setFormData] = useState({ name: '', role: 'Guest' });
// // // //   const [photos, setPhotos] = useState([
// // // //     { type: 'Front Face', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // //     { type: 'Left Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // //     { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// // // //   ]);
// // // //   const [error, setError] = useState('');
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // //   const handleFileUpload = async (index, event) => {
// // // //     const file = event.target.files[0];
// // // //     if (!file) return;
// // // //     setPhotos(prev => prev.map((p, i) => i === index ? { ...p, file, preview: URL.createObjectURL(file), uploading: true } : p));
// // // //     try {
// // // //       const result = await peopleApi.uploadPhoto(file);
// // // //       setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p));
// // // //     } catch {
// // // //       setPhotos(prev => prev.map((p, i) => i === index ? { ...p, uploading: false, preview: null } : p));
// // // //       setError(`Failed to upload photo`);
// // // //     }
// // // //   };

// // // //   const removePhoto = (index) => setPhotos(prev => prev.map((p, i) => i === index ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false } : p));

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
// // // //     if (uploadedPhotos.length < 3) { setError('All 3 angles are requiredV.'); return; }
    
// // // //     setIsSubmitting(true);
// // // //     try {
// // // //       await createMutation.mutateAsync({
// // // //         propertyId: id,
// // // //         data: { name: formData.name, role: formData.role, photo_urls: uploadedPhotos.map(p => p.uploadedUrl) },
// // // //       });
// // // //       navigate(`/property/${id}/people`);
// // // //     } catch (err) {
// // // //       setError(err.response?.data?.detail || 'Failed to register person');
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const slotConfig = [
// // // //     { label: 'Front View', icon: '👤', hint: 'Upload' },
// // // //     { label: 'Left Profile', icon: '👈', hint: 'Upload' },
// // // //     { label: 'Right Profile', icon: '👉', hint: 'Upload' },
// // // //   ];

// // // //   const inp = theme.input.base;
// // // //   const lbl = theme.input.label;

// // // //   return (
// // // //     <div className="min-h-screen bg-[#faf9f6]">
// // // //       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
// // // //         <div className="flex items-center gap-4">
// // // //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}><ArrowLeft className="h-5 w-5" /></button>
// // // //           <h2 className={theme.header.title}>Add Authorized Person</h2>
// // // //         </div>
// // // //       </header>

// // // //       <main className="max-w-4xl mx-auto px-6 py-10">
// // // //         <form onSubmit={handleSubmit} className="space-y-8">
// // // //           {error && <div className={theme.alert.error}>{error}</div>}

// // // //           <section className={theme.card.base}>
// // // //             <div className="flex items-center gap-2 mb-6 text-[#c5a880]">
// // // //               <UserPlus className="w-5 h-5" />
// // // //               <h3 className="font-bold uppercase tracking-widest text-xs">Profile Details</h3>
// // // //             </div>
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // //               <div className={theme.form.group}>
// // // //                 <label className={lbl}>Full Name *</label>
// // // //                 <input type="text" placeholder="e.g., Sarah Smith" className={inp} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isSubmitting} />
// // // //               </div>
// // // //               <div className={theme.form.group}>
// // // //                 <label className={lbl}>Relationship / Role</label>
// // // //                 <select className={inp} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={isSubmitting}>
// // // //                   {roles.map((r) => <option key={r} value={r}>{r}</option>)}
// // // //                 </select>
// // // //               </div>
// // // //             </div>
// // // //           </section>

// // // //           <section className={theme.card.base}>
// // // //             <div className="flex items-center justify-between mb-6">
// // // //               <div className="flex items-center gap-2 text-[#c5a880]">
// // // //                 <Camera className="w-5 h-5" />
// // // //                 <h3 className="font-bold uppercase tracking-widest text-xs">Face Data Collection</h3>
// // // //               </div>
// // // //               <span className="text-[10px] font-bold text-gray-400 bg-[#faf9f6] px-3 py-1 rounded-full border border-[#e6e3db]">
// // // //                 REQUIRED: 3 ANGLES
// // // //               </span>
// // // //             </div>

// // // //             <div className="grid grid-cols-3 gap-6">
// // // //               {photos.map((photo, idx) => (
// // // //                 <div key={idx} className="flex flex-col gap-3">
// // // //                   <div className="text-center">
// // // //                     <span className="text-xl">{slotConfig[idx].icon}</span>
// // // //                     <p className="text-[10px] font-black uppercase tracking-tighter text-[#c5a880] mt-1">{slotConfig[idx].label}</p>
// // // //                   </div>

// // // //                   <div className={`relative aspect-[3/4] bg-[#faf9f6] border-2 border-dashed border-[#e6e3db] rounded-3xl flex items-center justify-center overflow-hidden transition-all group`}>
// // // //                     {photo.preview ? (
// // // //                       <>
// // // //                         <img src={photo.preview} alt={photo.type} className="w-full h-full object-cover" />
// // // //                         {photo.uploading && (
// // // //                           <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
// // // //                             <Loader2 className="w-6 h-6 animate-spin text-[#c5a880]" />
// // // //                           </div>
// // // //                         )}
// // // //                         {photo.uploadedUrl && (
// // // //                           <div className="absolute top-3 left-3 bg-emerald-500 rounded-full p-1 shadow-lg">
// // // //                             <CheckCircle className="w-3 h-3 text-white" />
// // // //                           </div>
// // // //                         )}
// // // //                         <button type="button" onClick={() => removePhoto(idx)} className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors">
// // // //                           <X className="w-4 h-4" />
// // // //                         </button>
// // // //                       </>
// // // //                     ) : (
// // // //                       <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-white transition-colors">
// // // //                         <Upload className="h-6 w-6 text-gray-300 mb-2" />
// // // //                         <span className="text-[10px] text-gray-400 font-medium">{slotConfig[idx].hint}</span>
// // // //                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(idx, e)} disabled={isSubmitting} />
// // // //                       </label>
// // // //                     )}
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </section>

// // // //           <div className="flex justify-end gap-4">
// // // //             <button type="button" onClick={() => navigate(-1)} className={theme.button.secondary}>Cancel</button>
// // // //             <button type="submit" disabled={photos.some(p => !p.uploadedUrl) || !formData.name || isSubmitting} className={`${theme.button.primary} px-12`}>
// // // //               {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</> : `Save Person`}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AddPerson;

// // // import { useState } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle, UserPlus } from 'lucide-react';
// // // import { useCreatePerson, useRelationships } from '../hooks/usePeople';
// // // import { peopleApi } from '../api/people';
// // // import { theme } from '../theme';

// // // const AddPerson = () => {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
// // //   const createMutation = useCreatePerson();
// // //   const { data: roles = [] } = useRelationships();

// // //   const [formData, setFormData] = useState({ name: '', role: 'Guest' });
// // //   const [photos, setPhotos] = useState([
// // //     { type: 'Front Face',    file: null, preview: null, uploadedUrl: null, uploading: false },
// // //     { type: 'Left Profile',  file: null, preview: null, uploadedUrl: null, uploading: false },
// // //     { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// // //   ]);
// // //   const [error, setError]           = useState('');
// // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // //   const handleFileUpload = async (index, event) => {
// // //     const file = event.target.files[0];
// // //     if (!file) return;
// // //     setPhotos(prev =>
// // //       prev.map((p, i) =>
// // //         i === index ? { ...p, file, preview: URL.createObjectURL(file), uploading: true } : p
// // //       )
// // //     );
// // //     try {
// // //       const result = await peopleApi.uploadPhoto(file);
// // //       setPhotos(prev =>
// // //         prev.map((p, i) =>
// // //           i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p
// // //         )
// // //       );
// // //     } catch {
// // //       setPhotos(prev =>
// // //         prev.map((p, i) =>
// // //           i === index ? { ...p, uploading: false, preview: null } : p
// // //         )
// // //       );
// // //       setError('Failed to upload photo');
// // //     }
// // //   };

// // //   const removePhoto = (index) =>
// // //     setPhotos(prev =>
// // //       prev.map((p, i) =>
// // //         i === index ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false } : p
// // //       )
// // //     );

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
// // //     if (uploadedPhotos.length < 3) {
// // //       setError('All 3 angles are required.');
// // //       return;
// // //     }
// // //     setIsSubmitting(true);
// // //     try {
// // //       await createMutation.mutateAsync({
// // //         propertyId: id,
// // //         data: {
// // //           name:       formData.name,
// // //           role:       formData.role,
// // //           photo_urls: uploadedPhotos.map(p => p.uploadedUrl),
// // //         },
// // //       });
// // //       navigate(`/property/${id}/people`);
// // //     } catch (err) {
// // //       setError(err.response?.data?.detail || 'Failed to register person');
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const slotConfig = [
// // //     { label: 'Front View',    icon: '👤' },
// // //     { label: 'Left Profile',  icon: '👈' },
// // //     { label: 'Right Profile', icon: '👉' },
// // //   ];

// // //   return (
// // //     <div className={theme.page.wrapper}>

// // //       {/* ── Header ─────────────────────────────── */}
// // //       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
// // //         <div className="flex items-center gap-4">
// // //           <button
// // //             onClick={() => navigate(-1)}
// // //             className={theme.ui.backBtn}
// // //           >
// // //             <ArrowLeft className="h-5 w-5" />
// // //           </button>
// // //           <h2 className={theme.header.title}>Add Authorized Person</h2>
// // //         </div>
// // //       </header>

// // //       {/* ── Main ───────────────────────────────── */}
// // //       <main className="max-w-4xl mx-auto px-6 py-10">
// // //         <form onSubmit={handleSubmit} className="space-y-8">

// // //           {/* Error alert */}
// // //           {error && (
// // //             <div className={theme.alert.error}>
// // //               {error}
// // //             </div>
// // //           )}

// // //           {/* ── Profile Details Card ────────────── */}
// // //           <section className={theme.card.base}>

// // //             {/* Section heading */}
// // //             <div className="flex items-center gap-2 mb-6">
// // //               <UserPlus className="w-5 h-5 text-[#c5a880]" />
// // //               <span className={theme.type.label}>Profile Details</span>
// // //             </div>

// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

// // //               {/* Full Name */}
// // //               <div className={theme.form.group}>
// // //                 <label className={theme.input.label}>Full Name *</label>
// // //                 <input
// // //                   type="text"
// // //                   placeholder="e.g., Sarah Smith"
// // //                   className={theme.input.base}
// // //                   value={formData.name}
// // //                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// // //                   required
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>

// // //               {/* Role */}
// // //               <div className={theme.form.group}>
// // //                 <label className={theme.input.label}>Relationship / Role</label>
// // //                 <select
// // //                   className={theme.input.base}
// // //                   value={formData.role}
// // //                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 >
// // //                   {roles.map((r) => (
// // //                     <option key={r} value={r}>{r}</option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //             </div>
// // //           </section>

// // //           {/* ── Face Data Collection Card ───────── */}
// // //           <section className={theme.card.base}>

// // //             {/* Section heading row */}
// // //             <div className="flex items-center justify-between mb-6">
// // //               <div className="flex items-center gap-2">
// // //                 <Camera className="w-5 h-5 text-[#c5a880]" />
// // //                 <span className={theme.type.label}>Face Data Collection</span>
// // //               </div>
// // //               <span className={`${theme.badge.outline} text-gray-400`}>
// // //                 REQUIRED · 3 ANGLES
// // //               </span>
// // //             </div>

// // //             {/* Photo slots */}
// // //             <div className="grid grid-cols-3 gap-6">
// // //               {photos.map((photo, idx) => (
// // //                 <div key={idx} className="flex flex-col gap-3">

// // //                   {/* Slot label */}
// // //                   <div className="text-center">
// // //                     <span className="text-xl">{slotConfig[idx].icon}</span>
// // //                     <p className={`${theme.type.label} mt-1`}>
// // //                       {slotConfig[idx].label}
// // //                     </p>
// // //                   </div>

// // //                   {/* Drop zone */}
// // //                   <div
// // //                     className={
// // //                       'relative aspect-[3/4] border-2 border-dashed border-[#e6e3db] ' +
// // //                       'bg-[#faf9f6] rounded-[2rem] flex items-center justify-center ' +
// // //                       'overflow-hidden transition-all group'
// // //                     }
// // //                   >
// // //                     {photo.preview ? (
// // //                       <>
// // //                         {/* Preview image */}
// // //                         <img
// // //                           src={photo.preview}
// // //                           alt={photo.type}
// // //                           className="w-full h-full object-cover"
// // //                         />

// // //                         {/* Uploading spinner overlay */}
// // //                         {photo.uploading && (
// // //                           <div className={theme.overlay.light}>
// // //                             <Loader2 className="w-6 h-6 animate-spin text-[#c5a880]" />
// // //                           </div>
// // //                         )}

// // //                         {/* Success badge */}
// // //                         {photo.uploadedUrl && (
// // //                           <div className="absolute top-3 left-3 bg-emerald-500 rounded-full p-1 shadow-lg">
// // //                             <CheckCircle className="w-3 h-3 text-white" />
// // //                           </div>
// // //                         )}

// // //                         {/* Remove button */}
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => removePhoto(idx)}
// // //                           className={
// // //                             'absolute top-3 right-3 bg-[#faf9f6]/90 hover:bg-red-50 ' +
// // //                             'text-red-500 w-8 h-8 rounded-full flex items-center ' +
// // //                             'justify-center shadow-md transition-colors border border-[#e6e3db]'
// // //                           }
// // //                         >
// // //                           <X className="w-4 h-4" />
// // //                         </button>
// // //                       </>
// // //                     ) : (
// // //                       /* Upload trigger */
// // //                       <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-[#f0ede8] transition-colors rounded-[2rem]">
// // //                         <Upload className="h-6 w-6 text-gray-300 mb-2" />
// // //                         <span className={theme.type.labelSm}>Upload</span>
// // //                         <input
// // //                           type="file"
// // //                           accept="image/*"
// // //                           className="hidden"
// // //                           onChange={(e) => handleFileUpload(idx, e)}
// // //                           disabled={isSubmitting}
// // //                         />
// // //                       </label>
// // //                     )}
// // //                   </div>

// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </section>

// // //           {/* ── Action Buttons ──────────────────── */}
// // //           <div className="flex justify-end gap-4">
// // //             <button
// // //               type="button"
// // //               onClick={() => navigate(-1)}
// // //               className={theme.button.secondary}
// // //             >
// // //               Cancel
// // //             </button>

// // //             <button
// // //               type="submit"
// // //               disabled={
// // //                 photos.some(p => !p.uploadedUrl) ||
// // //                 !formData.name ||
// // //                 isSubmitting
// // //               }
// // //               className={`${theme.button.primary} px-12`}
// // //             >
// // //               {isSubmitting ? (
// // //                 <>
// // //                   <Loader2 className="w-5 h-5 animate-spin" />
// // //                   Saving…
// // //                 </>
// // //               ) : (
// // //                 'Save Person'
// // //               )}
// // //             </button>
// // //           </div>

// // //         </form>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default AddPerson;

// // import { useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle, UserPlus } from 'lucide-react';
// // import { useCreatePerson, useRelationships } from '../hooks/usePeople';
// // import { peopleApi } from '../api/people';
// // import { theme } from '../theme';

// // const AddPerson = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const createMutation = useCreatePerson();
// //   const { data: roles = [] } = useRelationships();

// //   const [formData, setFormData] = useState({ name: '', role: 'Guest' });
// //   const [photos, setPhotos] = useState([
// //     { type: 'Front Face',    file: null, preview: null, uploadedUrl: null, uploading: false },
// //     { type: 'Left Profile',  file: null, preview: null, uploadedUrl: null, uploading: false },
// //     { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
// //   ]);
// //   const [error, setError]               = useState('');
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleFileUpload = async (index, event) => {
// //     const file = event.target.files[0];
// //     if (!file) return;
// //     setPhotos(prev =>
// //       prev.map((p, i) =>
// //         i === index ? { ...p, file, preview: URL.createObjectURL(file), uploading: true } : p
// //       )
// //     );
// //     try {
// //       const result = await peopleApi.uploadPhoto(file);
// //       setPhotos(prev =>
// //         prev.map((p, i) =>
// //           i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p
// //         )
// //       );
// //     } catch {
// //       setPhotos(prev =>
// //         prev.map((p, i) =>
// //           i === index ? { ...p, uploading: false, preview: null } : p
// //         )
// //       );
// //       setError('Failed to upload photo');
// //     }
// //   };

// //   const removePhoto = (index) =>
// //     setPhotos(prev =>
// //       prev.map((p, i) =>
// //         i === index
// //           ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false }
// //           : p
// //       )
// //     );

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
// //     if (uploadedPhotos.length < 3) {
// //       setError('All 3 angles are required.');
// //       return;
// //     }
// //     setIsSubmitting(true);
// //     try {
// //       await createMutation.mutateAsync({
// //         propertyId: id,
// //         data: {
// //           name:       formData.name,
// //           role:       formData.role,
// //           photo_urls: uploadedPhotos.map(p => p.uploadedUrl),
// //         },
// //       });
// //       navigate(`/property/${id}/people`);
// //     } catch (err) {
// //       setError(err.response?.data?.detail || 'Failed to register person');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const slotConfig = [
// //     { label: 'Front View',    icon: '👤' },
// //     { label: 'Left Profile',  icon: '👈' },
// //     { label: 'Right Profile', icon: '👉' },
// //   ];

// //   return (
// //     <div className={theme.page.wrapper}>

// //       {/* ── Header ─────────────────────────────── */}
// //       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
// //         <div className="flex items-center gap-4">
// //           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
// //             <ArrowLeft className="h-5 w-5" />
// //           </button>
// //           <h2 className={theme.header.title}>Add Authorized Person</h2>
// //         </div>
// //       </header>

// //       {/* ── Main ───────────────────────────────── */}
// //       <main className="max-w-3xl mx-auto px-6 py-8">
// //         <form onSubmit={handleSubmit} className="space-y-6">

// //           {/* Error alert */}
// //           {error && (
// //             <div className={theme.alert.error}>{error}</div>
// //           )}

// //           {/* ── Profile Details ─────────────────── */}
// //           <section className={theme.card.base}>
// //             <div className="flex items-center gap-2 mb-5">
// //               <UserPlus className="w-4 h-4 text-[#c5a880]" />
// //               <span className={theme.type.label}>Profile Details</span>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div className={theme.form.group}>
// //                 <label className={theme.input.label}>Full Name *</label>
// //                 <input
// //                   type="text"
// //                   placeholder="e.g., Sarah Smith"
// //                   className={theme.input.base}
// //                   value={formData.name}
// //                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                   required
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //               <div className={theme.form.group}>
// //                 <label className={theme.input.label}>Relationship / Role</label>
// //                 <select
// //                   className={theme.input.base}
// //                   value={formData.role}
// //                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
// //                   disabled={isSubmitting}
// //                 >
// //                   {roles.map((r) => (
// //                     <option key={r} value={r}>{r}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>
// //           </section>

// //           {/* ── Face Data Collection ────────────── */}
// //           <section className={theme.card.base}>

// //             {/* Heading row */}
// //             <div className="flex items-center justify-between mb-5">
// //               <div className="flex items-center gap-2">
// //                 <Camera className="w-4 h-4 text-[#c5a880]" />
// //                 <span className={theme.type.label}>Face Data Collection</span>
// //               </div>
// //               <span className={`${theme.badge.outline} text-gray-400`}>
// //                 3 ANGLES REQUIRED
// //               </span>
// //             </div>

// //             {/* ── Compact photo slots ─────────────
// //                  Each slot: square thumbnail on the left,
// //                  label + status on the right, upload CTA inline.
// //             ──────────────────────────────────────── */}
// //             <div className="flex flex-col gap-3">
// //               {photos.map((photo, idx) => (
// //                 <div
// //                   key={idx}
// //                   className={
// //                     'flex items-center gap-4 p-3 rounded-[1.25rem] ' +
// //                     'border border-[#e6e3db] bg-[#faf9f6]'
// //                   }
// //                 >
// //                   {/* Thumbnail / drop zone — fixed small square */}
// //                   <div className="relative w-14 h-14 flex-shrink-0 rounded-[0.875rem] overflow-hidden border border-[#e6e3db] bg-[#f0ede8]">
// //                     {photo.preview ? (
// //                       <>
// //                         <img
// //                           src={photo.preview}
// //                           alt={photo.type}
// //                           className="w-full h-full object-cover"
// //                         />

// //                         {/* Uploading spinner */}
// //                         {photo.uploading && (
// //                           <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
// //                             <Loader2 className="w-4 h-4 animate-spin text-[#c5a880]" />
// //                           </div>
// //                         )}

// //                         {/* Success tick */}
// //                         {photo.uploadedUrl && (
// //                           <div className="absolute bottom-0.5 right-0.5 bg-emerald-500 rounded-full p-0.5 shadow">
// //                             <CheckCircle className="w-2.5 h-2.5 text-white" />
// //                           </div>
// //                         )}
// //                       </>
// //                     ) : (
// //                       /* Empty state — click to upload */
// //                       <label className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-[#e6e3db] transition-colors">
// //                         <Upload className="w-4 h-4 text-gray-300" />
// //                         <input
// //                           type="file"
// //                           accept="image/*"
// //                           className="hidden"
// //                           onChange={(e) => handleFileUpload(idx, e)}
// //                           disabled={isSubmitting}
// //                         />
// //                       </label>
// //                     )}
// //                   </div>

// //                   {/* Label + hint */}
// //                   <div className="flex-1 min-w-0">
// //                     <p className="font-sans text-xs font-bold text-[#1c1c1c] flex items-center gap-1.5">
// //                       <span>{slotConfig[idx].icon}</span>
// //                       {slotConfig[idx].label}
// //                     </p>
// //                     <p className={`${theme.type.bodySm} text-[11px] mt-0.5`}>
// //                       {photo.uploadedUrl
// //                         ? 'Uploaded successfully'
// //                         : photo.uploading
// //                           ? 'Uploading…'
// //                           : 'Click the box to upload'}
// //                     </p>
// //                   </div>

// //                   {/* Right-side actions */}
// //                   <div className="flex items-center gap-2 flex-shrink-0">
// //                     {/* Re-upload when already filled */}
// //                     {photo.preview && !photo.uploading && (
// //                       <label className="cursor-pointer">
// //                         <span className={`${theme.badge.outline} cursor-pointer hover:border-[#c5a880] transition-colors`}>
// //                           Change
// //                         </span>
// //                         <input
// //                           type="file"
// //                           accept="image/*"
// //                           className="hidden"
// //                           onChange={(e) => handleFileUpload(idx, e)}
// //                           disabled={isSubmitting}
// //                         />
// //                       </label>
// //                     )}

// //                     {/* Remove */}
// //                     {photo.preview && (
// //                       <button
// //                         type="button"
// //                         onClick={() => removePhoto(idx)}
// //                         className={
// //                           'w-7 h-7 rounded-full flex items-center justify-center ' +
// //                           'border border-[#e6e3db] bg-[#faf9f6] hover:bg-red-50 ' +
// //                           'text-red-400 transition-colors'
// //                         }
// //                       >
// //                         <X className="w-3.5 h-3.5" />
// //                       </button>
// //                     )}

// //                     {/* Upload CTA when empty */}
// //                     {!photo.preview && (
// //                       <label className="cursor-pointer">
// //                         <span className={`${theme.badge.outline} cursor-pointer hover:border-[#c5a880] transition-colors`}>
// //                           Upload
// //                         </span>
// //                         <input
// //                           type="file"
// //                           accept="image/*"
// //                           className="hidden"
// //                           onChange={(e) => handleFileUpload(idx, e)}
// //                           disabled={isSubmitting}
// //                         />
// //                       </label>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           {/* ── Action Buttons ──────────────────── */}
// //           <div className="flex justify-end gap-4">
// //             <button
// //               type="button"
// //               onClick={() => navigate(-1)}
// //               className={theme.button.secondary}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={
// //                 photos.some(p => !p.uploadedUrl) ||
// //                 !formData.name ||
// //                 isSubmitting
// //               }
// //               className={`${theme.button.primary} px-12`}
// //             >
// //               {isSubmitting ? (
// //                 <>
// //                   <Loader2 className="w-4 h-4 animate-spin" />
// //                   Saving…
// //                 </>
// //               ) : (
// //                 'Save Person'
// //               )}
// //             </button>
// //           </div>

// //         </form>
// //       </main>
// //     </div>
// //   );
// // };

// // export default AddPerson;

// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle, UserPlus } from 'lucide-react';
// import { useCreatePerson, useRelationships } from '../hooks/usePeople';
// import { peopleApi } from '../api/people';
// import { theme } from '../theme';

// const AddPerson = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const createMutation = useCreatePerson();
//   const { data: roles = [] } = useRelationships();

//   const [formData, setFormData] = useState({ name: '', role: 'Guest' });
//   const [photos, setPhotos] = useState([
//     { type: 'Front Face',    file: null, preview: null, uploadedUrl: null, uploading: false },
//     { type: 'Left Profile',  file: null, preview: null, uploadedUrl: null, uploading: false },
//     { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
//   ]);
//   const [error, setError]               = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleFileUpload = async (index, event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     setPhotos(prev =>
//       prev.map((p, i) =>
//         i === index ? { ...p, file, preview: URL.createObjectURL(file), uploading: true } : p
//       )
//     );
//     try {
//       const result = await peopleApi.uploadPhoto(file);
//       setPhotos(prev =>
//         prev.map((p, i) =>
//           i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p
//         )
//       );
//     } catch {
//       setPhotos(prev =>
//         prev.map((p, i) =>
//           i === index ? { ...p, uploading: false, preview: null } : p
//         )
//       );
//       setError('Failed to upload photo');
//     }
//   };

//   const removePhoto = (index) =>
//     setPhotos(prev =>
//       prev.map((p, i) =>
//         i === index
//           ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false }
//           : p
//       )
//     );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
//     if (uploadedPhotos.length < 3) {
//       setError('All 3 angles are required.');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       await createMutation.mutateAsync({
//         propertyId: id,
//         data: {
//           name:       formData.name,
//           role:       formData.role,
//           photo_urls: uploadedPhotos.map(p => p.uploadedUrl),
//         },
//       });
//       navigate(`/property/${id}/people`);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to register person');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const slotConfig = [
//     { label: 'Front View',    icon: '👤',  },
//     { label: 'Left Profile',  icon: '👈',    },
//     { label: 'Right Profile', icon: '👉',   },
//   ];

//   return (
//     <div className={theme.page.wrapper}>

//       {/* ── Header ─────────────────────────────── */}
//       <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className={theme.header.title}>Add Authorized Person</h2>
//         </div>
//       </header>

//       {/* ── Main ───────────────────────────────── */}
//       <main className="max-w-3xl mx-auto px-6 py-8">
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* Error alert */}
//           {error && (
//             <div className={theme.alert.error}>{error}</div>
//           )}

//           {/* ── Profile Details ─────────────────── */}
//           <section className={theme.card.base}>
//             <div className="flex items-center gap-2 mb-5">
//               <UserPlus className="w-4 h-4 text-[#c5a880]" />
//               <span className={theme.type.label}>Profile Details</span>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={theme.form.group}>
//                 <label className={theme.input.label}>Full Name *</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Sarah Smith"
//                   className={theme.input.base}
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className={theme.form.group}>
//                 <label className={theme.input.label}>Relationship / Role</label>
//                 <select
//                   className={theme.input.base}
//                   value={formData.role}
//                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                   disabled={isSubmitting}
//                 >
//                   {roles.map((r) => (
//                     <option key={r} value={r}>{r}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </section>

//           {/* ── Face Data Collection ────────────── */}
//           <section className={theme.card.base}>

//             {/* Heading row */}
//             <div className="flex items-center justify-between mb-5">
//               <div className="flex items-center gap-2">
//                 <Camera className="w-4 h-4 text-[#c5a880]" />
//                 <span className={theme.type.label}>Face Data Collection</span>
//               </div>
//               <span className={`${theme.badge.outline} text-gray-400`}>
//                 3 ANGLES REQUIRED
//               </span>
//             </div>

//             {/* ── Vertical photo boxes side-by-side ── */}
//             <div className="grid grid-cols-3 gap-3">
//               {photos.map((photo, idx) => (
//                 <div key={idx} className="flex flex-col gap-2">

//                   {/* Portrait-ratio photo box */}
//                   <div
//                     className={
//                       'relative rounded-[1.25rem] overflow-hidden border ' +
//                       'border-[#e6e3db] bg-[#f0ede8] ' +
//                       // 3:4 portrait aspect ratio
//                       'aspect-[3/4] w-full'
//                     }
//                   >
//                     {photo.preview ? (
//                       <>
//                         <img
//                           src={photo.preview}
//                           alt={photo.type}
//                           className="w-full h-full object-cover"
//                         />

//                         {/* Uploading spinner overlay */}
//                         {photo.uploading && (
//                           <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
//                             <Loader2 className="w-6 h-6 animate-spin text-[#c5a880]" />
//                           </div>
//                         )}

//                         {/* Success tick */}
//                         {photo.uploadedUrl && (
//                           <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1 shadow">
//                             <CheckCircle className="w-3.5 h-3.5 text-white" />
//                           </div>
//                         )}

//                         {/* Remove button */}
//                         {!photo.uploading && (
//                           <button
//                             type="button"
//                             onClick={() => removePhoto(idx)}
//                             className={
//                               'absolute top-2 right-2 w-7 h-7 rounded-full ' +
//                               'flex items-center justify-center ' +
//                               'bg-white/80 hover:bg-red-50 ' +
//                               'border border-[#e6e3db] text-red-400 ' +
//                               'transition-colors shadow-sm'
//                             }
//                           >
//                             <X className="w-3.5 h-3.5" />
//                           </button>
//                         )}
//                       </>
//                     ) : (
//                       /* Empty drop zone */
//                       <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-[#e6e3db] transition-colors gap-2">
//                         <Upload className="w-5 h-5 text-gray-300" />
//                         <span className="text-[10px] font-sans text-gray-300 font-medium tracking-wide">
//                           UPLOAD
//                         </span>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={(e) => handleFileUpload(idx, e)}
//                           disabled={isSubmitting}
//                         />
//                       </label>
//                     )}
//                   </div>

//                   {/* Label below the box */}
//                   <div className="text-center px-1">
//                     <p className="font-sans text-xs font-bold text-[#1c1c1c] flex items-center justify-center gap-1">
//                       <span>{slotConfig[idx].icon}</span>
//                       {slotConfig[idx].label}
//                     </p>
//                     <p className={`${theme.type.bodySm} text-[10px] mt-0.5 leading-tight`}>
//                       {photo.uploadedUrl
//                         ? 'Uploaded ✓'
//                         : photo.uploading
//                           ? 'Uploading…'
//                           : slotConfig[idx].hint}
//                     </p>
//                   </div>

//                   {/* Re-upload button when filled */}
//                   {photo.preview && !photo.uploading && (
//                     <label className="cursor-pointer text-center">
//                       <span className={`${theme.badge.outline} cursor-pointer hover:border-[#c5a880] transition-colors text-[10px]`}>
//                         Change
//                       </span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleFileUpload(idx, e)}
//                         disabled={isSubmitting}
//                       />
//                     </label>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ── Action Buttons ──────────────────── */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className={theme.button.secondary}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={
//                 photos.some(p => !p.uploadedUrl) ||
//                 !formData.name ||
//                 isSubmitting
//               }
//               className={`${theme.button.primary} px-12`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Saving…
//                 </>
//               ) : (
//                 'Save Person'
//               )}
//             </button>
//           </div>

//         </form>
//       </main>
//     </div>
//   );
// };

// export default AddPerson;

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Upload, Camera, Loader2, CheckCircle, UserPlus } from 'lucide-react';
import { useCreatePerson, useRelationships } from '../hooks/usePeople';
import { peopleApi } from '../api/people';
import { theme } from '../theme';

const AddPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const createMutation = useCreatePerson();
  const { data: roles = [] } = useRelationships();

  const [formData, setFormData] = useState({ name: '', role: 'Guest' });
  const [photos, setPhotos] = useState([
    { type: 'Front Face',    file: null, preview: null, uploadedUrl: null, uploading: false },
    { type: 'Left Profile',  file: null, preview: null, uploadedUrl: null, uploading: false },
    { type: 'Right Profile', file: null, preview: null, uploadedUrl: null, uploading: false },
  ]);
  const [error, setError]               = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPhotos(prev =>
      prev.map((p, i) =>
        i === index ? { ...p, file, preview: URL.createObjectURL(file), uploading: true } : p
      )
    );
    try {
      const result = await peopleApi.uploadPhoto(file);
      setPhotos(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, uploading: false, uploadedUrl: result.url } : p
        )
      );
    } catch {
      setPhotos(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, uploading: false, preview: null } : p
        )
      );
      setError('Failed to upload photo');
    }
  };

  const removePhoto = (index) =>
    setPhotos(prev =>
      prev.map((p, i) =>
        i === index
          ? { ...p, file: null, preview: null, uploadedUrl: null, uploading: false }
          : p
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedPhotos = photos.filter(p => p.uploadedUrl !== null);
    if (uploadedPhotos.length < 3) {
      setError('All 3 angles are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        propertyId: id,
        data: {
          name:       formData.name,
          role:       formData.role,
          photo_urls: uploadedPhotos.map(p => p.uploadedUrl),
        },
      });
      navigate(`/property/${id}/people`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register person');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slotConfig = [
    { label: 'Front View',    icon: '👤', },
    { label: 'Left Profile',  icon: '👈',    },
    { label: 'Right Profile', icon: '👉',   },
  ];

  return (
    <div className={theme.page.wrapper}>

      {/* ── Header ─────────────────────────────── */}
      <header className={`${theme.header.wrapper} sticky top-0 z-20`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className={theme.header.title}>Add Authorized Person</h2>
        </div>
      </header>

      {/* ── Main ───────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Error alert */}
          {error && (
            <div className={theme.alert.error}>{error}</div>
          )}

          {/* ── Profile Details ─────────────────── */}
          <section className={theme.card.base}>
            <div className="flex items-center gap-2 mb-5">
              <UserPlus className="w-4 h-4 text-[#c5a880]" />
              <span className={theme.type.label}>Profile Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={theme.form.group}>
                <label className={theme.input.label}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Smith"
                  className={theme.input.base}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={theme.form.group}>
                <label className={theme.input.label}>Relationship / Role</label>
                <select
                  className={theme.input.base}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={isSubmitting}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Face Data Collection ────────────── */}
          <section className={theme.card.base}>

            {/* Heading row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#c5a880]" />
                <span className={theme.type.label}>Face Data Collection</span>
              </div>
              <span className={`${theme.badge.outline} text-gray-400`}>
                3 ANGLES REQUIRED
              </span>
            </div>

            {/* ── Vertical photo boxes side-by-side ── */}
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, idx) => (
                <div key={idx} className="flex flex-col gap-2">

                  {/* Portrait-ratio photo box */}
                  <div
                    className={
                      'relative rounded-[0.875rem] overflow-hidden border ' +
                      'border-[#e6e3db] bg-[#f0ede8] ' +
                      'aspect-[3/4] w-full max-w-[90px] mx-auto'
                    }
                  >
                    {photo.preview ? (
                      <>
                        <img
                          src={photo.preview}
                          alt={photo.type}
                          className="w-full h-full object-cover"
                        />

                        {/* Uploading spinner overlay */}
                        {photo.uploading && (
                          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#c5a880]" />
                          </div>
                        )}

                        {/* Success tick */}
                        {photo.uploadedUrl && (
                          <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1 shadow">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        {/* Remove button */}
                        {!photo.uploading && (
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className={
                              'absolute top-2 right-2 w-7 h-7 rounded-full ' +
                              'flex items-center justify-center ' +
                              'bg-white/80 hover:bg-red-50 ' +
                              'border border-[#e6e3db] text-red-400 ' +
                              'transition-colors shadow-sm'
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    ) : (
                      /* Empty drop zone */
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-[#e6e3db] transition-colors gap-2">
                        <Upload className="w-5 h-5 text-gray-300" />
                        <span className="text-[10px] font-sans text-gray-300 font-medium tracking-wide">
                          UPLOAD
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(idx, e)}
                          disabled={isSubmitting}
                        />
                      </label>
                    )}
                  </div>

                  {/* Label below the box */}
                  <div className="text-center px-1">
                    <p className="font-sans text-xs font-bold text-[#1c1c1c] flex items-center justify-center gap-1">
                      <span>{slotConfig[idx].icon}</span>
                      {slotConfig[idx].label}
                    </p>
                    <p className={`${theme.type.bodySm} text-[10px] mt-0.5 leading-tight`}>
                      {photo.uploadedUrl
                        ? 'Uploaded ✓'
                        : photo.uploading
                          ? 'Uploading…'
                          : slotConfig[idx].hint}
                    </p>
                  </div>

                  {/* Re-upload button when filled */}
                  {photo.preview && !photo.uploading && (
                    <label className="cursor-pointer text-center">
                      <span className={`${theme.badge.outline} cursor-pointer hover:border-[#c5a880] transition-colors text-[10px]`}>
                        Change
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(idx, e)}
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Action Buttons ──────────────────── */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={theme.button.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                photos.some(p => !p.uploadedUrl) ||
                !formData.name ||
                isSubmitting
              }
              className={`${theme.button.primary} px-12`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save Person'
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default AddPerson;