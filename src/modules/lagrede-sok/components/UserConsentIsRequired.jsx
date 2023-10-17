import React, { useState } from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import UserConsentModal from "../../common/user/UserConsentModal";

function UserConsentIsRequired() {
    const [showTermsModal, setShowTermModal] = useState(false);

    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <Heading level="1" size="large" className="text-center" spacing>
                    Du må samtykke for å kunne ta i bruk lagrede søk
                </Heading>
                <BodyLong className="text-center" spacing>
                    Med lagrede søk kan du velge å motta e-postvarsler når det kommer nye treff, eller for å raskere
                    søke neste gang.
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
                <UserConsentModal
                    onClose={() => {
                        setShowTermModal(false);
                    }}
                />
            )}
        </section>
    );
}

export default UserConsentIsRequired;
