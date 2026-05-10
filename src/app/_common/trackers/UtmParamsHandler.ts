"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/app/_common/umami";

export function UtmParamsHandler() {
    // TODO: router brukes kun i dep-array som reset-trigger — vurder å fjerne om unødvendig
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.has("utm_source") || params.has("utm_campaign")) {
            const utmSource = params.get("utm_source") || "";
            const utmCampaign = params.get("utm_campaign") || "";

            track("utm", { source: utmSource, campaign: utmCampaign });

            params.delete("utm_source");
            params.delete("utm_campaign");

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

            window.history.replaceState({}, "", newUrl);
        }
    }, [pathname, searchParams, router]);

    return null;
}
