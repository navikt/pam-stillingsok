import React from "react";
import useScrollToTop from "../common/hooks/useScrollToTop";
import TrekkSoknad from "../modules/superrask-soknad/TrekkSoknad";
import useDocumentTitle from "../common/hooks/useDocumentTitle";

function TrekkSoknadPage({ match }) {
    useDocumentTitle("Trekk søknad");
    useScrollToTop();

    return <TrekkSoknad match={match}/>;
}

export default TrekkSoknadPage;
