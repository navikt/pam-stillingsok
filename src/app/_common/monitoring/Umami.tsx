"use client";

import Script from "next/script";

export default function Umami(): JSX.Element | null {
    if (process.env.NODE_ENV === "production") {
        return null;
    }

    return (
        <Script
            defer
            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id="1cc70e4f-bb41-4d28-8115-cbbc32bee4d3"
            data-domains="arbeidsplassen.intern.dev.nav.no"
        />
    );
}
