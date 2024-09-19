import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/reset.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/print.css";
import "@navikt/ds-css/dist/components.css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "./(sok)/_components/search.css";
import "./stilling/ad.css";
import "./_common/components/typeahead/Typeahead.css";
import "./styles.css";
import PropTypes from "prop-types";
import { localFont } from "@/app/_common/font/loadFont";
import * as actions from "@/app/_common/actions";
import App from "./App";
import Providers from "./Providers";

export const getMetadataTitle = (title = "Ledige stillinger") => `${title} - arbeidsplassen.no`;
export const defaultMetadataDescription =
    "Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra alle bransjer i markedet";
export const defaultOpenGraphImage = {
    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
    width: 1200,
    height: 630,
};

export const metadata = {
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

export default async function RootLayout({ children }) {
    return (
        <html lang="no">
            <body data-theme="arbeidsplassen" className={localFont.className}>
                <Providers userPreferences={await actions.getUserPreferences()}>
                    <App amplitudeToken={process.env.AMPLITUDE_TOKEN}>{children}</App>
                </Providers>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
