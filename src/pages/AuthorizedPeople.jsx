// src/pages/AuthorizedPeople.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit2, Trash2, User, Camera, Loader2 } from 'lucide-react'
import { usePeople, useDeletePerson } from '../hooks/usePeople'
import { useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'
import { API_BASE_URL } from '../config/api'
import { theme } from '../theme'

const getPhotoUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_BASE_URL}${url}`
}

const AuthorizedPeople = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [deleteError, setDeleteError] = useState('')

  const { data: people = [], isLoading, error } = usePeople(id)
  const deleteMutation = useDeletePerson()

  const handleDelete = async (personId) => {
    if (!confirm('Are you sure you want to delete this person?')) return
    setDeleteError('')
    try {
      await deleteMutation.mutateAsync({ personId, propertyId: id })
    } catch {
      setDeleteError('Failed to delete person')
    }
  }

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={theme.page.centered}>
        <div className={`${theme.card.base} text-center max-w-sm w-full`}>
          <p className={`${theme.type.error} mb-3`}>Failed to load people</p>
          <button onClick={() => window.location.reload()} className={theme.type.link}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme.page.wrapper} pb-24`}>

      {/* Header */}
      <div className="bg-white border-b border-[#e6e3db] px-4 py-4
                      flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className={theme.ui.backBtn}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className={`${theme.type.h3} flex-1`}>
          Authorized People ({people.length})
        </h2>
        <HamburgerMenu propertyId={id} />
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className={`${theme.alert.error} mx-5 mt-4`}>{deleteError}</div>
      )}

      <div className="p-5 space-y-3">
        {people.length === 0 ? (

          /* Empty state */
          <div className={`${theme.card.lg} flex flex-col items-center text-center gap-5`}>
            <div className={theme.ui.iconBox}>
              <User className="h-6 w-6 text-[#c5a880]" />
            </div>
            <div>
              <h3 className={`${theme.type.h3} mb-2`}>No authorized people added</h3>
              <p className={theme.type.bodySm}>Add people for face recognition</p>
            </div>
            <button
              onClick={() => navigate(`/property/${id}/person/add`)}
              className={theme.button.primary}
            >
              Add First Person
            </button>
          </div>

        ) : (
          people.map((person) => {
            const frontPhoto = getPhotoUrl(person.photo_urls?.[0])
            return (
              <div key={person.id} className={theme.card.base}>
                <div className="flex justify-between items-start">

                  {/* Avatar + info */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {frontPhoto ? (
                        <img
                          src={frontPhoto}
                          alt={person.name}
                          className="w-14 h-14 rounded-full object-cover
                                     border-2 border-[#e6e3db]"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-14 h-14 rounded-full bg-[#faf9f6]
                                        border-2 border-[#e6e3db] items-center justify-center
                                        ${frontPhoto ? 'hidden' : 'flex'}`}>
                        <User className="w-6 h-6 text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className={theme.type.h4}>{person.name}</h3>
                      <p className={theme.type.bodySm}>{person.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/property/${id}/person/${person.id}/edit`)}
                      className={theme.button.icon}
                      title="Edit person"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2.5 rounded-full hover:bg-red-50 text-red-500
                                 active:scale-95 transition-all disabled:opacity-40"
                      title="Delete person"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-[#e6e3db]
                                flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400
                                   font-sans text-xs font-medium">
                    <Camera className="w-3 h-3" />
                    {person.photo_urls?.length || 0} photos
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500
                                   font-sans text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {/* Active */}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      {people.length > 0 && (
        <button
          onClick={() => navigate(`/property/${id}/person/add`)}
          className={theme.ui.fab}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

    </div>
  )
}

export default AuthorizedPeople