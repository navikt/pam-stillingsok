import { Heading } from "@navikt/ds-react";
import React from "react";
import SimilaritySearchResult from "@/app/stillinger/stilling/[id]/_components/SimilaritySearchResult";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";

type SimilarAdsProps = {
    searchResult: SimilaritySearchResultData;
};

export default function SimilarAds({ searchResult }: SimilarAdsProps): React.ReactElement {
    return (
        <section className="full-width mt-16">
            <Heading level="2" size="large" spacing>
                Lignende annonser
            </Heading>
            <SimilaritySearchResult searchResult={searchResult} />
        </section>
    );
}
