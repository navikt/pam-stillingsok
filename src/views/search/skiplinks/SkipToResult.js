import React from "react";
import PropTypes from "prop-types";
import "./SkipTo.less";

function SkipToResult({ data }) {
    return (
        <nav className="SkipTo SkipTo--vis-treff">
            {data && data.total && data.total.value ? (
                <a href="#resultat" className="link">
                    Vis {data.total.value} treff
                </a>
            ) : (
                <a href="#resultat" className="link">
                    Vis treff
                </a>
            )}
        </nav>
    );
}

SkipToResult.propTypes = {
    data: PropTypes.shape({
        total: PropTypes.shape({
            value: PropTypes.number
        })
    })
};

export default SkipToResult;
