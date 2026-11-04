"use server";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { createQuery } from "@/app/stillinger/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import elasticSearchRequestBody from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";
import { buildSearchUrl } from "./buildSearchUrl";
import type { WizardState } from "./sokehjelperTypes";
import { wizardStateSchema } from "./wizardStateSchema";

export async function fetchSokehjelpCount(input: WizardState): Promise<number | null> {
    // Serveraksjoner er offentlige, så typen alene garanterer ikke formen på input
    const parsed = wizardStateSchema.safeParse(input);
    if (!parsed.success) {
        return null;
    }

    const url = buildSearchUrl(parsed.data);
    const queryString = url.includes("?") ? url.split("?")[1] : "";
    // Lenken fra søkehjelperen migreres av proxy ved navigering, så tellingen må bruke samme migrerte params
    const urlSearchParams = migrateSearchParams(new URLSearchParams(queryString));

    const params: Record<string, string | string[]> = {};
    for (const key of new Set(urlSearchParams.keys())) {
        const values = urlSearchParams.getAll(key);
        params[key] = values.length === 1 ? values[0] : values;
    }

    // elasticSearchRequestBody erstatter size 0 med standardstørrelsen, så size settes etterpå
    const body = { ...elasticSearchRequestBody(createQuery(params)), size: 0, aggs: undefined };

    const headers = await getDefaultHeaders();

    try {
        const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/_search`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return null;
        }

        const data: unknown = await response.json();

        if (
            data !== null &&
            typeof data === "object" &&
            "hits" in data &&
            data.hits !== null &&
            typeof data.hits === "object" &&
            "total" in data.hits &&
            data.hits.total !== null &&
            typeof data.hits.total === "object" &&
            "value" in data.hits.total &&
            typeof data.hits.total.value === "number"
        ) {
            return data.hits.total.value;
        }

        return null;
    } catch {
        return null;
    }
}
