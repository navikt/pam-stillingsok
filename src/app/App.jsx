"use client";

import React from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import PropTypes from "prop-types";
import Header from "../modules/common/components/header/Header";
import AuthenticationProvider from "../modules/common/auth/contexts/AuthenticationProvider";
import FavouritesProvider from "../modules/favoritter/context/FavouritesProvider";
import UserProvider from "../modules/common/user/UserProvider";

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
