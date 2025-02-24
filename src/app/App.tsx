"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { CookieBanner, Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import * as Sentry from "@sentry/nextjs";
import { getSessionId } from "@/app/_common/monitoring/session";
import { AuthenticationContext, AuthenticationStatus } from "./_common/auth/contexts/AuthenticationProvider";
import googleTranslateWorkaround from "./_common/utils/googleTranslateWorkaround";
import Axe from "./Axe";
import Umami from "@/app/_common/monitoring/Umami";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her.

type AppProps = {
    hasUserTakenCookieAction: boolean;
    children: ReactNode;
};
function App({ hasUserTakenCookieAction, children }: AppProps) {
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);
    const [localHasUserTakenCookieAction, setLocalHasUserTakenCookieAction] =
        useState<boolean>(hasUserTakenCookieAction);

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
            {!localHasUserTakenCookieAction && (
                <CookieBanner
                    onClose={() => {
                        setLocalHasUserTakenCookieAction(true);
                    }}
                />
            )}
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Axe />
                <Header
                    variant="person"
                    active="ledige-stillinger"
                    authenticationStatus={authStatus}
                    onLogin={login}
                    onLogout={logout}
                />
                <main id="main-content">{children}</main>
                {hasUserTakenCookieAction && <Umami />}
            </div>
            <Footer />
        </div>
    );
}

export default App;
