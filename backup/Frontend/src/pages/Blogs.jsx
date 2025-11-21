import React, { useState, useEffect } from 'react';
import { HiArrowLeft } from 'react-icons/hi'; // Using a standard icon for "back"
import cikvBanner2 from '../assets/cikv_banner2.png';
import api from '../api';

// --- Main Blogs Page Component ---
// This component manages whether to show the 'list' or 'detail' view.
export default function BlogsPage() {
  const [view, setView] = useState({ page: 'list', blogId: null });

  if (view.page === 'list') {
    return <BlogList setView={setView} />;
  }

  if (view.page === 'detail') {
    return <BlogDetail blogId={view.blogId} setView={setView} />;
  }

  return null; // Should not happen
}


// --- 1. Blog List View ---
// Fetches and displays all blogs in a grid.
function BlogList({ setView }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blogs from your Flask backend API
    // (Adding /api/ prefix for consistency with your other pages)
    api.fetch('/blogs/')
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // Helper function to create a placeholder image
  const getPlaceholderImage = (title) => {
    return `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
  };

  if (isLoading) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="CIKV Blog" />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="CIKV Blog" />
        <div className="container mx-auto px-6 py-12 text-center text-red-600">
          <h2 className="text-2xl font-semibold">Failed to load blog posts.</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB]">
      {/* 1. Hero Banner */}
      <PageBanner title="CIKV Blog" subtitle="Reflections, Teachings, and Insights" />

      {/* 2. Blog Grid (on Cream BG) */}
      <section className="container mx-auto px-6 py-20">
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                setView={setView}
                getPlaceholder={getPlaceholderImage}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            No blog posts have been published yet. Please check back soon!
          </p>
        )}
      </section>
    </main>
  );
}


// --- 2. Blog Detail View ---
// Fetches and displays one single blog post.
function BlogDetail({ blogId, setView }) {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch a single blog from your API
    api.fetch(`/blogs/${blogId}`)
      .then(data => {
        setBlog(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [blogId]); // Re-fetch if blogId changes

  // Helper function to create a placeholder image
  const getPlaceholderImage = (title) => {
    return `https://placehold.co/1200x600/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
  };
  
  if (isLoading) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Failed to load post.</h2>
          <button
            onClick={() => setView({ page: 'list', blogId: null })}
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to all posts
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB] py-12 md:py-20">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => setView({ page: 'list', blogId: null })}
          className="mb-8 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
        >
          <HiArrowLeft className="mr-2" />
          Back to all posts
        </button>

        {/* Blog Post Content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <img
            src={blog.image_url || getPlaceholderImage(blog.title)}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => { e.target.src = getPlaceholderImage(blog.title); }}
          />
          <div className="p-6 md:p-10">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-serif">
              {blog.title}
            </h1>

            {/* Author and Date */}
            <div className="mb-6 text-gray-600 text-lg">
              By <span className="font-semibold text-amber-800">{blog.author}</span> on {formatDate(blog.created_at)}
            </div>
            
            {/* Content */}
            {/* Using whitespace-pre-wrap to respect newlines from the backend */}
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// --- 3. Reusable Blog Card Component ---
function BlogCard({ blog, setView, getPlaceholder }) {
  const { id, title, author, content, image_url, created_at } = blog;

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
      <img
        src={image_url || getPlaceholder(title)}
        alt={title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = getPlaceholder(title); }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-amber-900 mb-3 font-serif">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          By <span className="font-medium text-amber-800">{author}</span> | {formatDate(created_at)}
        </p>
        <p className="text-sm leading-relaxed mb-5 flex-grow">
          {content.substring(0, 120)}...
        </p>
        <button
          onClick={() => setView({ page: 'detail', blogId: id })}
          className="mt-auto inline-block text-amber-800 hover:text-amber-600 font-bold self-start"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  );
}


// --- 4. Helper Components (Copied from other pages for consistency) ---

function PageBanner({ title, subtitle }) {
  return (
    <section 
      className="relative bg-cover bg-center h-[30vh]" 
      style={{ backgroundImage: `url(${cikvBanner2})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container relative z-10 mx-auto px-6 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white font-serif shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-2xl text-white mt-2 shadow-sm">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
  );
}

// Helper to format date nicely
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Assuming dates are stored as UTC
  });
}