"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

import { Box, Button, Heading, Link, Tag } from "@navikt/ds-react";
import { logStillingVisning } from "@/app/_common/monitoring/amplitude";
import ActionBar from "@/app/_common/components/ActionBar";
import { BulletListIcon, ClipboardIcon, PauseIcon, PencilIcon } from "@navikt/aksel-icons";
import AlertModal from "@/app/_common/components/modals/AlertModal";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";

function Ad({ adData, organizationNumber }) {
    const [currentAdData, setCurrentAdData] = useState(adData);
    const isAdminOfCurrentAd = adData.employer.orgnr === organizationNumber;
    const [isConfirmStopAdModalOpen, setIsConfirmStopAdModalOpen] = useState(false);
    const [copyAdResponseStatus, setCopyAdResponseStatus] = useState("not-fetched");
    const [stopAdResponseStatus, setStopAdResponseStatus] = useState("not-fetched");
    const router = useRouter();

    const HOST = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    // TODO: REMOVE
    console.log("admin", isAdminOfCurrentAd);
    console.log("stop", stopAdResponseStatus);

    const copyAd = async () => {
        setCopyAdResponseStatus("pending");
        try {
            const copy = await fetch(
                `${HOST}${process.env.STILLINGSREGISTRERING_PATH}/api/stillinger/UUID/${adData.id}/copy`,
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
                router.push(`${HOST}${process.env.STILLINGSREGISTRERING_PATH}/rediger/${redirectId}`);
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
            const deleteAdData = await fetch(
                `${HOST}${process.env.STILLINGSREGISTRERING_PATH}/api/stillinger/UUID/${adData.id}/publiser`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );
            console.log("STOPPED POSTING", deleteAdData);
            setStopAdResponseStatus("success");
            setIsConfirmStopAdModalOpen(false);
            setCurrentAdData(deleteAdData);
        } catch (e) {
            setStopAdResponseStatus("error");
        }
    };

    /**
     * Track page view for all ads
     */
    useEffect(() => {
        if (currentAdData && currentAdData.id && currentAdData.title) {
            try {
                logStillingVisning(currentAdData);
            } catch (e) {
                // ignore
            }
        }
    }, [currentAdData]);

    const annonseErAktiv = currentAdData.status === "ACTIVE";

    console.log("ADSTATUS", currentAdData.status);

    return (
        <Box as="article">
            {/* TODO: SET PROPER VALUE */}
            {isAdminOfCurrentAd && (
                <ActionBar
                    background="surface-success-subtle"
                    buttons={[
                        <Button
                            as={Link}
                            className="no-underline"
                            key={`edit-${currentAdData.id}`}
                            role="link"
                            href={`${process.env.STILLINGSREGISTRERING_PATH}/rediger/${currentAdData.id}`}
                            variant="tertiary"
                            icon={<PencilIcon aria-hidden="true" />}
                        >
                            Endre
                        </Button>,
                        <Button
                            key={`unpublish-${currentAdData.id}`}
                            variant="tertiary"
                            icon={<PauseIcon aria-hidden="true" />}
                            onClick={() => {
                                setIsConfirmStopAdModalOpen(true);
                            }}
                        >
                            Avpubliser
                        </Button>,
                        <Button
                            key={`copy-${currentAdData.id}`}
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
                            as={Link}
                            className="no-underline"
                            key={`own-list-${currentAdData.id}`}
                            variant="tertiary"
                            role="link"
                            icon={<BulletListIcon aria-hidden="true" />}
                            href={`${process.env.STILLINGSREGISTRERING_PATH}/stillingsannonser`}
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
                    {currentAdData.title}
                </Heading>
                <Summary adData={currentAdData} />
                {!annonseErAktiv && (
                    <Tag variant="warning-moderate" className="mt-4">
                        Stillingsannonsen er inaktiv.
                    </Tag>
                )}
                <EmploymentDetails adData={currentAdData} />
                {annonseErAktiv && <HowToApply adData={currentAdData} />}
                <AdText adText={currentAdData.adText} />
                {annonseErAktiv && (
                    <ContactPerson
                        contactList={currentAdData.contactList}
                        adId={currentAdData.id}
                        adTitle={currentAdData.title}
                    />
                )}
                <EmployerDetails employer={currentAdData.employer} />
                {annonseErAktiv && <ShareAd adData={currentAdData} />}
                <AdDetails adData={currentAdData} />

                {isConfirmStopAdModalOpen && (
                    <AlertModal
                        cancelLabel="Avbryt"
                        confirmLabel="Avpubliser annonsen"
                        id="id"
                        label={currentAdData.title}
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
