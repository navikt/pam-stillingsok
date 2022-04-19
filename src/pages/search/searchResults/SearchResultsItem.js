import PropTypes from "prop-types";
import React from "react";
import SearchResultsItemDetails from "./SearchResultsItemDetails";
import FavouritesButton from "../../favourites/FavouritesButton";
import "./SearchResultsItem.less";

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
            <FavouritesButton
                showText={false}
                className="SearchResultItem__favourite"
                id={stilling.uuid}
                stilling={stilling}
            />
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
