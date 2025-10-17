import { parseStringList, type StringListInput } from "@/app/stillinger/_common/utils/text/listParsing";
import { dedupeStringsPreserveFirst } from "@/app/stillinger/_common/utils/text/dedupe";
import { CANONICAL_MAP, CanonicalDay, DISPLAY_ORDER } from "@/app/stillinger/_common/utils/arbeidstid";
import { removeDiacriticsLower } from "@/app/stillinger/_common/utils/text/normalize";
import { formatNbList } from "@/app/stillinger/_common/utils/text/nbFormat";

export function formatWorkdaysString(
    workdays: StringListInput,
    opts?: { useCustomJoin?: (values: readonly string[]) => string },
): string | null {
    const parsed = parseStringList(workdays);
    if (!parsed) {
        return null;
    }

    const unique = dedupeStringsPreserveFirst(parsed);

    const recognized = new Set<CanonicalDay>();
    const others: string[] = [];
    for (const val of unique) {
        const key = removeDiacriticsLower(val);
        const canon = CANONICAL_MAP[key];
        if (canon) recognized.add(canon);
        else others.push(val);
    }

    if (DISPLAY_ORDER.every((d) => recognized.has(d))) {
        return "Alle dager";
    }

    const orderedKnown = DISPLAY_ORDER.filter((d) => recognized.has(d));
    const output = [...orderedKnown, ...others];

    if (output.length === 0) {
        return null;
    }

    const display = output.map((s) => (s === "Ukedager" ? "Ukedager" : s.toLocaleLowerCase()));

    const joiner = opts?.useCustomJoin ?? formatNbList;
    return joiner(display);
}
