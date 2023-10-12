import React, { useState } from "react";
import { BodyLong, Button, Heading, Link as AkselLink, VStack } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../environment";
import TermsOfUse from "./contexts/TermsOfUse";

function UserConsentIsRequiredPage() {
    const [showTermsModal, setShowTermModal] = useState(false);

    return (
        <section className="container-small mt-12 mb-12">
            <VStack align="center">
                <Heading level="2" size="medium" className="text-center" spacing>
                    Du har ikke samtykket
                </Heading>
                <BodyLong className="text-center" spacing>
                    Du må samtykke for å kunne lagre søk og favoritter.
                </BodyLong>
                <div className="mb-8">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowTermModal(true);
                        }}
                    >
                        Se samtykke
                    </Button>
                </div>
                <AkselLink as={Link} to={CONTEXT_PATH}>
                    Gå tilbake til ledige stillinger
                </AkselLink>
            </VStack>

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

export default UserConsentIsRequiredPage;
