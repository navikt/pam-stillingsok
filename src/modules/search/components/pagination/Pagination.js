import React from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";
import "./Pagination.css";

const Pagination = ({ searchResult, isSearching, query, onLoadMoreClick }) => {
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;

    return (
        <React.Fragment>
            {hasMore && (
                <Button
                    variant="primary"
                    loading={isSearching}
                    className="Pagination__button"
                    onClick={onLoadMoreClick}
                >
                    Last flere resultater
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
