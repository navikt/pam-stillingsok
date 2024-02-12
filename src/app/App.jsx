"use client";

import React, { useEffect } from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import Header from "./_common/components/header/Header";
import AuthenticationProvider from "./_common/auth/contexts/AuthenticationProvider";
import UserProvider from "./_common/user/UserProvider";
import { initAmplitude } from "./_common/tracking/amplitude";
import googleTranslateWorkaround from "./_common/utils/googleTranslateWorkaround";
import initSentry from "./_common/tracking/sentry";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her

function App({ children }) {
    useEffect(() => {
        initSentry();
        initAmplitude();
        googleTranslateWorkaround();
    }, []);

    return (
        <AuthenticationProvider>
            <UserProvider>
                <div id="app">
                    <SkipLink href="#main-content" />
                    <div className="arb-push-footer-down">
                        <Header />
                        <main id="main-content">{children}</main>
                    </div>
                    <Footer />
                </div>
            </UserProvider>
        </AuthenticationProvider>
    );
}

App.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default App;
