"use client";

import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
);

const FormInput = ({ label, id, value, onChange, type = 'text', required = true }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
    />
  </div>
);

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const FormTextarea = ({ label, id, value, onChange, required = true }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean; }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      rows={6}
      className="w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
    />
  </div>
);

const FormModal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void; }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-900 font-serif">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <HiX size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const initialEventState = {
  title: '',
  description: '',
  date: '',
  category: '',
  imageUrl: '',
};

export default function EventPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(initialEventState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchEvents = () => {
    setIsLoading(true);
    fetch('/api/events')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to fetch events.');
        setEvents([]);
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentEvent(initialEventState);
    setShowForm(true);
  };

  const handleEdit = (event: any) => {
    setIsEditMode(true);
    setEditingId(event.id);
    const formattedDate = event.date.split('T')[0];
    setCurrentEvent({ ...event, date: formattedDate });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditMode ? `/api/events/${editingId}` : '/api/events';
    const method = isEditMode ? 'PUT' : 'POST';
    const token = getCookie('accessToken');

    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(currentEvent),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      setShowForm(false);
      setError(null);
      setCurrentEvent(initialEventState);
      fetchEvents();
    })
    .catch(err => {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to save event');
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const token = getCookie('accessToken');
      fetch(`/api/events/${id}`, { 
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          setError(null);
          fetchEvents();
        })
        .catch(err => {
          console.error('Delete error:', err);
          setError(err.message || 'Failed to delete event');
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900 font-serif">Manage Events</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold"
        >
          <HiPlus className="mr-2" />
          Create New Event
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Event' : 'Create New Event'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} />
            <FormInput label="Category (e.g., Workshop)" id="category" value={currentEvent.category} onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})} required={false} />
            <FormInput label="Date" id="date" type="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} />
            <FormInput label="Image URL" id="imageUrl" value={currentEvent.imageUrl} onChange={(e) => setCurrentEvent({...currentEvent, imageUrl: e.target.value})} required={false} />
            <FormTextarea label="Description" id="description" value={currentEvent.description} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              {isEditMode ? 'Save Changes' : 'Create Event'}
            </button>
          </form>
        </FormModal>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center"><LoadingSpinner /></div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {events.map(event => (
              <li key={event.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">{event.title}</h3>
                  <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} - {event.category}</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(event)} className="p-2 text-blue-600 hover:text-blue-800"><HiPencil size={18} /></button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:text-red-800"><HiTrash size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
