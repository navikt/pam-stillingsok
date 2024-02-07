import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/reset.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/print.css";
import "@navikt/ds-css/dist/components.css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "./stillinger/(sok)/_components/search.css";
import "./stillinger/stilling/ad.css";
import "./_common/components/typeahead/Typeahead.css";
import "./styles.css";
import PropTypes from "prop-types";
import interLocalFont from "next/font/local";
import App from "./App";
import { getDefaultDescription, getDefaultTitle } from "./_common/utils/htmlMeta";

const myFont = interLocalFont({
    variable: "--font-inter",
    src: "../../public/font/InterVariable.ttf",
    weight: "100 900",
    display: "swap",
});

export const metadata = {
    title: getDefaultTitle(),
    description: getDefaultDescription(),
    openGraph: {
        title: getDefaultTitle(),
        description: getDefaultDescription(),
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="nb">
            <body data-theme="arbeidsplassen" className={myFont.className}>
                <App>{children}</App>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
