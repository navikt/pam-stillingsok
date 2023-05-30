import React from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import SuperraskSoknad from "./components/SuperraskSoknad";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function SuperraskSoknadPage({ match }) {
    useDocumentTitle("Superrask søknad");
    useScrollToTop();

    return <SuperraskSoknad match={match} />;
}

SuperraskSoknadPage.propTypes = {
    match: PropTypes.shape({}),
};

export default SuperraskSoknadPage;
