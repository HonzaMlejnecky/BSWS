import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, initialLoginMode }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialLoginMode);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsLoginMode(initialLoginMode);
      document.body.style.overflow = 'hidden';
    } else {
      setShowModal(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialLoginMode]);

  if (!isOpen && !showModal) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${showModal ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`}
      onClick={onClose} 
    >
      
      <div 
        className={`bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300 transform
          ${showModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
        >
          <FaTimes size={20} />
        </button>

        <div className="p-8 pb-0 text-center">
          <h2 className="text-2xl font-bold text-[#004CAF] mb-6">
            {isLoginMode ? 'Vítejte zpět!' : 'Vytvořit účet'}
          </h2>
          
          <div className="flex bg-gray-100 p-1 rounded-full relative mb-8">
            <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#004CAF] rounded-full transition-all duration-300 shadow-sm left-1
                ${isLoginMode ? 'translate-x-0' : 'translate-x-full'}`}
            ></div>
            
            <button 
                className={`flex-1 py-2 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${isLoginMode ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLoginMode(true)}
            >
                Přihlášení
            </button>
            <button 
                className={`flex-1 py-2 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300 ${!isLoginMode ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setIsLoginMode(false)}
            >
                Registrace
            </button>
          </div>
        </div>

        <form className="p-8 pt-0 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input 
              type="email" 
              placeholder="Váš e-mail" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#004CAF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Heslo" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#004CAF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {!isLoginMode && (
            <div className="animate-fade-in-down">
              <input 
                type="password" 
                placeholder="Potvrzení hesla" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#004CAF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          )}

          {isLoginMode && (
            <div className="text-right">
              <a href="#" className="text-sm text-[#004CAF] hover:underline text-center">Zapomněli jste heslo?</a>
            </div>
          )}

          <button className="w-full bg-[#004CAF] text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 mt-6 cursor-pointer">
            {isLoginMode ? 'Přihlásit se' : 'Zaregistrovat se'}
          </button>
        </form>
      </div>
    </div>
  );
};


const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default AuthModal;