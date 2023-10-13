"use client";

import React from "react";
import Header from "../modules/common/components/header/Header";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";

function App({ children }) {
    return (
        <div id="app">
            <SkipLink href="#main-content" />
            <div className="arb-push-footer-down">
                <Header />
                <main>{children}</main>
            </div>
            <Footer />
        </div>
    );
}

export default App;
