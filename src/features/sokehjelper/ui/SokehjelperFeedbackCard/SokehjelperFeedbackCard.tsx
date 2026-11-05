"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Box, Heading, HStack, Loader, Popover, VStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import styles from "./SokehjelperFeedbackCard.module.css";

const SKYRA_SLUG = "arbeids-og-velferdsetaten-nav/veiviser-ab-test-tilbakemelding";

export default function SokehjelperFeedbackCard() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);
    const [openState, setOpenState] = useState<boolean>(false);

    const status = useSkyra({ skyraSurveyRef, openState, setOpenState });
    const anchorEl = buttonRef.current ?? undefined;

    // Flytter fokus inn i popoveren ved åpning, og tilbake til kortet ved lukking
    useEffect(() => {
        if (openState) {
            popoverContentRef.current?.focus({ preventScroll: true });
        } else if (wasOpenRef.current && (document.activeElement === document.body || !document.activeElement)) {
            buttonRef.current?.focus({ preventScroll: true });
        }
        wasOpenRef.current = openState;
    }, [openState]);

    return (
        <>
            <Box asChild padding="space-16" borderRadius="8">
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={() => setOpenState((prev) => !prev)}
                    aria-expanded={openState}
                    className={`${styles.card} bg-brand-peach-subtle`}
                >
                    <HStack justify="space-between" gap="space-16" wrap={false}>
                        <VStack gap="space-2" align="start">
                            <Heading size="small" as="span">
                                Hva synes du om vår nye veiviser? 👋
                            </Heading>
                            <BodyLong>
                                Vi prøver å gjøre det enklere å finne jobb. Har du lyst til å dele din opplevelse med
                                oss?
                            </BodyLong>
                        </VStack>
                        <ArrowRightIcon aria-hidden="true" fontSize="1.5rem" />
                    </HStack>
                </button>
            </Box>
            {openState &&
                anchorEl &&
                createPortal(
                    <Popover
                        placement="top"
                        open={openState}
                        onClose={() => {
                            setOpenState(false);
                            buttonRef.current?.focus({ preventScroll: true });
                        }}
                        anchorEl={anchorEl}
                    >
                        <Popover.Content
                            ref={popoverContentRef}
                            tabIndex={-1}
                            className="skyra-popover-content"
                            style={{ outline: "none" }}
                            onKeyDown={(e) => {
                                // Hindrer at Enter/Mellomrom i skjemaet stenger popoveren
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            {status === "loading" && <Loader title="Laster undersøkelsen" />}
                            {status === "error" && (
                                <BodyShort size="small">Kunne ikke laste undersøkelsen. Prøv igjen senere.</BodyShort>
                            )}
                            <skyra-survey ref={skyraSurveyRef} slug={SKYRA_SLUG} />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
