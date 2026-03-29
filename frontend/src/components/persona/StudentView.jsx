import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock data ─────────────────────────────────────────────────────────────────
const CONCEPTS = [
    {
        id: 1,
        emoji: '🏦',
        title: 'Why did RBI hold interest rates?',
        tldr: 'Inflation is cooling but not cool enough. RBI plays it safe.',
        body: `The Reserve Bank of India kept the repo rate at 6.50% for the 7th straight time. 
Repo rate is the interest rate at which RBI lends money to commercial banks overnight.

**Why it matters for you:** When the repo rate is high, home loans, car loans, and personal loans stay expensive. Banks borrow at 6.50% from RBI → they pass that cost to you.

**The inflation angle:** India's CPI inflation was 4.87% in Feb 2025, above the 4% target. RBI won't cut rates until inflation consistently hits 4%.`,
        readTime: '3 min',
        category: 'Monetary Policy',
        examAngle: 'UPSC / MBA entrance: Monetary Policy Transmission',
        color: 'royal',
    },
    {
        id: 2,
        emoji: '⚡',
        title: 'What is Quick Commerce — and why is everyone funding it?',
        tldr: 'Groceries in 10 minutes. A land-grab that could reshape retail.',
        body: `Quick commerce (q-comm) means delivering groceries and essentials in under 15 minutes via a network of "dark stores" — micro-warehouses placed within 2km of customers.

**Zepto raised $350M** at a $5B valuation this week, joining Blinkit (Zomato) and Swiggy Instamart in a three-way war.

**Why the frenzy now?** Smartphone penetration + impulse purchase behaviour + post-COVID preference for delivery have created a massive TAM. The Indian q-comm market is expected to hit $6B by 2027.`,
        readTime: '4 min',
        category: 'Startup Ecosystem',
        examAngle: 'Interview prep: Business Model, Unit Economics, CAC vs LTV',
        color: 'neon',
    },
    {
        id: 3,
        emoji: '📉',
        title: 'What happens when the US Fed cuts rates?',
        tldr: 'A US rate cut ripples through Indian markets faster than you think.',
        body: `The US Federal Reserve hinted at ONE rate cut in 2025. What does that mean for India?

**Step 1:** Lower US rates → dollar weakens globally
**Step 2:** Weak dollar → rupee strengthens (less USD needed to buy INR)
**Step 3:** Strong rupee → FIIs bring money into Indian equities (better returns in USD terms)
**Step 4:** More FII inflows → Nifty & Sensex go up

This week: FIIs bought ₹4,217 Cr in Indian equities on Fed commentary alone.`,
        readTime: '5 min',
        category: 'Global Macro',
        examAngle: 'Economics: BoP, Exchange Rates, Capital Account',
        color: 'cyber',
    },
];

const COLOR_MAP = {
    royal: { gradient: 'from-royal-500/20 to-royal-500/5', border: 'border-royal-500/30 hover:border-royal-500/50', badge: 'bg-royal-500/20 text-royal-300', emoji: 'bg-royal-500/20' },
    neon: { gradient: 'from-neon-500/20  to-neon-500/5', border: 'border-neon-500/30  hover:border-neon-500/50', badge: 'bg-neon-500/20  text-neon-300', emoji: 'bg-neon-500/20' },
    cyber: { gradient: 'from-cyber-500/20 to-cyber-500/5', border: 'border-cyber-500/30 hover:border-cyber-500/50', badge: 'bg-cyber-500/20 text-cyber-300', emoji: 'bg-cyber-500/20' },
};

function ExplainerCard({ item, index }) {
    const [expanded, setExpanded] = useState(false);
    const c = COLOR_MAP[item.color];

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.4, ease: 'easeOut' }}
            layout
            className={`card-glass border ${c.border} overflow-hidden cursor-pointer
                  transition-all duration-300`}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Gradient strip */}
            <div className={`h-1 w-full bg-gradient-to-r ${c.gradient.replace('/5', '')}`} />

            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${c.emoji} flex items-center justify-center text-2xl shrink-0`}>
                        {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className={`badge text-xs ${c.badge}`}>{item.category}</span>
                            <span className="text-xs text-slate-600">📖 {item.readTime} read</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-white leading-tight">
                            {item.title}
                        </h3>
                    </div>
                    <motion.span
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-500 shrink-0 mt-1"
                    >
                        ▾
                    </motion.span>
                </div>

                {/* TL;DR */}
                <p className="text-slate-400 text-sm italic mb-4 pl-16">
                    💡 <strong className="text-slate-300 not-italic font-medium">TL;DR:</strong> {item.tldr}
                </p>

                {/* Expanded body */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            key="body"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="border-t border-white/10 pt-4 mb-4">
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                    {item.body}
                                </p>
                            </div>
                            {/* Exam angle */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
                                <span className="text-lg">🎯</span>
                                <div>
                                    <p className="text-xs font-semibold text-amber-300 mb-0.5">Exam Angle</p>
                                    <p className="text-xs text-amber-200/70">{item.examAngle}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
                    <span>{expanded ? '▴ Collapse' : '▾ Read full explainer'}</span>
                </div>
            </div>
        </motion.article>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentView() {
    return (
        <motion.div
            key="student"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-4"
        >
            {/* Header */}
            <div className="card-glass p-4 flex items-center gap-3 border-cyber-500/20">
                <div className="w-10 h-10 rounded-full bg-cyber-500/20 flex items-center justify-center text-xl">🎓</div>
                <div>
                    <p className="text-sm font-semibold text-white">Today's 3 things you must know</p>
                    <p className="text-xs text-slate-500">Click any card to get the full explainer + exam angle</p>
                </div>
            </div>

            {/* Explainer cards */}
            <div className="space-y-4">
                {CONCEPTS.map((item, i) => (
                    <ExplainerCard key={item.id} item={item} index={i} />
                ))}
            </div>
        </motion.div>
    );
}
