"use client";

import React, { ReactNode } from "react";
import { Box, Heading, Tag } from "@navikt/ds-react";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";
import AdAdminBar from "./AdAdminBar";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { Alert, BodyLong } from "@navikt/ds-react";
import SimilarAds from "@/app/stillinger/stilling/[id]/_components/SimilarAds";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";

type PageProps = {
    adData: AdDTO;
    organizationNumber?: string | undefined;
    searchResult?: SimilaritySearchResultData | undefined;
    explain?: boolean;
};
function Ad({ adData, organizationNumber, searchResult, explain = false }: PageProps): ReactNode {
    const annonseErAktiv = adData?.status === "ACTIVE";
    console.log(adData);
    return (
        <Box as="article">
            <AdAdminBar adData={adData} organizationNumber={organizationNumber} />

            <Box className="container-small" paddingBlock={{ xs: "4 12", md: "10 24" }}>
                <Heading level="1" size="xlarge" className="overflow-wrap-anywhere" spacing>
                    {adData?.title}
                </Heading>
                <Summary adData={adData} />
                {!annonseErAktiv && (
                    <Tag variant="warning-moderate" className="mt-4">
                        Stillingsannonsen er inaktiv.
                    </Tag>
                )}

                <EmploymentDetails adData={adData} />
                {annonseErAktiv && <HowToApply adData={adData} />}
                {adData.isZodError && (
                    <Alert variant="warning" className="mb-4">
                        <Heading level="5" size="xsmall" align="start" className="mb-2">
                            Problemer med visning av stillingsannonsen
                        </Heading>
                        <BodyLong>
                            Vi har for tiden problemer med å vise stillingsannonsen. Vi jobber med å løse problemet så
                            raskt som mulig.
                        </BodyLong>
                    </Alert>
                )}

                {adData.adTextHtml && <AdText adText={adData.adTextHtml} />}
                {annonseErAktiv && (
                    <ContactPerson contactList={adData.contactList} adId={adData.id} adTitle={adData.title} />
                )}
                {adData.employer && <EmployerDetails employer={adData.employer} />}

                {annonseErAktiv && <ShareAd adData={adData} />}
                <AdDetails adData={adData} />
                {searchResult && searchResult.ads && searchResult.ads.length > 0 && (
                    <SimilarAds searchResult={searchResult} explain={explain} />
                )}
            </Box>
        </Box>
    );
}

export default Ad;
