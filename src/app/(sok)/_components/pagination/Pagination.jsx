import React from "react";
import PropTypes from "prop-types";
import { Button, VStack } from "@navikt/ds-react";
import { ArrowUpIcon } from "@navikt/aksel-icons";
import { SET_FROM } from "../../_utils/queryReducer";

function Pagination({ searchResult, query, queryDispatch }) {
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    function loadMoreResults() {
        queryDispatch({ type: SET_FROM, value: query.from + query.size });
    }

    return (
        <VStack align="center" className="mt-8 mb-12">
            {hasMore && (
                <Button variant="primary" onClick={loadMoreResults}>
                    Neste
                </Button>
            )}

            <Button variant="tertiary" onClick={scrollTop} className="mt-6">
                <ArrowUpIcon aria-hidden="true" /> Til toppen
            </Button>
        </VStack>
    );
}

Pagination.propTypes = {
    searchResult: PropTypes.shape({
        totalAds: PropTypes.number.isRequired,
    }).isRequired,
    onLoadMoreClick: PropTypes.func.isRequired,
    query: PropTypes.shape({
        from: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
    }).isRequired,
};

export default Pagination;
