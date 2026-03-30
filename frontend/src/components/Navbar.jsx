import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/lastlogo.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white py-6 border-b border-gray-100">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
          <img src={logoSvg} alt="Mage Logo" className="h-16 md:h-20 object-contain" />
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/plan" className="hover:text-blue-600">Subscription</Link>
            <Link to="/projects/new" className="hover:text-blue-600">Create Project</Link>
            <Link to="/databases" className="hover:text-blue-600">Databases</Link>
          </div>
        )}

        <div>
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-6 py-2 border border-red-400 text-red-500 rounded-full text-sm font-medium hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-6 py-2 border border-[#004CAF] text-[#004CAF] rounded-full text-sm font-medium hover:bg-blue-50">Login</Link>
              <Link to="/register" className="px-6 py-2 bg-[#004CAF] text-white rounded-full text-sm font-medium hover:bg-[#003d96]">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
