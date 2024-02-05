import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Button, HStack } from "@navikt/ds-react";
import { BulletListIcon, EyeIcon, FilesIcon, PauseIcon, PencilIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { CompanyContext } from "../../common/context/CompanyProvider";

function CompanyActionBar({ uuid }) {
    const { organizationNumber } = useContext(CompanyContext);
    const [showActionbar, setShowActionBar] = useState(false);
    const [copyAdResponseStatus, setCopyAdResponseStatus] = useState("not-fetched");
    const [stopAdResponseStatus, setStopAdResponseStatus] = useState("not-fetched");

    async function checkIfAdBelongsToCompany() {
        try {
            const response = await fetch(`/stillingsregistrering/api/stillinger/UUID/${uuid}`);
            setShowActionBar(response.status === 200);
        } catch (err) {
            setShowActionBar(false);
        }
    }

    async function copyAd() {
        setCopyAdResponseStatus("pending");
    }

    const stopAd = async () => {
        if (stopAdResponseStatus) {
            // test
        }
        setStopAdResponseStatus("pending");
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
                            as={Link}
                            to={`/stillingsregistrering/stillingsannonser/rediger/${uuid}`}
                            variant="tertiary"
                            icon={<PencilIcon aria-hidden="true" />}
                        >
                            Endre
                        </Button>

                        <Button variant="tertiary" onClick={stopAd} icon={<PauseIcon aria-hidden="true" />}>
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
                            as={Link}
                            icon={<BulletListIcon aria-hidden="true" />}
                            to="/stillingsregistrering/stillingsannonser"
                        >
                            Gå til dine stillinger
                        </Button>
                    </HStack>
                </HStack>
            </div>
        </Box>
    );
}

CompanyActionBar.propTypes = {
    uuid: PropTypes.string.isRequired,
};

export default CompanyActionBar;
