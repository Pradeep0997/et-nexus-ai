import React, { useState } from 'react';

const MOCK_BRIEFING = `## 📊 Today's Market Intelligence Brief

**Key Theme:** RBI Rate Hold & Rupee Stability

---

### 1. Monetary Policy — Status Quo with Hawks in the Room
The Reserve Bank of India held benchmark rates at **6.50%**, citing sticky core inflation hovering near 4.9%. Governor Shaktikanta Das flagged that the Monetary Policy Committee remains vigilant about food price volatility heading into the summer months.

> 💡 **What this means:** Borrowing costs stay elevated. Rate-sensitive sectors (real estate, auto) may remain under pressure short-term.

---

### 2. Rupee Strengthens as Dollar Index Eases
The Indian rupee gained **18 paise** to close at ₹83.29/USD after the US Fed's latest commentary hinted at a possible rate cut in Q3 2025. FII inflows of ₹4,200 Cr were recorded in equities.

---

### 3. Quick Commerce Wars Intensify
Zepto's $350M raise at a $5B valuation puts immense pressure on Swiggy Instamart and Blinkit. Expect **hyper-localised dark store expansion** in Tier-2 cities as the next battleground.

---

*AI-synthesised from 24 sources · Updated 11:02 IST*`;

const MOCK_MESSAGES = [
    { role: 'ai', text: 'I\'ve prepared today\'s briefing. Ask me anything about the stories above!' },
];

export default function BriefingView() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input.trim() };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setLoading(true);

        // TODO: wire to /api/briefing/chat
        await new Promise((r) => setTimeout(r, 1200));
        setMessages((m) => [
            ...m,
            { role: 'ai', text: '🤖 [AI response will come from the Akka HTTP backend — wiring up next!]' },
        ]);
        setLoading(false);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            <h1 className="font-display text-3xl font-bold text-gradient-cyber mb-2">
                📰 News Navigator
            </h1>
            <p className="text-slate-400 text-sm mb-8">
                AI-synthesised briefing · Ask anything in the chat →
            </p>

            <div className="flex gap-6 h-[calc(100vh-14rem)]">
                {/* ── LEFT: Briefing markdown ──────────────────────── */}
                <article className="flex-1 card-glass p-6 overflow-y-auto prose prose-invert prose-sm
                            max-w-none prose-headings:font-display prose-headings:text-slate-100
                            prose-a:text-royal-400 prose-strong:text-white prose-blockquote:border-royal-500">
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm font-sans">
                        {MOCK_BRIEFING}
                    </div>
                    <p className="mt-6 text-xs text-slate-600 italic">
                        ✨ Full markdown rendering + AI generation wired in Phase 3
                    </p>
                </article>

                {/* ── RIGHT: Chat panel ────────────────────────────── */}
                <aside className="w-96 card-glass flex flex-col">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse-slow" />
                        <h2 className="font-semibold text-sm text-slate-200">Ask the AI</h2>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                  ${msg.role === 'user'
                                        ? 'bg-royal-600/40 text-white rounded-br-sm border border-royal-500/30'
                                        : 'bg-white/5 text-slate-300 rounded-bl-sm border border-white/10'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm
                                px-4 py-2.5 text-slate-400 text-sm">
                                    <span className="inline-flex gap-1">
                                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="px-4 py-4 border-t border-white/10 shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about the briefing…"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                           text-sm text-slate-200 placeholder-slate-600
                           focus:outline-none focus:border-royal-500/50 focus:bg-white/8
                           transition-all duration-200"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="btn-neon px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed
                           disabled:hover:scale-100"
                            >
                                ↑
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 text-center">
                            Powered by Gemini · responses cached via Redis
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}
