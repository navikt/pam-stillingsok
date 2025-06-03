"use client";
import { umamiTrackingAnon } from "@/app/_common/umami/umamiTracking";
import { Button } from "@navikt/ds-react/esm";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        // Track page view when component mounts
        umamiTrackingAnon();
    }, []);
    return (
        <Button
            onClick={() => {
                umamiTrackingAnon("anon-track");
            }}
        >
            Track me (event: "anon-track")
        </Button>
    );
}
