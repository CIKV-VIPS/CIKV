"use client";

// Force dynamic rendering - no static caching
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { HiPlus, HiTrash, HiX } from 'react-icons/hi';
import SafeImage from '@/components/SafeImage';

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

const initialImageState = {
  eventName: '',
  imageUrl: '',
};

export default function GalleryPanel() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(initialImageState);

  const fetchImages = () => {
    setIsLoading(true);
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch images.');
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchImages();
  }, []);

  const handleCreate = () => {
    setCurrentImage(initialImageState);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookie('accessToken');
    fetch('/api/gallery', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(currentImage),
    })
    .then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then(() => {
      setShowForm(false);
      setError(null);
      fetchImages();
    })
    .catch(err => {
      console.error('Error:', err);
      setError(err.message || 'Failed to add image');
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const token = getCookie('accessToken');
      fetch(`/api/gallery/${id}`, { 
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => {
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then(() => {
          setError(null);
          fetchImages();
        })
        .catch(err => {
          console.error('Error:', err);
          setError(err.message || 'Failed to delete image');
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900 font-serif">Manage Gallery</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold"
        >
          <HiPlus className="mr-2" />
          Add New Image
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      {showForm && (
        <FormModal title="Add New Image" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Event Name (for grouping)" id="eventName" value={currentImage.eventName} onChange={(e) => setCurrentImage({...currentImage, eventName: e.target.value})} />
            <FormInput label="Image URL (e.g., from Cloudinary)" id="imageUrl" value={currentImage.imageUrl} onChange={(e) => setCurrentImage({...currentImage, imageUrl: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              Add Image
            </button>
          </form>
        </FormModal>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center p-6"><LoadingSpinner /></div>
        ) : (
          images.map(image => (
            <div key={image.id} className="relative rounded-lg shadow-md overflow-hidden group">
              <SafeImage src={image.imageUrl} alt={image.eventName} width={400} height={400} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex flex-col justify-between p-2">
                <button 
                  onClick={() => handleDelete(image.id)} 
                  className="self-end p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <HiTrash size={16} />
                </button>
                <p className="text-white text-sm font-semibold truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.eventName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
