import React from 'react';
import screenPng from '../assets/screen.png';

const Hero = ({ onOpenModal }) => {
  return (
    <section className="py-12 md:py-24 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-text {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-image {
          opacity: 0;
          animation: slideInRight 1s ease-out forwards;
          animation-delay: 0.6s;
        }
      `}</style>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-0">
          
          <div className="text-center lg:text-left space-y-8 lg:pr-12 z-10 relative animate-text order-last lg:order-first">
            <h1 className="text-4xl md:text-6xl font-bold text-[#004CAF] leading-tight">
              Vaše weby pod ochranou digitálního mága
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Poskytujeme neproniknutelné zázemí pro vaše projekty. Od bleskových databází po bezpečný přenos souborů.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              
              <button 
                onClick={() => onOpenModal(false)}
                className="bg-[#004CAF] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                vytvořit účet
              </button>
              
              <button className="border-2 border-[#004CAF] text-[#004CAF] px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                zjistit více
              </button>
            </div>
          </div>

          <div className="relative order-first lg:order-last mb-12 lg:mb-0 lg:mt-0">
            <div className="animate-image shadow-2xl bg-gray-100 rounded-3xl lg:rounded-l-[3rem] lg:rounded-r-none overflow-hidden lg:w-[120%] lg:ml-[10%] relative z-0">
                <img 
                  src={screenPng} 
                  alt="Ukázka aplikace Mage" 
                  className="w-full h-auto object-cover"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;