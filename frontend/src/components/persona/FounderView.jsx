import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock data ─────────────────────────────────────────────────────────────────
const FOUNDER_KPI = [
    { label: 'Startup Deals (wk)', value: '₹2,340 Cr', sub: '+18% vs last wk', color: 'royal' },
    { label: 'UPI Txns Today', value: '42.8 Cr', sub: '+3.2% DoD', color: 'neon' },
    { label: 'GST Collections', value: '₹1.87L Cr', sub: 'Record FY25 high', color: 'cyber' },
    { label: 'VC Dry Powder', value: '$4.2 B', sub: 'India-focused', color: 'royal' },
];

const KANBAN_COLS = [
    {
        id: 'funding',
        title: '💰 Funding Moves',
        accent: 'royal',
        cards: [
            { id: 'f1', co: 'Zepto', round: 'Series G', amt: '$350M', val: '$5B', tag: 'Quick Commerce' },
            { id: 'f2', co: 'Rapido', round: 'Series E', amt: '$120M', val: '$1.1B', tag: 'Urban Mobility' },
            { id: 'f3', co: 'Zetwerk', round: 'Series F', amt: '$210M', val: '$2.7B', tag: 'B2B Mfg' },
        ],
    },
    {
        id: 'regulatory',
        title: '⚖️ Regulatory',
        accent: 'amber',
        cards: [
            { id: 'r1', co: 'SEBI', round: 'New Rule', amt: 'F&O Lot Sizes', val: 'Jun 2025', tag: 'Policy' },
            { id: 'r2', co: 'MeitY', round: 'Draft', amt: 'AI Governance', val: 'Q3 2025', tag: 'Tech Policy' },
            { id: 'r3', co: 'RBI', round: 'Directive', amt: 'NBFC Norms', val: 'Immediate', tag: 'FinReg' },
        ],
    },
    {
        id: 'competitor',
        title: '🔥 Competitor Moves',
        accent: 'neon',
        cards: [
            { id: 'c1', co: 'Blinkit', round: 'Expansion', amt: '45 dark stores', val: 'Tier-2', tag: 'Quick Comm' },
            { id: 'c2', co: 'PhonePe', round: 'Launch', amt: 'Stock Broking', val: 'Beta', tag: 'FinTech' },
            { id: 'c3', co: 'Jio Finance', round: 'Product', amt: 'Credit Cards', val: 'Live', tag: 'Lending' },
        ],
    },
];

const ACCENT_MAP = {
    royal: { header: 'bg-royal-500/20 border-royal-500/30 text-royal-300', card: 'hover:border-royal-500/40', dot: 'bg-royal-400' },
    amber: { header: 'bg-amber-500/20 border-amber-500/30 text-amber-300', card: 'hover:border-amber-500/40', dot: 'bg-amber-400' },
    neon: { header: 'bg-neon-500/20  border-neon-500/30  text-neon-300', card: 'hover:border-neon-500/40', dot: 'bg-neon-400' },
    cyber: { header: 'bg-cyber-500/20 border-cyber-500/30 text-cyber-300', card: 'hover:border-cyber-500/40', dot: 'bg-cyber-400' },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function FounderView() {
    return (
        <motion.div
            key="founder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6"
        >
            {/* ── KPI strip ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {FOUNDER_KPI.map((k, i) => {
                    const a = ACCENT_MAP[k.color];
                    return (
                        <motion.div
                            key={k.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`card-glass p-4 border ${a.card} transition-all duration-300`}
                        >
                            <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider">{k.label}</p>
                            <p className={`font-display text-2xl font-bold text-white`}>{k.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{k.sub}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Kanban board ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {KANBAN_COLS.map((col, ci) => {
                    const a = ACCENT_MAP[col.accent];
                    return (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ci * 0.1 + 0.15 }}
                            className="card-glass overflow-hidden"
                        >
                            {/* Column header */}
                            <div className={`px-4 py-3 border-b border-white/10 ${a.header} border-l-2 ${a.header}`}>
                                <h3 className="font-semibold text-sm">{col.title}</h3>
                                <p className="text-xs opacity-70 mt-0.5">{col.cards.length} items</p>
                            </div>

                            {/* Cards */}
                            <div className="p-3 space-y-2.5">
                                <AnimatePresence>
                                    {col.cards.map((card, ci2) => (
                                        <motion.div
                                            key={card.id}
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: ci * 0.1 + ci2 * 0.07 + 0.25 }}
                                            className={`bg-white/[0.03] border border-white/10 rounded-xl p-3.5
                                  cursor-pointer hover:bg-white/[0.06] ${a.card}
                                  transition-all duration-200 group`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <span className="font-semibold text-sm text-white group-hover:text-gradient-purple">
                                                    {card.co}
                                                </span>
                                                <span className={`badge text-[10px] ${ACCENT_MAP[col.accent].header}`}>
                                                    {card.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">{card.round}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-white">{card.amt}</span>
                                                <span className="text-xs text-slate-500">{card.val}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <button className="w-full py-2 rounded-xl border border-dashed border-white/10
                                   text-xs text-slate-600 hover:text-slate-400 hover:border-white/20
                                   transition-all duration-200">
                                    + Add signal
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
