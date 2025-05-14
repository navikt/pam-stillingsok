import { createContext, useState, useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

const CookieBannerContext = createContext();

export function CookieBannerProvider({ children, initialState }) {
    const [showCookieBanner, setShowCookieBanner] = useState(() => {
        if (initialState !== undefined) {
            return initialState;
        }

        return !CookieBannerUtils.getUserActionTakenValue();
    });
    const [autoFocus, setAutoFocus] = useState(false);
    const buttonRef = useRef(null);

    // Manually open banner, and enable autofocus
    const openCookieBanner = (buttonElement) => {
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

    const contextValue = useMemo(
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

CookieBannerProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    initialState: PropTypes.bool,
};

export default CookieBannerContext;
