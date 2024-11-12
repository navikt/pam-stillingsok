"use client";

import React from "react";
import { LoginPage } from "@navikt/arbeidsplassen-react";

type LoginIsRequiredPageProps = {
    redirect?: string;
};
const LoginIsRequiredPage = ({ redirect = "/stillinger" }: LoginIsRequiredPageProps) => {
    return (
        <section className="container-small mt-12 mb-12">
            <LoginPage link={`/stillinger/oauth2/login?redirect=${redirect}`} />
        </section>
    );
};

export default LoginIsRequiredPage;
