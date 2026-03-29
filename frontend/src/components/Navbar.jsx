import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersona, PERSONA_KEYS } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { to: '/dashboard', label: 'My ET', icon: '⚡' },
    { to: '/briefing', label: 'News Navigator', icon: '📰' },
];

const PERSONA_ACCENT = {
    INVESTOR: 'bg-royal-500/20 text-royal-300 border-royal-500/40',
    FOUNDER: 'bg-neon-500/20  text-neon-300  border-neon-500/40',
    STUDENT: 'bg-cyber-500/20 text-cyber-300  border-cyber-500/40',
};

export default function Navbar() {
    const navigate = useNavigate();
    const { persona, setPersona } = usePersona();
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-4
                       bg-void/80 backdrop-blur-xl border-b border-white/10">
            {/* Logo */}
            <button onClick={() => navigate('/')}
                className="flex items-center gap-2 group mr-8" aria-label="ET Nexus home">
                <span className="text-2xl">🔮</span>
                <span className="font-display font-bold text-base text-gradient-purple tracking-tight
                         group-hover:opacity-90 transition-opacity hidden sm:block">
                    ET Nexus
                </span>
            </button>

            {/* Nav links */}
            <nav className="flex items-center gap-1 flex-1">
                {NAV_LINKS.map(({ to, label, icon }) => (
                    <NavLink key={to} to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
               transition-all duration-200
               ${isActive
                                ? 'bg-royal-500/20 text-royal-300 border border-royal-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
                        }>
                        <span>{icon}</span>
                        <span className="hidden md:block">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Persona switcher — now wired to PersonaContext */}
            <div className="flex items-center gap-1.5 mr-4">
                <span className="text-xs text-slate-600 mr-1 hidden lg:block">Persona:</span>
                {PERSONA_KEYS.map((p) => (
                    <motion.button
                        key={p}
                        onClick={() => setPersona(p)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
              ${persona === p
                                ? PERSONA_ACCENT[p]
                                : 'text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'
                            }`}
                    >
                        {p.slice(0, 3)}
                    </motion.button>
                ))}
            </div>

            {/* Auth area */}
            {user ? (
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl
                          bg-white/5 border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal-500 to-neon-500
                            flex items-center justify-center text-[10px] font-bold text-white">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-300 max-w-[80px] truncate">{user.name}</span>
                    </div>
                    <button onClick={logout}
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2 py-1">
                        Sign out
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/login')}
                        className="btn-ghost px-3 py-1.5 text-xs">
                        Sign in
                    </button>
                    <button onClick={() => navigate('/register')}
                        className="btn-neon px-3 py-1.5 text-xs">
                        Get started
                    </button>
                </div>
            )}
        </header>
    );
}
