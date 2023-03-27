import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading } from "@navikt/ds-react";

export default function FinnAd({ stilling }) {
    return (
        <section>
            <Heading level="2" size="medium">
                Denne annonsen er hentet fra FINN
            </Heading>
            <BodyLong spacing>Du kan lese hele annonseteksten og søke på stillingen på finn.no</BodyLong>
            {stilling && stilling._source && stilling._source.reference && (
                <BodyLong>
                    <a href={`https://www.finn.no/${stilling._source.reference}`}>Åpne annonsen på FINN</a>
                </BodyLong>
            )}
        </section>
    );
}

FinnAd.defaultProps = {
    stilling: undefined
};

FinnAd.propTypes = {
    stilling: PropTypes.shape({
        _source: PropTypes.shape({
            reference: PropTypes.string
        })
    }).isRequired
};
