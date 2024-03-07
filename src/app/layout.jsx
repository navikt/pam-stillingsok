import PropTypes from "prop-types";

export const getMetadataTitle = (title = "Ledige stillinger") => `${title} - arbeidsplassen.no`;
export const defaultMetadataDescription =
    "Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra alle bransjer i markedet";
export const defaultOpenGraphImage = {
    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
    width: 1200,
    height: 630,
};

export default async function RootLayout({ children }) {
    return (
        <html lang="no">
            <body>tester responstid</body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
