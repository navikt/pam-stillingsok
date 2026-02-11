"use client";

import React, { ReactNode, useContext } from "react";
import { Box, Heading, Tag } from "@navikt/ds-react";
import AdDetails from "@/app/stillinger/stilling/[id]/_components/AdDetails";
import AdText from "@/app/stillinger/stilling/[id]/_components/AdText";
import EmployerDetails from "@/app/stillinger/stilling/[id]/_components/EmployerDetails";
import Summary from "@/app/stillinger/stilling/[id]/_components/Summary";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { Alert, BodyLong } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import {
    AuthenticationContext,
    MuligheterAccessStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import HowToApplyInternal from "@/app/muligheter/mulighet/[id]/HowToApplyInternal";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import { notFound } from "next/navigation";
import EmploymentDetailsInternal from "@/app/muligheter/mulighet/[id]/EmploymentDetailsInternal";

type MulighetProps = {
    adData: AdDTO;
};

function Mulighet({ adData }: MulighetProps): ReactNode {
    const { muligheterAccessStatus } = useContext(AuthenticationContext);

    if (
        muligheterAccessStatus === MuligheterAccessStatus.NOT_FETCHED ||
        muligheterAccessStatus === MuligheterAccessStatus.IS_FETCHING
    ) {
        return <LoadingPage />;
    } else if (
        muligheterAccessStatus === MuligheterAccessStatus.FAILURE ||
        muligheterAccessStatus === MuligheterAccessStatus.MULIGHETER_NO_ACCESS
    ) {
        notFound();
    }

    const annonseErAktiv = adData?.status === "ACTIVE";

    return (
        <PageBlock as="article" width="text" gutters>
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

                <EmploymentDetailsInternal adData={adData} />
                {annonseErAktiv && <HowToApplyInternal adData={adData} />}
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
                {adData.employer && <EmployerDetails employer={adData.employer} />}

                <AdDetails adData={adData} />
            </Box>
        </PageBlock>
    );
}

export default Mulighet;
