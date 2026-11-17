"use client";

import { useApmRouteTracking } from "@nais/apm/react";
import { usePathname } from "next/navigation";

export default function ApmRouteTracker(): null {
    // Kun pathname: søkeparametre kan inneholde fritekst og skal ikke til delt Loki.
    useApmRouteTracking(usePathname());
    return null;
}
