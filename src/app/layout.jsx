import { Inter } from "next/font/google";
import "@navikt/ds-css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "./styles.css";
import "./stillinger/(sok)/_components/search.css";
import "./stillinger/stilling/ad.css";
import "./_common/components/typeahead/Typeahead.css";
import PropTypes from "prop-types";
import App from "./App";
import { getDefaultDescription, getDefaultTitle } from "../../server/common/htmlMeta";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--inter-font",
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
        <html lang="nb" className={inter.variable}>
            <body data-theme="arbeidsplassen">
                <App>{children}</App>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
