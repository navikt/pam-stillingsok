"use server";

import { z } from "zod";
import { parseSearchParams } from "@/app/stillinger/(sok)/_utils/parseSearchParams";
import { postToSearchApi } from "@/app/stillinger/(sok)/_utils/postToSearchApi";
import { createQuery } from "@/app/stillinger/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import elasticSearchRequestBody from "@/app/stillinger/(sok)/elastic/elasticSearchRequestBody";
import { buildSearchUrl } from "./buildSearchUrl";
import type { WizardState } from "./sokehjelperTypes";
import { wizardStateSchema } from "./wizardStateSchema";

const countResponseSchema = z.object({
    timed_out: z.literal(false).optional(),
    hits: z.object({
        total: z.object({ value: z.number().int().nonnegative() }),
    }),
});

async function fetchCount(url: string): Promise<number> {
    const queryString = url.includes("?") ? url.split("?")[1] : "";
    // Lenken fra søkehjelperen migreres av proxy ved navigering, så tellingen må bruke samme migrerte params
    const params = parseSearchParams(migrateSearchParams(new URLSearchParams(queryString)));

    // elasticSearchRequestBody erstatter size 0 med standardstørrelsen, så size settes etterpå
    const body = { ...elasticSearchRequestBody(createQuery(params)), size: 0, aggs: undefined, timeout: "2s" };

    const response = await postToSearchApi(body);

    if (!response.ok) {
        throw new Error("Søkehjelpertelling feilet");
    }

    const data: unknown = await response.json();
    const parsed = countResponseSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error("Ugyldig søkehjelpertelling");
    }

    return parsed.data.hits.total.value;
}

export async function fetchSokehjelpCount(input: WizardState): Promise<number | null> {
    const parsed = wizardStateSchema.safeParse(input);
    if (!parsed.success) {
        return null;
    }

    const url = buildSearchUrl(parsed.data);

    try {
        return await fetchCount(url);
    } catch {
        return null;
    }
}
