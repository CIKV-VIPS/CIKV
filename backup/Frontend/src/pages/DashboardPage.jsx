import React, { useState, useEffect } from 'react';
import { HiOfficeBuilding, HiPencilAlt, HiPhotograph, HiCalendar, HiLogout, HiPlus, HiTrash, HiPencil, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import FormsPage from './Forms';
import api from '../api';

// --- Main Dashboard Page Component ---
// This holds the layout and manages which panel is active
export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState('events'); // Default panel
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear the auth token here
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'events':
        return <EventPanel />;
      case 'blogs':
        return <BlogPanel />;
      case 'gallery':
        return <GalleryPanel />;
      case 'forms':
        return <FormPanel />;
      default:
        return <EventPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFBEB]">
      {/* --- 1. Sidebar --- */}
      <nav className="w-64 bg-[#6D2828] text-amber-100 flex flex-col shadow-lg">
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-white font-serif">CIKV</h1>
          <span className="text-sm text-amber-200">Admin Dashboard</span>
        </div>
        
        <ul className="flex-grow space-y-2 px-4">
          <SidebarButton
            icon={<HiCalendar size={20} />}
            label="Manage Events"
            isActive={activePanel === 'events'}
            onClick={() => setActivePanel('events')}
          />
          <SidebarButton
            icon={<HiPencilAlt size={20} />}
            label="Manage Blogs"
            isActive={activePanel === 'blogs'}
            onClick={() => setActivePanel('blogs')}
          />
          <SidebarButton
            icon={<HiPhotograph size={20} />}
            label="Manage Gallery"
            isActive={activePanel === 'gallery'}
            onClick={() => setActivePanel('gallery')}
          />
          <SidebarButton
            icon={<HiPencilAlt size={20} />}
            label="Manage Forms"
            isActive={activePanel === 'forms'}
            onClick={() => setActivePanel('forms')}
          />
        </ul>

        <div className="p-4 border-t border-amber-800">
          <SidebarButton
            icon={<HiLogout size={20} />}
            label="Logout"
            isActive={false}
            onClick={handleLogout}
          />
        </div>
      </nav>

      {/* --- 2. Main Content Area --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {renderPanel()}
      </main>
    </div>
  );
}

// --- Sidebar Button Component ---
function SidebarButton({ icon, label, isActive, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg font-semibold transition-colors ${
          isActive
            ? 'bg-amber-100 text-amber-900 shadow-inner'
            : 'text-amber-100 hover:bg-amber-800 hover:bg-opacity-20'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  );
}

// --- Helper: Loading Spinner ---
function LoadingSpinner() {
  return (
    <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
  );
}

// --- Helper: Form Input ---
function FormInput({ label, id, value, onChange, type = 'text', required = true }) {
  return (
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
}

// --- Helper: Form Textarea ---
function FormTextarea({ label, id, value, onChange, required = true }) {
  return (
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
        rows="6"
        className="w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
      />
    </div>
  );
}

// --- Helper: Modal for Forms ---
function FormModal({ title, children, onClose }) {
  return (
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
}

// ==================================================================
// --- 1. EVENT MANAGEMENT PANEL ---
// ==================================================================
const initialEventState = {
  title: '',
  description: '',
  date: '',
  category: '',
  image_url: '',
};

function EventPanel() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(initialEventState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- Fetch All Events ---
  const fetchEvents = () => {
    setIsLoading(true);
    api.fetch('/events/')
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch events.');
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Open Create Form ---
  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentEvent(initialEventState);
    setShowForm(true);
  };

  // --- Open Edit Form ---
  const handleEdit = (event) => {
    setIsEditMode(true);
    setEditingId(event.id);
    // Ensure date is in YYYY-MM-DD format for the input
    const formattedDate = event.date.split('T')[0];
    setCurrentEvent({ ...event, date: formattedDate });
    setShowForm(true);
  };

  // --- Handle Form Submission (Create/Update) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditMode ? `/events/${editingId}` : '/events/';
    const method = isEditMode ? 'PUT' : 'POST';

    api.fetch(url, {
      method: method,
      body: JSON.stringify(currentEvent),
    })
    .then(() => {
      setShowForm(false);
      fetchEvents(); // Refresh list
    })
    .catch(err => setError(err.message));
  };

  // --- Handle Delete ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      api.fetch(`/events/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchEvents(); // Refresh list
        })
        .catch(err => setError(err.message));
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
      
      {/* --- Event Form Modal --- */}
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Event' : 'Create New Event'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} />
            <FormInput label="Category (e.g., Workshop)" id="category" value={currentEvent.category} onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})} required={false} />
            <FormInput label="Date" id="date" type="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} />
            <FormInput label="Image URL" id="image_url" value={currentEvent.image_url} onChange={(e) => setCurrentEvent({...currentEvent, image_url: e.target.value})} required={false} />
            <FormTextarea label="Description" id="description" value={currentEvent.description} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              {isEditMode ? 'Save Changes' : 'Create Event'}
            </button>
          </form>
        </FormModal>
      )}

      {/* --- List of Events --- */}
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

// ==================================================================
// --- 2. BLOG MANAGEMENT PANEL ---
// ==================================================================
const initialBlogState = {
  title: '',
  author: '',
  content: '',
  image_url: '',
};

function BlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(initialBlogState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- Fetch All Blogs ---
  const fetchBlogs = () => {
    setIsLoading(true);
    api.fetch('/blogs/')
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

  // --- Open Create Form ---
  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentBlog(initialBlogState);
    setShowForm(true);
  };

  // --- Open Edit Form ---
  const handleEdit = (blog) => {
    setIsEditMode(true);
    setEditingId(blog.id);
    setCurrentBlog(blog);
    setShowForm(true);
  };

  // --- Handle Form Submission (Create/Update) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditMode ? `/blogs/${editingId}` : '/blogs/';
    const method = isEditMode ? 'PUT' : 'POST';

    api.fetch(url, {
      method: method,
      body: JSON.stringify(currentBlog),
    })
    .then(() => {
      setShowForm(false);
      fetchBlogs(); // Refresh list
    })
    .catch(err => setError(err.message));
  };

  // --- Handle Delete ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      api.fetch(`/blogs/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchBlogs(); // Refresh list
        })
        .catch(err => setError(err.message));
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
      
      {/* --- Blog Form Modal --- */}
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Blog Post' : 'Create New Post'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentBlog.title} onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})} />
            <FormInput label="Author" id="author" value={currentBlog.author} onChange={(e) => setCurrentBlog({...currentBlog, author: e.target.value})} />
            <FormInput label="Image URL" id="image_url" value={currentBlog.image_url} onChange={(e) => setCurrentBlog({...currentBlog, image_url: e.target.value})} required={false} />
            <FormTextarea label="Content" id="content" value={currentBlog.content} onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              {isEditMode ? 'Save Changes' : 'Create Post'}
            </button>
          </form>
        </FormModal>
      )}

      {/* --- List of Blogs --- */}
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

// ==================================================================
// --- 3. GALLERY MANAGEMENT PANEL ---
// ==================================================================
const initialImageState = {
  event_name: '',
  image_url: '',
};

function GalleryPanel() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(initialImageState);
  
  // Note: Edit for gallery images is less common as it's just two fields.
  // We will focus on Create and Delete.

  // --- Fetch All Images ---
  const fetchImages = () => {
    setIsLoading(true);
    api.fetch('/gallery/')
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

  // --- Open Create Form ---
  const handleCreate = () => {
    setCurrentImage(initialImageState);
    setShowForm(true);
  };

  // --- Handle Form Submission (Create) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    api.fetch('/gallery/', {
      method: 'POST',
      body: JSON.stringify(currentImage),
    })
    .then(() => {
      setShowForm(false);
      fetchImages(); // Refresh list
    })
    .catch(err => setError(err.message));
  };

  // --- Handle Delete ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      api.fetch(`/gallery/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchImages(); // Refresh list
        })
        .catch(err => setError(err.message));
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
      
      {/* --- Gallery Form Modal --- */}
      {showForm && (
        <FormModal title="Add New Image" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Event Name (for grouping)" id="event_name" value={currentImage.event_name} onChange={(e) => setCurrentImage({...currentImage, event_name: e.target.value})} />
            <FormInput label="Image URL (e.g., from Cloudinary)" id="image_url" value={currentImage.image_url} onChange={(e) => setCurrentImage({...currentImage, image_url: e.target.value})} />
            <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold">
              Add Image
            </button>
          </form>
        </FormModal>
      )}

      {/* --- List of Images --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center p-6"><LoadingSpinner /></div>
        ) : (
          images.map(image => (
            <div key={image.id} className="relative rounded-lg shadow-md overflow-hidden group">
              <img src={image.image_url} alt={image.event_name} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex flex-col justify-between p-2">
                <button 
                  onClick={() => handleDelete(image.id)} 
                  className="self-end p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <HiTrash size={16} />
                </button>
                <p className="text-white text-sm font-semibold truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.event_name}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================================================================
// --- 4. FORM MANAGEMENT PANEL ---
// ==================================================================
const initialFormState = {
  title: '',
  google_form_link: '',
  status: 'inactive',
};

function FormPanel() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentForm, setCurrentForm] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- Fetch All Forms ---
  const fetchForms = () => {
    setIsLoading(true);
    api.fetch('/forms')
      .then(data => {
        setForms(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch forms.');
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    fetchForms();
  }, []);

  // --- Open Create Form ---
  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentForm(initialFormState);
    setShowForm(true);
  };

  // --- Open Edit Form ---
  const handleEdit = (form) => {
    setIsEditMode(true);
    setEditingId(form.id);
    setCurrentForm(form);
    setShowForm(true);
  };

  // --- Handle Form Submission (Create/Update) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditMode ? `/forms/${editingId}` : '/forms';
    const method = isEditMode ? 'PUT' : 'POST';

    api.fetch(url, {
      method: method,
      body: JSON.stringify(currentForm),
    })
    .then(() => {
      setShowForm(false);
      fetchForms(); // Refresh list
    })
    .catch(err => setError(err.message));
  };

  // --- Handle Delete ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      api.fetch(`/forms/${id}`, { 
        method: 'DELETE',
      })
        .then(() => {
          fetchForms(); // Refresh list
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
      
      {/* --- Form Modal --- */}
      {showForm && (
        <FormModal title={isEditMode ? 'Edit Form' : 'Create New Form'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Title" id="title" value={currentForm.title} onChange={(e) => setCurrentForm({...currentForm, title: e.target.value})} />
            <FormInput label="Google Form Link" id="google_form_link" value={currentForm.google_form_link} onChange={(e) => setCurrentForm({...currentForm, google_form_link: e.target.value})} />
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

      {/* --- List of Forms --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center"><LoadingSpinner /></div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {forms.map(form => (
              <li key={form.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">{form.title}</h3>
                  <span className="text-sm text-gray-500">{form.status}</span>
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