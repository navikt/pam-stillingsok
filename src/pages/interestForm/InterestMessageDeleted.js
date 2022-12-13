import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import "./InterestForm.less";

const InterestMessageDeleted = () => {
    useDocumentTitle("Interessmelding slettet");
    useTrackPageview();
    useScrollToTop();

    return (
        <div className="InterestMessageDeleted">
            <h1 className="InterestForm__h1">Din søknad er slettet</h1>
        </div>
    );
};

export default InterestMessageDeleted;
