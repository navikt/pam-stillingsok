import React from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import Ad from "./components/Ad";

function AdPage({ match }) {
    useScrollToTop();

    return <Ad match={match} />;
}

AdPage.propTypes = {
    match: PropTypes.shape({}),
};

export default AdPage;
