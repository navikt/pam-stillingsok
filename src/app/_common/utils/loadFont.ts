import interLocalFont from "next/font/local";

export const localFont = interLocalFont({
    variable: "--font-inter",
    src: "../../../../public/font/InterVariable.woff2",
    weight: "100 900",
    display: "swap",
    preload: true,
    adjustFontFallback: "Arial",
});
