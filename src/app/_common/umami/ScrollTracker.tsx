"use client";

import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/app/_common/umami/track";

/**
 * Fjerner bruk av denne intill videre. ikke optimalt å kjøre denne på hver eneste side
 * og denne målingen er egentlig litt upresis.
 * Det er bedre å bruke en IntersectionObserver for å tracke når brukeren har scrollet til bunnen av siden
 * @constructor
 */
const ScrollTracker: FC = () => {
    const [tracked, setTracked] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = (): void => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrolled = (scrollTop + windowHeight) / docHeight;

            if (scrolled >= 0.8 && !tracked) {
                const pageTitle: string = document.title;

                track("Scrolled 80%", {
                    page: pathname,
                    title: pageTitle,
                });

                setTracked(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [tracked, pathname]);

    useEffect(() => {
        setTracked(false);
    }, [pathname]);

    return null;
};

export default ScrollTracker;
