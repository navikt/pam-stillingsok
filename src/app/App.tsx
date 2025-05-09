"use client";

import React, { ReactNode, useContext, useEffect, useRef } from "react";
import { CookieBanner, Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import * as Sentry from "@sentry/nextjs";
import { getSessionId } from "@/app/stillinger/_common/monitoring/session";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import googleTranslateWorkaround from "@/app/_common/utils/googleTranslateWorkaround";
import Axe from "./Axe";
import Umami from "@/app/stillinger/_common/monitoring/Umami";
import { usePathname } from "next/navigation";
import COMPANY_PATHS from "@/app/(forside)/bedrift/companyPaths";
import CookieBannerContext from "@/app/_common/contexts/CookieBannerContext";

function getActiveMenuItem(pathname: string): string {
    if (pathname === "/sommerjobb") {
        return "sommerjobb";
    } else if (pathname.startsWith("/stillinger")) {
        return "ledige-stillinger";
    }
    return "";
}

type AppProps = {
    userActionTaken: boolean;
    children: ReactNode;
};
function App({ userActionTaken, children }: AppProps) {
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);
    const currentPath = usePathname();
    const headerVariant = COMPANY_PATHS.includes(currentPath) ? "company" : "person";
    const { closeCookieBanner, showCookieBanner, setShowCookieBanner } = useContext(CookieBannerContext);
    const bannerRef = useRef(null);

    useEffect(() => {
        googleTranslateWorkaround();
    }, []);

    useEffect(() => {
        const sessionId = getSessionId();
        Sentry.setUser({ id: sessionId, sessionId });
        Sentry.setTags({ sessionId });
    }, []);

    let authStatus = "unknown";
    if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        authStatus = "is-authenticated";
    } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        authStatus = "not-authenticated";
    }

    return (
        <div id="app">
            {showCookieBanner && (
                <CookieBanner
                    headingLevel="2"
                    bannerRef={bannerRef}
                    onClose={() => {
                        closeCookieBanner();
                        setShowCookieBanner(false);
                    }}
                />
            )}
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Axe />
                <Header
                    variant={headerVariant}
                    active={getActiveMenuItem(currentPath)}
                    authenticationStatus={authStatus}
                    onLogin={login}
                    onLogout={logout}
                />
                <main id="main-content">{children}</main>
                {userActionTaken && <Umami />}
            </div>
            <Footer />
        </div>
    );
}

export default App;
