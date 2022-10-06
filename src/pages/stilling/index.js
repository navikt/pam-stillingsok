import React from "react";
import Ad from "../../modules/Ad/Ad";

function AdPage({ match }) {
    const isInternal = match.path.startsWith("/stillinger/intern/");
    const uuid = match.params.uuid;
    return <Ad isInternal={isInternal} uuid={uuid} />;
}

export default AdPage;
