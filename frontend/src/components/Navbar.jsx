import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/dashboard', label: 'My ET', icon: '⚡' },
    { to: '/briefing', label: 'News Navigator', icon: '📰' },
];

const PERSONAS = ['INVESTOR', 'FOUNDER', 'STUDENT'];

export default function Navbar() {
    const [persona, setPersona] = useState('INVESTOR');
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6
                       bg-void/80 backdrop-blur-xl border-b border-white/10">
            {/* Logo */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2.5 group mr-10"
                aria-label="ET Nexus home"
            >
                <span className="text-2xl">🔮</span>
                <span className="font-display font-bold text-lg text-gradient-purple tracking-tight
                         group-hover:opacity-90 transition-opacity">
                    ET Nexus
                </span>
            </button>

            {/* Nav links */}
            <nav className="flex items-center gap-1 flex-1">
                {NAV_LINKS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
               transition-all duration-200
               ${isActive
                                ? 'bg-royal-500/20 text-royal-300 border border-royal-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`
                        }
                    >
                        <span>{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Persona switcher */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 mr-1">Persona:</span>
                {PERSONAS.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPersona(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${persona === p
                                ? 'bg-neon-500/20 text-neon-300 border border-neon-500/40 glow-pink scale-105'
                                : 'text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200'
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </header>
    );
}
