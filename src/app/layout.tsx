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
import "./_common/css/common.css";
import { localFont } from "@/app/stillinger/_common/font/loadFont";
import * as actions from "@/app/stillinger/_common/actions";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import { ReactElement } from "react";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/app/metadata";
import App from "./App";
import Providers from "./Providers";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";
import { FastApiTracker } from "@/app/_common/fastApiTracking";
import ScrollTracker from "@/app/_common/ScrollTracker";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: getMetadataTitle("Ledige stillinger"),
        description: defaultMetadataDescription,
        openGraph: {
            title: getMetadataTitle("Ledige stillinger"),
            description: defaultMetadataDescription,
            images: [defaultOpenGraphImage],
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
}

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
                <Providers userPreferences={await actions.getUserPreferences()}>
                    <App userActionTaken={userActionTaken}>{children}</App>
                    <FastApiTracker />
                    <ScrollTracker />
                </Providers>
            </body>
        </html>
    );
}
