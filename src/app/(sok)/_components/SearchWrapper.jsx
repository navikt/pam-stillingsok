"use client";

import React from "react";
import PropTypes from "prop-types";
import Search from "@/app/(sok)/_components/Search";
import { QueryProvider } from "@/app/(sok)/_components/QueryProvider";

export default function SearchWrapper({ searchResult, aggregations, locations, postcodes, resultsPerPage, errors }) {
    return (
        <QueryProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
                resultsPerPage={resultsPerPage}
                errors={errors}
            />
        </QueryProvider>
    );
}

SearchWrapper.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
