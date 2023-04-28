import { useEffect, useLayoutEffect, useState } from "react";
import useDebounce from "./useDebounce";

export default function useRestoreScroll(id, shouldRestore) {
    const [scrollTop, setScrollTop] = useState(undefined);
    const debouncedScrollTop = useDebounce(scrollTop, 100);
    const SESSION_STORAGE_ID = `restore-scroll-${id}`;

    const resetScroll = () => {
        sessionStorage.setItem(SESSION_STORAGE_ID, 0);
    };

    /**
     * Restore previous scroll position
     */
    useLayoutEffect(() => {
        try {
            if (shouldRestore) {
                const storedValue = sessionStorage.getItem(SESSION_STORAGE_ID);
                if (storedValue && parseInt(storedValue, 10) > 0) {
                    window.scrollTo(0, parseInt(storedValue, 10));
                }
            } else {
                window.scrollTo(0, 0);
            }
        } catch (error) {
            // ignore sessionStorage error
        }
    }, [shouldRestore]);

    /**
     * Listen to scroll event, and track current scroll position
     */
    useEffect(() => {
        try {
            if (shouldRestore) {
                function handleScroll() {
                    setScrollTop(Math.round(window.pageYOffset || document.documentElement.scrollTop));
                }

                window.addEventListener("scroll", handleScroll);

                return () => {
                    window.removeEventListener("scroll", handleScroll);
                };
            }
        } catch (error) {
            // ignore sessionStorage error
        }
    }, [shouldRestore]);

    /**
     * Store current scroll position
     */
    useEffect(() => {
        try {
            if (debouncedScrollTop !== undefined) {
                sessionStorage.setItem(SESSION_STORAGE_ID, `${debouncedScrollTop}`);
            }
        } catch (error) {
            // ignore sessionStorage error
        }
    }, [debouncedScrollTop]);

    return { resetScroll };
}
