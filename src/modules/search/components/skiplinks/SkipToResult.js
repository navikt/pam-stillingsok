import React from "react";
import PropTypes from "prop-types";
import "./SkipTo.less";

function SkipToResult({ data }) {
    return (
        <div className="SkipTo SkipTo--vis-treff">
            {data && data.totalAds ? (
                <a href="src/modules/search/components/skiplinks/SkipToResult#resultat" className="link">
                    {`Vis ${data.totalAds} treff`}
                </a>
            ) : (
                <a href="src/modules/search/components/skiplinks/SkipToResult#resultat" className="link">
                    Vis treff
                </a>
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
