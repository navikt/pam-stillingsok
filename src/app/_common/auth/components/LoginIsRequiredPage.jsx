"use client";

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { EnterIcon } from "@navikt/aksel-icons";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";
import { AuthenticationContext } from "@/app/_common/auth/contexts/AuthenticationProvider";

function LoginIsRequiredPage() {
    const { _, loginAndRedirect } = useContext(AuthenticationContext);

    const onLogin = () => {
        loginAndRedirect();
    };

    return (
        <section className="container-small mt-12 mb-12">
            <VStack align="center">
                <Heading level="1" size="large" spacing className="text-center">
                    Du må logge inn først
                </Heading>
                <BodyLong className="text-center" spacing>
                    Du bruker BankID for å logge inn på <span translate="no">arbeidsplassen.no</span>
                </BodyLong>
                <FigureWithKey className="mb-8" />

                <HStack gap="4">
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLogin}>
                        Logg inn
                    </Button>
                </HStack>
            </VStack>
        </section>
    );
}

export default LoginIsRequiredPage;
