"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function SkyraRouteHandler(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            window.skyra?.reload?.();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [pathname, searchParams]);

    return null;
}
