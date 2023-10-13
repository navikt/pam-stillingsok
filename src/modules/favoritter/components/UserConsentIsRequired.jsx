import React, { useState } from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import TermsOfUse from "../../common/user/contexts/TermsOfUse";

function UserConsentIsRequired() {
    const [showTermsModal, setShowTermModal] = useState(false);

    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <Heading level="1" size="large" className="text-center" spacing>
                    Du må samtykke for å kunne ta i bruk favoritter
                </Heading>
                <BodyLong className="text-center" spacing>
                    Ikke har tid til å lese annonsen akkurat nå, eller lyst å søke først senere når du kommer hjem? Med
                    favoritter finner du raskt tilbake til annonsen.
                </BodyLong>
                <Button
                    variant="primary"
                    onClick={() => {
                        setShowTermModal(true);
                    }}
                >
                    Se samtykke
                </Button>
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

export default UserConsentIsRequired;
