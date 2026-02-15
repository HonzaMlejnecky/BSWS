import React, { useEffect, useState, useRef } from 'react';
import { FaBolt, FaMagic, FaBoxOpen } from "react-icons/fa";

const ServiceCard = ({ icon, title, text, delay, isVisible }) => (
  <div 
    className={`flex-1 border border-[#004CAF] rounded-3xl p-10 flex flex-col items-center text-center bg-white hover:shadow-lg min-h-[350px] justify-center group transition-all duration-700 ease-out transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
    `}
    style={{ transitionDelay: delay }} 
  >
    
    <div className="text-black text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    
    <h3 className="text-[#004CAF] font-bold text-xl mb-4">{title}</h3>
    
    <p className="text-gray-700 text-sm leading-relaxed max-w-[250px] mx-auto">
      {text}
    </p>
  </div>
);

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        <h2 className={`text-center text-3xl font-bold text-[#004CAF] mb-20 transition-all duration-700 delay-0 
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Naše služby
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <ServiceCard 
            icon={<FaBolt />} 
            title="Bleskový web" 
            text="Hostujte své stránky na našem optimalizovaném serveru s vysokou dostupností."
            isVisible={isVisible}
            delay="0ms"
          />
          <ServiceCard 
            icon={<FaMagic />} 
            title="Magické databáze" 
            text="Vaše data jsou uložena v bezpečí a dostupná během mrknutí oka."
            isVisible={isVisible}
            delay="200ms"
          />
          <ServiceCard 
            icon={<FaBoxOpen />} 
            title="Temné úložiště" 
            text="Snadný a šifrovaný přístup k vašim souborům kdykoliv a odkudkoliv."
            isVisible={isVisible}
            delay="400ms"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;