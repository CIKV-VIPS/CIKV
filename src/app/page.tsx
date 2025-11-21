import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import prisma from '@/lib/prisma';

async function getUpcomingEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: {
      date: 'asc',
    },
    take: 3,
  });

  return events;
}

const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
};

const isValidImageSrc = (src?: string | null) => {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  // allow absolute http(s), data URLs and root-relative paths
  return /^https?:\/\//i.test(trimmed) || /^data:/i.test(trimmed) || trimmed.startsWith('/');
};

export default async function LandingPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <main className="bg-[#FFFBEB]">
      <section className="relative bg-cover bg-center h-[100vh] md:h-[76vh]" style={{ backgroundImage: `url(/assets/cikv_landing_banner.png)` }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      <section className="container mx-auto px-6 py-16 text-gray-700 text-center">
        <h3 className="text-4xl font-semibold mb-6 text-gray-800">
          Welcome to CIKV
        </h3>
        <div className="leading-relaxed max-w-3xl mx-auto text-lg space-y-4">
          <p>
            Centre for Indian Knowledge and Values (CIKV) embodies the rich tapestry of India&apos;s cultural heritage, ethical traditions, and profound wisdom. Our initiative is a heartfelt endeavor to preserve, promote, and imbibe the timeless principles and teachings that have been passed down through generations.
          </p>
          <p>
            At its core, CIKV seeks to bridge the ancient with the modern, creating a platform where awareness about our ethics and values becomes a guiding light for individuals and communities alike.
          </p>
        </div>
        <Link 
          href="/about"
          className="inline-block mt-8 text-lg font-semibold text-amber-800 hover:text-amber-600 border-b-2 border-amber-800 hover:border-amber-600 transition-colors"
        >
          Read More About Our Mission
        </Link>
      </section>

      <section className="bg-[#6D2828] py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-semibold mb-10 text-center text-white">
            Upcoming Events
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <SafeImage
                    src={isValidImageSrc(event.imageUrl) ? (event.imageUrl as string) : getPlaceholderImage(event.title)}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-2xl font-semibold mb-2 text-gray-800">{event.title}</h4>
                    <p className="text-gray-600 mb-4 flex-grow">{event.description.substring(0, 100)}...</p>
                    <Link 
                      href="/events" 
                      className="inline-block bg-yellow-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-yellow-600 text-center font-semibold w-max"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-amber-100 text-lg text-center md:col-span-3">
                No upcoming events scheduled. Please check back soon!
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-yellow-100 border-t border-yellow-300 py-6">
        <div className="container mx-auto px-6 text-center text-yellow-800">
          <p className="font-semibold text-lg">Join our growing community</p>
        </div>
      </footer>
    </main>
  );
}