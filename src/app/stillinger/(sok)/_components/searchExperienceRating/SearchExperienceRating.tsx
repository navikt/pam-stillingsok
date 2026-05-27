"use client";

import { BodyLong, Button, Dialog, HStack, Link, VStack } from "@navikt/ds-react";
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

const SKYRA_SURVEY_URL_test_variant = "https://feedback.skyra.no/s1/VqF3d-siUrxMO2m7ppKNUQ";
const SKYRA_SURVEY_URL_standard_variant = "https://feedback.skyra.no/s1/80LDS-suUrxApa0tBaeZNA";

export function SearchExperienceRating({ searchBoxRef }: SearchExperienceRatingProps) {
    const variant = useExperimentVariant("searchbox-simple-variant");
    const { state, dismiss, complete } = useSearchRatingSurvey({ searchBoxRef });
    const hasRated = useRef(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const SKYRA_SURVEY_URL = variant === "standard" ? SKYRA_SURVEY_URL_standard_variant : SKYRA_SURVEY_URL_test_variant;

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
                                <BodyLong>Fortell gjerne hva som fungerte, eller hva du savnet.</BodyLong>
                                <Link href={SKYRA_SURVEY_URL} target="_blank">
                                    Gi tilbakemelding
                                </Link>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="primary" size="small" onClick={handleClose}>
                                Lukk
                            </Button>
                        </Dialog.Footer>
                    </>
                ) : (
                    <>
                        <Dialog.Header>
                            <Dialog.Title>Hvordan synes du søkefelt og filter virker?</Dialog.Title>
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
