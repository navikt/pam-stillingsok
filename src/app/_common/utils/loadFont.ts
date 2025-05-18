import interLocalFont from "next/font/local";

export const localFont = interLocalFont({
    variable: "--font-inter",
    src: "../../../../public/font/InterVariable.ttf",
    weight: "100 900",
    display: "swap",
    preload: true,
    adjustFontFallback: false,
});
