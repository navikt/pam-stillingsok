export const defaultMetadataDescription: string =
    "Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra alle bransjer i markedet";

export const getMetadataTitle: (title?: string) => string = (title = "Ledige stillinger") =>
    `${title} - arbeidsplassen.no`;
