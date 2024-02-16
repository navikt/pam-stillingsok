import React, { useEffect, useState } from "react";
import { Pagination as PaginationOK, Select } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Pagination from "../pagination/Pagination";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "../../../favoritter/_components/FavouritesButton";
import { SET_FROM_AND_SIZE } from "../../_utils/queryReducer";

function SearchResult({ searchResult, query, queryDispatch }) {
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);
    const [pageState, setPageState] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const total = searchResult.totalAds;
    const to = query.from + query.size;
    const hasMore = to < total;

    /**
     *  Check if we should render ad details for debugging
     */
    useEffect(() => {
        setTotalPages(Math.ceil(total / resultsPerPage));

        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setShowAdDetailsForDebugging(true);
            }
        } catch (err) {
            // ignore
        }
    });

    useEffect(() => {
        setTotalPages(Math.ceil(total / resultsPerPage));
        console.log("GOGOGO", resultsPerPage);
        // if (query && query.from) {
        const newPageNumber = Math.floor(query.from / resultsPerPage) + 1;
        setPageState(Math.floor(query.from / resultsPerPage) + 1);
        queryDispatch({
            type: SET_FROM_AND_SIZE,
            value: newPageNumber * resultsPerPage - resultsPerPage,
            size: resultsPerPage,
        });
        // }
    }, [resultsPerPage]);

    return (
        <section className="SearchResult">
            {searchResult.ads &&
                searchResult.ads.map((ad) => (
                    <SearchResultItem
                        key={ad.uuid}
                        ad={ad}
                        favouriteButton={
                            <FavouritesButton
                                useShortText
                                className="SearchResultsItem__favourite-button"
                                stilling={ad}
                                id={ad.uuid}
                                hideText
                                variant="tertiary"
                            />
                        }
                        isDebug={showAdDetailsForDebugging}
                    />
                ))}
            {searchResult.ads && searchResult.ads.length > 0 && (
                <>
                    {console.log("QUERY", query)}
                    {console.log("RESULT", searchResult)}
                    {console.log("DISPATCH", queryDispatch)}
                    <Select
                        label="Antall treff per side"
                        onChange={(e) => {
                            console.log("CHANGE", e.target.value);
                            setResultsPerPage(e.target.value);
                            // recalculatePagination();
                        }}
                    >
                        <option>25</option>
                        <option>100</option>
                    </Select>
                    {/* <Pagination query={query} searchResult={searchResult} queryDispatch={queryDispatch} /> */}
                    <PaginationOK
                        page={pageState}
                        onPageChange={(x) => {
                            console.log("go change");
                            queryDispatch({
                                type: SET_FROM_AND_SIZE,
                                value: x * resultsPerPage - resultsPerPage,
                                size: resultsPerPage,
                            });
                            setPageState(x);
                        }}
                        count={totalPages}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </>
            )}
        </section>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    query: PropTypes.shape({
        from: PropTypes.string,
    }),
    queryDispatch: PropTypes.func.isRequired,
};

export default SearchResult;
