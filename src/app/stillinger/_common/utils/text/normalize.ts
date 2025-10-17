/** Fjern diakritikk, trim og lower – fin som nøkkel for duplikat-sjekk. */
export function removeDiacriticsLower(s: string): string {
    return s
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toLowerCase();
}
