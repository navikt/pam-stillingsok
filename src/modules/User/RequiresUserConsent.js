import React, { useState } from "react";
import DelayedSpinner from "../../components/DelayedSpinner/DelayedSpinner";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import UserConsentModal from "./UserConsentModal";
import "./RequiresUserConsent.css";
import { HasAcceptedTermsStatus } from "./UserProvider";
import Button from "../../components/Button/Button";

function RequiresUserConsent({ children, hasAcceptedTermsStatus }) {
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
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowTermModal(true);
                        }}
                    >
                        Se samtykke
                    </Button>
                </div>
                <div className="NoUserMessage__buttons">
                    <Link to={CONTEXT_PATH} className="link">
                        Fortsett uten å samtykke
                    </Link>
                </div>

                {showTermsModal && (
                    <UserConsentModal
                        onClose={() => {
                            setShowTermModal(false);
                        }}
                    />
                )}
            </section>
        );
    }
}

export default RequiresUserConsent;
