import React, { ReactNode } from "react";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import Axe from "./_common/axe/Axe";
import CookieBanner from "@/app/_common/cookie-banner/CookieBanner";
import Header from "@/app/_common/header/Header";
import AnalyticsInitializer from "@/app/_common/umami/AnalyticsInitializer";
import GoogleTranslateWorkaroundInitializer from "@/app/_common/googleTranslateWorkaround/googleTranslateWorkaroundInitializer";
import { Page } from "@navikt/ds-react";
import { headers } from "next/headers";

type AppProps = {
    children: ReactNode;
};
async function App({ children }: AppProps) {
    const nonce = (await headers()).get("x-nonce");
    return (
        <div id="app">
            <SkipLink href="#main-content" />
            <GoogleTranslateWorkaroundInitializer />
            <AnalyticsInitializer nonce={nonce} />
            <CookieBanner />

            <Page contentBlockPadding="end" as="div" footer={<Footer />}>
                <Axe />
                <Header />

                <main id="main-content">{children}</main>
            </Page>
        </div>
    );
}

export default App;
