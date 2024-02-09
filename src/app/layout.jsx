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
import interLocalFont from "next/font/local";
import App from "./App";
import Script from "next/script";

// Noen miljøvariabler kan bare hentes under kjøretid (spesielt de som er
// definert i nais.yml) vi bruker da et script på endepunkt api/publicEnv for å
// hente og lagre dem inn i variabelen under publicEnv.
// eslint-disable-next-line no-unused-vars
let publicEnv = {};

const myFont = interLocalFont({
    variable: "--font-inter",
    src: "../../public/font/InterVariable.ttf",
    weight: "100 900",
    display: "swap",
});

export const metadata = {
    title: "Ledige stillinger - arbeidsplassen.no",
    description: "Alt av arbeid samlet på én plass",
    openGraph: {
        title: "Ledige stillinger - arbeidsplassen.no",
        description: "Alt av arbeid samlet på én plass",
        images: [
            {
                url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
                width: 1200,
                height: 630,
            },
        ],
    },
    icons: {
        icon: "https://arbeidsplassen.nav.no/favicon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="nb">
            <Script strategy="beforeInteractive" src={`${process.env.INGRESS ?? ""}/stillinger/api/publicEnv`} />
            <body data-theme="arbeidsplassen" className={myFont.className}>
                <App>{children}</App>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
