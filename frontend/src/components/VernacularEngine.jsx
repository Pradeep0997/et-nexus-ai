import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const LANG_KEYS = Object.keys(LANGUAGES);

export default function VernacularEngine() {
    const { lang, loading, switchLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const handleSelect = async (key) => {
        setOpen(false);
        if (key !== lang) await switchLanguage(key);
    };

    return (
        <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* ── Language options (fan up when open) ───────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="flex flex-col gap-2 items-end"
                    >
                        {LANG_KEYS.filter((k) => k !== lang).map((key, i) => {
                            const l = LANGUAGES[key];
                            return (
                                <motion.button
                                    key={key}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: i * 0.06, duration: 0.18 }}
                                    onClick={() => handleSelect(key)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
                             bg-void/90 backdrop-blur-xl border border-white/15
                             text-sm font-semibold text-slate-200
                             hover:bg-royal-500/20 hover:border-royal-500/40 hover:text-white
                             shadow-glass transition-all duration-200 group"
                                >
                                    <span className="text-base">{l.flag}</span>
                                    <span>{l.name}</span>
                                    <span className="text-xs text-slate-500 font-mono group-hover:text-slate-300">
                                        {l.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FAB button ─────────────────────────────────── */}
            <motion.button
                onClick={() => setOpen((o) => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center
                   shadow-neon-purple border border-royal-500/50
                   overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #5533ff, #e600b8)' }}
                aria-label="Change language"
            >
                {/* Spin ring on loading */}
                {loading && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-transparent
                       border-t-white/80"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                    />
                )}

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.span
                            key="loading"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text-white text-xl"
                        >
                            ⟳
                        </motion.span>
                    ) : (
                        <motion.div
                            key={lang}
                            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="flex flex-col items-center leading-none"
                        >
                            <span className="text-[10px] font-bold text-white/60 tracking-widest">LANG</span>
                            <span className="text-sm font-extrabold text-white">{lang}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Active lang badge */}
            <AnimatePresence>
                {!open && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-2.5 py-1 rounded-full bg-void/80 backdrop-blur border border-white/10
                       text-[10px] text-slate-400 font-mono"
                    >
                        {LANGUAGES[lang].flag} {LANGUAGES[lang].name}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
