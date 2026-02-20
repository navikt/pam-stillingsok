export const MULIGHETER_KATEGORIER = Object.freeze([
    "Bygg og anlegg",
    "Helse og sosial",
    "Håndverkere",
    "Industri og produksjon",
    "IT",
    "Kontor og økonomi",
    "Kultur og kreative yrker",
    "Natur og miljø",
    "Reiseliv og mat",
    "Salg og service",
    "Sikkerhet og beredskap",
    "Transport og lager",
    "Utdanning",
    "Uoppgitt/ ikke identifiserbare",
]);

export function muligheterKategorierDisplayNames(value: string): string {
    switch (value) {
        case "Uoppgitt/ ikke identifiserbare":
            return "Annet";
        case "Håndverkere":
            return "Håndverk";
        default:
            return value;
    }
}
