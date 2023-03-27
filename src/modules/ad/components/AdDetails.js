import React from "react";
import PropTypes from "prop-types";
import { formatDate } from "../../../common/components/utils";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import { Heading } from "@navikt/ds-react";

export default function AdDetails({ id, source }) {
    return (
        <section className="JobPosting__section">
            <Heading level="2" size="medium" spacing>
                Om annonsen
            </Heading>
            <dl className="JobPosting__dl">
                {source.updated && (
                    <React.Fragment>
                        <dt>Sist endret:</dt>
                        <dd>{formatDate(source.updated, "DD.MM.YYYY")}</dd>
                    </React.Fragment>
                )}
                {source.medium && (
                    <React.Fragment>
                        <dt>Hentet fra:</dt>
                        <dd>{source.medium}</dd>
                    </React.Fragment>
                )}
                {source.reference && (
                    <React.Fragment>
                        <dt>Referanse:</dt>
                        <dd>{source.reference}</dd>
                    </React.Fragment>
                )}
                {source.id && (
                    <React.Fragment>
                        <dt>Stillingsnummer:</dt>
                        <dd>{source.id}</dd>
                    </React.Fragment>
                )}
            </dl>
            <Link to={`${CONTEXT_PATH}/rapporter-annonse?uuid=${id}`}>Rapportér annonse</Link>
        </section>
    );
}

AdDetails.propTypes = {
    source: PropTypes.shape({
        updated: PropTypes.string,
        medium: PropTypes.string,
        reference: PropTypes.string,
        id: PropTypes.number
    }).isRequired,
    id: PropTypes.string.isRequired
};
