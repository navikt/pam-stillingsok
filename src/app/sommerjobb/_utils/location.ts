const isNonEmpty = (value: string | null | undefined): value is string => {
    if (typeof value !== "string") {
        return false;
    }
    return value.trim().length > 0;
};

export const formatLocation = (location: string | null | undefined, maxParts: number): string | undefined => {
    if (!isNonEmpty(location)) {
        return undefined;
    }

    const parts = location
        .split(", ")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

    if (parts.length > maxParts) {
        return `${parts.slice(0, maxParts).join(", ")} m.fl.`;
    }

    return location;
};
