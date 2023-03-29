import React from "react";
import "./SkipTo.css";
import { Link as AkselLink } from "@navikt/ds-react";

function SkipToCriteria() {
    return (
        <div className="SkipTo SkipTo--endre-sok">
            <AkselLink href="#sok">Endre søk</AkselLink>
        </div>
    );
}

export default SkipToCriteria;
