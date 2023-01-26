import React from "react";
import "./Feedback.css";

function Feedback() {
    return (
        <div className="InterestFormFeedback">
            <h2 className="InterestForm__h2">Hvordan kan vi forbedre denne tjenesten for deg?</h2>
            <p className="InterestForm__p">
                Vi setter stor pris på dine tilbakemeldinger dersom det er noe du savner eller noe du synes kunne vært
                bedre med denne tjenesten.
            </p>
            <p className="InterestForm__p InterestForm__mb-0">
                <a href="https://surveys.hotjar.com/096eea6f-8509-467b-b627-20b40340d1f8" className="link">
                    Skriv en kort tilbakemelding
                </a>
            </p>
        </div>
    );
}

export default Feedback;
