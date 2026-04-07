import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/lastlogo.svg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white py-6">
      <div className={`container mx-auto px-6 relative flex items-center ${isAuthenticated ? 'justify-between gap-4' : 'justify-center'}`}>

        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
          <img src={logoSvg} alt="Mage Logo" className="h-16 md:h-24 object-contain" />
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link to="/dashboard" className="hover:text-blue-600">Přehled</Link>
            <Link to="/subscription" className="hover:text-blue-600">Tarif</Link>
            <Link to="/projects/new" className="hover:text-blue-600">Nový projekt</Link>
            <Link to="/databases" className="hover:text-blue-600">Databáze</Link>
            <Link to="/emails" className="hover:text-blue-600">E-maily</Link>
            <Link to="/ftp" className="hover:text-blue-600">FTP</Link>
          </div>
        )}

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="px-6 py-2 border border-red-400 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            Odhlásit se
          </button>
        ) : (
          <div className="absolute right-6 flex gap-3">
            <Link to="/login" className="px-8 py-1.5 border border-[#004CAF] text-[#004CAF] rounded-full text-sm font-medium hover:bg-blue-50 transition-all duration-200">Přihlášení</Link>
            <Link to="/register" className="px-8 py-1.5 bg-[#004CAF] text-white rounded-full text-sm font-medium hover:bg-[#003d96] transition-all duration-200">Registrace</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
