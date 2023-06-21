import React from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import WithdrawApplication from "./components/WithdrawApplication";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function WithdrawApplicationPage({ match }) {
    useDocumentTitle("Trekk søknad");
    useScrollToTop();

    return <WithdrawApplication match={match} />;
}

WithdrawApplicationPage.propTypes = {
    match: PropTypes.shape({}),
};

export default WithdrawApplicationPage;
