"use client";

import { BodyLong, BodyShort, Button, Dialog, HStack, Link, VStack } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { track } from "@/app/_common/umami";
import { useExperimentVariant } from "@/app/_experiments/client/ExperimentProvider";
import { setSearchExperienceRatingCookie } from "./searchExperienceCookie";
import { useSearchRatingSurvey } from "./useSearchRatingSurvey";

type SearchExperienceRatingProps = {
    readonly searchBoxRef: React.RefObject<HTMLElement | null>;
};

const EMOJI_OPTIONS = [
    { emoji: "🤮", label: "Veldig dårlig", value: 1 },
    { emoji: "😟", label: "Dårlig", value: 2 },
    { emoji: "😐", label: "Helt greit", value: 3 },
    { emoji: "🙂", label: "Bra", value: 4 },
    { emoji: "😍", label: "Fantastisk", value: 5 },
] as const;

// TODO: Bytt ut med riktig Skyra-lenke når den er klar
const SKYRA_SURVEY_URL = "https://example.com/skyra-survey";

export function SearchExperienceRating({ searchBoxRef }: SearchExperienceRatingProps) {
    const variant = useExperimentVariant("searchbox-simple-variant");
    const { state, dismiss, complete } = useSearchRatingSurvey({ searchBoxRef });
    const hasRated = useRef(false);
    const [showThankYou, setShowThankYou] = useState(false);

    function handleRate(rating: 1 | 2 | 3 | 4 | 5) {
        if (hasRated.current) {
            return;
        }
        hasRated.current = true;

        track("AB - konvertering", {
            experiment: "searchbox-simple-variant",
            konvertering: "rating",
            variant,
            rating,
        });

        setSearchExperienceRatingCookie("rated");
        setShowThankYou(true);
    }

    function handleDismiss() {
        setSearchExperienceRatingCookie("dismissed");
        dismiss();
    }

    function handleClose() {
        complete();
    }

    const isOpen = state === "open";

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && (showThankYou ? handleClose() : handleDismiss())}
            size="small"
        >
            <Dialog.Popup>
                {showThankYou ? (
                    <>
                        <Dialog.Header>
                            <Dialog.Title>🎉 Tusen takk!</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap="space-16">
                                <BodyLong>
                                    Fortell gjerne hva som fungerte, eller hva du savnet. Det kan gjøre det enklere å
                                    finne jobber som passer for deg.
                                </BodyLong>
                                <Link href={SKYRA_SURVEY_URL} target="_blank">
                                    Gi tilbakemelding
                                </Link>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="primary" size="small" onClick={handleClose}>
                                Ferdig
                            </Button>
                        </Dialog.Footer>
                    </>
                ) : (
                    <>
                        <Dialog.Header>
                            <Dialog.Title>Bare et kjapt spørsmål?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap="space-16" align="center">
                                <HStack
                                    gap="space-12"
                                    justify="center"
                                    role="group"
                                    aria-label="Gi en vurdering fra 1 til 5"
                                >
                                    {EMOJI_OPTIONS.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant="tertiary-neutral"
                                            size="medium"
                                            onClick={() => handleRate(option.value)}
                                            aria-label={`${option.label} (${option.value} av 5)`}
                                            icon={option.emoji}
                                        />
                                    ))}
                                </HStack>
                                <HStack justify="space-between" className="w-full">
                                    <BodyShort size="small" textColor="subtle">
                                        Hvordan synes du søkefelt og filter virker?
                                    </BodyShort>
                                </HStack>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.CloseTrigger>
                                <Button variant="tertiary" size="small">
                                    Nei takk, vil ikke stemme
                                </Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Footer>
                    </>
                )}
            </Dialog.Popup>
        </Dialog>
    );
}
