import React from "react";
import PropTypes from "prop-types";
import "./SkipTo.css";
import { Link as AkselLink } from "@navikt/ds-react";

function SkipToResult({ data }) {
    return (
        <div className="SkipTo SkipTo--vis-treff">
            {data && data.totalAds ? (
                <AkselLink href="#resultat">{`Vis ${data.totalAds} treff`}</AkselLink>
            ) : (
                <AkselLink href="#resultat">Vis treff</AkselLink>
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
