import { Heading } from "@navikt/ds-react";
import React from "react";
import SimilaritySearchResult from "@/app/stillinger/stilling/[id]/_components/SimilaritySearchResult";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";

type SimilarAdsProps = {
    searchResult: SimilaritySearchResultData;
    explain?: boolean;
};

export default function SimilarAds({ searchResult, explain = false }: SimilarAdsProps): React.ReactElement {
    return (
        <section className="full-width mt-10">
            <Heading level="2" size="medium" spacing>
                Lignende annonser
            </Heading>
            <SimilaritySearchResult searchResult={searchResult} explain={explain} />
        </section>
    );
}
