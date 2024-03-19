import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Label, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import { formatDate } from "@/app/_common/utils/utils";

export default function AdDetails({ adData }) {
    return (
        <section className="full-width">
            {adData.updated && (
                <BodyShort spacing>
                    <Label as="span">Sist endret:</Label> {adData.updated}
                </BodyShort>
            )}
            {adData.medium && (
                <BodyShort spacing>
                    <Label as="span">Hentet fra:</Label> {adData.medium}
                </BodyShort>
            )}
            {adData.reference && (
                <BodyShort spacing>
                    <Label as="span">Referanse:</Label> {adData.reference}
                </BodyShort>
            )}
            {adData.id && (
                <BodyShort spacing>
                    <Label as="span">Stillingsnummer:</Label> {adData.id}
                </BodyShort>
            )}
            <BodyShort>
                <AkselLink as={Link} href={`/rapporter-annonse/${adData.id}`}>
                    Rapporter annonse
                </AkselLink>
            </BodyShort>
        </section>
    );
}
