export type ParsedMunicipalKey = {
    readonly countyKey: string;
    readonly municipalKey: string;
};

export const parseMunicipalKey = (value: string): ParsedMunicipalKey | null => {
    const trimmed = value.trim();

    // Må ha nøyaktig én "."
    const firstDotIndex = trimmed.indexOf(".");
    const lastDotIndex = trimmed.lastIndexOf(".");

    if (firstDotIndex <= 0) {
        return null;
    }

    if (lastDotIndex !== firstDotIndex) {
        return null;
    }

    if (firstDotIndex >= trimmed.length - 1) {
        return null;
    }

    const countyKey = trimmed.slice(0, firstDotIndex).trim();
    const municipalKey = trimmed.slice(firstDotIndex + 1).trim();

    if (countyKey.length === 0 || municipalKey.length === 0) {
        return null;
    }

    return { countyKey, municipalKey };
};
