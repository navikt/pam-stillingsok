"use client";

import React, { ReactNode, useEffect } from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import * as Sentry from "@sentry/nextjs";
import { getSessionId } from "@/app/stillinger/_common/monitoring/session";
import googleTranslateWorkaround from "@/app/_common/utils/googleTranslateWorkaround";
import Axe from "./_common/axe/Axe";
import Umami from "@/app/_common/umami/Umami";
import CookieBanner from "@/app/_common/cookie-banner/CookieBanner";
import Header from "@/app/_common/header/Header";
import { configureAnalytics } from "@/app/_common/umami";

type AppProps = {
    userActionTaken: boolean;
    children: ReactNode;
};
function App({ userActionTaken, children }: AppProps) {
    configureAnalytics();
    useEffect(() => {
        googleTranslateWorkaround();
    }, []);

    useEffect(() => {
        const sessionId = getSessionId();
        Sentry.setUser({ id: sessionId, sessionId });
        Sentry.setTags({ sessionId });
    }, []);

    return (
        <div id="app">
            <CookieBanner />
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Axe />
                <Header />
                <main id="main-content">{children}</main>
                {userActionTaken && <Umami />}
            </div>
            <Footer />
        </div>
    );
}

export default App;
