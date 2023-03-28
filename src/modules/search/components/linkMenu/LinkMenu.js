import React from "react";
import { Link } from "react-router-dom";
import { Link as AkselLink } from "@navikt/ds-react";
import { CONTEXT_PATH } from "../../../../common/environment";
import "./LinkMenu.css";

function LinkMenu() {
    return (
        <nav className="LinkMenu">
            <AkselLink as={Link} to={`${CONTEXT_PATH}/favoritter`} className="LinkMenu__favourites-link">
                Favoritter
            </AkselLink>
            <AkselLink as={Link} to={`${CONTEXT_PATH}/lagrede-sok`} className="LinkMenu__saved-search-link">
                Lagrede søk
            </AkselLink>
        </nav>
    );
}

export default LinkMenu;
