"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function UtmHandler() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("utm_source")) {
            const utmSource = params.get("utm_source");
            console.log("UTM Source:", utmSource);

            // Remove the parameter
            params.delete("utm_source");

            // Create new URL
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

            // Replace URL without triggering navigation
            window.history.replaceState({}, "", newUrl);
        }
    }, [pathname, searchParams, router]);

    return null;
}
