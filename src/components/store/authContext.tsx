import React, { createContext, useContext, useState } from 'react';

interface GlobalContextType {
    token: string | null;
    address: string | null;
    setToken: (token: string | null) => void;
    setAddress: (address: string | null) => void;
}

const GlobalContext = createContext<GlobalContextType>({
    token: null,
    address: null,
    setToken: () => { },
    setAddress: () => { },
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    return (
        <GlobalContext.Provider value={{ token, address, setToken, setAddress }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
