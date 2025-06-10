"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";

export function UtmParamsHandler() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("utm_source") || params.has("utm_campaign")) {
            const utmSource = params.get("utm_source") || "";
            const utmCampaign = params.get("utm_campaign") || "";

            umamiTracking("utm", { source: utmSource, campaign: utmCampaign });

            params.delete("utm_source");
            params.delete("utm_campaign");

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

            window.history.replaceState({}, "", newUrl);
        }
    }, [pathname, searchParams, router]);

    return null;
}
