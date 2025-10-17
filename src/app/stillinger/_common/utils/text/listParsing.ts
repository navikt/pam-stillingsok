export type StringListInput = string | ReadonlyArray<string> | null | undefined;

/** Parse til strengliste (støtter JSON-streng og "A, B" format). Returnerer null hvis ingen gyldige element. */
export function parseStringList(input: StringListInput): string[] | null {
    if (input == null) {
        return null;
    }

    let list: string[] = [];
    if (Array.isArray(input)) {
        list = input.filter((v): v is string => typeof v === "string");
    } else if (typeof input === "string") {
        const trimmed = input.trim();
        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                list = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [input];
            } catch {
                list = input.split(/\s*,\s*/);
            }
        } else {
            list = input.split(/\s*,\s*/);
        }
    }

    list = list.map((s) => s.trim()).filter((s) => s.length > 0);
    return list.length ? list : null;
}
