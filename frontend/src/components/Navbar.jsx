import React from 'react';
import logoSvg from '../assets/lastlogo.svg';

const Navbar = ({ onOpenModal }) => {
  return (
    <nav className="w-full bg-white py-6">
      <div className="container mx-auto px-6 relative flex items-center justify-center">
        
        <div className="flex items-center">
          <img 
            src={logoSvg} 
            alt="Mage Logo" 
            className="h-16 md:h-24 object-contain" 
          />
        </div>

        <div className="absolute right-6">
          <button 
            onClick={onOpenModal}
            className="px-8 py-1.5 border border-[#004CAF] text-[#004CAF] rounded-full text-sm font-medium hover:bg-blue-50 transition-all duration-200 cursor-pointer"
          >
            login
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;