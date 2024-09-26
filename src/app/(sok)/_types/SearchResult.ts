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
    published: string;
    title: string;
    locationList: [];
    medium: string;
    properties: {
        searchtags: SearchTag[];
        hasInterestform: string;
        jobtitle: string;
        applicationdue: string;
        location: string;
        keywords: string;
    };
}

export default interface SearchResult {
    ads: SearchResultAd[];
    aggregations: FilterAggregations;
    totalAds: number;
    totalPositions: number;
}
