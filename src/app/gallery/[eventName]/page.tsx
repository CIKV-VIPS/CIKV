"use client";

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { HiArrowLeft, HiOutlineX } from 'react-icons/hi';

const LoadingSpinner = () => {
  return (
    <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
  );
};

interface AlbumPageProps {
  params: any;
}

export default function AlbumDetailPage({ params }: AlbumPageProps) {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const eventName = decodeURIComponent(params.eventName);

  useEffect(() => {
    fetch(`/api/gallery/events/${eventName}`)
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [eventName]);

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
          <Link
            href="/gallery"
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to Gallery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB] min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <Link
            href="/gallery"
            className="mb-4 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to Gallery
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 font-serif">
            {eventName}
          </h1>
        </div>

        {images.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map(image => (
              <SafeImage
                key={image.id}
                src={image.imageUrl}
                alt={image.eventName}
                width={600}
                height={400}
                className="w-full rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedImage(image.imageUrl)}
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

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-amber-300"
            aria-label="Close image view"
          >
            <HiOutlineX size={32} />
          </button>
          <SafeImage
            src={selectedImage}
            alt="Full-size view"
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
