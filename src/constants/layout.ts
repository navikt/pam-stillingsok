import { OpenGraphImage } from "@/app/stillinger/stilling/_data/types";

export const defaultMetadataDescription: string =
    "Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra alle bransjer i markedet";
export const defaultOpenGraphImage: OpenGraphImage = {
    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
    width: 1200,
    height: 630,
};
export const getMetadataTitle: (title?: string) => string = (title = "Ledige stillinger") =>
    `${title} - arbeidsplassen.no`;
