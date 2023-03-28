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
                    <div className="JobPosting__dl--flex">
                        <dt>Sist endret:</dt>
                        <dd>{formatDate(source.updated, "DD.MM.YYYY")}</dd>
                    </div>
                )}
                {source.medium && (
                    <div className="JobPosting__dl--flex">
                        <dt>Hentet fra:</dt>
                        <dd>{source.medium}</dd>
                    </div>
                )}
                {source.reference && (
                    <div className="JobPosting__dl--flex">
                        <dt>Referanse:</dt>
                        <dd>{source.reference}</dd>
                    </div>
                )}
                {source.id && (
                    <div className="JobPosting__dl--flex">
                        <dt>Stillingsnummer:</dt>
                        <dd>{source.id}</dd>
                    </div>
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
