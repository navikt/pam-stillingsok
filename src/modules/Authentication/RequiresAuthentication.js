import React from "react";
import Button from "../../components/Button/Button";
import { AuthenticationStatus } from "./AuthenticationProvider";
import Spinner from "../../components/Spinner/Spinner";
import ErrorMessage from "../../components/messages/ErrorMessage";
import "./RequiresAuthentication.less";

function RequiresAuthentication({ children, authenticationStatus, login }) {
    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING
    ) {
        return <Spinner />;
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
