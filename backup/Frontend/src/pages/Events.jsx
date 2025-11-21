import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi'; // Using a standard icon for "back"
import cikvBanner2 from '../assets/cikv_banner2.png';
import api from '../api';

// --- Main Events Page Component ---
// This component manages whether to show the 'list' or 'detail' view.
export default function EventsPage() {
  const [view, setView] = useState({ page: 'list', eventId: null });

  if (view.page === 'list') {
    return <EventsList setView={setView} />;
  }

  if (view.page === 'detail') {
    return <EventDetail eventId={view.eventId} setView={setView} />;
  }

  return null; // Should not happen
}


// --- 1. Events List View ---
// Fetches and displays all events, separated into Upcoming and Past.
function EventsList({ setView }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- NEW: State for category filters ---
  const [upcomingFilter, setUpcomingFilter] = useState('All');
  const [pastFilter, setPastFilter] = useState('All');

  useEffect(() => {
    // Fetch events from your Flask backend API
    api.fetch('/events/')
      .then(data => {
        setEvents(data);
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

  // --- NEW: Get all unique categories for filters ---
  const categories = ['All', ...new Set(events.map(event => event.category).filter(Boolean))];

  // --- Event Separation Logic (UPDATED with filters) ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .filter(event => upcomingFilter === 'All' || event.category === upcomingFilter) // Filter by category
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort ascending (closest first)

  const pastEvents = events
    .filter(event => new Date(event.date) < today)
    .filter(event => pastFilter === 'All' || event.category === pastFilter) // Filter by category
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending (most recent first)


  // --- Render States ---
  if (isLoading) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="Our Events" />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen">
        <PageBanner title="Our Events" />
        <div className="container mx-auto px-6 py-12 text-center text-red-600">
          <h2 className="text-2xl font-semibold">Failed to load events.</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  // --- Main Render ---
  return (
    <main className="bg-[#FFFBEB]">
      {/* 1. Hero Banner */}
      <PageBanner title="CIKV Events" subtitle="Workshops, Seminars, and Cultural Gatherings" />

      {/* 2. Upcoming Events Section (on Cream BG) */}
      <section className="container mx-auto px-6 py-20">
        {/* --- UPDATED: Title and Filter Row --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 font-serif mb-4 md:mb-0">
            Upcoming Events
          </h2>
          {categories.length > 1 && (
            <div className="flex items-center space-x-2">
              <label htmlFor="upcoming-filter" className="font-semibold text-amber-800">Filter:</label>
              <select
                id="upcoming-filter"
                value={upcomingFilter}
                onChange={(e) => setUpcomingFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                setView={setView} 
                getPlaceholder={getPlaceholderImage}
                cardBg="bg-white" // White card on cream bg
                textBg="text-gray-800"
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            {upcomingFilter === 'All'
              ? 'No upcoming events scheduled. Please check back soon!'
              : `No upcoming events found for the category "${upcomingFilter}".`
            }
          </p>
        )}
      </section>

      {/* 3. Recent Events Section (on Cream BG) - UPDATED */}
      {/* This section will now always show, even if empty */}
      <section className="container mx-auto px-6 py-20">
        {/* --- UPDATED: Title and Filter Row --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 font-serif mb-4 md:mb-0">
            Recent Events
          </h2>
          {categories.length > 1 && (
            <div className="flex items-center space-x-2">
              <label htmlFor="past-filter" className="font-semibold text-amber-800">Filter:</label>
              <select
                id="past-filter"
                value={pastFilter}
                onChange={(e) => setPastFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* --- UPDATED: Conditional logic moved inside --- */}
        {pastEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                setView={setView} 
                getPlaceholder={getPlaceholderImage}
                cardBg="bg-white" // White card on cream bg
                textBg="text-gray-800"
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            {pastFilter === 'All'
              ? 'No recent events to show.'
              : `No recent events found for the category "${pastFilter}".`
            }
          </p>
        )}
      </section>
    </main>
  );
}


// --- 2. Event Detail View ---
// Fetches and displays one single event.
function EventDetail({ eventId, setView }) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch a single event from your API
    api.fetch(`/events/${eventId}`)
      .then(data => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [eventId]); // Re-fetch if eventId changes

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

  if (error || !event) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Failed to load event.</h2>
          <button
            onClick={() => setView({ page: 'list', eventId: null })}
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to all events
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
          onClick={() => setView({ page: 'list', eventId: null })}
          className="mb-8 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
        >
          <HiArrowLeft className="mr-2" />
          Back to all events
        </button>

        {/* Event Content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <img
            src={event.image_url || getPlaceholderImage(event.title)}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => { e.target.src = getPlaceholderImage(event.title); }}
          />
          <div className="p-6 md:p-10">
            {/* Category and Date */}
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                {event.category || 'Event'}
              </span>
              <span className="text-lg font-semibold text-amber-900">
                {formatDate(event.date)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 font-serif">
              {event.title}
            </h1>
            
            {/* Description */}
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// --- 3. Reusable Event Card Component ---
function EventCard({ event, setView, getPlaceholder, cardBg, textBg }) {
  const { id, title, description, date, category, image_url } = event;

  return (
    <div className={`${cardBg} ${textBg} rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105`}>
      <img
        src={image_url || getPlaceholder(title)}
        alt={title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = getPlaceholder(title); }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
            {category || 'Event'}
          </span>
          <span className="text-sm font-semibold text-amber-800">
            {formatDate(date)}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-amber-900 mb-3 font-serif flex-grow">
          {title}
        </h3>
        <p className="text-sm leading-relaxed mb-5">
          {description.substring(0, 100)}...
        </p>
        <button
          onClick={() => setView({ page: 'detail', eventId: id })}
          className="mt-auto inline-block text-amber-800 hover:text-amber-600 font-bold self-start"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  );
}


// --- 4. Helper Components ---

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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Assuming dates are stored as UTC
  });
}