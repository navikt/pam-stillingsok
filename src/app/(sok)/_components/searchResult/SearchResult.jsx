import React, { useEffect, useState } from "react";
import { Pagination, Select } from "@navikt/ds-react";
import PropTypes from "prop-types";
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
        if (query.size) {
            setResultsPerPage(query.size);
            setResultsPerPage(query.size);
        }
        if (query.from) {
            const newPageNumber = Math.floor(query.from / resultsPerPage) + 1;
            setPageState(newPageNumber);
        } else {
            setPageState(1);
        }

        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setShowAdDetailsForDebugging(true);
            }
        } catch (err) {
            // ignore
        }
    });

    const recalculatePagination = (value) => {
        setResultsPerPage(value);
        setTotalPages(Math.ceil(total / value));
        const newPageNumber = Math.floor(query.from / value) + 1;
        setPageState(newPageNumber);
        queryDispatch({
            type: SET_FROM_AND_SIZE,
            value: newPageNumber * value - value,
            size: value,
        });
    };

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
                    <Select
                        label="Antall treff per side"
                        onChange={(e) => {
                            recalculatePagination(e.target.value);
                        }}
                        value={resultsPerPage}
                    >
                        {[25, 100].map((item) => {
                            return (
                                <option value={item} key={`pagi-${item}`}>
                                    {item}
                                </option>
                            );
                        })}
                    </Select>
                    <Pagination
                        page={pageState}
                        onPageChange={(x) => {
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
        from: PropTypes.number,
    }),
    queryDispatch: PropTypes.func.isRequired,
};

export default SearchResult;
