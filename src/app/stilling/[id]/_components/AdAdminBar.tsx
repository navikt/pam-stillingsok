"use client";

import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

import { Alert, Bleed, Box, Button, Heading, Link } from "@navikt/ds-react";
import ActionBar from "@/app/_common/components/ActionBar";
import { BulletListIcon, ClipboardIcon, PauseIcon, PencilIcon } from "@navikt/aksel-icons";
import AlertModal from "@/app/_common/components/modals/AlertModal";
import { StillingDetaljer } from "@/app/lib/stillingSchema";

type PageProps = {
    adData: StillingDetaljer;
    organizationNumber: string | undefined;
};

function AdAdminBar({ adData, organizationNumber }: PageProps): ReactNode {
    const isAdminOfCurrentAd = adData.employer?.orgnr === organizationNumber && organizationNumber !== undefined;
    const [isUnpublished, setIsUnpublished] = useState(adData.status !== "ACTIVE");
    const [isConfirmStopAdModalOpen, setIsConfirmStopAdModalOpen] = useState(false);
    const [copyAdResponseStatus, setCopyAdResponseStatus] = useState("not-fetched");
    const [stopAdResponseStatus, setStopAdResponseStatus] = useState("not-fetched");
    const router = useRouter();

    const HOST = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    const copyAd = async (): Promise<void> => {
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

    const stopAd = async (): Promise<void> => {
        setStopAdResponseStatus("pending");
        try {
            const deleteAdData = await fetch(
                `${HOST}${process.env.STILLINGSREGISTRERING_PATH}/api/stillinger/UUID/${adData.id}/publiser`,
                {
                    credentials: "include",
                    method: "DELETE",
                },
            );

            if (deleteAdData.status === 200) {
                setIsConfirmStopAdModalOpen(false);
                setIsUnpublished(true);
            } else {
                throw Error("error");
            }
        } catch (e) {
            setStopAdResponseStatus("error");
        }
    };

    return (
        <>
            {isAdminOfCurrentAd && !isUnpublished && (
                <ActionBar
                    background="surface-success-subtle"
                    buttons={[
                        <Button
                            as={Link}
                            className="no-underline"
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
                            as={Link}
                            className="no-underline"
                            key={`own-list-${adData.id}`}
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

            {isAdminOfCurrentAd && isUnpublished && (
                <ActionBar
                    background="surface-success-subtle"
                    buttons={[
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
                            as={Link}
                            className="no-underline"
                            key={`own-list-${adData.id}`}
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
            {copyAdResponseStatus === "error" && (
                <Bleed marginInline="full">
                    <Box className="full-width-alert-box">
                        <Alert
                            variant="error"
                            className="container-large"
                            fullWidth
                            role="alert"
                            closeButton
                            onClose={() => {
                                setCopyAdResponseStatus("not-fetched");
                            }}
                        >
                            <div>
                                <Heading level="2" size="xsmall" spacing>
                                    Det oppstod en feil ved kopiering av annonsen
                                </Heading>
                                Vennligst prøv igjen eller last nettsiden på nytt.
                            </div>
                        </Alert>
                    </Box>
                </Bleed>
            )}
            {isConfirmStopAdModalOpen && (
                <AlertModal
                    cancelLabel="Avbryt"
                    confirmLabel="Avpubliser annonsen"
                    error={stopAdResponseStatus === "error"}
                    errorHeading="Det oppstod en feil ved avpublisering av annonse"
                    errorText="Vennligst prøv igjen eller last nettsiden på nytt."
                    id="id"
                    label={adData.title}
                    title="Bekreft at du ønsker å avpublisere annonsen"
                    spinner={stopAdResponseStatus === "pending"}
                    onConfirm={() => {
                        stopAd();
                    }}
                    onCancel={() => {
                        setIsConfirmStopAdModalOpen(false);
                        setStopAdResponseStatus("not-fetched");
                    }}
                >
                    Annonsen vil ikke lenger være synlig i søket og jobbsøkere kan ikke søke på stillingen. Du kan ikke
                    angre dette valget.
                </AlertModal>
            )}
        </>
    );
}

export default AdAdminBar;

AdAdminBar.propTypes = {
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
