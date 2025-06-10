"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { umamiTracking } from "../umami/umamiTracking";

export function UtmHandler() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("utm_source")) {
            const utmSource = params.get("utm_source") || "";
            const utmCampaign = params.get("utm_campaign") || "";
            console.log("UTM Source:", utmSource);
            umamiTracking("utm", { source: utmSource, campaign: utmCampaign });

            params.delete("utm_source");

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

            window.history.replaceState({}, "", newUrl);
        }
    }, [pathname, searchParams, router]);

    return null;
}
