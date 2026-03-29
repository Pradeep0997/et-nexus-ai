import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { PersonaProvider } from './context/PersonaContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import VernacularEngine from './components/VernacularEngine';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BriefingView from './pages/BriefingView';

/** Redirect unauthenticated users to /login */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-void text-slate-100 font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-500/5 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-16">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/briefing" element={<PrivateRoute><BriefingView /></PrivateRoute>} />
          <Route path="/briefing/:id" element={<PrivateRoute><BriefingView /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <VernacularEngine />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PersonaProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </PersonaProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
