import React from "react";
import PropTypes from "prop-types";
import { Knapp } from "@navikt/arbeidsplassen-knapper";
import "./Pagination.less";

const Pagination = ({ searchResult, isSearching, query, onLoadMoreClick }) => {
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;
    const count = hasMore ? to : total;

    return (
        <React.Fragment>
            {total > 0 && <p className="Pagination__numberOfTotal">{`Viser ${count} av ${total} treff`}</p>}
            {hasMore && (
                <Knapp
                    disabled={isSearching}
                    spinner={isSearching}
                    className="Pagination__button"
                    onClick={onLoadMoreClick}
                >
                    Se flere
                </Knapp>
            )}
        </React.Fragment>
    );
};

Pagination.propTypes = {
    searchResult: PropTypes.shape({
        totalAds: PropTypes.number.isRequired
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    onLoadMoreClick: PropTypes.func.isRequired,
    query: PropTypes.shape({
        from: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired
    }).isRequired
};

export default Pagination;
