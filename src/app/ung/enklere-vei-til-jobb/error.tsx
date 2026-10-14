"use client";

import { BodyLong, Button, Heading, LocalAlert, VStack } from "@navikt/ds-react";
import { LocalAlertContent, LocalAlertHeader, LocalAlertTitle } from "@navikt/ds-react/LocalAlert";
import { PageBlock } from "@navikt/ds-react/Page";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { track } from "@/app/_common/umami";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";

type OnboardingErrorProps = Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
}>;

export default function OnboardingError({ reset }: OnboardingErrorProps) {
    const retry = () => {
        track("Klikk - Enklere vei til jobb", {
            action: "prøv-igjen",
            location: "feilside",
            elementId: "prøv-igjen",
            elementLabel: "Prøv igjen",
        });
        reset();
    };

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <LocalAlert status="error">
                <LocalAlertHeader>
                    <LocalAlertTitle as="div">
                        <Heading level="1" size="medium">
                            Vi kan ikke vise innholdet akkurat nå
                        </Heading>
                    </LocalAlertTitle>
                </LocalAlertHeader>
                <LocalAlertContent>
                    <VStack gap="space-16">
                        <BodyLong>Prøv igjen. Hvis feilen fortsetter, kan du gå tilbake til ung-sida.</BodyLong>
                        <div>
                            <Button type="button" onClick={retry}>
                                Prøv igjen
                            </Button>
                        </div>
                        <AkselNextLink
                            href="/ung"
                            tracking={trackingEvent("Klikk - Enklere vei til jobb", {
                                action: "åpne-lenke",
                                location: "feilside",
                                elementId: "tilbake-til-ung",
                                elementLabel: "Tilbake til ung-sida",
                            })}
                        >
                            Tilbake til ung-sida
                        </AkselNextLink>
                    </VStack>
                </LocalAlertContent>
            </LocalAlert>
        </PageBlock>
    );
}
