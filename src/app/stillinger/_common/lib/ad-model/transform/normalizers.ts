export function parseStrictBoolean(value: unknown): boolean | undefined {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        const s = value.trim().toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
    }
    return undefined;
}
