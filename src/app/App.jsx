"use client";

import React, { useContext, useEffect } from "react";
import { Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import { AuthenticationContext, AuthenticationStatus } from "./_common/auth/contexts/AuthenticationProvider";
import { initAmplitude } from "./_common/monitoring/amplitude";
import googleTranslateWorkaround from "./_common/utils/googleTranslateWorkaround";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her

function App({ children, amplitudeToken }) {
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);

    useEffect(() => {
        googleTranslateWorkaround();
    }, []);

    useEffect(() => {
        initAmplitude(amplitudeToken);
    }, [amplitudeToken]);

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
                <Header
                    variant="person"
                    active="ledige-stillinger"
                    authenticationStatus={authStatus}
                    onLogin={login}
                    onLogout={logout}
                />
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
