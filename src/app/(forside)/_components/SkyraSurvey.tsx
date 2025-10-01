"use client";
import { Button, Popover } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SkyraSurveyProps = {
    buttonText: string;
    skyraSlug: string;
};

const SkyraSurvey = ({ buttonText, skyraSlug }: SkyraSurveyProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        if (!skyraSurveyRef.current || !openState) {
            setInitialCheckDone(false);
            return;
        }

        const checkShadowContent = () => {
            const element = skyraSurveyRef.current;
            if (element && element.shadowRoot && element.shadowRoot.childElementCount > 0) {
                return true;
            }
            return false;
        };

        const initialCheckTimeout = setTimeout(() => {
            const hasShadowContent = checkShadowContent();

            if (!hasShadowContent && openState) {
                setOpenState(false);
            }

            setInitialCheckDone(true);
        }, 250);

        const observer = new MutationObserver(() => {
            if (initialCheckDone && !checkShadowContent() && openState) {
                setOpenState(false);
                window.location.reload();
            }
        });

        if (skyraSurveyRef.current) {
            observer.observe(skyraSurveyRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
            });

            if (skyraSurveyRef.current.shadowRoot) {
                observer.observe(skyraSurveyRef.current.shadowRoot, {
                    childList: true,
                    subtree: true,
                });
            }
        }

        return () => {
            clearTimeout(initialCheckTimeout);
            observer.disconnect();
        };
    }, [openState, initialCheckDone]);

    return (
        <>
            <Button
                ref={buttonRef}
                onClick={() => {
                    setOpenState(!openState);
                }}
                aria-expanded={openState}
                variant="tertiary"
            >
                {buttonText}
            </Button>

            {openState &&
                createPortal(
                    <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
                        <Popover.Content className="skyra-popover-content">
                            <div>
                                {/* @ts-expect-error Ikke typet */}
                                <skyra-survey ref={skyraSurveyRef} slug={skyraSlug}>
                                    {/* @ts-expect-error Ikke typet */}
                                </skyra-survey>
                            </div>
                        </Popover.Content>
                    </Popover>,
                    document.body,
                )}
        </>
    );
};

export default SkyraSurvey;
