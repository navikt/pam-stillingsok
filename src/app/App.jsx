"use client";

import React from "react";
import Header from "../modules/common/components/header/Header";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import AuthenticationProvider from "../modules/common/auth/contexts/AuthenticationProvider";
import UserProvider from "../modules/common/user/contexts/UserProvider";
import FavouritesProvider from "../modules/favoritter/context/FavouritesProvider";

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

export default App;
