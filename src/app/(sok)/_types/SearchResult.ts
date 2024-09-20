import Aggregations from "@/app/(sok)/_types/Aggregations";

export default interface SearchResult {
    ads: [];
    aggregations: Aggregations;
    totalAds: number;
    totalPositions: number;
}
