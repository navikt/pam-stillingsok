import type { VariantKey } from "./types";
import { ExperimentKey } from "@/app/_experiments/experiments";

export function getExperimentCookieName(key: ExperimentKey): string {
    return `ab_${key}`;
}

export type ExperimentCookieValue = Readonly<{
    readonly variant: VariantKey;
}>;

export function parseExperimentCookieValue(raw: string | undefined): ExperimentCookieValue | null {
    if (raw === "standard") {
        return { variant: "standard" };
    }
    if (raw === "test") {
        return { variant: "test" };
    }
    return null;
}
