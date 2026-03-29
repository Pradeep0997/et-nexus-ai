import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryArc from '../components/StoryArc';

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8080';

const TOPIC_PRESETS = [
    { key: 'rbi-rate-decision', label: '🏦 RBI Rate Decision' },
    { key: 'quick-commerce', label: '⚡ Quick Commerce' },
    { key: 'india-economy', label: '📊 India Economy' },
];

// ── Chat message bubble ───────────────────────────────────────────────────────
function ChatBubble({ msg, index }) {
    const isUser = msg.role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-7 h-7 rounded-full bg-royal-500/30 border border-royal-500/40
                        flex items-center justify-center text-sm mr-2 mt-0.5 shrink-0">
                    🤖
                </div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
        ${isUser
                    ? 'bg-royal-600/40 text-white rounded-br-sm border border-royal-500/30'
                    : 'bg-white/[0.05] text-slate-300 rounded-bl-sm border border-white/10'
                }`}
            >
                {msg.text}
            </div>
        </motion.div>
    );
}

// ── Key player card ───────────────────────────────────────────────────────────
const IMPACT_COLORS = {
    high: 'text-rose-300   bg-rose-500/15   border-rose-500/30',
    medium: 'text-amber-300  bg-amber-500/15  border-amber-500/30',
    low: 'text-slate-400  bg-slate-700/30  border-slate-600/30',
};

function PlayerChip({ player }) {
    const c = IMPACT_COLORS[player.impact] ?? IMPACT_COLORS.low;
    return (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10
                    hover:border-white/20 transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal-500/30 to-neon-500/20
                      flex items-center justify-center text-sm font-bold text-white shrink-0">
                {player.name[0]}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{player.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{player.role}</p>
            </div>
            <span className={`badge text-[10px] border shrink-0 ${c}`}>{player.impact}</span>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BriefingView() {
    const [topic, setTopic] = useState('rbi-rate-decision');
    const [briefing, setBriefing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cached, setCached] = useState(false);

    const [messages, setMessages] = useState([
        { role: 'ai', text: '👋 Select a topic above and I\'ll synthesise the briefing. Then ask me anything!' },
    ]);
    const [input, setInput] = useState('');
    const [chatBusy, setChatBusy] = useState(false);
    const messagesEndRef = useRef(null);

    // ── Fetch briefing from backend ───────────────────────────────────────────
    const fetchBriefing = useCallback(async (t) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/briefing?topic=${encodeURIComponent(t)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setBriefing(data);
            setCached(data.cached ?? false);
            setMessages([
                { role: 'ai', text: `✅ Briefing loaded for **${data.topic}**. Ask me anything!` },
            ]);
        } catch (err) {
            // Fallback to built-in mock when backend isn't running
            setError('Backend offline — showing demo data');
            setBriefing(DEMO_BRIEFING);
            setCached(false);
            setMessages([
                { role: 'ai', text: '⚠️ Backend offline — showing demo data. Start `sbt run` to load live data.' },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBriefing(topic); }, [topic]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // ── Chat send ─────────────────────────────────────────────────────────────
    const handleSend = async () => {
        if (!input.trim() || chatBusy) return;
        const userMsg = input.trim();
        setInput('');
        setMessages((m) => [...m, { role: 'user', text: userMsg }]);
        setChatBusy(true);
        await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
        // TODO: wire to POST /api/briefing/chat with context
        setMessages((m) => [
            ...m,
            { role: 'ai', text: `💡 Great question about "${userMsg.slice(0, 40)}…". The AI chat endpoint will be wired to Gemini via the Akka HTTP backend in the next phase.` },
        ]);
        setChatBusy(false);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-10">
            {/* ── Page header + topic picker ────────────────────── */}
            <div className="mb-6">
                <h1 className="font-display text-3xl font-bold text-gradient-cyber mb-1">
                    📰 News Navigator
                </h1>
                <p className="text-slate-400 text-sm mb-4">
                    AI-synthesised story arc · Interactive timeline · Follow-up chat
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    {TOPIC_PRESETS.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setTopic(p.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${topic === p.key
                                    ? 'bg-cyber-500/20 text-cyber-300 border-cyber-500/40 shadow-neon-cyan scale-105'
                                    : 'text-slate-400 border-white/10 hover:border-white/25 hover:text-slate-200'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}

                    {/* Cache badge */}
                    <AnimatePresence>
                        {briefing && (
                            <motion.span
                                key={cached ? 'hit' : 'miss'}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`ml-auto badge text-[10px] border font-mono
                  ${cached
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                        : 'bg-amber-500/15  text-amber-300  border-amber-500/30'
                                    }`}
                            >
                                {cached ? '⚡ Redis HIT' : '🔄 Redis MISS'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Split-screen ──────────────────────────────────── */}
            <div className="flex gap-5 h-[calc(100vh-16rem)] min-h-[600px]">

                {/* ════════════ LEFT: Story Arc ════════════════════ */}
                <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
                    {/* Summary card */}
                    <div className="card-glass p-5 shrink-0">
                        {loading ? (
                            <div className="space-y-3">
                                {[80, 95, 70, 85].map((w, i) => (
                                    <div key={i} className={`h-3 bg-white/10 rounded-full animate-pulse`}
                                        style={{ width: `${w}%` }} />
                                ))}
                            </div>
                        ) : briefing ? (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">AI Summary</span>
                                    {error && <span className="badge bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]">demo</span>}
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{briefing.summary}</p>
                            </>
                        ) : null}
                    </div>

                    {/* Timeline */}
                    <div className="card-glass p-5 flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white/10 shrink-0 mt-1.5 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-white/10 rounded-full w-1/3 animate-pulse" />
                                            <div className="h-3 bg-white/10 rounded-full w-2/3 animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : briefing ? (
                            <StoryArc events={briefing.timeline_events} topic={briefing.topic} />
                        ) : null}
                    </div>
                </div>

                {/* ════════════ RIGHT: Key Players + Chat ══════════ */}
                <div className="w-[360px] shrink-0 flex flex-col gap-4">

                    {/* Key players */}
                    <div className="card-glass p-4 shrink-0">
                        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                            Key Players
                        </h2>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {(briefing?.key_players ?? []).map((p, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <PlayerChip player={p} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat panel */}
                    <div className="card-glass flex flex-col flex-1 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 shrink-0">
                            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse-slow" />
                            <h2 className="text-sm font-semibold text-slate-200">Ask the AI</h2>
                            <span className="ml-auto text-xs text-slate-600">Gemini · Redis cached</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                            {messages.map((msg, i) => (
                                <ChatBubble key={i} msg={msg} index={i} />
                            ))}

                            {chatBusy && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-1.5 px-4 py-3 bg-white/5
                             border border-white/10 rounded-2xl rounded-bl-sm w-fit"
                                >
                                    {[0, 150, 300].map((d) => (
                                        <span key={d}
                                            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                                            style={{ animationDelay: `${d}ms` }} />
                                    ))}
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/10 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={chatBusy}
                                    placeholder="Ask about the briefing…"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5
                             text-sm text-slate-200 placeholder-slate-600
                             focus:outline-none focus:border-royal-500/50 transition-all duration-200
                             disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={chatBusy || !input.trim()}
                                    className="btn-neon px-4 py-2.5 text-lg leading-none
                             disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    ↑
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Demo data (offline fallback) ──────────────────────────────────────────────
const DEMO_BRIEFING = {
    topic: 'rbi-rate-decision',
    summary: 'The Reserve Bank of India held the benchmark repo rate at 6.50% for the seventh consecutive meeting. Governor Das cited sticky core CPI at 4.9% and food price volatility. Bond markets rallied marginally while the rupee strengthened 18 paise.',
    cached: false,
    timeline_events: [
        { date: 'Feb 2023', title: 'Rate Hiking Cycle Begins', description: 'RBI kicks off 250 bps hike cycle to combat post-pandemic inflation.', sentiment: 'negative' },
        { date: 'Apr 2023', title: 'Repo Hits 6.50%', description: 'RBI reaches terminal rate of 6.50%; signalling peak of cycle.', sentiment: 'neutral' },
        { date: 'Oct 2023', title: 'Pause Mode Begins', description: 'MPC unanimously votes to hold — prioritising growth while watching CPI.', sentiment: 'neutral' },
        { date: 'Jun 2024', title: 'CPI Eases to 4.75%', description: 'Headline inflation finally within tolerance band; market expects cut.', sentiment: 'positive' },
        { date: 'Aug 2024', title: 'Food Inflation Spikes', description: 'Vegetable prices surge 25% YoY; MPC delays expected cut for 2nd time.', sentiment: 'negative' },
        { date: 'Mar 2025', title: '7th Consecutive Hold', description: 'Rate held at 6.50%; one dissenting vote signals cut is on the table.', sentiment: 'neutral' },
    ],
    key_players: [
        { name: 'Shaktikanta Das', role: 'RBI Governor', impact: 'high' },
        { name: 'MPC Committee', role: 'Rate Setting Body', impact: 'high' },
        { name: 'Shashanka Bhide', role: 'External MPC Member', impact: 'medium' },
        { name: 'Finance Ministry', role: 'Fiscal Partner', impact: 'medium' },
        { name: 'FII Desk', role: 'Market Participant', impact: 'low' },
    ],
};
