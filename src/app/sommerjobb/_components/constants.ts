export const PAGE_PARAM_NAME = "page";
export const JOB_CATEGORY_PARAM_NAME = "category";
export const DISTANCE_PARAM_NAME = "distance";
export const POSTCODE_PARAM_NAME = "postcode";

export const SOMMERJOBB_SEARCH_RESULT_SIZE = 10;

export const DEFAULT_DISTANCE = 5;
export const DISTANCE_VALUES = [1, 3, 5, 7, 10, 20, 30, 50, 75, 100, 150];

function join(arr1: string[], arr2: string[]) {
    return arr1.map((str1) => arr2.map((str2) => `${str1}${str2}`)).flat();
}

export const SOMMERJOBB_PHRASES = ["sommer 2025"];

export const SOMMERJOBB_KEYWORDS = [
    ...join(["sommer", "sommar", "ferie", "sessong"], ["jobb"]),
    ...join(["sommer", "sommar", "sessong"], ["hjelp"]),
    ...join(["sommer", "sommar", "ferie", "sessong"], ["vikar", "vikarer", "vikarar"]),
    ...join(["sommer", "sommar"], ["oppdrag"]),
    ...join(["sessong"], ["arbeid"]),
];

export const SOMMERJOBB_CATEGORIES = [
    { label: "Butikk", values: ["butikk", "salg", "detaljhandel"] },
    { label: "Helse", values: ["helse", "sykepleier", "lege"] },
    { label: "Kontor", values: ["kontor", "administrasjon", "sekretær"] },
    { label: "Kultur", values: ["kultur", "kunst", "musikk"] },
    { label: "Kundeservice", values: ["kundeservice", "support", "kundebehandling"] },
    { label: "Lager og industri", values: ["lager", "industri", "produksjon"] },
    { label: "Renhold", values: ["renhold", "vask", "rengjøring"] },
    { label: "Restaurant og kafé", values: ["restaurant", "kafé", "servering"] },
    { label: "Transport", values: ["transport", "sjåfør", "logistikk"] },
    { label: "Turisme", values: ["turisme", "reiseliv", "guide"] },
    { label: "Utendørs", values: ["utendørs", "friluft"] },
];
