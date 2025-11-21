import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Import hooks
import cikvLandingBanner from '../assets/cikv_landing_banner.png';
import api from '../api';

// sampleEvents array is no longer needed, so it's removed.

export default function LandingPage() {
  // --- State for fetching events ---
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper function for placeholder images ---
  const getPlaceholderImage = (title) => {
    return `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
  };

  // --- Fetch events on component mount ---
  useEffect(() => {
    api.fetch('/events/')
      .then(data => {
        // --- Filter, Sort, and Slice ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = data
          .filter(event => new Date(event.date) >= today) // Get upcoming
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by soonest
          .slice(0, 3); // Get just the next 3

        setUpcomingEvents(filtered);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once

  return (
    // Use a cream/parchment background for the whole page
    <main className="bg-[#FFFBEB]">
      
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[100vh] md:h-[76vh]" style={{ backgroundImage: `url(${cikvLandingBanner})` }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* Welcome Introduction */}
      <section className="container mx-auto px-6 py-16 text-gray-700 text-center">
        <h3 className="text-4xl font-semibold mb-6 text-gray-800">
          Welcome to CIKV
        </h3>
        <div className="leading-relaxed max-w-3xl mx-auto text-lg space-y-4">
          <p>
            Centre for Indian Knowledge and Values (CIKV) embodies the rich tapestry of India's cultural heritage, ethical traditions, and profound wisdom. Our initiative is a heartfelt endeavor to preserve, promote, and imbibe the timeless principles and teachings that have been passed down through generations.
          </p>
          <p>
            At its core, CIKV seeks to bridge the ancient with the modern, creating a platform where awareness about our ethics and values becomes a guiding light for individuals and communities alike.
          </p>
        </div>
        
        {/* Lotus Divider - As seen in Screenshot 2 */}
        {/* REMOVED the lotus div */}
        
        {/* NEW "Read More" Link */}
        <Link 
          to="/about"
          className="inline-block mt-8 text-lg font-semibold text-amber-800 hover:text-amber-600 border-b-2 border-amber-800 hover:border-amber-600 transition-colors"
        >
          Read More About Our Mission
        </Link>
      </section>

      {/* Events Section (Maroon Background) */}
      <section className="bg-[#6D2828] py-16"> {/* Dark Maroon Background */}
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-semibold mb-10 text-center text-white">
            Upcoming Events
          </h3>
          
          {/* 3-Column Grid - Now dynamic */}
          {isLoading ? (
            <div className="text-center text-amber-100 text-lg">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-300 text-lg">Failed to load events.</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  // --- Event Card ---
                  <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <img 
                      src={event.image_url || getPlaceholderImage(event.title)} 
                      alt={event.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.src = getPlaceholderImage(event.title); }}
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-2xl font-semibold mb-2 text-gray-800">{event.title}</h4>
                      <p className="text-gray-600 mb-4 flex-grow">{event.description.substring(0, 100)}...</p>
                      {/* Updated Link to point to the main events page */}
                      <Link 
                        to="/events" 
                        className="inline-block bg-yellow-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-yellow-600 text-center font-semibold w-max"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                  // --- End of Event Card ---
                ))
              ) : (
                <p className="text-amber-100 text-lg text-center md:col-span-3">
                  No upcoming events scheduled. Please check back soon!
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <footer className="bg-yellow-100 border-t border-yellow-300 py-6">
        <div className="container mx-auto px-6 text-center text-yellow-800">
          <p className="font-semibold text-lg">Join our growing community</p>
        </div>
      </footer>
      
    </main>
  );
}