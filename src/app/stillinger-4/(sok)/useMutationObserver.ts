import { useEffect, useRef } from "react";

interface MutationObserverOptions {
    targetId: string;
    onElementFound: (element: Element) => void;
    childNumber?: number;
    observeOptions?: MutationObserverInit;
    once?: boolean;
}

export function useMutationObserver({
    targetId,
    onElementFound,
    childNumber = 2, // default to second child
    observeOptions = { childList: true, subtree: true },
    once = true,
}: MutationObserverOptions) {
    const observerRef = useRef<MutationObserver | null>(null);
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (hasRunRef.current && once) return;

        const callback: MutationCallback = (mutationsList, observer) => {
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            const targetChild = targetElement.children[0];
            if (targetChild) {
                onElementFound(targetChild);
                if (once) {
                    observer.disconnect();
                    hasRunRef.current = true;
                }
            }
        };

        observerRef.current = new MutationObserver(callback);
        observerRef.current.observe(document.body, observeOptions);

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const targetChild = targetElement.children[0];
            if (targetChild) {
                onElementFound(targetChild);
                if (once) {
                    hasRunRef.current = true;
                }
            }
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [targetId, onElementFound, childNumber, observeOptions, once]);
}
