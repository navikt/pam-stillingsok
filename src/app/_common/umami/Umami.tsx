"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";

export default function Umami(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track page view on route change
    useEffect(() => {
        umamiTracking();
    }, [pathname, searchParams]);

    return null;
}
