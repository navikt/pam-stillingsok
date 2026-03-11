import { cookies } from "next/headers";
import type { ExperimentKey, VariantKey } from "./types";
import { getExperimentCookieName, parseExperimentCookieValue } from "./cookies";

export type VariantMap = Readonly<Record<ExperimentKey, VariantKey>>;

export async function getVariantMap(keys: ReadonlyArray<ExperimentKey>): Promise<VariantMap> {
    const cookieStore = await cookies();
    const entries = keys.map((key) => {
        const raw = cookieStore.get(getExperimentCookieName(key))?.value;
        const parsed = parseExperimentCookieValue(raw);
        const variant: VariantKey = parsed?.variant ?? "standard";
        return [key, variant] as const;
    });

    return Object.fromEntries(entries) as VariantMap;
}
