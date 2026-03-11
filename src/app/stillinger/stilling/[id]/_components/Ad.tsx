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
import { ViewportEventTracker } from "@/app/_common/tracking/ViewportEventTracker";
import { useFlowId } from "@/app/_common/tracking/useFlowId";
import { useEngagementTimer } from "@/app/_common/tracking/useEngagementTimer";

type PageProps = {
    adData: AdDTO;
    organizationNumber?: string | undefined;
};
function Ad({ adData, organizationNumber }: PageProps): ReactNode {
    const annonseErAktiv = adData?.status === "ACTIVE";
    const flowId = useFlowId();

    useEngagementTimer({
        eventName: "tid på stilling",
        resetKey: `${adData.id}`,
        getPayload: ({ tidTotalMs, tidAktivMs }) => {
            return {
                flowId,
                adId: adData.id,
                tidTotalMs,
                tidAktivMs,
            };
        },
    });

    return (
        <>
            <AdAdminBar adData={adData} organizationNumber={organizationNumber} />

            <Box paddingBlock={{ xs: "space-16 space-48", md: "space-40 space-64" }}>
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
                    getPayload={({ timeOnPageMs }) => {
                        return {
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
                {/*    {searchResult && searchResult.ads && searchResult.ads.length > 0 && (
                    <SimilarAds searchResult={searchResult} explain={explain} />
                )}*/}
            </Box>
        </>
    );
}

export default Ad;
