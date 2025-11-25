import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/reset.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/print.css";
import "@navikt/ds-css/dist/components.css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "@/app/stillinger/(sok)/_components/search.css";
import "@/app/stillinger/stilling/ad.css";
import "./_common/css/index.css";
import "./styles.css";
import { localFont } from "@/app/_common/utils/loadFont";
import { ReactElement, Suspense } from "react";
import App from "./App";
import Providers from "./Providers";
import ScrollTracker from "@/app/_common/umami/ScrollTracker";
import { UtmParamsHandler } from "@/app/_common/trackers/UtmParamsHandler";
import SkyraInit from "./_common/skyra/SkyraInit";
import CookieMetrics from "./_common/trackers/CookieMetrics";
import { Metadata } from "next";

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
        <html lang="no">
            <body data-theme="arbeidsplassen" className={localFont.className}>
                <Providers>
                    <App>{children}</App>
                    {/* FastApi tracking paused until it #researchops fixes it */}
                    <ScrollTracker />
                    <Suspense fallback={null}>
                        <UtmParamsHandler />
                    </Suspense>

                    <CookieMetrics />
                    <SkyraInit />
                </Providers>
            </body>
        </html>
    );
}
