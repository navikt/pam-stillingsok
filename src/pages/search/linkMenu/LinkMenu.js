import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../environment";
import "./LinkMenu.less";

function LinkMenu() {
    return (
        <nav className="LinkMenu" aria-label="Ditt innhold">
            <Link to={`${CONTEXT_PATH}/favoritter`} className="link LinkMenu__favourites-link">
                Favoritter
            </Link>
            <Link to={`${CONTEXT_PATH}/lagrede-sok`} className="link LinkMenu__saved-search-link">
                Lagrede søk
            </Link>
        </nav>
    );
}

export default LinkMenu;
