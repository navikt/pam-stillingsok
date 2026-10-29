"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { WavingFigureRed } from "@navikt/arbeidsplassen-react";
import { BodyLong, BodyShort, Box, Heading, HStack, Loader, Popover, VStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import styles from "./SkyraSurveyBanner.module.css";

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

    const wasOpenRef = useRef(false);

    // Flytter automatisk tastaturfokus inn i popoveren, og gjenoppretter det hvis undersøkelsen lukker seg selv
    useEffect(() => {
        if (openState) {
            if (popoverContentRef.current) {
                popoverContentRef.current.focus({ preventScroll: true });
            }
        } else if (wasOpenRef.current) {
            if (document.activeElement === document.body || !document.activeElement) {
                buttonRef.current?.focus({ preventScroll: true });
            }
        }
        wasOpenRef.current = openState;
    }, [openState]);

    return (
        <>
            <Box asChild paddingBlock="space-56" paddingInline={{ xs: "space-16", lg: "space-80 space-64" }}>
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={() => setOpenState((prev) => !prev)}
                    aria-expanded={openState}
                    aria-label="Hjelp oss å bli bedre! Svar på undersøkelsen"
                    className={`bg-brand-peach-subtle box-link full-width ${styles.banner}`}
                >
                    <HStack justify="space-between" align="center" gap="space-24">
                        <VStack gap="space-16" align="start">
                            <VStack align="start">
                                <Heading size="large" spacing as="span">
                                    Hva synes du om arbeidsplassen.no?
                                </Heading>
                                <BodyLong size="large">
                                    Er det noe du liker, savner eller synes er vanskelig? Svarene dine er helt anonyme.
                                </BodyLong>
                            </VStack>
                            <HStack align="center">
                                Gi tilbakemelding
                                <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                            </HStack>
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
