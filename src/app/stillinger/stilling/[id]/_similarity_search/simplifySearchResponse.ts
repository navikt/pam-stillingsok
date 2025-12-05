import {
    type LignendeAnnonserResponse,
    mapHits,
    type StillingSoekElement,
} from "@/server/schemas/stillingSearchSchema";

export type SimilaritySearchResultData = {
    ads: StillingSoekElement[];
    totalAds: number;
};

/**
 * This function extract and return only the search result information
 * we need, and make response less nested.
 */
export default function simplifySearchResponse(response: LignendeAnnonserResponse): SimilaritySearchResultData {
    return {
        ads: response.hits.hits.map(mapHits),
        totalAds: response.hits.total.value,
    };
}
