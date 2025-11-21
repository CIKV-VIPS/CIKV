import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/1200x600/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id, 10) },
  });
  return event;
}

interface EventPageProps {
  params: any;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Event not found.</h2>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to all events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB] py-12 md:py-20">
      <div className="container mx-auto px-6">
        <Link
          href="/events"
          className="mb-8 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
        >
          <HiArrowLeft className="mr-2" />
          Back to all events
        </Link>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <SafeImage
            src={event.imageUrl || getPlaceholderImage(event.title)}
            alt={event.title}
            width={1200}
            height={600}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                {event.category || 'Event'}
              </span>
              <span className="text-lg font-semibold text-amber-900">
                {formatDate(event.date.toISOString())}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 font-serif">
              {event.title}
            </h1>
            
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
