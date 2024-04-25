"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Box, Button, Heading, Tag, Link } from "@navikt/ds-react";
import { logStillingVisning } from "@/app/_common/monitoring/amplitude";
import ActionBar from "@/app/_common/components/ActionBar";
import { PencilIcon } from "@navikt/aksel-icons";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";

function Ad({ adData }) {
    /**
     * Track page view for all ads
     */
    useEffect(() => {
        if (adData && adData.id && adData.title) {
            try {
                logStillingVisning(adData);
            } catch (e) {
                // ignore
            }
        }
    }, [adData]);

    const annonseErAktiv = adData.status === "ACTIVE";

    return (
        <Box as="article" className="container-small" paddingBlock={{ xs: "4 12", md: "10 24" }}>
            <ActionBar
                background="surface-success-subtle"
                buttons={[
                    <Button
                        as={Link}
                        key={`edit-${adData.id}`}
                        role="link"
                        href={`${process.env.STILLINGSREGISTRERING_URL}/rediger/${adData.id}`}
                        variant="tertiary"
                        icon={<PencilIcon aria-hidden="true" />}
                    >
                        Endre
                    </Button>,
                ]}
                title="Dette er din annonse"
                titleIcon="briefcase"
            />
            <Heading level="1" size="xlarge" className="overflow-wrap-anywhere" spacing>
                {adData.title}
            </Heading>
            <Summary adData={adData} />
            {!annonseErAktiv && (
                <Tag variant="warning-moderate" className="mt-4">
                    Stillingsannonsen er inaktiv.
                </Tag>
            )}
            <EmploymentDetails adData={adData} />
            {annonseErAktiv && <HowToApply adData={adData} />}
            <AdText adText={adData.adText} />
            {annonseErAktiv && (
                <ContactPerson contactList={adData.contactList} adId={adData.id} adTitle={adData.title} />
            )}
            <EmployerDetails employer={adData.employer} />
            {annonseErAktiv && <ShareAd adData={adData} />}
            <AdDetails adData={adData} />
        </Box>
    );
}

export default Ad;

Ad.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        contactList: PropTypes.array,
        title: PropTypes.string,
        adText: PropTypes.string,
        employer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
};
