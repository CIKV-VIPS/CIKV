"use client";

import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

// --- Reusable Helper Functions ---

async function apiRequest(url: string, method: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  // Get the token from cookies
  const token = typeof window !== 'undefined' ? getCookie('accessToken') : null;
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Log the request details for debugging
  console.log('Submitting request:');
  console.log('URL:', url);
  console.log('Method:', method);
  if (body) {
    console.log('Body:', options.body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: `An unknown error occurred. Status: ${res.status}` }));
    throw new Error(errorData.message || `API error: ${res.status}`);
  }

  // For DELETE requests, the response might not have a body
  if (method === 'DELETE') {
    return;
  }
  
  return res.json();
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// --- UI Components ---

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

// --- Main Component ---

const initialBlogState = {
  title: '',
  author: '',
  content: '',
  imageUrl: '',
};

export default function BlogPanel() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(initialBlogState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/api/blogs', 'GET');
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentBlog(initialBlogState);
    setShowForm(true);
  };

  const handleEdit = (blog: any) => {
    setIsEditMode(true);
    setEditingId(blog.id);
    setCurrentBlog(blog);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditMode ? `/api/blogs/${editingId}` : '/api/blogs';
    const method = isEditMode ? 'PUT' : 'POST';
    
    // Ensure a clean data object is sent
    const { title, author, content, imageUrl } = currentBlog;
    const blogData = { title, author, content, imageUrl };

    try {
      await apiRequest(url, method, blogData);
      setShowForm(false);
      setError(null);
      fetchBlogs();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to save blog');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await apiRequest(`/api/blogs/${id}`, 'DELETE');
        setError(null);
        fetchBlogs();
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'Failed to delete blog');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900 font-serif">Manage Blogs</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold"
        >
          <HiPlus className="mr-2" />
          Create New Post
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Blog Post' : 'Create New Post'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentBlog.title} onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})} />
            <FormInput label="Author" id="author" value={currentBlog.author} onChange={(e) => setCurrentBlog({...currentBlog, author: e.target.value})} />
            <FormInput label="Image URL" id="imageUrl" value={currentBlog.imageUrl || ''} onChange={(e) => setCurrentBlog({...currentBlog, imageUrl: e.target.value})} required={false} />
            <FormTextarea label="Content" id="content" value={currentBlog.content} onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              {isEditMode ? 'Save Changes' : 'Create Post'}
            </button>
          </form>
        </FormModal>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center"><LoadingSpinner /></div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {blogs.map(blog => (
              <li key={blog.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">{blog.title}</h3>
                  <span className="text-sm text-gray-500">by {blog.author}</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(blog)} className="p-2 text-blue-600 hover:text-blue-800"><HiPencil size={18} /></button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:text-red-800"><HiTrash size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}