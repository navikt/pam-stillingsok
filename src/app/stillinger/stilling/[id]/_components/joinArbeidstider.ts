import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";

/* ===== Typer ===== */
type NullableString = string | null | undefined;
type StringListInput = string | ReadonlyArray<string> | null | undefined;
type LowercaseMode = "all" | "exceptFirst" | "none";
type CanonicalDay = "Ukedager" | "Lørdag" | "Søndag";

/* ===== Konstantar / mapping ===== */
const DISPLAY_ORDER: readonly CanonicalDay[] = ["Ukedager", "Lørdag", "Søndag"] as const;

const CANON_MAP: Readonly<Record<string, CanonicalDay>> = {
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

/* ===== Felles hjelpere ===== */
const removeDiacriticsLower = (s: string): string =>
    s
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toLowerCase();

/** Norsk liste: "a", "a og b", "a, b og c" */
const formatNbList = (arr: readonly string[]): string => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} og ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")} og ${arr[arr.length - 1]}`;
};

/** Parse til strengliste (støtter JSON-streng og "A, B" format). Returnerer null hvis ingen gyldige element. */
const parseStringList = (input: StringListInput): string[] | null => {
    if (input == null) return null;

    let list: string[] = [];
    if (Array.isArray(input)) {
        list = input.filter((v): v is string => typeof v === "string");
    } else if (typeof input === "string") {
        const trimmed = input.trim();
        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    list = parsed.filter((v): v is string => typeof v === "string");
                } else {
                    list = [input];
                }
            } catch {
                list = input.split(/\s*,\s*/);
            }
        } else {
            list = input.split(/\s*,\s*/);
        }
    }

    // rens & fjern tomme
    list = list.map((s) => s.trim()).filter((s) => s.length > 0);
    return list.length ? list : null;
};

/** Dedupe case/diakritikk-insensitiv, bevar første forekomsts original-casing og rekkefølge. */
const dedupePreserveFirst = (list: readonly string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of list) {
        const key = removeDiacriticsLower(raw);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(raw);
    }
    return out;
};

/** Casing-regler for visning: all | none | exceptFirst */
const applyCasing = (list: readonly string[], mode: LowercaseMode): string[] => {
    if (mode === "all") return list.map((s) => s.toLocaleLowerCase());
    if (mode === "none") return [...list];
    // exceptFirst
    return list.map((s, i) => (i === 0 ? s : s.toLocaleLowerCase()));
};

/* ===== Workdays ===== */
export function formatWorkdaysString(
    workdays: StringListInput,
    opts?: { useCustomJoin?: (values: readonly string[]) => string },
): string | null {
    const parsed = parseStringList(workdays);
    if (!parsed) return null;

    const unique = dedupePreserveFirst(parsed);

    // Kategoriser: kjente (kanon) + øvrige
    const recognized = new Set<CanonicalDay>();
    const others: string[] = [];
    for (const val of unique) {
        const key = removeDiacriticsLower(val);
        const canon = CANON_MAP[key];
        if (canon) recognized.add(canon);
        else others.push(val);
    }

    // Alle tre kjente -> "Alle dager"
    if (DISPLAY_ORDER.every((d) => recognized.has(d))) {
        return "Alle dager";
    }

    // Sett sammen i definert rekkefølge, så øvrige
    const orderedKnown = DISPLAY_ORDER.filter((d) => recognized.has(d));
    const output = [...orderedKnown, ...others];

    if (output.length === 0) return null;

    // Visningsregel: "Ukedager" beholdes slik; andre i liten skrift
    const display = output.map((s) => (s === "Ukedager" ? "Ukedager" : s.toLocaleLowerCase()));

    const joiner = opts?.useCustomJoin ?? formatNbList;
    return joiner(display);
}

/* ===== Work time ===== */
export function formatWorkTimeString(
    workTime: StringListInput,
    opts?: {
        useCustomJoin?: (values: readonly string[]) => string;
        lowercaseMode?: LowercaseMode; // default: "exceptFirst"
    },
): string | null {
    const parsed = parseStringList(workTime);
    if (!parsed) return null;

    const unique = dedupePreserveFirst(parsed);
    const mode: LowercaseMode = opts?.lowercaseMode ?? "exceptFirst";
    const display = applyCasing(unique, mode);

    const joiner = opts?.useCustomJoin ?? formatNbList;
    return joiner(display);
}

/* ===== Join alt sammen ===== */
const capitalizeFirst = (s: string): string => (s.length ? s[0].toLocaleUpperCase() + s.slice(1) : s);

export function joinArbeidstider(
    jobArrangement: NullableString,
    workTime: ReadonlyArray<string> | null | undefined,
    workdays: ReadonlyArray<string> | null | undefined,
): string {
    // formatWorkTimeString vil bevare første elements casing (default "exceptFirst").
    // Dersom jobArrangement mangler, sikrer vi stor forbokstav på setningen.
    const workTimeStr = formatWorkTimeString(workTime);
    const workdaysStr = formatWorkdaysString(workdays);

    const parts: string[] = [];

    if (jobArrangement) {
        parts.push(jobArrangement);
        if (workTimeStr) parts.push(workTimeStr);
    } else if (workTimeStr) {
        parts.push(capitalizeFirst(workTimeStr));
    }

    if (workdaysStr) parts.push(workdaysStr);

    return joinStringWithSeparator(parts, ", ", true, false);
}
