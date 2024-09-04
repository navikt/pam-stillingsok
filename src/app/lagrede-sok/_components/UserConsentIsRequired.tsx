"use client";

import React, { ReactElement, useState } from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
// @ts-expect-error TODO: Add typeinfo for arbeidsplassen-react
import { FigureJugglingShieldWithCheckmark } from "@navikt/arbeidsplassen-react";
import UserConsentModal from "@/app/_common/user/UserConsentModal";
import { useRouter } from "next/navigation";

function UserConsentIsRequired(): ReactElement {
    const [showTermsModal, setShowTermModal] = useState(false);
    const router = useRouter();

    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <FigureJugglingShieldWithCheckmark className="mb-8" />
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
                    onTermsAccepted={() => {
                        router.refresh();
                    }}
                    onClose={() => {
                        setShowTermModal(false);
                    }}
                />
            )}
        </section>
    );
}

export default UserConsentIsRequired;
