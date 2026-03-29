import React, { useState } from 'react';

const PERSONA_META = {
    INVESTOR: {
        label: 'Investor',
        icon: '📈',
        accent: 'royal',
        tagline: 'Portfolio signals, market moves & deal flow',
        cards: [
            { title: 'Nifty 50', value: '22,456.80', delta: '+1.2%', up: true },
            { title: 'Sensex', value: '73,921.30', delta: '+0.9%', up: true },
            { title: 'USD/INR', value: '83.47', delta: '-0.1%', up: false },
            { title: 'Gold (10g)', value: '₹71,240', delta: '+0.4%', up: true },
        ],
    },
    FOUNDER: {
        label: 'Founder',
        icon: '🚀',
        accent: 'neon',
        tagline: 'Funding rounds, regulatory shifts & ecosystem plays',
        cards: [
            { title: 'Startup Deals (wk)', value: '₹2,340 Cr', delta: '+18%', up: true },
            { title: 'UPI Txns (today)', value: '42.8 Cr', delta: '+3.2%', up: true },
            { title: 'GST (live)', value: '₹1.87 L Cr', delta: '+11%', up: true },
            { title: 'PLI Claims', value: '₹9,420 Cr', delta: '-4%', up: false },
        ],
    },
    STUDENT: {
        label: 'Student',
        icon: '🎓',
        accent: 'cyber',
        tagline: 'Concepts explained, exam angles & career signals',
        cards: [
            { title: 'Repo Rate', value: '6.50%', delta: 'RBI Nov\'24', up: null },
            { title: 'CPI Inflation', value: '4.87%', delta: 'Feb 2025', up: null },
            { title: 'GDP Growth', value: '8.4%', delta: 'FY24 Est.', up: null },
            { title: 'Fiscal Deficit', value: '5.1% GDP', delta: 'FY25 Target', up: null },
        ],
    },
};

const MOCK_FEED = [
    { id: 1, category: 'Markets', headline: 'RBI holds rates; Governor flags sticky core inflation as key risk', time: '9 min ago', hot: true },
    { id: 2, category: 'Startups', headline: 'Zepto raises $350M at $5B valuation in quick commerce land-grab', time: '24 min ago', hot: true },
    { id: 3, category: 'Economy', headline: 'India\'s exports surge 12% YoY driven by electronics & pharma', time: '1 hr ago', hot: false },
    { id: 4, category: 'Policy', headline: 'SEBI tightens F&O rules; new lot sizes effective June 2025', time: '2 hr ago', hot: false },
    { id: 5, category: 'Global', headline: 'Fed signals one more rate cut in 2025 — rupee strengthens', time: '3 hr ago', hot: false },
];

const accentMap = {
    royal: { pill: 'bg-royal-500/20 text-royal-300', delta: 'text-royal-400' },
    neon: { pill: 'bg-neon-500/20  text-neon-300', delta: 'text-neon-400' },
    cyber: { pill: 'bg-cyber-500/20 text-cyber-300', delta: 'text-cyber-400' },
};

export default function Dashboard() {
    const [persona, setPersona] = useState('INVESTOR');
    const meta = PERSONA_META[persona];
    const accent = accentMap[meta.accent];

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            {/* ── Header ───────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{meta.icon}</span>
                    <h1 className="font-display text-3xl font-bold text-gradient-purple">
                        My ET — {meta.label} View
                    </h1>
                </div>
                <p className="text-slate-400 text-sm">{meta.tagline}</p>
            </div>

            {/* ── Persona Switcher ──────────────────────────────── */}
            <div className="flex gap-2 mb-8">
                {Object.keys(PERSONA_META).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPersona(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
              ${persona === p
                                ? `${accent.pill} border-current scale-105 shadow-neon-purple`
                                : 'text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
                            }`}
                    >
                        {PERSONA_META[p].icon} {PERSONA_META[p].label}
                    </button>
                ))}
            </div>

            {/* ── KPI Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {meta.cards.map((card) => (
                    <div key={card.title}
                        className="card-glass p-5 hover:border-royal-500/30 transition-all duration-300
                          hover:shadow-neon-purple animate-slide-up">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{card.title}</p>
                        <p className="font-display text-2xl font-bold text-white mb-1">{card.value}</p>
                        <span className={`text-xs font-medium
              ${card.up === true ? 'text-emerald-400' :
                                card.up === false ? 'text-rose-400' : 'text-slate-400'}`}>
                            {card.up === true ? '▲' : card.up === false ? '▼' : '—'} {card.delta}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── News Feed ─────────────────────────────────────── */}
            <div>
                <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-neon-400 animate-pulse-slow`} />
                    Live Feed
                </h2>
                <div className="flex flex-col gap-3">
                    {MOCK_FEED.map((item) => (
                        <article
                            key={item.id}
                            className="card-glass p-4 flex items-start gap-4 cursor-pointer
                         hover:border-royal-500/40 hover:bg-white/[0.03] transition-all duration-200
                         group"
                        >
                            <span className={`badge mt-0.5 ${accent.pill} shrink-0`}>
                                {item.category}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 group-hover:text-white transition-colors leading-snug">
                                    {item.headline}
                                    {item.hot && (
                                        <span className="ml-2 text-xs bg-neon-500/20 text-neon-300 px-1.5 py-0.5 rounded-full">
                                            🔥 Hot
                                        </span>
                                    )}
                                </p>
                            </div>
                            <span className="text-xs text-slate-600 shrink-0 mt-0.5">{item.time}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
