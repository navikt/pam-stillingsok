import React, { useContext } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { EnterIcon } from "@navikt/aksel-icons";
import { AuthenticationContext, AuthenticationStatus } from "../contexts/AuthenticationProvider";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import LoginBubble from "../../../common/components/icons/LoginBubble";
import "./RequiresAuthentication.css";

function RequiresAuthentication({ children, onCancel, onLogin }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);

    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING
    ) {
        return <DelayedSpinner />;
    }
    if (authenticationStatus === AuthenticationStatus.FAILURE) {
        return <ErrorMessage />;
    }
    if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        return children;
    }
    return (
        <section className="LoginRequiredMessage">
            <Heading level="1" size="large" className="mb-0_5">
                Du må logge inn først
            </Heading>
            <BodyLong className="LoginRequiredMessage__text mb-2">
                Du bruker BankID for å logge inn på <span translate="no">arbeidsplassen.no</span>
            </BodyLong>
            <div className="mb-2">
                <LoginBubble />
            </div>

            <div className="login-buttons-wrapper">
                {onLogin ? (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLogin}>
                        Logg inn
                    </Button>
                ) : (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={login}>
                        Logg inn
                    </Button>
                )}

                {onCancel && (
                    <Button variant="secondary" onClick={onCancel}>
                        Avbryt
                    </Button>
                )}
            </div>
        </section>
    );
}

RequiresAuthentication.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    onCancel: PropTypes.func,
    onLogin: PropTypes.func,
};

export default RequiresAuthentication;
