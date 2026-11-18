type SearchableFields = {
    title?: string | null;
    employer?: string | null;
    location?: string | null;
};

type FavouriteSearch = {
    active: boolean;
    matches: (fields: SearchableFields) => boolean;
};

function normalize(value: string | null | undefined): string {
    return (value ?? "").toLocaleLowerCase("nb-NO").normalize("NFC");
}

function foldAsciiSearch(value: string): string {
    return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/æ/g, "ae").replace(/ø/g, "o");
}

function isAscii(value: string): boolean {
    return value.length > 0 && [...value].every((character) => character.charCodeAt(0) <= 0x7f);
}

export function createFavouriteSearch(searchTerm: string): FavouriteSearch {
    const words = searchTerm
        .trim()
        .split(/\s+/u)
        .filter(Boolean)
        .map((word) => normalize(word));
    const active = words.length > 0;
    const hasAsciiWord = words.some(isAscii);

    return {
        active,
        matches(fields) {
            if (!active) {
                return true;
            }

            const values = [fields.title, fields.employer, fields.location].map(normalize);
            const foldedValues = hasAsciiWord ? values.map(foldAsciiSearch) : [];

            return words.every((word) => {
                const matchesNormally = values.some((value) => value.includes(word));
                return matchesNormally || (isAscii(word) && foldedValues.some((value) => value.includes(word)));
            });
        },
    };
}
