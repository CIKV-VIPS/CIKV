"use client";

// Force dynamic rendering - no static caching
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { HiArrowLeft } from 'react-icons/hi';

const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const PageBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <section 
      className="relative bg-cover bg-center h-[30vh]" 
      style={{ backgroundImage: `url(/assets/cikv_banner2.png)` }}
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
};

const LoadingSpinner = () => {
  return (
    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const { id, title, description, date, category, imageUrl } = event;

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
      <SafeImage
        src={imageUrl || getPlaceholderImage(title)}
        alt={title}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
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
        <Link
          href={`/events/${id}`}
          className="mt-auto inline-block text-amber-800 hover:text-amber-600 font-bold self-start"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingFilter, setUpcomingFilter] = useState('All');
  const [pastFilter, setPastFilter] = useState('All');

  useEffect(() => {
    fetch('/api/events')
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.message || 'Failed to fetch events');
          });
        }
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(events.map(event => event.category).filter(Boolean))];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .filter(event => upcomingFilter === 'All' || event.category === upcomingFilter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) < today)
    .filter(event => pastFilter === 'All' || event.category === pastFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  return (
    <main className="bg-[#FFFBEB]">
      <PageBanner title="CIKV Events" subtitle="Workshops, Seminars, and Cultural Gatherings" />

      <section className="container mx-auto px-6 py-20">
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
              <EventCard key={event.id} event={event} />
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

      <section className="container mx-auto px-6 py-20">
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

        {pastEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} />
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
