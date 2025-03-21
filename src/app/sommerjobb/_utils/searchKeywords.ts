function join(arr1: string[], arr2: string[]) {
    return arr1.map((str1) => arr2.map((str2) => `${str1}${str2}`)).flat();
}

export const SOMMERJOBB_KEYWORDS: readonly string[] = Object.freeze([
    ...join(
        ["sommer", "sommar", "sumar"],
        ["hjelp", "jobb", "oppdrag", "sesong", "vikar", "vikarar", "vikarer", "vikariat"],
    ),
    ...join(["ferie"], ["jobb", "vikar", "vikarar", "vikarer", "vikariat"]),
    ...join(["sesong"], ["hjelp", "jobb", "vikar", "vikarar", "vikarer", "vikariat"]),
    "summer",
]);

export const SOMMERJOBB_CATEGORIES = Object.freeze(
    [
        {
            label: "Butikk",
            values: [
                "Bensinstasjon",
                "Butikk",
                "Butikkansatt",
                "Butikkarbeid",
                "Butikkarbeider",
                "Butikkmedarbeider",
                "Butikkselger",
                "Kiosk",
            ],
        },
        {
            label: "Helse og omsorg",
            values: [
                "Aktivitetsleder",
                "Aktivitetssenter",
                "Ambulanse",
                "Apotek",
                "Apotektekniker",
                "Avlastningssenter",
                "BPA",
                "BPA-assistent",
                "Barnehageassistent",
                "Bioingeniør",
                "Bofellesskap",
                "Eldreomsorg",
                "Ergoterapeut",
                "Farmasi",
                "Farmasøyt",
                "Fysioterapeut",
                "Heimahjelp",
                "Heimehjelp",
                "Heimeteneste",
                "Helse og omsorg",
                "Helse",
                "Helsearbeid",
                "Helsearbeider",
                "Helsefag",
                "Helsefagarbeider",
                "Helsehjelp",
                "Helsepersonell",
                "Helsesekretær",
                "Helsevesen",
                "Hjelpetelefon",
                "Hjemmehjelp",
                "Hjemmetjeneste",
                "Hjemmetjenesten",
                "Jordmor",
                "Krisesenter",
                "Ledsager",
                "Lege",
                "Legesenter",
                "Lærer",
                "Medisinstudent",
                "Miljøarbeider",
                "Miljøterapeut",
                "Miljøterapi",
                "Omsorg",
                "Omsorgsarbeid",
                "Omsorgsbolig",
                "Omsorgsbustad",
                "Omsorgssenter",
                "Pedagogisk arbeid",
                "Poliklinikk",
                "Radiograf",
                "Reiseassistanse",
                "SFO",
                "SFO-leder",
                "Sterilforsyning",
                "Sykehusapotek",
                "Sykepleier",
                "Sykepleierstudent",
                "Tannhelse",
                "Tannklinikk",
                "Tannpleier",
                "Voksenopplæring",
                "medisinstudent",
            ],
        },
        {
            label: "Salg og service",
            values: [
                "Badevakt",
                "Befaring",
                "Bibliotek",
                "Billettering",
                "Billettkontroll",
                "Billettselger",
                "Bilutleie",
                "Bingo",
                "Boligstylist",
                "Booking",
                "Dørsalg",
                "Feltsalg",
                "Feltverver",
                "Fundraiser",
                "Informasjonsarbeid",
                "Innsjekk",
                "Innsjekking",
                "Isbil",
                "Kundebehandler",
                "Kundekonsulent",
                "Kundesenter",
                "Ordrebehandler",
                "Ordrebehandling",
                "Passasjerservice",
                "Resepsjon",
                "Resepsjonist",
                "Saksbehandler", // todo sjekk denne
                "Saksbehandling", // todo sjekk denne
                "Salgskonsulent",
                "Salgsmedarbeider",
                "Sentralbord",
                "Servicekontor",
                "Support",
                "Telefonarbeid",
                "Telefonsupport",
                "Vekter",
                "Vervearbeid",
                "Verver",
            ],
        },
        {
            label: "Praktisk arbeid",
            values: [
                "Anleggsarbeid",
                "Arkivering",
                "Baseoperatør",
                "Bilvask",
                "Bilvedlikehold",
                "Bilverksted",
                "Byggdrift",
                "Dataregistrering",
                "Dekkbytte",
                "Dekkhotell",
                "Dekkmontering",
                "Dekkomlegging",
                "Digitalisering",
                "Dokumentregistrering",
                "Drift",
                "Driftsoperatør",
                "Elektriker",
                "Fabrikk",
                "Fabrikkarbeid",
                "Flyarbeider",
                "Flytting",
                "Forefallende arbeid",
                "Gartner",
                "Gjenvinning",
                "Gjenvinningsstasjon",
                "Gravplass",
                "Gressklipping",
                "Grøntanlegg",
                "Grøntareal",
                "Gårdsarbeid",
                "Havbruk",
                "Hygieneservice",
                "Industriarbeider",
                "Industrimekanikk",
                "Innmåling",
                "Kirkegård",
                "Kontorbeplantning",
                "Lagerarbeid", // Unngå "Lager", gir mye treff i andre jobber
                "Lagerarbeider",
                "Lagermedarbeider",
                "Lageroperatør",
                "Landbruk",
                "Landmåler",
                "Lasting",
                "Maskinist",
                "Matros",
                "Miljøstasjon",
                "Oppdrett",
                "Park",
                "Parkanlegg",
                "Parkarbeid",
                "Parkarbeider",
                "Parkvedlikehold",
                "Parkvesen",
                "Plenklipping",
                "Produksjon",
                "Produksjonsarbeider",
                "Produksjonsmedarbeider",
                "Produktutvikling",
                "Renovasjon",
                "Reparasjon",
                "Restaurering",
                "Skanning",
                "Skog",
                "Skogbruk",
                "Strandsonekartlegger",
                "Teknisk medarbeider",
                "Terminalkoordinator",
                "Terminalmedarbeider",
                "Truckfører",
                "Utearbeid",
                "Vaktmester",
                "Vareplukker",
                "Varetelling",
                "Vedlikehold",
                "Verksted",
            ],
        },
        {
            label: "Renhold",
            values: [
                "Flyrenholder",
                "Housekeeper",
                "Housekeeping",
                "Renholder", // Unngå Renhold og Rengjøring, gir mange feilkilder
                "Renholdsarbeider",
                "Renholdsassistent",
                "Renholdsbetjent",
                "Renholdsmedarbeider",
                "Renholdsoperatør",
                "Stuepike",
                "Sykehusrenhold",
                "Vaskehjelp",
                "Vaskeri",
            ],
        },
        {
            label: "Restaurant og kafé",
            values: [
                "Baker",
                "Bakeri",
                "Bar",
                "Barista",
                "Bartender",
                "Cafe",
                "Café",
                "Catering",
                "Fastfood",
                "Foodtruck",
                "Frokostansvarlig",
                "Frokostvert",
                "Kafe",
                "Kaffebar",
                "Kafé",
                "Kafémedarbeider",
                "Kjøkken",
                "Kjøkkenassistent",
                "Kjøkkenhjelp",
                "Kjøkkenmedarbeider",
                "Kjøkkenpersonell",
                "Kokk",
                "Pub",
                "Restaurant",
                "Resturantansvarlig",
                "Ryddehjelp",
                "Servering",
                "Servitør",
                "Storkjøkken",
                "Take away",
            ],
        },
        {
            label: "Sjåfør",
            values: ["Avislevering", "Bil", "Isbil", "Pakkelevering", "Lastebilsjåfør", "Sjåfør"],
        },
        {
            label: "Turisme",
            values: [
                "Fornøyelsespark",
                "Guide",
                "Guiding",
                "Historie",
                "Kulturformidling",
                "Kulturhistorie",
                "Museumsarbeid",
                "Museumsmedarbeider",
                "Museumsvert",
                "Omviser",
                "Omvisning",
                "Reiseliv",
                "Turguide",
                "Turisme",
                "Turisthytte",
                "Turistinformasjon",
                "Turistvert",
                "Vert",
                "Vertskap",
                "Vitensenter",
            ],
        },
        {
            label: "Andre",
            values: ["showMissing"],
        },
    ].map((row) => Object.freeze({ label: row.label, values: Object.freeze(row.values) })),
);
