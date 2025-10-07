import { removeDiacriticsLower } from "@/app/stillinger/_common/utils/text/normalize";

/** Beholder første forekomst; dupliser oppdages på diakritikk-/case-uavhengig nøkkel. */
export function dedupeStringsPreserveFirst(list: readonly string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of list) {
        const key = removeDiacriticsLower(raw);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(raw);
    }
    return out;
}
