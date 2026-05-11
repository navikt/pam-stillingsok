"use client";
import { BodyShort, Loader, Popover } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import { cn } from "@/app/_common/utils/cn";
import styles from "./skyraSurveyMuligheter.module.css";

export default function SkyraSurveyMuligheter() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState<boolean>(false);

    const status = useSkyra({
        skyraSurveyRef,
        openState,
        setOpenState,
    });

    const isLoading = status === "loading";
    const isError = status === "error";
    return (
        <>
            <div
                ref={buttonRef}
                className={cn(styles["muligheter-inline-button"], "mb-4")}
                aria-expanded={openState}
                onClick={() => setOpenState((prev) => !prev)}
            >
                Skriv en kort tilbakemelding
            </div>

            {openState &&
                createPortal(
                    <Popover
                        placement="top"
                        open={openState}
                        onClose={() => setOpenState(false)}
                        anchorEl={buttonRef.current}
                    >
                        <Popover.Content className="skyra-popover-content">
                            {isLoading && <Loader title="Laster undersøkelsen" />}
                            {isError && (
                                <BodyShort size="small">Kunne ikke laste undersøkelsen. Prøv igjen senere.</BodyShort>
                            )}
                            <skyra-survey
                                ref={skyraSurveyRef}
                                slug="arbeids-og-velferdsetaten-nav/tilbakemelding-pa-ds-arbeidsplassen"
                            />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
