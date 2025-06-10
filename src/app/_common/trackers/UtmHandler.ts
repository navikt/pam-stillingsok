"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function UtmHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);

        if (params.has("utm_source")) {
            const utmSource = params.get("utm_source");
            console.log("UTM Source:", utmSource);

            params.delete("utm_source");

            const newSearch = params.toString();
            const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
        }
    }, [pathname, searchParams]);

    return null;
}
