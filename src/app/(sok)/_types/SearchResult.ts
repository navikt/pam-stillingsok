import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { StillingDTO } from "@/server/schemas/stillingSearchSchema";

export type SearchResult = {
    ads: StillingDTO[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number | undefined;
};
