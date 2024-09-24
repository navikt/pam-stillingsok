import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";

export default interface SearchResult {
    ads: [];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number;
}
