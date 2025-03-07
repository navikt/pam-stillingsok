"use client";

import React, { ReactNode } from "react";
import { Box, Heading, Tag } from "@navikt/ds-react";
import DebugAd from "@/app/stillinger/stilling/[id]/_components/DebugAd";
import { StillingDetaljer } from "@/app/stillinger/lib/stillingSchema";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";
import AdAdminBar from "./AdAdminBar";

type PageProps = {
    adData: StillingDetaljer;
    organizationNumber?: string | undefined;
};
function Ad({ adData, organizationNumber }: PageProps): ReactNode {
    const annonseErAktiv = adData?.status === "ACTIVE";

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
                {adData.adText && <AdText adText={adData.adText} />}

                {annonseErAktiv && (
                    <ContactPerson contactList={adData.contactList} adId={adData.id} adTitle={adData.title} />
                )}
                {adData.employer && <EmployerDetails employer={adData.employer} />}

                {annonseErAktiv && <ShareAd adData={adData} />}
                <AdDetails adData={adData} />

                <DebugAd adData={adData} />
            </Box>
        </Box>
    );
}

export default Ad;
