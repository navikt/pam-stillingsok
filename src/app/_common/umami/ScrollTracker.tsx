"use client";

import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

                if (window.umami) {
                    window.umami.track("Scrolled 80%", {
                        page: pathname,
                        title: pageTitle,
                    });
                }
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
