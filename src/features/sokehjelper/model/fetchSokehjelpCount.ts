"use server";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { createQuery } from "@/app/stillinger/(sok)/_utils/query";
import elasticSearchRequestBody from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";
import { buildSearchUrl } from "./buildSearchUrl";
import type { WizardState } from "./sokehjelperTypes";

export async function fetchSokehjelpCount(state: WizardState): Promise<number> {
    const url = buildSearchUrl(state);
    const queryString = url.includes("?") ? url.split("?")[1] : "";
    const urlSearchParams = new URLSearchParams(queryString);

    const params: Record<string, string | string[]> = {};
    for (const key of new Set(urlSearchParams.keys())) {
        const values = urlSearchParams.getAll(key);
        params[key] = values.length === 1 ? values[0] : values;
    }

    const query = { ...createQuery(params), size: 0 };
    const body = { ...elasticSearchRequestBody(query), aggs: undefined };

    const headers = await getDefaultHeaders();

    try {
        const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/_search`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return 0;
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

        return 0;
    } catch {
        return 0;
    }
}
