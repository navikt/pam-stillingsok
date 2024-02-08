"use client";

import React from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import Header from "./_common/components/header/Header";
import AuthenticationProvider from "./_common/auth/contexts/AuthenticationProvider";
import FavouritesProvider from "./favoritter/_components/FavouritesProvider";
import UserProvider from "./_common/user/UserProvider";

// Todo: Gå igjennom alle fetch-kall i koden og se om referrer er satt riktig. Nå er den satt referrer: CONTEXT_PATH, men ikke sikker på hva som er rett her

function App({ children }) {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <div id="app">
                        <SkipLink href="#main-content" />
                        <div className="arb-push-footer-down">
                            <Header />
                            <main id="main-content">{children}</main>
                        </div>
                        <Footer />
                    </div>
                </FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

App.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default App;
