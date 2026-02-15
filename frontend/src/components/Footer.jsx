import React, { useState, useEffect, useRef } from 'react'; 
import whiteSvg from '../assets/white.svg';
import iconSvg from '../assets/icon.svg';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#004CAF] text-white pt-16 pb-8 w-full mt-auto relative font-sans">
      
      <div className={`absolute bottom-full right-6 md:right-16 mb-[-24px] z-10 pointer-events-none transition-all duration-1000 ease-out transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
      `}>
         <img 
           src={iconSvg} 
           alt="Dekorace" 
           className="w-24 md:w-40" 
         />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-2">
            <img src={whiteSvg} alt="Mage White Logo" className="h-24" />
            <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
              Poskytujeme magicky rychlý a bezpečný hosting pro vaše projekty. Vaše data jsou u nás v bezpečí.
            </p>
            
            <div className="flex gap-4">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Služby</h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition">Webhosting</a></li>
              <li><a href="#" className="hover:text-white transition">VPS Servery</a></li>
              <li><a href="#" className="hover:text-white transition">Dedikované servery</a></li>
              <li><a href="#" className="hover:text-white transition">Registrace domén</a></li>
              <li><a href="#" className="hover:text-white transition">SSL Certifikáty</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Společnost</h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition">O nás</a></li>
              <li><a href="#" className="hover:text-white transition">Kariéra</a> <span className="text-xs bg-blue-500 px-2 py-0.5 rounded text-white ml-2">Hiring</span></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Kontakt</a></li>
              <li><a href="#" className="hover:text-white transition">Partneři</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Podpora</h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><a href="#" className="hover:text-white transition">Centrum nápovědy</a></li>
              <li><a href="#" className="hover:text-white transition">Stav služeb (Status)</a></li>
              <li><a href="#" className="hover:text-white transition">Nahlásit zneužití</a></li>
              <li><a href="#" className="hover:text-white transition">Obchodní podmínky</a></li>
              <li><a href="#" className="hover:text-white transition">Ochrana soukromí</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
          <p>&copy; 2026 Mage Hosting. Všechna práva vyhrazena.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a 
    href="#" 
    className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-white hover:text-[#004CAF] transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;