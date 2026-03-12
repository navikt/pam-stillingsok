import "server-only";

import { cookies } from "next/headers";
import type { VariantKey } from "../types";
import { getExperimentCookieName, parseExperimentCookieValue } from "../cookies";
import { ExperimentKey } from "@/app/_experiments/experiments";

export type VariantMap = Readonly<Record<ExperimentKey, VariantKey>>;

/**
 * Leser variant for flere eksperimenter på én gang (server-side).
 *
 * - Denne funksjonen en `VariantMap` (key -> variant) som kan sendes til en
 *   client `ExperimentProvider`, slik at client-komponenter kan hente variant via hook
 *   (`useExperimentVariant`) uten prop-drilling.
 *
 * - Leser `ab_<experimentKey>`-cookies via `next/headers`.
 * - Parser cookieverdi til `VariantKey` ("standard" | "test").
 * - Dersom cookie mangler/er ugyldig, faller vi tilbake til "standard".
 */
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
