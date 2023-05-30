import { useEffect, useLayoutEffect } from "react";

function debounce(fn, delay = 200) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn();
        }, delay);
    };
}

export default function useRestoreScroll(id, shouldRestore) {
    const SESSION_STORAGE_ID = `restore-scroll-${id}`;

    const resetScroll = () => {
        try {
            sessionStorage.setItem(SESSION_STORAGE_ID, 0);
        } catch (error) {
            // ignore sessionStorage error
        }
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
        if (shouldRestore) {
            const handleScroll = debounce(() => {
                try {
                    const scrollTop = Math.round(window.pageYOffset || document.documentElement.scrollTop);
                    sessionStorage.setItem(SESSION_STORAGE_ID, `${scrollTop}`);
                } catch (error) {
                    // ignore sessionStorage error
                }
            });

            window.addEventListener("scroll", handleScroll);

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [shouldRestore]);

    return { resetScroll };
}
