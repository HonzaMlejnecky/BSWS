import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/lastlogo.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenModal }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white py-6 border-b border-gray-100">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={logoSvg} alt="Mage Logo" className="h-16 md:h-20 object-contain" />
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/subscription" className="hover:text-blue-600">Subscription</Link>
            <Link to="/projects" className="hover:text-blue-600">Projects</Link>
            <Link to="/databases" className="hover:text-blue-600">Databases</Link>
            <Link to="/ftp" className="hover:text-blue-600">FTP</Link>
            <Link to="/dashboard/emails" className="hover:text-blue-600">Email</Link>
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
            <button
              onClick={onOpenModal}
              className="px-8 py-1.5 border border-[#004CAF] text-[#004CAF] rounded-full text-sm font-medium hover:bg-blue-50"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
