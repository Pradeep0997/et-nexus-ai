import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Language definitions ───────────────────────────────────────────────────────
export const LANGUAGES = {
    EN: { label: 'EN', name: 'English', flag: '🇬🇧', dir: 'ltr' },
    HI: { label: 'HI', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    TA: { label: 'TA', name: 'தமிழ்', flag: '🌿', dir: 'ltr' },
    TE: { label: 'TE', name: 'తెలుగు', flag: '🌸', dir: 'ltr' },
};

// ── Translated content strings ────────────────────────────────────────────────
// Each key is a "content ID" used across the app
export const TRANSLATIONS = {
    EN: {
        dashboardTitle: 'My ET',
        dashboardTagline: 'Your personalised business intelligence feed',
        briefingTitle: 'News Navigator',
        briefingTagline: 'AI-synthesised story arc · Interactive timeline · Follow-up chat',
        summaryLabel: 'AI Summary',
        keyPlayersLabel: 'Key Players',
        askAiLabel: 'Ask the AI',
        chatPlaceholder: 'Ask about the briefing…',
        generateVideo: '🎬 Generate Video',
        topicRbi: '🏦 RBI Rate Decision',
        topicQcomm: '⚡ Quick Commerce',
        topicEconomy: '📊 India Economy',
        rbiSummary: 'The Reserve Bank of India held the benchmark repo rate at 6.50% for the seventh consecutive meeting. Governor Das cited sticky core CPI at 4.9% and food price volatility. Bond markets rallied marginally while the rupee strengthened 18 paise.',
        storyArcLabel: 'Story Arc',
    },
    HI: {
        dashboardTitle: 'मेरा ET',
        dashboardTagline: 'आपकी व्यक्तिगत व्यापार खुफिया फ़ीड',
        briefingTitle: 'समाचार नेविगेटर',
        briefingTagline: 'AI-संश्लेषित कथा चाप · इंटरेक्टिव टाइमलाइन · अनुवर्ती चैट',
        summaryLabel: 'AI सारांश',
        keyPlayersLabel: 'प्रमुख खिलाड़ी',
        askAiLabel: 'AI से पूछें',
        chatPlaceholder: 'ब्रीफिंग के बारे में पूछें…',
        generateVideo: '🎬 वीडियो बनाएं',
        topicRbi: '🏦 RBI दर निर्णय',
        topicQcomm: '⚡ त्वरित वाणिज्य',
        topicEconomy: '📊 भारतीय अर्थव्यवस्था',
        rbiSummary: 'भारतीय रिजर्व बैंक ने लगातार सातवीं बार बेंचमार्क रेपो दर को 6.50% पर बनाए रखा। गवर्नर दास ने 4.9% पर बनी रहने वाली मूल मुद्रास्फीति और खाद्य कीमतों में उतार-चढ़ाव का हवाला दिया। बॉन्ड बाजार में मामूली तेजी आई जबकि रुपया 18 पैसे मजबूत होकर 83.29 पर पहुंच गया।',
        storyArcLabel: 'कथा चाप',
    },
    TA: {
        dashboardTitle: 'என் ET',
        dashboardTagline: 'உங்கள் தனிப்பயனாக்கப்பட்ட வணிக நுண்ணறிவு ஊட்டம்',
        briefingTitle: 'செய்தி வழிகாட்டி',
        briefingTagline: 'AI-தொகுக்கப்பட்ட கதை வளைவு · இடைவினை காலவரிசை · தொடர்பு அரட்டை',
        summaryLabel: 'AI சுருக்கம்',
        keyPlayersLabel: 'முக்கிய வீரர்கள்',
        askAiLabel: 'AI யிடம் கேளுங்கள்',
        chatPlaceholder: 'அறிக்கையைப் பற்றி கேளுங்கள்…',
        generateVideo: '🎬 வீடியோ உருவாக்கு',
        topicRbi: '🏦 RBI வட்டி விகித முடிவு',
        topicQcomm: '⚡ விரைவு வணிகம்',
        topicEconomy: '📊 இந்திய பொருளாதாரம்',
        rbiSummary: 'இந்திய ரிசர்வ் வங்கி தொடர்ந்து ஏழாவது முறையாக repo வட்டி விகிதத்தை 6.50% ஆக வைத்திருக்கிறது. கவர்னர் தாஸ் 4.9% அளவில் நிலையான மைய CPI மற்றும் உணவு விலை ஏற்ற இறக்கத்தை காரணமாக சுட்டி காட்டினார். ரூபாய் 18 பைசா உயர்ந்தது.',
        storyArcLabel: 'கதை வளைவு',
    },
    TE: {
        dashboardTitle: 'నా ET',
        dashboardTagline: 'మీ వ్యక్తిగతీకరించిన వ్యాపార నిఘా ఫీడ్',
        briefingTitle: 'వార్తల నావిగేటర్',
        briefingTagline: 'AI-సంశ్లేషిత కథా చాపం · అన్వేషణీయ టైమ్‌లైన్ · అనుసరణ చాట్',
        summaryLabel: 'AI సారాంశం',
        keyPlayersLabel: 'కీలక ఆటగాళ్ళు',
        askAiLabel: 'AI ని అడగండి',
        chatPlaceholder: 'బ్రీఫింగ్ గురించి అడగండి…',
        generateVideo: '🎬 వీడియో రూపొందించు',
        topicRbi: '🏦 RBI రేటు నిర్ణయం',
        topicQcomm: '⚡ త్వరిత వాణిజ్యం',
        topicEconomy: '📊 భారత ఆర్థిక వ్యవస్థ',
        rbiSummary: 'భారతీయ రిజర్వ్ బ్యాంక్ వరుసగా ఏడవ సారి బెంచ్‌మార్క్ రెపో రేటును 6.50% వద్ద కొనసాగించింది. గవర్నర్ దాస్ 4.9% వద్ద నిలిచిపోయిన కోర్ CPI మరియు ఆహార ధరల హెచ్చుతగ్గులను కారణంగా చెప్పారు. రూపాయి 18 పైసలు పెరిగి 83.29 వద్ద స్థిరపడింది.',
        storyArcLabel: 'కథా చాపం',
    },
};

// ── Context ───────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('EN');
    const [loading, setLoading] = useState(false);

    const switchLanguage = useCallback(async (newLang) => {
        if (newLang === lang) return;
        setLoading(true);
        // Simulate a network call to a translation service
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
        setLang(newLang);
        setLoading(false);
    }, [lang]);

    const t = useCallback(
        (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.EN[key] ?? key,
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, loading, switchLanguage, t, LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
    return ctx;
}
