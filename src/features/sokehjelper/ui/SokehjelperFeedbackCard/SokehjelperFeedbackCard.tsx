"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Box, Heading, HStack, Loader, Popover, VStack } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import styles from "./SokehjelperFeedbackCard.module.css";

const SKYRA_SLUG = "arbeids-og-velferdsetaten-nav/veiviser-ab-test-tilbakemelding";

export default function SokehjelperFeedbackCard() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState<boolean>(false);

    const status = useSkyra({ skyraSurveyRef, openState, setOpenState });
    const anchorEl = buttonRef.current ?? undefined;

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
                                Hei! 👋 Hjalp veiviseren deg i gang?
                            </Heading>
                            <BodyLong>
                                Vi prøver å gjøre det litt enklere å finne jobb. Har du lyst til å fortelle oss hvordan
                                det fungerte for deg?
                            </BodyLong>
                        </VStack>
                        <ArrowRightIcon aria-hidden="true" fontSize="1.5rem" />
                    </HStack>
                </button>
            </Box>
            {openState &&
                anchorEl &&
                createPortal(
                    <Popover placement="top" open={openState} onClose={() => setOpenState(false)} anchorEl={anchorEl}>
                        <Popover.Content className="skyra-popover-content">
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
