import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cikvLogo from '../assets/cikv_logo.jpeg'; // Assuming you have the logo

import api from '../api';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await api.fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, password: password })
      });
      
      // --- ON SUCCESS ---
      localStorage.setItem('authToken', data.access_token);
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FFFBEB] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 lg:p-10">
        <div className="text-center">
          <img src={cikvLogo} alt="CIKV Logo" className="w-20 h-20 mx-auto rounded-full" />
          <h1 className="text-3xl font-bold text-amber-900 mt-4 font-serif">
            Core Team Login
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back. Please enter your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* User ID Input */}
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

          {/* Password Input */}
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

          {/* Error Message */}
          {error && (
            <div className="text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-[#6D2828] text-white px-8 py-3 rounded-md shadow-lg hover:bg-red-900 text-lg font-semibold transition duration-300 ease-in-out disabled:bg-gray-400"
            >
              {isSubmitting ? <LoadingSpinner /> : 'Login'}
            </button>
          </div>

          <div className="text-center text-gray-600">
            Don't have an account? 
            <Link to="/register" className="font-semibold text-amber-800 hover:text-amber-600 ml-1">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

// --- Helper: Loading Spinner ---
function LoadingSpinner() {
  return (
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}