import React from "react";
import PropTypes from "prop-types";
import "./SkipTo.css";

function SkipToResult({ data }) {
    return (
        <div className="SkipTo SkipTo--vis-treff">
            {data && data.totalAds ? (
                <a href="#resultat">{`Vis ${data.totalAds} treff`}</a>
            ) : (
                <a href="#resultat">Vis treff</a>
            )}
        </div>
    );
}

SkipToResult.propTypes = {
    data: PropTypes.shape({
        totalAds: PropTypes.number
    })
};

export default SkipToResult;
