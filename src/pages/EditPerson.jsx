// src/pages/EditPerson.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Loader2, CheckCircle } from 'lucide-react';
import { usePeople, useUpdatePerson, useRelationships } from '../hooks/usePeople';
import { peopleApi } from '../api/people';
import { API_BASE_URL } from '../config/api';
import { theme } from '../theme';

const EditPerson = () => {
  const { id, personId } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdatePerson();
  const { data: people = [] } = usePeople(id);
  const { data: roles  = [] } = useRelationships();

  const [formData, setFormData] = useState({ name: '', role: 'Guest' });
  const [photos,   setPhotos]   = useState([]);
  const [error,    setError]    = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const person = people.find((p) => String(p.id) === String(personId));
    if (person) {
      setFormData({ name: person.name, role: person.role });
      setPhotos(
        person.photo_urls?.map((url) => ({
          type: 'Front Face',
          file: null,
          preview:     url.startsWith('http') ? url : `${API_BASE_URL}${url}`,
          uploadedUrl: url,
          uploading:   false,
        })) || []
      );
    }
  }, [people, personId]);

  const handleFileUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotos(prev => {
        const next = [...prev];
        next[index] = { ...next[index], file, preview: ev.target.result,
                        uploading: true, uploadedUrl: null };
        return next;
      });
    };
    reader.readAsDataURL(file);

    try {
      const result = await peopleApi.uploadPhoto(file);
      setPhotos(prev => {
        const next = [...prev];
        next[index] = { ...next[index], uploading: false, uploadedUrl: result.url };
        return next;
      });
    } catch {
      setPhotos(prev => {
        const next = [...prev];
        next[index] = { ...next[index], uploading: false };
        return next;
      });
      setError(`Failed to upload photo ${index + 1}`);
    }
  };

  const removePhoto     = (i) => setPhotos(prev => {
    const next = [...prev];
    next[i] = { ...next[i], file: null, preview: null, uploadedUrl: null, uploading: false };
    return next;
  });
  const addPhotoSlot    = () =>
    setPhotos(p => [...p, { type: 'Front Face', file: null, preview: null,
                             uploadedUrl: null, uploading: false }]);
  const removePhotoSlot = (i) => {
    if (photos.length > 1) setPhotos(p => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const uploaded  = photos.filter(p => p.uploadedUrl !== null);
    const uploading = photos.some(p => p.uploading);
    if (uploaded.length === 0)  { setError('Please add at least one photo'); return; }
    if (uploading)              { setError('Wait for uploads to finish'); return; }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        personId,
        propertyId: id,
        data: {
          name:       formData.name,
          role:       formData.role,
          photo_urls: uploaded.map(p => p.uploadedUrl),
        },
      });
      navigate(`/property/${id}/people`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update person');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (people.length > 0 && !people.find((p) => String(p.id) === String(personId))) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Person not found</p>
          <button onClick={() => navigate(-1)} className={theme.type.link}>Go Back</button>
        </div>
      </div>
    );
  }

  const uploadedCount  = photos.filter(p => p.uploadedUrl).length;
  const uploadingCount = photos.filter(p => p.uploading).length;
  const busy           = isSubmitting;
  const inp            = theme.input.base;
  const lbl            = theme.input.label;

  return (
    <div className={theme.page.wrapper}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={theme.type.h3}>Edit Person</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">

        {error && <div className={theme.alert.error}>{error}</div>}

        {/* Name */}
        <div className={theme.form.group}>
          <label className={lbl}>Full Name</label>
          <input
            type="text" placeholder="e.g., Sarah Smith"
            className={inp}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required disabled={busy}
          />
        </div>

        {/* Role */}
        <div className={theme.form.group}>
          <label className={lbl}>Role</label>
          <select className={inp}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            disabled={busy}>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Photos */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className={lbl}>
              Face Photos{' '}
              <span className="text-gray-300 normal-case tracking-normal font-medium">
                ({uploadedCount} uploaded
                {uploadingCount > 0 && `, ${uploadingCount} uploading`})
              </span>
            </label>
            <button type="button" onClick={addPhotoSlot} disabled={busy}
                    className={`${theme.button.secondary} ${theme.button.sm}`}>
              <Plus className="w-3 h-3" />
              Add Slot
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo, idx) => (
              <div key={idx} className="flex flex-col gap-2">

                {/* Photo slot */}
                <div className={`relative ${theme.card.muted} h-32 flex
                                  items-center justify-center overflow-hidden group p-0`}>
                  {photo.preview ? (
                    <>
                      <img src={photo.preview} alt={photo.type}
                           className="w-full h-full object-cover rounded-[1.5rem]" />

                      {photo.uploading && (
                        <div className="absolute inset-0 bg-black/60 flex
                                        items-center justify-center rounded-[1.5rem]">
                          <div className={theme.ui.spinner} />
                        </div>
                      )}
                      {photo.uploadedUrl && !photo.uploading && (
                        <div className="absolute top-2 left-2 bg-emerald-500
                                        rounded-full p-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0
                                      group-hover:opacity-100 transition rounded-[1.5rem]
                                      flex items-center justify-center gap-2">
                        <label className={`${theme.button.primary} ${theme.button.sm} cursor-pointer`}>
                          <Upload className="w-4 h-4" />
                          <input type="file" accept="image/*" className="hidden"
                                 onChange={(e) => handleFileUpload(idx, e)}
                                 disabled={busy} />
                        </label>
                        <button type="button" onClick={() => removePhoto(idx)}
                                disabled={busy}
                                className={theme.button.danger + ' ' + theme.button.sm}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center
                                      cursor-pointer w-full h-full
                                      hover:bg-[#e6e3db] transition rounded-[1.5rem]">
                      <Upload className="h-8 w-8 text-gray-300 mb-2" />
                      <span className={theme.type.labelSm}>Click to upload</span>
                      <input type="file" accept="image/*" className="hidden"
                             onChange={(e) => handleFileUpload(idx, e)}
                             disabled={busy} />
                    </label>
                  )}

                  {photos.length > 1 && (
                    <button type="button" onClick={() => removePhotoSlot(idx)}
                            disabled={busy}
                            className="absolute -top-2 -right-2 bg-[#e6e3db]
                                       hover:bg-red-500 text-[#1c1c1c] hover:text-white
                                       w-6 h-6 rounded-full flex items-center
                                       justify-center z-10 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Type selector */}
                <select className={`${inp} py-2 px-3 text-xs`}
                  value={photo.type}
                  onChange={(e) => {
                    const next = [...photos];
                    next[idx].type = e.target.value;
                    setPhotos(next);
                  }}
                  disabled={busy}>
                  {['Front Face','Right Profile','Left Profile',
                    'With Glasses','Without Glasses','Side View'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>

              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
                  disabled={busy} className={theme.button.secondary}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadedCount === 0 || busy || uploadingCount > 0}
            className={`${theme.button.primary} flex-1`}
          >
            {busy
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              : 'Update Person'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditPerson;