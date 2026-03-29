import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function FormField({ label, type = 'text', value, onChange, placeholder, autoComplete, hint }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-slate-200
                    placeholder-slate-600 outline-none transition-all duration-200
                    ${focused
                        ? 'border-neon-500/60 bg-white/[0.07] shadow-neon-pink'
                        : 'border-white/10 hover:border-white/20'
                    }`}
            />
            {hint && <p className="text-[11px] text-slate-600">{hint}</p>}
        </div>
    );
}

const PERSONA_OPTIONS = [
    { key: 'INVESTOR', icon: '📈', desc: 'Portfolio signals & market data' },
    { key: 'FOUNDER', icon: '🚀', desc: 'Funding, regulatory & competitor moves' },
    { key: 'STUDENT', icon: '🎓', desc: 'Explainers, exam angles & career signals' },
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, error, clearError, user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [persona, setPersona] = useState('INVESTOR');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user]);
    useEffect(() => clearError, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        const ok = register({ name, email, password, persona });
        setLoading(false);
        if (ok) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                        bg-neon-500/12 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                <div className="card-glass overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-neon-500 via-royal-500 to-cyber-500" />

                    <div className="p-8">
                        <div className="text-center mb-7">
                            <div className="text-4xl mb-3">🔮</div>
                            <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
                            <p className="text-slate-500 text-sm">Join ET Nexus — free forever</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField label="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="Arjun Mehta" autoComplete="name" />
                            <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" autoComplete="email" />
                            <FormField label="Password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters" autoComplete="new-password"
                                hint={password && password.length < 6 ? 'Password must be at least 6 characters' : ''} />

                            {/* Persona picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                                    I am a…
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PERSONA_OPTIONS.map((p) => (
                                        <button
                                            key={p.key}
                                            type="button"
                                            onClick={() => setPersona(p.key)}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border
                                  text-center transition-all duration-200
                                  ${persona === p.key
                                                    ? 'bg-neon-500/20 border-neon-500/50 text-neon-300 scale-105'
                                                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                                }`}
                                        >
                                            <span className="text-xl">{p.icon}</span>
                                            <span className="text-[10px] font-semibold leading-tight">{p.key}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-600">
                                    {PERSONA_OPTIONS.find((p) => p.key === persona)?.desc}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl
                             bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm"
                                >
                                    ⚠ {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !name || !email || password.length < 6}
                                className="w-full btn-neon py-3.5 text-sm mt-1
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account…
                                    </span>
                                ) : 'Create Account →'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-neon-400 hover:text-neon-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-700 mt-4">
                    <Link to="/" className="hover:text-slate-500 transition-colors">← Back to home</Link>
                </p>
            </motion.div>
        </div>
    );
}
