import PropTypes from "prop-types";
import React from "react";
import SearchResultsItemDetails from "./SearchResultsItemDetails";
import FavouritesButton from "../../favourites/FavouritesButton";
import "./SearchResultsItem.less";
import getEmployer from "../../../../server/common/getEmployer";
import getWorkLocation from "../../../../server/common/getWorkLocation";

function toLabel(stilling) {
    const fragments = [];
    const location = getWorkLocation(stilling.properties.location, stilling.locationList);
    const employer = getEmployer(stilling);
    if (stilling.title) {
        fragments.push(stilling.title);
    }
    if (stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle) {
        fragments.push(stilling.properties.jobtitle);
    }
    if (employer) {
        fragments.push(employer);
    }
    if (location) {
        fragments.push(location);
    }
    return fragments.join(", ");
}

export default function SearchResultItem({ stilling }) {
    const label = toLabel(stilling);
    return (
        <article aria-label={label} className="SearchResultItem">
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
