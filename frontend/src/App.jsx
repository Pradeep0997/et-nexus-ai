import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BriefingView from './pages/BriefingView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-void text-slate-100 font-sans">
        {/* Background hero glow */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-500/5 rounded-full blur-3xl" />
        </div>

        {/* Persistent top nav */}
        <Navbar />

        {/* Page content */}
        <main className="relative z-10 pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/briefing" element={<BriefingView />} />
            <Route path="/briefing/:id" element={<BriefingView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
