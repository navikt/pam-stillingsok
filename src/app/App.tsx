import React, { ReactNode } from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import Axe from "./_common/axe/Axe";
import CookieBanner from "@/app/_common/cookie-banner/CookieBanner";
import Header from "@/app/_common/header/Header";
import AnalyticsInitializer from "@/app/_common/umami/AnalyticsInitializer";
import UmamiGate from "@/app/_common/umami/UmamiGate";
import GoogleTranslateWorkaroundInitializer from "@/app/_common/googleTranslateWorkaround/googleTranslateWorkaroundInitializer";

type AppProps = {
    children: ReactNode;
};
function App({ children }: AppProps) {
    return (
        <div id="app">
            <SkipLink href="#main-content" />
            <GoogleTranslateWorkaroundInitializer />
            <AnalyticsInitializer />
            <CookieBanner />

            <div className="arb-push-footer-down">
                <Axe />

                <Header />

                <main id="main-content">{children}</main>
                <UmamiGate />
            </div>
            <Footer />
        </div>
    );
}

export default App;
