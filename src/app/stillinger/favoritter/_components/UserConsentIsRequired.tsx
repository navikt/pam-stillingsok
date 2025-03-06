"use client";

import React, { useState } from "react";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { FigureJugglingShieldWithCheckmark } from "@navikt/arbeidsplassen-react";
import { useRouter } from "next/navigation";
import UserConsentModal from "@/app/stillinger/_common/user/UserConsentModal";

function UserConsentIsRequired(): JSX.Element {
    const [showTermsModal, setShowTermModal] = useState<boolean>(false); // Specify state type
    const router = useRouter();

    return (
        <section className="container-small mt-16 mb-16">
            <VStack align="center">
                <FigureJugglingShieldWithCheckmark className="mb-8" />

                <Heading level="1" size="large" className="text-center" spacing>
                    Du må samtykke for å kunne ta i bruk favoritter
                </Heading>
                <BodyLong className="text-center" spacing>
                    Har du ikke tid til å lese annonsen akkurat nå, eller lyst til å søke senere når du kommer hjem? Med
                    favoritter finner du raskt tilbake til annonsen.
                </BodyLong>
                <Button
                    variant="primary"
                    onClick={() => setShowTermModal(true)} // Simplified arrow function
                >
                    Se samtykke
                </Button>
            </VStack>

            {showTermsModal && (
                <UserConsentModal
                    onTermsAccepted={() => router.refresh()} // Simplified arrow function
                    onClose={() => setShowTermModal(false)} // Simplified arrow function
                />
            )}
        </section>
    );
}

export default UserConsentIsRequired;
