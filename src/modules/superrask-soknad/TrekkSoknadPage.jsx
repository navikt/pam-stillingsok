import React from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import TrekkSoknad from "./components/TrekkSoknad";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

function TrekkSoknadPage({ match }) {
    useDocumentTitle("Trekk søknad");
    useScrollToTop();

    return <TrekkSoknad match={match} />;
}

TrekkSoknadPage.propTypes = {
    match: PropTypes.shape({}),
};

export default TrekkSoknadPage;
