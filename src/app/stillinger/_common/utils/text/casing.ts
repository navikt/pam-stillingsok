export type LowercaseMode = "all" | "exceptFirst" | "none";
export function applyCasing(list: readonly string[], mode: LowercaseMode): string[] {
    if (mode === "all") return list.map((s) => s.toLocaleLowerCase());
    if (mode === "none") return [...list];

    return list.map((s, i) => (i === 0 ? s : s.toLocaleLowerCase()));
}
export const capitalizeFirst = (s: string): string => {
    return s.length ? s[0].toLocaleUpperCase() + s.slice(1) : s;
};
