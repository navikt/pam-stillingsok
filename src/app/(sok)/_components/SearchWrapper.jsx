"use client";

import React from "react";
import PropTypes from "prop-types";
import Search from "@/app/(sok)/_components/Search";
import { SearchStateProvider } from "@/app/(sok)/_components/SearchStateProvider";

export default function SearchWrapper({ searchResult, aggregations, locations, postcodes }) {
    return (
        <SearchStateProvider>
            <Search
                searchResult={searchResult}
                locations={locations}
                aggregations={aggregations}
                postcodes={postcodes}
            />
        </SearchStateProvider>
    );
}

SearchWrapper.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
