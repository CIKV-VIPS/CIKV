"use client";

import { useState, useEffect } from 'react';

export default function Forms() {
  const [activeForms, setActiveForms] = useState<any[]>([]);
  const [inactiveForms, setInactiveForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = () => {
      setIsLoading(true);
      fetch('/api/forms')
        .then(res => {
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Ensure data is an array
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format from API');
          }
          const active = data.filter((form: any) => form.status === 'active');
          const inactive = data.filter((form: any) => form.status === 'inactive');
          setActiveForms(active);
          setInactiveForms(inactive);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Form fetch error:', err);
          setError(err.message || 'Failed to fetch forms.');
          setIsLoading(false);
        });
    };
    fetchForms();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-amber-900 font-serif mb-8">Forms</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {isLoading ? (
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div>
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-amber-800 font-serif mb-6">Active Forms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeForms.length > 0 ? (
                activeForms.map(form => (
                  <div key={form.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-semibold text-amber-900 mb-4">{form.title}</h3>
                    <a
                      href={form.googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-amber-700 font-semibold transition-colors"
                    >
                      Open Form
                    </a>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No active forms available at the moment.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-amber-800 font-serif mb-6">Inactive Forms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inactiveForms.length > 0 ? (
                inactiveForms.map(form => (
                  <div key={form.id} className="bg-gray-200 rounded-lg shadow-inner p-6 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">{form.title}</h3>
                    <p className="text-gray-500">This form is currently not active.</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No inactive forms.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
