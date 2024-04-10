import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Button, Heading, HGrid, Label, Stack } from "@navikt/ds-react";
import Link from "next/link";
import { formatDate } from "@/app/_common/utils/utils";
import ShareAd from "@/app/stilling/[id]/_components/ShareAd";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

export default function AdDetails({ adData }) {
    return (
        <section className="full-width">
            <Stack
                gap="5"
                direction={{ xs: "column", sm: "row" }}
                align={{ xs: "start", sm: "center" }}
                justify="space-between"
            >
                <Heading level="2" size="large">
                    Annonsedata
                </Heading>
                <Button
                    className="report-ad-button"
                    as={Link}
                    href={`/rapporter-annonse/${adData.id}`}
                    variant="tertiary"
                    icon={<ExclamationmarkTriangleIcon aria-hidden />}
                >
                    Rapporter annonse
                </Button>
                <HGrid className="ad-details" gap="6" columns={{ xs: 1, sm: 2 }}>
                    {adData.adNumber && (
                        <div>
                            <Label as="span">Stillingsnummer</Label>
                            <BodyShort spacing>{adData.adNumber}</BodyShort>
                        </div>
                    )}
                    {adData.updated && (
                        <div>
                            <Label as="span">Sist endret</Label>
                            <BodyShort spacing>{formatDate(adData.updated)}</BodyShort>
                        </div>
                    )}
                    {adData.medium && (
                        <div>
                            <Label as="span">Hentet fra</Label>
                            <BodyShort spacing>{adData.medium}</BodyShort>
                        </div>
                    )}
                    {adData.reference && (
                        <div>
                            <Label as="span">Referanse</Label>
                            <BodyShort spacing>{adData.reference}</BodyShort>
                        </div>
                    )}
                </HGrid>
            </Stack>
        </section>
    );
}
ShareAd.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        updated: PropTypes.string,
        medium: PropTypes.string,
        reference: PropTypes.string,
        adNumber: PropTypes.string,
    }).isRequired,
};
