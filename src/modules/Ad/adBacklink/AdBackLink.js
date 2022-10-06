import React, { useContext } from "react";
import { HistoryContext } from "../../../context/HistoryProvider";
import { CONTEXT_PATH } from "../../../environment";
import BackLink from "../../../components/BackLink/BackLink";

function AdBackLink() {
    const { previousLocation, hasHistory } = useContext(HistoryContext);
    const SEARCH_PATH = `${CONTEXT_PATH}`;
    const FAVOURITES_PATH = `${CONTEXT_PATH}/favoritter`;

    if (hasHistory && previousLocation.pathname === SEARCH_PATH) {
        return <BackLink to={SEARCH_PATH + previousLocation.search} text="Tilbake til søkeresultat" />;
    } else if (hasHistory && previousLocation.pathname === FAVOURITES_PATH) {
        return <BackLink to={FAVOURITES_PATH} text="Tilbake til favoritter" />;
    } else {
        return <BackLink to={SEARCH_PATH} text="Ledige stillinger" />;
    }
}

export default AdBackLink;
