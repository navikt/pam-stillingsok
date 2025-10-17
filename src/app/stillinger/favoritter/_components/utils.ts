type Dir = "asc" | "desc";

/** Parse ISO (eller annet Date-parsebart) til epoch-ms. NaN hvis tom/ugyldig. */
const toEpoch = (s: string | null | undefined): number => (s ? Date.parse(s) : Number.NaN);

/** Sammenlign to dato-felt, med null/ugyldig sist. */
const compareDates = (a: string | null | undefined, b: string | null | undefined, dir: Dir): number => {
    const ta = toEpoch(a);
    const tb = toEpoch(b);
    const aValid = Number.isFinite(ta);
    const bValid = Number.isFinite(tb);

    if (aValid && bValid) {
        const diff = ta - tb;
        return dir === "asc" ? diff : -diff;
    }
    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;
    return 0;
};

export const byDate =
    <T>(selector: (x: T) => string | null | undefined, dir: Dir) =>
    (a: T, b: T): number =>
        compareDates(selector(a), selector(b), dir);
