import PropTypes from "prop-types";
import React from "react";
import SearchResultsItemDetails from "./SearchResultsItemDetails";
import FavouritesButton from "../../favourites/FavouritesButton";
import "./SearchResultsItem.less";
import getEmployer from "../../../../server/common/getEmployer";

export default function SearchResultItem({ stilling }) {
    return (
        <article aria-label={`${stilling.title}, ${getEmployer(stilling)}`} className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
            <FavouritesButton
                showText={false}
                className="SearchResultItem__favourite"
                id={stilling.uuid}
                stilling={stilling}
            />
        </article>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
