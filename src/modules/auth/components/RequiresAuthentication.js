import React, { useContext } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { AuthenticationContext, AuthenticationStatus } from "../contexts/AuthenticationProvider";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import "./RequiresAuthentication.css";

function RequiresAuthentication({ children }) {
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
                    Du må logge inn
                </Heading>
                <BodyLong className="LoginRequiredMessage__text">
                    Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                </BodyLong>
                <Button variant="primary" onClick={login}>
                    Logg inn
                </Button>
            </section>
        );
    }
}

export default RequiresAuthentication;
