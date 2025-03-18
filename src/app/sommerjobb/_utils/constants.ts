export const PAGE_PARAM_NAME = "page";
export const JOB_CATEGORY_PARAM_NAME = "category";
export const DISTANCE_PARAM_NAME = "distance";
export const POSTCODE_PARAM_NAME = "postcode";

export const SOMMERJOBB_SEARCH_RESULT_SIZE: number = 10;

export const DEFAULT_DISTANCE: string = "5";
export const DISTANCE_VALUES: readonly string[] = Object.freeze([
    "1",
    "3",
    "5",
    "7",
    "10",
    "20",
    "30",
    "50",
    "75",
    "100",
    "150",
]);

function join(arr1: string[], arr2: string[]) {
    return arr1.map((str1) => arr2.map((str2) => `${str1}${str2}`)).flat();
}

export const SOMMERJOBB_KEYWORDS: readonly string[] = Object.freeze([
    ...join(["sommer", "sommar", "sumar"], ["jobb", "hjelp", "vikariat", "vikar", "vikarer", "vikarar", "oppdrag"]),
    "summer",
]);

export const SOMMERJOBB_CATEGORIES = Object.freeze(
    [
        { label: "Butikk", values: ["butikk", "butikkmedarbeider", "kiosk", "detaljhandel"] },
        { label: "Helse", values: ["helse", "sykepleier", "lege"] },
        { label: "Kontor", values: ["kontor", "administrasjon", "sekretær"] },
        { label: "Kultur", values: ["kultur", "kunst", "musikk", "museum", "bibliotek"] },
        { label: "Kundeservice", values: ["kundeservice", "support", "kundebehandling"] },
        { label: "Lager og industri", values: ["lager", "industri", "produksjon"] },
        { label: "Renhold", values: ["renhold", "vask", "rengjøring"] },
        {
            label: "Restaurant og kafé",
            values: ["restaurant", "kafé", "café", "kantine", "servitør", "bartender", "kokk"],
        },
        { label: "Transport", values: ["transport", "sjåfør", "logistikk"] },
        { label: "Turisme", values: ["turisme", "reiseliv", "guide", "camping", "hotell"] },
        { label: "Utendørs", values: ["utendørs", "friluft", "gartner", "landbruk"] },
    ].map((row) => Object.freeze({ label: row.label, values: Object.freeze(row.values) })),
);
