"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

import { Box, Button, Heading, Tag, Link } from "@navikt/ds-react";
import { logStillingVisning } from "@/app/_common/monitoring/amplitude";
import ActionBar from "@/app/_common/components/ActionBar";
import { BulletListIcon, ClipboardIcon, PauseIcon, PencilIcon } from "@navikt/aksel-icons";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";
import AlertModal from "@/app/_common/components/modals/AlertModal";

function Ad({ adData, organizationNumber }) {
    const isAdminOfCurrentAd = adData.employer.orgnr === organizationNumber;
    const [isConfirmStopAdModalOpen, setIsConfirmStopAdModalOpen] = useState(false);
    const [copyAdResponseStatus, setCopyAdResponseStatus] = useState("not-fetched");
    const [stopAdResponseStatus, setStopAdResponseStatus] = useState("not-fetched");
    const router = useRouter();

    const copyAd = async () => {
        setCopyAdResponseStatus("pending");
        try {
            const copy = await fetch(
                `${process.env.STILLINGSREGISTRERING_PATH}/api/stillinger/UUID/${adData.id}/copy`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (copy.status === 200) {
                setCopyAdResponseStatus("success");
                const result = await copy.json();
                const redirectId = result.uuid;
                router.push(`${process.env.STILLINGSREGISTRERING_PATH}/rediger/${redirectId}`);
            } else {
                throw Error("error");
            }
        } catch (e) {
            setCopyAdResponseStatus("error");
        }
    };

    const stopAd = async () => {
        setStopAdResponseStatus("pending");
        try {
            // const stoppedJopPosting = await DELETE(`${EndpointEnum.ANNONSE_UUID}${jobPosting.uuid}/publiser`);
            setStopAdResponseStatus("success");
            setIsConfirmStopAdModalOpen(false);
            // setJobPosting(stoppedJopPosting);
        } catch (e) {
            setStopAdResponseStatus("error");
        }
    };

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
        <Box as="article">
            {/* TODO: SET PROPER VALUE */}
            {true && (
                <ActionBar
                    background="surface-success-subtle"
                    buttons={[
                        <Button
                            as={Link}
                            key={`edit-${adData.id}`}
                            role="link"
                            href={`${process.env.STILLINGSREGISTRERING_PATH}/rediger/${adData.id}`}
                            variant="tertiary"
                            icon={<PencilIcon aria-hidden="true" />}
                        >
                            Endre
                        </Button>,
                        <Button
                            key={`unpublish-${adData.id}`}
                            variant="tertiary"
                            icon={<PauseIcon aria-hidden="true" />}
                            onClick={() => {
                                setIsConfirmStopAdModalOpen(true);
                            }}
                        >
                            Avpubliser
                        </Button>,
                        <Button
                            key={`copy-${adData.id}`}
                            variant="tertiary"
                            icon={<ClipboardIcon aria-hidden="true" />}
                            onClick={() => {
                                copyAd();
                            }}
                            loading={copyAdResponseStatus === "pending"}
                        >
                            Kopier som ny
                        </Button>,
                        <Button
                            key={`own-list-${adData.id}`}
                            variant="tertiary"
                            role="link"
                            icon={<BulletListIcon aria-hidden="true" />}
                            href={`${process.env.STILLINGSREGISTRERING_PATH}/stillingsannonser`}
                            loading={copyAdResponseStatus === "pending"}
                        >
                            Gå til dine stillinger
                        </Button>,
                    ]}
                    title="Dette er din annonse"
                    titleIcon="briefcase"
                />
            )}
            <Box className="container-small" paddingBlock={{ xs: "4 12", md: "10 24" }}>
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

                {isConfirmStopAdModalOpen && (
                    <AlertModal
                        cancelLabel="Avbryt"
                        confirmLabel="Avpubliser annonsen"
                        id="id"
                        label={adData.title}
                        title="Bekreft at du ønsker å avpublisere annonsen"
                        onConfirm={() => {
                            stopAd();
                        }}
                        onCancel={() => {
                            setIsConfirmStopAdModalOpen(false);
                        }}
                    >
                        Annonsen vil ikke lenger være synlig i søket og jobbsøkere kan ikke søke på stillingen. Du kan
                        ikke angre dette valget.
                    </AlertModal>
                )}
            </Box>
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
            id: PropTypes.string,
            name: PropTypes.string,
        }),
    }).isRequired,
};
