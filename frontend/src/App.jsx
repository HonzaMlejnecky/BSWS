import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DashboardPage from "./Dashboard.jsx";
import ProjectsPage from "./ProjectPage.jsx";
import DatabasesPage from "./DatabasePage.jsx";
import WebmailPage from "./WbmailPage.jsx";
import EmailPage from "./EmailPage.jsx";
import FTPPage from "./FTPPage.jsx";

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

      <div className={`min-h-screen bg-white flex flex-col`}>
        
        <Navbar onOpenModal={() => openModal(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenModal={openModal} />} />
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/projects" element={<ProjectsPage/>}/>
            <Route path="/databases" element={<DatabasesPage/>}/>
            <Route path="/webmail" element={<WebmailPage/>}/>
            <Route path="/dashboard/emails" element={<EmailPage/>}/>
            <Route path="/ftp" element={<FTPPage/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;