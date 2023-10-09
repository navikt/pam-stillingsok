import React from "react";
import DelayedSpinner from "../../../../common/components/spinner/DelayedSpinner";

function SearchLoading() {
    return (
        <div className="SearchLoading">
            <DelayedSpinner />
        </div>
    );
}

export default SearchLoading;
