import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

export type SearchResult = {
    ads: StillingSoekElement[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number | undefined;
};
