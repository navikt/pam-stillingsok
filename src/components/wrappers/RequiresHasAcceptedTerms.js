import React, { useState } from "react";
import DelayedSpinner from "../spinner/DelayedSpinner";
import { Hovedknapp } from "@navikt/arbeidsplassen-knapper";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import TermsOfUse from "../modals/TermsOfUse";
import "./RequiresUser.less";
import { HasAcceptedTermsStatus } from "../../context/UserProvider";

function RequiresHasAcceptedTerms({ children, hasAcceptedTermsStatus }) {
    const [showTermsModal, setShowTermModal] = useState(false);

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_FETCHED) {
        return <DelayedSpinner />;
    } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED) {
        return children;
    } else {
        return (
            <section className="NoUserMessage">
                <h2 className="NoUserMessage__h2">Du har ikke samtykket</h2>
                <p className="NoUserMessage__text">Du må samtykke for å kunne lagre søk og favoritter.</p>
                <div className="NoUserMessage__buttons">
                    <Hovedknapp
                        onClick={() => {
                            setShowTermModal(true);
                        }}
                    >
                        Se samtykke
                    </Hovedknapp>
                </div>
                <div className="NoUserMessage__buttons">
                    <Link to={CONTEXT_PATH} className="link">
                        Fortsett uten å samtykke
                    </Link>
                </div>

                {showTermsModal && (
                    <TermsOfUse
                        onClose={() => {
                            setShowTermModal(false);
                        }}
                    />
                )}
            </section>
        );
    }
}

export default RequiresHasAcceptedTerms;
