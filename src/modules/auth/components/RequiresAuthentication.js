import React, { useContext } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { AuthenticationContext, AuthenticationStatus } from "../contexts/AuthenticationProvider";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import LoginBubble from "../../../common/components/icons/LoginBubble";
import "./RequiresAuthentication.css";

function RequiresAuthentication({ children, onCancel }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);

    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING
    ) {
        return <DelayedSpinner />;
    } else if (authenticationStatus === AuthenticationStatus.FAILURE) {
        return <ErrorMessage />;
    } else if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        return children;
    } else {
        return (
            <section className="LoginRequiredMessage">
                <Heading level="2" size="large" spacing>
                    Du må først logge inn
                </Heading>
                <BodyLong className="LoginRequiredMessage__text">
                    Du bruker BankID for å logge inn på arbeidsplassen.no
                </BodyLong>
                <LoginBubble />
                <div className="login-buttons-wrapper">
                    <Button variant="primary" onClick={login}>
                        Logg inn
                    </Button>
                    
                    {onCancel && (
                        <Button variant="secondary" onClick={onCancel}>
                            Avbryt
                        </Button>
                    )}
                    
                </div>
            </section>
        );
    }
}

export default RequiresAuthentication;
