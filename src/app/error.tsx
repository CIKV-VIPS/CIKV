'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          We encountered an issue while loading this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block bg-amber-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-amber-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
