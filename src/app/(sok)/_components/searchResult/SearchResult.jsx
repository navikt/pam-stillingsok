import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "../../../favoritter/_components/FavouritesButton";
import { VStack } from "@navikt/ds-react";

function SearchResult({ searchResult }) {
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);

    /**
     *  Check if we should render ad details for debugging
     */
    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setShowAdDetailsForDebugging(true);
            }
        } catch (err) {
            // ignore
        }
    }, []);

    return (
        <VStack gap="10">
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
        </VStack>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};

export default SearchResult;
