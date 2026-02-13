"use client";

import React, { ReactNode } from "react";
import { Box, Heading, LocalAlert, Tag } from "@navikt/ds-react";
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
import { BodyLong } from "@navikt/ds-react";
import SimilarAds from "@/app/stillinger/stilling/[id]/_components/SimilarAds";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { PageBlock } from "@navikt/ds-react/Page";
import { ViewportEventTracker } from "@/app/_common/tracking/ViewportEventTracker";
import { useEngagementTimer } from "@/app/_common/tracking/useEngagementTimer";
import { useFlowId } from "@/app/_common/tracking/useFlowId";

type PageProps = {
    adData: AdDTO;
    organizationNumber?: string | undefined;
    searchResult?: SimilaritySearchResultData | undefined;
    explain?: boolean;
};
function Ad({ adData, organizationNumber, searchResult, explain = false }: PageProps): ReactNode {
    const annonseErAktiv = adData?.status === "ACTIVE";
    const flowId = useFlowId();

    useEngagementTimer({
        eventName: "tid på stilling",
        resetKey: `${adData.id}-${flowId}`,
        getPayload: ({ tidTotalMs, tidAktivMs, pathName }) => {
            return {
                kontekst: "stilling",
                side: pathName,
                flowId,
                adId: adData.id,
                tidTotalMs,
                tidAktivMs,
            };
        },
    });

    return (
        <PageBlock as="article" width="text" gutters>
            <AdAdminBar adData={adData} organizationNumber={organizationNumber} />

            <Box paddingBlock={{ xs: "space-16 space-48", md: "space-40 space-96" }}>
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
                    <LocalAlert status="warning" className="mb-4">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Problemer med visning av stillingsannonsen</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            <BodyLong>
                                Vi har for tiden problemer med å vise stillingsannonsen. Vi jobber med å løse problemet
                                så raskt som mulig.
                            </BodyLong>
                        </LocalAlert.Content>
                    </LocalAlert>
                )}

                {adData.adTextHtml && <AdText adText={adData.adTextHtml} />}

                <ViewportEventTracker
                    eventName="sett bunnen av annonseteksten"
                    resetKey={adData.id}
                    minTimeOnPageMs={0}
                    getPayload={({ pathname, timeOnPageMs }) => {
                        return {
                            kontekst: "stilling",
                            side: pathname,
                            flowId,
                            adId: adData.id,
                            tidSynligMs: Math.round(timeOnPageMs),
                        };
                    }}
                />
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
        </PageBlock>
    );
}

export default Ad;
