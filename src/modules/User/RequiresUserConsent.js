import React, { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import UserConsentModal from "./UserConsentModal";
import "./RequiresUserConsent.less";
import { HasAcceptedTermsStatus } from "./UserProvider";

function RequiresUserConsent({ children, hasAcceptedTermsStatus }) {
    const [showTermsModal, setShowTermModal] = useState(false);

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_FETCHED) {
        return <Spinner />;
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
