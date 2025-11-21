import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear the user's session/token here.
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">Dashboard</div>
        <nav className="flex-grow">
          <Link to="/forms" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
            Forms
          </Link>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {children}
      </div>
    </div>
  );
}
