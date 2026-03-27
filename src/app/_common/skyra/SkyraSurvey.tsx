"use client";

import { Button, Loader, Popover } from "@navikt/ds-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSkyra } from "@/app/_common/hooks/useSkyra";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

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
    const linkRef = useRef<HTMLAnchorElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState(false);

    const status = useSkyra({
        skyraSurveyRef,
        openState,
        setOpenState,
        delayMs: 250,
    });

    const isLoading = status === "loading";

    const anchorEl = asLink ? linkRef.current : buttonRef.current;

    return (
        <>
            {asLink ? (
                <AkselNextLink
                    ref={linkRef}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenState((prev) => !prev);
                    }}
                    aria-expanded={openState}
                >
                    {buttonText}
                </AkselNextLink>
            ) : (
                <Button
                    ref={buttonRef}
                    onClick={() => setOpenState((prev) => !prev)}
                    aria-expanded={openState}
                    variant={buttonVariant}
                    size={buttonSize}
                    className="skyra-link-button"
                >
                    {buttonText}
                </Button>
            )}

            {openState &&
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
