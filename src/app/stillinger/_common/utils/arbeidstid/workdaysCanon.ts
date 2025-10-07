export type CanonicalDay = "Ukedager" | "Lørdag" | "Søndag";

export const DISPLAY_ORDER: readonly CanonicalDay[] = ["Ukedager", "Lørdag", "Søndag"] as const;

export const CANONICAL_MAP: Readonly<Record<string, CanonicalDay>> = {
    ukedager: "Ukedager",
    hverdager: "Ukedager",
    weekdays: "Ukedager",
    lørdag: "Lørdag",
    lordag: "Lørdag",
    saturday: "Lørdag",
    søndag: "Søndag",
    sondag: "Søndag",
    sunday: "Søndag",
} as const;
