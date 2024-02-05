import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Button, HStack } from "@navikt/ds-react";
import { BulletListIcon, EyeIcon, FilesIcon, PauseIcon, PencilIcon } from "@navikt/aksel-icons";
import { CompanyContext } from "../../common/context/CompanyProvider";
import { STILLINGSREGISTRERING_URL } from "../../common/environment";
import ConfirmBeforeUnPublish from "./ConfirmBeforeUnPublish";

function CompanyActionBar({ ad }) {
    const { organizationNumber } = useContext(CompanyContext);
    const [showActionbar, setShowActionBar] = useState(false);
    const [copyAdResponseStatus, setCopyAdResponseStatus] = useState("not-fetched");
    const [stopAdResponseStatus, setStopAdResponseStatus] = useState("not-fetched");
    const [isConfirmStopAdModalOpen, setIsConfirmStopAdModalOpen] = useState(false);

    async function checkIfAdBelongsToCompany() {
        try {
            const response = await fetch(`/stillingsregistrering/api/stillinger/UUID/${ad._id}`);
            setShowActionBar(response.status === 200);
        } catch (err) {
            setShowActionBar(false);
        }
    }

    async function copyAd() {
        setCopyAdResponseStatus("pending");
        try {
            const response = await fetch(`/stillingsregistrering/api/stillinger/UUID/${ad._id}/copy`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            window.location.href = `${STILLINGSREGISTRERING_URL}/rediger/${response.uuid}`;
        } catch (err) {
            setCopyAdResponseStatus("error");
        }
    }

    const stopAd = async () => {
        setStopAdResponseStatus("pending");
        try {
            await fetch(`/stillingsregistrering/api/stillinger/UUID/${ad._id}/publiser`, {
                credentials: "include",
                method: "DELETE",
            });

            setIsConfirmStopAdModalOpen(false);
            setStopAdResponseStatus("success");
        } catch (err) {
            setStopAdResponseStatus("error");
        }
    };

    useEffect(() => {
        checkIfAdBelongsToCompany();
    }, [organizationNumber]);

    if (!showActionbar) {
        return null;
    }

    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4">
            <div className="container-large">
                <HStack gap={{ xs: "3", md: "3" }} align="center" justify="space-between">
                    <div>
                        <HStack gap="3" align="center">
                            <EyeIcon aria-hidden="true" height="1.5em" width="1.5em" />
                            <BodyShort weight="semibold">Dette er din annonse</BodyShort>
                        </HStack>
                    </div>
                    <HStack gap="2">
                        <Button
                            as="a"
                            href={`/stillingsregistrering/rediger/${ad._id}`}
                            variant="tertiary"
                            icon={<PencilIcon aria-hidden="true" />}
                        >
                            Endre
                        </Button>

                        <Button
                            variant="tertiary"
                            onClick={() => {
                                setIsConfirmStopAdModalOpen(true);
                            }}
                            icon={<PauseIcon aria-hidden="true" />}
                        >
                            Avpubliser
                        </Button>
                        <Button
                            variant="tertiary"
                            icon={<FilesIcon aria-hidden="true" />}
                            onClick={() => {
                                copyAd();
                            }}
                            loading={copyAdResponseStatus === "pending"}
                        >
                            Kopier som ny
                        </Button>
                        <Button
                            variant="tertiary"
                            as="a"
                            icon={<BulletListIcon aria-hidden="true" />}
                            href="/stillingsregistrering/stillingsannonser"
                        >
                            Gå til dine stillinger
                        </Button>
                    </HStack>
                </HStack>
            </div>

            {isConfirmStopAdModalOpen && (
                <ConfirmBeforeUnPublish
                    onClose={setIsConfirmStopAdModalOpen}
                    status={stopAdResponseStatus}
                    stilling={ad}
                    stopAd={stopAd}
                />
            )}
        </Box>
    );
}

CompanyActionBar.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
    }).isRequired,
};

export default CompanyActionBar;
