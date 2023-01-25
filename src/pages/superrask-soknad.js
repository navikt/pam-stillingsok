import React from "react";
import useScrollToTop from "../common/hooks/useScrollToTop";
import SuperraskSoknad from "../modules/superrask-soknad/components/SuperraskSoknad";
import useDocumentTitle from "../common/hooks/useDocumentTitle";

function SuperraskSoknadPage({ match }) {
    useDocumentTitle("Superrask søknad");
    useScrollToTop();

    return <SuperraskSoknad match={match}/>;
}

export default SuperraskSoknadPage;
