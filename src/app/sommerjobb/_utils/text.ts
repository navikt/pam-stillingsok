const normalizeWhitespace = (value: string): string => {
    return value.replace(/\s+/g, " ").trim();
};

export const truncateAtWordBoundary = (value: string, maxChars: number): string => {
    const text = normalizeWhitespace(value);

    if (text.length <= maxChars) {
        return text;
    }

    const cut = text.slice(0, maxChars);
    const lastSpaceIndex = cut.lastIndexOf(" ");

    if (lastSpaceIndex < Math.floor(maxChars * 0.6)) {
        return `${cut.trimEnd()}…`;
    }

    return `${cut.slice(0, lastSpaceIndex).trimEnd()}…`;
};
