import { RefObject, useEffect, useRef, useState } from "react";

export type SkyraStatus = "idle" | "loading" | "ready";

type UseSkyraParams = {
    skyraSurveyRef: RefObject<HTMLElement>;
    openState: boolean;
    setOpenState: (value: boolean) => void;
    delayMs: number;
};

const hasShadowContent = (element: HTMLElement | null): boolean => {
    if (!element) {
        return false;
    }
    if (!element.shadowRoot) {
        return false;
    }
    return element.shadowRoot.childElementCount > 0;
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
            const readyNow = hasShadowContent(element);

            if (readyNow) {
                hasEverBeenReadyRef.current = true;
                setStatus("ready");
            }

            // Ikke lukk hvis den ikke er klar ennå – den kan fortsatt laste.
            initialCheckDoneRef.current = true;
        }, delayMs);

        const observer = new MutationObserver(() => {
            const currentElement = skyraSurveyRef.current;
            const readyNow = hasShadowContent(currentElement);

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
