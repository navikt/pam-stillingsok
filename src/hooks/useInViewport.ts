"use client";

import * as React from "react";

type UseInViewportOptions = {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
};

type UseInViewportResult<T extends Element> = {
    ref: React.RefObject<T>;
    isInView: boolean;
};

export function useInViewport<T extends Element>(options: UseInViewportOptions = {}): UseInViewportResult<T> {
    const { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.1, once = true } = options;

    const ref = React.useRef<T | null>(null);
    const [isInView, setIsInView] = React.useState<boolean>(false);

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

    return { ref: ref as React.RefObject<T>, isInView };
}
