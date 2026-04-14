"use client";

import { Button, Loader, Popover } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";

type SkyraSurveyProps = {
    buttonText: string;
    buttonVariant?: "primary" | "tertiary";
    buttonSize?: "medium" | "small";
    skyraSlug: string;
    asLink?: boolean;
};

export default function SkyraSurvey({
    buttonText,
    skyraSlug,
    buttonVariant = "tertiary",
    buttonSize = "medium",
    asLink = false,
}: SkyraSurveyProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState<boolean>(false);

    const status = useSkyra({
        skyraSurveyRef,
        openState,
        setOpenState,
        delayMs: 250,
    });

    const isLoading = status === "loading";

    const anchorEl = buttonRef.current ?? undefined;

    return (
        <>
            <Button
                ref={buttonRef}
                onClick={() => setOpenState((prev) => !prev)}
                aria-expanded={openState}
                variant={buttonVariant}
                size={buttonSize}
                className={asLink ? "skyra-link-button" : undefined}
            >
                {asLink ? <span className="skyra-link-text">{buttonText}</span> : buttonText}
            </Button>
            {openState &&
                anchorEl &&
                createPortal(
                    <Popover placement="top" open={openState} onClose={() => setOpenState(false)} anchorEl={anchorEl}>
                        <Popover.Content className="skyra-popover-content">
                            {isLoading && <Loader title="Laster undersøkelsen" />}
                            <skyra-survey ref={skyraSurveyRef} slug={skyraSlug} />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
