import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Button, Heading, Label, Stack } from "@navikt/ds-react";
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
                <dl className="ad-description-list">
                    {adData.adNumber && (
                        <div>
                            <dt>
                                <Label as="span">Stillingsnummer</Label>
                            </dt>
                            <dd>
                                <BodyShort spacing>{adData.adNumber}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.updated && (
                        <div>
                            <dt>
                                <Label as="span">Sist endret</Label>
                            </dt>
                            <dd>
                                <BodyShort spacing>{formatDate(adData.updated)}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.medium && (
                        <div>
                            <dt>
                                <Label as="span">Hentet fra</Label>
                            </dt>
                            <dd>
                                <BodyShort spacing>{adData.medium}</BodyShort>
                            </dd>
                        </div>
                    )}
                    {adData.reference && (
                        <div>
                            <dt>
                                <Label as="span">Referanse</Label>
                            </dt>
                            <dd>
                                <BodyShort spacing>{adData.reference}</BodyShort>
                            </dd>
                        </div>
                    )}
                </dl>
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
