import React, { useState, useEffect } from 'react';
// Removed unused 'Link' import
import { HiArrowLeft, HiOutlineX } from 'react-icons/hi';
import cikvBanner2 from '../assets/cikv_banner2.png';
import api from '../api';

// --- Main Gallery Page Component ---
// This component manages whether to show the 'album-list' or 'album-detail' view.
export default function GalleryPage() {
  const [view, setView] = useState({ page: 'album-list', eventName: null });

  if (view.page === 'album-list') {
    return <AlbumList setView={setView} />;
  }

  if (view.page === 'album-detail') {
    return <AlbumDetail eventName={view.eventName} setView={setView} />;
  }

  return null; // Should not happen
}


// --- 1. Album List View ---
// Fetches ALL images and groups them by "event_name" into albums.
function AlbumList({ setView }) {
  const [albums, setAlbums] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- UPDATED API PATH ---
    // Fetch all images from your Flask backend API
    api.fetch('/gallery/')
      .then(data => {
        // Group the images by event_name
        const grouped = data.reduce((acc, image) => {
          const key = image.event_name;
          if (!acc.has(key)) {
            acc.set(key, []);
          }
          acc.get(key).push(image);
          return acc;
        }, new Map());
        
        setAlbums(grouped);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="Gallery" />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="Gallery" />
        <div className="container mx-auto px-6 py-12 text-center text-red-600">
          <h2 className="text-2xl font-semibold">Failed to load gallery.</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB]">
      {/* 1. Hero Banner */}
      <PageBanner title="CIKV Gallery" subtitle="Moments from Our Workshops, Seminars, and Events" />

      {/* 2. Album Grid (on Cream BG) */}
      <section className="container mx-auto px-6 py-20">
        {albums.size > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Convert map entries to an array and map over them */}
            {Array.from(albums.entries()).map(([eventName, images]) => (
              <AlbumCard
                key={eventName}
                eventName={eventName}
                images={images}
                setView={setView}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            No images have been added to the gallery yet.
          </p>
        )}
      </section>
    </main>
  );
}

// --- 2. Album Detail View ---
// Fetches and displays all images for a SINGLE event.
function AlbumDetail({ eventName, setView }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For lightbox

  useEffect(() => {
    // --- UPDATED API PATH ---
    // Fetch all images for this specific event
    api.fetch(`/gallery/events/${encodeURIComponent(eventName)}`)
      .then(data => {
        setImages(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [eventName]); // Re-fetch if eventName changes

  if (isLoading) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
          <button
            onClick={() => setView({ page: 'album-list', eventName: null })}
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to Gallery
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB] min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-6">
        {/* Back Button & Title */}
        <div className="mb-10">
          <button
            onClick={() => setView({ page: 'album-list', eventName: null })}
            className="mb-4 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to Gallery
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 font-serif">
            {eventName}
          </h1>
        </div>

        {/* --- Image Masonry Grid --- */}
        {/* This uses CSS columns for a simple, elegant masonry effect */}
        {images.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map(image => (
              <img
                key={image.id}
                src={image.image_url}
                alt={image.event_name}
                className="w-full rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedImage(image.image_url)}
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            No images found for this event.
          </p>
        )}

      </div>

      {/* --- Lightbox Modal --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedImage(null)} // Click background to close
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-amber-300"
            aria-label="Close image view"
          >
            <HiOutlineX size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full-size view"
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent image click from closing modal
          />
        </div>
      )}
    </main>
  );
}


// --- 3. Reusable Album Card Component ---
function AlbumCard({ eventName, images, setView }) {
  const coverImage = images[0]?.image_url;
  const imageCount = images.length;
  
  // Placeholder in case of missing image
  const placeholder = `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(eventName)}`;

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 cursor-pointer"
      onClick={() => setView({ page: 'album-detail', eventName: eventName })}
    >
      <img
        src={coverImage || placeholder}
        alt={eventName}
        className="w-full h-56 object-cover"
        onError={(e) => { e.target.src = placeholder; }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-amber-900 mb-2 font-serif">
          {eventName}
        </h3>
        <p className="text-gray-600">
          {imageCount} {imageCount === 1 ? 'Photo' : 'Photos'}
        </p>
      </div>
    </div>
  );
}


// --- 4. Helper Components (Copied from EventsPage for portability) ---

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