import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import "./InterestForm.less";

const InterestMessageDeleteFailed = () => {
    useDocumentTitle("Interessmelding, sletting feilet");
    useTrackPageview();
    useScrollToTop();

    return (
        <div className="InterestMessageDeleted">
            <h1 className="InterestForm__h1">Det oppsto en feil</h1>
            <p className="InterestForm__p">Klarte ikke å slette søknaden din. Forsøk igjen</p>
        </div>
    );
};

export default InterestMessageDeleteFailed;
