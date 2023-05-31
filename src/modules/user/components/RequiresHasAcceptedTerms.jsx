import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Heading, Link as AkselLink } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import { CONTEXT_PATH } from "../../../common/environment";
import TermsOfUse from "../contexts/TermsOfUse";
import "./RequiresUser.css";
import { HasAcceptedTermsStatus, UserContext } from "../contexts/UserProvider";

function RequiresHasAcceptedTerms({ children }) {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [showTermsModal, setShowTermModal] = useState(false);

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_FETCHED) {
        return <DelayedSpinner />;
    }

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED) {
        return children;
    }

    return (
        <section className="NoUserMessage">
            <Heading level="2" size="medium" className="NoUserMessage__h2">
                Du har ikke samtykket
            </Heading>
            <BodyLong className="NoUserMessage__text">Du må samtykke for å kunne lagre søk og favoritter.</BodyLong>
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
                <AkselLink as={Link} to={CONTEXT_PATH}>
                    Fortsett uten å samtykke
                </AkselLink>
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

RequiresHasAcceptedTerms.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default RequiresHasAcceptedTerms;
