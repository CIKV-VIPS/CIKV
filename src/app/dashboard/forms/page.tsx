"use client";

import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import Cookies from 'js-cookie';

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

const initialFormState = {
  title: '',
  googleFormLink: '',
  status: 'inactive',
};

export default function FormPanel() {
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentForm, setCurrentForm] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchForms = () => {
    setIsLoading(true);
    fetch('/api/forms')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setForms(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to fetch forms.');
        setForms([]);
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentForm(initialFormState);
    setShowForm(true);
  };

  const handleEdit = (form: any) => {
    setIsEditMode(true);
    setEditingId(form.id);
    setCurrentForm(form);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditMode ? `/api/forms/${editingId}` : '/api/forms';
    const method = isEditMode ? 'PUT' : 'POST';
    const token = Cookies.get('accessToken');

    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(currentForm),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to save form. Are you logged in?');
      }
      return res.json();
    })
    .then(() => {
      setShowForm(false);
      setError(null);
      fetchForms();
    })
    .catch(err => setError(err.message));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const token = Cookies.get('accessToken');
      fetch(`/api/forms/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to delete form. Are you logged in?');
          }
          return res.json();
        })
        .then(() => {
          setError(null);
          fetchForms();
        })
        .catch(err => setError(err.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900 font-serif">Manage Forms</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold"
        >
          <HiPlus className="mr-2" />
          Create New Form
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Form' : 'Create New Form'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentForm.title} onChange={(e) => setCurrentForm({...currentForm, title: e.target.value})} />
            <FormInput label="Google Form Link" id="googleFormLink" value={currentForm.googleFormLink} onChange={(e) => setCurrentForm({...currentForm, googleFormLink: e.target.value})} />
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={currentForm.status}
                onChange={(e) => setCurrentForm({...currentForm, status: e.target.value})}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              {isEditMode ? 'Save Changes' : 'Create Form'}
            </button>
          </form>
        </FormModal>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center"><LoadingSpinner /></div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {forms.map(form => (
              <li key={form.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">{form.title}</h3>
                  <span className={`text-sm font-semibold ${form.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>{form.status}</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(form)} className="p-2 text-blue-600 hover:text-blue-800"><HiPencil size={18} /></button>
                  <button onClick={() => handleDelete(form.id)} className="p-2 text-red-600 hover:text-red-800"><HiTrash size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}