"use client";
import { umamiTrackingAnon } from "@/app/_common/umami/umamiTracking";
import { Button } from "@navikt/ds-react/esm";

export default function Page() {
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
