import React from "react";
import PropTypes from "prop-types";
import "./SkipTo.less";

function SkipToResult({ total }) {
    return (
        <div className="SkipTo SkipTo--vis-treff">
            <a href="#resultat" className="link">
                Vis {total} treff
            </a>
        </div>
    );
}

SkipToResult.propTypes = {
    total: PropTypes.number.isRequired
};

export default SkipToResult;
