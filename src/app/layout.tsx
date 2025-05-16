import { cookies } from "next/headers";
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
import * as actions from "@/app/stillinger/_common/actions";
import { ReactElement } from "react";
import App from "./App";
import Providers from "./Providers";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";
import { FastApiTracker } from "@/app/_common/trackers/fastApiTracking";
import ScrollTracker from "@/app/_common/umami/ScrollTracker";
import { Metadata } from "@/app/stillinger/stilling/_data/types";

export const metadata: Metadata = {
    title: {
        template: "%s - arbeidsplassen.no",
        default: "Arbeidsplassen.no",
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
    const cookieStore = cookies();
    const cookiesValue = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    const userActionTaken = CookieBannerUtils.getUserActionTakenValue(cookiesValue) ?? false;

    return (
        <html lang="no">
            <body data-theme="arbeidsplassen" className={localFont.className}>
                <Providers userActionTaken={userActionTaken} userPreferences={await actions.getUserPreferences()}>
                    <App userActionTaken={userActionTaken}>{children}</App>
                    <FastApiTracker />
                    <ScrollTracker />
                </Providers>
            </body>
        </html>
    );
}
