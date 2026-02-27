import { RefObject, useEffect, useRef, useState } from "react";
import { SkyraStatus } from "@/app/_common/skyra/skyraTypes";
import { isSkyraSurveyRendered } from "@/app/_common/skyra/skyraDom";

type UseSkyraParams = {
    skyraSurveyRef: RefObject<HTMLElement | null>;
    openState: boolean;
    setOpenState: (value: boolean) => void;
    delayMs: number;
};

export function useSkyra({ skyraSurveyRef, openState, setOpenState, delayMs }: UseSkyraParams): SkyraStatus {
    const [status, setStatus] = useState<SkyraStatus>("idle");
    const hasEverBeenReadyRef = useRef<boolean>(false);
    const initialCheckDoneRef = useRef<boolean>(false);

    useEffect(() => {
        const element = skyraSurveyRef.current;

        if (!openState) {
            setStatus("idle");
            hasEverBeenReadyRef.current = false;
            initialCheckDoneRef.current = false;
            return;
        }

        setStatus("loading");

        const initialCheckTimeout = window.setTimeout(() => {
            const readyNow = isSkyraSurveyRendered(element);

            if (readyNow) {
                hasEverBeenReadyRef.current = true;
                setStatus("ready");
            }

            initialCheckDoneRef.current = true;
        }, delayMs);

        const observer = new MutationObserver(() => {
            const currentElement = skyraSurveyRef.current;
            const readyNow = isSkyraSurveyRendered(currentElement);

            if (readyNow) {
                hasEverBeenReadyRef.current = true;
                setStatus("ready");
                return;
            }

            // Lukk kun hvis den har vært klar tidligere og nå mister innhold.
            if (initialCheckDoneRef.current && hasEverBeenReadyRef.current) {
                setOpenState(false);
                window.skyra?.reload?.();
            }
        });

        if (element) {
            observer.observe(element, { childList: true, subtree: true, attributes: true });
            if (element.shadowRoot) {
                observer.observe(element.shadowRoot, { childList: true, subtree: true });
            }
        }

        return () => {
            window.clearTimeout(initialCheckTimeout);
            observer.disconnect();
        };
    }, [openState, skyraSurveyRef, setOpenState, delayMs]);

    return status;
}
