"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SkyraRouteHandler(): null {
    // TODO: Vurder om pathname/searchParams fortsatt er nødvendige som reset-triggers for skyra.reload()
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
