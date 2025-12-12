"use client";

import React from "react";
import { LoginPage } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";

type LoginIsRequiredPageProps = {
    redirect?: string;
};
const LoginIsRequiredPage = ({ redirect = "/stillinger" }: LoginIsRequiredPageProps) => {
    return (
        <PageBlock as="section" width="md" className="mt-12 mb-12">
            <LoginPage link={`/oauth2/login?redirect=${redirect}`} />
        </PageBlock>
    );
};

export default LoginIsRequiredPage;
