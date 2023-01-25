import React from "react";
import useScrollToTop from "../common/hooks/useScrollToTop";
import Ad from "../modules/ad/components/Ad";

function AdPage({ match }) {
    useScrollToTop();

    return <Ad match={match} />;
}

export default AdPage;
