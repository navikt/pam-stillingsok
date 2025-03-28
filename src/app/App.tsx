"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { CookieBanner, Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import * as Sentry from "@sentry/nextjs";
import { getSessionId } from "@/app/stillinger/_common/monitoring/session";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import googleTranslateWorkaround from "@/app/stillinger/_common/utils/googleTranslateWorkaround";
import Axe from "./Axe";
import Umami from "@/app/stillinger/_common/monitoring/Umami";
import { usePathname } from "next/navigation";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her.

type AppProps = {
    userActionTaken: boolean;
    children: ReactNode;
};
function App({ userActionTaken, children }: AppProps) {
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);
    const [localUserActionTaken, setLocalUserActionTaken] = useState<boolean>(userActionTaken);
    const currentPath = usePathname();

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
            {!localUserActionTaken && (
                <CookieBanner
                    onClose={() => {
                        setLocalUserActionTaken(true);
                    }}
                />
            )}
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Axe />
                <Header
                    variant="person"
                    active={currentPath === "/sommerjobb" ? "sommerjobb" : "ledige-stillinger"}
                    authenticationStatus={authStatus}
                    onLogin={login}
                    onLogout={logout}
                />
                <main id="main-content">{children}</main>
                {localUserActionTaken && <Umami />}
            </div>
            <Footer />
        </div>
    );
}

export default App;
