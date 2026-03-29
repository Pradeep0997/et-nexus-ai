import React, { createContext, useContext, useState } from 'react';

const PersonaContext = createContext(null);

export const PERSONA_KEYS = ['INVESTOR', 'FOUNDER', 'STUDENT'];

export function PersonaProvider({ children }) {
    const [persona, setPersona] = useState('INVESTOR');
    return (
        <PersonaContext.Provider value={{ persona, setPersona }}>
            {children}
        </PersonaContext.Provider>
    );
}

export function usePersona() {
    const ctx = useContext(PersonaContext);
    if (!ctx) throw new Error('usePersona must be used inside <PersonaProvider>');
    return ctx;
}
