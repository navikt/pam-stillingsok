import React from "react";
import { AuthenticationStatus } from "./AuthenticationProvider";
import DelayedSpinner from "../../components/DelayedSpinner/DelayedSpinner";
import ErrorMessage from "../../components/Messages/ErrorMessage";
import "./RequiresAuthentication.css";
import { Button } from "@navikt/ds-react";

function RequiresAuthentication({ children, authenticationStatus, login }) {
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
                <h2 className="LoginRequiredMessage__h2">Du må logge inn</h2>
                <p className="LoginRequiredMessage__text">
                    Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                </p>
                <Button variant="primary" onClick={login}>
                    Logg inn
                </Button>
            </section>
        );
    }
}

export default RequiresAuthentication;
