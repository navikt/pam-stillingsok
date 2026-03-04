"use client";
import { Loader, Popover } from "@navikt/ds-react";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import styles from "./skyraSurveyMuligheter.module.css";
import { cn } from "@/app/_common/utils/cn";

export default function SkyraSurveyMuligheter() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState<boolean>(false);

    const status = useSkyra({
        skyraSurveyRef,
        openState,
        setOpenState,
        delayMs: 250,
    });

    const isLoading = status === "loading";
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

            {/* TODO: LAG NY SKYRA OM VI SKAL HA SKYRA */}
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
                            <skyra-survey ref={skyraSurveyRef} slug="arbeids-og-velferdsetaten-nav/muligheter-test" />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
