"use client";

import React from "react";
import PropTypes from "prop-types";
import { LoginPage } from "@navikt/arbeidsplassen-react";

function LoginIsRequiredPage({ redirect = "/stillinger" }) {
    return (
        <section className="container-small mt-12 mb-12">
            <LoginPage link={`/stillinger/oauth2/login?redirect=${redirect}`} />
        </section>
    );
}

LoginIsRequiredPage.propTypes = {
    redirect: PropTypes.string,
};

export default LoginIsRequiredPage;
