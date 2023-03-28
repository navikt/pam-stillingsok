import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Button } from "@navikt/ds-react";
import "./Pagination.css";

const Pagination = ({ searchResult, isSearching, query, onLoadMoreClick }) => {
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;
    const count = hasMore ? to : total;

    return (
        <React.Fragment>
            {total > 0 && (
                <BodyShort className="Pagination__numberOfTotal">{`Viser ${count} av ${total} treff`}</BodyShort>
            )}
            {hasMore && (
                <Button
                    variant="secondary"
                    loading={isSearching}
                    className="Pagination__button"
                    onClick={onLoadMoreClick}
                >
                    Se flere
                </Button>
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
