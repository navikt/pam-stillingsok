import React, { useContext, useState } from "react";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import { Button } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import TermsOfUse from "../contexts/TermsOfUse";
import "./RequiresUser.css";
import { HasAcceptedTermsStatus, UserContext } from "../contexts/UserProvider";

function RequiresHasAcceptedTerms({ children }) {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
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
