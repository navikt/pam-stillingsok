import type FilterAggregations from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";
import { type StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

export type SearchResult = {
    ads: StillingSoekElement[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number | undefined;
};
