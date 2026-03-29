import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersona } from '../context/PersonaContext';
import InvestorView from '../components/persona/InvestorView';
import FounderView from '../components/persona/FounderView';
import StudentView from '../components/persona/StudentView';

// ── Persona config ────────────────────────────────────────────────────────────
const PERSONAS = {
    INVESTOR: {
        label: 'Investor',
        icon: '📈',
        tagline: 'Portfolio signals, market moves & deal flow',
        accent: 'royal',
        activeClasses: 'border-royal-500/50 bg-royal-500/15 text-royal-300 shadow-neon-purple',
        dotColor: 'bg-royal-400',
        View: InvestorView,
    },
    FOUNDER: {
        label: 'Founder',
        icon: '🚀',
        tagline: 'Funding rounds, competitor moves & ecosystem shifts',
        accent: 'neon',
        activeClasses: 'border-neon-500/50 bg-neon-500/15 text-neon-300 shadow-neon-pink',
        dotColor: 'bg-neon-400',
        View: FounderView,
    },
    STUDENT: {
        label: 'Student',
        icon: '🎓',
        tagline: 'Plain-English explainers, exam angles & career signals',
        accent: 'cyber',
        activeClasses: 'border-cyber-500/50 bg-cyber-500/15 text-cyber-300 shadow-neon-cyan',
        dotColor: 'bg-cyber-400',
        View: StudentView,
    },
};

// ── Dashboard shell ───────────────────────────────────────────────────────────
export default function Dashboard() {
    // Shared with Navbar via PersonaContext — fixes the disconnected state bug
    const { persona, setPersona } = usePersona();
    const current = PERSONAS[persona];
    const { View } = current;

    return (
        <section className="max-w-7xl mx-auto px-6 py-10">

            {/* ── Page header ──────────────────────────────────── */}
            <div className="mb-8">
                <motion.div
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="relative">
                        <span className="text-4xl">{current.icon}</span>
                        <motion.span
                            key={persona + '-dot'}
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${current.dotColor}
                          border-2 border-void`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gradient-purple leading-tight">
                            My ET
                        </h1>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={persona + '-tag'}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 6 }}
                                transition={{ duration: 0.25 }}
                                className="text-slate-400 text-sm"
                            >
                                {current.tagline}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Persona toggle tabs ───────────────────────── */}
                <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10
                        rounded-2xl w-fit">
                    {Object.entries(PERSONAS).map(([key, p]) => (
                        <motion.button
                            key={key}
                            onClick={() => setActivePersona(key)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm
                          font-semibold border transition-all duration-250
                          ${persona === key
                                    ? p.activeClasses
                                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {persona === key && (
                                <motion.div
                                    layoutId="persona-pill"
                                    className="absolute inset-0 rounded-xl border border-current opacity-30"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="text-base">{p.icon}</span>
                            {p.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ── Persona view (animated swap) ──────────────────── */}
            <AnimatePresence mode="wait">
                <View key={persona} />
            </AnimatePresence>
        </section>
    );
}
