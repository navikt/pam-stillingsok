import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { StillingSoekResponseExplanation, StillingSoekResponseSource } from "@/server/schemas/stillingSearchSchema";

export type SearchResult = {
    ads: StillingDTO[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number | undefined;
};

export type StillingDTO = {
    score: number;
    _explanation: StillingSoekResponseExplanation;
} & StillingSoekResponseSource;
