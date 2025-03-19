function join(arr1: string[], arr2: string[]) {
    return arr1.map((str1) => arr2.map((str2) => `${str1}${str2}`)).flat();
}

export const SOMMERJOBB_KEYWORDS: readonly string[] = Object.freeze([
    ...join(
        ["sommer", "sommar", "sumar"],
        ["hjelp", "jobb", "oppdrag", "sesong", "vikar", "vikarar", "vikarer", "vikariat"],
    ),
    "summer",
]);

export const SOMMERJOBB_CATEGORIES = Object.freeze(
    [
        {
            label: "Butikk",
            values: [
                "butikk",
                "butikkarbeid",
                "butikkarbeider",
                "butikkmedarbeider",
                "detaljhandel",
                "kiosk",
                "varepåfylling",
            ],
        },
        {
            label: "Helse",
            values: [
                "ambulanse",
                "bpa",
                "ergoterapeut",
                "fysioterapeut",
                "helse",
                "helsearbeid",
                "helsearbeider",
                "helsefag",
                "helsefagarbeider",
                "helsesekretær",
                "hjemmehjelp",
                "hjemmetjeneste",
                "hjemmetjenesten",
                "lege",
                "legesenter",
                "miljøarbeid",
                "miljøarbeider",
                "miljøterapeut",
                "miljøterapi",
                "omsorg",
                "omsorgsarbeid",
                "omsorgsbolig",
                "sjukehus",
                "sykehjem",
                "sykehus",
                "sykepleier",
                "sykepleierstudent",
                "tannhelse",
                "tannklinikk",
                "tannpleier",
            ],
        },
        {
            label: "Kontor",
            values: ["kontor", "administrasjon", "sekretær", "saksbehandler", "saksbehandling", "arkiv"],
        },
        { label: "Kultur", values: ["kultur", "kunst", "musikk", "museum", "bibliotek"] },
        {
            label: "Kundeservice",
            values: ["support", "publikumsmottak", "resepsjonist"],
        },
        {
            label: "Lager og industri",
            values: [
                "anlegg",
                "anleggsarbeid",
                "fabrikk",
                "havbruk",
                "industri",
                "lager",
                "lagerarbeid",
                "logistikk",
                "produksjon",
                "produksjonsarbeider",
                "produksjonsmedarbeider",
                "produktutvikling",
            ],
        },
        { label: "Renhold", values: ["renholder", "renholdsarbeider", "vaskehjelp"] },
        {
            label: "Restaurant og kafé",
            values: [
                "barista",
                "bartender",
                "cafe",
                "café",
                "kafe",
                "kafé",
                "kafémedarbeider",
                "kaffebar",
                "kantine",
                "kokk",
                "restaurant",
                "ryddehjelp",
                "servering",
                "servitør",
            ],
        },
        { label: "Transport", values: ["transport", "sjåfør"] },
        {
            label: "Turisme",
            values: ["turisme", "reiseliv", "guide", "camping", "turistinformasjon", "turistvert"],
        },
        {
            label: "Utendørs",
            values: [
                "festival",
                "friluft",
                "gartner",
                "gressklipping",
                "grøntanlegg",
                "kirkegård",
                "landbruk",
                "park",
                "parkanlegg",
                "parkarbeid",
                "parvedlikehold",
                "plenklipping",
                "skog",
                "skogbruk",
                "utearbeid",
                "utemiljø",
                "utendørs",
                "utendørsarbeid",
            ],
        },
    ].map((row) => Object.freeze({ label: row.label, values: Object.freeze(row.values) })),
);
