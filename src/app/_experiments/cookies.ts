import type { ExperimentKey, VariantKey } from "./types";

export const AB_USER_ID_COOKIE = "ab_uid";

export function getExperimentCookieName(key: ExperimentKey): string {
    return `ab_${key}`;
}

export type ExperimentCookieValue = Readonly<{
    readonly variant: VariantKey;
}>;

export function serializeExperimentCookieValue(value: ExperimentCookieValue): string {
    return value.variant;
}

export function parseExperimentCookieValue(raw: string | undefined): ExperimentCookieValue | null {
    if (raw === "standard") {
        return { variant: "standard" };
    }
    if (raw === "test") {
        return { variant: "test" };
    }
    return null;
}
