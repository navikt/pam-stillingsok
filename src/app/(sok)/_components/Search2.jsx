"use client";

import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Heading, HGrid, Hide, HStack, Show, Stack, VStack } from "@navikt/ds-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryReducer from "../_utils/queryReducer";
import { isSearchQueryEmpty, SEARCH_CHUNK_SIZE, stringifyQuery, toBrowserQuery } from "../_utils/query";
import SearchResult from "./searchResult/SearchResult";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import logAmplitudeEvent from "../../_common/monitoring/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";
import SearchBox from "./searchBox/SearchBox";
import SearchPagination from "./searchResult/SearchPagination";

export default function Search({ query, searchResult, aggregations, locations }) {
    return (
        <div>
            <h1>tester compoenent som mottar props. {searchResult.ads.length} stillinger</h1>
        </div>
    );
}

Search.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    query: PropTypes.shape({}),
};
