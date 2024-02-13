import React from "react";
import PropTypes from "prop-types";
import { Button, VStack } from "@navikt/ds-react";
import { ArrowUpIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { stringifyQuery, toBrowserQuery } from "../../_utils/query";

function Pagination({ searchResult, query }) {
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;
    const browserQuery = toBrowserQuery(query);
    browserQuery.from = query.from + query.size;
    browserQuery.size = query.size;

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <VStack align="center" className="mt-8 mb-12">
            {hasMore && (
                <Button as={Link} variant="primary" href={`/${stringifyQuery(browserQuery)}`}>
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
