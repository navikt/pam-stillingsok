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
};

export default function SkyraSurvey({
    buttonText,
    skyraSlug,
    buttonVariant = "tertiary",
    buttonSize = "medium",
}: SkyraSurveyProps): JSX.Element {
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
    return (
        <>
            <Button
                ref={buttonRef}
                onClick={() => setOpenState((prev) => !prev)}
                aria-expanded={openState}
                variant={buttonVariant}
                size={buttonSize}
            >
                {buttonText}
            </Button>

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
                            <skyra-survey ref={skyraSurveyRef} slug={skyraSlug} />
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
}
