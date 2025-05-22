import { createContext, useState, useMemo, useEffect, useRef, ReactNode } from "react";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

export interface CookieBannerContextType {
    showCookieBanner: boolean;
    setShowCookieBanner: (show: boolean) => void;
    openCookieBanner: (buttonElement: HTMLElement | null) => void;
    closeCookieBanner: () => void;
}

interface CookieBannerProviderProps {
    children: ReactNode;
    initialState?: boolean;
}

const CookieBannerContext = createContext<CookieBannerContextType | undefined>(undefined);

export function CookieBannerProvider({ children, initialState }: CookieBannerProviderProps) {
    const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
        if (initialState !== undefined) {
            return initialState;
        }
        return !CookieBannerUtils.getUserActionTakenValue();
    });

    const [autoFocus, setAutoFocus] = useState<boolean>(false);
    const buttonRef = useRef<HTMLElement | null>(null);

    // Manually open banner, and enable autofocus
    const openCookieBanner = (buttonElement: HTMLElement | null) => {
        buttonRef.current = buttonElement;
        setAutoFocus(true);
        setShowCookieBanner(true);
    };

    // Close banner and set focus back to button that opened it
    const closeCookieBanner = () => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
        setShowCookieBanner(false);
    };

    useEffect(() => {
        const firstButton = document.getElementById("arb-cookie-banner-section")?.querySelector("button");
        if (showCookieBanner && autoFocus && firstButton) {
            firstButton.focus();
            setAutoFocus(false);
        }
    }, [showCookieBanner, autoFocus]);

    const contextValue = useMemo<CookieBannerContextType>(
        () => ({
            showCookieBanner,
            setShowCookieBanner,
            openCookieBanner,
            closeCookieBanner,
        }),
        [showCookieBanner],
    );

    return <CookieBannerContext.Provider value={contextValue}>{children}</CookieBannerContext.Provider>;
}

export default CookieBannerContext;
