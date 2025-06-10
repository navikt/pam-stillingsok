"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function UtmHandler() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;

        const params = new URLSearchParams(searchParams.toString());

        if (params.has("utm_source")) {
            const utmSource = params.get("utm_source");
            console.log("UTM Source:", utmSource);

            params.delete("utm_source");

            const newSearch = params.toString();
            const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;

            router.replace(newUrl, {
                scroll: false,
                // shallow: true,
            });

            hasProcessed.current = true;
        }
    }, [pathname, searchParams, router]);

    return null;
}
