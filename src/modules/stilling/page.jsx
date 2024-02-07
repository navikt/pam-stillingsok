import React from "react";
import PropTypes from "prop-types";
import Ad from "../../app/stillinger/stilling/[id]/_components/Ad";
import "../../app/stillinger/stilling/ad.css";
import useRobotsNoIndexMetaTag from "../../app/stillinger/_common/hooks/useRobotsNoIndexMetaTag";
import { STILLINGSOK_URL } from "../../app/stillinger/_common/environment";

function AdPage({ match }) {
    const ad = "hack";
    const error = "hack";

    // todo denne må inn i app/stilling/id/page.jsx
    const shareAdRedirectUrl = `${STILLINGSOK_URL}/stilling/${match.params.id}`;

    // todo denne må inn i generateMetadata i app/stilling/id/page.jsx
    const avoidIndexing = (error && error.statusCode === 404) || (ad && ad._source.status !== "ACTIVE");
    useRobotsNoIndexMetaTag(avoidIndexing);

    return <Ad ad={ad} shareAdRedirectUrl={shareAdRedirectUrl} />;
}

AdPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default AdPage;
