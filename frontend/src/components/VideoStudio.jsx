import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── News script for TTS ────────────────────────────────────────────────────────
const NEWS_SCRIPT = [
    { text: "Good morning. This is ET Nexus AI with your market intelligence briefing.", delay: 0 },
    { text: "The Reserve Bank of India held the benchmark repo rate at six point five percent for the seventh consecutive time.", delay: 3500 },
    { text: "Governor Das cited sticky core inflation at four point nine percent as the primary reason for the pause.", delay: 9000 },
    { text: "On the startup front, Zepto raised three hundred and fifty million dollars at a five billion dollar valuation.", delay: 15000 },
    { text: "India's quick commerce market is now a three-way race between Zepto, Blinkit, and Swiggy Instamart.", delay: 21000 },
    { text: "In global markets, the US Federal Reserve hinted at one rate cut in 2025, strengthening the Indian rupee by 18 paise.", delay: 27000 },
    { text: "That's your ET Nexus briefing for today. Stay ahead of the markets.", delay: 33000 },
];

// ── Animated chart data ────────────────────────────────────────────────────────
const CHART_BARS = [
    { label: 'NIFTY', value: 88, color: 'from-royal-500 to-royal-400', delta: '+1.2%' },
    { label: 'SENSEX', value: 75, color: 'from-neon-500   to-neon-400', delta: '+0.9%' },
    { label: 'GOLD', value: 60, color: 'from-amber-500  to-amber-400', delta: '+0.4%' },
    { label: 'USD/INR', value: 42, color: 'from-rose-500   to-rose-400', delta: '-0.1%' },
    { label: 'BTC', value: 92, color: 'from-cyber-500  to-cyber-400', delta: '+2.3%' },
];

const TIMELINE_BEATS = [0, 3500, 9000, 15000, 21000, 27000, 33000];

function BarChart({ active }) {
    return (
        <div className="flex items-end gap-3 h-32 px-4">
            {CHART_BARS.map((bar, i) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className={`text-xs font-bold ${bar.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {bar.delta}
                    </span>
                    <div className="w-full relative bg-white/5 rounded-lg overflow-hidden" style={{ height: '80px' }}>
                        <motion.div
                            className={`absolute bottom-0 left-0 right-0 rounded-lg bg-gradient-to-t ${bar.color}`}
                            initial={{ height: 0 }}
                            animate={{ height: active ? `${bar.value}%` : 0 }}
                            transition={{ delay: i * 0.12 + 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 tracking-widest">{bar.label}</span>
                </div>
            ))}
        </div>
    );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function VideoStudio({ open, onClose }) {
    const [playing, setPlaying] = useState(false);
    const [beatIndex, setBeatIndex] = useState(0);
    const [done, setDone] = useState(false);
    const [transcript, setTranscript] = useState('');
    const timersRef = useRef([]);
    const synthRef = useRef(window.speechSynthesis);

    const stopAll = useCallback(() => {
        synthRef.current?.cancel();
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    }, []);

    // Cleanup on unmount / close
    useEffect(() => {
        if (!open) {
            stopAll();
            setPlaying(false);
            setBeatIndex(0);
            setDone(false);
            setTranscript('');
        }
    }, [open, stopAll]);

    useEffect(() => () => stopAll(), [stopAll]);

    const handlePlay = () => {
        if (playing) return;
        stopAll();
        setPlaying(true);
        setDone(false);
        setBeatIndex(0);
        setTranscript('');

        // Schedule beat markers on timeline
        TIMELINE_BEATS.forEach((delay, i) => {
            const t = setTimeout(() => setBeatIndex(i), delay);
            timersRef.current.push(t);
        });

        // Speak each sentence
        NEWS_SCRIPT.forEach(({ text, delay }, i) => {
            const t = setTimeout(() => {
                setTranscript(text);
                const utt = new SpeechSynthesisUtterance(text);
                utt.rate = 0.92;
                utt.pitch = 1.05;
                // On last sentence, mark done
                if (i === NEWS_SCRIPT.length - 1) {
                    utt.onend = () => { setPlaying(false); setDone(true); };
                }
                synthRef.current?.speak(utt);
            }, delay);
            timersRef.current.push(t);
        });
    };

    const handleStop = () => {
        stopAll();
        setPlaying(false);
        setBeatIndex(0);
        setTranscript('');
        setDone(false);
    };

    const totalBeats = TIMELINE_BEATS.length;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.93, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 24 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-2xl card-glass overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10
                              bg-gradient-to-r from-royal-500/10 to-neon-500/10">
                                <div className="flex gap-1.5">
                                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-rose-500 hover:brightness-110 transition-all" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <span className="text-lg">🎬</span>
                                    <span className="font-display font-bold text-sm text-white">ET Nexus Video Studio</span>
                                    {playing && (
                                        <span className="flex items-center gap-1.5 ml-2 badge bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                            LIVE
                                        </span>
                                    )}
                                    {done && (
                                        <span className="badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                            ✓ Complete
                                        </span>
                                    )}
                                </div>
                                <button onClick={onClose} className="ml-auto text-slate-500 hover:text-slate-300 text-xl leading-none">×</button>
                            </div>

                            {/* Studio body */}
                            <div className="p-6 space-y-5">

                                {/* Animated bar chart */}
                                <div className="card-glass p-4">
                                    <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-3">
                                        Market Performance · Live Feed
                                    </p>
                                    <BarChart active={playing || done} />
                                </div>

                                {/* Teleprompter / transcript */}
                                <div className="min-h-[56px] flex items-center px-5 py-3.5 rounded-xl
                                bg-white/[0.03] border border-white/10">
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={transcript}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-sm text-slate-300 leading-relaxed italic text-center w-full"
                                        >
                                            {transcript || (playing ? '…' : '▶ Press Play to start the AI video briefing')}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                {/* Progress timeline */}
                                <div className="space-y-2">
                                    <div className="flex gap-1.5">
                                        {Array.from({ length: totalBeats }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`flex-1 h-1.5 rounded-full transition-colors duration-500
                          ${i <= beatIndex && (playing || done)
                                                        ? 'bg-gradient-to-r from-royal-500 to-neon-500'
                                                        : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-mono text-right">
                                        {playing || done ? `Beat ${beatIndex + 1} / ${totalBeats}` : 'Ready'}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-3 pt-1">
                                    {!playing ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handlePlay}
                                            className="btn-neon px-8 py-3 text-sm flex items-center gap-2"
                                        >
                                            {done ? '↺ Replay' : '▶ Play Briefing'}
                                        </motion.button>
                                    ) : (
                                        <button
                                            onClick={handleStop}
                                            className="btn-ghost px-8 py-3 text-sm flex items-center gap-2"
                                        >
                                            ■ Stop
                                        </button>
                                    )}
                                    <button onClick={onClose} className="btn-ghost px-6 py-3 text-sm">
                                        Close
                                    </button>
                                </div>

                                <p className="text-[10px] text-slate-600 text-center">
                                    Powered by browser's native speechSynthesis API · Charts animate via Framer Motion
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
