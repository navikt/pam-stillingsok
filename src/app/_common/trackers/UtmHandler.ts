"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UtmHandler() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));

        if (params.has("utm_source")) {
            const utmSource = params.get("utm_source");
            console.log("UTM Source:", utmSource);

            params.delete("utm_source");

            const newSearch = params.toString();
            const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;

            router.replace(newUrl, { scroll: false });
        }
    }, [pathname, searchParams, router]);

    return null;
}
