export type ResolveCanonicalInput = {
    readonly sourceLower: string;
    readonly sourceUrl: string | null | undefined;
    readonly adId: string;
};

export const resolveCanonical = (input: ResolveCanonicalInput): string | undefined => {
    const { sourceLower, sourceUrl, adId } = input;

    if (sourceLower === "finn") {
        if (sourceUrl && sourceUrl.trim().length > 0) {
            return sourceUrl;
        }

        return undefined;
    }

    if (sourceLower === "stillingsregistrering") {
        return `/stillinger/stilling/${adId}`;
    }

    return undefined;
};
