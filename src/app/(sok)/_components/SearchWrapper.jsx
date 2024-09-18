"use client";

import React from "react";
import PropTypes from "prop-types";
import Search from "@/app/(sok)/_components/Search";
import { SearchQueryProvider } from "@/app/(sok)/_components/SearchQueryProvider";

export default function SearchWrapper({ searchResult, aggregations, locations, postcodes, resultsPerPage }) {
    return (
        <SearchQueryProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
                resultsPerPage={resultsPerPage}
            />
        </SearchQueryProvider>
    );
}

SearchWrapper.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
