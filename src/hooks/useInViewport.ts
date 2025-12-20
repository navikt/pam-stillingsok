"use client";

import * as React from "react";

type UseInViewportOptions = {
    readonly root?: Element | null;
    readonly rootMargin?: string;
    threshold?: number | number[];
    readonly once?: boolean;
};

type UseInViewportResult<T extends Element> = {
    readonly ref: React.RefObject<T | null>;
    readonly isInView: boolean;
    readonly hasEntered: boolean;
};

export function useInViewport<T extends Element>(options: UseInViewportOptions = {}): UseInViewportResult<T> {
    const { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.1, once = true } = options;

    const ref = React.useRef<T | null>(null);
    const [isInView, setIsInView] = React.useState<boolean>(false);
    const [hasEntered, setHasEntered] = React.useState<boolean>(false);

    React.useEffect(() => {
        const target = ref.current;

        if (!target) {
            return;
        }

        if (typeof window === "undefined") {
            return;
        }

        if (!("IntersectionObserver" in window)) {
            setIsInView(true);
            setHasEntered(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (!entry) {
                    return;
                }

                if (entry.isIntersecting) {
                    setIsInView(true);
                    setHasEntered(true);

                    if (once) {
                        observer.disconnect();
                    }
                } else {
                    if (!once) {
                        setIsInView(false);
                    }
                }
            },
            { root, rootMargin, threshold },
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [once, root, rootMargin, threshold]);

    return { ref, isInView, hasEntered };
}
