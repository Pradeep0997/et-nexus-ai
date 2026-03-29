import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
    { icon: '⚡', title: 'My ET — Persona Engine', desc: 'Switch between Investor, Founder & Student views. Each persona gets a uniquely tailored layout — Bloomberg terminal, Kanban board, or explainer cards.' },
    { icon: '📰', title: 'News Navigator', desc: 'AI-synthesised briefings with an interactive story-arc timeline. Ask follow-up questions in the built-in chat panel.' },
    { icon: '🌐', title: 'Vernacular Engine', desc: 'One tap to switch between English, हिन्दी, தமிழ் & తెలుగు. Instant cultural adaptation of every headline.' },
    { icon: '🎬', title: 'Video Studio', desc: 'Click Generate Video — animated market charts play while the browser reads your briefing aloud via Text-to-Speech.' },
];

const STATS = [
    { value: '10K+', label: 'Articles indexed daily' },
    { value: '<1s', label: 'AI briefing (Redis cached)' },
    { value: '4', label: 'Indian languages' },
    { value: '3', label: 'Persona views' },
];

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.12 } } },
    item: {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    },
};

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center
                          text-center px-6 pt-32 pb-24 min-h-screen">
                {/* Ambient blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px]
                          bg-royal-500/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 -right-48 w-96 h-96
                          bg-neon-500/15 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 -left-32 w-80 h-80
                          bg-cyber-500/10 rounded-full blur-[80px]" />
                </div>

                <motion.div
                    variants={stagger.container}
                    initial="initial"
                    animate="animate"
                    className="relative max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div variants={stagger.item}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full
                                 bg-royal-500/15 border border-royal-500/30 text-royal-300 text-sm">
                        <span className="w-2 h-2 rounded-full bg-royal-400 animate-pulse-slow" />
                        Built for the Hackathon · ET Nexus
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={stagger.item}
                        className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                        <span className="text-white">Business news,</span>
                        <br />
                        <span className="text-gradient-purple">re-imagined by AI.</span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p variants={stagger.item}
                        className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Hyper-personalised feeds, AI story arcs, multilingual briefings,
                        and a live video studio — all powered by Akka HTTP + Gemini.
                    </motion.p>

                    {/* CTA */}
                    <motion.div variants={stagger.item} className="flex flex-wrap gap-4 justify-center">
                        {user ? (
                            <button onClick={() => navigate('/dashboard')}
                                className="btn-neon px-8 py-4 text-base">
                                Open Dashboard →
                            </button>
                        ) : (
                            <>
                                <button onClick={() => navigate('/register')}
                                    className="btn-neon px-8 py-4 text-base">
                                    Get Started Free →
                                </button>
                                <button onClick={() => navigate('/login')}
                                    className="btn-ghost px-8 py-4 text-base">
                                    Sign In
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Stats bar ─────────────────────────────────────────────────── */}
            <section className="border-y border-white/10 bg-white/[0.02] py-10 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map((s, i) => (
                        <motion.div key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}>
                            <p className="font-display text-4xl font-extrabold text-gradient-purple mb-1">{s.value}</p>
                            <p className="text-sm text-slate-500">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Features grid ─────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-4">
                    Everything your news feed is missing
                </motion.h2>
                <p className="text-slate-500 text-center mb-14">
                    Four features. One platform. Zero information overload.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="card-glass p-6 cursor-default group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-royal-500/20 flex items-center
                              justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA banner ────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-24 px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-royal-500/10 via-neon-500/10 to-cyber-500/10" />
                <div className="relative max-w-3xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display text-4xl font-extrabold text-white mb-4">
                        Ready to elevate your news experience?
                    </motion.h2>
                    <p className="text-slate-400 mb-8">
                        Join thousands of investors, founders & students who read smarter.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => navigate(user ? '/dashboard' : '/register')}
                            className="btn-neon px-8 py-4 text-base">
                            {user ? 'Go to Dashboard' : 'Start for Free'}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer className="border-t border-white/10 py-8 px-6 text-center">
                <p className="text-slate-600 text-sm">
                    🔮 ET Nexus · Built at the 24-hour Hackathon · Powered by Akka HTTP, React & Gemini
                </p>
            </footer>
        </div>
    );
}
