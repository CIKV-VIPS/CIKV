"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
};

export default function RegisterPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FFFBEB] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 lg:p-10">
        <div className="text-center">
          <Image src="/assets/cikv_logo.jpeg" alt="CIKV Logo" width={80} height={80} className="mx-auto rounded-full" />
          <h1 className="text-3xl font-bold text-amber-900 mt-4 font-serif">
            Register New User
          </h1>
          <p className="text-gray-600 mt-2">
            Create an account to join the core team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="user_id" className="block text-lg font-semibold text-gray-700">
              User ID
            </label>
            <input 
              type="text" 
              id="user_id" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" 
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" 
            />
          </div>

          {error && (
            <div className="text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 font-semibold text-center">
              Registration successful! Redirecting to login...
            </div>
          )}

          <div>
            <button 
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex justify-center items-center bg-[#6D2828] text-white px-8 py-3 rounded-md shadow-lg hover:bg-red-900 text-lg font-semibold transition duration-300 ease-in-out disabled:bg-gray-400"
            >
              {isSubmitting ? <LoadingSpinner /> : 'Register'}
            </button>
          </div>

          <div className="text-center text-gray-600">
            Already have an account? 
            <Link href="/login" className="font-semibold text-amber-800 hover:text-amber-600 ml-1">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
