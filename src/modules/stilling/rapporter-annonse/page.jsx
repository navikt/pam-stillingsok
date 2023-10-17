import React, { useContext } from "react";
import PropTypes from "prop-types";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import Loading from "../../loading";
import { AuthenticationContext, AuthenticationStatus } from "../../common/auth/contexts/AuthenticationProvider";
import LoginIsRequiredPage from "../../common/auth/components/LoginIsRequiredPage";
import ReportAd from "./components/ReportAd";

function ReportAdPage({ match }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);

    useDocumentTitle("Rapporter annonse");
    useScrollToTop();

    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING
    ) {
        return <Loading />;
    }

    if (authenticationStatus !== AuthenticationStatus.IS_AUTHENTICATED) {
        return <LoginIsRequiredPage onLogin={login} />;
    }

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
