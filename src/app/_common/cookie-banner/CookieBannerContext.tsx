"use client";

import { createContext, useState, useContext, ReactNode, useRef, useMemo, useEffect } from "react";
import { getUserActionTakenValue } from "@navikt/arbeidsplassen-react";

export type CookieBannerContextType = {
    showCookieBanner: boolean;
    setShowCookieBanner: (show: boolean) => void;
    openCookieBanner: (buttonElement: HTMLElement | null) => void;
    closeCookieBanner: () => void;
};

type CookieBannerProviderProps = {
    children: ReactNode;
};

const CookieBannerContext = createContext<CookieBannerContextType | undefined>(undefined);

export function CookieBannerProvider({ children }: CookieBannerProviderProps) {
    const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
    const focusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const userActionTaken = getUserActionTakenValue(document.cookie) ?? false;
        // Hvis bruker ikke har tatt stilling → vis banner
        if (!userActionTaken) {
            setShowCookieBanner(true);
        }
    }, []);

    const openCookieBanner = (buttonElement: HTMLElement | null) => {
        setShowCookieBanner(true);
        focusRef.current = buttonElement;
    };

    const closeCookieBanner = () => {
        setShowCookieBanner(false);
        if (focusRef.current != null) {
            focusRef.current.focus();
        }
    };

    const value = useMemo<CookieBannerContextType>(
        () => ({
            showCookieBanner,
            setShowCookieBanner,
            openCookieBanner,
            closeCookieBanner,
        }),
        [showCookieBanner],
    );

    return <CookieBannerContext.Provider value={value}>{children}</CookieBannerContext.Provider>;
}

export function useCookieBannerContext() {
    const context = useContext(CookieBannerContext);
    if (context === undefined) {
        throw new Error("useCookieBanner must be used within a CookieBannerProvider");
    }
    return context;
}
