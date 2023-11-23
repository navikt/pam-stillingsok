import React from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import ReportAd from "./components/ReportAd";

function ReportAdPage({ match }) {
    useDocumentTitle("Rapporter annonse");
    useScrollToTop();

    return <ReportAd id={match.params.id} />;
}

ReportAdPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

export default ReportAdPage;
