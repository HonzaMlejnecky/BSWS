import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import PlanSelectionPage from './pages/PlanSelectionPage';
import DashboardPage from './pages/DashboardPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DatabasePage from './pages/DatabasePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/plan" element={<ProtectedRoute><PlanSelectionPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/databases" element={<ProtectedRoute><DatabasePage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
