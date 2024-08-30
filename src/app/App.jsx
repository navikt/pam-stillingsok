"use client";

import React, { useContext, useEffect } from "react";
import { Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import * as Sentry from "@sentry/nextjs";
import PropTypes from "prop-types";
import { usePathname } from "next/navigation";
import { getSessionId } from "@/app/_common/monitoring/session";
import companyPaths from "@/app/(artikler)/isCompanyPage";
import { AuthenticationContext, AuthenticationStatus } from "./_common/auth/contexts/AuthenticationProvider";
import { initAmplitude } from "./_common/monitoring/amplitude";
import googleTranslateWorkaround from "./_common/utils/googleTranslateWorkaround";
import Axe from "./Axe";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her

function App({ children, amplitudeToken }) {
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);
    const pathname = usePathname();

    useEffect(() => {
        googleTranslateWorkaround();
    }, []);

    useEffect(() => {
        initAmplitude(amplitudeToken);
    }, [amplitudeToken]);

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
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Axe />
                <Header
                    variant={companyPaths.includes(pathname) ? "company" : "person"}
                    active={pathname.startsWith("/stillinger") ? "ledige-stillinger" : undefined}
                    authenticationStatus={authStatus}
                    onLogin={login}
                    onLogout={logout}
                />
                tests
                <main id="main-content">{children}</main>
            </div>
            <Footer />
        </div>
    );
}

App.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    amplitudeToken: PropTypes.string,
};

export default App;
