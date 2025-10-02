import { useEffect, useRef } from "react";

declare global {
    interface Window {
        skyra: {
            reload: () => void;
        };
    }
}

type UseSkyraParams = {
    skyraSurveyRef: React.RefObject<HTMLElement>;
    openState: boolean;
    setOpenState: (value: boolean) => void;
    delayMs: number;
};

export function useSkyra({ skyraSurveyRef, openState, setOpenState, delayMs }: UseSkyraParams): void {
    const initialCheckDone = useRef<boolean>(false);

    useEffect(() => {
        if (!skyraSurveyRef.current || !openState) {
            initialCheckDone.current = false;
            return;
        }

        const checkShadowContent = (): boolean => {
            const element = skyraSurveyRef.current;
            return !!(element && element.shadowRoot && element.shadowRoot.childElementCount > 0);
        };

        const initialCheckTimeout = setTimeout(() => {
            const hasShadowContent = checkShadowContent();

            if (!hasShadowContent && openState) {
                setOpenState(false);
            }

            initialCheckDone.current = true;
        }, delayMs);

        const observer = new MutationObserver(() => {
            if (initialCheckDone.current && !checkShadowContent() && openState) {
                setOpenState(false);
                window.skyra.reload();
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
    }, [openState, skyraSurveyRef, setOpenState, delayMs]);
}
