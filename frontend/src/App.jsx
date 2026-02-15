import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

const Home = ({ onOpenModal }) => (
  <>
    <Hero onOpenModal={onOpenModal} /> 
    <Services />
    <Features />
  </>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(true);

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialLoginMode={modalMode} 
      />

      <div className={`min-h-screen bg-white flex flex-col ${isModalOpen ? 'blur-sm' : ''}`}>
        
        <Navbar onOpenModal={() => openModal(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenModal={openModal} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;