import { z } from "zod";

export const AdLanguageCodeSchema = z.unknown().transform((value): string | null => {
    if (typeof value !== "string") {
        return null;
    }

    try {
        return Intl.getCanonicalLocales(value.trim())[0] ?? null;
    } catch (error) {
        if (error instanceof RangeError) {
            return null;
        }
        throw error;
    }
});
