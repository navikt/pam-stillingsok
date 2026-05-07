"use client";

import React, { ReactNode } from "react";
import { Box, Heading, Tag } from "@navikt/ds-react";
import AdText from "@/app/stillinger/stilling/[id]/_components/AdText";
import EmployerDetails from "@/app/stillinger/stilling/[id]/_components/EmployerDetails";
import Summary from "@/app/stillinger/stilling/[id]/_components/Summary";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { Alert, BodyLong } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import HowToApplyMuligheter from "@/app/muligheter/mulighet/[id]/_components/HowToApplyMuligheter";
import EmploymentDetailsMuligheter from "@/app/muligheter/mulighet/[id]/_components/EmploymentDetailsMuligheter";
import MulighetDetails from "@/app/muligheter/mulighet/[id]/_components/MulighetDetails";

type MulighetProps = {
    adData: AdDTO;
};

function Mulighet({ adData }: MulighetProps): ReactNode {
    const annonseErAktiv = adData?.status === "ACTIVE";

    return (
        <PageBlock as="article" width="text" gutters>
            <Box paddingBlock={{ xs: "space-16 space-48", md: "space-40 space-96" }}>
                <Heading level="1" size="xlarge" className="overflow-wrap-anywhere" spacing>
                    {adData?.title}
                </Heading>
                <Summary adData={adData} />
                <Tag size="small" data-color="info" variant="moderate">
                    For registrerte jobbsøkere
                </Tag>

                <EmploymentDetailsMuligheter adData={adData} />
                {annonseErAktiv && <HowToApplyMuligheter adData={adData} />}
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

                <MulighetDetails adData={adData} />
            </Box>
        </PageBlock>
    );
}

export default Mulighet;
