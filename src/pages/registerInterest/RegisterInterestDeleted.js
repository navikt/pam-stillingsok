import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import "./RegisterInterest.less";

const RegisterInterestDeleted = () => {
    useDocumentTitle("Interessmelding slettet");
    useTrackPageview();
    useScrollToTop();

    return (
        <div className="RegisterInterest__deleted-message">
            <h1 className="RegisterInterest__h1">Din interessemelding er slettet</h1>
        </div>
    );
};

export default RegisterInterestDeleted;
