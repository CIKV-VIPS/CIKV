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
  const [currentBlog, setCurrentBlog] = useState(initialBlogState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch blogs.');
        setIsLoading(false);
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditMode ? `/api/blogs/${editingId}` : '/api/blogs';
    const method = isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBlog),
    })
    .then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then(() => {
      setShowForm(false);
      setError(null);
      fetchBlogs();
    })
    .catch(err => {
      console.error('Error:', err);
      setError(err.message || 'Failed to save blog');
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      fetch(`/api/blogs/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then(() => {
          setError(null);
          fetchBlogs();
        })
        .catch(err => {
          console.error('Error:', err);
          setError(err.message || 'Failed to delete blog');
        });
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
            <FormInput label="Image URL" id="imageUrl" value={currentBlog.imageUrl} onChange={(e) => setCurrentBlog({...currentBlog, imageUrl: e.target.value})} required={false} />
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
