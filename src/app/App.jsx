import React, { useContext } from "react";
import { Footer, Header, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import { AuthenticationContext } from "./_common/auth/contexts/AuthenticationProvider";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her

function App({ children, amplitudeToken }) {
    return (
        <div id="app">
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
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
