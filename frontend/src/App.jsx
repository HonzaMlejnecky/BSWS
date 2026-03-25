import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DashboardPage from './pages/Dashboard.jsx';
import ProjectsPage from './pages/ProjectPage.jsx';
import DatabasesPage from './pages/DatabasePage.jsx';
import EmailPage from './pages/EmailPage.jsx';
import FTPPage from './pages/FTPPage.jsx';
import SubscriptionPage from './SubscrioptionPage.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute';

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

  return (
    <Router>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialLoginMode={modalMode} />
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar onOpenModal={() => openModal(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenModal={openModal} />} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/databases" element={<ProtectedRoute><DatabasesPage /></ProtectedRoute>} />
            <Route path="/dashboard/emails" element={<ProtectedRoute><EmailPage /></ProtectedRoute>} />
            <Route path="/ftp" element={<ProtectedRoute><FTPPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
