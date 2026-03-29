import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Mock data ─────────────────────────────────────────────────────────────────
const KPI_TICKERS = [
    { sym: 'NIFTY 50', val: '22,456.80', chg: '+1.2%', up: true },
    { sym: 'SENSEX', val: '73,921.30', chg: '+0.9%', up: true },
    { sym: 'USD/INR', val: '83.47', chg: '-0.12%', up: false },
    { sym: 'GOLD', val: '₹71,240', chg: '+0.4%', up: true },
    { sym: 'BRENT', val: '$81.14', chg: '-0.7%', up: false },
    { sym: 'BTC/USD', val: '$68,402', chg: '+2.3%', up: true },
];

const INVESTOR_FEED = [
    { id: 1, time: '09:18', cat: 'MONETARY', ticker: 'RBI', headline: 'RBI holds repo at 6.50%; MPC 5-1 split flags persistent core CPI risk', impact: 'HIGH', badges: ['Rates', 'Bonds'] },
    { id: 2, time: '09:31', cat: 'EQUITY', ticker: 'HDFC', headline: 'HDFC Bank Q4 margins compress 18 bps; asset quality holds steady at 1.26% GNPA', impact: 'MED', badges: ['Banking', 'Earnings'] },
    { id: 3, time: '10:02', cat: 'GLOBAL', ticker: 'FED', headline: 'Fed minutes: one rate cut signalled for H2 2025; dollar index eases to 103.8', impact: 'HIGH', badges: ['FX', 'Macro'] },
    { id: 4, time: '10:15', cat: 'COMMODITY', ticker: 'GOLD', headline: 'Gold breaks ₹71K on safe-haven flows; silver underperforms at 3-week low', impact: 'MED', badges: ['Commodities'] },
    { id: 5, time: '10:44', cat: 'FUND FLOW', ticker: 'FII', headline: 'FIIs buy ₹4,217 Cr in cash equities; DIIs net sellers at ₹1,082 Cr', impact: 'LOW', badges: ['Flows'] },
    { id: 6, time: '11:05', cat: 'SECTOR', ticker: 'IT', headline: 'TCS, Infosys rise on weak rupee tailwind ahead of Q4 earnings season', impact: 'MED', badges: ['IT', 'FX-Play'] },
];

const IMPACT_STYLE = {
    HIGH: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    MED: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    LOW: 'bg-slate-600/30 text-slate-400 border border-slate-600/30',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function InvestorView() {
    return (
        <motion.div
            key="investor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-5"
        >
            {/* ── Ticker tape ────────────────────────────────── */}
            <div className="card-glass p-3 overflow-x-auto">
                <div className="flex gap-8 min-w-max">
                    {KPI_TICKERS.map((t) => (
                        <div key={t.sym} className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono text-xs text-slate-500 tracking-widest">{t.sym}</span>
                            <span className="font-mono text-sm font-semibold text-white">{t.val}</span>
                            <span className={`font-mono text-xs font-bold ${t.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {t.up ? '▲' : '▼'} {t.chg}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Terminal header ─────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-xs text-slate-500 tracking-widest">
                    ET NEXUS TERMINAL — MARKET INTELLIGENCE FEED — NSE {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                </span>
            </div>

            {/* ── Dense news list (Bloomberg style) ──────────── */}
            <div className="card-glass overflow-hidden">
                {/* Column headers */}
                <div className="grid grid-cols-[72px_64px_72px_1fr_72px] gap-3 px-4 py-2
                        border-b border-white/10 bg-white/[0.02]">
                    {['TIME', 'IMPACT', 'TICKER', 'HEADLINE', 'TAGS'].map((h) => (
                        <span key={h} className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">{h}</span>
                    ))}
                </div>

                <AnimatePresence>
                    {INVESTOR_FEED.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="grid grid-cols-[72px_64px_72px_1fr_72px] gap-3 px-4 py-3
                         border-b border-white/5 hover:bg-white/[0.04] transition-colors
                         cursor-pointer group"
                        >
                            <span className="font-mono text-xs text-slate-500 self-center">{item.time}</span>
                            <span className={`badge self-center text-[10px] font-bold tracking-wider ${IMPACT_STYLE[item.impact]}`}>
                                {item.impact}
                            </span>
                            <span className="font-mono text-xs text-cyber-400 self-center font-semibold tracking-wider">
                                {item.ticker}
                            </span>
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors self-center leading-snug">
                                {item.headline}
                            </p>
                            <div className="flex flex-col gap-1 self-center">
                                {item.badges.map((b) => (
                                    <span key={b} className="badge bg-royal-500/15 text-royal-400 text-[9px] tracking-wider px-1.5 py-0.5">
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
