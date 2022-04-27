import React from "react";
import PropTypes from "prop-types";
import { formatISOString } from "../../../components/utils";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../environment";
import HistoryIcon from "../../../components/icons/HistoryIcon";

export default function AdDetails({ id, source }) {
    return (
        <section className="detail-section">
            <h2 className="detail-section__head">
                <HistoryIcon />
                Om annonsen
            </h2>
            <dl className="dl-flex">
                {source.updated && (
                    <React.Fragment>
                        <dt>Sist endret:</dt>
                        <dd>{formatISOString(source.updated, "DD.MM.YYYY")}</dd>
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
            <Link className={"link"} to={`${CONTEXT_PATH}/rapporter-annonse?uuid=${id}`}>
                Rapportér annonse
            </Link>
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
