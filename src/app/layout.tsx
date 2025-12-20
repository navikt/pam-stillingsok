import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/reset.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/print.css";
import "@navikt/ds-css/dist/components.css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "@/app/(nonce)/stillinger/(sok)/_components/search.css";
import "@/app/(nonce)/stillinger/stilling/ad.css";
import "./_common/css/index.css";
import "./styles.css";
import { localFont } from "@/app/_common/utils/loadFont";
import React, { ReactElement } from "react";
import { Metadata } from "next";
import { CookieBannerProvider } from "@/app/_common/cookie-banner/CookieBannerContext";

export const metadata: Metadata = {
    metadataBase: new URL("https://arbeidsplassen.nav.no"),
    title: {
        template: "%s - arbeidsplassen.no",
        default: "Arbeidsplassen.no",
    },
    openGraph: {
        images: [
            {
                url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",

        images: [
            {
                url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
                width: 1200,
                height: 675,
            },
        ],
    },
    icons: {
        icon: `/favicon.png`,
    },
    formatDetection: {
        telephone: false,
        date: false,
        email: false,
        address: false,
    },
};

type RootLayoutProps = {
    children: ReactElement;
};
export default async function RootLayout({ children }: RootLayoutProps): Promise<ReactElement> {
    return (
        <html lang="nb">
            <body data-theme="arbeidsplassen" className={localFont.className}>
                <CookieBannerProvider>{children}</CookieBannerProvider>
            </body>
        </html>
    );
}
