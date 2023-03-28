import React, { useContext } from "react";
import { HistoryContext } from "../../../common/context/HistoryProvider";
import { CONTEXT_PATH } from "../../../common/environment";
import BackLink from "../../../common/components/backlink/BackLink";

function AdBackLink() {
    const { previousLocation, hasHistory } = useContext(HistoryContext);
    const SEARCH_PATH = `${CONTEXT_PATH}`;
    const FAVOURITES_PATH = `${CONTEXT_PATH}/favoritter`;

    if (hasHistory && previousLocation.pathname === SEARCH_PATH) {
        return <BackLink to={SEARCH_PATH + previousLocation.search} text="Tilbake til søket" />;
    } else if (hasHistory && previousLocation.pathname === FAVOURITES_PATH) {
        return <BackLink to={FAVOURITES_PATH} text="Tilbake til favoritter" />;
    } else {
        return <BackLink to={SEARCH_PATH} text="Ledige stillinger" />;
    }
}

export default AdBackLink;
