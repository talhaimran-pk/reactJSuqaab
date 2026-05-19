import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePropertyStore = create(
  persist(
    (set, get) => ({
      properties: [],
      
      addProperty: (property) => set((state) => ({
        properties: [...state.properties, { 
          id: Date.now(),
          ...property,
          cameras: [],
          drones: [],
          alerts: [],
          people: [] // Add people array
        }]
      })),
      
      deleteProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== Number(id))
      })),
      
      getProperty: (id) => get().properties.find(p => p.id === Number(id)),
      
      updateProperty: (id, updates) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === Number(id) ? { ...p, ...updates } : p
        )
      })),

      // People management methods
      addPerson: (propertyId, person) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === Number(propertyId) 
            ? { 
                ...p, 
                people: [...(p.people || []), { 
                  id: Date.now(),
                  ...person,
                  createdAt: new Date().toISOString()
                }] 
              }
            : p
        )
      })),

      updatePerson: (propertyId, personId, updates) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === Number(propertyId) 
            ? {
                ...p,
                people: p.people.map(person => 
                  person.id === Number(personId) ? { ...person, ...updates } : person
                )
              }
            : p
        )
      })),

      deletePerson: (propertyId, personId) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === Number(propertyId) 
            ? { ...p, people: p.people.filter(person => person.id !== Number(personId)) }
            : p
        )
      })),

      loadProperties: () => {
        const stored = localStorage.getItem('property-storage')
        if (stored) {
          const parsed = JSON.parse(stored)
          set({ properties: parsed.state?.properties || [] })
        }
      }
    }),
    {
      name: 'property-storage',
      getStorage: () => localStorage,
    }
  )
)