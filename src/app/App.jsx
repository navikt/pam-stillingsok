"use client";

import React from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import Header from "./stillinger/_common/components/header/Header";
import AuthenticationProvider from "./stillinger/_common/auth/contexts/AuthenticationProvider";
import FavouritesProvider from "./stillinger/favoritter/_components/FavouritesProvider";
import UserProvider from "./stillinger/_common/user/UserProvider";

function App({ children }) {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <div id="app">
                        <SkipLink href="#main-content" />
                        <div className="arb-push-footer-down">
                            <Header />
                            <main>{children}</main>
                        </div>
                        <Footer />
                    </div>
                </FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

App.propTypes = {
    children: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default App;
