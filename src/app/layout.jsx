import "@navikt/ds-css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import "../modules/common/styles/styles.css";
import App from "./App";

export const metadata = {
    title: "Ledige stillinger - arbeidsplassen.no",
    description:
        "Søk etter ledige stillinger. Heltid- og deltidsjobber i offentlig og privat sektor i Oslo, Bergen, Trondheim, Stavanger, Tromsø og alle kommuner i Norge.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body data-theme="arbeidsplassen">
                <App>{children}</App>
            </body>
        </html>
    );
}
