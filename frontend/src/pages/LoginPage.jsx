import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function FormField({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
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
                        ? 'border-royal-500/60 bg-white/[0.07] shadow-neon-purple'
                        : 'border-white/10 hover:border-white/20'
                    }`}
            />
        </div>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, error, clearError, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user]);
    useEffect(() => clearError, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600)); // simulate network
        const ok = login({ email, password });
        setLoading(false);
        if (ok) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                        bg-royal-500/15 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                <div className="card-glass overflow-hidden">
                    {/* Top accent strip */}
                    <div className="h-1 w-full bg-gradient-to-r from-royal-500 via-neon-500 to-cyber-500" />

                    <div className="p-8">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-3">🔮</div>
                            <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h1>
                            <p className="text-slate-500 text-sm">Sign in to your ET Nexus account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                            <FormField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />

                            {/* Error */}
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
                                disabled={loading || !email || !password}
                                className="w-full btn-neon py-3.5 text-sm mt-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in…
                                    </span>
                                ) : 'Sign In →'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            No account?{' '}
                            <Link to="/register" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">
                                Create one free
                            </Link>
                        </p>

                        {/* Demo hint */}
                        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-300 text-center">
                                💡 Demo: register an account first, then log in with the same credentials
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-700 mt-4">
                    <Link to="/" className="hover:text-slate-500 transition-colors">← Back to home</Link>
                </p>
            </motion.div>
        </div>
    );
}
