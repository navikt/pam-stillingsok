"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SkyraRouteHandler(): null {
    const _pathname = usePathname();
    const _searchParams = useSearchParams();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            window.skyra?.reload?.();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);
    return null;
}
