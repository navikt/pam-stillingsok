import React from "react";
import "../../app/stillinger/stilling/ad.css";
import useRobotsNoIndexMetaTag from "../../app/_common/hooks/useRobotsNoIndexMetaTag";

function AdPage() {
    const ad = "hack";
    const error = "hack";

    // todo denne må inn i generateMetadata i app/stilling/id/page.jsx
    const avoidIndexing = (error && error.statusCode === 404) || (ad && ad._source.status !== "ACTIVE");
    useRobotsNoIndexMetaTag(avoidIndexing);

    return <div />;
}

export default AdPage;
