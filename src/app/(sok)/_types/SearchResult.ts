import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";

type OccupationCategory = {
    id: string;
    categoryType: string;
    name: string;
};

type SearchTag = {
    label: string;
};

export interface SearchResultAd {
    uuid: string;
    score: number;
    categoryList: OccupationCategory[];
    properties: {
        searchtags: SearchTag[];
    };
}

export default interface SearchResult {
    ads: SearchResultAd[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number;
}
