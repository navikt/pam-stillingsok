import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Label, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import { formatDate } from "../../../_common/utils/utils";

export default function AdDetails({ id, source }) {
    return (
        <section className="full-width">
            {source.updated && (
                <BodyShort spacing>
                    <Label as="span">Sist endret:</Label> {formatDate(source.updated)}
                </BodyShort>
            )}
            {source.medium && (
                <BodyShort spacing>
                    <Label as="span">Hentet fra:</Label> {source.medium}
                </BodyShort>
            )}
            {source.reference && (
                <BodyShort spacing>
                    <Label as="span">Referanse:</Label> {source.reference}
                </BodyShort>
            )}
            {source.id && (
                <BodyShort spacing>
                    <Label as="span">Stillingsnummer:</Label> {source.id}
                </BodyShort>
            )}
            <BodyShort>
                <AkselLink as={Link} href={`/rapporter-annonse/${id}`}>
                    Rapporter annonse
                </AkselLink>
            </BodyShort>
        </section>
    );
}

AdDetails.propTypes = {
    source: PropTypes.shape({
        updated: PropTypes.string,
        medium: PropTypes.string,
        reference: PropTypes.string,
        id: PropTypes.number,
    }).isRequired,
    id: PropTypes.string.isRequired,
};
