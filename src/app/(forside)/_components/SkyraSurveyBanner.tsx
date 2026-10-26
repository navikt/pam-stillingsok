"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { WavingFigureRed } from "@navikt/arbeidsplassen-react";
import { BodyLong, BodyShort, Box, Heading, HStack, Loader, Popover, VStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";

export default function SkyraSurveyBanner() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const [openState, setOpenState] = useState<boolean>(false);

    const skyraSlug = "arbeids-og-velferdsetaten-nav/wip-jobbsoking";

    const status = useSkyra({
        skyraSurveyRef,
        openState,
        setOpenState,
    });

    const isLoading = status === "loading";
    const isError = status === "error";

    const anchorEl = buttonRef.current ?? undefined;

    // Flytter automatisk tastaturfokus inn i popoveren uten at siden hopper til toppen
    useEffect(() => {
        if (openState && popoverContentRef.current) {
            popoverContentRef.current.focus({ preventScroll: true });
        }
    }, [openState]);

    return (
        <>
            <Box asChild paddingBlock="space-56" paddingInline={{ xs: "space-16", lg: "space-80 space-64" }}>
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={() => setOpenState((prev) => !prev)}
                    aria-expanded={openState}
                    className="bg-brand-peach-subtle skyra-survey-banner box-link full-width"
                >
                    <HStack justify="space-between" align="center" gap="space-24">
                        <VStack gap="space-16" align="start">
                            <VStack align="start">
                                <Heading size="large" spacing level="2">
                                    Hjelp oss å bli bedre!
                                </Heading>
                                <BodyLong size="large">
                                    Del din mening om arbeidsplassen.no og hjelp oss å forbedre tjenesten for alle.
                                </BodyLong>
                            </VStack>
                            <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                        </VStack>
                        <WavingFigureRed />
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
                            buttonRef.current?.focus({ preventScroll: true }); // Fokus tilbake til banneret ved Esc
                        }}
                        anchorEl={anchorEl}
                    >
                        <Popover.Content
                            ref={popoverContentRef}
                            tabIndex={-1}
                            className="skyra-popover-content"
                            style={{ outline: "none" }}
                            onKeyDown={(e) => {
                                // Hindrer at Enter/Mellomrom inni skjemaet bobler opp og stenger popoveren
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            {isLoading && <Loader title="Laster undersøkelsen" />}
                            {isError && (
                                <BodyShort size="small">Kunne ikke laste undersøkelsen. Prøv igjen senere.</BodyShort>
                            )}
                            <skyra-survey ref={skyraSurveyRef} slug={skyraSlug} />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
