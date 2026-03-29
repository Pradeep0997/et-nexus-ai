import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SENTIMENT = {
    positive: { dot: 'bg-emerald-400', line: 'border-emerald-500/40', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: '↑' },
    negative: { dot: 'bg-rose-400', line: 'border-rose-500/40', badge: 'bg-rose-500/15    text-rose-300    border-rose-500/30', icon: '↓' },
    neutral: { dot: 'bg-slate-400', line: 'border-slate-600/50', badge: 'bg-slate-700/40   text-slate-300   border-slate-600/30', icon: '→' },
};

/**
 * StoryArc — vertical interactive timeline
 * Props:
 *   events: Array<{ date, title, description, sentiment }>
 *   topic:  string
 */
export default function StoryArc({ events = [], topic = '' }) {
    const [activeIdx, setActiveIdx] = React.useState(null);

    if (!events.length) {
        return (
            <div className="flex items-center justify-center h-48 text-slate-600 text-sm">
                No timeline events found.
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Topic chip */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-royal-400 animate-pulse-slow" />
                <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                    Story Arc · {topic || 'Timeline'}
                </span>
            </div>

            {/* Timeline spine */}
            <div className="relative pl-8">
                {/* Vertical spine line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b
                        from-royal-500/60 via-neon-500/30 to-transparent" />

                <div className="space-y-0">
                    {events.map((event, i) => {
                        const s = SENTIMENT[event.sentiment] ?? SENTIMENT.neutral;
                        const isLast = i === events.length - 1;
                        const isActive = activeIdx === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.09, duration: 0.35, ease: 'easeOut' }}
                                className="relative"
                            >
                                {/* Connector dot */}
                                <button
                                    onClick={() => setActiveIdx(isActive ? null : i)}
                                    className="absolute -left-8 top-3 group focus:outline-none"
                                    aria-label={`Toggle event: ${event.title}`}
                                >
                                    <span className={`block w-3.5 h-3.5 rounded-full border-2 border-void
                                   ${s.dot} transition-all duration-200
                                   group-hover:scale-125 ${isActive ? 'scale-125 ring-2 ring-current ring-offset-1 ring-offset-void' : ''}`} />
                                </button>

                                {/* Card */}
                                <div
                                    className={`mb-1 ml-2 cursor-pointer rounded-xl border transition-all duration-300
                               ${isActive
                                            ? 'card-glass border-royal-500/40 bg-royal-500/5'
                                            : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                                        } pb-${isLast ? '0' : '1'}`}
                                    onClick={() => setActiveIdx(isActive ? null : i)}
                                >
                                    <div className="px-4 pt-3 pb-2">
                                        {/* Date + sentiment */}
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="font-mono text-xs text-slate-600">{event.date}</span>
                                            <span className={`badge text-[10px] border ${s.badge}`}>
                                                {s.icon} {event.sentiment}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-sm font-semibold leading-snug transition-colors
                                    ${isActive ? 'text-white' : 'text-slate-200'}`}>
                                            {event.title}
                                        </h3>

                                        {/* Expandable description */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.p
                                                    key="desc"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                    className="text-xs text-slate-400 mt-2 leading-relaxed overflow-hidden"
                                                >
                                                    {event.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Gap between items */}
                                {!isLast && <div className="h-3" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
