"use client";
import { PersonChatIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Modal, Popover } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const GiTilbakemelding = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const skyraSurveyRef = useRef<HTMLElement>(null);
    const [openState, setOpenState] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const open = true;
    const ref = useRef<HTMLDialogElement>(null);

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
                    // ref.current?.showModal();
                }}
                // onClick={() => setOpenState(!openState)}
                aria-expanded={openState}
                variant="tertiary-neutral"
                icon={<PersonChatIcon />}
                className={open ? "w-full text-left justify-start" : ""}
            >
                {open && "Gi tilbakemelding"}
            </Button>

            {openState &&
                createPortal(
                    // <div>
                    //     hei
                    //     {/* @ts-expect-error Ikke typet */}
                    //     <skyra-survey
                    //         ref={skyraSurveyRef}
                    //         className="w-full h-full"
                    //         slug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                    //     >
                    //         {/* @ts-expect-error Ikke typet */}
                    //     </skyra-survey>
                    // </div>,
                    // <dialog open={openState}>
                    //     {/* @ts-expect-error Ikke typet */}
                    //     <skyra-survey
                    //         ref={skyraSurveyRef}
                    //         className="w-full h-full"
                    //         slug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                    //     >
                    //         {/* @ts-expect-error Ikke typet */}
                    //     </skyra-survey>
                    // </dialog>,
                    <Popover open={openState} onClose={() => setOpenState(false)} anchorEl={buttonRef.current}>
                        <Popover.Content className="w-[360px] lol">
                            <div>hei</div>

                            <div>
                                {/* @ts-expect-error Ikke typet */}
                                <skyra-survey
                                    ref={skyraSurveyRef}
                                    className="w-full h-full"
                                    slug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                                >
                                    {/* @ts-expect-error Ikke typet */}
                                </skyra-survey>
                            </div>
                        </Popover.Content>
                    </Popover>,
                    // <div>
                    //     <dialog open={openState}>
                    //         {/* @ts-expect-error Ikke typet */}
                    //         <skyra-survey
                    //             ref={skyraSurveyRef}
                    //             className="w-full h-full"
                    //             slug="arbeids-og-velferdsetaten-nav/test-arbeidsplassen-dev"
                    //         >
                    //             {/* @ts-expect-error Ikke typet */}
                    //         </skyra-survey>
                    //     </dialog>
                    // </div>,
                    document.body,
                )}
        </>
    );
};

export default GiTilbakemelding;
